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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/query',
  'dojo/on',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/store/Memory',
  'dojo/store/Observable',
  'dijit/tree/ObjectStoreModel',
  'jimu/dijit/_Tree',
  'dijit/registry',
  'esri/request',
  'jimu/dijit/Message',
  'jimu/dijit/LoadingIndicator',
  'jimu/utils',
  'jimu/LayerInfos/LayerInfos',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, lang, html,
 array, query, on, Deferred, all, Memory, Observable, ObjectStoreModel, Tree, registry, esriRequest,
 Message, LoadingIndicator, jimuUtils, LayerInfos, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString:'<div style="width:100%;">' +
      '<div class="error-tip-section">' +
        '<span class="error-icon"></span>' +
        '<span class="error-tip" data-dojo-attach-point="errTip">${nls.noLayersTip}</span>' +
      '</div>' +
    '</div>',
    _store: null,
    _id: 0,
    _treeClass: 'layer-chooser-tree',

    _leafType: '',//such as 'Feature Layer'
    _layerTypes: [],//such as ['esri.layers.FeatureLayer','esri.layers.ArcGISDynamicMapServiceLayer']

    //options:
    createMapResponse: null,//The response of method createMap.
    multiple: false,

    //public methods:
    //getSelectedItems

    //methods need to override:
    //getSelectedItems
    //_validateBeforeAddItem
    //_getIconImageName
    //_mayHaveChildren
    //_onTreeOpen
    //_onTreeClick

    //attributes:
    //tree

    //events:
    //tree-click

    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.basicLayerChooserFromMap;
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-layer-chooser-from-map');
      this.multiple = !!this.multiple;

      this.shelter = new LoadingIndicator({hidden:true});
      this.shelter.placeAt(this.domNode);
      this.shelter.startup();

      this._createTree();
      if(this.createMapResponse){
        this.setCreateMapResponse(this.createMapResponse);
      }
    },

    //to be override
    getSelectedItems: function(){
      var items = this.tree.getSelectedItems();
      return lang.mixin([],items);
    },

    setCreateMapResponse: function(createMapResponse){
      this.createMapResponse = createMapResponse;
      var map = this.createMapResponse.map;
      var mapItemInfo = this.createMapResponse.itemInfo;
      LayerInfos.getInstance(map, mapItemInfo).then(lang.hitch(this, function(layerInfosObj) {
        this.layerInfosObj = layerInfosObj;
        this.own(on(this.layerInfosObj, 'layerInfosChanged', lang.hitch(this, this._onLayerInfosChanged)));
        this._buildTree(this.layerInfosObj);
      }));
    },

    _onLayerInfosChanged: function(layerInfo, changedType){
      if(!layerInfo){
        return;
      }
      if(changedType === 'added'){
        this._addDirectLayerInfo(layerInfo);
      }
      else if(changedType === 'removed'){
        this._removeDirectLayerInfo(layerInfo);
      }
    },

    _addDirectLayerInfo: function(layerInfo){
      if(!layerInfo){
        return;
      }
      layerInfo.getLayerObject().then(lang.hitch(this, function(){
        var layerObject = layerInfo.layerObject;
        if(this._isLayerTypeSupported(layerObject.declaredClass)){
          this._addItem('root', layerInfo);
        }
      }),lang.hitch(this, function(err){
        console.error(err);
      }));
    },

    _removeDirectLayerInfo: function(layerInfo){
      if(!layerInfo){
        return;
      }
      var layerId = layerInfo.id;
      var tns = this.tree.getAllTreeNodeWidgets();
      var filteredTns = array.filter(tns, lang.hitch(this, function(tn){
        if(tn.item.id === 'root'){
          return false;
        }
        var item = tn.item;
        var id = item.layerInfo.id;
        return layerId === id;
      }));
      if(filteredTns.length > 0){
        var itemIds = array.map(filteredTns, lang.hitch(this, function(tn){
          return tn.item.id;
        }));
        array.forEach(itemIds, lang.hitch(this, function(itemId){
          this.tree.removeItem(itemId);
        }));
      }
    },

    _buildTree: function(layerInfosObj){
      this._clear();
      var layerInfos = layerInfosObj.getLayerInfoArray();
      if(layerInfos.length === 0){
        return;
      }
      array.forEach(layerInfos, lang.hitch(this, function(layerInfo){
        this._addDirectLayerInfo(layerInfo);
      }));
    },

    _getRestInfo:function(url){
      var args = {
        url: url,
        content: {f:"json"},
        handleAs: "json",
        callbackParamName: "callback",
        timeout: 20000
      };
      return esriRequest(args);
    },

    _clear:function(){
      var items = this._store.query({parent:'root'});
      array.forEach(items, lang.hitch(this,function(item){
        if(item && item.id !== 'root'){
          this._store.remove(item.id);
        }
      }));
    },

    _isLayerTypeSupported: function(type){
      return array.indexOf(this._layerTypes, type) >= 0;
    },

    //to be override
    _validateBeforeAddItem: function(layerInfo){
      return !!layerInfo;
    },

    _addItem: function(parentId, layerInfo){
      var item = null;
      var valid = this._validateBeforeAddItem(layerInfo);
      if(valid){
        this._id++;
        var type = layerInfo.layerObject.type||'UNKNOWN';
        item = {
          name: layerInfo.title,
          parent: parentId,
          layerInfo: layerInfo,
          type: type,
          layerClass: layerInfo.layerObject.declaredClass
        };
        item.id = this._id.toString();
        this._store.add(item);
      }
      return item;
    },

    _getRootItem:function(){
      return { id: 'root', name:'Map Root', type:'root'};
    },

    _createTree:function(){
      var rootItem = this._getRootItem();
      var myMemory = new Memory({
        data: [rootItem],
        getChildren: function(object){
          return this.query({parent: object.id});
        }
      });

      // Wrap the store in Observable so that updates to the store are reflected to the Tree
      this._store = new Observable(myMemory);

      var myModel = new ObjectStoreModel({
        store: this._store,
        query: { id: "root" },
        mayHaveChildren: lang.hitch(this, this._mayHaveChildren)
      });

      this.tree = new Tree({
        multiple: this.multiple,
        model: myModel,
        showRoot: false,
        leafType: this._leafType,
        style:{
          width: "100%"
        },
        onOpen: lang.hitch(this, function(item, node){
          if(item.id === 'root'){
            return;
          }
          this._onTreeOpen(item, node);
        }),
        onClick: lang.hitch(this, function(item, node, evt){
          this._onTreeClick(item, node, evt);
          this.emit('tree-click', item, node, evt);
        }),
        getIconStyle:lang.hitch(this,function(item, opened){
          var icon = null;
          if (!item || item.id === 'root') {
            return null;
          }
          var a = {
            width: "20px",
            height: "20px",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundImage: ''
          };
          var baseUrl = window.location.protocol + "//" + window.location.host + require.toUrl("jimu");
          var imageName = this._getIconImageName(item, opened);

          if(imageName){
            a.backgroundImage = "url("+baseUrl+"/css/images/" + imageName + ")";
            icon = a;
          }
          return icon;
        })
      });
      html.addClass(this.tree.domNode, this._treeClass);
      this.tree.placeAt(this.shelter.domNode, 'before');
    },

    //to be override
    _getIconImageName: function(item, opened){/*jshint unused: false*/},

    //to be override
    _mayHaveChildren: function(item){
      return item.type !== this._leafType;
    },

    //to be override
    _onTreeOpen: function(item, node){/*jshint unused: false*/},

    //to be override
    _onTreeClick: function(item, node, evt){/*jshint unused: false*/},

    destroy: function(){
      if(this.shelter){
        this.shelter.destroy();
        this.shelter = null;
      }
      this.inherited(arguments);
    }

  });
});