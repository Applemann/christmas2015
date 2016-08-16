/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "jquery", "velocity", "velocity_ui"], function (require, exports, $, veloc, velocui) {
    var tmp = veloc;
    var tmp2 = velocui;
    var pageTitleGenerator = (function () {
        function pageTitleGenerator() {
        }
        pageTitleGenerator.prototype.playSectionHeader = function (section, complete) {
            if (complete === void 0) { complete = function () { }; }
            var self = this;
            var rotate = self.getTextRotation() + "deg";
            var target = $(".main-title", section);
            $(".section-header img", section).each(function (index, item) {
                $(item).velocity({ translateY: ["0%", "-140%"] }, { duration: 750, easing: [200, 14] });
            });
            $(".main-title > span", section).velocity({ rotateZ: rotate }, { duration: 0 });
            if (target.length > 0) {
                target.css("opacity", 1).velocity({ translateY: ["0%", "-140%"] }, { duration: 900, easing: [200, 50], delay: 400, complete: function () {
                        complete();
                    } });
            }
            else
                complete();
            return true;
        };
        pageTitleGenerator.prototype.unplaySectionHeader = function (section, complete) {
            if (complete === void 0) { complete = function () { }; }
            var target = $(".main-title", section);
            $(".section-header img", section).each(function (index, item) {
                $(item).velocity({ translateY: ["-140%", "0"] }, { duration: 350 });
            });
            if (target.length > 0) {
                target.velocity({ translateY: ["-140%", "0"], opacity: 0 }, { duration: 350, easing: "ease-in", complete: function () {
                        $(".main-title > span", section).velocity({ rotateZ: 0 }, { duration: 0 });
                        complete();
                    } });
            }
            else
                complete();
            return true;
        };
        pageTitleGenerator.prototype.getTextRotation = function () {
            var rotation = 0;
            var addon = Math.random() * (2 - 0) + 0;
            rotation = 1 + addon;
            rotation *= (Math.random() > .5 ? -1 : 1);
            return rotation;
        };
        return pageTitleGenerator;
    })();
    var instance = new pageTitleGenerator();
    return instance;
});
