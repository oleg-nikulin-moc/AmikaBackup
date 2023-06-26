(function (b) { function c() { } for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","), a;a = d.pop();) { b[a] = b[a] || c } })((function () {
  try { console.log(); return window.console; } catch (err) { return window.console = {}; }
})());

// Minified version of isMobile
!function (a) { var b = /iPhone/i, c = /iPod/i, d = /iPad/i, e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, f = /Android/i, g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i, h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i, i = /IEMobile/i, j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, k = /BlackBerry/i, l = /BB10/i, m = /Opera Mini/i, n = /(CriOS|Chrome)(?=.*\bMobile\b)/i, o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"), q = function (a, b) { return a.test(b) }, r = function (a) { var r = a || navigator.userAgent, s = r.split("[FBAN"); return "undefined" != typeof s[1] && (r = s[0]), s = r.split("Twitter"), "undefined" != typeof s[1] && (r = s[0]), this.apple = { phone: q(b, r), ipod: q(c, r), tablet: !q(b, r) && q(d, r), device: q(b, r) || q(c, r) || q(d, r) }, this.amazon = { phone: q(g, r), tablet: !q(g, r) && q(h, r), device: q(g, r) || q(h, r) }, this.android = { phone: q(g, r) || q(e, r), tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)), device: q(g, r) || q(h, r) || q(e, r) || q(f, r) }, this.windows = { phone: q(i, r), tablet: q(j, r), device: q(i, r) || q(j, r) }, this.other = { blackberry: q(k, r), blackberry10: q(l, r), opera: q(m, r), firefox: q(o, r), chrome: q(n, r), device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r) }, this.seven_inch = q(p, r), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window ? this : void 0 }, s = function () { var a = new r; return a.Class = r, a }; "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = r : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = s() : "function" == typeof define && define.amd ? define("isMobile", [], a.isMobile = s()) : a.isMobile = s() }(this);

var formatMoney = "$ \{\{amount\}\}";
var MAX_PRODUCTS = location.pathname.indexOf('liter-pump-set-of-2') > 2 ? 20 : 3

jQuery(function ($) {

  if (!isMobile.any) {
    $('body').addClass('isNotMobile');
  }
  if (isMobile.any || !$('body').hasClass('templateIndex')) {
    setTimeout(function () {
      $('.content-wrapper').css('padding-top', $('#header').height());
      $(window).resize(function () {
        $('.content-wrapper').css('padding-top', $('#header').height());
      });
    }, 200);
  }
  $(document).on("click", ".quantity .minus:not(.rs-quant), .qtty .minus", function () {
    var wrapper = $(this).parent();
    try {
      wrapper.find('input[type=number]').get(0).stepDown();
      wrapper.find('input[type=number]').change();
    } catch (e) {
      var value = (parseInt(wrapper.find('input[type=number]').val()) - 1);
      wrapper.find('input[type=number]').val((value >= 1 ? value : 1));
      wrapper.find('input[type=number]').change();
    }
  });
  $(document).on("click", ".quantity .plus:not(.rs-quant), .qtty .plus", function () {
    var wrapper = $(this).parent();
    var max = MAX_PRODUCTS;
    try {
      if (wrapper.find('input[type=number]').get(0).val() < max) {
        wrapper.find('input[type=number]').get(0).stepUp();
        wrapper.find('input[type=number]').change();
      }
    } catch (e) {
      var value = (parseInt(wrapper.find('input[type=number]').val()) + 1);
      if (parseInt(wrapper.find('input[type=number]').val()) < max) {
        wrapper.find('input[type=number]').val(value);
        wrapper.find('input[type=number]').change();
      }
    }
  });

  if ($('.side-cart').length > 0) {
    initSideCart();
  }

  $(function() {
      $('.add-to-cart-form').on('submit', function(e) {

      // Prevents form from submitting. A post is performed in addToCart if
      // validateAddCart returns true. If we don't prevent the form from submitting
      // at this point, an add to cart event gets fired twice, which can throw
      // of tracking apps like FB Pixel
      e.preventDefault();

      if (validateAddCart($(this))) {
        addToCart($(this));
      }
      return false;
    });

  });


  $(window).scroll(function () {
    BackTop();

    $('.target').each(function () {
      if ($(window).scrollTop() >= $(this).position().top - 100) {
        var id = $(this).attr('id');
        $('.floating-nav a').removeClass('active');
        $('.floating-nav a[href=#' + id + ']').addClass('active');
      }
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        $('.floating-nav a').removeClass('active');
        $('.floating-nav a[href=#join-us]').addClass('active');
      }
    });
  });

  if (window.location.href === "https://loveamika.com/collections/flash-sale") {

  } else {

    // Refersion function for checking the URL for 'rfsn'
    function refersion_getQS(e){
      e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
      var t=new RegExp("[\\?&]"+e+"=([^&#]*)"),n=t.exec(location.search);
      return n==null?"":decodeURIComponent(n[1].replace(/\+/g," "))
    };

    //logic to show refersion modal and suppress promotion modal
    if (refersion_getQS('rfsn')) {
      Cookies.set('promotion_showed', '1');
    } else {
      $(document).ready(function () {
        if (!Cookies.get('promotion_showed') && showPageloadPopup) {
          if (window.screen.width > 767) {
            setTimeout(function () {
              modal = new tingle.modal({
                closeMethods: ['overlay', 'button', 'escape'],
                closeLabel: " ",
                cssClass: ['promotion-popup']
              });
              modal.setContent($('#promotion-pop-up'));
              modal.open();

              Cookies.set('promotion_showed', '1');
            }, 2000);
          }
        }
      });
    }
  }


  $('#footer .mailing-list form').submit(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $(this).find('.error').removeClass('error');

    var error = false;
    $(this).find('.required').each(function () {
      if ($(this).val() == "") {
        error = true;
        $(this).addClass('error');
      }
    });
    if (!error) {
      if (!validateEmail($(this).find('.email').val())) {
        error = true;
        $(this).find('.email').addClass('error');
      }
    }

    if (!error) {
      var form = $(this);
      $.ajax({
        url: (form.attr('data-ajax-submit') || form.attr('action')),
        data: form.serialize(),
        type: 'POST'
      }).done(function () {
        $('#footer .mailing-list form').fadeOut(function () {
          $('#footer .mailing-list .success').fadeIn();

          //Removing modal on submit
          // modal = new tingle.modal({
          //   closeMethods: ['overlay', 'button', 'escape'],
          //   closeLabel: "",
          //   cssClass: ['promotion-popup']
          // });
          // modal.setContent($('#promotion-pop-up-success'));
          // modal.open();
        });
      });
    }
  });

  $(".floating-nav a").on("click", function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - 50 }, 1000);
  });

  $(".accordion .acc-item h2").on("click", function (event) {
    event.preventDefault();
    requestAnimationFrame(() => {
      $(".acc-content.open").slideUp();

      const $accItem = $(this).closest(".acc-item");
      const $accContent = $accItem.find(".acc-content");
  
      if ($accContent.hasClass('open')) {
        $accItem.removeClass('open');
        $accContent.removeClass('open');
      } else {
        $(".acc-item.open").removeClass('open');
        $(".acc-content.open").removeClass('open');
        $accItem.addClass('open');
        $accContent.addClass('open').slideDown();
      }
    });
  });

  $("form input").focusout(function () {
    if ($(this).val() != "") {
      $(this).addClass('not-empty');
    } else {
      $(this).removeClass('not-empty');
    }
  });

  var rand = Math.random();
  $("body").addClass('cursor-' + (Math.floor(rand * 3) + 1));
  $("#utility-bar").addClass('color-' + (Math.floor(rand * 5) + 1));

  $(".search-form").on("submit", function (event) {
    event.preventDefault();
    if ($(this).find('input[name="q"]').val() != "") {
      var searchUrl = '/search?q=title:"' + $(this).find('input[name="q"]').val() + '"%20OR%20tag:"' + $(this).find('input[name="q"]').val() + '"&type=product'
    } else {
      var searchUrl = '/search';
    }
    location.href = searchUrl;
  });




  $(document).on("click", '.quick-view-btn', function () {
    $('#loading-overlay').show();

    // instanciate new modal
    modal = new tingle.modal({
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['quick-view'],
      onOpen: function () {
        $('.tingle-modal-box__content .quick-view').append('<button class=aclose>x</button>');
        $('.tingle-modal-box__content, .tingle-modal-box__content .quick-view .aclose').on('click', function (e) {
          if (e.target == e.currentTarget) {
            modal.close()
          }
        })
      }
    });



    $.ajax({
      url: $(this).attr('data-url') + '?view=quick-view',
      cache: false
    }).success(function (data) {
      $('#loading-overlay').hide();

      modal.setContent(data);
      modal.open();

      setTimeout(function () {
        modal.checkOverflow();
      }, 200);

      var initStockQuickview = function () {
        setTimeout(function () {
          try {
            iStockInit();
          } catch (err) {
            initStockQuickview();
          }

        }, 500);
      }
      initStockQuickview();
    });

    return false;
  });

  // .product-item-old selector applies to 'older' site design, still active as of 8/18/20
  var producItemNewSelectorStr = ', .product-item-new .single__product__add, .product-item-new .quickbuy__btn';
  $(document).on("click", '.product-item-old .quickbuy__options .quickbuy__item'+producItemNewSelectorStr, function (e) {
    e.preventDefault();
    $('#loading-overlay').show();
    let this__el = this
    let prd__id_to_add = 0;
    // Get the varient id to add
    prd__id_to_add = $(this__el).data('variant');
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {
        quantity: 1,
        id: prd__id_to_add,
      },
      dataType: 'json',
      error: addToCartFail,
      success: function (data) {
        $(this__el).parent().parent().removeClass('active');
        $(this__el).parent().parent().addClass('added__rs');
        addToCartSuccess();
        // Reset the div to Previous State
        setTimeout(function () {
          //Remove Notification after 3000ms
          $(this__el).parent().parent().removeClass('added__rs');
          $('#collection .product-item').removeClass("small--one-whole").addClass('small--one-half');
          if ($.scaMagnificPopup) { $.scaMagnificPopup.close(); } else { $.magnificPopup.close(); }
        }, 3000);
      },
      cache: false
    });
  });

  $(document).on("click", '.popped__mobile.product-item-new .quickbuy__item input', function (e) {

    $('#loading-overlay').show();
    let this__el = this
    let prd__id_to_add = 0;
    // Get the varient id to add
    prd__id_to_add = $(this__el).data('variant');
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {
        quantity: 1,
        id: prd__id_to_add,
      },
      dataType: 'json',
      error: addToCartFail,
      success: function (data) {
        $(this__el).parent().parent().removeClass('active');
        $(this__el).parent().parent().addClass('added__rs');
        addToCartSuccess();
        // Reset the div to Previous State
        setTimeout(function () {
          //Remove Notification after 3000ms
          $(this__el).parent().parent().removeClass('added__rs');
          $('#collection .product-item').removeClass("small--one-whole").addClass('small--one-half');
          if ($.scaMagnificPopup) { $.scaMagnificPopup.close(); } else { $.magnificPopup.close(); }
        }, 3000);
      },
      cache: false
    });
  });
  // .product-item-old selector applies to 'older' site design, still active as of 8/18/20, when this is no longer in use, do not use this event trigger
  $(document).on("click", '.product-item-old .quickbuy__btn', function () {
    $(this).parent().addClass('active');
  });
  // Reset the div to Previous State
  $(document).on("mouseleave", '.product-item-old .image-wrapper', function () {
    $(this).find('.quickbuy__rs').removeClass('active added__rs');
  });

  $(document).on("click", '.product-item-old .single__product__add', function () {
    $('#loading-overlay').show();
    var this__el = this
    let prd__id_to_add = 0;
    // Get the varient id to add
    prd__id_to_add = $(this__el).attr('data-variant');

    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {
        quantity: 1,
        id: prd__id_to_add,
      },
      dataType: 'json',
      error: addToCartFail,
      success: function (data) {
        $(this__el).parent().addClass('added__rs');
        addToCartSuccess();
        // Reset the div to Previous State
        setTimeout(function () {
          //Remove Notification after 3000ms
          $(this__el).parent().removeClass('added__rs');
          $('#collection .product-item').removeClass("small--one-whole").addClass('small--one-half');
          if ($.scaMagnificPopup) { $.scaMagnificPopup.close(); } else { $.magnificPopup.close(); }
        }, 3000);

      },
      cache: false
    });

  });


  $('input[type="radio"]').on('click', function (e) {
    var $product_item = $(this).closest('.product-item');
    var $quickbuy_btn = $product_item.find('.quickbuy__btn');
    var variant_id = $(this).data('variant');
    var price_string = $(this).data('price_string');

    $quickbuy_btn.data('variant', variant_id).attr('data-variant', variant_id);
    $quickbuy_btn.find('.selected_variant_price').html(price_string);
  });
  ///////////////////
  //For mobile

  $(document).on("click touchstart", '.rs__mobile_options', function () {
    let this__el = this;
    let this__popup = $(this__el).parents('.product-item').clone(true).addClass('popped__mobile').css({ width: 'inherit' });

    // ie do not apply this to PDP redesign 8/18/20
    // .product-item-old selector applies to 'older' site design, still active as of 8/18/20, do not use when this design is not in use
    if ( $(this__popup).hasClass('product-item-old') ) {
      $(this__popup).find('.quickbuy__rs').addClass('active');
    }

    if ($.scaMagnificPopup) {
      $.scaMagnificPopup.open({
        items: {
          src: this__popup,
          type: 'inline'
        },
        callbacks: {
          beforeOpen: function () {
            $('html,body').css('overflow', 'hidden');
          },
          beforeClose: function () {
            $('html,body').css('overflow', 'auto');
          }
        }
      });
    }
    else {
      $.magnificPopup.open({
        items: {
          src: this__popup,
          type: 'inline'
        },
        callbacks: {
          beforeOpen: function () {
            $('html,body').css('overflow', 'hidden');
          },
          beforeClose: function () {
            $('html,body').css('overflow', 'auto');
          }
        }
      });
    }

  });

});


