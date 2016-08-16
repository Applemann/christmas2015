require.config({
    baseUrl: pageConfig.baseUrl + 'js',
    waitSeconds: 60,
    urlArgs: "v3",
    paths: {
        jquery: "libs/jquery/dist/jquery.min"
        , velocity: "libs/velocity/velocity.min"
        , velocity_ui: "libs/velocity/velocity.ui.min"
        
        , pxloader: "libs/PxLoader/dist/pxloader-all.min"
        
        , "es6-promise" : "libs/es6-promise/promise.min"
        , fullpage : "libs/fullpage.js/jquery.fullPage.min"
        , knockout: "libs/knockout/dist/knockout"
        , slick : "libs/slick-carousel/slick/slick.min"
        
        // , facebook: "//connect.facebook.net/en_US/sdk"
        , EventEmitter: "libs/eventEmitter/EventEmitter.min"

        , fastclick: "libs/fastclick/lib/fastclick"
       , flowtype: "flowtype-own"
        
        
    },
    shim:
    {
        jquery: {exports: "jQuery"}
        , velocity: {deps: ["jquery"]}
        , velocity_ui: {deps: ["velocity"] }
        // , facebook: {exports: 'FB'}
        , slick: {deps: ["jquery"]}
        , knockout: {exports: "ko"}
        // , koex_pauseable: {deps: ["knockout"]}
        // , flowtype: {deps: ["jquery"], exports: "$.fn.flowtype"}
    },
    /* deps: ["jquery", "knockout", "koex_pauseable"],
    callback: function($, ko, pauseable)
    {
        window.ko = ko;
    }
    */
});

window.breakPoints = {

    mobile: "(max-width: 600px), (max-height: 420px)",
    notmobile: "(min-width: 601px) and (min-height: 421px)",
    mobileLandscape: "(max-width: 600px) and (orientation:landscape), (max-height: 420px) and (orientation:landscape)"

};

