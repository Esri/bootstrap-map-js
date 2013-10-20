define(["esri/map","dojo/_base/declare", "dojo/on", "dojo/dom", "dojo/_base/lang", "dojo/dom-style", "dojo/query", "dojo/NodeList-traverse","dojo/domReady!"], 
    function(Map, declare, on, dom, lang, style, query) {
    "use strict"        
    return {
     create: function(divId,options) {
        if (divId && options) {
          var smartResizer = new this._smartResizer(divId,options);
          var mapOut = smartResizer.createMap();
          mapOut._smartResizer = smartResizer;
          return mapOut;
        }
      },
      bindTo: function(map) {
        if (map) {
          var smartResizer = new this._smartResizer(map.id,map._params);
          var mapOut = smartResizer.bindToMap(map);
          mapOut._smartResizer = smartResizer;
          return mapOut;
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
      // SmartResizer
      _smartResizer: declare(null, {
        _mapDivId: null,
        _mapDiv: null,
        _map: null,
        _delay: 100,
        _w: 0,
        constructor: function(mapDivId,options) {
          this._mapDivId = mapDivId;
          this._mapDiv = dom.byId(mapDivId);
          this._options = options;
          this._handles = [];
        },
        createMap: function() {
          this._setMapDiv(true);
          lang.mixin(this._options,{smartNavigation:false});
          this._map = new Map(this._mapDivId,this._options);
          this._bindEvents();
          return this._map;
        },
        bindToMap: function(map) {
          this._setMapDiv(true);
          this._map = map;
          this._map.resize();
          this._bindEvents();
          this._setTouchBehavior();
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
          // Touch behavior
          var setTouch = function(e) {
            this._setTouchBehavior();
          }
          this._handles.push(on(this._map,'load', lang.hitch(this, setTouch)));
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
        _calcSpace: function(e) {
          var s = style.get(e);
          var p = parseInt(s.paddingTop) + parseInt(s.paddingBottom);
          var g = parseInt(s.marginTop) + parseInt(s.marginBottom);
          var b = parseInt(s.borderTopWidth) + parseInt(s.borderBottomWidth);
          var h = p + g + b; 
          return h;
        },
        _setMapDiv: function() {
          if (!this._mapDivId) {
            return;
          }
          var w = window.innerHeight;
          if (w != this._w) {
            this._w = w;
            var b = document.body.clientHeight;
            var mh = this._mapDiv.clientHeight;
            var ms = this._calcSpace(this._mapDiv);
            var mh1 = mh + ms;
            var room = w - b;
            var mh2 = room + mh1;
            style.set(this._mapDivId, {"height": mh2+"px"});
            //console.log("Window:"+ w + " Body:" + b + " Room: " + room + " MapInner:" + mh + " MapSpace:"+ms + " OldMapHeight:"+mh1+ " NewMapHeight:"+mh2);
          }
        }       
    })
  }
});