function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validateAddCart(form) {
  var limitValidation = true;

  if (form.find('input[name=id]').val() == '') {
    var allOptionsSelected;
    if (form.find('.single-option-selector').length > 0) {
      allOptionsSelected = true;
      form.find('.single-option-selector').each(function () {
        if ($(this).val() == "") {
          allOptionsSelected = false;
          return false;
        }
      });
    } else {
      allOptionsSelected = false;
    }

    if (allOptionsSelected) {
      var errorMsg = form.find('.validation-msg').text();
      if (errorMsg) {
        alert(errorMsg);
      } else {
        alert("The selected variant is sold out.");
      }
    } else {
      var labels = [];
      form.find('.options label').each(function (key, obj) {
        labels.push($(obj).text().replace(':', '').trim());
      });
      alert("You must select a " + labels.join('/') + ".");
    }
    return false;
  }

  if (parseInt(form.find('#quantity').val()) > MAX_PRODUCTS) {
    limitValidation = false;
  }
  if (cartJson.item_count > 0) {
    $.each(cartJson.items, function (key, val) {
      if (val.variant_id == form.find('.variant-id').val()) {
        if ((val.quantity + parseInt(form.find('#quantity').val())) > MAX_PRODUCTS) {
          limitValidation = false;
        }
      }
    });
  }
  if (!limitValidation) {
    modal = new tingle.modal({
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['message']
    });
    modal.setContent('<div class="error-limit">Sorry, you can buy a maximum of ' + MAX_PRODUCTS + ' items of each product.<br>Please change the quantity and try again.</div>');
    modal.open();

    return false;
  }

  return true;
}

