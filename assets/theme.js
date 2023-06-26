/**==Polyfill==**/
//TODO: see if this is needed: I tried to use the $().trigger to avoid this, but versions of this out in the wild seem to have had that replaced with new CustomEvent(), so maybe that doesn't work either?
//PICK A CONSISTENT EVENT MODEL
//BETTER: write an event model that runs on animationFrame, limits the amount of work it does per frame.
// - see also https://github.com/wilsonpage/fastdom
// - move DOM manipulation out of the UI response
// - issues: disabling a button via addClass('disabled') would need another, internal disable to prevent a second click coming in before the UI update runs
(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

// no slate/sections.js
/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(product,options) {
    this.product = product;
    this.$container = options.$container;
    this.singleOptionSelector = options.singleOptionSelector;
//    this.originalSelectorId = options.originalSelectorId;
    this.masterSelect = $(options.originalSelectorId, this.$container)[0]
    //might plugins change that? Making it better to search every time?
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = 'not init-d';//not null, which is not selected, but not yet initialized

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
    $('.custom-select .select-items div', this.$container).on('click', this._onSelectChange.bind(this));
  }

  /**
   * Get the currently selected options from add-to-cart form. Works with all
   * form input elements.
   *
   * @return {array} options - Values of currently selected variants
   */
  Variants.prototype._getCurrentOptions = function() {
    var currentOptions = [];
    $.each($(this.singleOptionSelector, this.$container), function(i,element) {
      var $element = $(element);
      var type = $element.attr('type');
      var currentOption = {};

      if (type === 'radio' || type === 'checkbox') {
        if ($element[0].checked) {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          currentOptions.push(currentOption);
        }
      } else {
        currentOption.value = $element.val();
        currentOption.index = $element.data('index');
        currentOptions.push(currentOption);
      }
    });

    return currentOptions;
  }

  /**
   * Find variant based on selected values.
   * Update: don't return a first variant, either, only hard matches. Let the first_or_selected deal with that concept.
   *
   * @return {event}  restriction  - all the variants that match the selections. Could be 0, 1, or more. Listen for this if you need to produce content for only active variants.
   * @return {object || undefined} found - Variant object from product.variants
   */
  Variants.prototype._getVariantFromOptions = function() {
    var found = false;
    var selectedValues = this._getCurrentOptions();
    if (selectedValues.length == 0) {
      return null;
    }
    var variants = this.product.variants;
    var out = [];

    variants.forEach(function(variant) { 
      var satisfied = true;
      var sasified = false;

      selectedValues.forEach(function(option) {
        if (satisfied) {
          satisfied = (option.value === Shopifyhandleize(variant[option.index]));
        }
        sasified |= (option.value === Shopifyhandleize(variant[option.index]));
      }); 

//Prob: need this to be both more and less picky: if this gets called with 2/3 varients selected, do not return found
//but do return any matching variants in out
      if (sasified) {
        out.push(variant);
      }

      if (satisfied) {
        found = variant;
      }
    });

    if (out.length === 1) {
      //didn't actually find anything, but did filter it down to only one option.
      found = out[0];
      //close enough?
    }

    this.$container.trigger({
      type: 'restriction',
      variants: out,
      selection: selectedValues,
      variant: found
    });

    return found || null;
  }

  /**
   * Event handler for when a variant input changes.
   * @return {event}  variantChange
   */
  Variants.prototype._onSelectChange = function(e) {

    if ( e && e.target && $(e.target).hasClass( this.singleOptionSelector.substring(1) ) ) {
      var dataTag = $(e.target).val();
      var dataIndex = $(e.target).data('index');
      $('.submenuholder[data-index="'+dataIndex+'"] .filter-item').removeClass('filter-selected');
      $('.submenuholder[data-index="'+dataIndex+'"] .filter-item[data-tag="'+ dataTag +'"]').addClass('filter-selected');
    } else if ( e && e.target && $(e.target).hasClass( 'same-as-selected' ) ) {
      // var dataTag = Shopifyhandleize($(e.target).text());
      var target = $(e.target).closest('.custom-select').find('select');
      var dataTag = target.val();
      var dataIndex = target.data('index');
      $('.submenuholder[data-index="'+dataIndex+'"] .filter-item').removeClass('filter-selected');
      $('.submenuholder[data-index="'+dataIndex+'"] .filter-item[data-tag="'+ dataTag +'"]').addClass('filter-selected');
    }

    var variant = this._getVariantFromOptions();
    if (this.currentVariant === variant) {
      return;
    }

    if (this.product.variants.length === 1) {
      variant = this.product.variants[0];
    }

    this.$container.trigger({
      type: 'variantChange',
      variant: variant
    });

    if (!variant) {
      this.currentVariant = variant;
      return;
    }

    this._updateMasterSelect(variant);
    //these are useless currently
    this._updateImages(variant);//Done automatically by the slick-filter
    this._updatePrice(variant);//Done automatically by the productRender
    //but I'm not opposed to triggering events
    this.currentVariant = variant;

    if (this.enableHistoryState) {
      this._updateHistoryState(variant);
    }
  }

  /**
   * Trigger event when variant image changes
   *
   * @param  {object} variant - Currently selected variant
   * @return {event}  variantImageChange
   */
  Variants.prototype._updateImages = function(variant) {
    if (this.currentVariant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }
    }

    this.$container.trigger({
      type: 'variantImageChange',
      variant: variant
    });
  }

  /**
   * Trigger event when variant price changes.
   *
   * @param  {object} variant - Currently selected variant
   * @return {event} variantPriceChange
   */
  Variants.prototype._updatePrice = function(variant) {
    if (this.currentVariant && variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
      return;
    }

    this.$container.trigger({
      type: 'variantPriceChange',
      variant: variant
    });
  }

  /**
   * Update history state for product deeplinking
   *
   * @param {object} variant - Currently selected variant
   */
  Variants.prototype._updateHistoryState = function(variant) {
    if (!this.currentVariant || !history.replaceState || !variant) {
      return;
    }

    if(window.location.search == '') {
      var oldurl = window.location.search + '?' || '&';
    } else {
      var oldurl = window.location.search + '&' || '?';
    }
    oldurl = oldurl.replace(/variant=[0-9]+&?/,'').replace('??', '?');
    var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + oldurl + 'variant=' + variant.id;
    window.history.replaceState({path: newurl}, '', newurl);
  }

  /**
   * Update hidden master select of variant change
   *
   * @param {object} variant - Currently selected variant
   */
  Variants.prototype._updateMasterSelect = function(variant) {
    this.masterSelect.value = variant.id;
  }

  return Variants;
})();

/*================ Sections ================*/
// no sections/product.js
//load this instead:
/**
 * Related to the original sections/product.js, but more focused, and faster, like a weasel.
 * @namespace product
 */
