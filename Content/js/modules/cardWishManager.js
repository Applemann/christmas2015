/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "es6-promise", "jquery", "modules/cardWish"], function (require, exports, rsvp, $, cardWish) {
    var Promise = rsvp.Promise;
    var cardWishManager = (function () {
        function cardWishManager() {
            this._wishes = new Array();
        }
        cardWishManager.prototype.loadData = function (force) {
            if (force === void 0) { force = false; }
            var self = this;
            var prom = new Promise(function (resolve, reject) {
                if (!self.checkWishes() || force == true) {
                    $.ajax({
                        url: "/api/Resource/GetWishes?lang="+pageConfig.lang
                    }).done(function (data) {
                        for (var n = 0; n < data.length; n++) {
                            var newWish = new cardWish(data[n]);
                            self.addWish(newWish);
                        }
                        resolve("Loaded");
                    });
                }
                else
                    resolve("Already loaded");
            });
            return prom;
        };
        cardWishManager.prototype.getWishes = function () {
            return this._wishes;
        };
        cardWishManager.prototype.getWishById = function (id) {
            for (var n = 0; n < this._wishes.length; n++)
                if (this._wishes[n].getId() == id)
                    return this._wishes[n];
        };
        cardWishManager.prototype.getLastWish = function () {
            var amount = this._wishes.length;
            if (amount != 0)
                return this._wishes[amount - 1];
            return null;
        };
        cardWishManager.prototype.checkWishes = function () {
            return this._wishes.length > 0 ? true : false;
        };
        cardWishManager.prototype.addWish = function (img) {
            this._wishes.push(img);
            return true;
        };
        return cardWishManager;
    })();
    var instance = new cardWishManager();
    return instance;
});
