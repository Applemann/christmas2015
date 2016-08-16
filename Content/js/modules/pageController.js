/// <reference path="../typings/typings.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "EventEmitter", "velocity", "velocity_ui", "modules/pageTitleGenerator"], function (require, exports, $, EventEmitter, veloc, velocui, pageTitle) {
    //var Promise = rsvp.Promise;
    var velocity = veloc;
    var velocityui = velocui;
    var pageController = (function (_super) {
        __extends(pageController, _super);
        function pageController() {
            _super.apply(this, arguments);
            this._wrap = null;
            this.currentSlide = 1;
            this.balking = false;
            this.animConfig = {
                speed: 500
            };
        }
        pageController.prototype.init = function (config) {
            if (config === void 0) { config = {}; }
            var defaultConfig = {
                mainArea: "#page-main > .section",
                items: "section",
                zIndexStart: 23
            };
            var _self = this;
            _self.config = $.extend({}, defaultConfig, config);
            var wrap = $(_self.config.mainArea);
            wrap.addClass("pagec");
            var items = $(_self.config.items, wrap);
            items.each(function (index, item) {
                $(item).addClass("pagec-item").css("z-index", _self.config.zIndexStart++).addClass("hidden");
            });
            items.eq(0).removeClass("hidden").addClass("active");
            _self._wrap = wrap;
            _self._elems = items;
            return true;
        };
        pageController.prototype.nextFrame = function () {
            if (!this.hasNextFrame() || this.balking)
                return false;
            var self = this;
            var currentSlide = this.currentSlide;
            var current = this._elems.eq(this.currentSlide - 1);
            var next = this._elems.eq(this.currentSlide);
            var animConfig = this.animConfig;
            this.balking = true;

            if (matchMedia(window.breakPoints.mobile).matches) {
                // mobile!
                $("#page-header").velocity("scroll", {
                    duration: 400, complete: function () {
                        current.velocity({ opacity: 0 }, {
                            duration: animConfig.speed, complete: function () {
                                current.addClass("hidden").removeClass("active");
                                self.emitEvent("frameUnloaded", [currentSlide - 1]);
                                self.balking = false;
                                // pageTitle.playSectionHeader(next);
                                next.css("opacity", 0).removeClass("hidden").velocity({ opacity: 1 }, {
                                    duration: animConfig.speed, complete: function () {
                                        next.addClass("active");
                                        self.emitEvent("frameLoaded", [currentSlide]);
                                        self.balking = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                pageTitle.unplaySectionHeader(current);
                current.velocity({ translateX: "-=100px", opacity: 0 }, { duration: animConfig.speed, complete: function () {
                        current.addClass("hidden").removeClass("active");
                        self.emitEvent("frameUnloaded", [currentSlide - 1]);
                        self.balking = false;
                    } });
                pageTitle.playSectionHeader(next);
                next.css("opacity", 0).removeClass("hidden").velocity({ translateX: "+=100" }, { duration: 0 }).velocity({ translateX: 0, opacity: 1 }, { duration: animConfig.speed, delay: 400, complete: function () {
                        next.addClass("active");
                        //pageTitle.playSectionHeader();
                        self.emitEvent("frameLoaded", [currentSlide]);
                        self.balking = false;
                    } });
            }
            this.currentSlide++;
            return true;
        };
        pageController.prototype.prevFrame = function () {
            if (this.balking)
                return false;
            var self = this;
            var currentSlide = this.currentSlide;
            var current = this._elems.eq(this.currentSlide - 1);
            var prev = this._elems.eq(this.currentSlide - 2);
            var animConfig = this.animConfig;
            this.balking = true;
            
            if (matchMedia(window.breakPoints.mobile).matches) {
                // mobile!
                $("#page-header").velocity("scroll", {
                    duration: 400, complete: function () {
                        current.velocity({ opacity: 0 }, {
                            duration: animConfig.speed, complete: function () {
                                current.addClass("hidden").removeClass("active");
                                self.emitEvent("frameUnloaded", [currentSlide - 1]);
                                self.balking = false;
                                //pageTitle.playSectionHeader(prev);
                                prev.css("opacity", 0).removeClass("hidden").velocity({ opacity: 1 }, {
                                    duration: animConfig.speed, complete: function () {
                                        prev.addClass("active");
                                        self.emitEvent("frameLoaded", [currentSlide - 2]);
                                        self.balking = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                pageTitle.unplaySectionHeader(current);
                current.velocity({ translateX: "+=100", opacity: 0 }, { duration: animConfig.speed, complete: function () {
                        current.addClass("hidden").removeClass("active");
                        self.emitEvent("frameUnloaded", [currentSlide - 1]);
                        self.balking = false;
                    } });
                pageTitle.playSectionHeader(prev);
                prev.css("opacity", 0).removeClass("hidden").velocity({ translateX: 0, opacity: 1 }, { duration: animConfig.speed, delay: 400, complete: function () {
                        prev.addClass("active");
                        //pageTitle.playSectionHeader();
                        self.emitEvent("frameLoaded", [currentSlide - 2]);
                        self.balking = false;
                    } });
            }
            this.currentSlide--;
            return true;
        };
        pageController.prototype.gotoFrame = function (frame) {
            if (this.balking || this.currentSlide == frame)
                return false;
            var self = this;
            var currentSlide = this.currentSlide;
            var current = this._elems.eq(this.currentSlide - 1);
            var next = this._elems.eq(frame - 1);
            var animConfig = this.animConfig;
            this.balking = true;
            $("#page-header").velocity("scroll", { duration: 400 });
            if (matchMedia(window.breakPoints.notmobile).matches) {
                pageTitle.unplaySectionHeader(current);
                pageTitle.playSectionHeader(next);
            }
            if (frame < this.currentSlide) {
                //pageTitle.unplaySectionHeader(function(){
                current.velocity({ translateX: "+=100", opacity: 0 }, { duration: animConfig.speed, complete: function () {
                        current.addClass("hidden").removeClass("active");
                        self.emitEvent("frameUnloaded", [currentSlide - 1]);
                        self.balking = false;
                    } });
                next.css("opacity", 0).removeClass("hidden").velocity({ translateX: 0, opacity: 1 }, { duration: animConfig.speed, delay: 400, complete: function () {
                        next.addClass("active");
                        //pageTitle.playSectionHeader();
                        self.emitEvent("frameLoaded", [frame - 1]);
                        self.balking = false;
                    } });
            }
            else {
                current.velocity({ translateX: "-=100px", opacity: 0 }, { duration: animConfig.speed, complete: function () {
                        current.addClass("hidden").removeClass("active");
                        self.emitEvent("frameUnloaded", [currentSlide - 1]);
                        self.balking = false;
                    } });
                next.css("opacity", 0).removeClass("hidden").velocity({ translateX: "+=100" }, { duration: 0 }).velocity({ translateX: 0, opacity: 1 }, { duration: animConfig.speed, delay: 400, complete: function () {
                        next.addClass("active");
                        //pageTitle.playSectionHeader();
                        self.emitEvent("frameLoaded", [frame - 1]);
                        self.balking = false;
                    } });
            }
            this.currentSlide = frame;
            return true;
        };
        pageController.prototype.gotoFrameSilent = function (frame) {
            return true;
        };
        pageController.prototype.hasNextFrame = function () {
            var total = this._elems.length;
            var current = this.currentSlide;
            if (total == current)
                return false;
            return true;
        };
        return pageController;
    })(EventEmitter);
    var instance = new pageController();
    return instance;
});
