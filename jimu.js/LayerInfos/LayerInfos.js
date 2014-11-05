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
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/aspect',
  'dojo/Deferred',
  'dojo/on',
  'dojo/topic',
  'dojo/_base/unload',
  'dojo/Evented',
  'esri/layers/WMSLayer',
  'esri/layers/GeoRSSLayer',
  'esri/layers/KMLLayer',
  'esri/layers/FeatureLayer',
  './LayerInfoForCollection',
  './LayerInfoForMapService',
  './LayerInfoForKML',
  './LayerInfoForGeoRSS',
  './LayerInfoForDefault',
  './LayerInfoForWMS',
  './LayerInfoFactory'
], function(declare, array, lang, aspect, Deferred, on, topic, baseUnload, Evented, WMSLayer, GeoRSSLayer, KMLLayer, FeatureLayer,
  LayerInfoForCollection, LayerInfoForMapService, LayerInfoForKML, LayerInfoForGeoRSS, LayerInfoForDefault,
  LayerInfoForWMS, LayerInfoFactory) {
  var instances = [];
  var clazz = declare([Evented], {
    operLayers: null,
    map: null,
    finalLayerInfos: null,
    basemapLayers: null,

    constructor: function(basemapLayers, operLayers, map) {
      this.basemapLayers = basemapLayers;
      this.operLayers = operLayers;
      this.map = map;
      this.finalLayerInfos = [];
      this._initLayerInfos();
      this.update();
      //aspect.after(this.map, "onBaseChange", lang.hitch(this, this._onBasemapChange));
      //on(this.map, "basemap-change", lang.hitch(this, this._onBasemapChange));
      //topic.subscribe('publishData', lang.hitch(this, this._onReceiveBasemapGalleryeData));
      this._bindEvents();
    },

    update: function() {
      this._extraSetLayerInfos();
      this._clearAddedFlag(this.layerInfos);
      this._initFinalLayerInfos(this.layerInfos);
      this._markFirstOrLastNode();
    },

    getLayerInfoArray: function() {
      return this.finalLayerInfos;
    },


    //callback(layerInfo){
    //}
    traversal: function(callback) {
      array.forEach(this.getLayerInfoArray(), function(layerInfo) {
        layerInfo.traversal(callback);
      });
    },

    moveUpLayer: function(id) {
      var beChangedId = null,
        tempLayerInfo;
      var index = this._getTopLayerInfoIndexById(id),
        l;
      if (index > 0) {
        l = this.finalLayerInfos[index - 1].obtainLayerIndexesInMap().length;
        this.finalLayerInfos[index].moveRightOfIndex(this.finalLayerInfos[index - 1].obtainLayerIndexesInMap()[l - 1].index);
        beChangedId = this.finalLayerInfos[index - 1].id;
        //this.update();
        tempLayerInfo = this.finalLayerInfos[index];
        this.finalLayerInfos.splice(index, 1);
        this.finalLayerInfos.splice(index - 1, 0, tempLayerInfo);
        this._markFirstOrLastNode();
      }
      return beChangedId;
    },

    moveDownLayer: function(id) {
      var beChangedId = null,
        tempLayerInfo;
      var index = this._getTopLayerInfoIndexById(id);
      if (index < (this.finalLayerInfos.length - 1)) {
        this.finalLayerInfos[index].moveLeftOfIndex(this.finalLayerInfos[index + 1].obtainLayerIndexesInMap()[0].index);
        beChangedId = this.finalLayerInfos[index + 1].id;
        //this.update();
        tempLayerInfo = this.finalLayerInfos[index + 1];
        this.finalLayerInfos.splice(index + 1, 1);
        this.finalLayerInfos.splice(index, 0, tempLayerInfo);
        this._markFirstOrLastNode();
      }
      return beChangedId;
    },

    _initLayerInfos: function() {
      var layerInfo;
      var layerInfos = [];
      array.forEach(this.operLayers, function(operLayer) {
        try {
          layerInfo = LayerInfoFactory.getInstance().create(operLayer);
          layerInfo.init();
        } catch (err) {
          console.error(err.message);
          layerInfo = null;
        }
        if (layerInfo) {
          layerInfos.push(layerInfo);
        }
      }, this);

      //layerInfos.reverse();
      this.layerInfos = layerInfos;
    },

    _extraSetLayerInfos: function() {
      array.forEach(this.layerInfos, function(layerInfo, index) {
        var newLayerInfo;
        if (layerInfo.layerObject.declaredClass === 'esri.layers.GeoRSSLayer' || layerInfo.layerObject.declaredClass === 'esri.layers.KMLLayer') {
          try {
            newLayerInfo = LayerInfoFactory.getInstance().create(layerInfo.originOperLayer);
            newLayerInfo.init();
          } catch (err) {
            console.error(err.message);
            newLayerInfo = null;
          }
          if(newLayerInfo) {
            //show new 
            this.layerInfos[index] = newLayerInfo;
          }
        }
      }, this);
    },

    _initFinalLayerInfos: function(layerInfos) {
      //handle order to dicide finalLayerInfos order
      var i, id;
      this.finalLayerInfos.length = 0;
      //for (i = 0; i < this.map.graphicsLayerIds.length; i++) {
      for (i = this.map.graphicsLayerIds.length - 1; i >= 0; i--) {
        id = this.map.graphicsLayerIds[i];
        if (!this._isBasemap(id)) {
          this._addToFinalLayerInfos(this._findLayerInfoByIdAndReturnTopLayer(id, layerInfos), id, true);
        }
      }

      //for (i = 0; i < this.map.layerIds.length; i++) {
      for (i = this.map.layerIds.length - 1; i >= 0; i--) {
        id = this.map.layerIds[i];
        if (!this._isBasemap(id)) {
          this._addToFinalLayerInfos(this._findLayerInfoByIdAndReturnTopLayer(id, layerInfos), id, false);
        }
      }
    },

    _isBasemap: function(id) {
      var i;
      for (i = 0; i < this.basemapLayers.length; i++) {
        //if (this.basemapLayers[i].id === id) {
        // temporary code
        if (this.basemapLayers[i].id === id || this.map.getLayer(id).url === this.basemapLayers[i].layerObject.url) {
          return true;
        }
      }
      return false;
    },

    _addToFinalLayerInfos: function(layerInfo, id, isGraphicLayer) {
      var newLayer;
      var newLayerInfo;
      if (layerInfo) {
        if (!layerInfo._addedFlag && (layerInfo.isGraphicLayer() === isGraphicLayer)) {
          this.finalLayerInfos.push(layerInfo);
          layerInfo._addedFlag = true;
        }
      } else {
        newLayer = this.map.getLayer(id);
        // if newLayer is featueLayer add it.
        //if (newLayer.type && ((newLayer.type === "Feature Layer") || (newLayer.type === "Table"))) {
        //if (newLayer.declaredClass === 'esri.layers.FeatureLayer') {
        if (newLayer.declaredClass !== "esri.layers.GraphicsLayer") {
          try {
            newLayerInfo = LayerInfoFactory.getInstance().create({
              layerObject: newLayer,
              title: newLayer.label || newLayer.title || newLayer.name || newLayer.id || " ",
              id: newLayer.id || " "
            }, this.map);
            newLayerInfo.init();
          } catch (err) {
            console.error(err.message);
            newLayerInfo = null;
          }
          if (newLayerInfo) {
            this.finalLayerInfos.push(newLayerInfo);
          }
          
        }
      }
    },

    _findLayerInfoByIdAndReturnTopLayer: function(id, layerInfos) {
      // summary:
      //    recursion find LayerInof in layerInfos.
      // description:
      //    if 'layerInfo' parameter is null, use this.finalLayerInfos.
      //    return null if layerInfo does not find.
      var i, layerInfo = null;

      if (!layerInfos) {
        layerInfos = this.finalLayerInfos;
      }
      for (i = 0; i < layerInfos.length; i++) {
        layerInfo = layerInfos[i].findLayerInfoById(id);
        if (layerInfo) {
          layerInfo = layerInfos[i];
          break;
        }
      }
      return layerInfo;
    },

    _findTopLayerInfoById: function(id) {
      var i, layerInfo = null;
      var layerInfos = this.finalLayerInfos;
      for (i = 0; i < layerInfos.length; i++) {
        if (layerInfos[i].id === id) {
          layerInfo = layerInfos[i];
          break;
        }
      }
      return layerInfo;
    },

    _getTopLayerInfoIndexById: function(id) {
      var i, index = -1;
      for (i = 0; i < this.finalLayerInfos.length; i++) {
        if (this.finalLayerInfos[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },


    _clearAddedFlag: function(layerInfos) {
      array.forEach(layerInfos, function(operLayer) {
        operLayer._addedFlag = false;
      });
    },

    _markFirstOrLastNode: function() {
      var i;
      if (this.finalLayerInfos.length) {
        //clearing first
        for (i = 0; i < this.finalLayerInfos.length; i++) {
          this.finalLayerInfos[i].isFirst = false;
          this.finalLayerInfos[i].isLast = false;
        }

        this.finalLayerInfos[0].isFirst = true;
        this.finalLayerInfos[this.finalLayerInfos.length - 1].isLast = true;

        for (i = 0; i < this.finalLayerInfos.length; i++) {
          if (!this.finalLayerInfos[i].isGraphicLayer()) {
            if (i) {
              (this.finalLayerInfos[i - 1].isLast = true);
            }
            this.finalLayerInfos[i].isFirst = true;
            return;
          }
        }
      }
    },

    _onReceiveBasemapGalleryeData: function(name, widgetId, basemapLayers) {
      if(name === "BasemapGallery") {
        this.basemapLayers.length = 0;
        array.forEach(basemapLayers, lang.hitch(this, function(basemapLayer) {
          this.basemapLayers.push({
            layerObject: basemapLayer,
            id: basemapLayer.id
          });
        }), this);
        this.update();
        this.emit('layerInfosChanged');
      }
    },

    //need modify
    _onBasemapChange: function(current) {
      var i;
      this.basemapLayers.length = 0;
      for (i = 0; i < current.layers.length; i++) {
        this.basemapLayers.push({
          layerObject: current.layer[i],
          id: current.layers[i].id
        });
      }
    },

    _bindEvents: function() {
      // summary:
      //    bind events are listened by this module
      var handleAdd, handleRemove, handleBeforeUnload;
      //this.own(aspect.after(this.map, "onLayerAddResult", lang.hitch(this, this._onLayersChange)));
      handleAdd = on(this.map, "layer-add-result", lang.hitch(this, this._onLayersChange, "added"));
      //handleRemove = aspect.after(this.map, "onLayerRemove", lang.hitch(this, this._onLayersChange));
      handleRemove = on(this.map, "layer-remove", lang.hitch(this, this._onLayersChange, "removed"));
      //this.own(handleRemove);
      //aspect.after(this.map, "onLayerReorder", lang.hitch(this, this._onLayersChange));
      //this.own(on(this.map, "LayersAddResult", lang.hitch(this, this._onLayersChangeAdds)));
      //this.own(on(this.map, "layers-add-result", lang.hitch(this, this._onLayersChange)));
      //handleRemoves =  aspect.after(this.map, "onLayersRemoved", lang.hitch(this, this._onLayersChange));
      //handleRemoves = on(this.map, "layers-removed", lang.hitch(this, this._onLayersChange));
      //this.own(handleRemoves);
      //aspect.after(this.map, "onLayersReorder", lang.hitch(this, this._onLayersChange));

      handleBeforeUnload = on(this.map, "before-unload", lang.hitch(this, function(){
        handleAdd.remove();
        handleRemove.remove();
      }));

      baseUnload.addOnUnload(function() {
        handleAdd.remove();
        handleRemove.remove();
        handleBeforeUnload.remove();
      });

    },

    _onLayersChange: function(changedType, evt) {
      /*jshint unused: false*/
      // summary:
      //    response to any layer change.
      // description:
      //    update LayerInfos data and publish event
      var layerInfo = null;
      if (!evt.error && evt.layer.declaredClass !== "esri.layers.GraphicsLayer" && !evt.layer._basemapGalleryLayerType) {
        if(changedType === "added") {
          this.update();
          layerInfo = this._findTopLayerInfoById(evt.layer.id);
        } else {
          layerInfo = this._findTopLayerInfoById(evt.layer.id);
          this.update();
        }
        this.emit('layerInfosChanged', layerInfo, changedType);
      }
    }

  });


  clazz.create = function(map, webmapItemInfo) {
    // summary:
    //   create a new LayerInfos object.
    // description:
    //   parameters:
    //    map: arcgis map object.
    //    webmapItemInfo: itemInfo object of response from createMap.   
    var def = new Deferred();
    LayerInfoFactory.getInstance(map).init().then(lang.hitch(this, function() {
      var LayerInfos = new clazz(webmapItemInfo.itemData.baseMap.baseMapLayers, webmapItemInfo.itemData.operationalLayers, map);
      def.resolve(LayerInfos);
    }));
    return def;
  };

  clazz.getInstance = function(map, webmapItemInfo) {
    var def = new Deferred();
    var i, layerInfos = null;
    for(i = 0; i < instances.length; i++) {
      if(instances[i].map === map) {
        layerInfos = instances[i].layerInfos;
        break;
      }
    }

    if(layerInfos) {
      def.resolve(layerInfos);
    } else {
      LayerInfoFactory.getInstance(map).init().then(lang.hitch(this, function() {
        var layerInfos = new clazz(webmapItemInfo.itemData.baseMap.baseMapLayers, webmapItemInfo.itemData.operationalLayers, map);
        instances.push({
          map: map,
          layerInfos: layerInfos
        });
        def.resolve(layerInfos);
      }));
    }
    return def;
  };

  return clazz;
});