function initSideCart() {
  $('.header .cart-wrap > a').click(function (e) {
    e.stopPropagation();
    $('.side-cart').addClass('active');
    $(this).closest('.cart-wrap').find('.side__cart--overlay').addClass('active');
    $('html').addClass('no__overflow');
    $('.mm-slideout').addClass('side__cart--active');
    return false;
  });
  $(document).on('click', '.side__cart--overlay', function (event) {
    $('.side-cart').removeClass('active');
    $(this).removeClass('active');
    $('html').removeClass('no__overflow');
    $('.mm-slideout').removeClass('side__cart--active');
  });
  $(document).click(function (event) {
    if (!$(event.target).closest('.side-cart').length && $(event.target).attr('id') != "loading-overlay" && $('.side-cart').hasClass('open')) {
      $('.header .cart-wrap .side-cart').slideUp();
    }
  });
}

/**
 * Page-specific call-backs
 * Called after dom has loaded.
 */
var RADIANCE = {

  common: {
    init: function () {
      $('html').removeClass('no-js').addClass('js');
      setupDropdownMenus();

      $('.nav-arrow', '#top-menu').each(function () {
        $(this).css('top', Math.ceil($(this).parent(2).height() / 2) + 1);
      });
    }
  },

  templateIndex: {
    init: function () {
      //TERRIBLE: something on the index has killed the hovermenus
      //same dom element, just no event listeners. I updated the 6 year old hover intent thing, but that didn't help.
      setTimeout(setupDropdownMenus, 900);
      //a sure sign something has horribly wrong.
      setTimeout(setupDropdownMenus, 1900);
      //even worse. doesn't seem to hurt, and sometimes The Bad Thing hasn't happened in the first second.
      setTimeout(setupDropdownMenus, 6000);
    }
  },

  templateProduct: {
    init: function () {
      $('#thumbs li:nth-child(5n+5)').addClass('last-in-row');
    }
  },

  templateCart: {
    init: function () {
      var checkInstructionsNote = function () {
        if ($('#chk-is-instructions').is(':checked')) {
          $('#is-instructions').val('Yes');
          $('#instructions-note').show();
        } else {
          $('#is-instructions').val('No');
          $('#instructions-note').hide();
          $('#instructions-note').find('textarea').val("");
        }
      }
      $('#chk-is-instructions').click(function () {
        checkInstructionsNote();
      });
      checkInstructionsNote();
    }
  }

}

