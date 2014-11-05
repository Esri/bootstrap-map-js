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

define(['dojo/_base/lang',
  'dojo/_base/array',
  'jimu/LayerInfos/LayerInfos',
  'dojo/Deferred',
  'dojo/promise/all'], function(lang, array, LayerInfos, Deferred, all) {
  var mo = {};
  mo.readLayersFromMap = function (map) {
    var def = new Deferred(), defs = [];
    LayerInfos.getInstance(map, map.itemInfo).then(lang.hitch(this, function(layerInfosObj) {
      var layerInfos = [];

      layerInfosObj.traversal(lang.hitch(this,function(layerInfo){
        layerInfos.push(layerInfo);
        defs.push(layerInfo.getLayerObject());
      }));

      all(defs).then(lang.hitch(this,function(layerObjects){
        var ret = [];
        array.forEach(layerObjects, function(layerObject, i){
          if(layerObject.declaredClass === "esri.layers.FeatureLayer"){
            layerObject.id = layerInfos[i].id;
            ret.push(layerObject);

            console.log(layerObject.name, layerObject.id);
          }
        }, this);
        fixDuplicateNames(ret);
        def.resolve(ret);
      }));
    }));
    
    return def;
  };

  mo.getLayerConfigsFromLayers = function(layers){
    return array.map(layers, function(layer){
      return mo.getLayerConfigFromLayer(layer);
    });
  };

  mo.getLayerConfigFromLayer = function(layer){
    var json = {};
    json.name = layer.name;
    json.show = layer.visible;
    json.layer = {url: layer.url};
    return json;
  };

  function fixDuplicateNames(layerObjects){
    var titles = [], duplicateLayers = [];
    array.forEach(layerObjects, function(layerObject){
      if(titles.indexOf(layerObject.name) < 0){
        titles.push(layerObject.name);
      }else{
        duplicateLayers.push(layerObject);
      }
    });
    array.forEach(duplicateLayers, function(layerObject){
      layerObject.name = layerObject.name + '-' + layerObject.id;
    });
  }
  return mo;
});