theme.ProductFilter = (function() {
  var selectors = {
    addToCart: '.add-to-cart',
    mainATCContainer: '#atc-main',
    fixedATCContainer: '#atc-fixed',
    atcImg: '.img-holder',
    quantity: '.quantity',
    atcHover: '.add-to-cart, .quantity',
    originalSelectorId: '.product-select',
    singleOptionSelector: '.single-option-selector',
    product_info: '.product_info',
    bisTrigger: 'a.bis-trigger.cta',
    sidebar: '.pdp-sidebar',
    price: '.price',
    featuredImage: '.product-images',
    imgThumbs: '.pslider_small',
    photoSwipe: '.pswp',
    psTrigger: '.ps-trigger, .zoomImg',
    rsProductInfo: '.rs-product-info',
    infoContainer: '.info-container',
    forMobile: '.for-mobile',
    wishlist: '.rs_wishlist',
    sizeFilter: '.submenuholder[data-label="Size"]',
    rsFilterVariant: '#rs-filtervariant',
    atcForm: 'form#product-actions',
    atcOverlayFixed: '.atc-overlay-fixed',
    afterpay: '.afterpay',
    yotpo: '.review-ratings .yotpo.bottomLine',
    iStock: '.iStock-wrapper'
  };
  function ProductFilter(container, rs_filter, product) {
    if (product == null) {
      console.error('codenullproductfilter');
      return;
    }
    this.$container = container;
    this.rs_filter = rs_filter;
    this.product = product;
    this.renderer = new theme.productRenderer();

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId
    };

    this.mediaQueries = {
      gridMedium: 750,
      gridLarge: 990,
      gridWidescreen: 1400,
      gridGutter: 30
    };

    this.variants = new slate.Variants(product, options);

    this.namespace = '.product';

    //listen for variant selected events
    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('restriction.product', this.restrict.bind(this));
    this.$container.on('rs-filter.change', this.changer.bind(this));
    this.$container.on('click', selectors.psTrigger, this.triggerPhotoSwipe.bind(this));
    this.$container.on('click', selectors.atcOverlayFixed, this.hideAtcActions.bind(this));
    this.$container.on('click', selectors.wishlist, this.wishlist.bind(this));
    this.$container.on('click', selectors.fixedATCContainer + ' ' + selectors.addToCart + '.trigger', this.popUpAtcActions.bind(this));

    $(selectors.atcHover, this.$container).hover(
      function() { $(selectors.quantity + ', ' + selectors.atcImg + ' img', container).addClass('trigger'); },
      function() { $(selectors.quantity + ', ' + selectors.atcImg + ' img', container).removeClass('trigger'); }
      // function() { $(selectors.quantity + ', ' + selectors.atcImg + ' img', container).css({ display: 'block', opacity: 0 }).stop().animate({ opacity: 1 }, 300); }, //.addClass('trigger'); },
      // function() { 
      //   $(selectors.quantity + ', ' + selectors.atcImg + ' img', container).stop().animate({ opacity: 0 }, 300); 
      //   setTimeout(function() {
      //     $(selectors.quantity + ', ' + selectors.atcImg + ' img', container).css({ display: 'none' });
      //   }, 600);
      // } //.removeClass('trigger'); }
    );

    // for photoswipe (https://photoswipe.com/documentation/getting-started.html)
    this.psItems = this.product.media.map(function (image) { return { src: image.src, w: image.width, h: image.height }; });

    $(selectors.featuredImage, this.$container).hover(
      function() { $(selectors.imgThumbs, container).css('opacity', 1) },
      function() { $(selectors.imgThumbs, container).css('opacity', 0) }
    )

    window.addEventListener('scroll', this.stickyATC.bind(this));
    this.stickyATC();

    window.addEventListener('resize', this.updateContainers.bind(this));
    this.updateContainers();

    setTimeout((function(){//need this to run after the rest of the inits.
      this.variants._onSelectChange();//might not have this bound either
    }).bind(this),1)
  }

  ProductFilter.prototype.changer = function(evt, $item, tag) {
    evt.stopPropagation();

    //update the fake select list
    //call with $home.trigger('rs-filter.change', [$this, etag($this)]);
    //to get it to auto-update select lists for you.
    //one smallish problem: if you clear a filter with only 1 item, the filter is unselected, but the addtocart bit is smart enough to see there's only one variant remaining, and selects it.
    if ($item) {
      var $list = $item.closest('.rs-and');
      if ($list.length) { 
        if ($item.hasClass('filter-selected')) {
          $(('#SingleOptionSelector-' + $list.data('tag')),this.$container).val(tag)//.change();//change doesn't seem to be happening with val change.
          $(('#SingleOptionSelector-' + $list.data('tag')),this.$container).closest('.custom-select').find('.select-items div[data-tag="' + tag + '"]').trigger('click');
        } else {
          $(('#SingleOptionSelector-' + $list.data('tag')),this.$container).val('')//.change();
          $(('#SingleOptionSelector-' + $list.data('tag')),this.$container).closest('.custom-select').find('.select-selected').html('');
          $(('#SingleOptionSelector-' + $list.data('tag')),this.$container).closest('.custom-select').find('.select-items div').removeClass('same-as-selected');
        }
      }
    }
    this.variants._onSelectChange();
  }

  ProductFilter.prototype.wishlist = function (e) {
    var iWishvId = $(selectors.originalSelectorId).val(),
        $this = $(e.target).closest(selectors.wishlist);
    if($this.hasClass('iwishAdded')){
      if(iwish_remove($this, iWishvId)) {
        $this.removeClass('iwishAdded').html('<svg class="icon"><use xlink:href="#icon-wishlist"></use></svg>');
      }
    } else {
      iwish_add($this, iWishvId);
    }
    return false;
  }

  ProductFilter.prototype.updateContainers = function () {
    var html = '<div class="grid__item f4-12 small--f12-12 for-mobile">\
                  <div class="sidebar">\
                    <div class="sidebar__inner"></div>\
                  </div>\
                </div>';
    var quantityHTML = '<div class="for-mobile mobile-quantity"></div>';

    if ( window.outerWidth < this.mediaQueries.gridLarge ) {  // mobile
      if ( !$(selectors.forMobile, this.$container).length ) {
        this.$container.prepend(html);
        $(selectors.forMobile + ' .sidebar__inner', this.$container).append( $(selectors.rsProductInfo, this.$container) );
        $(selectors.rsProductInfo + ' .title-ratings .align-right', this.$container).append( $(selectors.wishlist, this.$container) );

        $(selectors.sizeFilter, this.$container).prepend(quantityHTML);
        $(selectors.sizeFilter + ' .mobile-quantity', this.$container).append($(selectors.sizeFilter + ' .submenupop', this.$container));
        $(selectors.sizeFilter + ' .mobile-quantity', this.$container).append($(selectors.mainATCContainer + ' ' + selectors.quantity, this.$container));
      }
    } else {  // desktop
      if ( $(selectors.forMobile, this.$container).length ) {
        $(selectors.infoContainer + ' .sidebar__inner', this.$container).prepend( $(selectors.rsProductInfo, this.$container) );

        $(selectors.sizeFilter, this.$container).prepend($(selectors.sizeFilter + ' .submenupop', this.$container));
        $(selectors.mainATCContainer + ' .atc-btns', this.$container).prepend($(selectors.sizeFilter + ' ' + selectors.quantity, this.$container));

        $(selectors.forMobile, this.$container).remove();
        $(selectors.rsProductInfo, this.$container).append( $(selectors.wishlist, this.$container) );
      }
    }
  }


  ProductFilter.prototype.stickyATC = function (e) {
    var headerHeight = $('header').height();
    var atcHeight = document.querySelector('#add-to-cart-button').getBoundingClientRect().height;
    var atcTop = document.querySelector(selectors.mainATCContainer).getBoundingClientRect().top;

    if ( window.outerWidth < this.mediaQueries.gridLarge ) {  // mobile
      if( atcTop < ( headerHeight - atcHeight ) ) {
        $(selectors.fixedATCContainer + ' ' + selectors.addToCart).addClass('trigger');
        $(selectors.fixedATCContainer + ' ' + selectors.bisTrigger).addClass('trigger');
      } else {
        $(selectors.fixedATCContainer + ' ' + selectors.bisTrigger).removeClass('trigger');
        $(selectors.fixedATCContainer + ' ' + selectors.addToCart).removeClass('trigger');

        this.hideAtcActions(e);
      } 
    } else {  // desktop
      $(selectors.fixedATCContainer + ' ' + selectors.addToCart).attr('onclick', '');
      if( atcTop < ( headerHeight - atcHeight ) ) {
        $(selectors.fixedATCContainer + ' .atc-btns', this.$container).prepend($(selectors.mainATCContainer + ' ' + selectors.quantity, this.$container));
        $(selectors.fixedATCContainer, this.$container).addClass('trigger');
      } else {
        $(selectors.mainATCContainer + ' .atc-btns', this.$container).prepend($(selectors.fixedATCContainer + ' ' + selectors.quantity, this.$container));
        $(selectors.fixedATCContainer, this.$container).removeClass('trigger');
      }
    }
  }

  ProductFilter.prototype.popUpAtcActions = function () {
    // if single option variant, just directly add to cart:
    if ( this.product && this.product.variants && this.product.variants.length < 2 ) {
      $(selectors.fixedATCContainer + ' ' + selectors.addToCart).attr('onclick', '');
      $(selectors.atcForm, this.$container).submit();
    } else {
      $(selectors.mainATCContainer, this.$container).css('margin-top', $(selectors.rsFilterVariant, this.$container).outerHeight(true));
      // $(selectors.rsFilterVariant + ' ' + selectors.afterpay).hide();
      $(selectors.fixedATCContainer, this.$container).prepend($(selectors.rsFilterVariant, this.$container));
      $(selectors.fixedATCContainer, this.$container).addClass('trigger');
      $(selectors.fixedATCContainer + ' ' + selectors.addToCart).attr('onclick', '');
      $(selectors.atcOverlayFixed).css({ 'opacity': 1, 'zIndex': 10 });
      $('html').addClass('no__overflow');
    }
  }

  ProductFilter.prototype.hideAtcActions = function (e) {
    if ( e && ( e.type === "scroll" || ( e.type === "click" && $(selectors.fixedATCContainer + ' ' + selectors.addToCart)[0] !== $(e.target)[0] && !$(e.target).closest(selectors.fixedATCContainer).length ) ) ) {
      $(selectors.fixedATCContainer + ' ' + selectors.addToCart).attr('onclick', 'event.preventDefault();');
      $(selectors.fixedATCContainer + ' ' + selectors.bisTrigger).removeClass('trigger');
      $(selectors.fixedATCContainer, this.$container).removeClass('trigger');
      $(selectors.atcOverlayFixed).css({ 'opacity': '', 'zIndex': '' });
      $('html').removeClass('no__overflow');
      setTimeout((function () {
        $(selectors.mainATCContainer, this.$container).css('margin-top', '');
        // $(selectors.rsFilterVariant + ' ' + selectors.afterpay).show();
        $(selectors.atcForm, this.$container).prepend($(selectors.rsFilterVariant, this.$container));
      }).bind(this), 400);
    }
  }

  ProductFilter.prototype.triggerPhotoSwipe = function (e) {
    var pswpElement = document.querySelectorAll(selectors.photoSwipe)[0];

    if (e && e.currentTarget) {
      var $this = $(e.currentTarget);
      var position = $this.data('position') || $this.siblings('.ps-trigger').data('position');
      var options = {
        index: position ? position - 1 : 0
      };  
    }

    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, this.psItems, options );
    gallery.init();
  }

  ProductFilter.prototype.updateAddToCartState = function(evt) {
    evt.stopPropagation();
    var variant = evt.variant;
    
    this.$container.addClass('select-needed');
    if (variant) {
      $(selectors.product_info,this.$container).html(this.renderer.renderProduct(this.product, [variant]));
      this.rs_filter.variantToFilters(variant);

      if (variant.featured_image) $(selectors.atcImg + ' img', this.$container).attr('src', slate.Image.getSizedImageUrl(variant.featured_image.src, '200x200'));
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true).text(theme.strings.unavailable);
      $(selectors.atcImg + ' img', this.$container).attr('src', '');
      return;
    }

    if (variant.available) {
      this.$container.removeClass('select-needed');
      $(selectors.quantity, this.$container).show();
      $(selectors.addToCart, this.$container).prop('disabled', false).html(theme.strings.addToCart + '<span class="price">' + slate.Currency.formatMoney(variant.price, theme.moneyFormat) + '</span>').show();
      $(selectors.bisTrigger, this.$container).prop('disabled', true).text(theme.strings.notifyMe).hide();
    } else {
      // NOTE: display the iStock widget:
      $(selectors.quantity, this.$container).hide();
      $(selectors.addToCart, this.$container).prop('disabled', true).html(theme.strings.soldOut + '<span class="price">' + slate.Currency.formatMoney(variant.price, theme.moneyFormat) + '</span>').hide();
      $(selectors.bisTrigger, this.$container).prop('disabled', false).text(theme.strings.notifyMe).show();
    }
  }

  ProductFilter.prototype.restrict = function(evt) {
    evt.stopPropagation();
    var variants = evt.variants, cvariants = [];


    if (variants.length == this.product.variants.length) {
      //remove all the rs-disabled. there's still some number of rs-hidden, but those filters have already been judged not applicable to this product.
      $('.rs-disabled', this.$container).removeClass('.rs-disabled');

    }
    if (variants.length >= 1 && variants.length < this.product.variants.length) {
      // filter the options with the available variants.
      // In order, from the top: if you have 4 colors, with 4 sizes, selecting a color will disable all te sizes that color doesn't have available.
      // Or vice versa 
      var tags = [];
      if (variants[0].options.length > 1) {
        var level1 = this.$container.find('.hidden-selectors select[data-index="option1"]').val();

        if (level1) {
          for (var i in variants) {
            if (variants[i].available && level1 === Shopifyhandleize(variants[i].options[0]) && tags.indexOf(variants[i].options[1])===-1) {
              tags.push(Shopifyhandleize(variants[i].options[1]));
              cvariants.push(variants[i]);
            }
          }
          
          var level2 = this.rs_filter.restrictFilterOptionStr(tags, 'rs-disabled', 2);
          if (level2 !== null) {
            this.$container.find('.hidden-selectors select[data-index="option2"]').val(level2);
          }
        }
        
        var level_s = this.$container.find('.hidden-selectors select[data-index="option2"]').val();        
        if (level_s) {
          for (var i in variants) {
            if (variants[i].available && level_s === Shopifyhandleize(variants[i].options[1]) && tags.indexOf(variants[i].options[0])===-1) {
              tags.push(Shopifyhandleize(variants[i].options[0]));
              cvariants.push(variants[i]);
            }
          }
          var level_f = this.rs_filter.restrictFilterOptionStr(tags, 'rs-disabled', 1);
          if (level_f !== null) {
            this.$container.find('.hidden-selectors select[data-index="option1"]').val(level2);
          }
        }
      }

      tags = [];
      if (variants[0].options.length > 2) {
        var level2 = this.$container.find('.hidden-selectors select[data-index="option2"]').val();
        if (level2) {
          for (var i in variants) {
            if (variants[i].available && level2 === Shopifyhandleize(variants[i].options[1]) && tags.indexOf(variants[i].options[2])===-1) {
              tags.push(Shopifyhandleize(variants[i].options[2]));
            }
          }
          var level3 = this.rs_filter.restrictFilterOptionStr(tags, 'rs-disabled', 3);
          if (level3 !== null) {
            this.$container.find('.hidden-selectors select[data-index="option3"]').val(level3);
          }
        }
      }
    }
    //variants.length === 1 || == 0 is also very important, but is the updateAddToCartState's problem

    if (cvariants) {
      var strs = [];
      cvariants.forEach(function(v) {
        var _ = theme.getImageCodeFromVariant(v);
        if (strs.indexOf(_) === -1){
          strs.push(_);
        }
      });
      //Prob: wanted the available/selected variant colors. If there is a selected size, variants also includes all the related colors, which should not override a color selection.
      //the cvariants thing assumes the color is option1.

      theme.filterThumbnails(strs, $('.pslider_big'), $('.pslider_small'), evt.variant);
    } else  {
      theme.filterThumbnails(null, $('.pslider_big'), $('.pslider_small'), evt.variant)
    }
    //not sure if the big slider will control visibility on the small one.
    //  does not. In fact, there is no actual connection.
    //TODO: need to be able to run this on init: restrict the images based on the non-selectable swatches
    //There are issues with the slider being inited

    //probably too much to ask, but it would be sweet if this could change the price range as well.
    $(selectors.product_info,this.$container).html(this.renderer.renderProduct(this.product, variants));
  }
  
return ProductFilter;
})();


/*================ Templates ================*/
$(function() {//These use the IIFE as a "namespace", but don't return anything
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();

});
/*  =^>^=   ROSWELL STUDIOS LIB   =^<^=  */
//oddly, Slate does not have the option for an ajax cart.

//need to add/remove items by ID (definitely not line number)
//update note
//update an assortment of numbers and settings on cart update
//update the cart
//broadcast on cart add (to add/remove specials), cart update (so anything else can see the new cart)

//options: copy the ID number edited timber cart?
// has handlebar
//Use the liquid cart html?
// no other libs, places limits on the actual cart, which, because there's a link on the checkout page, can not be removed.
// possibly slower in that it involves another call (BUT: timber was making an update.js/cart.js anyway)
//use react, because the rest of the site is also in react.
// rest of site not currently in react

//Ideally, all these functions also apply equally to the real /cart




/**
To react to cart changes in client custom code, do this:
$('body').on('cartupdate', function(event, cart) {
  $('#cartCount').text(cart.item_count);
  if (cart is not visible) {
    myCart.showCart();
  }
})

*/
theme.rsCart = (function(){
  function Cart(){
    this.cart = null;
  }

  /**
  opts is something like {id:123,quantity:1} or $('form').serialize()
  */
  Cart.prototype.addToCart = function(opts){
		var that = this;
    return $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: opts,
      dataType: 'json',
      success: function(item) {
      	//does not return a cart, a bit unexpected
        that.gtm('cart_add', item, opts);
        that.cart = null;//invalidate cart
      },
      error: function(XMLHttpRequest, textStatus) {
      },
      complete: function(jqxhr, text) {
      }
    })
  }

  Cart.prototype.removeFromCart = function(id){
    this.changeQuantity(id,0)
  }

  /**
  opts is something like {note:'note'} or "note=cart_notes_enable"
  */
  Cart.prototype.updateCart = function(opts){
		var that = this;
    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: opts,
      dataType: 'json',
      success: function(cart) {//TODO: cart or item?
        that.cart = cart;
        $(document).trigger('cartupdate', cart);
        that.gtm('cart_update', cart, opts);
      },
      error: function(XMLHttpRequest, textStatus) {
      },
      complete: function(jqxhr, text) {
      }
    })
  }

  Cart.prototype.getCart = function() {
		var that = this;
    return $.Deferred(function( dfd ) {
      if (that.cart != null) {
        return dfd.resolve(this.cart);
      }
      //not sure how you'd get a submit button without getting the cart set, but maybe?
      $.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        success: function(cart) {
          that.cart = cart;
        	$(document).trigger('cartupdate', cart);
          dfd.resolve(that.cart);
        },
        error: function(XMLHttpRequest, textStatus) {
        },
        complete: function(jqxhr, text) {
        }
      })
    })
  }

  Cart.prototype.gtm = function(event, cart, opts) {

    if (typeof USE_DEFAULT_GTM !== "undefined" && USE_DEFAULT_GTM) {
      dataLayer.push({
        'event': 'ecommerce_event',
        'eventCategory': 'ecommerce',
        'eventAction': event,
        'ecommerce': {
          'detail': {
            'new_cart': cart,
            'change': opts
          }
        }
      });
    }
  }
  /**
  id is cartItem.variant_id //TODO: //TEST: is on KA, but does that work with no variants?
  quant == 0 will remove the item from the cart
  */
  Cart.prototype.changeQuantity = function(id, quant){
		var that = this;
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=' + quant + '&id=' + id,
      dataType: 'json',
      success: function (cart) {//TODO: cart or item?
        that.cart = cart;
        $(document).trigger('cartupdate', cart);//MAYBE? not update the cart, if this is only used on +/- buttons, just let them update the quant content
        //will need to update the price totals, which is available in cart. Would need $()
        //would need formatted money. See slate.currency
        //if quant == 0, would need to remove the entire line. Could update that, then.
        that.gtm('cart_update', cart, {id:id, quant:quant});
      },
      error: function(XMLHttpRequest, textStatus) {
      },
      complete: function(jqxhr, text) {
      }
    })
  }

  Cart.prototype.showCart = function(div){
    $.ajax({
      type: 'GET',
      url: '/cart?view=sidebar',
      success: function (html) {
        var cartTemplate = $(html).find('#cartTemplate');
        //If there is other random stuff that needs to added to the ajax cart html, add it here
        $(div).html(cartTemplate)
        $('.quantity', $(div)).not('.gift').each(function(i,o){theme.adjusters($(o))});

        var getCartNote = sessionStorage.getItem('CartNote');
        if(getCartNote !== null) {
          $('[name="note"]').val(getCartNote);
        }
        
        /*
        The paypal button is present, but whatever code it needs is not running.
        Manually trigger it. It seems to be OK with running with no buttons to process.
        */
        //Shopify.StorefrontExpressButtons.initialize();
      },
      error: function(XMLHttpRequest, textStatus) {
        $(div).html(textStatus)//shouldn't happen, but also doing  nothing is bad
      }
    })
  }

  return Cart;
})();

