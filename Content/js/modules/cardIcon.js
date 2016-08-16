/// <reference path="../typings/typings.d.ts" />
define(["require", "exports"], function (require, exports) {
    var cardIcon = (function () {
        function cardIcon(id, path) {
            this.id = id;
            this.path = path;
        }
        cardIcon.prototype.getId = function () {
            return this.id;
        };
        cardIcon.prototype.getPath = function () {
            return this.path;
        };
        cardIcon.getDummy = function () {
            return new cardIcon("0", "");
        };
        return cardIcon;
    })();
    return cardIcon;
});
