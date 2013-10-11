define(["esri/map","dojo/_base/declare", "dojo/on", "dojo/dom", "dojo/_base/lang", "dojo/dom-style", "dojo/query", "dojo/domReady!"], 
	function(Map, declare, on, dom, lang, style, query) {
    "use strict"	
    return {
     create: function(divId,options) {
        if (divId && options) {
          var smartResizer = new this._smartResizer(divId,options);
          var map = smartResizer.createMap();
          map._smartResizer = smartResizer;
          return map;
        }
      },
      destroy: function(map) {
        function _disconnect(resizer) {
          if (resizer._handles) {
            var h;
            var i = resizer._handles.length;
            while (i--) {
              resizer._handles[i].remove();
              resizer._handles.splice(i,1);
            }
          }
        }
        if (map && map._smartResizer){
          _disconnect(map._smartResizer);
        }
      },
	 	 _smartResizer: declare(null, {
        _mapDivId: null,
        _mapDiv: null,
        _map: null,
        _delay: 100,
        _w: 0,
        // BootstrapMap
        constructor: function(mapDivId,options) {
          this._mapDivId = mapDivId;
          this._mapDiv = dom.byId(mapDivId);
          this._options = options;
          this._handles = [];
        },
        createMap: function() {
          // Update before map is created
          this._setMapDiv(true);
          // Create map
          lang.mixin(this._options,{smartNavigation:false});
          this._map = new Map(this._mapDivId,this._options);
          on(this._map,'load', lang.hitch(this, this._setTouchBehavior));
          this._bindEvents();
          return this._map;
        },
        _setTouchBehavior: function() {
          this._map.disableScrollWheelZoom();
        },
        _bindEvents: function(){
          if (!this._map) {
            console.log("BootstrapMap: Invalid map object. Please check map reference.");
            return;
          }
          // Responsive resize
          var resizeWin = function(evt){
           this._setMapDiv();
          }
          this._handles.push(on(window, "resize", lang.hitch(this, resizeWin)));
          // Auto-center map
          var recenter = function(extent, width, height) { 
            this._map.__resizeCenter = this._map.extent.getCenter();
            var timer = function() {
              this._map.centerAt(this._map.__resizeCenter);
           }
            setTimeout(lang.hitch(this, timer), this._delay);
          }
          this._handles.push(on(this._map, 'resize', lang.hitch(this, recenter)));
       },
       _setMapDiv: function() {
         if (!this._mapDivId) {
           return;
         }
          // Check for valid bootstrap v3 container
          var e = query("body > .container")[0];
          if (!e) {
           console.log("BootstrapMap: You must have a .container in your document.");
           return;
          }
          var w = window.innerHeight;
          if (w != this._windowH) {
            this._w = w;
            var c = e.clientHeight;
            var o = e.offsetTop;
            // Body offset (navigation)
            var wo = w - o;  
            // Style params
            var s = style.get(this._mapDivId);
            var h = parseInt(s.height); 
            var p = parseInt(s.paddingTop) + parseInt(s.paddingBottom);
            var g = parseInt(s.marginTop) + parseInt(s.marginBottom);
            var b = parseInt(s.borderTopWidth) + parseInt(s.borderBottomWidth);
            h = h + p + g + b; 
            // Get room to grow/shrink
            var room = wo - c;
            var m1 = room + h;
            // Set height
            style.set(this._mapDivId, {"height": m1+"px"});
          }
        }       
    })
  }
});