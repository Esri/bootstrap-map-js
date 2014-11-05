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
  './LayerInfoForDefault'
], function(declare, array, lang, graphicsUtils, aspect, LayerInfoForDefault) {
  var clazz = declare(LayerInfoForDefault, {


    constructor: function( operLayer, map ) {
      this.layerObject = operLayer.layerObject;
      /*jshint unused: false*/
    },

    getExtent: function() {
    },

    _obtainIsVisible: function() {
      var ary = [], index;
      ary = lang.clone(this.originOperLayer.layerObject.visibleLayers);
      index = array.indexOf(ary, this.originOperLayer.id);
      if (index >= 0) {
        return true;
      } else {
        return false;
      }
    },

    setTopLayerVisible: function(visible) {
      if(this.originOperLayer.layerObject.visible) {
        if(visible) {
          this._show();
          this.visible = true;
        } else {
          this._hide();
          this.visible = false;
        }
      } else {
        if(visible) {
          this._hide();
          this.visible = true;
        } else {
          this._hide();
          this.visible = false;
        }
      }

    },

    _show: function() {
      var ary = [], index;
      ary = lang.clone(this.originOperLayer.layerObject.visibleLayers);
      index = array.indexOf(ary, this.id);
      if(index < 0) {
        ary.push(this.id);
        this.originOperLayer.layerObject.setVisibleLayers(ary);
      }
    },

    _hide: function() {
      var ary = [], index;
      ary = lang.clone(this.originOperLayer.layerObject.visibleLayers);
      index = array.indexOf(ary, this.id);
      if (index >= 0) {
        ary.splice(index, 1);
      }
      this.originOperLayer.layerObject.setVisibleLayers(ary);
    },

    setLayerVisiblefromTopLayer: function() {
      //click from top collecton
      if(this.originOperLayer.layerObject.visible) {
        if(this.visible) {
          this._show();
        }
      } else {
        this._hide();
      }
    },

    //---------------new section-----------------------------------------
    // operLayer = {
    //    layerObject: layer,
    //    title: layer.label || layer.title || layer.name || layer.id || " ",
    //    id: layerId || " ",
    //    subLayers: [operLayer, ... ],
    //    mapService: {layerInfo: , subId: },
    //    collection: {layerInfo: }
    // };
    _obtainLegendInfos: function(operLayer) {
      /*jshint unused: false*/
      var legendInfos = [];
      return legendInfos;
    },

    obtainNewSubLayers: function() {
      var newSubLayers = [];
      return newSubLayers;
    },

    getOpacity: function() {
    },

    setOpacity: function(opacity) {
      /*jshint unused: false*/
    }

  });
  return clazz;
});
