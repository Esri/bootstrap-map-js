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
  'dojo/Deferred',
  'esri/graphicsUtils',
  'dojo/aspect',
  './LayerInfo',
  './LayerInfoForDefaultWMS',
  './LayerInfoFactory',
  'esri/layers/FeatureLayer'
], function(declare, array, lang, Deferred, graphicsUtils, aspect, LayerInfo, LayerInfoForDefaultWMS, LayerInfoFactory, FeatureLayer) {
  /*jshint unused: false*/
  return declare(LayerInfo, {


    constructor: function( operLayer, map) {
      this.layerObject = operLayer.layerObject;
      /*jshint unused: false*/
    },


    getExtent: function() {
      var extent = this.originOperLayer.layerObject.extent;
      return this._convertGeometryToMapSpatialRef(extent);
    },

    _obtainIsVisible: function() {
      /*
      return this.originOperLayer.layerObject.visible;
      */

      /*
      if(!this.layerObject.visibleLayers || this.layerObject.visibleLayers.length === 0 ) {
        return false;
      } else {
        return true;
      }*/

      return this.layerObject.visible;
    },

    setTopLayerVisible: function(visible) {
      if (visible) {
        this.layerObject.setVisibility(true);
      } else {
        this.layerObject.setVisibility(false);
      }
      array.forEach(this.newSubLayers, function(subLayerInfo) {
        subLayerInfo.setLayerVisiblefromTopLayer();
      }, this);
    },

    /*
    setSubLayerVisible: function(subLayerId, visible) {
    //id === name at this.
      var ary = [], index;
      if (subLayerId !== null) {
        if (visible) {
          ary = lang.clone(this.originOperLayer.layerObject.visibleLayers);
          index = array.indexOf(ary, subLayerId);
          if(index < 0) {
            ary.push(subLayerId);
            this.originOperLayer.layerObject.setVisibleLayers(ary);
          }
        } else {
          ary = lang.clone(this.originOperLayer.layerObject.visibleLayers);
          index = array.indexOf(ary, subLayerId);
          if (index >= 0) {
            ary.splice(index, 1);
          }
          if (ary.length === 0) {
            ary.push(-1);
          }
          this.originOperLayer.layerObject.setVisibleLayers(ary);
        }
      }
    },
    */
    //---------------new section-----------------------------------------

    obtainNewSubLayers: function() {
      var newSubLayerInfos = [];
      array.forEach(this.layerObject.layerInfos, function(layerInfo){
        var subLayerInfo;
        subLayerInfo = LayerInfoFactory.getInstance().create({
          layerObject: this.layerObject, //the subLayerObject is WMS layer also. 
          title: layerInfo.label || layerInfo.title || layerInfo.name || " ",
          id: layerInfo.name || " ", // WMS sub layer does not has id, the name is id.
          wms: {"layerInfo": this, "subId": layerInfo.name},
          selfType: 'wms'
        });

        newSubLayerInfos.push(subLayerInfo);
        subLayerInfo.init();
      }, this);

      return newSubLayerInfos;
    }

  });
});
