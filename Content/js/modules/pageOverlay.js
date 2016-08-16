/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "jquery"], function (require, exports, $) {
    var pageOverlay = (function () {
        function pageOverlay() {
            var self = this;
            $(".page-overlay").on("click", function (ev) {
                ev.stopPropagation();
                var classes = $(this).attr("class").split(" ");
                var target = "";
                for (var n = 0; n < classes.length; n++)
                    if (classes[n].slice(-5) == "share")
                        target = classes[n];
                self.hideOverlay(target);
                return false;
            });
            $(".page-overlay .overlay-window > * ").on("click", function () {
                return false;
            });
        }
        pageOverlay.prototype.showOverlay = function (which, before, after) {
            if (before === void 0) { before = function () { }; }
            if (after === void 0) { after = function () { }; }
            before();
            var bodyHeight = $("body").outerHeight();
            $(".page-overlay." + which).addClass("running").css("height", bodyHeight);
            setTimeout(function () {
                $(".page-overlay." + which).addClass("active").removeClass("running");
            }, 500);
            after();
            return true;
        };
        pageOverlay.prototype.hideOverlay = function (which, before, after) {
            if (before === void 0) { before = function () { }; }
            if (after === void 0) { after = function () { }; }
            before();
            $(".page-overlay." + which).removeClass("active").css("height", "");
            after();
            return true;
        };
        return pageOverlay;
    })();
    var instance = new pageOverlay();
    return instance;
});
