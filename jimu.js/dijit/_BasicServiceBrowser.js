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
  'jimu/dijit/LoadingShelter',
  'jimu/utils',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, lang, html,
 array, query, on, Deferred, all, Memory, Observable, ObjectStoreModel, Tree, registry, esriRequest,
 Message, LoadingShelter, jimuUtils, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString:'<div style="width:100%;"><div data-dojo-attach-point="shelter" '+
    ' data-dojo-type="jimu/dijit/LoadingShelter" data-dojo-props="hidden:true"></div></div>',
    _store: null,
    _id: 0,
    _currentUrl: '',
    _treeClass: 'service-browser-tree',

    _leafType:'',
    _serviceTypes:'',//such as['MapServer','FeatureServer'] or ['GPServer']...
    _def: null,

    //options:
    url:'',
    multiple: false,
    

    //test urls
    //https://gis.lmi.is/arcgis/rest/services
    //https://gis.lmi.is/arcgis/rest/services/GP_service
    //https://gis.lmi.is/arcgis/rest/services/GP_service/geocode_thjonusta_single/GeocodeServer
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services

    //public methods:
    //setUrl
    //getSelectedItems

    //methods need to override:
    //getSelectedItems
    //_searchServiceUrlCallback
    //_searchChildResource
    //_getIconImageName
    //_mayHaveChildren
    //_onTreeOpen
    //_onTreeClick

    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.basicServiceBrowser;
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-service-browser');
      this.multiple = !!this.multiple;
      this._createTree();
      if(this.url && typeof this.url === 'string'){
        this.setUrl(this.url);
      }
    },

    //to be override
    getSelectedItems: function(){
      var items = this.tree.getSelectedItems();
      return lang.mixin([],items);
    },

    setUrl:function(url){
      if(this._def){
        if(!this._def.isFulfilled()){
          this._def.cancel();
        }
        this._def = null;
      }
      this._def = new Deferred();

      var validUrl = url && typeof url === 'string' && url.replace(/\/*$/g, '');
      if(!validUrl){
        setTimeout(lang.hitch(this, function(){
          this._def.reject();
        }), 0);
      }
      url = url.replace(/\/*$/g, '');

      var theUrl = lang.trim(url);
      var pattern1 = /^http(s?):\/\//gi;
      var matchResult = theUrl.match(pattern1);
      if(!(matchResult && matchResult.length > 0)){
        theUrl = 'http://'+theUrl;
      }
      
      var pattern2 = /\/rest\/services/i;
      if(theUrl.search(pattern2) <= 0){
        setTimeout(lang.hitch(this, function(){
          this._def.reject();
        }), 0);
        return;
      }
      
      /*if(this._currentUrl === theUrl){
        return;
      }*/

      this._clear();
      this._currentUrl = theUrl;
      if(!this._currentUrl){
        setTimeout(lang.hitch(this, function(){
          this._def.reject();
        }), 0);
        return;
      }
      var root = this._getRootItem();
      var requestDef;
      if(this._isStringEndWith(this._currentUrl,'rest/services')){
        //rest/services
        var baseUrl = this._currentUrl;
        requestDef = this._searchBaseServiceUrl(baseUrl, root);
      }
      else if(!this._isUrlContainsServiceType(this._currentUrl)){
        //folder
        var folderUrl = this._currentUrl;
        requestDef = this._searchFolderServiceUrl(folderUrl, root);
      }
      else{
        if(this._isUrlEndWithServiceType(this._currentUrl)){
          //service
          var serviceUrl = this._currentUrl;
          requestDef = this._searchServiceUrl(serviceUrl, root, true);
        }
        else{
          //child resource
          var childUrl = this._currentUrl;
          requestDef = this._searchChildResource(childUrl, root, true);
        }
      }

      requestDef.then(lang.hitch(this, function(response){
        var tns = this.tree.getAllLeafTreeNodeWidgets();
        if(tns.length === 1){
          var tn = tns[0];
          tn.select();
        }
        this._def.resolve(response);
      }),lang.hitch(this, function(err){
        var netErr = err && err.errorCode && err.errorCode === 'NETWORK_ERROR';
        if(netErr){
          this._showRequestError();
        }
        this._def.reject(err);
      }));

      return this._def;
    },

    _isServiceTypeSupported: function(type){
      return array.indexOf(this._serviceTypes,type) >= 0;
    },

    _getStringEndWith:function(str, endStr){
      var result = '';
      var index = str.indexOf(endStr);
      if(index >= 0){
        var a = index + endStr.length;
        result = str.slice(0,a);
      }
      return result;
    },

    _isUrlContainsServiceType: function(url){
      return array.some(this._serviceTypes, lang.hitch(this, function(type){
        return url.indexOf('/'+type) >= 0;
      }));
    },

    _isUrlEndWithServiceType: function(url){
      return array.some(this._serviceTypes, lang.hitch(this, function(type){
        return this._isStringEndWith(url,'/'+type);
      }));
    },

    _getBaseServiceUrl:function(){
      return this._getStringEndWith(this._currentUrl,'rest/services');
    },

    _getServiceName:function(serviceName){
      var result = '';
      var splits = serviceName.split('/');
      result = splits[splits.length-1];
      return result;
    },

    _searchBaseServiceUrl:function(baseUrl, root){
      //url is end with 'rest/services'
      this.shelter.show();
      var resultDef = new Deferred();
      this._getRestInfo(baseUrl).then(lang.hitch(this, function(response){
        if(!this.domNode){
          return;
        }
        array.forEach(response.services, lang.hitch(this, function(service){
          if(this._isServiceTypeSupported(service.type)){
            var item = {
              name: this._getServiceName(service.name),
              type: service.type,
              url: baseUrl+'/'+service.name+'/'+service.type,
              parent: root.id
            };
            this._addItem(item);
          }
        }));
        var folders = array.map(response.folders,lang.hitch(this,function(folderName){
          return {
            name: folderName,
            type:'folder',
            url: baseUrl+"/"+folderName,
            parent: root.id
          };
        }));

        if(folders.length === 0){
          this.shelter.hide();
          resultDef.resolve();
          return;
        }
        var defs = array.map(folders,lang.hitch(this,function(folder){
          return this._getRestInfo(folder.url);
        }));
        all(defs).then(lang.hitch(this,function(responses){
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          array.forEach(responses,lang.hitch(this,function(response,index){
            var folder = folders[index];
            var specificServices = array.filter(response.services,lang.hitch(this,function(service){
              return this._isServiceTypeSupported(service.type);
            }));
            if(specificServices.length > 0){
              folder = this._addItem(folder);
              array.forEach(specificServices,lang.hitch(this,function(service){
                var item = {
                  name: this._getServiceName(service.name),
                  type: service.type,
                  url: baseUrl+'/'+service.name+'/'+service.type,
                  parent: folder.id
                };
                //service.name:Demographics/ESRI_Census_USA
                this._addItem(item);
              }));
            }
          }));
          resultDef.resolve();
        }),lang.hitch(this,function(error){
          console.error(error);
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          resultDef.resolve();
        }));
      }),lang.hitch(this,function(err){
        console.error('request layer info failed',err);
        if(!this.domNode){
          return;
        }
        this.shelter.hide();
        var errObj = {
          errorCode: 'NETWORK_ERROR',
          error: err
        };
        resultDef.reject(errObj);
      }));
      return resultDef;
    },

    _searchFolderServiceUrl:function(folderUrl, parent){
      //url is end with folder name
      //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics
      var resultDef = new Deferred();
      var baseUrl = this._getBaseServiceUrl();
      this.shelter.show();
      this._getRestInfo(folderUrl).then(lang.hitch(this,function(folderResponse){
        if(!this.domNode){
          return;
        }
        this.shelter.hide();
        if(folderResponse.services && folderResponse.services.length > 0){
          array.forEach(folderResponse.services,lang.hitch(this, function(service){
            if(this._isServiceTypeSupported(service.type)){
              var item = {
                name: this._getServiceName(service.name),
                type: service.type,
                url: baseUrl+'/'+service.name+'/'+service.type,
                parent: parent.id
              };
              //service.name:Demographics/ESRI_Census_USA
              this._addItem(item);
            }
          }));
        }
        resultDef.resolve();
      }),lang.hitch(this,function(err){
        console.error(err);
        if(!this.domNode){
          return;
        }
        this.shelter.hide();
        var errObj = {
          errorCode: 'NETWORK_ERROR',
          error: err
        };
        resultDef.reject(errObj);
      }));
      return resultDef;
    },

    _searchServiceUrl:function(serviceUrl, parent){
      //serviceUrl is end with 'MapServer' or 'FeatureServer' ...
      //serviceUrl: http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer
      var resultDef = new Deferred();
      serviceUrl = serviceUrl.replace(/\/*$/g, '');
      var splits = serviceUrl.split('/');
      var serviceType = splits[splits.length-1];
      var serviceName = splits[splits.length-2];
      this.shelter.show();
      this._getRestInfo(serviceUrl).then(lang.hitch(this,function(serviceMeta){
        if(!this.domNode){
          return;
        }
        serviceMeta.url = serviceUrl;
        this.shelter.hide();
        var serviceItem = {
          name: serviceName,
          type: serviceType,
          url: serviceUrl,
          parent: parent.id
        };
        serviceItem = this._addItem(serviceItem);
        var callbackDef = this._searchServiceUrlCallback(serviceUrl, serviceItem, serviceMeta);
        callbackDef.then(lang.hitch(this, function(){
          if(!this.domNode){
            return;
          }
          resultDef.resolve();
        }), lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
        }));
      }),lang.hitch(this,function(err){
        console.error(err);
        if(!this.domNode){
          return;
        }
        this.shelter.hide();
        var errObj = {
          errorCode: 'NETWORK_ERROR',
          error: err
        };
        resultDef.reject(errObj);
      }));
      return resultDef;
    },

    //to be override, return a deferred
    _searchServiceUrlCallback: function(serviceUrl, serviceItem, serviceMeta){/*jshint unused: false*/
      var def = new Deferred();
      setTimeout(lang.hitch(this, function(){
        def.resolve();
      }), 0);
      return def;
    },

    //to be override, return a deferred
    _searchChildResource: function(url, parent, /* optional */ showError){/*jshint unused: false*/
      var def = new Deferred();
      setTimeout(lang.hitch(this, function(){
        def.resolve();
      }), 0);
      return def;
    },

    _getRestInfo:function(url){
      var args = {
        url:url,
        content:{f:"json"},
        handleAs:"json",
        callbackParamName:"callback",
        timeout:20000
      };
      return esriRequest(args);
    },

    _isStringEndWith:function(s,endS){
      return (s.lastIndexOf(endS) + endS.length === s.length);
    },

    _clear:function(){
      var items = this._store.query({parent:'root'});
      array.forEach(items, lang.hitch(this,function(item){
        if(item && item.id !== 'root'){
          this._store.remove(item.id);
        }
      }));
    },

    _showRequestError:function(){
      new Message({
        message: this.nls.unableConnectTo + " " + this._currentUrl
      });
    },

    //item:{name,type,url,parent}
    //type:root,folder,[MapServer,FeatureServer,...]
    _addItem:function(item){
      this._id++;
      item.id = this._id.toString();
      this._store.add(item);
      return item;
    },

    _getRootItem:function(){
      return { id: 'root', name:'Services Root', type:'root'};
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
          width:"100%"
        },
        onOpen: lang.hitch(this, this._onTreeOpen),
        onClick: lang.hitch(this, this._onTreeClick),
        getIconStyle:lang.hitch(this,function(item, opened){
          var icon = null;
          if (!item) {
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
          var imageName = '';
          if (item.type === 'folder') {
            if (opened) {
              imageName = 'folder_open.png';
            } else {
              imageName = 'folder_close.png';
            }
          }
          else if(this._isServiceTypeSupported(item.type)){
            imageName = 'toolbox.png';
          }
          else{
            imageName = this._getIconImageName(item, opened);
          }
          if(imageName){
            a.backgroundImage = "url("+baseUrl+"/css/images/" + imageName + ")";
            icon = a;
          }
          return icon;
        })
      });
      html.addClass(this.tree.domNode, this._treeClass);
      // this.own(on(this.tree,'item-select', lang.hitch(this, function(args){
      //   //{item,treeNode}
      //   this.emit('item-select', args);
      // })));
      // this.own(on(this.tree,'item-unselect', lang.hitch(this, function(args){
      //   //{item,treeNode}
      //   this.emit('item-unselect', args);
      // })));
      this.tree.placeAt(this.domNode);
    },

    //to be override
    _getIconImageName: function(item, opened){/*jshint unused: false*/},

    //to be override
    _mayHaveChildren:function(item){
      return item.type !== this._leafType;
    },

    //to be override
    _onTreeOpen:function(item, node){/*jshint unused: false*/},

    //to be override
    _onTreeClick:function(item, node, evt){/*jshint unused: false*/},

    destroy:function(){
      if(this.shelter){
        this.shelter.destroy();
        this.shelter = null;
      }
      this.inherited(arguments);
    }

  });
});