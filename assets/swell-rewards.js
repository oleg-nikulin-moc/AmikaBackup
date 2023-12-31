// xl,lg,md,sm
var amika_logo_t = ["14939087175746","14939087306818","14939087241282","14939087208514"];
// lg,md,sm,xs
var amika_skull_t = ["14937978765378","14937952190530","14937952157762","14937952124994"];
var logo_t = null;
var skull_t = null;
var logo_t_tier = "";
var skull_t_tier = "";
var temp = "";
var temp_holder;

$( window ).load(function() {
  // if($(".hi-line span").html() == ""){
  //   $(".hi-line").html("hi there,");
  // }
  // setTimeout(function(){
  tiers_initialization();
  referral_initialization();
  swell_initialization();
  // },1000);
  setTimeout(function(){
    // if(window.location.href.indexOf("checkout") > -1) {
    //   var script = document.createElement("script");
    //   script.type = "text/javascript";
    //   script.src = "//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js";
    //   document.getElementsByTagName("head")[0].appendChild(script);
    // }
    if($(".amika-rewards").length>0){
      try{
        SwellConfig.Referral.initializeReferral(".swell-referral");
        if(spapi.authenticated || (spapi.customer.referral_receipts && spapi.customer.referral_receipts.length > 0)) {
          setupReferrals();
        }
        $(".inner-holder").css("display","flex");

        $(document).on("swell:referral:success", function(jqXHR, textStatus, errorThrown) {
          thankyou();
        });
        $(document).on("swell:referral:error", function(jqXHR, textStatus, errorThrown) {
          if(textStatus && textStatus === "EMAILS_ALREADY_PURCHASED"){
            $(".refer-customer-error").remove();
            $(".swell-referral-sidebar-details").show();
            $(".swell-referral").removeClass("thankyou");
            $(".swell-referral-content-container").addClass("error-message");
            $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Sorry! Looks like this person has already made a purchase. Try referring another friend.</p>');
            $("#swell-referral-refer-emails").addClass("error-border");
          }
          else if(textStatus && textStatus === "Please enter a valid email address"){
            $(".refer-customer-error").remove();
            $(".swell-referral-sidebar-details").show();
            $(".swell-referral").removeClass("thankyou");
            $(".swell-referral-content-container").addClass("error-message");
            $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Please enter valid email addresses seperated with commas</p>');
            $("#swell-referral-refer-emails").addClass("error-border");
          }
        });
        $('body').on('click', '.swell-referral-copy', function(e){
          if($(e.target).hasClass("swell-referral-copy")) {
            e.stopPropagation();
          }
        });
        $(".amika-rewards").css("display","flex");
      }
      catch(e){}
    }
  },2000);
});

var temp_email = "";

