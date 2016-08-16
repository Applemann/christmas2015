/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "es6-promise", "knockout", "jquery", "slick", "modules/cardIconManager", "modules/cardImageManager", "modules/cardWishManager", "modules/cardViewModel", "modules/pageController", "modules/pageNavigator"], function (require, exports, rsvp, ko, $, slickCarousel, cardIconManager, cardImageManager, cardWishManager, cardViewModel, pageController, pageNavigator) {
    var Promise = rsvp.Promise;
    var uberSlick = slickCarousel;
    var cardApplication = (function () {
        function cardApplication() {
            this.viewModel = new cardViewModel();
            // this._initWishSlick();
            ko.applyBindings(this.viewModel);
        }
        cardApplication.prototype.loadData = function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                cardImageManager.loadData().then(function (res) {
                    //                console.log("Images loaded...");
                    self.viewModel.cardImages(cardImageManager.getImages());
                    return cardIconManager.loadData();
                }).then(function (res) {
                    //                console.log("Icons loaded...");
                    self.viewModel.cardIcons(cardIconManager.getIcons());
                    return cardWishManager.loadData();
                }).then(function (res) {
                    //                console.log("Wishes loaded...");
                    self.viewModel.cardWishes(cardWishManager.getWishes());
                    self.viewModel.selectWish(cardWishManager.getLastWish()); // pre-select
                    resolve("All loaded");
                    //$(".page-main").removeClass("hidden");        
                }).catch(function (msg) {
                    //                console.log(msg);
                });
            });
        };
        cardApplication.prototype.initApplication = function () {
            var app = this;
            pageController.init();
            return new Promise(function (resolve, reject) {
                $("body").on("click", ".wish-message .replace-icon", function () {
                    var self = $(this);
                    var iconPosition = self.attr("data-icon-pos");
                    $(".wish-message .replace-icon").removeClass("selected");
                    self.addClass("selected");
                    app.viewModel.selectedIconPosition(iconPosition);
                    if (matchMedia(window.breakPoints.mobile).matches)
                    {
                        //var sourceDiv = $("")
                        var iconList = $(".icon-list");
                        var iconListOverlay = $("#icon-list-overlay");
                        var bodyHeight = $("body").outerHeight();
                        iconListOverlay.css("height", bodyHeight);
                        if (!iconList.hasClass("moved")) {
                            $("#icon-list-overlay").append(iconList.addClass("moved"));
                        }
                        iconListOverlay.addClass("active");
                    }
                    $("#page-header").velocity("scroll", {
                        duration: 100, complete: function () {
                            app.viewModel.showIconSelector(true);
                        }
                    });
                });
                pageController.on("frameUnloaded", function (index) {
                    if (index == 0)
                        $(".page-counter .page-counter-list").addClass("visible");
                    if (index == 0 || index == 2)
                        $(".card-list a").css("opacity", 0);
                    if (index == 3)
                        app.viewModel.renderImage(true); // ?he?
                    if (index == 5) {
                    }

                    if (index == 4) {
                        $(".share-link").removeClass("active");
                    }

                    if (index == 5) {
                        $("#page-footer").removeClass("small-footer");
                    }
                });
                pageController.on("frameLoaded", function (index) {
                    if (index != 0) {
                        $(".page-counter .page-counter-list li").removeClass("current").eq(index - 1).addClass("current");
                        $(".page-counter-list").removeClass(function (index, css) {
                            return (css.match(/(^|\s)stage-\S+/g) || []).join(' ');
                        }).addClass("stage-" + (index - 1));
                    }
                    if (index == 0)
                        $(".page-counter .page-counter-list").removeClass("visible");
                    if (index == 1) {
                        $(".card-list a").css("opacity", 0);
                        var animDelay = 200;
                        var animCounter = 0;
                        $(".card-list a").each(function (index, item) {
                            $(item).velocity({ opacity: 1 }, { duration: 400, delay: animDelay * animCounter });
                            animCounter++;
                        });
                    }
                    if (index == 2) {
                        $(window).trigger("resize");
                    }
                    if (index == 3) {
                        app.viewModel.renderImage(false); // explicit toggle
                        $(window).trigger("resize");
                    }
                    if (index == 5) {
                    }
                    if (index == 5) {
                        $("#page-footer").addClass("small-footer");
                    }
                });
                pageNavigator.init(pageController);
                //$("#page-main").removeClass("hidden");
                resolve("Layout init");
            });
        };
        /**
         * Not used anymore...
         *
         * @depreacted
         */
        cardApplication.prototype._initWishSlick = function () {
            ko.bindingHandlers.wishSlick = {
                init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                    // nothing?
                    //                console.log("Init slick...");
                    $(element).slick({
                        infinite: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        fade: true,
                        cssEase: 'linear',
                        arrows: true,
                        appendArrows: ".slick-arrows"
                    });
                },
                update: function (element, valueAccessor, allBindingsAccessor, data, context) {
                    //                console.log("update wishslick..");
                    //                console.log(data);
                    var shouldInit = ko.unwrap(valueAccessor());
                    if (shouldInit) {
                        //$(element).slick("unslick");
                        //                    console.info("Update slick...");
                        var options = {
                            infinite: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            fade: true,
                            cssEase: 'linear',
                            arrows: true,
                            appendArrows: ".slick-arrows"
                        };
                        $(element).slick(options);
                    }
                    else
                        ; // $(element).slick("unslick");
                }
            };
        };
        return cardApplication;
    })();
    var ca = new cardApplication();
    return ca;
});