var UTIL = {

  fire: function (func, funcname, args) {
    var namespace = RADIANCE;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function') {
      namespace[func][funcname](args);
    }
  },

  loadEvents: function () {
    var bodyId = document.body.id;

    // hit up common first.
    UTIL.fire('common');

    // do all the classes too.
    $.each(document.body.className.split(/\s+/), function (i, classnm) {
      UTIL.fire(classnm);
      UTIL.fire(classnm, bodyId);
    });
  }

};
$(document).ready(UTIL.loadEvents);

/**
 * Support for dropdown menus
 */
function setupDropdownMenus() {
  $('.main-menu .has-dropdown').hoverIntent(navRollOver, navRollOut);

  function navRollOver(e) {
    $(this).addClass('active').find('ul:first').slideDown();
  }
  function navRollOut(e) {
    $(this).removeClass('active').find('ul:first').slideUp();
  }
}


function setupDropdownMenusSlow() {
  //$('.main-menu .has-dropdown').hoverIntent( navRollOver, navRollOut );

  function navRollOver(e) {
    $(this).addClass('active').find('ul:first').slideDown(800);
  }
  function navRollOut(e) {
    $(this).removeClass('active').find('ul:first').slideUp(800);
  }
}
// check if product contains prop65 tag
//         if yes, show prop65 popup

