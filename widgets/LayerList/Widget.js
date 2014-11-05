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

define([
    'jimu/BaseWidget',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/dom-geometry',
    'dojo/dom',
    'dojo/on',
    'dojo/_base/unload',
    'dojo/aspect',
    'dojo/query',
    'jimu/dijit/Selectionbox',
    './LayerListView',
    './PopupMenu',
    'dojo/dom-style',
    './NlsStrings',
    'jimu/LayerInfos/LayerInfoFactory',
    'jimu/LayerInfos/LayerInfos',
    'dojo/promise/all'
  ],
  function(BaseWidget, declare, lang, array, domConstruct, domGeometry, dom, on, baseUnload, aspect, query,
    Selectionbox, LayerListView, PopupMenu, domStyle, NlsStrings, LayerInfoFactory, LayerInfos, all) {
    var clazz = declare([BaseWidget], {
      /*jshint unused: false*/
      //these two properties is defined in the BaseWiget 
      baseClass: 'jimu-widget-layerList',
      name: 'layerList',

      //layerListView: Object{}
      //  A module is responsible for show layers list
      layerListView: null,

      //operLayerInfos: Object{}
      //  operational layer infos
      operLayerInfos: null,

      startup: function() {
        NlsStrings.value = this.nls;
        // summary:
        //    this function will be called when widget is started.
        // description:
        //    according to webmap or basemap to create LayerInfos instance and initialize operLayerInfos 
        //    show layers list
        //    bind events of layerList and create popup menu.
        // var mapLayers;
        // LayerInfoFactory.getInstance(this.map).init().then(lang.hitch(this, function(){
        //   if (this.map.itemId) {
        //     this.operLayerInfos = new LayerInfos(this.map.itemInfo.itemData.baseMap.baseMapLayers, this.map.itemInfo.itemData.operationalLayers, this.map);
        //   } else {
        //     mapLayers = this._obtainMapLayers();
        //     this.operLayerInfos = new LayerInfos(mapLayers.basemapLayers, mapLayers.operationalLayers, this.map);
        //   }

        //   this.showLayers();
        //   this.bindEvents();
        //   dom.setSelectable(this.layersSection, false);
        // }));

        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo).then(lang.hitch(this, function(operLayerInfos) {
            this.operLayerInfos = operLayerInfos;
            this.showLayers();
            //this.bindEvents();
            this.own(on(this.operLayerInfos, 'layerInfosChanged', lang.hitch(this, this._onLayerInfosChanged)));
            dom.setSelectable(this.layersSection, false);
          }));
        } else {
          var itemInfo = this._obtainMapLayers();
          LayerInfos.create(this.map, itemInfo).then(lang.hitch(this, function(operLayerInfos) {
            this.operLayerInfos = operLayerInfos;
            this.showLayers();
            //this.bindEvents();
            this.own(on(this.operLayerInfos, 'layerInfosChanged', lang.hitch(this, this._onLayerInfosChanged)));
            dom.setSelectable(this.layersSection, false);
          }));
        }
      },

      destroy: function() {
        this._clearLayers();
        this.inherited(arguments);
      },

      _obtainMapLayers: function() {
        // summary:
        //    obtain basemap layers and operational layers if the map is not webmap.
        var basemapLayers = [],
          operLayers = [];
        // emulate a webmapItemInfo.
        var retObj = {
          itemData: {
            baseMap: {
              baseMapLayers: []
            },
            operationalLayers: []
          }
        };
        // array.forEach(this.map.layerIds.concat(this.map.graphicsLayerIds), function(layerId) {
        //   var layer = this.map.getLayer(layerId);
        //   if (layer.isOperationalLayer) {
        //     operLayers.push({
        //       layerObject: layer,
        //       title: layer.label || layer.title || layer.name || layer.id || " ",
        //       id: layer.id || " "
        //     });
        //   } else {
        //     basemapLayers.push({
        //       layerObject: layer,
        //       id: layer.id || " "
        //     });
        //   }
        // }, this);

        array.forEach(this.map.graphicsLayerIds, function(layerId) {
          var layer = this.map.getLayer(layerId);
          if (layer.isOperationalLayer) {
            operLayers.push({
              layerObject: layer,
              title: layer.label || layer.title || layer.name || layer.id || " ",
              id: layer.id || " "
            });
          }
        }, this);
        array.forEach(this.map.layerIds, function(layerId) {
          var layer = this.map.getLayer(layerId);
          if (layer.isOperationalLayer) {
            operLayers.push({
              layerObject: layer,
              title: layer.label || layer.title || layer.name || layer.id || " ",
              id: layer.id || " "
            });
          } else {
            basemapLayers.push({
              layerObject: layer,
              id: layer.id || " "
            });
          }
        }, this);

        retObj.itemData.baseMap.baseMapLayers = basemapLayers;
        retObj.itemData.operationalLayers = operLayers;
        return retObj;
      },



      _layerFilter: function(layerId, basemapLayers, operLayers) {
        var layer = this.map.getLayer(layerId);
        if (layer.isOperationalLayer) {
          operLayers.push({
            layerObject: layer,
            title: layer.label || layer.title || layer.name || layer.id || " ",
            id: layer.id || " "
          });
        } else {
          basemapLayers.push({
            layerObject: layer,
            id: layer.id || " "
          });
        }
      },

      showLayers: function() {
        // summary:
        //    create a LayerListView module used to draw layers list in browser.
        this.layerListView = new LayerListView({
          operLayerInfos: this.operLayerInfos,
          layerListWidget: this,
          config: this.config
        }).placeAt(this.layerListBody);
      },

      _createPopupMenu: function() {
        // summary:
        //    popup menu is a dijit used to do some operations of layer
        this.popupMenu = new PopupMenu({
          layerListWidget: this
        });
        domConstruct.place(this.popupMenu.domNode, this.domNode);
      },

      _clearLayers: function() {
        // summary:
        //    clear layer list 
        //domConstruct.empty(this.layerListTable);
        if (this.layerListView && this.layerListView.destroyRecursive) {
          this.layerListView.destroyRecursive();
        }
      },

      flag: true,

      bindEvents: function() {
        // summary:
        //    bind events are listened by this module
        var handleRemove, handleRemoves;
        //this.own(aspect.after(this.map, "onLayerAddResult", lang.hitch(this, this._onLayersChange)));
        this.own(on(this.map, "layer-add-result", lang.hitch(this, this._onLayersChange)));
        //handleRemove = aspect.after(this.map, "onLayerRemove", lang.hitch(this, this._onLayersChange));
        handleRemove = on(this.map, "layer-remove", lang.hitch(this, this._onLayersChange));
        this.own(handleRemove);
        //aspect.after(this.map, "onLayerReorder", lang.hitch(this, this._onLayersChange));
        //this.own(on(this.map, "LayersAddResult", lang.hitch(this, this._onLayersChangeAdds)));
        //this.own(on(this.map, "layers-add-result", lang.hitch(this, this._onLayersChange)));
        //handleRemoves =  aspect.after(this.map, "onLayersRemoved", lang.hitch(this, this._onLayersChange));
        //handleRemoves = on(this.map, "layers-removed", lang.hitch(this, this._onLayersChange));
        //this.own(handleRemoves);
        //aspect.after(this.map, "onLayersReorder", lang.hitch(this, this._onLayersChange));

        baseUnload.addOnUnload(function() {
          handleRemove.remove();
          handleRemoves.remove();
        });

        // map infowindow
        // on(this.map.infoWindow, "show", lang.hitch(this, function(){
        //   all(this.map.infoWindow.deferreds).then(lang.hitch(this, function() {
        //     var features = [];
        //     if (this.map.infoWindow.features.length > 0) {
        //       features.push(this.map.infoWindow.features[0]);
        //       this.flag = true;
        //     }
        //     this.map.infoWindow.setFeatures(features);
        //   }), function() {

        //   });

        // }));

        // on(this.map.infoWindow, "hide", lang.hitch(this, function(){
        //   if (this.flag) {
        //     this.map.infoWindow.show();
        //     this.flag = false;
        //   }
        // }));
      },

      _onLayersChange: function(evt) {
        /*jshint unused: false*/
        // summary:
        //    response to any layer change.
        // description:
        //    udate LayerInfos data, cleare layer list and redraw
        if (evt.layer.declaredClass !== "esri.layers.GraphicsLayer") {
          this.operLayerInfos.update();
          this._clearLayers();
          this.showLayers();
        }
      },

      _onLayerInfosChanged: function(layerInfo, changedType) {
        this._clearLayers();
        this.showLayers();
      }

    });
    //clazz.hasConfig = false;
    return clazz;
  });