/**
intercept form submissions so it goes to the ajax cart above.
$('form', $container).on('submit', theme.rsCartListener)
*/
theme.rsCartListener = function(e){
  e.preventDefault();
  theme.cart.addToCart($(this).serialize())
  .then(function(){theme.RightDrawer.open(e)})//open the drawer, get the html
  .then(theme.cart.getCart)//get the JSON, so it can update stuff like the CartCount
  //Prob: without an event passed into .open(), it does different stuff.
  //Could manually call that stuff here, or just make it think it was the same as the cart icon click

  //the on cartupdate will reload the content, but .open() will display the old cart first.
  //animation might cover that naturally?
  //- seems to be too fast to see
  return false;
};

theme.buynow_manager_factory = function($home) {
	//Code to attach the real Product code to the BUY NOW button on the Collection, complete with selectable variants.
	return function() {
  $('.buynow', $home).each(function(i,o){
    var $container = $(o);
    var rs_filter = theme.rs_filter($container, theme.CUSTOM_FILTERS, true);
    let id = $container.find('form').data('product-id');

		//TODO: do something with the products? have renderProduct add everything it renders to products
		//^^ do that. add it to theme.
    let product = products.find(function(o){return o.id == id});
    if (product == null && rs_navigator != null) {
			//another global, just remove?
      product = rs_navigator.find(function(o){return o.id == id});
    }
    if (product == null) {
      return;
		}

    //create compatibility selectors from filters.
    $('.hidden-selectors', $container).html(rs_filter.filterToSelectList());
		//NOTE: this is also done renderGrid's default. Don't do it twice! 
    //link the product and filters to the variants
    var ProductFilter = new theme.ProductFilter($container, rs_filter, product);
    //could just replace the ProductFilter with something simpler, that doesn't require the product obj
    $container.on('variantChange.product', function(evt){
      var variant = evt.variant;
      if (variant && variant.available) {
        //is good
				$container.removeClass('select-needed');
				
				$('.varLabel', $container).text(variant.title);

        //THIS NEEDS CUSTOM WORK:
        if (variant.featured_image) {
        $container.parents('.product-index').find('.prod-image img').attr('src',variant.featured_image.src);
        }
				//KA has images on the variants, might need to filter the product's images instead. See NN.

        //else if there's only one color image, leave the reveal alone
      } else {
        $container.addClass('select-needed');
      }
    });
    $('.add-to-cart', $container).on('mouseenter',function(){$container.addClass('select-check')}).on('mouseleave',function(){$container.removeClass('select-check')})
    $('form', $container).on('submit', theme.rsCartListener)
  })
  $('.buynow1', $home).each(function(i,o){
    var $container = $(o);
    $('form', $container).on('submit', theme.rsCartListener)
	})
	
	
	//may need event here: KA has swatches in a slider
};
}
// move the fliter logic out of rs-navigator, so that the variants  can also use it.
theme.rs_filter = function($home, CUSTOM_FILTERS, singleSelect) {
  //there might be more than one filter-set on the page. Stay inside $home

  //init
//open/close submenu
 $home//too specific? use case for more than one at at a time?
 .on('click', '.submenupop', function(e) {
   e.stopPropagation();
   $(this).parent().toggleClass('close');
 })
//toggle selectable filters
.on('click', '.filter-item', function(e) {
  e.stopPropagation();
  var $this = $(this);
  //if ($this.hasClass('rs-hidden'))return;//if css is only grayed out, not actually hidden, would want this
  if ($this.hasClass('rs-disabled') || $this.hasClass('filter-selected'))return;//is visible, but has an X on it or something.
  if (singleSelect) {
    $this.siblings('.filter-item').removeClass('filter-selected').data('aria-checked','false');//all sibs might be faster.
  }
   $this.toggleClass('filter-selected').data('aria-checked',$(this).data('aria-checked')!='true'?'true':'false');
   //Issue: the dispatch is not getting picked up by the .on (works with addEventListener)
   //given that this is inside an on listerner, lets stick with that
   //$home.each(function(i,o){ o.dispatchEvent(new CustomEvent('rs-filter.change', {detail:{target: this, tag: etag($this)}))})
   $home.trigger('rs-filter.change', [$this, etag($this)]);
 })
 /** any button that triggers a re-filtering, like
 Min ___ Max ___ [Filter]
 */
 .on('click', '.rs-change-filter', function(e) {
   e.stopPropagation();
   $home.trigger('rs-filter.change');
})
 // reset filters:
 .on('click', '.clear-filter-item', function(e) {
   e.stopPropagation();
   var tag = $(this).data('tag');
   $('.filter-item.filter-selected').filter(function(){
   return etag($(this)) == tag;
   }).removeClass('filter-selected').data('aria-checked','false');
   $home.trigger('rs-filter.change', [$(this)]);
 })
.on('click', '.rs-clearall-siblings', function(e) {
  e.stopPropagation();
   $(this).siblings('.filter-selected').removeClass('filter-selected').data('aria-checked','false');
   $home.trigger('rs-filter.change', [$(this)]);
 })
 .on('click', '.rs-clearall', function(e) {
   e.stopPropagation();
   $('.filter-selected', $home).removeClass('filter-selected').data('aria-checked','false');
   $('.rs-range input', $home).val('');
   $home.trigger('rs-filter.change', [$(this)]);
  });


  /** helper function for pFilter */
  function basicSearch(ortags, classes) {
    var or = false;
    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      if (classes.indexOf(tag) > -1) {
        or = true;
        return false;
      }
    });
    return or;
  };
 /** helper function for pFilter*/
 function basicTagSearch(ortags, object) {
   return object.tags ? basicSearch(ortags, object.tags) : false;//would not expect this, but it happens
 }

 
  function pFilter(filters, object){
    var and = true;
    $.each(filters, function (i, ortags) {
      if(and && ortags && ortags.length) {
        and = and && (CUSTOM_FILTERS[i]||basicTagSearch)(ortags, object);
      }
      return and;
    });
    return and;
  }

  function etag($this) {
    return $this.data('tag') || $this.text().toLowerCase().replace(',', '').replace(',', '').trim()
  }
  return {
    filterProducts:function(data, filters) {
      var output = [];
      if (filters && Object.keys(filters).length) {
        for (var i = 0; i < data.length; i++) {
          if (pFilter(filters, data[i])) {
            output.push(data[i]);
          }
        }
      } else {
        output = data.slice(0,data.length)//sort's concept of the original order can get messed up here if you return original flavor data
      }
      return output;
    }
    ,
    //given an array of variants and a list of strings
    //Kind of thinking this would be more efficient if it can apply the correct filters directly to the correct option
    filterVariants: function(variants, filters) {
      var output = [], orz = null;

      if (filters && Object.keys(filters).length) {
        for (var i in filters) {
          for (var j in filters[i]) {
            orz.push(filters[i][j]);
          }
        }
      }
      if (orz && orz.length) {
        for (var i = 0; i < variants.length; i++) {
          for (var j = 0; j < orz.length; j++) {
            for (var k = 0; k < variants[i].options.length; k++) {
              //that looks horrifying, but 2 are <= at most 3
              if (orz[j] == variants[i].options[k]) {
                output.push(variants[i]);
              }
            }
          }
        }
      } else {
        output = variants
      }
      return output;
    }
    ,
    setFilterOptions: function(filters) {
      $('.rs-and', $home).each(function(k, andblock) {
        var key = $(this).data('tag');
        var andOptions = filters[key];
        if (andOptions && andOptions.length) {
          $(andblock).find('.rs-or').each(function(k, v) {
            if(andOptions.indexOf($(this).data('tag') || $(this).text().trim()) >= 0) {
              $(this).addClass('filter-selected').data('aria-checked','true')
            }
          });
          if ($(andblock).find('.rs-range').length > 0) {
            var explode = andOptions[0].split('-');
            //this assumes there's only 1 range in the block. Nobody else does.
            //Should match the options array with -range array
            if (explode[0].length > 0) $(andblock).find('.rs-or-min').val(explode[0]);
            if (explode[1].length > 0) $(andblock).find('.rs-or-max').val(explode[1]);
          }
        }
      })
    }
    ,
    restrictFilterOptions: function(allProducts, hideClass) {
      var hidden = hideClass || 'rs-hidden';
      function prodSearched(key, val) {
        //return as soon as you find a product that matches this filter option
        for (var x = 0; x < allProducts.length; x++) {
          //tricky: Custom filters
          if ((CUSTOM_FILTERS[key]||basicTagSearch)([val], allProducts[x])) {
            //better? create one array of all the basic tag searches and do the loop once.
            return false;
          }
        }
        return true;
      }

      $('.rs-and', $home).each(function(k, andblock) {
        var $andblock = $(andblock), key = $andblock.data('tag');
        $andblock.find('.rs-or').each(function(k, v) {
          var $v = $(v), tag = etag($v);
          if(prodSearched(key, tag)) {
            $v.addClass(hidden).removeClass('filter-selected').data('aria-checked','false');
          } else {
            $v.removeClass(hidden);
          }
        });

        //if ($(andblock).find('.rs-range').length > 0) {}
        //set the min/max on a slider?
        //hide entire category if there's no point
        if ($andblock.find('.rs-or.filter-selected').length == 0) {
          let $ors = $andblock.find('.rs-or:not(.rs-hidden)');
          if ($ors.length <= 1) {
            //:visible, or not(hidden), or whatever, above
            //.not('.rs-hidden') faster?
            //$ors.closest('.second-tier').addClass(hidden);
            //$ors.addClass(hidden);
            //$andblock.addClass(hidden);
          } 
          if ($ors.length >= 1) {
            //1 and only 1 option, why make the user click it?
           //$ors.closest('.second-tier').addClass(hidden);
          // } else {
          // ^^ reported as "not a great user experience" when it shows up in the filter. (the original filter can be removed, leaving this one checked.)
          //may need to tweak this for both the filter and swatches, should they have different needs.
            $andblock.removeClass(hidden);
          }
        }
      })
    }
    ,
    /**
    restrictFilterOptions uses the custom filters, but also requires full products.
    If you just want tags/string filtered, use this.
    Is much faster!
    */
    restrictFilterOptionsStr: function(tags, hideClass) {
      var hidden = hideClass || 'rs-hidden';
      $('.rs-and', $home).each(function(k, andblock) {
        var $andblock = $(andblock), key = $andblock.data('tag');
        $andblock.closest('.second-tier').addClass(hidden);
        $andblock.find('.rs-or').each(function(k, v) {
          var $v = $(v);
          if(tags.indexOf(key, etag($v)) !== -1) {
            $v.addClass(hidden);
          } else {
            $v.removeClass(hidden);
          }
        });
        if ($andblock.find('.rs-or:not('+hideClass+')').length <= 1) {//might not want this.
          //:visible, or not(hidden), or whatever, above
          //.not('.rs-hidden') faster?
          $andblock.addClass(hidden);
        } else {
          $andblock.removeClass(hidden);
        }
      })
    }
    ,
    /**
    restrictFilterOptions uses the custom filters, but also requires full products.
    If you just want tags/string filtered, use this.
    Is much faster!
    */
    restrictFilterOptionStr: function(tags, hideClass, optionKey) {
      var hidden = hideClass || 'rs-hidden';
      var search = optionKey ? '[data-option="'+optionKey+'"]' : '';
      var out = null;//empty option value
      $('.rs-and' + search, $home).each(function(k, andblock) {
        var $andblock = $(andblock), key = $andblock.data('tag');
        $andblock.find('.rs-or').each(function(k, v) {
          var $v = $(v);
          if(tags.indexOf(Shopifyhandleize(etag($v).toString())) === -1) {
            $v.addClass(hidden);
            if ($v.hasClass('filter-selected')) {
              $v.removeClass('filter-selected').data('aria-checked','false')
              out = '';//empty option value etag($v);
            }
          } else {
            $v.removeClass(hidden);
          }
        });
        if ($andblock.find('.rs-or:not('+hideClass+')').length <= 1) {//might not want this.
          //:visible, or not(hidden), or whatever, above
          //.not('.rs-hidden') faster?
          $andblock.addClass(hidden);
        } else {
          $andblock.removeClass(hidden);
        }
      })
      return out;
    }
    ,
    fillFilter: function(){
      var andtags = {};
      $('.rs-and:not(rs-hidden)', $home).each(function (i, andblock){
        var ora = [];
        $(andblock).find('.rs-or.filter-selected:not(rs-hidden)').each(function(i, orb) {
          ora.push(etag($(orb)));
        })
        $(andblock).find('.rs-range').each(function(i, orb) {
          var min = $(orb).find('.rs-or-min').val();
          var max = $(orb).find('.rs-or-max').val();
          if (min != '' || max != '') {
          ora.push(min+'-'+max);
          }
        })
        if (ora.length) andtags[$(andblock).data('tag')] = ora;
      });
      return andtags;
    }
    ,
    unsetFilterOption: function(options, ukey, uval) {
     $('.rs-and', $home).each(function(k, andblock) {
      var key = $(this).data('tag');
      if (key != ukey) return;//could search by tag...
      $(andblock).find('.rs-or').each(function(k, v) {
        var $v = $(v);
        if(options.indexOf($v.data('tag') || $v.text().trim()) >= 0) {
          var val = etag($v);
          if (val != uval) return;
          $v.removeClass('filter-selected').data('aria-checked','false')
          $v.siblings('label').find('i').toggle();
          return false;
        }
      });
      if ($(andblock).find('.rs-range').length > 0) {
        var explode = options[0].split('-');//TEST? I don't remember how this works
        //see note about more than one range per block
        if (explode[0].length > 0) $(andblock).find('.rs-or-min').val('');
        if (explode[1].length > 0) $(andblock).find('.rs-or-max').val('');
      }
     });
    }
    ,
    searchToFilter: function(arr){
      $('.rs-and', $home).each(function (i, andblock){
        $(andblock).find('.rs-or').each(function(i, orb) {
          if (arr.indexOf(etag($(orb))) !== -1) {
            $(orb).addClass('filter-selected').data('aria-checked','true')
          }
          //ideally: expand the andblock. need a generic way of doing that.
        })
      })
    }
    ,
    /**
    turns the filter into a select list for easier compatibility with other plugins
    */
    filterToSelectList: function() {
      var html = ''
      $('.rs-and', $home).each(function(k, andblock) {
        var $andblock = $(andblock), key = $andblock.data('tag'), label = $andblock.data('label');
        html += '<div class="option-selector" data-option="' + key + '"><div class="option-info"><label for="SingleOptionSelector-' + key + '">' + label + '</label><svg class="icon ' + key + '"><use xlink:href="#icon-question"></use></svg>' + ( (key === "size") ? "<a href='#' class='size-guide'>size / guide</a>" : "" ) + '</div><div class="custom-select"><select id="SingleOptionSelector-' + key
        + '" class="single-option-selector" '
        + 'data-index="option' + $andblock.data('option') + '"><option value="">Choose ' + label + '</option>'
        $andblock.find('.rs-or').each(function(k, v) {

          var $v = $(v);
          if(etag($v).toString().indexOf('"') > 0){
            var getTag = Shopifyhandleize(etag($v).toString());
          } else {
            var getTag = Shopifyhandleize(etag($v).toString());
          }
           
          html += '<option value="'+ getTag +'"'+
          ($v.hasClass('filter-selected')?'selected=selected':'')
          +'>'+$v.text().trim()+'</option>'
        });
        html += '</select></div></div>'
      })
      return html;
    }
    ,
    /**
    assuming that the filters might already have some settings
    double check that the filter-options are selected.
    (could select a color with only 1 size, auto-select that size)

    also sets a SingleOptionSelector if available.
    */
    variantToFilters: function(variant) { 
      //
      //Don't need to re-update anything, just set the data.
      $('.rs-and', $home).each(function (i,o) {
        var $andblock = $(o), $fs = $andblock.find('.filter-selected'), key = $andblock.data('tag'), option = 'option' + $andblock.data('option');
        if ($fs.length != 1) {
          console.log($fs.length);
          $andblock.find('.rs-or').each(function(k, v) {
            var $v = $(v), tag = etag($v);
            if (tag ===  variant[option]) {
              $v.addClass('filter-selected').data('aria-checked','true');
              //also the selector
              $('#SingleOptionSelector-' + key).val(tag);
            }
          });
        }
      })
    },

    customSelect: function() {
      var x, i, j, l, ll, selElmnt, a, b, c;
      /* Look for any elements with the class "custom-select": */
      x = document.getElementsByClassName("custom-select");
      l = x.length;
      for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
          /* For each option in the original select element,
          create a new DIV that will act as an option item: */
          c = document.createElement("DIV");
          c.setAttribute("data-tag", Shopifyhandleize(selElmnt.options[j].innerHTML));
          c.innerHTML = '<div class="option-label">' + selElmnt.options[j].innerHTML + '</div>';
          // add image to the select list items:
          if ( $('.filter-item[data-tag="' + Shopifyhandleize( selElmnt.options[j].innerHTML ) + '"]').length ) {
            var selectImg = $('.filter-item[data-tag="' + Shopifyhandleize( selElmnt.options[j].innerHTML ) + '"]')[0].outerHTML;
            selectImg = selectImg.replace(/<li/g, '<div').replace(/<\/li>/g, '</div>');
            var div = document.createElement('div');
            div.innerHTML = selectImg.trim();
            var img = div.firstChild;
            img.classList.remove("rs-or", "filter-item", "filter-selected");
            img.classList.add("select-img");
            img.removeAttribute("data-tag");
            c.appendChild(img);
          }
          c.addEventListener("click", function(e) {
              /* When an item is clicked, update the original select box,
              and the selected item: */
              var y, i, k, s, h, sl, yl;
              s = this.parentNode.parentNode.getElementsByTagName("select")[0];
              sl = s.length;
              h = this.parentNode.previousSibling;
              for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.firstChild.innerHTML) {
                  s.selectedIndex = i;
                  h.innerHTML = this.firstChild.innerHTML;
                  y = this.parentNode.getElementsByClassName("same-as-selected");
                  yl = y.length;
                  for (k = 0; k < yl; k++) {
                    y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "same-as-selected");
                  break;
                }
              }
              h.click();
          });
          b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
          /* When the select box is clicked, close any other select boxes,
          and open/close the current select box: */
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide");
          this.classList.toggle("select-arrow-active");
        });
      }

      function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i)
          } else {
            y[i].classList.remove("select-arrow-active");
          }
        }
        for (i = 0; i < xl; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
          }
        }
      }

      /* If the user clicks anywhere outside the select box,
      then close all select boxes: */
      document.addEventListener("click", closeAllSelect);
    }

  }
}