function prop65(data) {
  $.getJSON("/products/" + data.handle + ".json", function () {
    console.log("success");
  })
    .done(function (p_data) {
      var p__tags = p_data['product'].tags;
      if (p__tags.includes('prop65')) {
        prop__model = new tingle.modal({
          closeMethods: ['overlay', 'button', 'escape'],
          closeLabel: "",
          cssClass: ['promotion-popup', 'prop__65']
        });
        prop__model.setContent($('#prop65-pop-up'));
        prop__model.open();
      }
    })
}
/**
 * Ajaxy add-to-cart
 */
function addToCart(form) {
  //$('#loading-overlay').show();
  if (modal) modal.close();
  $('#loading-overlay').show();

  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: form.serialize(),
    dataType: 'json',
    error: addToCartFail,
    success: function (data) {
      $('.test').trigger('click');
      $("#cart-qty").attr('value', data.quantity);
      addToCartSuccess();
    },
    cache: false
  });
  $('.content-available').magnificPopup({
    delegate: '.test',
    removalDelay: 500, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function () {
        this.st.mainClass = 'mfp-newspaper';
      }
    },
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
}




function addToCartSuccess(jqXHR, textStatus, errorThrown) {
  updateCartDesc();
  freeGiftHandler(false);
  //   	prop65(jqXHR);
}

