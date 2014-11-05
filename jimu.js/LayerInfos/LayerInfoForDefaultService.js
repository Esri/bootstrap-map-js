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
  './LayerInfoForDefault',
  'esri/layers/FeatureLayer'
], function(declare, array, lang, Deferred, LayerInfoForDefault, FeatureLayer) {
  return declare(LayerInfoForDefault, {

    loadLayer: function() {
      if(this.layerObject.empty) {
        this.layerObject = new FeatureLayer(this.layerObject.url);
        this.layerObject.on('load', lang.hitch(this, this.initLegendsNode, this.legendsNode));
      }
    },

    getDeniedItems: function() {
      var dynamicDeniedItems = this.inherited(arguments);
      var tableIndex = dynamicDeniedItems.indexOf('Open attribute table');
      if (tableIndex !== -1) {
        dynamicDeniedItems.splice(tableIndex, 1);
      }
      return dynamicDeniedItems;
    },

    _onTableItemClick: function(evt) {
      if (this.layerObject.empty) {
        this.layerObject = new FeatureLayer(this.layerObject.url);
        this.layerObject.on('load', lang.hitch(this, function(){
          this.initLegendsNode(this.legendsNode);
          evt.layerListWidget.publishData({
            'target': 'AttributeTable',
            'layer': this.layerObject
          });
        }));
      } else {
        evt.layerListWidget.publishData({
          'target': 'AttributeTable',
          'layer': this.layerObject
        });
      }
    },

    //--------------public interface---------------------------
    getLayerObject: function() {
      var def = new Deferred();
      if(this.layerObject.empty) {
        this.layerObject = new FeatureLayer(this.layerObject.url);
        this.layerObject.on('load', lang.hitch(this, function() {
          def.resolve(this.layerObject);
        }));
        this.layerObject.on('error', lang.hitch(this, function(err) {
          def.reject(err);
        }));
      } else {
        def.resolve(this.layerObject);
      }
      return def;
    }

  });
});
