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
  'dojo/Deferred',
  './LayerInfo',
  './LayerInfoForDefault',
  './LayerInfoFactory'
], function(declare, array, lang, graphicsUtils, aspect, Deferred, LayerInfo, LayerInfoForDefault, LayerInfoFactory) {
  return declare(LayerInfo, {

    constructor: function( /*operLayer, map*/ ) {

      //this.layerObject = null;
    },

    getExtent: function() {
      var graphics = this.layerObject.items, extent;
      if (graphics.length === 0) {
        return null;
      } else {
        extent = graphicsUtils.graphicsExtent(graphics);
        return this._convertGeometryToMapSpatialRef(extent);
      }

    },

    _obtainIsVisible: function() {
      var visible = false,
        i;
      if (this.newSubLayers.length) {
        for (i = 0; i < this.newSubLayers.length; i++) {
          visible = visible || this.newSubLayers[i].layerObject.visible;
        }
      } else {
        visible = false;
      }
      return visible;
    },

    setTopLayerVisible: function(visible) {
      if (visible) {
        this.visible = true;
      } else {
        this.visible = false;
      }
      array.forEach(this.newSubLayers, function(subLayerInfo) {
        subLayerInfo.setLayerVisiblefromTopLayer();
      }, this);
    },

    /*
    setSubLayerVisible: function(subLayerId, visible) {
      array.forEach(this.newSubLayers, function(subLayerInfo) {
        if ((subLayerInfo.layerObject.id === subLayerId || (subLayerId === null))) {
          subLayerInfo.layerObject.visible = visible;
          if (this.visible && subLayerInfo.layerObject.visible) {
            subLayerInfo.layerObject.show();
          } else {
            subLayerInfo.layerObject.hide();
          }
        }
      }, this);
    },
    */

    //---------------new section-----------------------------------------
    obtainNewSubLayers: function() {
      /*jshint unused: false*/
      var newSubLayerInfos = [];
      var operLayer = this.originOperLayer;
      // getFeatureLayers() method can not get sub layers if GroRSS layer has not.
      var layerObjects = this.layerObject.getFeatureLayers();
      array.forEach(layerObjects, function(layerObject) {
        var subLayerInfo;
        subLayerInfo = LayerInfoFactory.getInstance().create({
          layerObject: layerObject,
          title: layerObject.label || layerObject.title || layerObject.name || layerObject.id || " ",
          id: layerObject.id || " ",
          collection: {"layerInfo": this}, // template use 'collection', because it same with collection
          selfType: 'geo_rss'
        });
        newSubLayerInfos.push(subLayerInfo);
        subLayerInfo.init();
      }, this);

      return newSubLayerInfos;
    },

    //indexes:[{
    //  isGraphicLayer:
    //  index:
    //},{}]
    //
    _obtainLayerIndexesInMap: function() {
      var indexes = [], index, i;
      for (i = 0; i < this.newSubLayers.length; i++) {
        index = this._getLayerIndexesInMapByLayerId(this.newSubLayers[i].layerObject.id);
        if (index) {
          indexes.push(index);
        }
      }
      return indexes;
    },

    moveLeftOfIndex: function(index) {
      var i;
      for (i = this.newSubLayers.length - 1; i >= 0; i--) {
        this.map.reorderLayer(this.newSubLayers[i].layerObject, index);
      }
    },

    moveRightOfIndex: function(index) {
      var i;
      for (i = 0; i < this.newSubLayers.length; i++) {
        this.map.reorderLayer(this.newSubLayers[i].layerObject, index);
      }
    }

  });
});