function addToCartFail(jqXHR, textStatus, errorThrown) {
  var response = $.parseJSON(jqXHR.responseText);
  $('#loading-overlay').hide();
  modal = new tingle.modal({
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['message']
  });
  modal.setContent('<div class="error-itemincart">' + response.description + '</div>');
  modal.open();
}

function removeItemFromCart(lineKey) {
  $('#loading-overlay').show();

  let update_data = {};
  if (lineKey) {
    update_data[lineKey] = 0
  }

  $.ajax({
    type: 'POST',
    url: '/cart/update.js',
    data: { updates : update_data},
    dataType: 'json',
    error: function () {
      updateCartDesc();
      $('#loading-overlay').hide();
    },
    success: function () {
      updateCartDesc();
      $('#loading-overlay').hide();
    },
    cache: false
  });
}

function updateCartDesc() {
  $.ajax({
    type: 'GET',
    url: '/cart?view=side-cart',
    cache: false,
    success: function (data) {
      $('#loading-overlay').hide();
      $('.cart-wrap > .side__cart--overlay').addClass('active');
      $('html').addClass('no__overflow');
      $('.mm-slideout').addClass('side__cart--active');
      var animate = true;
      //           	if($('.side-cart').width()>0 && $('.side-cart').hasClass('open')) {
      //               	animate = false;
      //             }
      $('.side-cart').each(function () {
        //               var visible = $(this).is(':visible');
        var parent = $(this).parent();
        $(this).remove();
        parent.append(data);
        //               if(visible) {
        //                 parent.find('.side-cart').show();
        //               }
      });
      //$('#page').append(data);
      $('.side-cart').addClass('active');
      if (!animate) {
        $('.side-cart').removeClass('ease-animation-med');
      }
      //          	if(modal) modal.close();
      if (!$('.side-cart').is(':visible')) {
        if ($('.header-drop:visible').hasClass('scroll')) {
          $('.header-drop.scroll:visible .cart-wrap a:first').click();
        } else {
          $('#header .top-utils .cart-wrap a:first').click();
        }
      }
      if ($('.side-cart').length > 0) {
        var itemsCount = 0;
        $('.side-cart').first().find('.quantity input[type=number].qty-input').each(function () {
          itemsCount += parseInt($(this).val());
        });
        $('.cart-wrap span.count').html(itemsCount);
        $('#mmenu-cart-count').html(itemsCount);
        if (itemsCount > 0) {
          $('.cart-wrap span.count').removeClass('hide');
          $('.cart-wrap span.count').show();
        } else {
          $('.cart-wrap span.count').hide();
        }
      }
    }
  });
}