//TODO: add history in a way that seems natural. Everything? only pagination clicks?
//eventually: be able to run more than one on a page. Not currently a need, but with a passed in collection url, and (root).find for the lookups, is possible and unique to shopify, or ecommerce in general.
theme.rs_navigator = function(collection_name, PRODUCTS_PER_PAGE, PRODUCT_RENDERER, CUSTOM_FILTERS, CUSTOM_FILTERS_STRINGS, filter_generator) {
  //TODO: find the one with the HOME var?
const PRODUCTS_PER_AJAX = 100;//this has to be in sync with collection.json.liquid
//TODO: if you expect a full page of items, and the count is not this number, do some sort of error message.
//TODO: can it not take 100? RR got changed to 50.

  // GLOBAL VARIABLES:
  var allProducts = [],     // all products in the collection/page
      sortParam = '',
      rs_filter = theme.rs_filter($('#filtermenu'), CUSTOM_FILTERS, false);
  //rather than constantly querying these, set it and forget it
  var gparams = {
    page: 1,
    q: undefined,//might override these off the url
    filterOptions: undefined,
    sortBy: undefined
  };

//random functions
function splitParams(url) {
  if (!url) url = window.location.href;//.search would be shorter
  var parms= url.split('?'),
    out = [];
  if (parms.length != 2) {
    return out;
  }
  var a = parms[1].split('&');
  for (var i = 0; i < a.length; i++) {
    var _  = a[i].split('=');
    out[_[0]] = _[1];
  }
  return out;
}

function pushState() {
  var params = { }, needsparams = false;
  if (gparams.page != 1) {
    params.page = gparams.page;
    needsparams= 1;
  }
  if (gparams.q) {
    params.q = gparams.q;
    needsparams = 1;
  }
  var url = location.pathname;
  //null/'' are ignored, meaning it won't replace an existing ?page
  if (needsparams) {
    url = "?" + $.param(params);
  };
  history.pushState(
    {
      filterOptions: gparams.filterOptions
    },
    ' ',//title, ignored
    url
  );
}


//PAGINATION DIV

  function pagination_init() {
    $("#pagination").on('click', 'a',function (e) {
      e.preventDefault();
      var page = $(this).attr('title')
      if (page === '') {
        page = '999';
      }
      if (page !== '999') {
        page = parseInt(page);
        $("html, body").animate({ scrollTop: 0 }, 500);//might also go to product-loop
      }
      if (page != gparams.page) {
        gparams.page = page;
        pushState();
      }
      paginateProducts(page);
    });
  }
  function setPaginator(currPage) {
    if (1 >= totalPages) {
      $('.rs-pagination').html('');
      return;
    }
    var paginator = "";
    if (currPage !== '999') {
      paginator +=
      ((currPage - 1 >= 1) ? '<a href="/collections/' + collection_name + '?page=' + (currPage - 1) + '" title="' + (currPage - 1) + '"><svg class="icon"><use href="#icon-leftChevron"></use></svg></a>' : '')
      + ((currPage !== 1) ? '<a href="/collections/' + collection_name + '?page=1" title="1">1</a>' : '' )
      + ((currPage >= 4) ? '<svg class="icon"><use href="#icon-ellipsis"></use></svg>' : '')
      + ((currPage - 2 > 1) ? '<a href="/collections/' + collection_name + '?page=' + (currPage - 2) + '" title="' + (currPage - 2) + '">' + (currPage - 2) + '</a>' : '' )
      + ((currPage - 1 > 1) ? '<a href="/collections/' + collection_name + '?page=' + (currPage - 1) + '" title="' + (currPage - 1) + '">' + (currPage - 1) + '</a>' : '' )
      + '<span class="current">' + currPage + '</span>'
      + ((currPage + 1 < totalPages) ? '<a href="/collections/' + collection_name + '?page=' + (currPage + 1) + '" title="' + (currPage + 1) + '">' + (currPage + 1) + '</a>' : '' )
      + ((currPage + 2 < totalPages) ? '<a href="/collections/' + collection_name + '?page=' + (currPage + 2) + '" title="' + (currPage + 2) + '">' + (currPage + 2) + '</a>' : '' )
      + ((currPage <= totalPages - 4) ? '<svg class="icon"><use href="#icon-ellipsis"></use></svg>' : '')
      + ((currPage !== totalPages) ? '<a href="/collections/' + collection_name + '?page=' + totalPages + '" title="' + totalPages + '">' + totalPages + '</a>' : '' )
      + ((currPage + 1 <= totalPages) ? '<a href="/collections/' + collection_name + '?page=' + (currPage + 1) + '" title="' + (currPage + 1) + '"><svg class="icon"><use href="#icon-rightChevron"></use></svg></a>' : '');
    }
    //TODO: decide if it is worth showing view all if there are more that X total pages. See also NN.
/*     if (totalPages <= 10 && currPage !== '999') {
      paginator += '<a href="/collections/' + collection_name + '?page=' + (currPage === '999' ? "1" : '999' ) + '" title="">' + (currPage === '999' ? theme.strings.vless : theme.strings.vall ) + '</a>';
    } */
    $('.rs-pagination').html(paginator).show();
  }

  function getPage(page) {
    gparams.page = page;
    pushState();
    paginateProducts(page);
  }



// FILTERING

 function unsetFilterOption(ukey, uval) {
   if (gparams.filterOptions == undefined) return;
   rs_filter.unsetFilterOption(gparams.filterOptions, ukey, uval);
 }

function setFilterOptions(options) {
  // sort by:
  if(options.sortBy) {
    $('select#SortBy').val(options.sortBy);//TODO: css, there's no sort by in the liquid
  }
  //TODO: search?
  if (options.filterOptions == undefined) return;
  // filter options:
  rs_filter.setFilterOptions(options.filterOptions);

  filtershown(options.filterOptions);
}

  /** basic word matching search function
  */
function searchText(qs, object) {
return true;
  //IE (not edge) doesn't support this at all. worry about that later
  /*
  if (!qs.find) return true;
  return (qs.find((q)=>object.title.includes(q))!==undefined) && (qs.find((q)=>object.description.includes(q))!==undefined)
  (object.variants && object.variants.length &&
    qs.find((q)=>
      object.variants.find((v)=>v.title.includes(q))!==undefined
    ) &&
    (object.tags && object.tags.length &&
      qs.find((q)=>
        object.tags.find((t)=>tincludes(q))!==undefined
      )
    )
  )
  ;*/
}





// HISTORY STATE


var filterProducts = function(data) {
  var filters = gparams.filterOptions,
  output = rs_filter.filterProducts(data, filters);
  //use gparams.q to further reduce output.
  //Better: given that q is probably coming from the actual shopify search, this should probably only be used instead with a secondary filter-search.
  //would need to add that to setParam, gparams. Get business case first. Could be confusing with 2 different search options.
  if (gparams.q) {
    //need that as an array
    var output2 = [], qs = gparams.q.split(/\W+/);
    for (var i = 0; i < output.length; i++) {
      if (searchText(filters, output[i])) {
        output2.push(qs, output[i]);
      }
    }
  }
  //Would need to be nearly as useful as the built-in search, but would allow for better cached data.
  //Might also be able to: search by price ranges, variants without tags (does shopify do that?)
  return output;
}



//PRODUCTS

function product_init() {
  $('#product-loop').on('click', '.grid__item a', function() {
    //save the div id as the scroll state, instead of the pixels
    let state = history.state || {};
    state.scrollTo = $(this).closest('.grid__item').attr('id');
    history.replaceState(state, '', location.href);//TEST: that the div works the same as the scrollTop()
  });
  $('select#SortBy').on('change', function(){
    gparams.sortBy = $(this).val();
    let pageLength = $('#itemCounter').val();
    paginateProducts(gparams.page, pageLength);
  });


  $('select.collection-header__itemCounter').on('change', function(){
    let value = $(this).val();
    $('.collection-header__itemCounter').each(function(){
      $(this).val(value);
    });
    if(!$(this).is('#itemCounter')){
      $('#itemCounter').trigger('change');
    }
  });


  $('select#itemCounter').on('change', function(){
    $('select#SortBy').trigger('change');
  });  

}
function product_sort(products) {
  var sortf = 0;
  if (gparams.sortBy == 'title-descending')
    sortf = function (b,a) { return a.title.localeCompare(b.title)}
  else if (gparams.sortBy == 'title-ascending')
    sortf = function (a,b) { return a.title.localeCompare(b.title)}
  else if (gparams.sortBy == 'price-ascending')
    sortf = function (a,b) { return a.price_max - b.price_max}//handle/product.json does not return a product price
  else if (gparams.sortBy == 'price-descending')
    sortf = function (b,a) { return a.price_max - b.price_max}
  else if (gparams.sortBy == 'created-ascending')
    sortf = function (a,b) { return (a.published_at >b.published_at  ? -1 : (a.published_at ==b.published_at  ? a.title.localeCompare(b.title) : 1)); }
  else if (gparams.sortBy == 'created-descending')
    sortf = function (b,a) { return (a.published_at >b.published_at  ? 1 : (a.published_at ==b.published_at  ? a.title.localeCompare(b.title) : -1)); }

  //else return natural, collection defined sort
  if (sortf)
    products.sort(sortf)
}
function paginateProducts (page, new_products_per_page) {

  let paginationNumber = PRODUCTS_PER_PAGE;

  if(new_products_per_page){
    paginationNumber = parseInt(new_products_per_page);
  }
  products = filterProducts(allProducts);

  product_sort(products)

  totalPages = Math.ceil(products.length / paginationNumber);

  let pagination  = new_products_per_page;
  let paginationCounter = 0;
  if(pagination > products.length){
    paginationCounter = products.length;    
  }else{
    paginationCounter = pagination;         
  }
  $('.pagination-counter').html(paginationCounter);
  $(".num-products").html(products.length);


  //live filter update
  //rs_filter.restrictFilterOptions(products);

  if (products.length > 0 && page) {

    if (page !== '999' && page > totalPages) {//TEST: the ==='' bit
      page = 1;
      //may need to reset the url here: was page 2, filter reduced that to 1 page, url is still page=2
    }
    var endNdx = ( (products.length < (page * paginationNumber)) || (page === '999') ) ? products.length : page * paginationNumber;//is either all available products, or a single page
    var productGrid = '';
    var startIdx = (page === '999' || (endNdx < paginationNumber)) ? 0 : (page - 1) * paginationNumber;//is either 0, or the start of the page
    for (var i=startIdx; i < endNdx; i++ ) {
      productGrid += PRODUCT_RENDERER.renderGrid(i, products[i], gparams.filterOptions);
    }
    // render HTML
    $('#rs-notfound').hide();
    $("#product-loop").html(productGrid).removeClass('no-results').show();
    setPaginator(page);
  } else {
    $('#rs-notfound').show();
    $('#pagination').hide();
    $("#product-loop").hide();
  }
  //document.dispatchEvent(new CustomEvent('rs-navigator-paginate'));
  
  
  /* Buy now should probably be referenced here or it fails. Or maybe have a call back on this function?  
  It would be nice to have a way to hook something in after the products have rendered */


  // Set Qty Adjusters 
  theme.adjusters($('.quantity', 'body'));


  let buynow = theme.buynow_manager_factory($('.product-index'));
  buynow();


  // Set First Option of Each
  //$('.collection-item .swatch__item:first-child').trigger('click')
  // Trigger first selected item ?? Better way to do this?
  $('.filter-item:first-child').trigger('click'); 
 
}


//document.addEventListener('rs-filter.change', function() {
$(document).on('rs-filter.change', function(e) {
  gparams.filterOptions = rs_filter.fillFilter();
  filtershown(gparams.filterOptions);
  if (gparams.page != '999') { gparams.page = 1; }
  //replace state for each filter change?
  //also, the original version did not reset the page number
  let pageLength = $('select#itemCounter').val();
  paginateProducts(gparams.page, pageLength);

  //reset the url to reflect the new filters.
  //ideally, make this a separate bit so that you can deploy the filter more than once per page, or on pages where it shouldn't update the url
  //D had individual elements, but this abuses the pre-existing search fuction, hopefully looks cleaner, too.
  var q = Object.keys(gparams.filterOptions).map(function(o){return gparams.filterOptions[o].map(function(o){return encodeURIComponent(o)}).join(',')}).join(',');
  if (q) {
    q = location.pathname + '?q='+q;
  } else {
    q = location.pathname;
  }
  history.replaceState(gparams, 'Filtered', q);
});

function filtershown(filterOptions) {
 //generate another list of shows filters
 var $filtershown = $('#filtershown');
 if ($filtershown.length === 0) {
   return
 }
  $filtershown.html('');
  var defaultString = function(ortag) {
    return ortag;
  }
   $.each(filterOptions, function (key, ortags) {
     var _ = CUSTOM_FILTERS_STRINGS[key] || defaultString;
     $.each(ortags, function(i,ortag) {

       $filtershown.append('<li class="clear-filter-item" data-block="'+key+'" data-tag="'+
          ortag+'"><a>'+
          _(ortag)+'</a><span class="ion-close-round"></span></li>');
     });
   });
}








function pageInit() {
  //a way to drop products. I know this is terrible system design, (because it's public data.
  // hiding it doesn't make it secret) but 2 people have asked for it.
  // might filter out .available or tags==wholesale.
  if (PRODUCT_RENDERER.filterProduct) {
    var tmp = [];
    $.each(allProducts, function (i,o){
     if (PRODUCT_RENDERER.filterProduct(o)) {
       tmp.push(o);
     }
    });
    allProducts = tmp;
  }

  setFilterOptions(gparams);
  paginateProducts(gparams.page);

  if (history.state && history.state.scrollTo) {
    var $scroll = $('#'+history.state.scrollTo);
    if ($scroll.length == 1) {
      //$('#product-loop').imagesLoaded().done( function( instance ) {
        $('html, body').animate({ scrollTop: $scroll.offset().top }, 700);
      //});
    }
  }

  if (!filter_generator) {
    rs_filter.restrictFilterOptions(allProducts);
  }
}

function postload() {
  if (filter_generator) {
    filter_generator(allProducts);
  }
  pagination_init();
  product_init();

/*   if (gparams.q && history.state.scrollTo) {
    //Prob: scrollTo needs it filtered first
    //But if the products are generating the filters, the filters won't exist here.
    //might need to break up the pageInit function.
    rs_filter.searchToFilter(gparams.q.split(','));
    gparams.filterOptions = rs_filter.fillFilter();
  } */
  pageInit();

  //run this after the filter_generator
  if (gparams.q) {
    //rs_filter.searchToFilter(gparams.q.split(','));
    $(document).trigger('rs-filter.change');
  }

  let pagination  = $('#itemCounter').val();
  let paginationCounter = 0;
  if(pagination > products.length){
    paginationCounter = products.length;    
  }else{
    paginationCounter = pagination;        
  }
  $('.pagination-counter').html(paginationCounter);
  $(".num-products").html(products.length);
  
  $(document).trigger('rs-navigator.loaded');
}

function finishAjax() {
  postload();
  $('#ajaxLoader').hide();
}

function loadDataAPI(collection_id, c) {
/*
I didn't forget about this.
Pros: is faster.
      has better interal caching (not sure why, though)
      automatically includes img, variant data
Cons: requires modifying the collection's sales channels, private app
      is under active development. Documentations and options are not in sync
      does not return all items, anyway
      does not return totals, so it would have to get that from liquid, or keep asking until it gets less than 50.
      does not work with search strings
      does not include metafields

https://help.shopify.com/api/storefront-api/getting-started
http://www.codeshopify.com/blog_posts/the-javascript-sdk-part-1-displaying-products-on-an-external-site
Add to theme:
<script src="http://sdks.shopifycdn.com/js-buy-sdk/v0/latest/shopify-buy.umd.min.js" async="async" defer="defer"></script>
(There's also a http://sdks.shopifycdn.com/js-buy-sdk/v0/latest/shopify-buy.umd.polyfilled.min.js
I don't know what exactly the polyfill brings support down to, or if we still care about IE or old android)

Add the setup to theme.liquid's site setup script:
const shopClient = ShopifyBuy.buildClient({
    accessToken: 'efc42042e279a181b5d1e8c34313728f',
    domain: 'roswelldev.myshopify.com',
    appId: '6'
})
//The 6 may change. (first app?) I don't see how to get the real id.
//access token is from creating a private app.
*/
//setup global shopClient in theme.liquid
  if (typeof shopClient === 'undefined') {
    console.log('%cNOTE: the Collection page used the API method, but did not set up the shopClient','color: red; font-size: x-large')
    return;
  }
  var pagesCount = Math.ceil(c / PRODUCTS_PER_AJAX);

  var requests = [];
  for (var i = 1; i<= pagesCount; i++) {
    let page = i;
    requests.push(
      shopClient.fetchQueryProducts({
        'collection_id': collection_id,
        'limit':PRODUCTS_PER_AJAX,
        'page': page
      }).then(function(products) {
        for (var j = 0; j < products.length; j++) {
          allProducts[((page - 1) * PRODUCTS_PER_AJAX) + j] = items[j];
        }
      })
    );
  }
  $.when.apply($, requests).done(function() {
    allProducts = allProducts.filter(function(v, i) {
      return v ? v : null;
    });
    finishAjax();
  });
}

function loadDataAsset(url) {
  $.get(url,function(data) {
      allProducts = JSON.parse(data);
      finishAjax();
  })
}
//var preloaded_page = 0;
function loadDataJSON(productsCount, search_terms) {

  var pagesCount = Math.ceil(productsCount / PRODUCTS_PER_AJAX),
  search = '',
  //PROGRAMMER: pick one of these
  //view = "view=metafields&page=";//includes metadata
  view = "view=json&page=";//slightly simpler
  //TODO: need to be able to select this in the collection page.
  // - also, search?
  //TODO: does the pathname contain /tag? Could be very confusing, shouldn't

  //TODO: alt: use /collections/handle/products.json
  // - a lot of people hate that it reveals all their info, it doesn't seem to be documented.
  // + seems to be faster.

  if (search_terms) {
    search = 'view=json&q='+ escape(search_terms) + '&type=product&'
    //note: far less likely to be cached. Ideally, do the search internally.
  }//TEST:search url
  var baseUrl = location.pathname + '?' + search + view;

    totalPages = Math.ceil(productsCount / PRODUCTS_PER_PAGE);

    if (gparams.sortBy) {
      sortParam = '&sort='+gparams.sortBy;
    }

  //INIT VIA AJAX:
  var requests = [];

  for (var i = 1; i<= pagesCount; i++) {
    // if (preloaded_page === i) {
    //  continue;
    // }
    //problem: the "paginate collection.products by" needs to match the page size in collection.json
    // for preload to save a JSON load
    // but if it is 100 all the time, the liquid pagination stops working as intended
    // what I need is to get the correct "page" the slice lives on
    // --could also be split across "pages"
    //--more trouble that it is worth to save 1 ajax load, given that the preload works correctly.


    let page = i;
    requests.push(
      //TODO: I want this to be cached, but doesn't seem to be. The api calls are cached. Some apps hack xhr, too.
      //There's window.fetch, which is what the api call is using, but it didn't seem to work. either.
      // Maybe? I note the size is much smaller, but it doesn't say "from memory"
      // also not supported in IE without the polyfill
// fetch(baseUrl + page + sortParam,{
//   credentials: 'same-origin'  //probably don't actually need this?
// }).then((res)=>res.json()).then((items)=>{
// for (var j = 0; j < items.length; j++) {
//   allProducts[((page - 1) * PRODUCTS_PER_AJAX) + j] = items[j];
// }
// }});
//fetch also always returns, which is nice.
      $.get(baseUrl + page + sortParam, function(data) {
        var items = JSON.parse(data);
        for (var j = 0; j < items.length; j++) {
          allProducts[((page - 1) * PRODUCTS_PER_AJAX) + j] = items[j];
        }
      })
    );
  }

  $.when.apply($, requests).done(function() {
    allProducts = allProducts.filter(function(v, i) {
      return v ? v : null;
    });
    finishAjax();
  });
}


window.addEventListener('popstate', function(e) {
  //popstate does not trigger on initial page load
  if(e.state) {
    console.log(e);
    gparams = e.state;
    pageInit();
  }
});



//init has available to it only the variables passed in, and the page url
// should not actually do anything

function navinit() {
  var ps = splitParams();
  if (ps.q) {
    gparams.q = ps.q
  }
  if (ps.page) {
    gparams.page = parseInt(ps.page)
  }
  //get the tags off the url? Will be in the setFilter/popstate, but would be nice for a reload
}


navinit();
  return {
    'find':function (fn) {
      return allProducts.find(fn);
    },
'loadDirectly':function(products, current_page) {
  allProducts = products;
  gparams.page = parseInt(current_page)

  //render 1 page, assuming liquid did all filtering.
  //Do not override the anchors, let it go back to Shopify
  //Maybe? set the pagition anchors to grab the products[] JSON out of the page render?
  // reset allProducts, the page number, then re-render. Faster than re-loading the entire page.

  pageInit();
}
,
'loadRemotely':function(src, asset_url, total_products, search_count) {
  $('#ajaxLoader').show();
  //start the load the data from the url(s)
  //Init the anchor overrides
  if (src === 'json') {
    loadDataJSON(parseInt(total_products||search_count), gparams.q)
  } else {
    loadDataAsset(asset_url)
  }
}
,
'loadAPI':function(collection_id, count_of_collection) {
  $('#ajaxLoader').show();
  loadDataAPI(collection_id, count_of_collection);
}
,
/**
Need to call this first in order get the ajax call's filter options set up correctly
*/
'setFiltering':function(tags, search){
  //filterOptions is an array (and-level) of arrays (or-level) of items.
  if (tags) {
    if (!(tags instanceof Array)) {
      gparams.filterOptions = tags;
    } else {
    //Tags is an array of options, but not attached to any particular and-level. Throw them at all the or-level options.

      setTimeout(function(){//bg this
        rs_filter.searchToFilter(tags);
      },3);
    }
  }
/* 
  if (search) {
    //automagically select any search terms.

    setTimeout(function(){//bg this
      rs_filter.searchToFilter(search.split(/\W+/));
    },3);
  } */
  gparams.q = search;

  //setFilterOptions(gparams);
  //filtershown(gparams.filterOptions);
}
,
'setView': function (all) {
  if (all) {
    gparams.page = '999';
  } else {
    gparams.page = 1;
  }
  let pageLength = $('select#itemCounter').val();
  paginateProducts(gparams.page, pageLength);
}
,
/**
if you are looking at a page, dump that content directly and not wait for the ajax calls.
//render that content. Assuming there's no custom sort ordering or filtering in place yet, it will be the real content. (so the ajax load is only waiting on the other pages' data, and the pagination.)
//Prob: The ajax will eventually finish and call the same functions. Some (click inits) need to not be called twice.
- Don't want this rendering to slow down starting the ajax load. (Might want to make this an add-on to remote, so it knows to skip the page, start theload, then process the data it has while it waits)
*/
'preload': function (items, page) {
  //this is getting a bit messy, especially with pagination>1
  //but at least don't ever show filtered products.
  if (PRODUCT_RENDERER.filterProduct) {
    var tmp = [];
    $.each(items, function (i,o){
     if (PRODUCT_RENDERER.filterProduct(o)) {
       tmp.push(o);
     }
    });
    items = tmp;
  }
  for (var j = 0; j < items.length; j++) {
    allProducts[((page - 1) * PRODUCTS_PER_PAGE) + j] = items[j];//note: _PER_PAGE, not _PER_AJAX. This uses the shopify pagination number.
  }
  gparams.page = parseInt(page);
  gparams.filterOptions = gparams.filterOptions||{};
  if (gparams.filterOptions.q) {
    rs_filter.searchToFilter(gparams.filterOptions.q.split(','));
  }
  paginateProducts(gparams.page);
},
'postload': postload
  }
}
//TODO: test the "bg this" lines actually improve anything with a complicated page layout
//Ideally, rework all this so that the ajax setup occurs before any additional processing.
//- is currently the searchToFilter dom loops, the preload page layout (which, with an ajax loader, is entirely cosmetic!)
//- might reduce this to 1 function call, but with more params.
/*things are boiling down to:
accept the page data, show it now for snappy UI.
 - Ideally, hover, quickview, click, work at this point.
 - but not paginate or filter (maybe? If you click the filter, the filter options would be set for the main load).
 - it would be doubled work, but just rendering html in liquid is certainly good here.
 - - rendering all the html in liquid would make random filtering harder, but is do-able.
 - - certainly if you add data-tags={{tags}} data-price={{price}}
accept the filtering options, setup dom.
 is only really costly if there are filter options.
 (there's always a collection tag for liquid cached system)
 (tags, search, url (todo: pull more out of url, like /collections/spoopy?priceRange=2,3))
 -related: there's no way to bookmark advanced/non-shopify filter searches
 the page data already reflects filtering options, presumably
  but not if there are url based options.
if necessary start ajax loading product list
-wait for ajax loader
-if there's no flash or loss of hover status, could redraw after each ajax call
- also: quickview
filter product list
display page of products
 ideally the same list as the live page from point 1. might want to check to save dom redraw.
display pagination
 is usually offscreen, anyway.
Restrict available filter options to products
 -if this gets called on partial load, make sure it doesn't remove options.

*/