function swell_initialization() {
  var myVar = setInterval(myTimer, 1000);
  function myTimer() {
    if(typeof spapi !== "undefined") {
      $("#swell-checkout-redemption-options option").detach()
      var activeRedemptionOptions = spapi.activeRedemptionOptions;
      $(activeRedemptionOptions).each(function( activeRedemptionOption, activeRedemptionOptionValue ) {
        if(activeRedemptionOptionValue.type == "StoreGiftCard" && activeRedemptionOptionValue.discount_type == "fixed_amount") {
          $("#swell-checkout-redemption-options").append("<option value='"+activeRedemptionOptionValue.id+"'>"+activeRedemptionOptionValue.name+" ("+activeRedemptionOptionValue.cost_text+") </option>");   
        }
      });
      clearInterval(myVar);
    }
  }
  $(document).ready(function() {
    $(document).on("click",".swell-referral-form-list-submit", function(){
      temp_email = $('#swell-referral-refer-emails').val();
    });
    $(document).on("click", ".swell-share-referral-copy", function() {
      setTimeout(function(){
        detachReferralCopy();
        $(".swell-referral-copy-main").prepend("<div class='close-container'></div>");
        $(".swell-referral-copy-main .close-container").html($(".swell-referral-copy-main .swell-referral-back-link").detach());
        $(".swell-referral-copy-link").html($(".swell-referral-copy-link").html().replace("http://",""));
      },20);
    });
    $(document).on("click", ".swell-referral-back-link", function() {
      $(".swell-referral").removeClass("thankyou");
      $(".swell-referral-sidebar-details").show();
    });
    $(document).on("click", ".swell-referral-back-link.checkout", function() {
      $(".amika-rewards").hide();
    });
    $('body').on('click', '.question', function(){
      if($(this).hasClass("open"))
      {
        $(this).removeClass("open");
        $(this).siblings().removeClass("open");
      }
      else
      {
        $(this).addClass("open");
        $(this).siblings().addClass("open");
      }
    });
  });
  $(document).on("swell:setup", function() {

    // $(document).on("click", ".arrows-holder", function() {
    //   if($(".arrows-holder").hasClass("expanded")) {
    //     $(".line-items-container.cart-content__wrapper").removeClass("logged-in");
    //     $(".dropdown-holder").hide();
    //     $(".arrows-holder").removeClass("expanded");
    //     $(".arrows-holder .down-arrow").show();
    //     $(".arrows-holder .up-arrow").hide();
    //   } else {
    //     $(".line-items-container.cart-content__wrapper").addClass("logged-in");
    //     $(".dropdown-holder").css("display", "flex");
    //     $(".arrows-holder").addClass("expanded");
    //     $(".arrows-holder .down-arrow").hide();
    //     $(".arrows-holder .up-arrow").show();
    //   }
    // });

    $( 'body' ).on('click',"#swell-redeem-btn", function(e) {
      e.preventDefault();
      // $(".line-items-container.cart-content__wrapper").removeClass("error-msg");
      $("#swell-redeem-btn").html('Please wait...');
      $(".swell-error").html('');
      $(".model-content").html("");
      redemptionId = $("#swell-redemption-options").val();
      redemptionOption = spapi.findActiveRedemptionOptionById(redemptionId);

      $(".swell-redeem-btn-loader").show();
      $("#swell-redeem-btn .btn__content").hide();

      $(document).on("swell:cart:updated", function(){
        localStorage.setItem('swell-redemption', true)
        location.reload();
      });

      var onCartError = function() {
        $(".swell-error").html('You do not have enough points to redeem this option.');
        $("#swell-redeem-btn").html("Redeem");
        // $(".line-items-container.cart-content__wrapper").addClass("error-msg");
      }

      if(redemptionOption.amount <= spapi.customer.adjusted_points_balance) {
        result = swellAPI.buyMultipleWithPoints([redemptionOption], function(){});
      }
      else {
        onCartError();
      }
    });



    // redemptionOptions = spapi.activeRedemptionOptions;
    // redemptionOptions.forEach(function(option) {
    //   if(option.discount_type == "cart_fixed_amount") {
    //     $(".swell-redemption-option-list").append('<div class="swell-redemption-option redeem-content-holder">  <div    class="swell-redemption-option-content"    data-redemption-option-id="' + option.id +'">    <div class="swell-redemption-option-value redeem-discount">' + option.name +'</div>    <div class="swell-redemption-option-cost redeem-points">' + option.cost_text +'</div>  </div></div>');
    //     $("#swell-redemption-options").append('<option value="' + option.id +'" >  ' + option.name +' (' + option.amount +' Points)</option>');
    //   } else {
    //     if(option.discount_type == "product") {
    //       $("#swell-redemption-options").append('<option value="' + option.id +'" data-image="' + option.background_image_url + '">  ' + option.name +' (' + option.amount +' Points)</option>');
    //     } 
    //   }
    // });

    // $('#swell-redemption-options').select2({
    //   templateResult: formatState,
    //   templateSelection: formatState
    // });

    // function formatState (opt) {
    //   if (!opt.id) {
    //     return opt.text;
    //   } 
    //   var optimage = $(opt.element).attr('data-image');
    //   if(!optimage){
    //     return opt.text;
    //   } else {
    //     var $opt = $('<div class="swell-custom-list-option" data-title="' + opt.text + '"><span><img src="' + optimage + '"/></span> <span class="option-text">' + opt.text + '</span></div>');
    //     return $opt;
    //   }
    // }

    $(document).on('click', '.swell-newsletter', function(){
      if($(".swell-newsletter .disable-overlay").length==0) {
        swellAPI.showPopupByType("EmailCapturePopup");
      }
    });
    $(document).on('click', '.redeem-discount-btn', function(){
      if(!$(".redeem-discount-btn").hasClass("active"))
      {
        $(".redeem-discount-btn").addClass("active");
        $(".redeem-product-btn").removeClass("active");
        $(".discount-redemption-options").css("display","flex");
        $(".redemption-options").hide();
        // $(".shift-title").html("redeem for discount");
      }
    });
    $(document).on('click', '.redeem-product-btn', function(){
      !function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});
      $('.tier1-redeemable').slick('refresh');
      $('.tier2-redeemable').slick('refresh');
      $('.tier3-redeemable').slick('refresh');
      if(!$(".redeem-product-btn").hasClass("active"))
      {
        $(".redeem-product-btn").addClass("active");
        $(".redeem-discount-btn").removeClass("active");
        $(".redemption-options").show();
        $(".discount-redemption-options").css("display","none");
        // $(".shift-title").html("redeem for product");
      }
    });

    $(document).on("click", ".swell-redeem-now", function() {
      var redeemedItemsInCart = 0;
      var regularItemsInCart = 0;

      if(Swell.Cart && Swell.Cart.items){
        var cart = Swell.Cart;

        $.each(cart.items, function(index, item){
          if(item.properties._swell_points_used){
            redeemedItemsInCart++;
          } else if(item.line_price > 0){
            regularItemsInCart++;
          }
        });

        if(regularItemsInCart == 0){
          spapi.$.confirm({
            title: "Oops!",
            content: "Oops! Add items to your cart before redeeming your points.",
            type: "red",
            typeAnimated: true,
            useBootstrap: false,
            boxWidth: "400px",
            buttons: {
              ok: {
                text: "Ok",
                action: function () {
                }
              }
            }
          });
        }
        else {
          window.location.href = "/cart";
        }
      } 
    });

    $(document).on("click", ".earn-more", function() {
      localStorage.setItem("swell-anchor", "campaign-section");
    });

    $('body').on('click', '.activate-menu', function(){
      $(this).siblings().each(function(){
        $(this).removeClass("hide");
        // $(this).addClass("activate-menu");
      });
      $(this).addClass("hide");
    });
    $(".swell-loader").hide();
    if($(".swell-referral").length>0)
    {
      SwellConfig.Referral.initializeReferral(".swell-referral");
      if(spapi.authenticated || (spapi.customer.referral_receipts && spapi.customer.referral_receipts.length > 0)) {
        setupReferrals();
      }
      $(".inner-holder").css("display","flex");

      $(document).on("swell:referral:success", function(jqXHR, textStatus, errorThrown) {
        thankyou();
      });
      $(document).on("swell:referral:error", function(jqXHR, textStatus, errorThrown) {
        if(textStatus && textStatus === "EMAILS_ALREADY_PURCHASED"){
          $(".refer-customer-error").remove();
          $(".swell-referral-sidebar-details").show();
          $(".swell-referral").removeClass("thankyou");
          $(".swell-referral-content-container").addClass("error-message");
          $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Sorry! Looks like this person has already made a purchase. Try referring another friend.</p>');
          $("#swell-referral-refer-emails").addClass("error-border");
        }
        else if(textStatus && textStatus === "Please enter a valid email address"){
          $(".refer-customer-error").remove();
          $(".swell-referral-sidebar-details").show();
          $(".swell-referral").removeClass("thankyou");
          $(".swell-referral-content-container").addClass("error-message");
          $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Please enter valid email addresses seperated with commas</p>');
          $("#swell-referral-refer-emails").addClass("error-border");
        }
      });
      $('body').on('click', '.swell-referral-copy', function(e){
        if($(e.target).hasClass("swell-referral-copy")) {
          e.stopPropagation();
        }
      });
    }
    var options = spapi.activeRedemptionOptions;
    for(var t = 0;t<options.length;t++)
    {
      if(options[t].discount_type == "product")
      {
        if(options[t].icon == "tier-1"){
          if(!amika_logo_t.includes(options[t].applies_to_id) && !amika_skull_t.includes(options[t].applies_to_id)){
            $(".tier1-redeemable").append("<li class='slick-slider-redemption swell-redemption-option'> <div class='swell-buy-product-btn-container'> <div class='swell-redemption-option-content'> <img src='"+options[t].background_image_url+"' alt='redeem-Image'> <div class='redeem-overlay'><a class='swell-buy-product-btn'  data-variant-id='"+options[t].applies_to_id+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>Redeem</a></div> </div> <div class='title'> <h4>"+options[t].name+"</h4> </div> <div class='description'> <h6>"+options[t].description+"</h6> </div> <div class='points'> <h5>"+options[t].cost_text+"</h5> </div> </div> </li>");
          }
          else{
            if(options[t].background_image_url!=null &&(logo_t == null || skull_t == null)){
              if(amika_logo_t.includes(options[t].applies_to_id)){
                logo_t = options[t];
                logo_t_tier = ".tier1-redeemable";
              }
              else if(amika_skull_t.includes(options[t].applies_to_id)){
                skull_t = options[t];
                skull_t_tier = ".tier1-redeemable";
              }
            }
          }
        }
        else if(options[t].icon == "tier-2"){
          if(!amika_logo_t.includes(options[t].applies_to_id) && !amika_skull_t.includes(options[t].applies_to_id)){
            $(".tier2-redeemable").append("<li class='slick-slider-redemption swell-redemption-option'> <div class='swell-buy-product-btn-container'> <div class='swell-redemption-option-content'> <img src='"+options[t].background_image_url+"' alt='redeem-Image'> <div class='redeem-overlay'><a class='swell-buy-product-btn'  data-variant-id='"+options[t].applies_to_id+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>Redeem</a></div> </div> <div class='title'> <h4>"+options[t].name+"</h4> </div> <div class='description'> <h6>"+options[t].description+"</h6> </div> <div class='points'> <h5>"+options[t].cost_text+"</h5> </div> </div> </li>");
          }
          else{
            if(options[t].background_image_url!=null &&(logo_t == null || skull_t == null)){
              if(amika_logo_t.includes(options[t].applies_to_id)){
                logo_t = options[t];
                logo_t_tier = ".tier2-redeemable";
              }
              else if(amika_skull_t.includes(options[t].applies_to_id)){
                skull_t = options[t];
                skull_t_tier = ".tier2-redeemable";
              }
            }
          }
        }
        else if(options[t].icon == "tier-3"){
          if(!amika_logo_t.includes(options[t].applies_to_id) && !amika_skull_t.includes(options[t].applies_to_id)){
            $(".tier3-redeemable").append("<li class='slick-slider-redemption swell-redemption-option'> <div class='swell-buy-product-btn-container'> <div class='swell-redemption-option-content'> <img src='"+options[t].background_image_url+"' alt='redeem-Image'> <div class='redeem-overlay'><a class='swell-buy-product-btn'  data-variant-id='"+options[t].applies_to_id+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>Redeem</a></div> </div> <div class='title'> <h4>"+options[t].name+"</h4> </div> <div class='description'> <h6>"+options[t].description+"</h6> </div> <div class='points'> <h5>"+options[t].cost_text+"</h5> </div> </div> </li>");
          }
          else{
            if(options[t].background_image_url!=null &&(logo_t_img == null || skull_t_img == null)){
              if(amika_logo_t.includes(options[t].applies_to_id)){
                logo_t = options[t];
                logo_t_tier = ".tier3-redeemable";
              }
              else if(amika_skull_t.includes(options[t].applies_to_id)){
                skull_t = options[t];
                skull_t_tier = ".tier3-redeemable";
              }
            }
          }
        }
      }
    }
    if(spapi.authenticated){
      if(skull_t_tier != ""){
        $(skull_t_tier).append("<li class='slick-slider-redemption swell-redemption-option'> <div class='swell-buy-product-btn-container'> <div class='swell-redemption-option-content'> <img src='"+skull_t.background_image_url+"' alt='redeem-Image'> <div class='redeem-overlay'><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_skull_t[0]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>large</a><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_skull_t[1]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>medium</a><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_skull_t[2]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>small</a><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_skull_t[3]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>extra small</a><a class='activate-menu' href='javascript:void(0);'>redeem</a></div> </div> <div class='title'> <h4>"+skull_t.name+"</h4> </div> <div class='description'> <h6>"+skull_t.description+"</h6> </div> <div class='points'> <h5>"+skull_t.cost_text+"</h5> </div> </div> </li>");
      }
      if(logo_t_tier != ""){
        $(logo_t_tier).append("<li class='slick-slider-redemption swell-redemption-option'> <div class='swell-buy-product-btn-container'> <div class='swell-redemption-option-content'> <img src='"+logo_t.background_image_url+"' alt='redeem-Image'> <div class='redeem-overlay'><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_logo_t[0]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>extra large</a><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_logo_t[1]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>large</a><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_logo_t[2]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>medium</a><a class='swell-buy-product-btn hide'  data-variant-id='"+amika_logo_t[3]+"' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%' href='javascript:void(0);'>small</a><a class='activate-menu' href='javascript:void(0);'>redeem</a></div> </div> <div class='title'> <h4>"+logo_t.name+"</h4> </div> <div class='description'> <h6>"+logo_t.description+"</h6> </div> <div class='points'> <h5>"+logo_t.cost_text+"</h5> </div> </div> </li>");
      }
      $(".redeem-overlay").css("display","flex");
    }
    if($(".campaigns").length>0){
      var campaigns = [];
      spapi.customer.perks.forEach(function(val,index){
        if(val.awarded){
          campaigns.push(val.campaign_id);
        }
      });
      var options = spapi.activeCampaigns;
      for(var t = 0;t<options.length;t++){
        if(options[t].id!=342783 && options[t].id != 454128){
          if(!spapi.authenticated){
            $(".campaigns").append("<li class='swell-campaign'> <div class='swell-campaign-content swell-campaign-link' data-display-mode='modal' data-campaign-id='"+options[t].id+"'> <div class='swell-campaign-icon'> <span class='swell-campaign-icon-content'> <i class='"+options[t].icon+"'><span class=\"path1\"></span><span class=\"path2\"></span><span class=\"path3\"></span><span class=\"path4\"></span><span class=\"path5\"></span><span class=\"path6\"></span><span class=\"path7\"></span><span class=\"path8\"></span><span class=\"path9\"></span><span class=\"path10\"></span><span class=\"path11\"></span><span class=\"path12\"></span><span class=\"path13\"></span><span class=\"path14\"></span><span class=\"path15\"></span><span class=\"path16\"></span><span class=\"path17\"></span><span class=\"path18\"></span><span class=\"path19\"></span><span class=\"path20\"></span><span class=\"path21\"></span><span class=\"path22\"></span><span class=\"path23\"></span><span class=\"path24\"></span><span class=\"path25\"></span><span class=\"path26\"></span></i> </span> </div> <div class='swell-campaign-type'> <span class='swell-campaign-type-content'>"+options[t].title+"</span> </div> <div class='swell-campaign-value'> <span class='swell-campaign-value-content'>"+options[t].reward_text+"</span> </div> <div class=\"overlay\"><div class=\"banner-buttons\"> <a class=\"swell-button signup\" href=\"/account/register\">JOIN</a> <a class=\"swell-button login\" href=\"/account/login\">LOGIN</a> </div></div> </div> </li>");
          }
          else {
            if(campaigns.includes(options[t].id)){
              $(".campaigns").append("<li class='swell-campaign'> <div class='swell-campaign-content swell-campaign-link' data-display-mode='modal' data-campaign-id='"+options[t].id+"'> <div class='swell-campaign-icon'> <span class='swell-campaign-icon-content'> <i class='"+options[t].icon+"'><span class=\"path1\"></span><span class=\"path2\"></span><span class=\"path3\"></span><span class=\"path4\"></span><span class=\"path5\"></span><span class=\"path6\"></span><span class=\"path7\"></span><span class=\"path8\"></span><span class=\"path9\"></span><span class=\"path10\"></span><span class=\"path11\"></span><span class=\"path12\"></span><span class=\"path13\"></span><span class=\"path14\"></span><span class=\"path15\"></span><span class=\"path16\"></span><span class=\"path17\"></span><span class=\"path18\"></span><span class=\"path19\"></span><span class=\"path20\"></span><span class=\"path21\"></span><span class=\"path22\"></span><span class=\"path23\"></span><span class=\"path24\"></span><span class=\"path25\"></span><span class=\"path26\"></span></i> </span> </div> <div class='swell-campaign-type'> <span class='swell-campaign-type-content'>"+options[t].title+"</span> </div> <div class='swell-campaign-value'> <span class='swell-campaign-value-content'>"+options[t].reward_text+"</span> </div></div> </li>");
            }
            else{
              $(".campaigns").append("<li class='swell-campaign'> <div class='swell-campaign-content swell-campaign-link' data-display-mode='modal' data-campaign-id='"+options[t].id+"'> <div class='swell-campaign-icon'> <span class='swell-campaign-icon-content'> <i class='"+options[t].icon+"'><span class=\"path1\"></span><span class=\"path2\"></span><span class=\"path3\"></span><span class=\"path4\"></span><span class=\"path5\"></span><span class=\"path6\"></span><span class=\"path7\"></span><span class=\"path8\"></span><span class=\"path9\"></span><span class=\"path10\"></span><span class=\"path11\"></span><span class=\"path12\"></span><span class=\"path13\"></span><span class=\"path14\"></span><span class=\"path15\"></span><span class=\"path16\"></span><span class=\"path17\"></span><span class=\"path18\"></span><span class=\"path19\"></span><span class=\"path20\"></span><span class=\"path21\"></span><span class=\"path22\"></span><span class=\"path23\"></span><span class=\"path24\"></span><span class=\"path25\"></span><span class=\"path26\"></span></i> </span> </div> <div class='swell-campaign-type'> <span class='swell-campaign-type-content'>"+options[t].title+"</span> </div> <div class='swell-campaign-value'> <span class='swell-campaign-value-content'>"+options[t].reward_text+"</span> </div> </div> </li>");
            }
          }
        }
      }
      // $(".campaigns .swell-campaign:last-child").before("<li class='swell-campaign'><div class='swell-campaign-content swell-buy-product-btn hide' data-variant-id='16321812103234' data-hide-logged-out='true|false' data-confirm-title='Are you sure?' data-confirm-content='You currently have *|point_balance|* points available. This product costs *|amount|* points to purchase.' data-confirm-btn-text='Yes, buy it' data-error-type='red' data-error-title='Whoops!' data-error-content='Looks like you do not have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available.' data-error-okay-text='Ok' data-success-type='green' data-success-title='Success!' data-success-content='Product was successfully added to your cart' data-success-ok-btn='Keep Shopping' data-success-cart-btn='View Cart' data-success-cart-link='/cart' data-box-width='400px' data-mobile-box-width='90%'> <div class='swell-campaign-icon'> <span class='swell-campaign-icon-content'> <i class='swell-icon-donate'><span class=\"path1\"></span><span class=\"path2\"></span><span class=\"path3\"></span><span class=\"path4\"></span><span class=\"path5\"></span><span class=\"path6\"></span><span class=\"path7\"></span><span class=\"path8\"></span><span class=\"path9\"></span><span class=\"path10\"></span><span class=\"path11\"></span><span class=\"path12\"></span><span class=\"path13\"></span><span class=\"path14\"></span><span class=\"path15\"></span><span class=\"path16\"></span><span class=\"path17\"></span><span class=\"path18\"></span><span class=\"path19\"></span><span class=\"path20\"></span><span class=\"path21\"></span><span class=\"path22\"></span><span class=\"path23\"></span><span class=\"path24\"></span><span class=\"path25\"></span><span class=\"path26\"></span></i> </span> </div> <div class='swell-campaign-type'> <span class='swell-campaign-type-content'>donation to \"hairtostay\"</span> </div> <div class='swell-campaign-value'> <span class='swell-campaign-value-content'>100 points</span> </div></div>  <div class=\"swell-campaign-content swell-hair-to-stay\"><div class=\"overlay\"><div class=\"banner-buttons\"> <a class=\"swell-button signup\" href=\"/account/register\">JOIN</a> <a class=\"swell-button login\" href=\"/account/login\">LOGIN</a> </div></div></div> </li>");
      // $(".campaigns .swell-campaign:last-child").after("<li class='swell-campaign swell-logo'> <div class='swell-campaign-content swell-buy-product-btn hide'> <div class='swell-logo'> <img src='//cdn.shopify.com/s/files/1/0550/7884/6672/t/50/assets/swell-logo.png?v=6260424389743728131678722134'> </div> </div> </li>");
      
      if(spapi.authenticated) {
        $(".campaigns .swell-campaign:nth-child(6)").after("<li class='swell-campaign last'><a href='/pages/refer'><div class='swell-campaign-content' data-display-mode='modal'> <div class='swell-campaign-icon'> <span class='swell-campaign-icon-content'> <i class='swell-icon-refer'><span class=\"path1\"></span><span class=\"path2\"></span><span class=\"path3\"></span><span class=\"path4\"></span><span class=\"path5\"></span><span class=\"path6\"></span><span class=\"path7\"></span><span class=\"path8\"></span><span class=\"path9\"></span><span class=\"path10\"></span><span class=\"path11\"></span><span class=\"path12\"></span><span class=\"path13\"></span><span class=\"path14\"></span><span class=\"path15\"></span><span class=\"path16\"></span><span class=\"path17\"></span><span class=\"path18\"></span><span class=\"path19\"></span><span class=\"path20\"></span><span class=\"path21\"></span><span class=\"path22\"></span><span class=\"path23\"></span><span class=\"path24\"></span><span class=\"path25\"></span><span class=\"path26\"></span></i> </span> </div> <div class='swell-campaign-type'> <span class='swell-campaign-type-content'>refer a friend</span> <p class='swell-campaign-refer-text'>on their first order of $59+</p> </div> <div class='swell-campaign-value'> <span class='swell-campaign-value-content'>give $10, get 1000 points</span> </div> </div></a></li>");
      }
      else{
        $(".campaigns .swell-campaign:nth-child(6)").after("<li class='swell-campaign last'><div class='swell-campaign-content' data-display-mode='modal'> <div class='swell-campaign-icon'> <span class='swell-campaign-icon-content'> <i class='swell-icon-ReferFriendIcon'><span class=\"path1\"></span><span class=\"path2\"></span><span class=\"path3\"></span><span class=\"path4\"></span><span class=\"path5\"></span><span class=\"path6\"></span><span class=\"path7\"></span><span class=\"path8\"></span><span class=\"path9\"></span><span class=\"path10\"></span><span class=\"path11\"></span><span class=\"path12\"></span><span class=\"path13\"></span><span class=\"path14\"></span><span class=\"path15\"></span><span class=\"path16\"></span><span class=\"path17\"></span><span class=\"path18\"></span><span class=\"path19\"></span><span class=\"path20\"></span><span class=\"path21\"></span><span class=\"path22\"></span><span class=\"path23\"></span><span class=\"path24\"></span><span class=\"path25\"></span><span class=\"path26\"></span></i> </span> </div> <div class='swell-campaign-type'> <span class='swell-campaign-type-content'>refer a friend</span> <p class='swell-campaign-refer-text'>on their first order of $59+</p> </div> <div class='swell-campaign-value'> <span class='swell-campaign-value-content'>give $10, get 1000 points</span> </div> <div class=\"overlay\"><div class=\"banner-buttons\"> <a class=\"swell-button signup\" href=\"/account/register\">JOIN</a> <a class=\"swell-button login\" href=\"/account/login\">LOGIN</a> </div></div> </div></li>");
      }
      $('[data-campaign-id="446970"]').parent().detach();
      $(".swell-campaign .swell-campaign-content[data-campaign-id='536121']").parent().detach();
      $(".swell-campaign .swell-campaign-content[data-campaign-id='600444']").parent().detach();
      $(".swell-campaign .swell-campaign-content[data-campaign-id='600443']").parent().detach();
      $(".campaigns .swell-campaign:nth-child(10)").after('<li class="swell-campaign swell-newsletter"> <div class="swell-campaign-content" data-display-mode="modal"> <div class="swell-campaign-icon"> <span class="swell-campaign-icon-content"> <i class="swell-icon-signup"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span><span class="path26"></span></i> </span> </div> <div class="swell-campaign-type"> <span class="swell-campaign-type-content">newsletter signup </span> </div> <div class="swell-campaign-value"> <span class="swell-campaign-value-content">50 points</span> </div> </div> </li>');
      if(spapi.authenticated) {
        checkCompletedNewsletterCampaign();
      }
      swellAPI.refreshEmbeds();
    }

    if(localStorage.getItem("swell-anchor") == "campaign-section") {
      var position = $("#campaign-section").offset().top - 400;
      $("HTML, BODY").animate({ scrollTop: position }, 2000);
      localStorage.setItem("swell-anchor", "");
    }

    if($(".swell-discount-redemption-option-list").length>0) {
      var options = spapi.activeRedemptionOptions;
      var count = 0;
      for(var t = 0;t<options.length;t++)
      {
        if(options[t].discount_type == "cart_fixed_amount")
        {
          count++;
          $(".swell-discount-redemption-option-list").append("<li class='swell-redemption-option'> <div class='swell-redemption-option-content'> <div class='swell-redemption-content'> <div class='swell-redemption-content-holder swell-cart-discount-redemption-btn' data-redemption-option-id='"+options[t].id+"'> <div class='swell-redemption-option-value'> "+options[t].name+" </div> <div class='swell-redemption-option-cost'> "+options[t].amount+" points </div> </div> </div> </li>");
        }
      }
      swellAPI.refreshEmbeds();
      if(count%2==1){
        $(".swell-discount-redemption-option-list").append("<li class='swell-redemption-option'></li>");
      }
    }

    if($(".swell-tier-table").length>0)
    {
      SwellConfig.Tier.initializeCustomTierProperties();
      SwellConfig.Tier.initializeTiers(".swell-tier-table");
      setupSlickSlider();
    }
      
    if(spapi.customer.vip_tier == undefined) {
      $(".hi-section .status").hide();
      // $(".vip-status").html(spapi.activeVipTiers[0].name);
    }
    else{
      $(".vip-status").html(spapi.customer.vip_tier.name);
    }
    // cart discount redemption
    $(".swell-cart-discount-redemption-btn").click(function(){
      if(spapi.authenticated){
        if(beforeDiscountRedemption()){
          $(document).on("swell:cart:updated", function(){
            if(window.location.href.indexOf("cart") > -1) {
              window.location = "/cart";
            }
            else{
              $(temp_holder).html(temp);
              spapi.$.confirm({
                title: "Redeemed!",
                content: "You have redeemed the discount!",
                type: "green",
                typeAnimated: true,
                useBootstrap: false,
                boxWidth: "400px",
                buttons: {
                  ok: {
                    text: "Ok",
                    action: function () {
                    }
                  }
                }
              });
            }
          });
          temp_holder = $(this);
          temp = $(this).html();
          $(this).html("<i class='fa fa-spin fa-spinner'></i>");
          redemptionOptionId = $(this).data("redemption-option-id");
          redemptionOption = swellAPI.findActiveRedemptionOptionById(redemptionOptionId);
          if(redemptionOption.amount <= spapi.customer.adjusted_points_balance){
            result = swellAPI.buyMultipleWithPoints([redemptionOption], function(){});
          }
          else
          {
            $(this).html(temp);
            alert("You do not have enough points.");
          }
        }
      }
    });



    Swell.Cart.items.forEach(function(item) {
      if (item.properties._swell_discount_type == "cart_fixed_amount") {
        redeemedRedemptionOption = swellAPI.findActiveRedemptionOptionById(item.properties._swell_redemption_option_id);
        $("#cartform > table > tbody").append("<tr class=\"item .swell-cart-data\"> <td style=\"padding:4vw 0;\" class=\"image two-twelfths medium--one-third small--one-third text-center\"> <span style=\"max-width: 154px; width: 100%; display:block; margin: 0 auto\">"+redeemedRedemptionOption.name+"</span></td> <td> <table> <tbody> <tr class=\"item-line item-second-line\"> <td class=\"title animation two-twelfths medium--one-whole small--one-whole\"> <a href=\"javascript:void(0);\"> <p class=\"text\">"+redeemedRedemptionOption.name+" Reward</p> </a> </td> <td class=\"unit-price small--hide medium--hide two-twelfths medium--one-whole small--one-whole\"> <div class=\"deal \"> <span>"+redeemedRedemptionOption.cost_text+"</span> </div> </td> <td class=\"qtty two-twelfths medium--one-half small--one-half\"> <div class=\"wrap clearfix\"> <input type=\"button\" value=\"–\" class=\"minus animation\" disabled=\"\"> <input readonly=\"\" type=\"number\" step=\"1\" id=\"updates_14405418876994\" name=\"updates[]\" value=\"1\" title=\"Qty\" size=\"4\" min=\"1\" max=\"\" class=\"text quantity replace\"> <input type=\"button\" value=\"+\" class=\"plus animation\" disabled=\"\"> </div> </td> <td class=\"total-price two-twelfths medium--one-half small--one-half\"> <div class=\"deal \"> <span>"+redeemedRedemptionOption.cost_text+"</span> </div> </td> <td class=\"remove one-twelfth medium--one-whole small--one-whole text-right\"> <a class=\"remove-from-cart swell-coupon-remove animation\" href=\"javascript:void(0);\"><i class=\"icon ion-close\"></i></a> </td> </tr> </tbody></table> </td> </tr>");
        return
      }
    });
      
    // $('body').on('click',".update-cart", function() {
    //   $(".swell-cart-data").remove();
    // });

    $('body').on('click',".swell-coupon-remove", function() {
      $(document).on("swell:cart:updated", function(){
      if(window.location.href.indexOf("cart") > -1) {
        window.location = "/cart";
      }
      else{
        $(temp_holder).html(temp);
        spapi.$.confirm({
          title: "Redeemed!",
          content: "You have redeemed the discount!",
          type: "green",
          typeAnimated: true,
          useBootstrap: false,
          boxWidth: "400px",
          buttons: {
            ok: {
              text: "Ok",
              action: function () {
              }
            }
          }
        });
      }
    });
      $(".swell-coupon-remove").html("<i class='fa fa-spin fa-spinner'></i>");
      swellAPI.removeRedemptionOptionIdFromCart(redeemedRedemptionOption.id, function(){});
    });
    $(".amika-rewards").css("display","flex");
    setTimeout(function() {
      if(spapi.authenticated) {
        var rank = SwellConfig.Tier.getCustomerTierRank();
        var cnt = 0;
        $(".swell-products.logged-in").children().each(function() {
          if(cnt == 0 && rank == null) {
            $(".tier1-section").append("<div class='disable-carousel'></div>");
          } else {
            if (rank < cnt) {
              $(this).append("<div class='disable-carousel'></div>");
            }  
          }
          cnt++;
        });

        if (window.location.href.indexOf("cart") > -1) {
          if (rank == null) {
            $(".redemption-options .swell-products .tier1-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier2-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier3-section").addClass("swell-disable");
            // $(".redemption-options .swell-products .tier1-section").after($(".redemption-options .swell-products .tier3-section").detach());
            // $(".redemption-options .swell-products .tier1-section").after($(".redemption-options .swell-products .tier2-section").detach());
          }

          if (rank == 0) {
            $(".redemption-options .swell-products .tier2-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier3-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier1-section").after($(".redemption-options .swell-products .tier3-section").detach());
            $(".redemption-options .swell-products .tier1-section").after($(".redemption-options .swell-products .tier2-section").detach());
          }

          if (rank == 1) {
            $(".redemption-options .swell-products .tier1-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier3-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier2-section").after($(".redemption-options .swell-products .tier3-section").detach());
            $(".redemption-options .swell-products .tier2-section").after($(".redemption-options .swell-products .tier1-section").detach());
          }

          if (rank == 2) {
            $(".redemption-options .swell-products .tier1-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier2-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier3-section").after($(".redemption-options .swell-products .tier1-section").detach());
            $(".redemption-options .swell-products .tier3-section").after($(".redemption-options .swell-products .tier2-section").detach());
          }
          if($(".earning-container").length==0) {
            $(".swell-products").after('<div class="earning-container"> <a href="javascript:void(0)" class="swell-earning-new-status">show me other redemption options</a> </div>');
          }
        }

        if (rank == null) {
          if(window.location.href.indexOf("cart") > -1) {
            // $(".swell-products .tier1-section").after("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            $(".swell-products .tier1-section").append("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            $(".swell-products .tier2-section").append("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            // $(".swell-products .tier2-section").after("<p class='ways-to-earn-tier ways-to-earn-tier-second-child swell-disable'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier ways-to-earn-tier-second-child swell-disable'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            // $(".ways-to-earn-tier-second-child").css("top", "1360px");
          } else {
            if(window.location.href.indexOf("my_rewards") > -1) {
              // $(".swell-products .tier1-section").after("<p class='ways-to-earn-tier'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier1-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier2-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              // $(".swell-products .tier2-section").after("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            } else {
              // $(".swell-products .tier1-section").after("<p class='ways-to-earn-tier'>You have not reached this tier – Click <a href='#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier1-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier2-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a href='#campaign-section'>here</a> to find ways to earn more points</p>");
              // $(".swell-products .tier2-section").after("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            }
            // $(".ways-to-earn-tier-second-child").css("top", "1460px");
          }
        }

        if (rank == 0) {
          if(window.location.href.indexOf("cart") > -1) {
            // $(".swell-products .tier1-section").after("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            $(".swell-products .tier2-section").append("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            // $(".swell-products .tier2-section").after("<p class='ways-to-earn-tier ways-to-earn-tier-second-child swell-disable'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier ways-to-earn-tier-second-child swell-disable'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            // $(".ways-to-earn-tier-second-child").css("top", "1360px");
          } else {
            if(window.location.href.indexOf("my_rewards") > -1) {
              // $(".swell-products .tier1-section").after("<p class='ways-to-earn-tier'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier2-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              // $(".swell-products .tier2-section").after("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            } else {
              // $(".swell-products .tier1-section").after("<p class='ways-to-earn-tier'>You have not reached this tier – Click <a href='#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier2-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a href='#campaign-section'>here</a> to find ways to earn more points</p>");
              // $(".swell-products .tier2-section").after("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier ways-to-earn-tier-second-child'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            }
            // $(".ways-to-earn-tier-second-child").css("top", "1460px");
          }
        }

        if (rank == 1) {
          if(window.location.href.indexOf("cart") > -1) {
            // $(".swell-products .tier3-section").before("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier swell-disable'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
          } else {
            if(window.location.href.indexOf("my_rewards") > -1) {
              // $(".swell-products .tier3-section").before("<p class='ways-to-earn-tier'>You have not reached this tier – Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a class='earn-more' href='/pages/rewards#campaign-section'>here</a> to find ways to earn more points</p>");
            } else {
              // $(".swell-products .tier3-section").before("<p class='ways-to-earn-tier'>You have not reached this tier – Click <a href='#campaign-section'>here</a> to find ways to earn more points</p>");
              $(".swell-products .tier3-section").append("<p class='ways-to-earn-tier'>You have not reached this tier –<br class='swell-break'> Click <a href='#campaign-section'>here</a> to find ways to earn more points</p>");
            }
          }
          // $(".ways-to-earn-tier").css("top", "1360px");
        }
        
        var redeemedItemsInCart = 0;
        var regularItemsInCart = 0;
        var discountInCart = 0;
        if(Swell.Cart && Swell.Cart.items){
        var cart = Swell.Cart;
        $.each(cart.items, function(index, item){
          if(item.properties._swell_points_used){
            redeemedItemsInCart++;
          } else if(item.line_price > 0){
            regularItemsInCart++; 
          }
        });
        Swell.Cart.items.forEach(function(item) {
          if (item.properties._swell_discount_type == "product") {
            discountInCart++;
          }
        });
      }
        
      }

      $(document).on("click", ".swell-earning-new-status", function() {
        $(".ways-to-earn-tier").removeClass("swell-disable");
        $(".tier1-section").removeClass("swell-disable");
        $(".tier2-section").removeClass("swell-disable");
        $(".tier3-section").removeClass("swell-disable");
        $(".earning-container").removeClass("swell-disable");
        $('.tier1-redeemable').slick('refresh');
        $('.tier2-redeemable').slick('refresh');
        $('.tier3-redeemable').slick('refresh');
        $(".swell-earning-new-status").hide();
        $(".swell-products .earning-container").detach();
        $(".swell-products").append('<div class="earning-container"> <a href="javascript:void(0)" class="swell-show-few-product-redemptions">show fewer product redemption options</a> </div>');
      });


      $(document).on("click", ".swell-show-few-product-redemptions", function() {
        $(".ways-to-earn-tier").addClass("swell-disable");
          if($(".earning-container .swell-earning-new-status").css("display") == "none") {
            $(".swell-products").after('<div class="earning-container"> <a href="javascript:void(0)" class="swell-earning-new-status">show me other redemption options</a> </div>');
          }
          if (rank == null) {
            $(".redemption-options .swell-products .tier2-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier3-section").addClass("swell-disable");
          }
          if (rank == 1) {
            $(".redemption-options .swell-products .tier1-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier3-section").addClass("swell-disable");
          }
          if (rank == 2) {
            $(".redemption-options .swell-products .tier1-section").addClass("swell-disable");
            $(".redemption-options .swell-products .tier2-section").addClass("swell-disable");
          }
          $(this).parent().detach();
        });
      setupProductsSlickSlider();

      if (spapi.authenticated) {
        return spapi.setupBuyProductWithPointsHelper();
      }
    }, 1000);



    // $('.tier1-redeemable ,.tier2-redeemable, .tier3-redeemable').on('afterChange', function(slick, currentSlide){
    //   var items = $(this).children().first().children().first().children();
    //   var sw = true;
    //   $(this).children().first().children().first().children().each(function(){
    //     if($(this).attr("tabindex")==-1){
    //       if(sw){
    //         $(this).css("margin","0 -12vw 0 0");
    //       }
    //       else{
    //         $(this).css("margin","0 0 0 -12vw");
    //       }
    //     }
    //     else{
    //       sw = false;
    //     }
    //   });
    // });
  });
}

window.onBeforeProductRedemption = function(opts, redemptionOption, pointBalance, cb) {
  debugger
  var redeemedItemsInCart = 0;
  var regularItemsInCart = 0;
  var rank = SwellConfig.Tier.getCustomerTierRank();
  var discountInCart = 0;
  var cart_subtotal = 0;
    
  if(Swell.Cart && Swell.Cart.items) {
    var cart = Swell.Cart;
    
    $.each(cart.items, function(index, item) {
      if(item.properties._swell_points_used) {
        redeemedItemsInCart++;
      } else if(item.line_price > 0){
        regularItemsInCart++;
      }
      
      if (item.properties._swell_discount_type == "product") {
        discountInCart++;
      }
      cart_subtotal = ((item.discounted_price*item.quantity)/100)+cart_subtotal;
    });
    debugger

    // if(Swell.Cart && Swell.Cart.items){
    //   var cart = Swell.Cart;
    //   Swell.Cart.items.forEach(function(item) {
    //     if (item.properties._swell_discount_type == "product") {
    //       discountInCart++;
    //     }
    //   });
    // }
    
    if(regularItemsInCart == 0) {
      spapi.$.confirm({
        title: "Oops!",
        content: "You must add a priced item in your cart to redeem points for a free product 2.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
    } 
    else if(cart_subtotal<25) {
      spapi.$.confirm({
        title: "Oops!",
        content: "Cart subtotal must be greater than $25 in order to be eligible to redeeem for a product.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
      return false;
    }
    else if(rank == 0 && discountInCart >= 2) {
      spapi.$.confirm({
        title: "Oops!",
        content: "Steady tier can not redeem more than 2 products per order.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
      return false;
    }
    else if(rank == 1 && discountInCart >= 3) {
      spapi.$.confirm({
        title: "Oops!",
        content: "Committed tier can not redeem more than 3 products per order.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
      return false;
    }
    else if(rank == 2 && discountInCart >= 4) {
      spapi.$.confirm({
        title: "Oops!",
        content: "Ride or die tier can not redeem more than 4 products per order.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
      return false;
    }
    else {
      cb();   
    }
  }
};

function beforeDiscountRedemption(){
  var redeemedItemsInCart = 0;
  var regularItemsInCart = 0;
  var discountInCart = 0;
  
  if(Swell.Cart && Swell.Cart.items){
    var cart = Swell.Cart;
    
    $.each(cart.items, function(index, item){
      if(item.properties._swell_points_used){
        redeemedItemsInCart++;
      } else if(item.line_price > 0){
        regularItemsInCart++; 
      }
    });
    
    Swell.Cart.items.forEach(function(item) {
      if (item.properties._swell_discount_type == "cart_fixed_amount") {
        discountInCart++;
      }
    });
    if(discountInCart > 0){
      spapi.$.confirm({
        title: "Oops!",
        content: "You already have a redeemed discount in your cart.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
      return false;
    }
    else if(regularItemsInCart == 0){
      spapi.$.confirm({
        title: "Oops!",
        content: "You must add a priced item in your cart to redeem points for a discount.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
      return false;
    }
    else{
      return true;
    }
  }
};

function reward_points() {
  jQuery.getJSON('/cart.js', function(cart) {
    $(".swell-points-cart").html((cart.total_price/100));
  });
}

function cart_dropdown_initialization() {
  var myVar = setInterval(myTimer, 1000);
  function myTimer() {
    if(typeof spapi !== "undefined") {
        var redemptionOptions = spapi.activeRedemptionOptions;
        redemptionOptions.forEach(function(option) {
          if(option.discount_type == "product") {
            $("#swell-redemption-options").append('<option value="' + option.id +'" data-image="' + option.background_image_url + '">  ' + option.name +' (' + option.amount +' Points)</option>');
          } 
        });

        $(".swell-point-balance").html(spapi.customer.adjusted_points_balance);

        $('#swell-redemption-options').select2({
          templateResult: formatState,
          templateSelection: formatState
        });   
      clearInterval(myVar);
    }
  }
}

function formatState (opt) {
  if (!opt.id) {
    return opt.text;
  } 
  var optimage = $(opt.element).attr('data-image');
  if(!optimage){
    return opt.text;
  } else {
    var $opt = $('<div class="swell-custom-list-option" data-title="' + opt.text + '"><span><img src="' + optimage + '"/></span> <span class="option-text">' + opt.text + '</span></div>');
    return $opt;
  }
}

// tiers
function tiers_initialization() {
  window.SwellConfig = window.SwellConfig || {};
  SwellConfig.Tier = {
    getCustomerTierRank: function() {
      var customer_tier, intro_tier, rank, tiers;
      customer_tier = spapi.customer.vip_tier;
      tiers = spapi.activeVipTiers;
      if (customer_tier && customer_tier.id) {
        rank = $.grep(tiers, function(e) {
          return e.id === customer_tier.id;
        })[0].rank;
        return rank;
      } else {
        intro_tier = $.grep(tiers, function(e) {
          return e.swellrequiredAmountSpent === "$0" && e.swellrequiredAmountSpentCents === 0 && e.swellrequiredPointsEarned === 0 && e.swellrequiredPurchasesMade === 0 && e.swellrequiredReferralsCompleted === 0;
        });
        if (intro_tier.length > 0) {
          return intro_tier[0].rank;
        } else {
          return null;
        }
      }
    },
    initializeCustomTierProperties: function() {
      if(spapi.activeVipTiers.length<=1)
      {
        spapi.activeVipTiers = [
          {
            id: 1271,
            rank: 0,
            name: "steady",
            points: "spend $0-$499</br>in one year",
            multiplier: "1X<span class='title'> points multiplier</span>",
            birthday_points: "<i class='fa fa-heart'></i><span class='title'> birthday points</span>",
            rewards_shop: "<i class='fa fa-heart'></i><span class='title'> access to rewards shop</span>",
            free_shipping: "<i class='fa fa-heart'></i><span class='title'> free shipping</span>",
            early_access: "",
            birthday_gift: "",
            gift_card: ""
          },
          {
            id: 1272,
            rank: 1,
            name: "committed",
            points: "spend $500-$999</br>in one year",
            multiplier: "1.5X<span class='title'> points multiplier</span>",
            birthday_points: "<i class='fa fa-heart'></i><span class='title'> birthday points</span>",
            rewards_shop: "<i class='fa fa-heart'></i><span class='title'> access to rewards shop</span>",
            free_shipping: "<i class='fa fa-heart'></i><span class='title'> free shipping</span>",
            early_access: "<i class='fa fa-heart'></i><span class='title'> early access to new products</span>",
            birthday_gift: "",
            gift_card: ""
          },
          {
            id: 1273,
            rank: 2,
            name: "ride or die",
            points: "spend $1000+</br>in one year",
            multiplier: "2X<span class='title'> points multiplier</span>",
            birthday_points: "<i class='fa fa-heart'></i><span class='title'> birthday points</span>",
            rewards_shop: "<i class='fa fa-heart'></i><span class='title'> access to rewards shop</span>",
            free_shipping: "<i class='fa fa-heart'></i><span class='title'> free shipping</span>",
            early_access: "<i class='fa fa-heart'></i><span class='title'> early access new to products</span>",
            birthday_gift: "<i class='fa fa-heart'></i><span class='title'> birthday gift</span>",
            gift_card: "<i class='fa fa-heart'></i>"
          }
        ]
      }
      else
      {
        spapi.activeVipTiers[0].points = "spend* $"+(spapi.activeVipTiers[0].amount_spent_cents/100)+"-$"+((spapi.activeVipTiers[1].amount_spent_cents/100)-1)+"",
        spapi.activeVipTiers[0].multiplier = "5 Points",
        spapi.activeVipTiers[0].birthday_points = "1000 Points"
        // spapi.activeVipTiers[0].rewards_shop = "<i class='fa fa-heart'></i><span class='title'> access to rewards shop</span>",
        // spapi.activeVipTiers[0].free_shipping = "<i class='fa fa-heart'></i><span class='title'> free shipping</span>",
        // spapi.activeVipTiers[0].early_access = "",
        // spapi.activeVipTiers[0].birthday_gift = "",
        // spapi.activeVipTiers[0].gift_card = ""

        spapi.activeVipTiers[1].points = "spend* $"+(spapi.activeVipTiers[1].amount_spent_cents/100)+"-$"+((spapi.activeVipTiers[2].amount_spent_cents/100)-1)+"",
        spapi.activeVipTiers[1].multiplier = "7 Points",
        spapi.activeVipTiers[1].birthday_points = "1500 Points"
        // spapi.activeVipTiers[1].rewards_shop = "<i class='fa fa-heart'></i><span class='title'> access to rewards shop</span>",
        // spapi.activeVipTiers[1].free_shipping = "<i class='fa fa-heart'></i><span class='title'> free shipping</span>",
        // spapi.activeVipTiers[1].early_access = "<i class='fa fa-heart'></i><span class='title'> early access to new products</span>",
        // spapi.activeVipTiers[1].birthday_gift = "",
        // spapi.activeVipTiers[1].gift_card = ""

        spapi.activeVipTiers[2].points = "spend* $"+(spapi.activeVipTiers[2].amount_spent_cents/100)+"+</br>",
        spapi.activeVipTiers[2].multiplier = "10 Points",
        spapi.activeVipTiers[2].birthday_points = "2000 Points"
        // spapi.activeVipTiers[2].rewards_shop = "<i class='fa fa-heart'></i><span class='title'> access to rewards shop</span>",
        // spapi.activeVipTiers[2].free_shipping = "<i class='fa fa-heart'></i><span class='title'> free shipping</span>",
        // spapi.activeVipTiers[2].early_access = "<i class='fa fa-heart'></i><span class='title'> early access to new products</span>",
        // spapi.activeVipTiers[2].birthday_gift = "<i class='fa fa-heart'></i><span class='title'> birthday gift</span>",
        // spapi.activeVipTiers[2].gift_card = "<i class='fa fa-heart'></i><span class='title'> gift card</span>"
      }
    },
    initializeTiers: function(containerSelector) {
      if($(".swell-tier-table .tier-holder").length == 0) {
        if ($(containerSelector).length === 0) {
          return "";
        }
        tiers = spapi.activeVipTiers;
        customer_tier_rank = SwellConfig.Tier.getCustomerTierRank();
        // if(customer_tier_rank == null)
        // {
        //   customer_tier_rank = 0;
        // }
        for(var t=0;t<tiers.length;t++)
        {
          if(t==customer_tier_rank)
          {
            tiers[t].current_status="Current Status";
          }
          else
          {
            tiers[t].current_status="";
          }
        }
        $(containerSelector).append("<li class='titles-col'><span class='current-status-item'></span><span class='benefits-item'></span><span class='points-item'></span><span class='multiplier-item'>Per $1 Spent</span><span class='birthday-points-item'>Birthday Reward</span></li>");
        $(containerSelector).append("<li class='tier-holder'></li>");
        for(var t=0;t<tiers.length;t++)
        {
          if(t==customer_tier_rank && spapi.authenticated)
          {
            $(".tier-holder").append("<div class='tier-"+(t+1)+"-col active'><span class='current-status-item'>"+tiers[t].current_status+"</span><span class='benefits-item'>"+tiers[t].name+"</span><span class='points-item'>"+tiers[t].points+"</span><span class='multiplier-item'>"+tiers[t].multiplier+"</span><span class='birthday-points-item'>"+tiers[t].birthday_points+"</span></div>");
          }
          else
          {
            $(".tier-holder").append("<div class='tier-"+(t+1)+"-col'><span class='current-status-item'></span><span class='benefits-item'>"+tiers[t].name+"</span><span class='points-item'>"+tiers[t].points+"</span><span class='multiplier-item'>"+tiers[t].multiplier+"</span><span class='birthday-points-item'>"+tiers[t].birthday_points+"</span></div>");
          }
        }
      }
    }
  }
}

function checkCompletedNewsletterCampaign() {
  swellAPI.refreshCustomerDetails(function() {
    spapi.customer.perks.forEach(function(perk) {
      if(perk.campaign_id == 342780 && perk.completed == true) {
        $(".swell-campaign.swell-newsletter .swell-campaign-content").append("<div class='disable-overlay'></div>")
        $(".swell-campaign.swell-newsletter .swell-campaign-content").removeClass("swell-campaign-link");
      }
    });
  });
}

function setupSlickSlider(){
  $('.swell-tier-table .tier-holder').slick({
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '60px'
        }
      }
    ]
  });
}
function setupProductsSlickSlider() {
  !function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});
  if(window.location.href.indexOf("cart") > -1) {
    $('.tier1-redeemable, .tier2-redeemable, .tier3-redeemable').slick({
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: '<i class="fa fa-chevron-right slick-arrow-right"></i>',
      prevArrow: '<i class="fa fa-chevron-left slick-arrow-left"></i>',
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    });
  } else {
    $('.tier1-redeemable, .tier2-redeemable, .tier3-redeemable').slick({
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: '<i class="fa fa-chevron-right slick-arrow-right"></i>',
      prevArrow: '<i class="fa fa-chevron-left slick-arrow-left"></i>',
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '30vw'
          }
        }
      ]
   });
  }
}

function referral_initialization() {
  window.SwellConfig = window.SwellConfig || {};

  SwellConfig.Referral = {
    opts: {
      localization: {
        referralSidebarDetailsAction: "refer a friend",
        referralSidebarDetailsReward: "",

        referralRegisterHeading: "give $10, get 1,000 points",
        referralRegisterFormDetails: "",
        referralRegisterFormEmail: "your email address",
        referralRegisterFormSubmit: "next",
        referralRegisterDetails: "<%= referralCampaign.details %>",

        referralReferHeading: "give $10, get 1,000 points",
        referralReferFormEmails: "your friends' emails (separated by commas)",
        referralReferFormSubmit: "send",
        referralReferFormDetails: "",
        referralReferFormEmailsDetails: "",
        referralReferDetails: "<%= referralCampaign.details %>",

        referralReferMediaDetails: "you can also share your link with the buttons below.",

        referralShareFacebook: "share",
        referralShareCopy: "copy Link",
        referralShareSMS: "sms",
        referralShareMessenger: "message",

        referralFacebookIcon: "swell-icon-facebook1",
        referralLinkIcon: "swell-icon-link",
        referralSMSIcon: "swell-icon-message",
        referralMessengerIcon: "swell-icon-messenger",

        referralThanksHeading: "Thanks for Referring!",
        referralThanksDetails: "Remind your friends to check their emails.",

        referralCopyHeading: "Copy Link",
        referralCopyButton: "Copy Link",
        referralCopyDetails: "Copy link and share with your friends."
      },
      templates: {
        referralRegister: '<div class="swell-referral-register"> <h2 class="swell-referral-heading"><%= localization.referralRegisterHeading %></h2> <div class="swell-referral-details-container"><p class="swell-referral-details"><%= localization.referralRegisterDetails %></p></div> <div class="swell-referral-form-wrapper"> <form name="swell-referral-register-form" class="swell-referral-form" id="swell-referral-register-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"><%= localization.referralRegisterFormDetails %></p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="email" name="swell-referral-register-email" id="swell-referral-register-email" required="required" placeholder="<%= localization.referralRegisterFormEmail %>"> </li> <li class="swell-referral-form-list-button"> <div class="swell-referral-form-footer"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-register-submit" id="swell-referral-register-submit" value="<%= localization.referralRegisterFormSubmit %>"> </div> </li> </ul> </div> </form> </div> </div>',
        referralRefer: '<div class="swell-referral-refer"> <h2 class="swell-referral-heading"><%= localization.referralReferHeading %></h2> <div class="swell-referral-details-container"><p class="swell-referral-details"><%= localization.referralReferDetails %></p></div> <div class="swell-referral-form-wrapper"> <form class="swell-referral-form" name="swell-referral-refer-form" id="swell-referral-refer-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"><%= localization.referralReferFormDetails %></p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="text" name="swell-referral-refer-emails" id="swell-referral-refer-emails" required="required" placeholder="<%= localization.referralReferFormEmails %>"> <span class="swell-referral-form-field-details"><%= localization.referralReferFormEmailsDetails %></span> </li> <li class="swell-referral-form-list-button"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-refer-submit" id="swell-referral-refer-submit" value="<%= localization.referralReferFormSubmit %>"> </li> </ul> </div> </form> </div> <div class="swell-referral-media-wrapper"> <p class="swell-referral-media-details"><%= localization.referralReferMediaDetails %></p> <ul class="swell-referral-media-list"> <li class="swell-referral-medium swell-share-referral-facebook"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralFacebookIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareFacebook %> </div> </li> <li class="swell-referral-medium swell-share-referral-twitter"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon fa fa-twitter" aria-hidden="true"></i>&nbsp;Twitter </div> </li> <li class="swell-referral-medium swell-share-referral-sms"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon swell-icon-message" aria-hidden="true"></i>&nbsp;SMS </div> </li> <li class="swell-referral-medium swell-share-referral-messenger"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralMessengerIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareMessenger %> </div> </li> <li class="swell-referral-medium swell-share-referral-copy"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareCopy %> </div> </li> </ul> </div> </div>'
      }
    },
    initializeReferral: function(containerSelector) {
      var email = $(containerSelector).data("customer-email");
      if (email) {
        spapi.storage.setItem("referrer_email", email);
        spapi.customer.email = email;
      }
      if($(".rewards-page .referral-holder .swell-referral-form-wrapper").length == 0) {
        Swell.Referral.initializeReferral(".swell-referral", SwellConfig.Referral.opts);
        $(".swell-referral").show();
      }
    }
  };
}

function setupReferrals (){
  $(".swell-referral-content").show();
  $(".border").show();
  if(spapi.customer.referral_receipts.length > 0) {
    $(".referral-table").show();

    referrals = spapi.customer.referral_receipts;

    referrals.forEach(function(referral) {
      status = null;

      if(referral.completed_at){ 
        status = "Purchased ($10 earned)";
      } else {
        status = "Invited";
      }

      $(".swell-referral-table tbody").append('<tr> <td> <div class="trucate-email">' +  referral.email + '</div></td><td>' + status +'</td></tr>');
    });  
  }
}

function detachReferralCopy(){
  if($(".swell-referral-copy").length > 0)
  {
    $("body").append($(".swell-referral-copy").detach());
  }
}

function thankyou(){
  $(".swell-referral-sidebar-details").hide();
  $(".swell-referral").addClass("thankyou");
  if($(".swell-referral-table").length>0)
  {
    $(".swell-referral-table tbody").append("<tr><td>"+temp_email+"</td><td>Invited</td></tr>");
  }
}