function showSideCart(animate) {

//don't show the cart if a modal is already up
if ($('body > div.tingle-modal').length) {return;}
//this is why we use add to cart events.

  if (animate) {
    setTimeout(function () { $('.side-cart').addClass('open') }, 100);
  } else {
    $('.side-cart').addClass('open');
    setTimeout(function () { $('.side-cart').addClass('ease-animation-med') }, 200);
  }
}

function hideSideCart() {
  $('.side-cart').removeClass('active');
  $('.side__cart--overlay').removeClass('active');
  $('html').removeClass('no__overflow');
  $('.mm-slideout').removeClass('side__cart--active');
}

function getQueryParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function openModal(content) {
  modal = new tingle.modal({
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close"
  });
  modal.setContent(content);
  modal.open();
}

function sticky(y, element, elementTop) {
  if ((y + $("#header").height()) >= elementTop) {
    $(element).addClass('fixed');
    $(element).css('top', $("#header").height());
  } else {
    $(element).removeClass('fixed');
  }
}



$(document).ready(function () {
  if (!isMobile.any) {
    if ($('.collection-top').length > 0) {
      var top = $('.collection-top').offset().top;
    }
    if ($('.sidebar-collection').length > 0) {
      var topSidebar = $('.sidebar-collection').offset().top;
    }
    $(window).scroll(function (event) {
      if ($('.collection-top').length > 0) {
        var y = $(this).scrollTop();
        if (y >= top) {
          $('#collection').css('padding-top', $('.collection-top').innerHeight());
          $('.collection-top').addClass('sticky');
          $('.collection-top').css('top', $("#header").height());
        } else {
          $('.collection-top').removeClass('sticky');
          $('#collection').css('padding-top', '');
          $('.collection-top').css('top', '');
        }
      }

    });
  }
});




$(function () {
  var itemsCount = 0;
  $('.side-cart').first().find('.quantity input[type=number].qty-input').each(function () {
    itemsCount += parseInt($(this).val());
  });
  $('.header .cart-wrap span.count').html(itemsCount);
  $('#mmenu-cart-count').html(itemsCount);
  if (itemsCount > 0) {
    $('.cart-wrap span.count').removeClass('hide');
    $('.header .cart-wrap span.count').show();
  }

  function updateCart(item) {
    $('#loading-overlay').show();
    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: $(item).closest('form').serialize(),
      dataType: 'json',
      error: function () {
        $('.side-cart').removeClass('active');
        $('.side__cart--overlay').removeClass('active');
        $('html').removeClass('no__overflow');
        $('.mm-slideout').removeClass('side__cart--active');
        console.log('error');
      },
      success: function () {
        addToCartSuccess();
        //         $('#add-cart-overlay').fadeOut();
      },
    });
  }

  $(document).on("click", '.side-cart .remove', function () {
    $(this).closest('.item').find('input[type=number]').val(0);
    updateCart($(this));
  });

  $(document).on("change", '.side-cart input[type=number]', function () {
    updateCart($(this));
  });
});

$(document).on('click', '.heading__section', function () {
  $(this).find('.toggle__icon').toggleClass('opened');
  $(this).parents('.sample__top--section').find('.sample__data--section').slideToggle();
});






prodIds = {};
var tries = 15;