//Timber's drawer, more or less
// https://github.com/Shopify/Timber
// Source and Modifications to that source provided under the MIT license

//Simplify: don't need it to move the page over, doesn't need to to be directly clickable (though doing its own close is nice)

theme.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body'),//adds class
      page: $('#shopify-section-header') // listen to events
      ,moved: $('.is-moved-by-drawer') //shove this over by the width of the drawer.
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Notify the drawer is going to open
    //timber.cache.$body.trigger('beforeDrawerOpen.timber', this);

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    //this.$nodes.moved.addClass('is-transitioning');//what does this do for me?
    //this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    //this.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      //return false;
    });

    var closer = $.proxy(function () {
      this.close();
      return false;
    }, this);
    //this.$nodes.page.on('click.drawer', closer);//force them to click the close button?
    $('#BgDrawer').on('click.drawer', closer);

    // Notify the drawer has opened
    //timber.cache.$body.trigger('afterDrawerOpen.timber', this);
  };

  Drawer.prototype.close = function (evt) {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // Notify the drawer is going to close
    //timber.cache.$body.trigger('beforeDrawerClose.timber', this);

    // deselect any focused form elements
   // $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    //this.$nodes.moved.prepareTransition({ disableExisting: true });
    //this.$drawer.prepareTransition({ disableExisting: true });

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    this.removeTrapFocus(this.$drawer, 'drawer_focus');

    this.$nodes.page.off('.drawer');
    $('#BgDrawer').off('.drawer');

    // Notify the drawer is closed now
    //timber.cache.$body.trigger('afterDrawerClose.timber', this);
  };

  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  return Drawer;
})();

