/* 
 * Prvni verze modulu pro pxPreloader
 */
define(["jquery", "pxloader"], function($){
    
    return {
        
        _preload : null,
        
        /**
         * Inicializace celeho systemu. Jedina nutna metoda pro spusteni
         * 
         * @returns {undefined}
         */
        init : function()
        {
            this._preload = new PxLoader();
            this._loadAssets();            
            this._preload.start();      
        }
        
        /**
         * Nacte seznam obrazku ze stranky a vlozi do fronty pro zpracovani.
         * 
         * @returns {undefined}
         */
        , _loadAssets : function()
        {
            var _this = this;
            $("[data-preload-img]").each(function(){
                var _img = $(this);
                _this._preload.addImage(_img.attr("data-preload-img"), false);
            });
            _this._preload.addCompletionListener(function() { 
                _this._restoreAssets();            
            });
        }
        
        /**
         * "Vrati" nactene obrazky zpatky do src atributu
         * 
         * @returns {undefined}
         */
        , _restoreAssets : function()
        {
            $("[data-preload-img]").each(function(){
               var _img = $(this);
               _img.attr("src", _img.attr("data-preload-img"));                
            });
        }        
    }; 
    
});
