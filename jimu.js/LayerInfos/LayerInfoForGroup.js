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
  'esri/request',
  './LayerInfoForDefault',
  './LayerInfoForDefaultDynamic',
  './LayerInfoForDefaultTile',
  './LayerInfo',
  './LayerInfoFactory'
], function(declare, array, lang, aspect, Deferred, esriRequest, LayerInfoForDefault, LayerInfoForDefaultDynamic, LayerInfoForDefaultTile, LayerInfo, LayerInfoFactory) {
  var clazz = declare(LayerInfo, {


    constructor: function(operLayer, map, noLegend) {
      this.noLegend = noLegend;
            
      // about popupMenu
      this.popupMenuInfo.menuItems = ['Description'];
    },

    getExtent: function() {
    },

    _obtainIsVisible: function() {
      /*jshint unused: false*/
      var visible = false, i;
      var mapService = this.originOperLayer.mapService;
      if(this.originOperLayer.mapService) {
      // layer or group in map service.
        if(this.originOperLayer.subLayers.length > 0) {
        //group in map service.
          /*
          for(i=0; i<this.newSubLayers.length; i++) {
            visible = visible || this.newSubLayers[i]._obtainIsVisible();
          }*/
          visible = true;
        } else {
        //layer in map service.
          if(mapService.layerInfo.subLayerVisible[mapService.subId] > 0) {
            visible = true;
          }
        }
      }
      return visible;
    },

    setTopLayerVisible: function(visible) {
      var mapService, subId, i;
      // mapservice
      if(this.originOperLayer.mapService) {
        //this.originOperLayer.mapService.layerInfo.setSubLayerVisible(this.originOperLayer.mapService.subId, visible);
        mapService = this.originOperLayer.mapService;
        if(this.originOperLayer.subLayers.length > 0) {
        //group in map service.
          for(i=0; i<this.newSubLayers.length; i++) {
            subId = this.newSubLayers[i].originOperLayer.mapService.subId;
            if(visible) {
              mapService.layerInfo.subLayerVisible[subId]++;
            } else {
              mapService.layerInfo.subLayerVisible[subId]--;
            }
            if(mapService.layerInfo.subLayerVisible[subId] > 0) {
              mapService.layerInfo.setSubLayerVisible(subId, true);
            } else {
              mapService.layerInfo.setSubLayerVisible(subId, false);
            }
          }
        }
        //console.log(mapService.layerInfo.subLayerVisible);
        //console.log(mapService.layerInfo.layerObject.visibleLayers);
      }
    },

    setLayerVisiblefromTopLayer: function() {
    },

    //---------------new section-----------------------------------------
    // operLayer = {
    //    layerObject: layer,
    //    title: layer.label || layer.title || layer.name || layer.id || " ",
    //    id: layerId || " ",
    //    subLayers: [operLayer, ... ],
    //    mapService: {layerInfo: , subId: },
    //    collection: {layerInfo: }
    //    selfType: dynamic | tiled | group
    // };

    obtainNewSubLayers: function() {
      var newSubLayers = [];
      array.forEach(this.originOperLayer.subLayers, function(subOperLayer){
        var subLayerInfo;
        // create sub layer
        subLayerInfo = LayerInfoFactory.getInstance().create(subOperLayer);
        newSubLayers.push(subLayerInfo);
        subLayerInfo.init();
      }, this);
      return newSubLayers;

    },

    getOpacity: function() {
    },

    setOpacity: function(opacity) {
      /*jshint unused: false*/
    },

    getLayerObject: function() {
      var def = new Deferred();
      if(this.layerObject.empty) {

        esriRequest({
          url: this.layerObject.url,
          handleAs: 'json',
          callbackParamName: 'callback',
          timeout: 100000,
          content: {f: 'json'}
        }).then(lang.hitch(this, function(res){
          var url = this.layerObject.url;
          this.layerObject = res;
          this.layerObject[url] = url;
          def.resolve(this.layerObject);
        }), function(err) {
          def.reject(err);
        });
      } else {
        def.resolve(this.layerObject);
      }
      return def;
    }

  });
  return clazz;
});