require(["jquery", "modules/cardApplication", "fastclick", "flowtype", "pxloader", "slick"], 
function ($, cardApplication, FC) {
    
    Array.prototype.getRandomItem = function()
    {
        var num = -1;
        do {
            num = Math.floor(Math.random() * this.length);
        }while(num == this.lastEntry);

        this.lastEntry = num;

        return this[num];
    };
    
    try {
        FB.init({
            appId      : pageConfig.appid,
            xfbml      : true,
            version    : 'v2.5'
        });
    
        FB.getLoginStatus(function(res){
            //       console.log(res); 
        });

    } catch (e) {

    }
    
    var mainAnimation;

    $(document).ready(function () {
//        console.info("We're ready");

    
        $(".wish-box, .wish-box-config, .tmp-image-section").flowtype({
            
            minimum: 260,
            maximum: 800,
            minFont: 8,
            maxFont: 36,
            fontRatio: 40
   
        });

        $(".intro-box").flowtype({

            minimum: 260,
            maximum: 800,
            minFont: 12,
            maxFont: 30
           , fontRatio: 50

        });

        FC.attach(document.body);

        $(".toggle-lang").on("click", function () {
            var self = $(this);
            self.toggleClass("open");
            self.siblings(".lang-list").eq(0).toggleClass("active");
            if (self.hasClass("open")) {
                $("#lang-close-overlay").off("click").on("click", function () {
                    self.trigger("click");
                    return false;
                });
            }
            $("#lang-close-overlay").toggleClass("active");
            return false;
        });
        
        cardApplication.initApplication().then(function(val){
            
            var introAnimTargets = $("#intro .intro-box > *");
            introAnimTargets.css("opacity", 0);
            $("#page-main").removeClass("hidden");
            
            var delay = 750;
            introAnimTargets.each(function(index, el){
               $(el).velocity({opacity: 1}, {duration: 1000, delay: (index) * delay});                
            });
            
            var lastRandomNumber = -1;
            var getRandomNumber = function(min, max, lastValue)
            {
                var num = -1;
                
                do {
                    num = Math.floor(Math.random() * max) + min;
                }while(num == lastRandomNumber || num == lastValue);
                //console.log(num);
                lastRandomNumber = num;
                
                return num;                
            };
            
            var randomChangeIcon = function(){
                
                var iconPos = getRandomNumber(0, icons.length);
                var iconPositionNum = lastRandomNumber;

                icons.eq(iconPos).velocity({opacity: 0}, {duration: 300, complete: function(){
                    icons.eq(iconPos).attr("src", getRandomIcon(iconPos, iconPositionNum));
                    iconPositionNum = lastRandomNumber;
                }}).velocity({opacity: 1}, {duration: 300, complete: function(){
                    setTimeout(function(){
                        randomChangeIcon();
                    }, 600)
                    
                }});
                
            };   
            
            
                var getRandomIcon = function(section, lastVal)
                {
                    return imageIcons.getRandomItem(); //imageIconsByItem[section].getRandomItem();
                }
                
                var icons = $("#intro .wish-message img");
                var imageIcons = [
                    pageConfig.baseUrl + "images/icons-new/icon-017.png", 
                    pageConfig.baseUrl + "images/icons-new/icon-063.png",
                    pageConfig.baseUrl + "images/icons-new/icon-043.png",
                    pageConfig.baseUrl + "images/icons-new/icon-088.png",
                    pageConfig.baseUrl + "images/icons-new/icon-087.png",
                    pageConfig.baseUrl + "images/icons-new/icon-082.png",
                    pageConfig.baseUrl + "images/icons-new/icon-034.png",
                    pageConfig.baseUrl + "images/icons-new/icon-067.png",
                    pageConfig.baseUrl + "images/icons-new/icon-081.png",
                    pageConfig.baseUrl + "images/icons-new/icon-012.png"];
                
                var imageIconsByItem = new Array();
                
                imageIconsByItem[0] = [
                    pageConfig.baseUrl + "images/icons-new/icon-017.png",
                    pageConfig.baseUrl + "images/icons-new/icon-063.png",
                    // pageConfig.baseUrl + "images/icons-new/icon-089.png"
                ];
                imageIconsByItem[1] = [
                    pageConfig.baseUrl + "images/icons-new/icon-043.png",
                    pageConfig.baseUrl + "images/icons-new/icon-088.png",
                    // pageConfig.baseUrl + "images/icons-new/icon-019.png"
                ];
                imageIconsByItem[2] = [
                    pageConfig.baseUrl + "images/icons-new/icon-087.png",
                    pageConfig.baseUrl + "images/icons-new/icon-082.png",
                    pageConfig.baseUrl + "images/icons-new/icon-034.png"
                ];
                imageIconsByItem[3] = [
                    pageConfig.baseUrl + "images/icons-new/icon-067.png",
                    pageConfig.baseUrl + "images/icons-new/icon-081.png",
                    pageConfig.baseUrl + "images/icons-new/icon-012.png"
                ];
                
                
                var loader = new PxLoader();
          
                loader.addCompletionListener(function() { 
                    randomChangeIcon();
                });
                
                for(var n = 0; n < imageIcons.length; n++)
                    loader.addImage(imageIcons[n]);
                
                loader.start();

            
            cardApplication.loadData().then(function(val){
                var link = $("#intro .loader-link");
               
                link.removeClass("loader-link").removeClass("disabled").text(link.attr("data-content"));
                
                
                //ANIM TESTS
                $.Velocity.RegisterEffect("ownPulse", {
                    defaultDuration: 500,
                    calls: [
                        [ { scale: 1.6 }, .5 ],
                        [ { scale: 1 }, .5 ]
                    ],
                    reset: { scale: 1 }                
                });
                
                $.Velocity.RegisterEffect("ownMiniPulse", {
                    defaultDuration: 500,
                    calls: [
                        [ { scale: 1.1 }, .5 ],
                        [ { scale: 1 }, .5 ]
                    ],
                    reset: { scale: 1 }                
                });
                
                $(".main-title").on("mouseenter", function(){
                    $(this).velocity("ownMiniPulse", {duration: 300})
                });
                $(".section-header img").on("mouseenter", function(){
                    $(this).velocity("ownPulse", {duration: 200});
                });
                
                $("section:not(#thankyou) .section-header").each(function (index, item) {
                    var images = $("img", $(item));
                    images.each(function (i, img) {
                        $(img).wrap("<span class=\"img-container\"></span>");
                    });
                });

                $("#wish .next-slide").on("click", function () {

                    var notSelected = $("#wish .replace-icon");
                    notSelected.each(function (index, item) {
                        var item = $(item);
                        if (!item.hasClass("replaced"))
                            item.velocity("callout.bounce");
                    });

                });
                
            });
            
        });
        
       
        $(window).on("resize", function(){
           
            if (matchMedia(window.breakPoints.notmobile).matches)
            {
                $(".pagec-item").each(function(index, el){

                    var sectionItem              = $(el)
                    var sectionWrapBox           = $(".wrap-box", sectionItem);
                    var sectionHeaderHeight      = $(".section-header", sectionItem).outerHeight();
                    var footerHeight             = $("#page-footer").outerHeight();
                    var actionButtonsHeight      = $(".control-buttons", sectionItem).outerHeight();
                    var targetHeight             = sectionWrapBox.outerHeight() - footerHeight;
                    var contentHeight            = targetHeight - actionButtonsHeight - sectionHeaderHeight;

                    $(".inner-box", sectionWrapBox).css("width", contentHeight + "px");

                });   
            }else
                $(".pagec-item .wrap-box .inner-box").css("width", "");
        });
        
        $(window).on("orientationchange", function () {
            $(window).trigger("resize");
        });

        $(window).on("resize", function(){
            // slick item width :/
            var mainSlick       = $(".wish-box.slick-slider");
            var slickList       = $(".slick-list", mainSlick);
            var slickListWidth  = slickList.width();
            var slickSlides     = $(".slick-slide", slickList);
            
            $(".slick-track").css("width", slickSlides.length * slickListWidth + "px");
            
            slickSlides.each(function(index, item){
                $(item).width(slickListWidth).css("left", (-1) * (index * slickListWidth) + "px");
            });
            
            $(".wish-box").trigger("flowtype:shake");
            
        });
        
        $(window).trigger("resize"); // explicitni spusteni po loadu stranky

          
    });
});
