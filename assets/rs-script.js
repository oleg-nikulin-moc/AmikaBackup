//  ROSWELL
var site = "https://doylestaging.roswellstudios.com";
var didAnythingChangeOnThisPage = false;  //for this to work it EVERYTHING needs to run or this needs to be checked at the last step if the steps are changed
var gcalledFromCartPage = false;
var asyncCallsOutstanding = 0;
var readyForFreePopup = false;  //this is used so the popup doesnt flash

function BackTop()
{
  if($(window).width() > 1023){
    if($(this).scrollTop()<=200) {
      $('.scrollup').fadeOut();
    } else {
      $('.scrollup').fadeIn();
    }
  } else {
    $('.scrollup').fadeOut();
  }
}

$(function(){
// NAV - Tablet: Show dropdown on click then clickthrough if open
function isTouchable() {
  return 'ontouchstart' in window // works on most browsers
  || 'onmsgesturechange' in window; // works on ie10
  //or
  try{ document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
}
if (isTouchable()) {
  //Also possible: listen for the touch events?
  $('.main-menu .has-dropdown').on('click', function(event){
    if (!$(this).hasClass('active')){
      $(this).addClass('active')
      event.preventDefault();
    }
  });
}
});


function isPro()
{
  if ($('input#ct').length == 0)
    return false;
  if ($('input#ct').val().toLowerCase().indexOf('pro') > -1)
    return true;
  return false;
}


function isHMS()
{
  if ($('input#ct').length == 0)
    return false;
  if ($('input#ct').val().toLowerCase().indexOf('hms') > -1)
    return true;
  return false;
}


var dont = false;

function adjustPrices(subx)
{
  if (dont == true)
    return;
  dont = true;
  var selectoor = 'div.price > div.deal > span';
  if (subx)
  {
    selectoor = subx + ' ' + selectoor;
  }
  function pproc (price) {
    price = price.replace('$','');
    if (isNaN(price) || price.length == 0)
      return '';
    price = price * discount;
    price = (Math.ceil( price * 100 ) / 100).toFixed(2); //Added in for more precise rounding
    // price = '$' + price.toFixed(2).toString();
    price = price.replace(/\.00$/,'');
    price = '$' + price;
    return price;
  }
  var selfunc = function(event){
    //exclude products from HMS
    var _t = $(this).parents('form').attr('id');
    if (_t == 'product-actions-1663398051906'
//         || _t == 'product-actions-1698593767490' //smooth criminal
        || _t == 'product-actions-10876573650'
        || _t == 'product-actions-1741182468162' //levi jeans

        //events
        || _t == 'product-actions-1719467180098'
        || _t == 'product-actions-1719470096450'
        || _t == 'product-actions-1719472062530'
        || _t == 'product-actions-1719478124610'
        || _t == 'product-actions-1719478681666'
        || _t == 'product-actions-1719479402562'
        || _t == 'product-actions-1684298661954'
        || _t == 'product-actions-211376472082'
      ) {

      return;
  	}
    _t = $(this).parents('form').find('div.bottomLine').data('product-id');
    if (_t == '1663398051906'
//         || _t == '1698593767490'
        || _t == '10876573650'
        || _t == '1741182468162' //levi jeans

        //events
        || _t == '1719467180098'
        || _t == '1719470096450'
        || _t == '1719472062530'
        || _t == '1719478124610'
        || _t == '1719478681666'
        || _t == '1719479402562'
        || _t == '1684298661954'
        || _t == '211376472082'
      ) {
      return;
  	}

    var price = $(this).text();
    var oprice = price;
    var prices = price.split(' - ');
    if (prices.length > 1) {
      price = pproc(prices[0]) + ' - ' + pproc(prices[1]);
    } else {
	  price = pproc(prices[0]);
    }
    $(this).html('<span class="old_price">'+oprice+'</span><span class="new_price">'+price+'</span>');
  };
  $(selectoor).off('DOMSubtreeModified');
  $(selectoor).each(selfunc);
  dont = false;

  $(selectoor).on('DOMSubtreeModified', function () {
    adjustPrices(subx);
  });
}

isFree = function (lineitem) {
  var free = false;
  $.each(lineitem.properties,function(i,prop){
    console.log(lineitem.properties);
    console.log(i);
    console.log(prop);
    console.log(Object.keys(lineitem.properties)[i]);
    if (['Gift','Percent'].indexOf(i) > -1)//(prop == 'Free' || prop == '35') //should match on property name not just value
      free =true;
  });
  return free;
};

isThisDiscountCount = function (lineitem,thisDC) {
  var isMatch = false;
  $.each(lineitem.properties,function(i,prop){
    if (prop == thisDC) //should match on property name not just value
      isMatch =true;
  });
  return isMatch;
};

deleteItemAtIndex = function (cartIndex,calledFromCartPage=false,thisIsLastCall = false) {
  console.log('deleteItemAtIndex deleting /cart/change.js');
  asyncCallsOutstanding++;
  $.ajax({
    type: 'POST',
    url: '/cart/change.js',
    data: { quantity: 0, line: cartIndex },
    dataType: 'json',
    success: function(item) {
      asyncCallsOutstanding--;
      didAnythingChangeOnThisPage = true;
      if (calledFromCartPage)
      {
        //location.reload();
      }
      else
      {
        updateCartDesc();
      }
    },
    error: function (XMLHttpRequest, textStatus) {
      asyncCallsOutstanding--;
      didAnythingChangeOnThisPage = true;
      if (calledFromCartPage) $('#loading-overlay').hide();
    }
  });
};

freeGiftHandler = function (calledFromCartPage = false) {
  console.log('!!!!!!!!!' + calledFromCartPage);
  gcalledFromCartPage = calledFromCartPage;
  //return;   //this is not running for BFCM and is causing the async error so turn off for now--BF
  var codes = [];
  codes.push({"50":""}); //Tiered Gift With Purchase LA-96
  codes.push({"":""});
  codes.push({"":""});
  codes.push({"":""});
  codes.push({"":""});
  codes = codes.filter(function(obj) {
          if (Object.keys(obj)[0] == '' || obj[Object.keys(obj)[0]] == '')  //exclude empty
            return false;
          return true;
      });

  var codesBUYTWOGETONE = [];
  codesBUYTWOGETONE.push("".trim());
  codesBUYTWOGETONE.push("".trim());
  codesBUYTWOGETONE.push("".trim());
console.log(codesBUYTWOGETONE);
  var codesBUYTWOGETONE_Groups = [];
  codesBUYTWOGETONE_Groups.push("".trim());
  codesBUYTWOGETONE_Groups.push("".trim());
  codesBUYTWOGETONE_Groups.push("".trim());

  if ((codes.length == 0)
    && (codesBUYTWOGETONE[0].length == 0 || codesBUYTWOGETONE[1].length == 0 || codesBUYTWOGETONE[2].length == 0)
    && (codesBUYTWOGETONE_Groups[0].length == 0 || codesBUYTWOGETONE_Groups[1].length == 0 || codesBUYTWOGETONE_Groups[2].length == 0))
  {
    if (calledFromCartPage) $('#loading-overlay').hide();
    //return;
  }
  $.getJSON('/cart.js', function(cart) {
    console.log(cart);
/*$.each(cart.items,function(i,item){
  console.log(item.properties);
    console.log(isFree(item));
});*/

        TIERED_BY_TOTAL(codes,cart,calledFromCartPage);   //LA-96 Tiered GWP-by Cart Total
return;//added this here because the following are overwriting the cart...need to queue up the calls, not queue up the cart changes, one call could affect the next
        //now do GWP-buy two, get third free
        BUYTWOGETONE_Groups(codesBUYTWOGETONE,cart,calledFromCartPage);  //LA-98 should work exactly the same as groups
                                                                         //same except the groups are of 1 product
        BUYTWOGETONE_Groups(codesBUYTWOGETONE_Groups,cart,calledFromCartPage);  //LA-99

        BUYTWOGETTHIRD("",cart,calledFromCartPage);  //LA-108 B2G1 Promotion
                       console.log("BOGO NO CODE: " + "");
        BUYONEGETONE("","",cart,calledFromCartPage);
        BUYONEGETONE("","",cart,calledFromCartPage);

        freeGiftHandler_CheckWithDiscountCode(calledFromCartPage,cart);  //do the same stuff, but do it with discount codes
  });
  if (calledFromCartPage) $('#loading-overlay').hide();
}

freeGiftHandler_CheckWithDiscountCode = function (calledFromCartPage = false,cart) {
  currentCode = "";
  console.log('!??????????' + calledFromCartPage);
  gcalledFromCartPage = calledFromCartPage;
  $(".reduction-code__text").each(function() {
      currentCode = $(this).text().toLowerCase();
      if ($(this).text().toLowerCase() == codeSimple.toLowerCase())
        found = true;
  });

  console.log('freeGiftHandler_CheckWithDiscountCode');
  var codes = [];
  var codes2 = [];

  codes.push({"35":"14369300545602"}); //Tiered Gift With Purchase LA-96
  codes.push({"":""});
  codes.push({"":""});
  codes.push({"":""});
  codes.push({"":""});
  codes = codes.filter(function(obj) {
          if (Object.keys(obj)[0] == '' || obj[Object.keys(obj)[0]] == '')  //exclude empty
            return false;
          return true;
      });

  codes2.push({"":""}); //Tiered Gift With Purchase LA-96
  codes2.push({"":""});
  codes2.push({"":""});
  codes2.push({"":""});
  codes2.push({"":""});
  codes2 = codes2.filter(function(obj) {
          if (Object.keys(obj)[0] == '' || obj[Object.keys(obj)[0]] == '')  //exclude empty
            return false;
          return true;
      });

  console.log(codes);
  console.log(codes2);

  var codesBUYTWOGETONE = [];
  codesBUYTWOGETONE.push("".trim());
  codesBUYTWOGETONE.push("".trim());
  codesBUYTWOGETONE.push("".trim());

  var codesBUYTWOGETONE_Groups = [];
  codesBUYTWOGETONE_Groups.push("".trim());
  codesBUYTWOGETONE_Groups.push("".trim());
  codesBUYTWOGETONE_Groups.push("".trim());

  if ((codes.length == 0) && (codes2.length == 0)
    && (codesBUYTWOGETONE[0].length == 0 || codesBUYTWOGETONE[1].length == 0 || codesBUYTWOGETONE[2].length == 0)
    && (codesBUYTWOGETONE_Groups[0].length == 0 || codesBUYTWOGETONE_Groups[1].length == 0 || codesBUYTWOGETONE_Groups[2].length == 0))
  {
    if (calledFromCartPage) $('#loading-overlay').hide();
    return;
  }
  if (calledFromCartPage) {
    //turn off overlay after 5 seconds in case it gets orphaned
  }

        TIERED_BY_TOTAL(codes,cart,calledFromCartPage,"PERKFORYOU");   //LA-96 Tiered GWP-by Cart Total
        TIERED_BY_TOTAL(codes2,cart,calledFromCartPage,"");   //LA-96 Tiered GWP-by Cart Total
        //now do GWP-buy two, get third free
        BUYTWOGETONE_Groups(codesBUYTWOGETONE,cart,calledFromCartPage,1);  //LA-98 should work exactly the same as groups                                                                 //same except the groups are of 1 product
        BUYTWOGETONE_Groups(codesBUYTWOGETONE_Groups,cart,calledFromCartPage,2);  //LA-99
        BUYONEGETONE("32240472752194","1619151192082",cart,calledFromCartPage,"WIZARD");
        BUYONEGETONE("","",cart,calledFromCartPage,"","",true);
        CheckReload();
        //BUYTWOGETTHIRD("",cart,calledFromCartPage,"");

}

function CheckReload() {  //keep checking to see if the page needs reload after the last possible async call is done
  if (gcalledFromCartPage && didAnythingChangeOnThisPage && asyncCallsOutstanding == 0)
  {
    didAnythingChangeOnThisPage = false;  //dont let this run again once its set to reload the page
    setTimeout(function(){
      console.log('RELOADING RELOADING RELOADING RELOADING RELOADING RELOADING');
      location.reload();
    },100);
  }
  else if (gcalledFromCartPage && asyncCallsOutstanding > 0)
  {
    console.log('checkreload');
    setTimeout(function(){
      CheckReload();
    },1000);
  }
  else
  {
    readyForFreePopup = true;
  }
  console.log('gcalledFromCartPage ' +gcalledFromCartPage);
  console.log('didAnythingChangeOnThisPage ' +didAnythingChangeOnThisPage);
  console.log('stop checkreload');
}

function TIERED_BY_TOTAL(codes,cart,calledFromCartPage,discount_code='')
{
  var upds = {};
  var thisDC = discount_code.toLowerCase();
  currentCode = currentCode.toLowerCase();
console.log(thisDC + ':' + currentCode);
  console.log(cart);
  if (thisDC.length > 0 && thisDC != currentCode)
  {
    if ($('.total-line-table').length == 0)
      return;  //only delete due to missing discount code if on the checkout page where it only exists
    idx = 0;
    $.each(cart.items,function(i,item){
      if (isThisDiscountCount(item,thisDC))
        idx = i+1;
    });
    if (idx > 0) {
      console.log('deleting 1122222222222222211112222222221');
      deleteItemAtIndex(idx,calledFromCartPage);
    }
    return;
  }
console.log(cart);
  $.each(codes,function(i,obj)
  {
        //var obj = codes[k];
        var variant =  obj[Object.keys(obj)[0]];
        var total = Object.keys(obj)[0];
        if (isNaN(parseInt(total)))
          return;
        total = parseInt(total) * 100;
        if (cart.total_price  < total) {
          var idx = -1;
          $.each(cart.items,function(i,item){
            if (item.id == variant && isFree(item))
              idx = i;
          });
          if (idx > -1) {//remove if it exists
            if (cart.items[idx].line_price > 0 && !isFree(cart.items[idx]))
              return;
            upds[variant] = 0;
            var upd = {updates: upds};
            console.log('deleting 11111111111111111111111111111111');
            deleteItemAtIndex(idx+1,calledFromCartPage);
            return false;
          }
        }
        else
        {
           var idx = -1;
           $.each(cart.items,function(i,item){
             if (item.id == variant && isFree(item))
               idx = i;
           });
           if(idx == -1) {
             var upd = {
                quantity: 1,
                id: variant,
                properties: {
                  'Gift': 'Free','Code': thisDC
                }};
                console.log('adding /cart/add.js!!!!!!!!');
                asyncCallsOutstanding++;
             $.ajax({
               type: 'POST',
               data: upd,
               url: '/cart/add.js',
               dataType: 'json',
               success: function(item) {
                 asyncCallsOutstanding--;
                 didAnythingChangeOnThisPage = true;
                 console.log('set didAnythingChangeOnThisPage = true;')
                 if (calledFromCartPage)
                 {
                   didAnythingChangeOnThisPage = true;
                   //location.reload();
                 }
                 else
                 {
                   updateCartDesc();
                 }
               },
               error: function (XMLHttpRequest, textStatus) {
                 console.log('error in TIERED_BY_TOTAL add.js');
                 console.log(XMLHttpRequest);
                 asyncCallsOutstanding--;
                 if (calledFromCartPage) $('#loading-overlay').hide();
                 //ShopifyAPI.onError(XMLHttpRequest, textStatus);
               }
             });
             //return false;
           }
         }
      });

}

function BUYTWOGETTHIRD(variant_id,cart,calledFromCartPage,discount_code=false)
{
          var upds = {};
          //now do GWP-buy two, get third free
          if (variant_id.length == 0)
          {
            if (calledFromCartPage) $('#loading-overlay').hide();
            return;
          }

          var found_items = [false,false]; //first is the first two items, second is the free one with a line item property

          var idx = -1;
          $.each(cart.items,function(ix,item){
              if (variant_id.indexOf(item.id.toString()) > -1 && !isFree(item) && item.quantity > 1)  //looking for paid for 1st
                found_items[0] = true;
              if (variant_id.indexOf(item.id.toString()) > -1 && isFree(item))  //looking for free 2rd item
              {
                found_items[1] = true;
                idx = ix+1;
              }
          });

          if (found_items[0] == true && found_items[1] == false) //add
          {
            var upd = {
               quantity: 1,
               id: variant_id,
               properties: {
                 //'Gift': 'Free'
                 'Percent': '35'
               }};
               console.log('BUYTWOGETHIRD /cart/add.js');
               asyncCallsOutstanding++;
            $.ajax({
              type: 'POST',
              data: upd,
              url: '/cart/add.js',
              dataType: 'json',
              success: function(item) {
                asyncCallsOutstanding--;
                if (calledFromCartPage)
                {
                  didAnythingChangeOnThisPage = true;
                  //location.reload();
                }
                else
                {
                  updateCartDesc();
                }
              },
              error: function (XMLHttpRequest, textStatus) {
                asyncCallsOutstanding--;
                if (calledFromCartPage) $('#loading-overlay').hide();
                //ShopifyAPI.onError(XMLHttpRequest, textStatus);
              }
            });
          }
          else if (found_items[0] == false && found_items[1] == true) //remove
          {
            console.log('DELETING 333333333333333333333');
            deleteItemAtIndex(idx,calledFromCartPage);
          }
}

function BUYONEGETONE(variant_id,variant_id_free,cart,calledFromCartPage,discount_code="",percentOff="0",thisIsLastCall = false)
{
  console.log('BUYONEGETONE' + discount_code);
        discount_code = discount_code.toLowerCase();
        if (discount_code.length > 0 && discount_code != currentCode)
        {
          //if ($('.total-line-table').length == 0) {
          //  return;  //only delete due to missing discount code if on the checkout page where it only exists
          //}
          idx = 0;
          $.each(cart.items,function(i,item){
            if (isThisDiscountCount(item,discount_code))
              idx = i+1;
          });
          if (idx > 0)
          {
            console.log('DELETING 44444444444444444');
            deleteItemAtIndex(idx,calledFromCartPage,thisIsLastCall);
          }
          return;
        }

          var upds = {};
          //now do GWP-buy two, get third free
          if (variant_id.length == 0)
          {
            if (calledFromCartPage) $('#loading-overlay').hide();
            return;
          }

          var found_items = [false,false]; //first is the first item, second is the free one with a line item property
console.log(cart);
          var idx = -1;
          var qty = 1;
          var alreadyqty = 0;
          $.each(cart.items,function(ix,item){
              if (variant_id.indexOf(item.id.toString()) > -1 && !isFree(item))  //looking for paid for 1st
              {
                found_items[0] = true;
                qty = item.quantity;
              }
              if (variant_id_free.indexOf(item.id.toString()) > -1 && isFree(item))  //looking for free 2rd item
              {
                found_items[1] = true;
                alreadyqty = item.quantity;
                idx = ix+1;
              }
          });
console.log(found_items);
          var props = {'Gift': 'Free','Code': discount_code};
          if (!isNaN(percentOff) && parseInt(percentOff) > 0)
            props = {'Percent': percentOff,'Code': discount_code};

            //if they added more of the primary product after some free/discounted ones were given
          if (found_items[0] == true && found_items[1] == true && qty != alreadyqty)
          {
              found_items[1] = false;
              qty = qty - alreadyqty;
          }

          if (found_items[0] == true && found_items[1] == false && qty > 0) //add
          {
            var upd = {
               quantity: qty,
               id: variant_id_free,
               properties: props};
               console.log('BUYONEGETONE /cart/add.js')
               asyncCallsOutstanding++;
            $.ajax({
              type: 'POST',
              data: upd,
              url: '/cart/add.js',
              dataType: 'json',
              success: function(item) {
                asyncCallsOutstanding--;
                didAnythingChangeOnThisPage = true;
                if (calledFromCartPage)
                {
                  //location.reload();
                }
                else
                {
                  updateCartDesc();
                }
              },
              error: function (XMLHttpRequest, textStatus) {
                asyncCallsOutstanding--;
                if (calledFromCartPage) $('#loading-overlay').hide();
                //ShopifyAPI.onError(XMLHttpRequest, textStatus);
              }
            });
          }
          else if ((found_items[0] == false && found_items[1] == true) ||
          (found_items[0] == true && found_items[1] == false && qty < 0)) //if they lower qty on primary product then delete free/discounted ones then on refresh the correct number will be added back
          {
            console.log('DELETING 55555555555555');
            deleteItemAtIndex(idx,calledFromCartPage,thisIsLastCall);
          }
}

function BUYTWOGETONE_Groups(codesBUYTWOGETONE_Groups,cart,calledFromCartPage,discount_code=0)
{
    var thisDC = "";
    if (discount_code == 1)
      thisDC = "";
    else if (discount_code == 2)
      thisDC = "";
    thisDC = thisDC.toLowerCase();
console.log(thisDC);
    if (discount_code > 0 && thisDC != currentCode && thisDC.trim() != '')
    {
      if ($('.total-line-table').length == 0)
        return;  //only delete due to missing discount code if on the checkout page where it only exists
      idx = 0;
      $.each(cart.items,function(i,item){
        if (isThisDiscountCount(item,thisDC))
          idx = i+1;
      });
      if (idx > 0)
      {
        console.log('DELETING 666666666666666666666');
        deleteItemAtIndex(idx,calledFromCartPage);
      }
      return;
    }
console.log('made it');
          var upds = {};
          //now do GWP-buy two, get third free
          if (codesBUYTWOGETONE_Groups[0].length == 0 || codesBUYTWOGETONE_Groups[1].length == 0 || codesBUYTWOGETONE_Groups[2].length == 0)
          {
            if (calledFromCartPage) $('#loading-overlay').hide();
            return;
          }

          var found_items = [false,false,false];

          for (var i=0;i<2;i++)
          {
            var idx = -1;
              $.each(cart.items,function(ix,item){
                if (codesBUYTWOGETONE_Groups[i].split(',').indexOf(item.id.toString()) > -1 && !isFree(item))  //looking for paid for 1st and 2nd item
                  found_items[i] = true;
            });
          }
          var idx = -1;
          $.each(cart.items,function(ix,item){
              if (item.id == codesBUYTWOGETONE_Groups[2] && isFree(item))  //looking for free 3rd item
                found_items[2] = true;
          });
          if (found_items[0] == true && found_items[1] == true && found_items[2] == false) //add
          {
            var upd = {
               quantity: 1,
               id: codesBUYTWOGETONE_Groups[2],
               properties: {
                 'Gift': 'Free','Code': thisDC
               }};
               console.log('BUYTWOGETONE_Groups /cart/add.js');
               asyncCallsOutstanding++;
            $.ajax({
              type: 'POST',
              data: upd,
              url: '/cart/add.js',
              dataType: 'json',
              success: function(item) {
                asyncCallsOutstanding--;
                if (calledFromCartPage)
                {
                  didAnythingChangeOnThisPage = true;
                  //location.reload();
                }
                else
                {
                  updateCartDesc();
                }
              },
              error: function (XMLHttpRequest, textStatus) {
                asyncCallsOutstanding--;
                if (calledFromCartPage) $('#loading-overlay').hide();
                //ShopifyAPI.onError(XMLHttpRequest, textStatus);
              }
            });
          }
          else if ((found_items[0] && found_items[1]) == false && found_items[2] == true) //remove
          {
            upds[codesBUYTWOGETONE_Groups[2]] = 0;
            var upd = {updates: upds};
            console.log('BUYTWOGETONE_Groups /cart/update.js');
            asyncCallsOutstanding++;  //need to put these ajax calls in a function...this logic is duplicated 8 times...this comment by the author
            $.ajax({
              type: 'POST',
              data: upd,
              url: '/cart/update.js',
              dataType: 'json',
              success: function(item) {
                asyncCallsOutstanding--;
                if (calledFromCartPage)
                {
                  didAnythingChangeOnThisPage = true;
                  //location.reload();
                }
                else
                {
                  updateCartDesc();
                }
              },
              error: function (XMLHttpRequest, textStatus) {
                asyncCallsOutstanding--;
                if (calledFromCartPage) $('#loading-overlay').hide();
                //ShopifyAPI.onError(XMLHttpRequest, textStatus);
              }
            });
          }
}

    var codeSimple = "DETOX";
    var currentCode = "";
/*
    removeGWP = function (cart) {
      var found = false;
      $(cart.items).each(function () {
        if ($(this)[0].variant_id == 13537918648386) {
          found = true;
          alterGWP(0);
        }
      });
      if (!found)
        freeGiftHandler_CheckWithDiscountCode(true,cart);
    };

    addGWP = function (cart) {
      var found = false;
      $(cart.items).each(function () {
        if ($(this)[0].variant_id == 13537918648386)
          found = true;
      });
      if (!found)
        alterGWP(1);
      else {
        if ($('tr.product[data-variant-id=13537918648386] td.product__price span').length == 0)
          return;

        var value = $('tr.product[data-variant-id=13537918648386] td.product__price span').html();
        if (value == '$0.00' || value.toLowerCase() == 'free' || value.indexOf('strike') > -1)
          return;

        value = '<span class="strike">' + value + "</span>  $0.00";
        $('tr.product[data-variant-id=13537918648386] td.product__price span').html(value);
      }
    };

    runGWP = function () {
      var count = 1;
      var frm = this;
      var found = false;

      currentCode = "";

      $(".applied-reduction-code__information").each(function() {
          currentCode = $(this).text().toLowerCase();
          if ($(this).text().toLowerCase() == codeSimple.toLowerCase())
            found = true;
      });
console.log('yes2');console.log(found);
      if (found)
      { Shopify.getCart(addGWP); }
      else
      { Shopify.getCart(removeGWP); }

    };

    alterGWP = function (count) {
        var params = {
          type: 'POST',
          url: '/cart/update.js',
          data: { updates: { 13537918648386 : count } },
          dataType: 'json',
          success: function(cart) {
            if ((typeof callback) === 'function') {
              $('.cart-count').html(cart.item_count);
              callback(cart);
            }
            else {
              console.log('yes1');
              freeGiftHandler_CheckWithDiscountCode(true,cart);
              //location.reload();  //there might be an ajax cart update for the checkout
            }
          },
          error: function(XMLHttpRequest, textStatus) {
            Shopify.onError(XMLHttpRequest, textStatus);
          },
          async:false
        };
        $.ajax(params);
    };
*/

var gisfooter = false;

function signupSendEmailToAppKlaviyo(email,addressbookid,isfooter) {
  var posturl = site + "/apps/amikamail";
  var address_book_id_to_api = '';

  gisfooter = isfooter;

  if (typeof addressbookid != 'undefined' && addressbookid.length > 0)
    address_book_id_to_api = addressbookid;

  console.log(address_book_id_to_api);

  if (typeof email == 'undefined' || email.trim().length == 0) return;

  $.ajax({
    type: 'POST',
    url: posturl,
    timeout:300000,
    data: { email : email , addressbookid : address_book_id_to_api},
    success: function (data) {
      //I don't know what this is for, but frm is not defined.
//       if (frm == 'klavemail') {
//       $('.mailing-list form').fadeOut(function(){
//         $('.mailing-list .success').fadeIn();
//       });
//       }
//       else {
      	if (!gisfooter)
          return;
              	modal = new tingle.modal({
                    closeMethods: ['overlay', 'button', 'escape'],
                    closeLabel: "",
                    cssClass: ['promotion-popup']
                });
                modal.setContent($('#promotion-pop-up-success'));
                modal.open();
//       }
      return;
    },
    error: function(data) {
      console.log(data);
    }
  });
}

var bookid = 0;

function SectionSendMail(email , address__book_id) {
  bookid = address__book_id;
  var posturl = site + "/apps/amikamail";

  if ( address__book_id ) {
    posturl = site + "/apps/amikamail/" + address__book_id ;
  }

  if (typeof email == 'undefined' || email.trim().length == 0) return;

  $.ajax({
    type: 'POST',
    url: posturl,
    timeout:300000,
    data: { email : email },
    success: function (data) {
		$('input.email').val('');
      	$('input.email').after('<p style="margin-top: 10px ; color:white"><span>you are now on the list!</span></p>');
        $('a.custom-cursor').remove();
//       	$('button').remove();
      ga('send', 'event', 'UX', 'email signup addressbookid: ' + bookid, email, { nonInteraction: true });
      return;
    },
    error: function(data) {
      console.log(data);
    }
  });
}


// function signupAttach() {
//   $('#klavemail,#klavemailpopup,form[data-address_book_id]').unbind();
//   $('#klavemail,#klavemailpopup,form[data-address_book_id]').on('submit',function(e) {
//     var isfooter = false;
//     if (($(this).attr('id') == 'klavemail') || ($(this).attr('id') == 'klavemailpopup'))
//       isfooter = true;
//     e.stopPropagation();
//     signupSendEmailToAppKlaviyo($(this).find('.email-input').val(),$(this).attr('data-address_book_id'),isfooter);
//     return false;
//   });
// }

var discount = 0.6;

function doAdjustPrices(subx) {

  if (isPro() || isHMS()){
    if (isHMS()) {
      discount = 0.3;
    }
    if (!isHMS() && !isPro()) {
      //discount = 0.2;
    }
    if (dont == false)
    {
      adjustPrices(subx);
    }
  }
}
$( function () {

doAdjustPrices();
    //signupAttach();

// Prevent click through on donation product
  if($('body').hasClass('template-cart')){
    $('td > a[href*="donation"]').on('click', function(e){ e.preventDefault()});
  }

  // To handle the donation popup so it is visible to user 
  $(document).on('click','.side-cart .donation .btn.button.frontbutton', function(){
    setTimeout(function(){
      $("#donate-popup",document)[0].scrollIntoView();
      $('.side-cart').css({'overflow':'hidden'})
     }, 3000);
  })

});


$(window).resize(function(){
  BackTop();
})

// Marqee Text
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// Handle content page marquee animations (PDP)
(function customMarq(){
$(".slideContainer").each(function( index ) {
  let currencyPairWidth = $('.slideItem:first-child', this ).outerWidth();
  $(this).animate({marginLeft:-currencyPairWidth},{
    duration: (currencyPairWidth*20),
    easing: "linear",
    complete: function() {
                $(this).css({marginLeft:0}).find("li:last").after($(this).find("li:first"));
              }
  })
});
requestAnimationFrame(customMarq);
})();

// Handle utility bar marquee animation (on mobile)
window.addEventListener('DOMContentLoaded', function() {
  var slideContainer = document.querySelector('.slideContainer--utilitybar');
  var slideWidth = slideContainer.scrollWidth;
  var animationEndPosition = -slideWidth / 2;
  var keyFrames = [
    { transform: 'translateX(0px)' },
    { transform: 'translateX(' + animationEndPosition + 'px)' }
  ];
  var animationTiming = {
    duration: (slideWidth/100) * 1000,
    iterations: Infinity
  };
  slideContainer.animate(
    keyFrames,
    animationTiming
  );
});


/*=============================================
  YouTube API
=============================================*/

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var YoutubePlayerEvent = (function() {
  var PLAY = "event:play";
  var STOP = "event:stop";
  var PAUSE = "event:pause";
  var PAUSE_ALL = new Event(PAUSE, {bubbles: true});

  return {
      events: {
          PLAY: PLAY,
          STOP: STOP
      },
      pauseAllVideo: function () {
          document.dispatchEvent(PAUSE_ALL);
      },
      onPause: function (callback) {
          document.addEventListener(PAUSE, callback);
      }
  }
})();

// $(function() {

  var ytPlayers = new Array();

  function onYouTubePlayerAPIReady() {
    var yp = $('iframe[src*="//www.youtube-nocookie.com/embed/"]');
    for (var i = 0; i < yp.length; i++) {
        var t = new YT.Player($(yp[i]).attr('id'), {
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'autohide': 1,
                'enablejsapi': 1,
                'wmode':'opaque',
                'origin': window.location.href
            }
        });
        ytPlayers.push(t);
    };

    YoutubePlayerEvent.onPause(function(e) {
      for (var i = 0; i < ytPlayers.length; i++) {
          ytPlayers[i].pauseVideo();
      }
    });
  }
  onYouTubePlayerAPIReady();

// })