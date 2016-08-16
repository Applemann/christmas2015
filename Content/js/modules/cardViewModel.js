/// <reference path="../typings/typings.d.ts" />

define(["require", "exports", "knockout", "jquery", "modules/cardImageManager", "modules/cardWishManager", "modules/pageOverlay", "modules/pageController", "modules/cardWish", "modules/cardImage"], function (require, exports, ko, $, cardImageManager, cardWishManager, pageOverlay, pageController, cardWish, cardImage) {

    // tmp
    // var tmp = koex;
    // require("koex_pauseable");
    var cardViewModel = (function () {
        function cardViewModel() {
            this.cardImages = ko.observableArray();
            this.cardIcons = ko.observableArray();
            this.cardWishes = ko.observableArray();
            this.selectedImage = ko.observable();
            // selectedIcons: KnockoutObservableArray<iCardIcon>   = ko.observableArray<iCardIcon>();
            this.selectedWish = ko.observable();
            this.cardIconsToDisplay = ko.observableArray();
            this.selectedIconPosition = ko.observable("");
            this.allIconsAssigned = ko.observable(false);
            this.renderImage = ko.observable(false);
            // pozice, od ktere budu pocitat orez ikon pro zobrazeni
            this.currentIconFrameNumber = 0;
            this.showIconSelector = ko.observable(false);
            this.selectedImagePath = ko.observable("");
            this.selectedImagePathThumb = ko.observable("");
            this.selectedFbPath = ko.observable("");
            this.selectedIconObservable = ko.computed({
                owner: this,
                read: function () {
                    this.selectedIconPosition();
                    this.currentIconFrameNumber = 0;
                    this.getIconsToDisplay();
                }
            });
        }
        cardViewModel.prototype.selectImage = function (entry) {
            this.selectedImage(cardImageManager.getImageById(entry.id));
            return false;
        };
        cardViewModel.prototype.selectWish = function (entry) {
            this.selectedWish(cardWishManager.getWishById(entry.id));
            this.selectedWish().clearIcons();
            this.allIconsAssigned(false);
            return false;
        };
        cardViewModel.prototype.selectSlickWish = function () {
            var slickSection = $(".wish-box .slick-active p");
            var wishId = slickSection.attr("data-wish-id");
            this.selectedWish(cardWishManager.getWishById(wishId));
            this.selectedWish().clearIcons();
            this.allIconsAssigned(false);
            this.showIconSelector(false);
            return true;
        };
        cardViewModel.prototype.getIconsToDisplay = function () {
            var current = this.currentIconFrameNumber;
            var numOfIcons = 13;
            if (matchMedia(window.breakPoints.mobile).matches) {
                this.cardIconsToDisplay(this.cardIcons());
                $(".icon-list-nav.next").css("display", "none");
                return true;
            }
            var iconsToGo = this.cardIcons().slice(current, current + numOfIcons);
            if (iconsToGo.length < numOfIcons) {
                var diff = numOfIcons - iconsToGo.length;
                iconsToGo = iconsToGo.concat(this.cardIcons().slice(0, diff));
                this.currentIconFrameNumber = diff;
            }
            else
                this.currentIconFrameNumber = current + numOfIcons;
            this.cardIconsToDisplay(iconsToGo);
            return true;
        };
        cardViewModel.prototype.nextIcons = function () {
            this.getIconsToDisplay();
            return false;
        };
        cardViewModel.prototype.hideIconSelector = function (item, ev) {
            if ($(ev.target).attr("id") == "wish" || $(ev.target).hasClass("wrap-box")) {
                this.showIconSelector(false);
                $("#icon-list-overlay").removeClass("active");
            }
            return false;
        };
        cardViewModel.prototype.assignIconToPosition = function (icon) {
            var pos = this.selectedIconPosition();
            //        console.log("Assing Icon: " + icon.getId());
            $("#icon-pos-" + pos).html($("<img />").attr("src", icon.getPath())).addClass("replaced");
            this.selectedWish().setIcon(pos, icon);
            // this.selectedWish.valueHasMutated(); // force re-render? - DEPREACTED
            this.allIconsAssigned(false);
            if (this.selectedWish().getIcons().length == this.selectedWish().getPositions().length) {
                this.allIconsAssigned(true);
                // this.selectedImageWithParams();
            }
            $(".icon-list .ico-item").removeClass("checked");
            $("#icon-id-" + icon.getId()).addClass("checked");
            this.showIconSelector(false);
            $(".instruction-box").velocity("scroll", {
                duration: 0, offset: -30, complete: function () {
                    $("#icon-list-overlay").removeClass("active");
                }
            });
            return false;
        };
        cardViewModel.prototype.clearIcons = function () {
            this.selectedWish().clearIcons();
            return true;
        };
        cardViewModel.prototype.afterAddCardImage = function (elem, index, data) {
            // animace pro pridavani?
            return true;
        };
        cardViewModel.prototype.openFormOverlay = function () {
            var self = this;
            pageOverlay.showOverlay("mail-share", function () { }, function () {
                var formIframe = $("#mail-send-frame");
                formIframe.on("load", function () {
                    var iframe = formIframe.get(0);
                    (iframe.contentWindow || iframe.contentDocument).initAllStuff();
                    formIframe.contents().find(".cancel-link").on("click", function () {
                        pageOverlay.hideOverlay('mail-share', function () { }, function () {
                            //formIframe.attr("src", ""); // unload?
                            //$(".next-frame").trigger("click");
                            pageController.nextFrame();
                        });
                        return false;
                    });
                    var image = $("#result .inner-box img").eq(0);
                    formIframe.contents().find("input[name='image_path']").attr("value", image.attr("src"));
                });
                formIframe.attr("src", formIframe.attr("data-src"));
                /*
                var mailForm = $(".mail-form");
                
                if(!mailForm.hasClass("slickSlider"))
                {
                    mailForm.slick({
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        vertical: true,
                        infinite: false
                    });
                }
                */
            });
            return false;
        };
        cardViewModel.prototype.showShareLinks = function () {
            if (matchMedia(window.breakPoints.mobile).matches) {
                var links = $(".share-link .share-links-list");
                var bodyHeight = $("body").outerHeight();
                $("#page-header").velocity("scroll", {
                    duration: 0, complete: function () {
                        links.addClass("moved").insertBefore($("#share-links-overlay .share-links-content .buttons"));
                        $("#share-links-overlay").addClass("active"); 
                    }
                });
            }
            else
                $(".share-link.green-link").toggleClass("active");
            return false;
        };
        cardViewModel.prototype.hideShareLinks = function () {
            $("#share-links-overlay").removeClass("active").css("height", "");
            return false;
        };
        cardViewModel.prototype.hideShareLinksEvent = function (item, ev) {
            $(".share-link").removeClass("active");
            return false;
        };
        cardViewModel.prototype.hideOverlay = function (section) {
            if (section === void 0) { section = "mail-share"; }
            pageOverlay.hideOverlay(section);
            return false;
        };
        cardViewModel.prototype.isSelectedIcon = function (selectedIcon) {
            var icon = this.selectedWish().getIconByPosition(this.selectedIconPosition());
            if (!icon)
                return false;
            return selectedIcon.getId() == icon.getId() ? true : false;
        };
        cardViewModel.prototype.renderWishSlick = function (elements, data) {
            //        var self = this;
            //        console.log(self);
            var options = {
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                fade: true,
                cssEase: 'linear',
                arrows: true,
                appendArrows: ".wish-box",
                responsive: [
                    {
                        breakpoint: 600,
                        settings: {
                            arrows: false
                        }
                    }
                ]
            };
            var wishBox = $(".wish-box");
            if (wishBox.hasClass("slick-slider"))
                wishBox.slick("unslick");
            wishBox.slick(options);
  
            $(window).trigger("resize");
        };
        cardViewModel.prototype.selectedImageWithParams = function () {
            var self = this;
            if (!this.allIconsAssigned())
                return false;
            var jsonRequest = {};
            jsonRequest.image_id = this.selectedImage().getId();
            jsonRequest.icon_ids = this.selectedWish().getIconsArray();
            jsonRequest.text = {
                id: this.selectedWish().getId(),
                left: 50,
                top: 50,
                right: 50,
                bottom: 150,
                color: "#000"
            };
            jsonRequest.lang = pageConfig.lang;
            self.selectedImagePathThumb(""); // loader
            $.ajax({
                method: "POST",
                url: "/api/Generator",
                data: JSON.stringify(jsonRequest),
                dataType: "json",
                success: function (res) {
                    // console.info("Yup");
                    self.selectedImagePath(res.image_url);
                    self.selectedImagePathThumb(res.preview_image_url);
                    self.selectedFbPath(res.page_url);
                    ga('send', 'event', 'Card', 'generated', 'SKODAJIS XMAS');
                    $(".share-dwn").on("click", function () {
                        ga('send', 'event', 'Card', 'download', 'SKODAJIS XMAS');
                        window.open(self.selectedImagePath(), "_blank");
                    });
                },
                error: function (xhr, error) {
                    if (xhr.status == 502) {
                        $.ajax({
                            method: "POST",
                            url: "/api/Generator",
                            data: JSON.stringify(jsonRequest),
                            dataType: "json",
                            success: function (res) {
                                self.selectedImagePath(res.image_url);
                                self.selectedImagePathThumb(res.preview_image_url);
                                self.selectedFbPath(res.page_url);
                                ga('send', 'event', 'Card', 'generated', 'SKODAJIS XMAS');
                                $(".share-fb").attr("href", res.page_url);
                                $(".share-dwn").on("click", function () {
                                    ga('send', 'event', 'Card', 'download', 'SKODAJIS XMAS');
                                    window.open(self.selectedImagePath(), "_blank");
                                });
                            }
                        });
                    }
                }

            });

            return "";
        };
        cardViewModel.prototype.startFromScratch = function () {
            //        this.selectedImage.pause();
            //        this.selectedWish.pause();
            //        this.selectedIconPosition.pause();
            // this.renderImage.pause();
            this.selectedImage(cardImage.getDummy());
            this.selectedWish(cardWish.getDummy());
            this.selectedIconPosition("");
            this.currentIconFrameNumber = 0;
            this.allIconsAssigned(false);
            this.renderImage(false);
            //        this.selectedImage.resume();
            //        this.selectedWish.resume();
            //        this.selectedIconPosition.resume();
            // this.renderImage.resume();
            pageController.gotoFrame(2);
            return true;
        };
        cardViewModel.prototype.onSubmitMail = function () {
            //        console.log("Submit mail...");
            this.resetMailForm();
            pageOverlay.hideOverlay("mail-share");
            return false;
        };
        cardViewModel.prototype.resetMailForm = function () {

            return false;
        };

        cardViewModel.prototype.openTOCWindow = function () {
            var self = this;
            pageOverlay.showOverlay("toc-content-share");
            if (matchMedia(window.breakPoints.mobile).matches) {
                $(".toc-content-share iframe").css("height", "400px").css("top", "");
            }
            else {
                // kvuli ipadu :/
                var bodyHeight = $("body").innerHeight() * .8;
                $(".toc-content-share iframe").css("top", "10%").css("height", bodyHeight + "px");
                $(".toc-content-share iframe").contents().find("#page-toc").css("height", (bodyHeight) + "px");
            }
            return false;
        };
        cardViewModel.prototype.openFacebookOverlay = function () {
            var self = this;
            pageOverlay.showOverlay("facebook-share", function () { }, function () {
                self.shareFacebook();
            });
            return false;
        };
        cardViewModel.prototype.shareFacebook = function () {
            var self = this;
            try {
            FB.ui({
                method: "share",
                href: self.selectedFbPath()
            }, function (res) {
                // schovat overlay? 
                
                pageOverlay.hideOverlay("facebook-share");
                if (typeof res != "undefined") {
                    ga('send', 'event', 'Card', 'shared', 'SKODAJIS XMAS');
                    setTimeout(function () {
                        pageController.nextFrame();
                    }, 500);
                }
            });
            } catch (e) {
                pageOverlay.hideOverlay("facebook-share");
            }
            return false;
        };
        return cardViewModel;
    })();
    return cardViewModel;
});
