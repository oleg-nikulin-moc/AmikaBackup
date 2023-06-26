//this whole operation is sub optimal but we are coming along and attaching logic to the bundle app so dry those tears up
var bundleVariants = [];
var doneWithIntercept = false;
var ts = '';
var bundlePrice = 9999;
var normalPriceofLines = 0;
var disc = 0;
var discAdjusted = 0;
var busy = false;

$(function(){
//$(document).on('ready', function(e){
  $('body').on('click','form.bundle-builder--add-to-cart-form button',function(e){
    var bbdata = JSON.parse($('#bundle-builder-app--bundle--data').html());
    bundlePrice = bbdata.settings.discountValue * 100;
    bundleDiscountType = bbdata.settings.discountType;
    var slider_counter = 1;  //used to handle multi step setup in the app where divs pop in and out as "steps"
    var slider_changing_selector = 'box_slider-' + slider_counter.toString();
    do {
    $('div.product-box.'+slider_changing_selector+' input[name="index"]').each(function(){console.log($(this).val());
       var ps = $('div.product-box.'+slider_changing_selector+' div.product');
          var idx = $(ps).index($(this).closest('div.product'));
          var arr = bbdata.products.filter(function(prod){ return prod.id == bbdata.sections[slider_counter-1].sectionProducts[idx].product; });
          if (arr.length == 0)
            return;
          bundleVariants.push({id:arr[0].variants[0].id,price:arr[0].variants[0].price});
          normalPriceofLines += arr[0].variants[0].price;
      });
      slider_counter++;
      slider_changing_selector = 'box_slider-' + slider_counter.toString();
    } while ($('div.product-box.'+slider_changing_selector+' input[name="index"]').length);

    if (bundleDiscountType == "percentage")
      disc = bundlePrice/100;
    else
      disc = 100-(bundlePrice*100/normalPriceofLines);

    var totalHere = 0;
    var lineItem = 0;
    $(bundleVariants).each(function(){
      lineItem = Math.round(((this.price/100) * (1-(disc/100)))*100)/100.0;
      totalHere += lineItem;
    });

    var differ = (bundleDiscountType == "percentage")?0:(bundlePrice/100)-totalHere;
    differ = Math.round(differ*100)/100.0;
    //alert(differ);

    $(bundleVariants).each(function(i,variant){
      var discount = Math.round(((this.price/100) * (disc/100))*100)/100.0;
      if (i == 0)
        discount -= differ; //this is the being off by a penny fix
      variant.discount = discount;
    });

    if (doneWithIntercept)
      return true;
    else
      interceptBundle(e);

    return false;
  });
  /*$('body').on('click','form.bundle-builder--add-to-bundle-form button',function(){
    bundleVariants.push($(this).parent().find('input[name="variant"]').val());
  });*/

interceptBundle = function(e) {
  if (bundleVariants.length == 0)
    return;

  ts = Date.now().toString();
  processQueue();
}

hideBundleLineItemsInCart = function(){
  //should be able to do this on cart.liquid, just gotta figure out how to with rivets js yet another of a billion frameworks
  $('tr.item').each(function(){
    if ($(this).html().indexOf('BundleId') > -1)
      $(this).remove();
  });
}

//this is not necessarily finishing before the page is redirected to cart by bundlebuilder app so
//  keep that in mind before releasing
processQueue = function() {

  if (bundleVariants.length == 0)
  {
    doneWithIntercept = true;
    $('form.bundle-builder--add-to-cart-form button').click();  //not great
    return;
  }

  var variant = bundleVariants.shift();

  var upd = {
     quantity: 1,
     id: variant.id,
     properties: {
       'Bundle': 'Yes',  //put bundle id here?
       'BundleId': ts,
       'Discount': variant.discount
     }
  };
  didAnythingChangeOnThisPage = true;
  $.ajax({
    type: 'POST',
    data: upd,
    url: '/cart/add.js',
    dataType: 'json',
    success: function(item) {
      processQueue();
    },
    error: function (XMLHttpRequest, textStatus) { //NEED TO HANDLE THIS BETTER
      processQueue();
    }
 });
}

lineUpAttachedLineItemsToBundle = function() {
  if (busy)
    return;
  addBundlesParentsToCart();
}

lineUpAttachedLineItemsToBundlePart2 = function() {
  if (typeof pageCart !== 'object' || typeof pageCart.items !== 'object' || pageCart.items.length == 0)
    return;
  if (typeof kitRemovedForCheckout !== 'undefined' && kitRemovedForCheckout)
    return;

  var items = pageCart.items;
  var bundles = [];
  var bundleLines = {};
  //first put all the skus in the properties of the bundle that shows on the screen...into a string...each bundle shown has one string here
  $(items).each(function(i,item){
      if (item.product_type != 'Custom Bundle')
        return;
      var bundleString = '';
      $.each(item.properties,function(j,prp){
        bundleString = bundleString + prp;
      });
      var qty = item.quantity;
      bundles.push({bundleString,qty});
  });

  var alterQuantities = '';
  //second make arrays of line items that fit inside their own bundles by BundleId which is just unix timestamp when they were created
  $(items).each(function(i,item){
      $.each(item.properties,function(j,prp){
        if (j == 'BundleId')
        {
          if (typeof bundleLines[prp] === 'undefined')
            bundleLines[prp] = [];
          var sku = item.sku;
          var qty = item.quantity;
          var key = item.key;
          bundleLines[prp].push({sku:sku,qty:qty,key:key});
        }
      });
      var qty = item.quantity;
  });

  //third go through each bundle of line items and make sure there is a string created in the first step with all the skus for this bundle of line items
  var adds = {};
  $.each(bundleLines,function(i,thisBundleOfLineItems){
    var itemsInBundle = thisBundleOfLineItems.length;
    var found = false;
    $.each(bundles,function(x,bundle){
      var bundleStr = bundle.bundleString.toLowerCase();
      var bundleQty = bundle.qty;
      var count = (bundleStr.match(/\[/g) || []).length;
      if (itemsInBundle != count)
        return false;
      var allFoundInThisBundle = true;
      $.each(thisBundleOfLineItems,function(j,lineitem){
        if (bundleStr.indexOf(lineitem.sku.toLowerCase()) == -1)
          allFoundInThisBundle = false;
      });
      if (allFoundInThisBundle) //then these line items are good////can match qty here too
      {
        $.each(thisBundleOfLineItems,function(j,lineitem){//match quantities here
          if (bundleQty != lineitem.quantity)
          {
            kee = lineitem.key;
            if (alterQuantities.length > 0)
              alterQuantities = alterQuantities + '&';
            alterQuantities = alterQuantities + 'updates['+kee+']=' + bundleQty.toString();
            adds[kee] = bundleQty;
          }
        });
        found = true;
        return false;
      }
    });
    if (found == false) //these line items are orphaned so delete them
    {
      var destroy = '';
      $.each(thisBundleOfLineItems,function(j,lineitem){
        kee = lineitem.key;//lineitem.key.substr(0,lineitem.key.indexOf(':'));
        if (destroy.length > 0)
          destroy = destroy + '&';
        destroy = destroy + 'updates['+kee+']=0';
      });
      jQuery.post('/cart/update.js',destroy);
    }
  });

  if (alterQuantities.length > 0) {
    busy = true;
    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      //data: alterQuantities,
      data: { updates: adds },
      success: function(msg){
            console.log( "Data Saved: " + msg );
            busy = false;
      },
      error: function(XMLHttpRequest, textStatus) {
         console.log("some error");
         console.log(XMLHttpRequest);
         console.log(textStatus);
         busy = false;
      }
    });
    /*jQuery.post('/cart/update.js',alterQuantities).done(function(){
      busy = false;
    }).fail(function(xhr, status) {
        console.log(xhr);
        console.log(status);
    });*/
  }
}

/////////////////////////////////////////////////////////////////////////////////////
/////The functionality below is used to remove the bundle app main products/////////
////  from the cart during checkout so they are not sent to Shipstation  ///////////
////    They are not being fulfilled, the individual line items are....  //////////
////      so they should not be on picklist/invoice..but they are needed //////////
////        in the cart on the site for the app functionality            //////////
////      'easier' methods of 'hiding' or 'removing' were tried but none work /////
/////////////////////////////////////////////////////////////////////////////////////
var localBundleParents = [];

getBundleParents = function () {
  localBundleParents = [];
  var localStoreParents = localStorage.getItem('bundleParents');

  if (localStoreParents)
    localBundleParents = JSON.parse(localStoreParents);
}

setBundleParents = function (items) {
  localStorage.setItem('bundleParents',JSON.stringify(items));
}

removeBundleParents = function () {
  localStorage.removeItem('bundleParents');
}

var bundlePars = [];

next = function () {
  removeBundleParents(); //these have already been "readded" to cart by the function calling this...or they are invalid at this point..either way should be removed
  lineUpAttachedLineItemsToBundlePart2();
  return false;
}

addBundlesParentsToCart = function () {

  getBundleParents();
  if (!localBundleParents.length) {
    return next();
  }
  var items = pageCart.items;
  var cartAlreadyHasBundleParents = false;
  $(items).each(function(i,item){
      if (item.product_type == 'Custom Bundle') {
        cartAlreadyHasBundleParents = true;
        return false;
      }
  });
  if (cartAlreadyHasBundleParents) {
    return next();
  }

  var cartHasBundleLineItems = false;
  $(pageCart.items).each(function(){
    if (this.properties.Bundle) {
        cartHasBundleLineItems = true;
        return false;
    }
  });

  if (cartHasBundleLineItems) {
    bundlePars = localBundleParents;
    processQueueAddBundleParents();
    return false;
  }

  next();
}

processQueueAddBundleParents = function(callback) {
  if (bundlePars.length == 0)
  {
    window.location.reload();
    return;
  }

  var variant = bundlePars.shift();

  var upd = {
     quantity: variant.quantity,
     id: variant.id,
     properties: variant.properties
  };

  $.ajax({
    type: 'POST',
    data: upd,
    url: '/cart/add.js',
    dataType: 'json',
    success: function(item) {
      processQueueAddBundleParents();
    },
    error: function (XMLHttpRequest, textStatus) {
      processQueueAddBundleParents();
    }
 });
}

function goCheckout() {
  $.when(theme.cart.getCart()).done(function(cart){
    if (!cart) cart = theme.cart.cart;
    
    var subscriptionProducts = false;

    if ( cart.items && cart.items.length ) {
      cart.items.forEach( function ( v ) {
        if ( v.properties && v.properties.subscription_id ){
          subscriptionProducts = true;
        }
      }); 
    }

    if ( subscriptionProducts ) {
      window.location.href = theme.reChargeProcessCart();
    } else {
      location.href = '/checkout';
    }
  })
}

//$(document).ready(function(){
  $('form.cart-form input.cart-form__submit').click(function(e){
      e.stopPropagation();
      $.getJSON('/cart.js',
        function (cart, textStatus) {
          var bundleItems = [];
          var removes = {};
          var hasRemoves = false;
          $(cart.items).each(function(){
            if (this.product_type.toLowerCase() == 'custom bundle')
            {
                bundleItems.push(this);
                removes[this.id]=0;
                hasRemoves = true;
            }
          });
          if (hasRemoves)
          {
            setBundleParents(bundleItems);
            $.ajax({
              type: 'POST',
              url: '/cart/update.js',
              data: { updates: removes },
              dataType: 'json',
              success: function(item) {
                console.log(item);
                goCheckout();
              },
              error: function (XMLHttpRequest, textStatus) {
                goCheckout();
              }
            });
          }
          else
            goCheckout();
          },
        function () {goCheckout();}
      );
      return false;
  });
//});
lineUpAttachedLineItemsToBundle();  //this runs once after a bundle is added to cart and the line items are created and the app creates the one bundle item that shows in the cart

if (window.location.href.toLowerCase().indexOf('/cart') > -1)
  hideBundleLineItemsInCart();

});
