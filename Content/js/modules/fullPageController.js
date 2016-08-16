/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "jquery", "fullpage"], function (require, exports, $, fullPage) {
    var fullPage2 = fullPage;
    var fullPageScroller = (function () {
        function fullPageScroller() {
        }
        fullPageScroller.prototype.init = function (config) {
            if (config === void 0) { config = {}; }
            var defaultConfig = {
                mainArea: "#page-main",
                fullpageConfig: {}
            };
            var _self = this;
            _self.config = $.extend({}, defaultConfig, config);
            //var fullPage = require("fullpage");
            $(_self.config.mainArea).fullpage(_self.config.fullpageConfig);
            return true;
        };
        fullPageScroller.prototype.nextFrame = function () {
            $.fn.fullpage.moveSlideRight();
            return true;
        };
        fullPageScroller.prototype.prevFrame = function () {
            $.fn.fullpage.moveSlideLeft();
            return true;
        };
        fullPageScroller.prototype.gotoFrame = function (frame) {
            $.fn.fullpage.moveTo(1, frame);
            return true;
        };
        fullPageScroller.prototype.gotoFrameSilent = function (frame) {
            $.fn.fullpage.silentMoveTo(1, frame);
            return true;
        };
        return fullPageScroller;
    })();
    return fullPageScroller;
});
