define(["require", "exports"], function (require, exports) {
    /**
     * Ovladani cislovane navigace - bud jako soucas fullPageController-u nebo samostatne pres fullpage eventy...
     */
    var dotNavigation = (function () {
        function dotNavigation(targetElement) {
        }
        dotNavigation.prototype.showNavigation = function () {
        };
        dotNavigation.prototype.hideNavigation = function () {
        };
        return dotNavigation;
    })();
    return dotNavigation;
});