theme.modal = (function(){

  var closer = function() {
    $('.rs-modal').removeAttr('tabindex');
    $(document).off('focusin').off('keydown', escaper);//not sure as the cleanup is particularly necessary
    $('#BgModal').hide().off('click', closer);
    $('#FgModal').remove();//may not exist
  }
  var escaper = function(e) {
    e = e || window.event;
    if (e.key === 'Escape' || e.keyCode === 27) {
      closer();
    }
  };
  function show($container) {
      $container.addClass('rs-modal');//is that enough to bump it up to the page's positioning? Move the content into BgModal, otherwise
      $('#BgModal').show().on('click', closer);
      $container.focus();
      $container.attr('tabindex', '-1');
      $(document).on('focusin', function (evt) {
        if ($container[0] !== evt.target && !$container.has(evt.target).length) {
          $container.focus();
        }
      });
      $(document).on('keydown', escaper);
      $(document).trigger('opened.modal', [$container]);
    }
  return {
  /** shows modal with a title and an X button. (nobody has ever wanted a title.) */
  	modal: function($container) {
  		$('body').append('<div id="FgModal" role="dialog"><span class="closer">x</span><div></div></div>');
  		$container.appendTo($('#FgModal > div'));//was insert, doesn't seem to exist
  		$('#FgModal > .closer').on('click',closer);
  		show($('#FgModal'));
  	},
  	/** shows containers without an X or title */
    show: show
    ,
    hide: function() {
      closer();
    }
  }
})();

theme.wishlist = (function(){
  const keyname = 'rs_wishlist';
  /* local storage version:
  pros:
    doesn't require customer tracking
  cons:
    doesn't follow the user around
    public machine?
  */

  var getList = function () {
    var a = localStorage.getItem(keyname), b = [];
    if (a && a.length) {
      b = JSON.parse(a);
    }
    return b;
  }
  return {
    /** returns an array of Products
      note: while this may contain available:true, inventory data, don't use that info in displaying a wishlist list, as it may not be up to date.
    */
  load: function() {
    //might also lookup the current product info now
    return getList();
  }
  ,
  /** stores that product */
  save: function(product) {
    //could possibly store the product id only, and then lookup the product later.
    var b = getList();
    if (b && b.findIndex(function(w){ return w.id === product.id }) === -1) {
      // b.append(product);
      b.push(product);
      localStorage.setItem(keyname, JSON.stringify(b));
    }
    //TODO: GTM?
  }
  ,
  /** remove this product from the list */
  remove: function(product) {
    var b = getList();
    if (b) {
      localStorage.setItem(keyname, JSON.stringify(
        //b.filter((o)=>o.id != product.id) //Not supported in IE
        b.filter(function(o) {
          o.id != product.id
        })
      ));
    }
    //TODO: GTM?
  }
  ,
  /** is this product on the list? */
  isWished: function(product) {
    var b = getList(), found=0;
    if (b) {
      //found = b.find((o)=>o.id==product.id)//TODO: no IE support for find
      found = b.find(function(o) {
        o.id==product.id
      })
    }
    return found;
  }
  }
})();

/* CUSTOM.JS
Provide client-customized JS code.
This is mostly a library for the theme. code used by code inside individual pages.

this could also be directly in theme.liquid & save a download,
or as a separate asyc load

If we have a build process that is always git->slate->theme.min.js, this is fine here.
If it is a min lib, but leaving something editable for end user, this needs to be separate.

Don't actually execute code in here. If you want to run it on start-up, wrap it
pReady.push(function(){
});
Mostly, though, this is just defining functions that will be used by the
theme's code or by the code on a page.
*/

/*
Developer checklist:

Create filters
  Either manually, or tweak the generators to meet client needs
  Note there are 2 locations with filters:
Tweak Product Renderer to taste



*/

const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

Shopifyhandleize = function (str) {
  if(typeof str == 'string'){
    // Not the best way but this is written to solve the issue due to $ on the Gift page
    // 10 != -10 ($10 if handleize result to -10)
    str = str.replace('$', '');
    
    str = str.toLowerCase();
    var toRemoveEnd = ['"',  "'", "\\", "(", ")", "[", "]", ".", "-"];
    var toReplace = [ "'", "\\", "(", ")", "[", "]", "."];
    var toRemove = ['"'];   
    const strLength = str.length; 
    
    // For the old browsers
    for (var i = 0; i < toReplace.length; ++i) {
        str = str.replace(toReplace[i], "-");
    } 
    for (var i = 0; i < toRemoveEnd.length; ++i) {
      if(str.charAt(strLength - 1) ==  toRemoveEnd[i]){
        str = str.substring(0, str.length - 1); 
      }
      if(str.charAt(0) == toRemoveEnd[i]){
        str = str.slice(1)
      }    
    }   
    for (var i = 0; i < toRemove.length; ++i) {
      str = str.replace(toRemove[i], "");
    }
  
    str = str.replace(/\W+/g, "-");   
    if (str.charAt(str.length - 1) == "-") {
        str = str.replace(/-+\z/, "");
    }  
    if (str.charAt(0) == "-") {
        str = str.replace(/\A-+/, "");
    }    
    return str
  }
};

