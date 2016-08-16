/// <reference path="../typings/typings.d.ts" />
define(["require", "exports", "es6-promise", "jquery", "modules/cardImage", "pxloader"], function (require, exports, rsvp, $, cardImage, pxloader) {
    var Promise = rsvp.Promise;
    var tmp = pxloader;
    var cardImageManager = (function () {
        function cardImageManager() {
            this._images = new Array();
        }
        cardImageManager.prototype.loadData = function (force) {
            if (force === void 0) { force = false; }
            var self = this;
            var prom = new Promise(function (resolve, reject) {
                if (!self.checkImages() || force == true) {
                    $.ajax({
                        url: "/api/resource?name=images"
                    }).done(function (data) {
                        // console.log(data);
                        var imagePath = "";
                        var img;
                        var path;
                        var loader = new PxLoader();
                        loader.addCompletionListener(function () {
                            resolve("Loaded");
                        });
                        for (var n = 0; n < data.length; n++) {
                            img = data[n];
                            path = img.url;
                            var newImage = new cardImage(img.id, path, img.color);
                            self.addImage(newImage);
                            loader.addImage(path, false);
                        }
                        loader.start();
                        //                    resolve("Loaded");
                    });
                }
                else
                    resolve("Already loaded");
            });
            return prom;
        };
        cardImageManager.prototype.getImages = function () {
            return this._images;
        };
        cardImageManager.prototype.getImageById = function (num) {
            for (var n = 0; n < this._images.length; n++)
                if (this._images[n].getId() == num)
                    return this._images[n];
        };
        cardImageManager.prototype.checkImages = function () {
            return this._images.length > 0 ? true : false;
        };
        cardImageManager.prototype.addImage = function (img) {
            this._images.push(img);
            return true;
        };
        return cardImageManager;
    })();
    var instance = new cardImageManager();
    return instance;
});
