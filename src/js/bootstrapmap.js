define([
    "esri/map",
    "esri/arcgis/utils",
    "esri/geometry/Point",
    "dojo/_base/declare",
    "dojo/on",
    "dojo/touch",
    "dojo/dom",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/query",
    "dojo/NodeList-traverse",
    "dojo/dom-class",
    "dojo/domReady!"],
    function (Map, EsriUtils, Point, declare, on, touch, dom, lang, style, query, nodecols, domClass) {
        "use strict";

        return {
            // BootstrapMap Class Public Functions
            create: function (divId, options) {
                var smartResizer,
                    mapOut;
                if (divId && options) {
                    smartResizer = new this._smartResizer(divId, options);
                    mapOut = smartResizer.createMap();
                    mapOut._smartResizer = smartResizer;
                    return mapOut;
                }
            },
            createWebMap: function (webMapId, divId, options) {
                var smartResizer,
                    deferredOut;
                if (divId && options) {
                    smartResizer = new this._smartResizer(divId, options);
                    deferredOut = smartResizer.createWebMap(webMapId);
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
            // SmartResizer Class Functions
            _smartResizer: declare(null, {
                constructor: function (mapDivId, options) {
                    this._map = null;
                    this._autoRecenterDelay =  50;
                    this._popupRecenterDelayer = 150;
                    this._popupPosition = "top";
                    this._popupBlocked = false;
                    this._visible = true;
                    this._visibilityTimer = null;
                    this._mapDeferred = null;
                    // Default bootstrap map options
                    this._autoRecenter = options.autoRecenter || true;
                    this._responsiveResize = options.responsiveResize || true;
                    // Map properties
                    this._mapDivId = mapDivId;
                    this._mapDiv = dom.byId(mapDivId);
                    this._mapStyle = style.get(this._mapDiv);
                    // Map options
                    this._options = lang.mixin(options, {});
                    // Events
                    this._handles = [];
                },
                // Create a new map
                createMap: function () {
                    this._setMapDiv(false);
                    // Need to be false in responsive mode
                    if (this._responsiveResize) {
                        lang.mixin(this._options,
                            {
                                smartNavigation: false,
                                autoResize: false
                            });
                    }
                    this._map = new Map(this._mapDivId, this._options);
                    this._setPopup();
                    this._bindEvents();
                    this._mapDiv.__map = this._map;
                    return this._map;
                },
                // Create the webmap for client
                createWebMap: function (webMapId) {
                    var deferred,
                        myselfAsAResizer,
                        getDeferred;
                    // Get DIV
                    this._setMapDiv(false);
                    // Get options and pass them on
                    if (!this._options.hasOwnProperty("mapOptions")) {
                        this._options.mapOptions = {};
                    }
                    // Need to be false in responsive mode
                    if (this._responsiveResize) {
                        lang.mixin(this._options.mapOptions, {
                            smartNavigation: false,
                            autoResize: false
                        });
                    }
                    // Create the webmap
                    deferred = EsriUtils.createMap(webMapId, this._mapDivId, this._options);
                    this._mapDeferred = deferred;
                    myselfAsAResizer = this;
                    // Callback to get map
                    getDeferred = function (response) {
                        this._map = response.map;
                        this._setPopup();
                        this._bindEvents();
                        this._mapDiv.__map = this._map;
                        this._smartResizer = myselfAsAResizer;
                        this._smartResizer._setMapDiv(true);
                        this._map._smartResizer = this._smartResizer;
                    };
                    this._mapDeferred.then(lang.hitch(this, getDeferred));
                    return deferred;
                },
                _setPopup: function () {
                    domClass.add(this._map.infoWindow.domNode, "light");
                },
                // Avoid undesirable behaviors on touch devices
                _setTouchBehavior: function () {
                    // Add desireable touch behaviors here
                    if (this._options.hasOwnProperty("scrollWheelZoom")) {
                        if (this._options.scrollWheelZoom) {
                            this._map.enableScrollWheelZoom();
                        } else {
                            this._map.disableScrollWheelZoom();  // Prevent slippy map on scroll
                        }
                    } else {
                        // Default
                        this._map.disableScrollWheelZoom();
                    }
                    // Remove 300ms delay to close infoWindow on touch devices
                    on(query(".esriPopup .titleButton.close"), touch.press, lang.hitch(this,
                        function () {
                            this._map.infoWindow.hide();
                        }));
                },
                // Set up listeners 
                _bindEvents: function () {
                    var setTouch,
                        setInfoWin,
                        debounce,
                        timeout,
                        visible,
                        resizeWin,
                        recenter,
                        timer;
                    if (!this._map) {
                        console.error("BootstrapMap: Invalid map object. Please check map reference.");
                        return;
                    }
                    // Touch behavior
                    setTouch = function () {
                        this._setTouchBehavior();
                    };
                    if (this._map.loaded) {
                        lang.hitch(this, setTouch).call();
                    } else {
                        this._handles.push(on(this._map, "load", lang.hitch(this, setTouch)));
                    }
                    // InfoWindow restyle and reposition
                    setInfoWin = function () {
                        this._map.infoWindow.anchor = this._popupPosition;
                        var updatePopup = function (obj) {
                            var pt = obj._map.infoWindow.location;
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
                        this._map.on("click", lang.hitch(this, function () {
                            if (this._map.infoWindow.isShowing) {
                                updatePopup(this);
                            }
                        }));
                        // When graphics are clicked
                        on(this._map.graphics, "click", lang.hitch(this, function () {
                            updatePopup(this);
                        }));
                        // When infowindow appears
                        on(this._map.infoWindow, "show", lang.hitch(this, function () {
                            updatePopup(this);
                        }));
                        // FeatureLayers selection changed - No longer needed at 3.9
                        // on(this._map.infoWindow, "selection-change", lang.hitch(this, function (g) {
                        //   updatePopup(this);
                        // }));
                    };
                    // If the map is already loaded, eg. webmap, just hitch up
                    if (this._map.loaded) {
                        lang.hitch(this, setInfoWin).call();
                    } else {
                        this._handles.push(on(this._map, "load", lang.hitch(this, setInfoWin)));
                    }
                    // Debounce window resize
                    debounce = function (func, threshold, execAsap) {
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
                    resizeWin = debounce(this._setMapDiv, 100, false);
                    this._handles.push(on(window, "resize", lang.hitch(this, resizeWin)));
                    // Auto-center map
                    if (this._autoRecenter) {
                        recenter = function () {
                            this._map.__resizeCenter = this._map.extent.getCenter();
                            timer = function () {
                                this._map.centerAt(this._map.__resizeCenter);
                            };
                            setTimeout(lang.hitch(this, timer), this._autoRecenterDelay);
                        };
                        // Listen for container resize
                        this._handles.push(on(this._map, "resize", lang.hitch(this, recenter)));
                    }
                },
                // Check if the map is really visible
                _getMapDivVisibility: function () {
                    return this._mapDiv.clientHeight > 0 || this._mapDiv.clientWidth > 0;
                },
                // Check map visiblity
                _checkVisibility: function () {
                    var visible = this._getMapDivVisibility();
                    if (this._visible !== visible) {
                        if (visible) {
                            this._setMapDiv(true);
                        }
                    }
                },
                // Ensure the map resizes if div is hidden
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
                // Set new map height
                _setMapDiv: function (forceResize) {
                    if (!this._mapDivId || !this._responsiveResize) {
                        return;
                    }
                    var visible,
                        windowH,
                        bodyH,
                        room,
                        mapH,
                        colH,
                        mh1,
                        mh2,
                        inCol;
                    // Get map visibility
                    visible = this._getMapDivVisibility();
                    if (this._visible !== visible) {
                        this._visible = visible;
                        this._controlVisibilityTimer(!visible);
                    }
                    // Fill page with the map or match row height
                    if (this._visible) {
                        //windowH = window.innerHeight;
                        windowH = document.documentElement.clientHeight;
                        bodyH = document.body.clientHeight;
                        room = windowH - bodyH;
                        mapH = this._calcMapHeight();
                        colH = this._calcColumnHeight(mapH);
                        mh1 = mapH + room;
                        mh2 = 0;
                        inCol = false;
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
                        //console.log("Win:" + windowH + " Body:" + bodyH + " Room:" + room + " 
                        // OldMap:" + mapH + " Map+Room:" + mh1 + " NewMap:" + mh2 + " ColH:" + 
                        // colH + " inCol:" + inCol);
                    }
                },
                // Current height of map
                _calcMapHeight: function () {
                    //var s = style.get(e);
                    var s = this._mapStyle,
                        p = parseInt(s.paddingTop, 10) + parseInt(s.paddingBottom, 10) || 0,
                        g = parseInt(s.marginTop, 10) + parseInt(s.marginBottom, 10) || 0,
                        bodyH = parseInt(s.borderTopWidth, 10) + parseInt(s.borderBottomWidth, 10) || 0,
                        h = p + g + bodyH + this._mapDiv.clientHeight;
                  return h;
                },
                // Get the column height around the map 
                _calcColumnHeight: function (mapH) {
                    var i,
                        col,
                        colH = 0,
                        cols = query(this._mapDiv).closest(".row").children("[class*='col']"),
                        containsMap;
                    if (cols.length) {
                        for (i = 0; i < cols.length; i++) {
                            col = cols[i];
                            // Avoid the map in column calculations
                            containsMap = query("#" + this._mapDivId, col).length > 0;
                            if ((col.clientHeight > colH) && !containsMap) {
                                colH = col.clientHeight;
                            }
                        }
                    }
                    return colH;
                },
                // Reposition map to fix popup
                _repositionMapForInfoWin: function (graphicCenterPt) {
                    // Determine the upper right, and center, coordinates of the map
                    var maxPoint = new Point(this._map.extent.xmax, this._map.extent.ymax, this._map.spatialReference),
                        centerPoint = new Point(this._map.extent.getCenter()),
                        // Convert to screen coordinates
                        maxPointScreen = this._map.toScreen(maxPoint),
                        centerPointScreen = this._map.toScreen(centerPoint),
                        graphicPointScreen = this._map.toScreen(graphicCenterPt), // Points only
                        // Buffer
                        marginLR = 10,
                        marginTop = 3,
                        infoWin = this._map.infoWindow.domNode.childNodes[0],
                        infoWidth = infoWin.clientWidth,
                        infoHeight = infoWin.clientHeight + this._map.infoWindow.marginTop,
                        // X
                        lOff = graphicPointScreen.x - infoWidth / 2,
                        rOff = graphicPointScreen.x + infoWidth / 2,
                        l = lOff - marginLR < 0,
                        r = rOff > maxPointScreen.x - marginLR,
                        // Y
                        yOff = this._map.infoWindow.offsetY,
                        tOff = graphicPointScreen.y - infoHeight - yOff,
                        t = tOff - marginTop < 0;
                    // X
                    if (l) {
                        centerPointScreen.x -= (Math.abs(lOff) + marginLR) < marginLR ? marginLR : Math.abs(lOff) + marginLR;
                    } else if (r) {
                        centerPointScreen.x += (rOff - maxPointScreen.x) + marginLR;
                    }
                    // Y
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
    }); // define function
