/// <reference path="../typings/typings.d.ts" />
define(["require", "exports"], function (require, exports) {
    var cardImage = (function () {
        function cardImage(id, path, color) {
            this.id = id;
            this.path = path;
            this.color = color;
        }
        cardImage.prototype.getId = function () {
            return this.id;
        };
        cardImage.prototype.getPath = function () {
            return this.path;
        };
        cardImage.prototype.getTextColor = function () {
            return this.color;
        };
        cardImage.prototype.isEqual = function (ci) {
            if (typeof ci == 'undefined')
                return false;
            if (ci.getId() == this.getId() && ci.getPath() == this.getPath())
                return true;
            return false;
        };
        cardImage.getDummy = function () {
            return new cardImage("0", "");
        };
        return cardImage;
    })();
    return cardImage;
});
