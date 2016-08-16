/// <reference path="../typings/typings.d.ts" />
define(["require", "exports"], function (require, exports) {
    var pageFrame = (function () {
        function pageFrame(num) {
            this._current = false;
            this._active = false;
            this._number = 0;
            this._number = num;
        }
        pageFrame.prototype.setCurrent = function (val) {
            this._current = val;
        };
        pageFrame.prototype.setActive = function (val) {
            this._active = val;
        };
        pageFrame.prototype.current = function () {
            return this._current;
        };
        pageFrame.prototype.active = function () {
            return this._active;
        };
        pageFrame.prototype.getNumber = function () {
            return this._number;
        };
        return pageFrame;
    })();
});
/*
class pageCounter
{
    private amount: number = 0;
    private items: Array<iPageFrame> = new Array<iPageFrame>();
    
    init(amount: number):any
    {
        this.amount = amount;
        for(var n = 0; n < amount; n++)
            this.items.push(new pageFrame());
    }
    
    public current(num: number)
    {
        for(var n = 0; n < this.items.length; n++)
            if(num == this.items[n].getNumber())
                this.items[n].setCurrent(true);
            else
                this.items[n].setCurrent(false);
    }
    
    public active(num: number)
    {
        for(var n = 0; n < this.items.length; n++)
            if(num == this.items[n].getNumber())
                this.items[n].setCurrent(true);
            else
                this.items[n].setCurrent(false);
    }
    
    public getItems()
    {
        return this.items;
    }
 
}


var ca = new pageCounter();
export = ca;
*/