theme.productRenderer =
/** produce the html for the grid. This is the missing product-grid.liquid.
This is generally standardized, but consider adding new functionality here.
This is also a unique feature of the theme, and can be extended far beyond a grid of products.
Such as:
 reduce lists of related products to a single product
 expand product with complex variants into multiple listings
 produce filterable images (front-view, back-view)
 a buy now button
 rows, with 1 product but X number of images displayed
 tables, for spec driven products

This is both a lot of standard stuff and a big point of customization.
If we don't have a nice build system, this should not be in the .min.
*/
function () {
  function renderSwatches(product, variants) {
    var html = '<ul class="rs-swatch">';
    var colors = []; //prob: the variants are not uniq
    $.each(variants, function(i,o) {
      if (colors.indexOf(o.option1) === -1) {
        colors.push(o.option1);
      }
    })
    $.each(colors, function(i,o) {
      html += '<li class="'+o+'"';
      if (window.theme.swatches) {//optional: support the product-swatch block.
        window.theme.swatches.forEach(function(swatch){
          if (swatch[0] == o) {
            html += ' style="background-color:#'+ swatch[1] +'"';
            //example is Blue,#00F
            //but could be image url, an svg gradient
          }
        })
      }
      html += '><span class="visually-hidden">'+o+'</span></li>';
    })
    html += '</ul>';
    return html;
  }
  //Alt swatch function, use for buy now tech
  function renderSwatchesBuyNow(product, variants) {
    //one variant option only with this code:


    if(product.options.length > 0){
      var html = '<div class="swatch"><label class="swatch__label">'+ product.options[0] +'</label><ul class="rs-swatch swatch__wrapper submenu rs-and"  data-option="1" data-tag="'+product.id+'-option1">';
      let option1 = [];
      $.each(variants, function(i,variant) {
        let o = variant.option1;
        let t = Shopifyhandleize(o);
        if(!option1.includes(o)){
          option1.push(o);

        if (variant.available) {

          html += '<li class="rs-or swatch__item swatch-item filter-item '
          if(i == 0 ){
            html += 'filter-selected ';
          }
          html += t + '"';//|handle
          html += ' data-tag="'+ t +'"><span><span class="">'+o+'</span></span></li>';
        }
        }
      })
      html += '</ul></div>';
    }

    if(product.options.length > 1){
      html += '<div class="swatch"><label class="swatch__label">'+ product.options[1] +'</label><ul class="rs-swatch swatch__wrapper submenu rs-and" data-option="2" data-tag="'+product.id+'-option2">';
      let option2 = [];
      $.each(variants, function(i,variant) {
        let o = variant.option2;
        let t = Shopifyhandleize(o);
        if(!option2.includes(o)){
          option2.push(o);
        if (variant.available && variant.option2) {
           
          html += '<li class="rs-or swatch__item swatch-item filter-item '
          if(i == 0 ){
            html += 'filter-selected ';
          }
          html += t + '"';//|handle
          html += ' data-tag="'+ t +'"><span><span class="">'+o+'</span></span></li>';
        }
        } 
      })
      html += '</ul></div>'; 
    }

    if(product.options.length > 2){
      html += '<div class="swatch"><label class="swatch__label">'+ product.options[2] +'</label><ul class="rs-swatch swatch__wrapper submenu rs-and" data-option="3" data-tag="'+product.id+'-option3">';
      let option3 = [];
      $.each(variants, function(i,variant) {
        let o = variant.option3;
        let t = Shopifyhandleize(o);
        if(!option3.includes(o)){
          option3.push(o);

          if(variant.available && variant.option3) {
            if(o.indexOf('"') > 0) {
              o = Shopifyhandleize(o);
            }         
            html += '<li class="rs-or swatch__item swatch-item filter-item '

            html += t + '"';//|handle
            html += ' data-tag="'+ t +'"><span><span class="">'+o+'</span></span></li>';
          }
        }
      })
      html += '</ul></div>';     
    }
    return html;   
  }
  //kind of confusing: while it is not possible to have the noJS form here, the select list is the ultimate storage of the variant id
  //Buy now tech
  function renderNoJS(product){
    var html = '<select name="id" class=" visually-hidden product-select" id="SingleOptionSelector-'+product.id+'">'
    $.each(product.variants, function(i,variant) {
      html += '<option value='+variant.id+'>'+ variant.title +'</option>'
    })
    html += '</select>'
    return html;
  }
  function renderSale(product){
    var html = '';
    if (product.available){
      if (product.price < product.compare_at_price){
        html+='<div class="sale-item icn">'+theme.strings.sale+'</div>'
      }
    }else{
      html+='<div class="so icn">'+theme.strings.soldOut+'</div>'
    }
    if (product.template_suffix == 'pre-order') {
      html+='<div class="pre-order icn">'+theme.strings.preorder+'</div>'
    }
    return html;
  }

  function fetchImgRendition (imgUrl, size) {
    // use slate.Image.getSizedImageURL. I'm not sure what this actually does. Seems to be the same thing.
    if(imgUrl) {
      var urlParts = imgUrl.split('/');
      var imgParts = urlParts.length ? urlParts[urlParts.length - 1].split('.') : '';
      if (imgParts[imgParts.length - 2]) imgParts[imgParts.length - 2] = imgParts[imgParts.length - 2] + '_' + size;
      urlParts[urlParts.length - 1] = imgParts.join('.');
      return urlParts.join('/');
    }
    return false;
  }
  /** include variants to get a price range (if applicable)
  */
  function renderPrice(product, variants) {

    if (variants && variants.length > 1) {
      var min_price=99999999, max_price=0, diff = 0;
      for (i in variants) {

        // I have no idea why there was "String Math" here, but I replaced it.
        if(min_price > variants[i].price ) {
          min_price = variants[i].price;
        }

        if(max_price < variants[i].price){
          max_price = variants[i].price;
        }
      }
      if (max_price != min_price) {
        return '<offer itemprop="offers" itemscope itemtype="http://schema.org/Offer">\
                <meta itemprop="priceCurrency" content="'+theme.currency+'">' + (
            product.original_price !== undefined
             ?'<s class="product-price was">' + theme.toMoney(product.original_price) + '</s> <span class="product-price onsale range">' + theme.toMoney(min_price) + '</span> - <span class="product-price onsale range">' + theme.toMoney(max_price) + '</span>'
             : '<span class="product-price range">' + theme.toMoney(min_price) + '</span> - <span class="product-price range">' + theme.toMoney(max_price) + '</span>'
           ) + '</offer>';
      }
    }
    //There's also a compare_at_price?
    return  '<offer itemprop="offers" itemscope itemtype="http://schema.org/Offer">\
            <meta itemprop="priceCurrency" content="'+theme.currency+'">' + (
            product.original_price !== undefined
         ?'<s class="product-price was">' + theme.toMoney(product.original_price) + '</s> <span class="product-price onsale">' + theme.toMoney(product.price) + '</span>'
         : '<span itemprop="price" class="product-price">'+theme.toMoney(product.price) + '</span>'
       ) + '</offer>';
         //locale seems to be very slow. Pretty sure it is always a $.
  }
  function renderAnchor(product) {
   return 'href="/products/' + product.handle + '" title="'
    + product.title + '"';//TODO: escape "
  }
  function filterImgs(product, filterOptions) {
    var out = [];
    if (filterOptions == null) {
      return product.images;
    }
    //Use whatever data is in product, variant, and the .images urls to figure out what images are related to the filterOptions.
    // One could possibly write one function that meets all needs, but it is probably simpler to write smaller specific ones and re-use them.

    //Here's a sample that assumes the image urls will have the color filter text in them, and that there's no overlap in tag text. (blue/navy blue):
    var cs = filterOptions['color'];
    //Other options: filterVars(), then use the variant to pull the images. (sku, for example)
    if (cs === undefined || cs.length == 0) {
      return product.images;
    }
    for (i in product.images) {
      for (j in cs) {
        if (theme.isImageStrRelated(cs[j], product.images[i].url, product.images[i].alt)) {
          out.push(product.images[i]);
          break;
        }
      }
    }
    if (out.length == 0) {
      return product.images;//better something than nothing.
    }
    return out;
  }
  function filterVars(product, filterOptions) {
    var out = [];
    if (product.variants.length && filterOptions != null) {

      //will need custom code here
      //sample, assuming variant.option1 is color, and there is a matching color filter.
      //note the similarity to filter images.
      var cs = filterOptions['color'];
      if (cs === undefined || cs.length == 0) {
        return product.variants;
      }
      for (i in product.variants) {
        for (j in cs) {
          if (cs[j] == product.variants[i].option1) {
            out.push(product.variants[i]);
            break;
          }
        }
      }

    }
    return out;
  }
  function renderQuickviewButton(product) {
  	return '<button class="quickview" onclick="theme.quickviewer.showurl(\''
  	+renderAnchor(product)
  	+'?view=quick\')">Quick View</button>'
  	//should not be an a href to the quickview, or at least rel=nofollow
  }

  function renderMeta(product) {
    return '<meta itemprop="name" content="'+product.title+'">\
<meta itemprop="url" content="'+('https://'+location.host+'/products/' + product.handle)+'">\
<meta itemprop="brand" content="'+product.vendor+'">\
<meta itemprop="description" content="'+product.description.replace(/"|<.*?>/g, '')+'">';
  }
  function renderBuyNow(product, variants) {
    if (!product.available) {return '';}
    if (variants && variants.length > 1) {
      return '<div class="buynow select-needed" data-option="1">'
      + '<form method="post" enctype="multipart/form-data" action="/cart/add" data-product-id="'+product.id+'">'
      +  renderSwatchesBuyNow(product, variants)
      + '<div style="display:none" class="hidden-selectors"></div>'
      + renderNoJS(product)
      + '<div class="collection-item__form">'
      + '<div class="quantity small--hide rs-quant-home product__quantity"><input type="number" name="quantity" value="1" min="1"></div>'
      + '<button type="submit" name="add" class="add-to-cart cta btn btn--dark collection-item__button">'+theme.strings.addToCart+'</button>'
      +'</div>'
      +'</form></div>'
    } else {
       return  '<div class="buynow1"><form><input type=hidden name=id value="'+variants[0].id+'">'
       + '<div class="collection-item__form">'
       + '<div class="quantity small--hide product__quantity"><input type=number value=1 name=quantity></div>'
       + '<button type="submit" name="add" class="add-to-cart cta btn btn--dark collection-item__button">'+theme.strings.addToCart+'</button>'
       +'</div>'
      +'</form></div>'
    }
  }
  function renderReveal(product, imgs){
    if (!imgs[0]) { 
      return '<div class="collection-item__image" style="background-image:url(http://cdn.shopify.com/s/images/admin/no-image-compact.gif);"></div>'; 
    }else{
      return '<div class="collection-item__image" style="background-image:url('
      + fetchImgRendition(imgs[0], 'large')
      +');">'
      //+ product.title.replace('"', '&quote;') //TODO: actual escape
      +'</div>';
    }

  }
return {
  /**
  requires the js product, + an optional array of filtered variants (product.variants) to produce a price range
  */
  renderPrice: renderPrice,//could be used a lot of places
  renderGrid: function (idx, product, filterOptions) {

    //BETTER: get the filtered variant(s), change PRICE with the images.
    // maybe add a (3 variants) label?
    if (!product.images) {return '';}
    var imgs = filterImgs(product, filterOptions);
    var variants = filterVars(product, filterOptions);

    return '<div class="product-index f4-12 small--f6-12 collection-item">'
    + '<div class="prod-container" itemscope itemtype="http://schema.org/Product">'
    + renderMeta(product)
    + renderSale(product)
    +'<div class="prod-image">'
    +'<a '
    + renderAnchor(product)
    +'>'
    + renderReveal(product, imgs)//opt, but likely
    +'</a></div></div><div class="product-info"><a class="collection-item__info"'
    + renderAnchor(product)
    +'><h3 class="collection-item__title">'
    + product.title
    +'</h3><div class="price">'
    + renderPrice(product, variants) + ' / Unit'
    +'</div></a></div>'
    //+ renderQuickviewButton(product)//optional
    + renderBuyNow(product, variants)//optional, would not want both of these
    +'</div>'
  }
  ,
  renderProduct: function(product, variants) {
    return '<h1>'
    + product.title
    +'</h1><p>'
    + product.vendor
    +'</p><div class="price">'
    + renderPrice(product, variants)
    +'</div>';
  }
  ,
  renderSwatchList: function(swatchlist, classes) {
    //TODO: given what we know about swatches, produce a full list of Swatches
    //such as turning theme.swatches into a UL automatically, then putting this into the filter-menu
    //could also be a linked list? MWK has 4 lists, 2 swatches, 2 checkboxes.
    // the swatch block can only do 1? YAML? JSON?
    // could always add the checkbox(es), just hide it for swatches...
    // need 2 or 3 columns, more than you can put in a menu.
    //  put the commas in the title?
    //TODO: put the json in the swatch section, but also provide an app to generate that json out of spreadsheet text.
    //sample:
    //foreach swatchlist as (readable, tag, color) {
    //  '<li class="'+classes+' '+color+'" data-tag="'+tag+'">'+readable+'</li>';
  }
/* - optional (even if empty, this will run for every product, so leave it commented)
As noted, this is a less than ideal way of making sure people don't see things, so try to do this
before doing this.
  ,
  /**
  stop downloaded products from showing up on the list
  Remember, obscurity is not security. Just because poeple can't see the product
  in the collection doesn't mean they won't see the data in the network log.
  *  /
  filterProduct: function(product) {
    if (!product.images || product.images.length === 0) {return false}
    if (!product.available && (product.variants.map(function(o){return o.inventory_policy === 'deny'}).reduce(function(a, c){return a || c}, false))) {return false;}
    return true;
  }
  */
}
}


theme.CUSTOM_FILTERS = {
  'Sizes': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }

        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return false;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },
  'Size': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }

        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return false;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },
  'size': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }
        // console.log(Shopifyhandleize(v.option1));

        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return or;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },
  'color': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }
        // console.log(Shopifyhandleize(v.option1));

        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return or;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },
  'fastening-system': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }
        // console.log(Shopifyhandleize(v.option1));

        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return or;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },
  'Thickness': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }
        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return false;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },
  'Diameter': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
        if (v.available == false) {
          return true;//exclude this variant
        }
        if (tag == Shopifyhandleize(v.option1) || tag == Shopifyhandleize(v.option2) || tag == Shopifyhandleize(v.option3) ) {
          or = true;
          return false;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  },  
  'Metal Type': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {

          if(v.available == true && tag == Shopifyhandleize(obj.type) ){
            or = true;
            return false;//won't break out of the outer loop :(
          }        
      });
    });
    console.log(or)

    return or;
  }, 
  'Form': function (ortags, obj){//Product page, or collections if you really need it, variant
    var or = false;

    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
          if(v.available == true){

            if(obj.tags.includes(tag)){
              or = true;
              return false;//won't break out of the outer loop :
            }
          }        
      });
    });

    return or;
  },    
  
  'Price': function (ortags, obj){
    var or = false;
    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      var explode = tag.split('-') //where tags are in the form of "20-40"
      if ((explode[0] == '' || obj.price >= explode[0]+'00') && (explode[1] == '' || obj.price <= explode[1]+'00')) {
        or = true;
        return false;
      }
    });
    return or;
  }
/*
function tags, product
return true if the product is acceptable to _any_ of the selected tags

By default, the filtering only looks at product.tag equality
Other options include looking at other strings, or ranges,
or conditions like "low stock" or "recently added".
Anything added here is something no other Shopify theme has!

sample:
  function sampleVariantSearch(ortags, obj){
    var or = false;
    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      $.each(obj.variants, function (j, v) {
	      if (v.available == false) {
					return true;//exclude this variant
				}
        if (tag == v.option1||tag == v.option2) {
          or = true;
          return false;//won't break out of the outer loop :(
        }
      });
    });
    return or;
  }
  function samplePriceSearch(ortags, obj){
    var or = false;
    $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
      var explode = tag.split('-') //where tags are in the form of "20-40"
      if ((explode[0] == '' || obj.price >= explode[0]+'00') && (explode[1] == '' || obj.price <= explode[1]+'00')) {
        or = true;
        return false;
      }
    });
    return or;
  }
  define that, then put this here:

  price: samplePriceSearch,
  size: sampleVariantSearch,
  color: sampleVariantSearch



Other fun filters:
Inventory management
function hide_unavilable(tags, product) {
  return product.available;
  //no tags! this only gets run if the one and only tag gets checked.
}
function inventory(tags, product) {
  //this might have in-stock(checked by default)/back-order/out-of-stock
  if (product.available && tags.includes('in-stock'){
    return true;
  }
  if (!product.available && tags.includes('back-order') {
    return true;
  }
  if (!product.available && tags.includes('out-of-stock')
  && (product.variants.map(function(o){return o.inventory_policy === 'deny'}).reduce(function(a, c){return a || c}, false))) {return '';}
    return true;
  }
  return false;
}
Color: function (ortags, obj){
  //use the generic colors
  var or = false;
  $.each(typeof ortags == 'object' ? ortags : [ortags], function (i, tag) {
    $.each(obj.variants, function (j, v) {
      if (v.available == false) {
        return true;//exclude this variant
      }
      if (tag == v.option1) {
        or = true;
        return false;//won't break out of the outer loop :(
      }

      if (theme.colorSwatches) {
      var generic = theme.colorSwatches[v.option1];
        if (generic && generic.baseColor == tag) {
          or = true;
          return false;
        }
      }
    });
  });

  Don't forget to remove dev comments for production!
  */
  //
  //Thought: return count of or matches, sort accordingly.




};

theme.CUSTOM_FILTERS_STRINGS = {
/* If you have a list of selected filters that is not the filter menu items themselves,
you may want customized labels. Add that here.
See also section.settings.show_filters

sample:
   'price':function(ortag){//where the tags are in the form 'XX-YY'
     if (ortag == '-250') return 'Under $250'
     if (ortag == '5000-') return 'Over $5000'
     var _ = ortag.split('-');
     return '$'+_[0]+' - $'+_[1];
 }
 */
};


