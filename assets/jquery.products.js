/**
 * Module to show Recently Viewed Products
 *
 * Copyright (c) 2014 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
 Shopify.Products = (function() {

	var config = { 
		howManyToShow: 3,
		howManyToStoreInMemory: 10, 
		wrapperId: 'recently-viewed-products', 
		onComplete: null
	};
   
	var productHandleQueue = [];
	var wrapper = null;
	var shown = 0;

	var cookie = {
		configuration: {
			expires: 90,
			path: '/',
			domain: window.location.hostname
		},
		name: 'shopify_recently_viewed',
		write: function(recentlyViewed) {
			Cookies.set(this.name, recentlyViewed.join(' '), this.configuration);
		},
		read: function() {
			var recentlyViewed = [];
			var cookieValue = Cookies.get(this.name);
			if(cookieValue && cookieValue !== null) {
				recentlyViewed = cookieValue.split(' ');
			}
			return recentlyViewed;        
		},
		destroy: function() {
			Cookies.remove(this.name);
		},
		remove: function(productHandle) {
			var recentlyViewed = this.read();
			var position = jQuery.inArray(productHandle, recentlyViewed);
			if (position !== -1) {
				recentlyViewed.splice(position, 1);
				this.write(recentlyViewed);
			}       
		}
	};
   
	var finalize = function() {
		wrapper.show();
		// If we have a callback.
		if(config.onComplete) {
			try { config.onComplete() } catch (error) { }
		}  
	};
   
	var moveAlong = function() {
		if (productHandleQueue.length && shown < config.howManyToShow) {
            if(window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)){
              var productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
            }else{
              var productHandle = null;
            }

			if(productHandle!=productHandleQueue[0]) {
				jQuery.ajax({
					url: '/products/' + productHandleQueue[0] + '?view=item-ajax',
					cache: false,
					success: function(product) {
                      	if(product.indexOf('product-item')>0) {
                          wrapper.append(product);
                          productHandleQueue.shift();
                          shown++;
                          moveAlong();
                       } else {
                          cookie.remove(productHandleQueue[0]);
                          productHandleQueue.shift();
                          moveAlong();
                       }
					},
					error: function() {
						cookie.remove(productHandleQueue[0]);
						productHandleQueue.shift();
						moveAlong();
					}
				});
			} else {
				productHandleQueue.shift();
				moveAlong();
			}
		} else {
			finalize();
		}
	};

	return {
		resizeImage: function(src, size) {
			if(size == null) {
				return src;
			}

			if(size == 'master') {
				return src.replace(/http(s)?:/, "");
			}

			var match  = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);

			if(match != null) {
				var prefix = src.split(match[0]);
				var suffix = match[0];

				return (prefix[0] + "_" + size + suffix).replace(/http(s)?:/, "")
			} else {
				return null;
			}
		},

		showRecentlyViewed: function(params) {
			var params = params || {};

			// Update defaults.
			jQuery.extend(config, params);

			// Read cookie.
			productHandleQueue = cookie.read();

			// Element where to insert.
			wrapper = jQuery('#' + config.wrapperId);

			// How many products to show.
			config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

			// If we have any to show.
			if (config.howManyToShow && wrapper.length) {
				// Getting each product with an Ajax call and rendering it on the page.
				moveAlong();
			}
		},

		getConfig: function() {
			return config;
		},

		clearList: function() {
			cookie.destroy();
		},

		recordRecentlyViewed: function(params) {
			var params = params || {};

			// Update defaults.
			jQuery.extend(config, params);

			// Read cookie.
			var recentlyViewed = cookie.read();

			// If we are on a product page.
			if (window.location.pathname.indexOf('/products/') !== -1) {
				// What is the product handle on this page.
				var productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
				// In what position is that product in memory.
				var position = jQuery.inArray(productHandle, recentlyViewed);
				// If not in memory.
				if (position === -1) {
					// Add product at the start of the list.
					recentlyViewed.unshift(productHandle);
					// Only keep what we need.
					recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
				} else {
					// Remove the product and place it at start of list.
					recentlyViewed.splice(position, 1);
					recentlyViewed.unshift(productHandle);              
				}

				// Update cookie.
				cookie.write(recentlyViewed);
			}
		}
	};
})();