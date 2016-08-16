/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "jquery"], function (require, exports, $) {
    var pageNavigator = (function () {
        function pageNavigator() {
        }
        pageNavigator.prototype.init = function (pc) {
            this.pc = pc;
            var pn = this;
            $(".next-slide").on("click", function () {
                var self = $(this);
                if (!self.hasClass("disabled"))
                    pn.pc.nextFrame();
                return false;
            });
            $(".prev-slide").on("click", function () {
                var self = $(this);
                if (!self.hasClass("disabled"))
                    pn.pc.prevFrame();
                return false;
            });
            $(".goto-slide").on("click", function () {
                var self = $(this);
                if (!self.hasClass("disabled")) {
                    var target = self.attr("data-target");
                    pn.pc.gotoFrame(target);
                }
                return false;
            });
            $(".goto-slide-silent").on("click", function () {
                var self = $(this);
                if (!self.hasClass("disabled")) {
                    var target = self.attr("data-target");
                    pn.pc.gotoFrameSilent(target);
                }
                return false;
            });
        };
        return pageNavigator;
    })();
    var instance = new pageNavigator();
    return instance;
});
