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
  'esri/graphicsUtils',
  'dojo/aspect',
  './LayerInfoForDefaultService'
], function(declare, array, lang, graphicsUtils, aspect, LayerInfoForDefaultService) {
  var clazz = declare(LayerInfoForDefaultService, {

    // operLayer = {
    //    layerObject: layer,
    //    title: layer.label || layer.title || layer.name || layer.id || " ",
    //    id: layerId || " ",
    //    subLayers: [operLayer, ... ],
    //    mapService: {layerInfo: , subId: },
    //    selfType:
    // };
    constructor: function( operLayer, map) {
      /*jshint unused: false*/
    },


    _obtainIsVisible: function() {
      /*jshint unused: false*/
      var visible = false, i;
      var mapService = this.originOperLayer.mapService;
      if(this.originOperLayer.mapService) {
        //layer in map service.
        if(mapService.layerInfo.subLayerVisible[mapService.subId] > 0) {
          visible = true;
        }
      }
      return visible;
    },

    setTopLayerVisible: function(visible) {
      /*jshint unused: false*/
      var mapService, subId, i;
      // mapservice
      if(this.originOperLayer.mapService) {
        //this.originOperLayer.mapService.layerInfo.setSubLayerVisible(this.originOperLayer.mapService.subId, visible);
        mapService = this.originOperLayer.mapService;
        //layer in map service.
        if(visible) {
          mapService.layerInfo.subLayerVisible[mapService.subId] ++;
        } else {
          mapService.layerInfo.subLayerVisible[mapService.subId] --;
        }
        if(mapService.layerInfo.subLayerVisible[mapService.subId] > 0) {
          mapService.layerInfo.setSubLayerVisible(mapService.subId, true);
        } else {
          mapService.layerInfo.setSubLayerVisible(mapService.subId, false);
        }
        //console.log(mapService.layerInfo.subLayerVisible);
        //console.log(mapService.layerInfo.layerObject.visibleLayers);
      }
    }
  });
  return clazz;
});