$(document).ready(function () {
  // Handling the Ajax Cart number of items in the cart
  $(document).on("click", ".side-cart .free-sample a", function (event) {
    prodIds = {};
    if (!$(this).hasClass('selected')) {
      event.preventDefault();
      if ($(".side-cart .free-sample a.selected").length < 2) {
        $('#loading-overlay').show();
        prodIds.id = $(this).data('id');
        prodIds.quantity = 1;
        prodIds.properties = { 'offer_type': 'sample'}
        samplesOperations();
      }
      else {
         $('.sample__maxError').show();
        setTimeout(function() {
          $('.sample__maxError').hide();
        }, 4000);
      }
    }
    else {
      removeItemFromCart($(this).data('key'));
    }
  });

  $(document).on("click", ".side-cart .free-gift a", function (event) {
    prodIds = {};
    if (!$(this).hasClass('selected')) {
      event.preventDefault();
      if ($(".side-cart .free-gift a.selected").length < 1) {
        $('#loading-overlay').show();
        prodIds.id = $(this).data('id');
        prodIds.quantity = 1;
        prodIds.properties = { 'offer_type': 'gift'}
        samplesOperations();
      }
      else {
         $('.gift__maxError').show();
        setTimeout(function() {
          $('.gift__maxError').hide();
        }, 4000);
      }
    }
    else {
      removeItemFromCart($(this).data('key'));
    }
  });

});

$(document).ready(function () {
  $(document).on("click", ".cart__page--free-sample a", function (event) {
    prodIds = {};
    if (!$(this).hasClass('selected')) {
      event.preventDefault();
      if ($(".cart__page--free-sample a.selected").length < 2 ) {
        prodIds.id = $(this).data('id');
        prodIds.quantity = 1;
        prodIds.properties = { 'offer_type': 'sample'}
        cartSamplesOperations();
      }
      else {
         $('.sample__maxError').show();
        setTimeout(function() {
          $('.sample__maxError').hide();
        }, 4000);
      }
    }
    else {
      cartSamplesOperations($(this).data('key'));
    }
  });

  $(document).on("click", ".cart__page--free-gift a", function (event) {
    prodIds = {};
    if (!$(this).hasClass('selected')) {
      event.preventDefault();
      if ($(".cart__page--free-gift a.selected").length < 1 ) {
        prodIds.id = $(this).data('id');
        prodIds.quantity = 1;
        prodIds.properties = { 'offer_type': 'gift'}
        cartSamplesOperations();
      }
      else {
         $('.gift__maxError').show();
        setTimeout(function() {
          $('.gift__maxError').hide();
        }, 4000);
      }
    }
    else {
      cartSamplesOperations($(this).data('key'));
    }
  });
});


function cartSamplesOperations(remove_line_item) {
  ga('send', 'event', 'opt-in', 'selected', $('.free-sample .selected span').toArray().map(function (o) { return $(o).text().trim() }).join(':'));

  if(remove_line_item) {
    // Removed the line items
    let update__Item = {}
    update__Item[remove_line_item] = 0;

    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: {updates:update__Item},
      dataType: 'json',
      error: function(){console.log('fail');},
      success: function(){
        //Reload Cart
        location.reload();
      },
      cache: false
    });
  } else {
    // Added the line items
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: { items : [ prodIds ] },
      dataType: 'json',
      error: function () { console.log('fail'); },
      success: function () {
        if (window.location.href.toLowerCase().indexOf('next') > -1) {
          location.href = "/checkout"; //forwarding on from ajax cart "checkout" button click
        }
        else {
          location.reload();
        }
      },
      cache: false
    });
  }

}

function samplesOperations() {
  ga('send', 'event', 'opt-in', 'selected', $('.free-sample .selected span').toArray().map(function (o) { return $(o).text().trim() }).join(':'));
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: { items : [ prodIds ] },
    dataType: 'json',
    error: function () { console.log('fail'); },
    success: function () {
      if (window.location.href.toLowerCase().indexOf('next') > -1) {
        location.href = "/checkout"; //forwarding on from ajax cart "checkout" button click
      }
      else {
        addToCartSuccess();
      }
    },
    cache: false
  });
}

setTimeout(function () {
  $('.loader__wrapper').hide();
  $('.donation').show();
}, 5000);
