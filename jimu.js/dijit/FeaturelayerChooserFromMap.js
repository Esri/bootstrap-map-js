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
  './_BasicLayerChooserFromMap',
  'dojo/_base/html',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/promise/all',
  'jimu/utils'
],
function(declare, _BasicLayerChooserFromMap, html, lang, array, all, jimuUtils) {
  return declare([_BasicLayerChooserFromMap], {

    _leafType: 'Feature Layer',
    _layerTypes: ['esri.layers.FeatureLayer','esri.layers.ArcGISDynamicMapServiceLayer','esri.layers.ArcGISTiledMapServiceLayer'],


    //options:
    createMapResponse: null,
    multiple: false,
    types: null,//available values:['point','polyline','polygon']

    //public methods:
    //getSelectedItems return [{name,url}]

    //methods need to override:
    //getSelectedItems
    //_validateBeforeAddItem
    //_getIconImageName
    //_mayHaveChildren
    //_onTreeOpen
    //_onTreeClick

    postMixInProperties:function(){
      this.inherited(arguments);
      this._initTypes();
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-layer-chooser-from-map');
    },

    //to be override
    getSelectedItems: function(){
      var items = this.inherited(arguments);
      items = array.map(items, lang.hitch(this, function(item){
        var layerObject = item && item.layerInfo && item.layerInfo.layerObject;
        var url = (layerObject && layerObject.url) || '';
        var name = (item && item.name) || '';
        return {
          url: url,
          name: name
        };
      }));
      return items;
    },

    _initTypes: function(){
      var allTypes = ['point','polyline','polygon'];
      if(this.types && this.types.length > 0){
        this.types = array.filter(this.types, lang.hitch(this,function(type){
          return allTypes.indexOf(type) >= 0;
        }));
        if(this.types.length === 0){
          this.types = allTypes;
        }
      }
      else{
        this.types = allTypes;
      }
    },

    _validateBeforeAddItem: function(layerInfo){
      //return layerInfo;
      var layerObject = layerInfo.layerObject;
      if(layerObject.type === 'Feature Layer'){
        var geoType = jimuUtils.getTypeByGeometryType(layerObject.geometryType);
        var b1 = layerObject.url && typeof layerObject.url === 'string';
        var b2 = array.indexOf(this.types, geoType) >= 0;
        var b3 = layerObject.capabilities && layerObject.capabilities.indexOf('Query') >= 0;
        return b1 && b2 && b3;
      }
      else{
        return !!layerInfo;
      }
    },

    //to be override
    _getIconImageName: function(item, opened){/*jshint unused: false*/
      var imageName = '';
      var layerObject = item.layerInfo.layerObject;
      var layerClass = item.layerClass;
      var type = item.type;
      if(type === 'Group Layer'){
        imageName = 'group_layer1.png';
      }
      else{
        if(layerClass === 'esri.layers.ArcGISDynamicMapServiceLayer'){
          if (opened) {
            imageName = 'folder_open.png';
          } else {
            imageName = 'folder_close.png';
          }
        }
        else if(layerClass === 'esri.layers.ArcGISTiledMapServiceLayer'){
          if (opened) {
            imageName = 'folder_open.png';
          } else {
            imageName = 'folder_close.png';
          }
        }
        else if(layerClass === 'esri.layers.FeatureLayer'){
          var geoType = jimuUtils.getTypeByGeometryType(layerObject.geometryType);
          if(geoType === 'point'){
            imageName = 'point_layer1.png';
          }
          else if(geoType === 'polyline'){
            imageName = 'line_layer1.png';
          }
          else if(geoType === 'polygon'){
            imageName = 'polygon_layer1.png';
          }
        }
      }
      return imageName;
    },

    //to be override
    _mayHaveChildren: function(item){
      return item.type !== this._leafType;
    },

    //to be override
    _onTreeOpen: function(item, node){/*jshint unused: false*/
      if(item.id === 'root'){
        return;
      }
      if(node.item.checking || node.item.checked){
        return;
      }
      var children = this._store.query({parent:item.id});
      if(children.length > 0){
        return;
      }
      var layerInfo = item.layerInfo;
      var layerObject = layerInfo.layerObject;
      var layerClass = item.layerClass;
      var subLayerInfos = [];
      var defs = [];
      if(layerClass === 'esri.layers.ArcGISDynamicMapServiceLayer' || layerClass === 'esri.layers.ArcGISTiledMapServiceLayer'){
        subLayerInfos = layerInfo.getSubLayers();
        if(subLayerInfos.length === 0){
          node.item.checking = false;
          node.item.checked = true;
          return;
        }
        node.item.checking = true;
        this.shelter.show();
        defs = array.map(subLayerInfos, lang.hitch(this, function(subLayerInfo){
          return subLayerInfo.getLayerObject();
        }));
        all(defs).then(lang.hitch(this, function(){
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          node.item.checking = false;
          node.item.checked = true;
          array.forEach(subLayerInfos, lang.hitch(this, function(subLayerInfo){
            this._addItem(item.id, subLayerInfo);
          }));
        }),lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          node.item.checking = false;
          node.item.checked = true;
        }));
      }
      else if(layerObject.type === 'Group Layer'){
        subLayerInfos = layerInfo.getSubLayers();
        if(subLayerInfos.length === 0){
          node.item.checking = false;
          node.item.checked = true;
          return;
        }
        node.item.checking = true;
        this.shelter.show();
        defs = array.map(subLayerInfos, lang.hitch(this, function(subLayerInfo){
          return subLayerInfo.getLayerObject();
        }));
        all(defs).then(lang.hitch(this, function(){
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          node.item.checking = false;
          node.item.checked = true;
          array.forEach(subLayerInfos, lang.hitch(this, function(subLayerInfo){
            this._addItem(item.id, subLayerInfo);
          }));
        }), lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          node.item.checking = false;
          node.item.checked = true;
        }));
      }
    }

  });
});