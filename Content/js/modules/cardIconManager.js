/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "es6-promise", "jquery", "modules/cardIcon", "pxloader"], function (require, exports, rsvp, $, cardIcon, pxloader) {
    var Promise = rsvp.Promise;
    var tmp = pxloader;
    var cardIconManager = (function () {
        function cardIconManager() {
            this._icons = new Array();
        }
        cardIconManager.prototype.loadData = function (force) {
            if (force === void 0) { force = false; }
            var self = this;
            var prom = new Promise(function (resolve, reject) {
                if (!self.checkIcons() || force == true) {
                    $.ajax({
                        url: "/api/resource?name=icons"
                    }).done(function (data) {
                        var imagePath = "";
                        var ico;
                        var path;
                        var loader = new PxLoader();
                        loader.addCompletionListener(function () {
                            resolve("Loaded");
                        });
                        for (var n = 0; n < data.length; n++) {
                            ico = data[n];
                            path = ico.url;
                            var newIco = new cardIcon(ico.id, path);
                            self.addIcon(newIco);
                            loader.addImage(path, false);
                        }
                        //loader.start();
                        resolve("Loaded");
                    });
                }
                else
                    resolve("Already loaded");
            });
            return prom;
        };
        cardIconManager.prototype.getIcons = function () {
            return this._icons;
        };
        cardIconManager.prototype.checkIcons = function () {
            return this._icons.length > 0 ? true : false;
        };
        cardIconManager.prototype.addIcon = function (img) {
            this._icons.push(img);
            return true;
        };
        return cardIconManager;
    })();
    var instance = new cardIconManager();
    return instance;
});
