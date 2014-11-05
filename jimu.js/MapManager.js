///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/topic',
  'dojo/on',
  'dojo/aspect',
  'dojo/keys',
  'esri/arcgis/utils',
  'esri/dijit/InfoWindow',
  "esri/dijit/PopupMobile",
  'esri/InfoTemplate',
  'esri/request',
  'esri/SpatialReference',
  'esri/geometry/Extent',
  'require',
  'jimu/portalUrlUtils',
  './utils',
  './dijit/LoadingShelter'
], function(declare, lang, array, html, topic, on, aspect, keys, agolUtils, InfoWindow,
  PopupMobile, InfoTemplate, esriRequest, SpatialReference, Extent, require,
  portalUrlUtils, jimuUtils, LoadingShelter) {
  /* global jimuConfig */
  var instance = null,
    clazz = declare(null, {
      appConfig: null,
      mapDivId: '',
      map: null,
      previousInfoWindow: null,
      mobileInfoWindow: null,
      isMobileInfoWindow: false,

      constructor: function( /*Object*/ appConfig, mapDivId) {
        this.appConfig = appConfig;
        this.mapDivId = mapDivId;
        this.id = mapDivId;
        topic.subscribe("appConfigChanged", lang.hitch(this, this.onAppConfigChanged));
        topic.subscribe("changeMapPosition", lang.hitch(this, this.onChangeMapPosition));

        on(window, 'resize', lang.hitch(this, this.onWindowResize));
      },

      showMap: function() {
        this._showMap(this.appConfig);
      },

      _showMap: function(appConfig) {
        console.time('Load Map');
        this.loading = new LoadingShelter();
        this.loading.placeAt(this.mapDivId);
        this.loading.startup();
        //for now, we can't create both 2d and 3d map
        if (appConfig.map['3D']) {
          if (appConfig.map.itemId) {
            this._show3DWebScene(appConfig);
          } else {
            this._show3DLayersMap(appConfig);
          }
        } else {
          if (appConfig.map.itemId) {
            this._show2DWebMap(appConfig);
          } else {
            this._show2DLayersMap(appConfig);
          }
        }
      },

      onWindowResize: function() {
        if (this.map && this.map.resize) {
          this.map.resize();
          this.resetInfoWindow();
        }
      },

      resetInfoWindow: function() {
        if (!this.previousInfoWindow && this.map && this.map.infoWindow) {
          this.previousInfoWindow = this.map.infoWindow;
        }
        if (!this.mobileInfoWindow && this.map && this.map.root) {
          this.mobileInfoWindow = new PopupMobile(null, html.create("div", null, null, this.map.root));
        }
        if (jimuConfig && jimuConfig.widthBreaks && this.previousInfoWindow && this.mobileInfoWindow) {
          var width = jimuConfig.widthBreaks[0];
          if (document.body.clientWidth < width && !this.isMobileInfoWindow) {
            this.map.infoWindow.hide();
            this.map.setInfoWindow(this.mobileInfoWindow);
            this.isMobileInfoWindow = true;
          } else if (this.map.width >= width && this.isMobileInfoWindow) {
            this.map.infoWindow.hide();
            this.map.setInfoWindow(this.previousInfoWindow);
            this.isMobileInfoWindow = false;
          }
        }
      },

      onChangeMapPosition: function(position) {
        var oldPos = lang.clone(this.appConfig.map.position);
        var pos = lang.mixin(oldPos, position);
        html.setStyle(this.mapDivId, jimuUtils.getPositionStyle(pos));
        if (this.map && this.map.resize) {
          this.map.resize();
        }
      },

      _visitConfigMapLayers: function(appConfig, cb) {
        array.forEach(appConfig.map.basemaps, function(layerConfig, i) {
          layerConfig.isOperationalLayer = false;
          cb(layerConfig, i);
        }, this);

        array.forEach(appConfig.map.operationallayers, function(layerConfig, i) {
          layerConfig.isOperationalLayer = true;
          cb(layerConfig, i);
        }, this);
      },

      _show3DLayersMap: function(appConfig) {
        require(['esri3d/Map'], lang.hitch(this, function(Map) {
          var initCamera = appConfig.map.mapOptions.camera,
            map;
          map = new Map(this.mapDivId, {
            camera: initCamera
          });
          this._visitConfigMapLayers(appConfig, lang.hitch(this, function(layerConfig) {
            this.createLayer(map, '3D', layerConfig);
          }));
          map.usePlugin = Map.usePlugin;
          this._publishMapEvent(map);
        }));
      },

      _show3DWebScene: function(appConfig) {
        this._getWebsceneData(appConfig.map.itemId).then(lang.hitch(this, function(data) {
          require(['esri3d/Map'], lang.hitch(this, function(Map) {
            var map = new Map(this.mapDivId, appConfig.map.mapOptions);

            array.forEach(data.itemData.operationalLayers, function(layerConfig) {
              this.createLayer(map, '3D', layerConfig);
            }, this);

            array.forEach(data.itemData.baseMap.baseMapLayers, function(layerConfig) {
              layerConfig.type = "tile";
              this.createLayer(map, '3D', layerConfig);
            }, this);

            array.forEach(data.itemData.baseMap.elevationLayers, function(layerConfig) {
              layerConfig.type = "elevation";
              this.createLayer(map, '3D', layerConfig);
            }, this);

            map.toc = data.itemData.toc;
            map.bookmarks = data.itemData.bookmarks;
            map.tours = data.itemData.tours;
          }));
        }));
      },

      _publishMapEvent: function(map) {
        //add this property for debug purpose
        window._viewerMap = map;
        if (this.loading) {
          this.loading.destroy();
        }

        console.timeEnd('Load Map');
        if (this.map) {
          this.map = map;
          console.log('map changed.');
          topic.publish('mapChanged', this.map);
        } else {
          this.map = map;
          topic.publish('mapLoaded', this.map);
        }
        this.resetInfoWindow();
      },

      _getWebsceneData: function(itemId) {
        return esriRequest({
          url: 'http://184.169.133.166/sharing/rest/content/items/' + itemId + '/data',
          handleAs: "json"
        });
      },

      _show2DWebMap: function(appConfig) {
        //should use appConfig instead of this.appConfig, because appConfig is new.
        // if (appConfig.portalUrl) {
        //   var url = portalUrlUtils.getStandardPortalUrl(appConfig.portalUrl);
        //   agolUtils.arcgisUrl = url + "/sharing/content/items/";
        // }

        var mapOptions = this._processMapOptions(appConfig.map.mapOptions);

        if ((!appConfig.map.mapOptions || !appConfig.map.mapOptions.extent) && appConfig.map.itemId === "6e03e8c26aad4b9c92a87c1063ddb0e3") {
          if (!mapOptions) {
            mapOptions = {};
          }
          mapOptions.extent = new Extent(-14480448.059223117, 2605852.2271675873, -6653296.362823148, 6514536.1055573225, new SpatialReference(102100));
        }

        var webMapPortalUrl = appConfig.map.portalUrl;
        var webMapItemId = appConfig.map.itemId;
        var webMapOptions = {
          mapOptions: mapOptions,
          bingMapsKey: appConfig.bingMapsKey
        };

        var mapDeferred = jimuUtils.createWebMap(webMapPortalUrl, webMapItemId, this.mapDivId, webMapOptions);

        mapDeferred.then(lang.hitch(this, function(response) {
          var map = response.map;
          //var extent;
          map.itemId = appConfig.map.itemId;
          map.itemInfo = response.itemInfo;
          map.webMapResponse = response;
          // enable snapping
          var options = {
            snapKey: keys.copyKey
          };
          map.enableSnapping(options);

          this._publishMapEvent(map);
        }), lang.hitch(this, function() {
          if (this.loading) {
            this.loading.destroy();
          }
          topic.publish('mapCreatedFailed');
        }));
      },

      _show2DLayersMap: function(appConfig) {
        require(['esri/map'], lang.hitch(this, function(Map) {
          var map = new Map(this.mapDivId, this._processMapOptions(appConfig.map.mapOptions));
          // enable snapping
          var options = {
            snapKey: keys.copyKey
          };
          map.enableSnapping(options);
          this._visitConfigMapLayers(appConfig, lang.hitch(this, function(layerConfig) {
            this.createLayer(map, '2D', layerConfig);
          }));
          this._publishMapEvent(map);
        }));
      },

      _processMapOptions: function(mapOptions) {
        if (!mapOptions) {
          return;
        }
        var ret = lang.clone(mapOptions);
        if (ret.extent) {
          ret.extent = new Extent(ret.extent);
        }
        if (ret.infoWindow) {
          ret.infoWindow = new InfoWindow(ret.infoWindow, html.create('div', {}, this.mapDivId));
        }
        return ret;
      },

      createLayer: function(map, maptype, layerConfig) {
        var layMap = {
          '2D_tiled': 'esri/layers/ArcGISTiledMapServiceLayer',
          '2D_dynamic': 'esri/layers/ArcGISDynamicMapServiceLayer',
          '2D_image': 'esri/layers/ArcGISImageServiceLayer',
          '2D_feature': 'esri/layers/FeatureLayer',
          '2D_rss': 'esri/layers/GeoRSSLayer',
          '2D_kml': 'esri/layers/KMLLayer',
          '2D_webTiled': 'esri/layers/WebTiledLayer',
          '2D_wms': 'esri/layers/WMSLayer',
          '2D_wmts': 'esri/layers/WMTSLayer',
          '3D_tiled': 'esri3d/layers/ArcGISTiledMapServiceLayer',
          '3D_dynamic': 'esri3d/layers/ArcGISDynamicMapServiceLayer',
          '3D_image': 'esri3d/layers/ArcGISImageServiceLayer',
          '3D_feature': 'esri3d/layers/FeatureLayer',
          '3D_elevation': 'esri3d/layers/ArcGISElevationServiceLayer',
          '3D_3dmodle': 'esri3d/layers/SceneLayer'
        };

        require([layMap[maptype + '_' + layerConfig.type]], lang.hitch(this, function(layerClass) {
          var layer, infoTemplate, options = {},
            keyProperties = ['label', 'url', 'type', 'icon', 'infoTemplate', 'isOperationalLayer'];
          for (var p in layerConfig) {
            if (keyProperties.indexOf(p) < 0) {
              options[p] = layerConfig[p];
            }
          }
          if (layerConfig.infoTemplate) {
            infoTemplate = new InfoTemplate(layerConfig.infoTemplate.title, layerConfig.infoTemplate.content);
            options.infoTemplate = infoTemplate;

            layer = new layerClass(layerConfig.url, options);

            if (layerConfig.infoTemplate.width && layerConfig.infoTemplate.height) {
              aspect.after(layer, 'onClick', lang.hitch(this, function() {
                map.infoWindow.resize(layerConfig.infoTemplate.width, layerConfig.infoTemplate.height);
              }), true);
            }
          } else {
            layer = new layerClass(layerConfig.url, options);
          }

          layer.isOperationalLayer = layerConfig.isOperationalLayer;
          layer.label = layerConfig.label;
          layer.icon = layerConfig.icon;
          map.addLayer(layer);
        }));
      },

      onAppConfigChanged: function(appConfig, reason, mapConfig, otherOptions) {
        if (reason !== 'mapChange') {
          this.appConfig = appConfig;
          return;
        }
        if (otherOptions && otherOptions.reCreateMap === false) {
          this.appConfig = appConfig;
          return;
        }
        if (this.map) {
          topic.publish('beforeMapDestory', this.map);
          this.map.destroy();
        }
        this._showMap(appConfig);
        this.appConfig = appConfig;
      }

    });

  clazz.getInstance = function(appConfig, mapDivId) {
    if (instance === null) {
      instance = new clazz(appConfig, mapDivId);
    }
    return instance;
  };

  return clazz;
});