/**
 * does this image match the color?
 * This is very client specific and may involve a certain amount of magic
 @param str
 @param img_url
 @return boolean
 */
theme.isImageStrRelated = function (str, img_url, img_alt) {
  return img_alt == str || img_url.includes('-'+(encodeURIComponent(str))+'.jpg');
  //rules on how to handle ' ', would need to adapt to the specific files.
  //rules for -color- or _color.jpg
  //could be variant sku, color->code lookup table, etc.
  //could also look at the href, variant.option1, variant.sku, etc.

}
/**
 * Something about this variant is related to the product image urls.
 * Probably the option with the color in it, but could be name, sku, a table lookup.
 * Don't need to worry about encoding it, as it gets passed into isImageStrRelated
 @param variant
 @return string
 */
theme.getImageCodeFromVariant = function (variant) {
  //will need to match client specific data
  //Using generic color images->
  // if (theme.colorSwatches) {
  //   for (var swatch in theme.colorSwatches) {
  //     if (swatch == variant.option1) {
  //       return theme.colorSwatches[swatch].baseColor;
  //     }
  //   }
  // }

  return variant.option1;
//Assumes: the variant images are the only ones the product has, and they don't have related names: return the variant image name
//return variant.featured_image.src.match(/products\/(.*?)\.jpg/)[1];
}


/*=============================================
Fake Filter Selectors 
=============================================*/
$(function(){
  $('body').on('click', '.fake-filter', function(){
    $this = $(this);
    let tag = $this.attr('data-tag');
    $this.toggleClass('filter-selected');

    let parentElement = $this.closest('li');
    let selectedChildren = parentElement.find('.second-tier .filter-selected');

    if(parentElement.hasClass('toggle-open')){
      parentElement.removeClass('toggle-open');
    }else{
      parentElement.addClass('toggle-open');
    }

    if(selectedChildren.length > 0){
      selectedChildren.each(function(i){
        $(this).trigger('click');
      });
    }

    $('#data-form').find('.fake-filter-item[data-tag="'+ tag +'"]').trigger('click');

  });

  $('body').on('update', '.fake-filter-item', function(){
    let tag = $(this).attr('data-tag');
    console.log(tag);
    $(this).closest('.submenu').find('.fake-filter[data-tag="'+ tag +'"]').removeClass('filter-selected').closest('.toggle-open').removeClass('toggle-open');
  })
})



/* end custom.js */

/**
 Uses the browser's concept of currency instead of the string settings coming from the Shopify
 */
theme.toMoney = function(str) {
  //Eventually: currency translation?
  return parseFloat((str)/100).toLocaleString(undefined, {style:'currency',currency:theme.currency,currencyDisplay:theme.currencyDisplay})
  //locale is kind-of slow.
}

$(function(){
  function ProductRecommendations(container) {
    var $container = $('.' + container);
    var baseUrl = $container.data('baseUrl');
    var productId = $container.data('productId');
    var limit = $container.data('limit');
    var productRecommendationsUrlAndContainerClass = baseUrl + '?section_id=product-recommendations&limit=' + limit +
      '&product_id=' +productId;
    $container.parent().load(productRecommendationsUrlAndContainerClass);
  }
  ProductRecommendations('product-recommendations');
})

/** add +/- buttons around an input
 * requires that the inputs not be siblings
 */
theme.adjusters = function ($container) {
  //decorate the number inputs
  $('input[type="number"]',$container).each(function(i,o) {
    var $o = $(o);
    $o.before('<button class="rs-quant minus">&minus;</button>');//accessibility?
    $o.after('<button class="rs-quant plus">&plus;</button>');//accessibility?
  })
  $container.addClass('rs-quant-home');
  //test: better, a or b?
  $('.rs-quant', $container).on('click', function(e) {//< much better
  //$container.on('click','.rs-quant', function(e) {
    e.preventDefault();//maybe not a button?
    var $this = $(this), $input = $this.siblings('input'), value = parseInt($input.val()), out;
    !isNaN(value) && (out = (value + ($this.hasClass('plus')?1:-1)))>=0 && out <= theme.maxQty && $input.val(out);
    value != out && $input.trigger('change'); //This did not seem to be happening automatically.

    //PDP Button Handler
    if($this.parent().hasClass('product__quantity')) {
      var getAvailableQuantity = $this.parent().attr('data-available-quantity');

      if(parseInt($input.val()) > parseInt(getAvailableQuantity)) {
        $('[name="add"]').attr('type', 'button').addClass('redirect-contact').addClass('btn--color_gradient').html('CONTACT US');
      } 
      else {
        $('[name="add"]').attr('type', 'submit').removeClass('redirect-contact').removeClass('btn--color_gradient').html('ADD TO CART');
      }
    }
  });
}
/**
 * Uses theme.isImageStrRelated to check if the image url is visibly.
 * Presumably, the strs is the ['color'] from a selected variant.
 * Bonus feature: if you have x variants, but all the blue are OutOfStock,
 * passing in ['red','green'], the available variants, will nuke any blue imgs.
  @param strs - the selected option for a pre-specified filter
  @param $container jQuery obj which has been initialized with .slick.
  @param $container second jQuery obj which has been initialized with .slick, presumably the "asNavFor" for the first one.
  @return null
 */
theme.filterThumbnails = function(strs, $container, $navFor, currVariant) {
//Is very slick dependent, but doesn't have local deps.
  $navFor.slick('slickUnfilter');
  $container.slick('slickUnfilter');//slick doesn't just filter things, it removes them.
  $navFor.find('.slick-slide.filtered').removeClass('filtered');
  $container.find('.slick-slide.filtered').removeClass('filtered');
  if (strs && strs.length) $container.find('img.js').each(function (i,o){
    var $o = $(o);
    strs.forEach(function(str){
      if (theme.isImageStrRelated(str, $o.attr('src')||$o.attr('data-lazy'), $o.attr('alt'))) {
        $o.closest('.slick-slide').addClass('filtered');
      }
    })
  })
  //this could probably be done at the same time: the images/slides have the same index
  if (strs && strs.length) $navFor.find('img.js').each(function (i,o){
    var $o = $(o);
    strs.forEach(function(str){
      if (theme.isImageStrRelated(str, $o.attr('src')||$o.attr('data-lazy'), $o.attr('alt'))) {
        $o.closest('.slick-slide').addClass('filtered');
      }
    })
  })
  //if no matches, show everything rather than nothing.
  if ($container.find('.slick-slide.filtered').length != 0) {
    $container.slick('slickFilter', '.filtered');
    $navFor.slick('slickFilter', '.filtered');
  }
  //Slider is getting this index value, then going to the actual[index] in the new slides array
  //https://github.com/kenwheeler/slick/issues/515
  //remove this if it ever gets fixed
  $('.slick-slide', $navFor).not('.slick-cloned').each( function(i) {
    $(this).attr('data-slick-index', i);  // .data() does NOT work
  })
  
  $('.slick-slide', $container).not('.slick-cloned').each( function(i) {//probably unnessary, but I would like the main image to move the nav slider, should the nav slider ever get big enough.
    $(this).attr('data-slick-index', i);  // .data() does NOT work
  })
  //even if the image they were looking at was filtered, go to first element.
  if (currVariant && currVariant.featured_image && currVariant.featured_image.position) {
    var slickIdx = $container.find('[data-position="' + currVariant.featured_image.position + '"]').closest('.slick-slide').data('slick-index');
    $container.slick('slickGoTo', slickIdx);
  } else {
    $container.slick('slickGoTo', 0);//move the other one?
  }
}


$(function() {
  //var sections = new slate.Sections();
  //sections.register('product', theme.Product);
  //Does a search for data-section-type="product", then inits theme.Product
  //my preference would be to init product on the product page.
  //more, the first thing product does on init;
  // Stop parsing if we don't have the product json script tag when loading
  // section in the Theme Editor
  //so Sections exists for theme editing, but product does nothing when theme editing?
  // Don't need sections if there's no product here.
  //I'd like to beable to pass more things into Product, but this makes it impossible.
  //Not sure what having this in the Theme editor gets me. I want to do a lot with sections,
  // but I use the schema. Same? Better?
  //remove?

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));
  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';
  slate.rte.wrapTable({
    $tables: $('.rte table'),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  slate.rte.wrapIframe({
    $iframes: $('.rte iframe[src*="youtube.com/embed"],.rte iframe[src*="player.vimeo"]'),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }



  setTimeout(function(){//background
    //this whole bit might be removed, though I do like being able to throw a slider on random pages, like blog or the home.
  //slick sliders for homepage sections, related products, etc.
  $('.slider_responsive').slick({//TODO: port over the old homepage sections, make sure it uses this.
    dots: true,//TODO: adjust this accordingly
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,//probably don't need this one
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,//CSS: make mobile full sized, no main image
          slidesToScroll: 1
        }
      }
    ]
  });
  $('.zoomer').zoom();//not entirely sure about that zoom lib.
  // - also needs integration with thumb clicker
  //MAYBE: both zoom and carousel.
  //- disadvantages: would need to gut the Featured and thumbnail things.
  //  Would need lazy load, given that it is all large images.
  //  Would need to be filterable for variant selection changes
  //  People might also want the thumbnails, need to sync both 2-way
  // could actually have all 3 in the lib, and switch tech based on the settings/css?
  //https://codepen.io/hagiang1305/pen/YpXVgO
  //Could have 2! sliders, one big, lazy loaded, one small thumbnail that can drive the big one. Could filter them both.
  //if the product.js updateProductImage can not update the zoomed image, definitely do this,  remove the featured_image from the js
  // possible problem: zoom on lazy load? Each of the slider items needs to be zoomed separately.
  //  - add/remove zoom on slide switch? Would integrate with the lazy load, too.
  //   - could have med, lg lazy load, depending on screen size. Good for mobile.


  $('.stickySidebar').stickySidebar({
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.sticky-block',
    innerWrapperSelector: '.sidebar__inner'
  });
  //TODO: sticky header? Would rather use this than custom code

  },10);

  //TDOO: modal system
  //Re-use nav drawer's focus code?
  // background layer in theme
  // escape key listener
  // close event.



  //boot up libraries
  theme.cart = new theme.rsCart();
  theme.LeftDrawer = new theme.Drawers('NavDrawer', 'left');//eventually: consistant caps
  theme.RightDrawer = new theme.Drawers('CartDrawer', 'right', {
    'onDrawerOpen': function(){theme.cart.showCart('#ajaxcart')}
  });


  //Integrate libraries with page.
  //In general, libraries emit something you need to listen for here, or listen to buttons in the UI to call lib functions.
  //Ideally, don't do actual work here.

  $('#CartDrawerB').on('click', function(e){
    e.preventDefault();
    theme.RightDrawer.open(e);
  })
  $('.toggleNav').on('click', function(e){
    e.preventDefault();
    theme.LeftDrawer.open(e);
  })

  //Ajax cart support.
  var cartupdater = function($event, cart) {
    $('.CartCount').text((cart.item_count) || 0);//IS line items, not total quantity
    $('.CartCost').text(theme.toMoney(cart.total_price));
    if (theme.RightDrawer.drawerIsOpen) {
      //theme.cart.showCart('#ajaxcart');
      // - will not want this with a live update
  		//are we editing the ajax cart
			if ($('#cartTemplate').length) {//while we looking at the cart page?
				theme.cart.showCart('#cartTemplate');
			}
    }
  }
  $(document).on('cartupdate', cartupdater).on('cartfail', function(){$('.carterror').show()})
  // bind cart submit button
  /*$('#cartTemplate').on('submit', 'form', function(e){//form needed? who else is submitting things?
    e.preventDefault();
    theme.cart.addToCart($(this).serialize())
    theme.RightDrawer.open()
  })*/
  //intercept the checkout button so it can be logged first.
  $('#ajaxcart').on('click', 'input[name=checkout]', function(e){
    e.preventDefault();

    //submit to GTM first, wait for it to do it's thing.
    //could also add this to the chekout page script
    var doneFunc = function() {
      //$('#ajaxcart form').append("<input type=hidden name=checkout value=Checkout>");//simulate submitting the checkout button. //TEST: May not be necessary.
      $('#ajaxcart form').submit();
      //location.href = '/checkout';
      //smallish issue: if this goes directly to checkout, it isn't submitting changes in the cart.
      //this isn't an issue with traditional RS carts, but it is certainly possible to put notes, editable quantity fields in the cart.
      //could listen to the button, then submit the form
      //smallish issue: the form has both update and checkout buttons, auto-submit isn't actually clicking either.
      //test this actually works, then remove these comments and pretend I actually know what is going on.
    };
    if (typeof USE_DEFAULT_GTM !== "undefined" && USE_DEFAULT_GTM) {
      $.when(theme.cart.getCart()).done(function(cart){
        dataLayer.push({
          'event': 'ecommerce_event',
          'eventCategory': 'ecommerce',
          'eventAction': 'checkout',
          'ecommerce': {
            'detail': {
              'cart': cart
            }
          },
          'eventCallback': doneFunc
        });
      })
    } else {
      doneFunc();
    }
  })
  //cart button
  .on('click','.cartremover',function (e){
    e.preventDefault();
    theme.cart.removeFromCart($(this).data('variant-id'))
  })
  //quantity button
  .on('change','.quantity input',function (e){
    e.preventDefault();
    var $val = $(this);
    var d = {};
    d[$val.data('variant-id')] = parseInt($val.val())
    theme.cart.updateCart({updates: d});
  })

  //Utility block for things that can't be disabled properly, such as still requiring mouse-overs
  // don't use no-events css! Same as prop('disabled')
  $('body').on('click','.disabled', function(e){
    e.preventDefault();
    return false;
  });

  if (theme.finish_loading) {
    theme.finish_loading();
  }
  $(document).trigger('loaded.theme');
});

/*=============================================
Globals
=============================================*/



$(function(){

})