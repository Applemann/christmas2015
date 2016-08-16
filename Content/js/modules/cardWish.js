/// <reference path="../typings/typings.d.ts" />
define(["require", "exports"], function (require, exports) {
    var cardWish = (function () {
        function cardWish(obj) {
            this.icons = new Array();
            this.positions = new Array();
            this.setWish(obj.text);
            //this.positions = obj.positions;
            this.id = obj.id;
            var positions = this.wish.split("{");
            //this.positions = new Array(positions.length);
            for (var n = 0; n < positions.length - 1; n++) {
                this.positions.push("");
            }
        }
        cardWish.prototype.getId = function () {
            return this.id;
        };
        cardWish.prototype.setWish = function (text) {
            this.wish = text;
        };
        cardWish.prototype.setIcon = function (pos, icon) {
            if (typeof icon != "undefined")
                this.icons[pos] = icon;
        };
        cardWish.prototype.getIconByPosition = function (pos) {
            if (typeof this.icons[pos] == "undefined")
                return false;
            return this.icons[pos];
        };
        cardWish.prototype.clearIcons = function () {
            this.icons = [];
            return true;
        };
        cardWish.prototype.getWish = function () {
            return this.wish;
        };
        cardWish.prototype.getIcons = function () {
            var newArray = new Array();
            for (var n = 0; n < this.icons.length; n++) {
                var icon = this.icons[n];
                if (typeof icon != "undefined")
                    newArray.push(icon);
            }
            return newArray;
        };
        cardWish.prototype.getIconsArray = function () {
            var ar = [];
            var icons = this.getIcons();
            for (var n = 0; n < icons.length; n++) {
                try {
                    ar.push(icons[n].getId());
                }
                catch (ex) {
                }
            }
            return ar;
        };
        cardWish.prototype.getPositions = function () {
            return this.positions;
        };
        /// Nahradi pozice za stringy...
        cardWish.prototype.getFullString = function () {
            return this.getReplacedString(function (id, val) {
                return '<img src="/Content/images/change-icon-empty.png" title="[Choose]"/>';
                return "<span>" + val + "</span>";
            });
        };
        cardWish.prototype.getPreparedString = function () {
            return this.getReplacedString(function (id, val) {
                return "<span data-icon-pos=\"" + id + "\" class=\"replace-icon\" id=\"icon-pos-" + id + "\">&nbsp;</span>";
            });
        };
        cardWish.prototype.getIconizedString = function () {
            var self = this;
            return this.getReplacedString(function (id, val) {
                if (typeof self.icons[id] != 'undefined')
                    return '<img src="' + self.icons[id].getPath() + '">';
                return "[ICO]";
            });
        };
        cardWish.prototype.getReplacedString = function (fnc) {
            var outString = this.wish;
            var pos, val;
            for (var n = 0; n < this.positions.length; n++) {
                pos = new RegExp("\\{" + n + "\\}", "gi");
                val = fnc(n, this.positions[n]);
                outString = outString.replace(pos, val);
            }
            return outString;
        };
        cardWish.getDummy = function () {
            return new cardWish({
                id: "0",
                text: ""
            });
        };
        return cardWish;
    })();
    return cardWish;
});
