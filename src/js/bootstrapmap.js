define(["esri/map", "esri/dijit/Popup", "esri/arcgis/utils", "dojo/_base/declare", "dojo/on", "dojo/_base/connect", "dojo/touch", "dojo/dom", "dojo/_base/lang", "dojo/dom-style", "dojo/query", "dojo/NodeList-traverse", "esri/geometry/Point", "dojo/domReady!"],
  function (Map, Popup, EsriUtils, declare, on, conn, touch, dom, lang, style, query, nodecols, Point) {
    "use strict";
    return {
      create: function (divId, options) {
        if (divId && options) {
          var smartResizer = new this._smartResizer(divId, options);
          var mapOut = smartResizer.createMap();
          mapOut._smartResizer = smartResizer;
          return mapOut;
        }
      },
      createWebMap: function (webMapId, divId, options) {
        if (divId && options) {
          var smartResizer = new this._smartResizer(divId, options);
          var deferredOut = smartResizer.createWebMap(webMapId);
          return deferredOut;
        }
      },
      destroy: function (map) {
        function _disconnect(resizer) {
          if (resizer._handles) {
            var i = resizer._handles.length;
            while (i--) {
              resizer._handles[i].remove();
              resizer._handles.splice(i, 1);
            }
          }
        }
        if (map && map._smartResizer) {
          _disconnect(map._smartResizer);
        }
      },
      // SmartResizer
      _smartResizer: declare(null, {
        _mapDivId: null,
        _mapDiv: null,
        _mapStyle: null,
        _map: null,
        _autoRecenterDelay: 50,
        _popupRecenterDelayer: 150,
        _popupBlocked: false,
        _visible: true,
        _visibilityTimer: null,
        _mapDeferred: null,
        constructor: function (mapDivId, options) {
          this._mapDivId = mapDivId;
          this._mapDiv = dom.byId(mapDivId);
          this._mapStyle = style.get(this._mapDiv);
          this._options = lang.mixin(options, {});
          this._handles = [];
        },
        createMap: function () {
          this._setMapDiv(false);
          lang.mixin(this._options, {
            smartNavigation: false,
            autoResize: false
          });
          this._map = new Map(this._mapDivId, this._options);
          this._bindEvents();
          this._mapDiv.__map = this._map;
          return this._map;
        },
        createWebMap: function (webMapId) {
          this._setMapDiv(false);
          if (!this._options.hasOwnProperty("mapOptions")) {
            this._options.mapOptions = {};
          }
          lang.mixin(this._options.mapOptions, {
            smartNavigation: false,
            autoResize: false
          });
          var deferred = EsriUtils.createMap(webMapId, this._mapDivId, this._options);
          this._mapDeferred = deferred;
          var myselfAsAResizer = this;
          var getDeferred = function (response) {
            this._map = response.map;
            this._bindEvents();
            this._mapDiv.__map = this._map;
            this._smartResizer = myselfAsAResizer;
          };
          this._mapDeferred.then(lang.hitch(this, getDeferred));
          return deferred;
        },
        _setTouchBehavior: function () {
          // Add desireable touch behaviors here
          if (this._options.hasOwnProperty("scrollWheelZoom")) {
            if (this._options.scrollWheelZoom) {
              this._map.enableScrollWheelZoom();
            } else {
              this._map.disableScrollWheelZoom();
            }
          } else {
            // Default
            this._map.disableScrollWheelZoom();
          }
          // Remove 300ms delay to close infoWindow on touch devices
          on(query(".esriPopup .titleButton.close"), touch.press, lang.hitch(this,
            function (evt) {
              this._map.infoWindow.hide();
            }));
        },
        _bindEvents: function () {
          if (!this._map) {
            console.log("BootstrapMap: Invalid map object. Please check map reference.");
            return;
          }
          // Touch behavior
          var setTouch = function (e) {
            this._setTouchBehavior();
          };
          if (this._map.loaded) {
            lang.hitch(this, setTouch).call();
          } else {
            this._handles.push(on(this._map, "load", lang.hitch(this, setTouch)));
          }
          // InfoWindow restyle and reposition
          var setInfoWin = function (e) {
            this._map.infoWindow.anchor = "top";
            var updatePopup = function (obj) {
              var pt = obj._map.infoWindow._location;
              if (pt && !obj._popupBlocked) {
                obj._popupBlocked = true;
                // Delay the map re-center
                window.setTimeout(function () {
                  obj._repositionMapForInfoWin(pt);
                  obj._popupBlocked = false;
                }, obj._popupRecenterDelayer);
              }
            };

            this.counter = 0;
            // When map is clicked (no feature or graphic)
            this._map.on("click", lang.hitch(this, function (e) {
              if (this._map.infoWindow.isShowing) {
                updatePopup(this);
              }
            }));
            // When graphics are clicked
            on(this._map.graphics, "click", lang.hitch(this, function (g) {
              updatePopup(this);
            }));
            // When infowindow appears
            on(this._map.infoWindow, "show", lang.hitch(this, function (g) {
              updatePopup(this);
            }));
            // FeatureLayers selection changed - No longer needed at 3.9
            // on(this._map.infoWindow, "selection-change", lang.hitch(this, function (g) {
            //   updatePopup(this);
            // }));
          };

          if (this._map.loaded) {
            lang.hitch(this, setInfoWin).call();
          } else {
            this._handles.push(on(this._map, "load", lang.hitch(this, setInfoWin)));
          }

          // Debounce window resize
          var debounce = function (func, threshold, execAsap) {
            var timeout;
            return function debounced() {
              var obj = this,
                args = arguments;

              function delayed() {
                if (!execAsap) {
                  func.apply(obj, args);
                }
                timeout = null;
              }
              if (timeout) {
                clearTimeout(timeout);
              } else if (execAsap) {
                func.apply(obj, args);
              }
              timeout = setTimeout(delayed, threshold || 100);
            };
          };
          // Responsive resize
          var resizeWin = debounce(this._setMapDiv, 100, false);
          this._handles.push(on(window, "resize", lang.hitch(this, resizeWin)));
          // Auto-center map
          var recenter = function (extent, width, height) {
            this._map.__resizeCenter = this._map.extent.getCenter();
            var timer = function () {
              this._map.centerAt(this._map.__resizeCenter);
            };
            setTimeout(lang.hitch(this, timer), this._autoRecenterDelay);
          };
          this._handles.push(on(this._map, "resize", lang.hitch(this, recenter)));
        },
        _getMapDivVisibility: function () {
          return this._mapDiv.clientHeight > 0 || this._mapDiv.clientWidth > 0;
        },
        _checkVisibility: function () {
          var visible = this._getMapDivVisibility();
          if (this._visible !== visible) {
            if (visible) {
              this._setMapDiv(true);
            }
          }
        },
        _controlVisibilityTimer: function (runTimer) {
          if (runTimer) {
            // Start a visibility change timer
            this._visibilityTimer = setInterval(lang.hitch(this, function () {
              this._checkVisibility();
            }), 200);
          } else {
            // Stop timer we have checking for visibility change
            if (this._visibilityTimer) {
              clearInterval(this._visibilityTimer);
              this._visibilityTimer = null;
            }
          }
        },
        _setMapDiv: function (forceResize) {
          if (!this._mapDivId) {
            return;
          }
          // Get map visibility
          var visible = this._getMapDivVisibility();
          if (this._visible !== visible) {
            this._visible = visible;
            this._controlVisibilityTimer(!visible);
          }
          // Fill page with the map or match row height
          if (this._visible) {
            var windowH = window.innerHeight;
            var bodyH = document.body.clientHeight;
            var room = windowH - bodyH;
            var mapH = this._calcMapHeight();
            var colH = this._calcColumnHeight(mapH);
            var mh1 = mapH + room;
            var mh2 = 0;
            var inCol = false;
            // Resize to neighboring column or fill page
            if (mapH < colH) {
              mh2 = (room > 0) ? colH + room : colH;
              inCol = true;
            } else {
              mh2 = (mh1 < colH) ? colH : mh1;
              inCol = false;
            }
            // Expand map height
            style.set(this._mapDivId, {
              "height": mh2 + "px",
              "width": "auto"
            });
            // Force resize and reposition
            if (this._map && forceResize && this._visible) {
              this._map.resize();
              this._map.reposition();
            }
            //console.log("Win:" + windowH + " Body:" + bodyH + " Room:" + room + " OldMap:" + mapH + " Map+Room:" + mh1 + " NewMap:" + mh2 + " ColH:" + colH + " inCol:" + inCol);
          }
        },
        _calcMapHeight: function (e) {
          //var s = style.get(e);
          var s = this._mapStyle;
          var p = parseInt(s.paddingTop) + parseInt(s.paddingBottom);
          var g = parseInt(s.marginTop) + parseInt(s.marginBottom);
          var bodyH = parseInt(s.borderTopWidth) + parseInt(s.borderBottomWidth);
          var h = p + g + bodyH + this._mapDiv.clientHeight;
          return h;
        },
        _calcColumnHeight: function (mapH) {
          var colH = 0;
          var cols = query(this._mapDiv).closest(".row").children("[class*='col']");
          if (cols.length) {
            for (var i = 0; i < cols.length; i++) {
              var col = cols[i];
              // Avoid the map in column calculations
              var containsMap = query("#" + this._mapDivId, col).length > 0;
              if ((col.clientHeight > colH) && !containsMap) {
                colH = col.clientHeight;
              }
            }
          }
          return colH;
        },
        _repositionMapForInfoWin: function (graphicCenterPt) {
          // Determine the upper right, and center, coordinates of the map
          var maxPoint = new Point(this._map.extent.xmax, this._map.extent.ymax, this._map.spatialReference);
          var centerPoint = new Point(this._map.extent.getCenter());
          // Convert to screen coordinates
          var maxPointScreen = this._map.toScreen(maxPoint);
          var centerPointScreen = this._map.toScreen(centerPoint);
          var graphicPointScreen = this._map.toScreen(graphicCenterPt); // Points only
          // Buffer
          var marginLR = 10;
          var marginTop = 3;
          var infoWin = this._map.infoWindow.domNode.childNodes[0];
          var infoWidth = infoWin.clientWidth;
          var infoHeight = infoWin.clientHeight + this._map.infoWindow.marginTop;
          // X
          var lOff = graphicPointScreen.x - infoWidth / 2;
          var rOff = graphicPointScreen.x + infoWidth / 2;
          var l = lOff - marginLR < 0;
          var r = rOff > maxPointScreen.x - marginLR;
          if (l) {
            centerPointScreen.x -= (Math.abs(lOff) + marginLR) < marginLR ? marginLR : Math.abs(lOff) + marginLR;
          } else if (r) {
            centerPointScreen.x += (rOff - maxPointScreen.x) + marginLR;
          }
          // Y
          var yOff = this._map.infoWindow.offsetY;
          var tOff = graphicPointScreen.y - infoHeight - yOff;
          var t = tOff - marginTop < 0;
          if (t) {
            centerPointScreen.y += tOff - marginTop;
          }

          //Pan the ap to the new centerpoint  
          if (r || l || t) {
            centerPoint = this._map.toMap(centerPointScreen);
            this._map.centerAt(centerPoint);
          }
        }
      }) // _smartResizer
    }; // return
  } // function
); // define