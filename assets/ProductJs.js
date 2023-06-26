var ProductJs = function( product ) {
	var item = $('#product-item-'+product.id);
	var variantSelectorId = "product-select-"+product.id;

	var init = function() {
      	if(!item.hasClass('initialized')) {
          
          if(item.hasClass('ticket')){
            initGallery();
          } else {
            initVariantStatus();
            initializeVariantSelector();
            initGallery();
          }
          
          item.addClass('initialized');
        }
	};
	
	var initVariantStatus = function() {
		$.each(product.variants, function(key, variant){
          	//AVAILABLE
          	if(variant.available) {
            	variant.status = 'available';
          	} else {
            	//SOLDOUT
            	variant.status = 'soldout';
          	}
		})
	};
	
	var initializeVariantSelector = function() {
		var selectCallback = onVariantSelected();
	  
		new Shopify.OptionSelectors(variantSelectorId, { product: product, onVariantSelected: selectCallback });

      	if(product.options.length > 1) {
			if(product.variants.length > 1) {
              Shopify.linkOptionSelectors(product);

			  /*$.each(product.options, function(key, variant){
				item.find('.single-option-selector:eq('+key+')')
				.filter(function() { return $(this).find('option').size() > 1  })
				.prepend('<option value="">Choose '+product.options[key]+'</option>')
				.val('')
				.trigger('change');
			  });*/
			}

			// Add label if only one product option and it isn't 'Title'.
			if(product.options.length == 1 && product.options[0] != 'Title') {
			  item.find('.selector-wrapper:eq(0)').prepend('<label>'+product.options[0]+'</label>');
			}

          	item.find('.selector-wrapper label').append(':');
		} else {
          	if(product.variants.length > 1) {
                item.find('.select-variant').change(function(){
                    var variantSelected = false;
                  	$.each(product.variants, function(key, variant){
                        if(variant.id==item.find('.select-variant').val()) {
                            variantSelected = variant;
                            return;
                        }
                    });
                  	selectCallback(variantSelected, null);
                });
            }
		}
      
      	

      	if(product.variants.length==1) {
      		selectCallback(product.variants[0], null);
        } else {
          	
        }
  	};

  	var getFirstAvailableVariant = function() {
      for( var i = 0; i < product.variants.length; i++){ 
        if(product.variants[i].available)
          return product.variants[i];
      }	
    };

    var setDefaultVariant = function(variant){
      if(variant) {
      	$('.single-option-selector').each(function(){
          var selector = this;
          var option = $(selector).data('option');
          $(selector.options).each(function(){
            if(this.value == variant[option]){
             // $(selector).val(this.value).trigger('change');
              return;
            }
          });
        });
      }
    };
  
	var onVariantSelected = function() {
		return function(variant, selector) {
			if(variant && variant.id) {

              	
              
              	//Update the price
              	item.find('.price .deal span').html(Shopify.formatMoney(variant.price, formatMoney).replace('.00', '').replace(' ',''));
				if(variant.compare_at_price != null){
					item.find('.price .retail span').html(Shopify.formatMoney(variant.compare_at_price, formatMoney).replace('.00', ''));
					var percent = Math.round( (((variant.compare_at_price - variant.price) * 100 ) / variant.compare_at_price) );
					item.find('.off-percent strong').html(percent+'%');
				}

				//Update the fetured image
              	if(variant.featured_image) {
					//Image in grid
					item.find('.image img').attr('src', variant.featured_image.src);

					//Image in product page
					item.find('#active-wrapper img').attr('src', variant.featured_image.src);
					item.find('#active-wrapper a').attr('href', variant.featured_image.src);
				}

				//Update the variant value to add to cart
              	item.find('#product-'+product.id+'-variant').val(variant.id);

                item.find('.soldout-product-message').show();
                item.find('.sold-out-button .without-extended-offer').show();
			} else {
				item.find('#product-'+product.id+'-variant').val("");
			}
			updateButtons(variant);
		}
	};
	
	var updateButtons = function(variant) {
      	var status;
      	if(product.available) {
        	status = variant ? variant.status : 'available';
        } else {
        	status = 'soldout';
        }

		item.find('.buttons-wrapper .add-button, .buttons-wrapper .sold-out-button, .soldout-product-message').hide(); //Grid
		item.find('.content-available, .content-soldout').hide(); //Product page
		switch(status) {
			case "available":
				item.find('.buttons-wrapper .add-button').show(); //Grid
				item.find('.content-available').show(); //Product page
				break;
			case "soldout":
				item.find('.buttons-wrapper .sold-out-button').show(); //Grid
            	item.find('.soldout-product-message').show(); //Grid
				//item.find('.content-soldout').show(); //Product page
				break;
		}
	};
  
  	var initGallery = function(){
      	var switchImage = function(newImageSrc, mainImageDomEl) {
            $(mainImageDomEl).attr('src', newImageSrc);
            if(item.find('#product-gallery').hasClass('zoom-in') && !isMobile.any) { 
                $(mainImageDomEl).parent().trigger('zoom.destroy').zoom( { url: newImageSrc.replace('_large', '') } ); 
            }
            $(mainImageDomEl).parents('a').attr('href', newImageSrc);
        };
      	var onImagesLoaded = function(images, callback){
            var imagesLoaded = 0;
            images.each(function(){
              var img = new Image();
              img.onload = function() {
                imagesLoaded++;
                if(imagesLoaded==images.length) {
                  callback();
                }
              };
              img.src = $(this).attr('src');
            });
        };

     	//Initialize thumbs on main product page
      	item.find('#thumbs.switch a').on('click', function(e) { 
            e.preventDefault();
          	var variantId = $(this).attr('variant-id');

            switchImage($(this).attr('href'), item.find('#active-wrapper img')[0]);
            if(variantId && variantId!='') {
              	var variant = $.grep(product.variants, function(obj){ return obj.id==variantId; });
              	if(variant[0] && variant[0].available) {
                	if(product.options.length <= 1) {
                        item.find('.select-variant').val(variantId).change();
                    } else {
                        var variantTitle = item.find('.select-variant option[value='+variantId+']').text();
                        $.each(variantTitle.split(' / '), function(key, val){
                            item.find('.single-option-selector:eq('+key+')').val(val).change();
                        });
                    }
                }
            }
        });
      
      	onImagesLoaded(item.find('#thumbs img'), function(){
        	item.find('#thumbs').slick({
        		autoplay: false,
        		speed: 1000,
        		slidesToShow: 4,
          		slidesToScroll: 1,
              	
              		vertical: true,
              		verticalSwiping: true,
              		prevArrow: '<i class="lnr lnr-chevron-up up-arrow animation"></i>',
      	  			nextArrow: '<i class="lnr lnr-chevron-down down-arrow animation"></i>',
              	
        		responsive: [
                  {
                      breakpoint: 584,
                      settings: {
                        autoplay: false,
                        dots: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        vertical: false,
                        verticalSwiping: false,
                        arrows: false, 
                        adaptiveHeight: true
                      }
                  }
                ]
      		});
        });
      
      
        onImagesLoaded(item.find('#thumbs-2 img'), function(){
          item.find('#thumbs-2').slick({
            autoplay: false,
            speed: 1000,
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false, 
            adaptiveHeight: true,
            prevArrow: '<i class="lnr lnr-chevron-left left-arrow animation"></i>',
            nextArrow: '<i class="lnr lnr-chevron-right right-arrow animation"></i>'
          });
        });

      	//Initialize zoom on main product image
      	if(item.find('#product-gallery').hasClass('zoom-in') && !isMobile.any) {
            var mainProductImage = $('#active-wrapper img');
            if (mainProductImage.size()) {
                var zoomedSrc = item.find('#active-wrapper img').attr('src').replace('_large', '');
                item.find('#active-wrapper img')
                    .wrap('<span style="display:block"></span>')
                    .css('display', 'block')
                    .parent()
                    .zoom( { url: zoomedSrc } );
            }
        }
      
      	//Initialize photoswipe on main product image
      	if($('#thumbs a[rel="photoswipe"]').length > 0) {
        	item.find('#thumbs a[rel="photoswipe"]').photoSwipe();
            item.find('#active-wrapper a.productImage').click(function(){
				productImage = $(this);
          		item.find('#thumbs a[rel="photoswipe"]').each(function(){
                    if($(this).attr('href').substr($(this).attr('href').indexOf('//')).replace(/_1024x1024/g, '') == 
                    productImage.attr('href').substr(productImage.attr('href').indexOf('//')).replace(/_1024x1024/g, '')){
                        $(this).click();
                      	return false;
                    }
                });
                return false;
            });
        } else {
        	item.find('#active-wrapper a.productImage').photoSwipe();
        }
  	}

	return init();
  
};