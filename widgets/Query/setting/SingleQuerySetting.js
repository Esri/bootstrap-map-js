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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./SingleQuerySetting.html',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/query',
  'dojo/on',
  'dojo/Evented',
  'dijit/form/ValidationTextBox',
  'jimu/utils',
  'jimu/dijit/Filter',
  'jimu/dijit/TabContainer3',
  'jimu/dijit/Popup',
  'jimu/dijit/Message',
  'jimu/dijit/LoadingShelter',
  'jimu/dijit/SymbolPicker',
  './FeaturelayerSourcePopup',
  './PopupConfig',
  'esri/request',
  'esri/symbols/jsonUtils'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang,
  array, html, query, on, Evented, ValidationTextBox, jimuUtils, Filter, TabContainer3,
  Popup, Message, LoadingShelter, SymbolPicker, FeaturelayerSourcePopup, PopupConfig,
  esriRequest, esriSymbolJsonUtils) {/*jshint unused: false*/
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    baseClass: 'jimu-widget-single-query-setting',
    templateString: template,
    map: null,
    nls: null,
    tr: null,

    _layerDefinition: null,//include url

    //public methods:
    //setNewLayerDefinition
    //setConfig
    //getConfig

    postCreate:function(){
      this.inherited(arguments);
      this._initSelf();
    },

    destroy:function(){
      this.tr = null;
      delete this.tr;
      this.inherited(arguments);
    },

    setConfig:function(config){
      this.config = config;
      if(!this._isObject(this.config)){
        return;
      }
      var url = config.url||'';
      var validUrl = url && typeof url === 'string';
      if(!validUrl){
        return;
      }

      if(this._layerDefinition && this._layerDefinition.url === url){
        this.tab.hideShelter();
        this._resetByConfig(this.config, this._layerDefinition);
      }
      else{
        this._layerDefinition = null;
        this.showBigShelter();
        var def = esriRequest({
          url: url,
          handAs: 'json',
          content:{f:'json'},
          callbackParamName:'callback'
        });
        def.then(lang.hitch(this,function(response){
          if(!this.domNode){
            return;
          }
          this.hideBigShelter();
          this.tab.hideShelter();
          this._layerDefinition = response;
          this._layerDefinition.url = url;
          this._resetByConfig(this.config, this._layerDefinition);
        }),lang.hitch(this,function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.hideBigShelter();
        }));
      }
    },

    getConfig: function () {
      var config = {
        name:'',
        url:'',
        filter:{
          useFilter:'',
          filterInfo:''
        },
        popup: '',
        resultsSymbol:'',
        objectIdField:''
      };

      if(!this._layerDefinition){
        this.scrollToDom(this.generalTable);
        new Message({message: this.nls.setSourceTip});
        return null;
      }
      config.url = this._layerDefinition.url;

      if(!this.queryNameTextBox.validate()){
        this.showValidationErrorTip(this.queryNameTextBox);
        return null;
      }
      config.name = this.queryNameTextBox.get('value');

      var filterObj = this.filter.toJson();
      if (!filterObj || !filterObj.expr) {
        new Message({
          message: this.nls.setFilterTip
        });
        return null;
      }
      config.filter = filterObj;

      var popup = this.popupConfig.getConfig();
      if(!popup){
        return null;
      }
      config.popup = popup;

      var sym1 = this.layerSymbolPicker.getSymbol();
      if(sym1){
        config.resultsSymbol = sym1.toJson();
      }

      if(this._layerDefinition.objectIdField){
        config.objectIdField = this._layerDefinition.objectIdField;
      }
      else{
        var oidFieldInfos = array.filter(this._layerDefinition.fields,lang.hitch(this,function(fieldInfo){
          return fieldInfo.type === 'esriFieldTypeOID';
        }));
        if(oidFieldInfos.length > 0){
          var oidFieldInfo = oidFieldInfos[0];
          config.objectIdField = oidFieldInfo.name;
        }
      }

      this.tr._layerDefinition = this._layerDefinition;
      
      return config;
    },

    scrollToDom: function(_dom){
      var y1 = html.coords(_dom).y;
      var y2 = html.coords(this.domNode).y;
      var value = y1 - y2;
      this.domNode.parentNode.scrollTop = value;
    },

    showValidationErrorTip:function(_dijit){
      if (!_dijit.validate() && _dijit.domNode) {
        if (_dijit.focusNode) {
          _dijit.focusNode.focus();
          setTimeout(lang.hitch(this, function() {
            _dijit.focusNode.blur();
          }), 100);
        }
      }
    },

    showBigShelter: function(){
      // this.shelter.show();
      this.emit("show-shelter");
    },

    hideBigShelter: function(){
      // this.shelter.hide();
      this.emit("hide-shelter");
    },

    showQueryDefinition:function(){
      this.tab.selectTab(this.nls.queryDefinition);
    },

    showResultsSetting:function(){
      this.tab.selectTab(this.nls.resultsSetting);
    },

    _initSelf:function(){
      this._initPopupConfig();
      this._initTabs();
    },

    _initTabs:function(){
      var tabDefinition = {
        title: this.nls.queryDefinition,
        content: this.definitionTabNode
      };

      var tabResults = {
        title: this.nls.resultsSetting,
        content: this.resultsTabNode
      };

      var tabs = [tabDefinition, tabResults];
      var args = {
        tabs: tabs
      };
      this.tab = new TabContainer3(args);
      this.tab.placeAt(this.detailSection);
      this.tab.showShelter();
    },

    _initPopupConfig:function(){
      var args = {
        nls: this.nls,
        sqs: this
      };
      this.popupConfig = new PopupConfig(args);
      this.popupConfig.placeAt(this.popupContainer);
    },

    _getRandomString:function(){
      var str = Math.random().toString();
      str = str.slice(2,str.length);
      return str;
    },

    _onQueryNameChanged:function(){
      this.emit('name-change',this.queryNameTextBox.get('value'));
    },

    _clear: function(){
      this.urlTextBox.set('value','');
      this._layerDefinition = null;
      this.queryNameTextBox.set('value','');
      this.filter.reset();
      this.tab.showShelter();
      this.popupConfig.clear();
      this.layerSymbolPicker.reset();
    },

    _onBtnSetSourceClicked: function(){
      var args = {
        titleLabel: this.nls.setQuerySource,

        featureArgs: {
          multiple: false,
          createMapResponse: this.map.webMapResponse,
          appConfig: {
            portalUrl: window.portalUrl,
            appId: ''
          },
          style: {
            height: '100%'
          }
        }
      };

      var featurePopup = new FeaturelayerSourcePopup(args);
      this.own(on(featurePopup, 'ok', lang.hitch(this, function(item){
        //{name, url, definition}
        featurePopup.close();
        this.setNewLayerDefinition(item.name, item.url, item.definition);
      })));
      this.own(on(featurePopup, 'cancel', lang.hitch(this, function(){
        featurePopup.close();
      })));

      featurePopup.startup();
    },

    setNewLayerDefinition: function(name, url, definition, /* optional */ queryName){
      definition.name = name;
      definition.url = url;
      var oldUrl = this._layerDefinition && this._layerDefinition.url;
      if (url !== oldUrl) {
        this._resetByNewLayerDefinition(definition, queryName);
      }
    },

    _resetByNewLayerDefinition:function(layerInfo, /* optional */ queryName){
      this._clear();
      if(!layerInfo){
        return;
      }
      this._layerDefinition = layerInfo;
      this.urlTextBox.set('value',layerInfo.url);
      this.queryNameTextBox.set('value', queryName || layerInfo.name);
      this.tab.hideShelter();

      //reset filter
      this.filter.reset();
      if(this._layerDefinition){
        this.filter._layerDefinition = this._layerDefinition;
        this.filter.url = this._layerDefinition.url;
        this.filter.build();
      }

      //reset popupConfig
      var fields = array.map(layerInfo.fields,lang.hitch(this,function(fieldInfo){
        var item = lang.mixin({},fieldInfo);
        item.visible = false;
        item.specialType = 'none';
        return item;
      }));
      var popupTitle = '';
      if(layerInfo.displayField){
        popupTitle = '${'+layerInfo.displayField+'}';
      }
      this.popupConfig.setConfig({
        title: popupTitle,
        fields: fields
      });
      
      //reset symbol
      var geoType = jimuUtils.getTypeByGeometryType(layerInfo.geometryType);
      var symType = '';
      if(geoType === 'point'){
        symType = 'marker';
      }
      else if(geoType === 'polyline'){
        symType = 'line';
      }
      else if(geoType === 'polygon'){
        symType = 'fill';
      }
      if(symType){
        this.layerSymbolPicker.showByType(symType);
      }
    },

    _resetByConfig:function(cfg, layerInfo){
      var config = lang.mixin({},cfg);
      this.urlTextBox.set('value',config.url);
      this.queryNameTextBox.set('value',config.name||'');

      //reset filter
      var filterInfo = config.filter;
      if(!this._isObject(filterInfo)){
        return;
      }
      this.filter.reset();
      this.filter.url = layerInfo.url;
      this.filter._layerDefinition = layerInfo;

      if (this._isObject(filterInfo)) {
        this.filter.buildByFilterObj(filterInfo);
      } else {
        this.filter.build();
      }

      //reset popupConfig
      this.popupConfig.clear();
      if(this._isObject(config.popup)){
        var fields = [];
        if(config.popup.fields && config.popup.fields.length > 0){
          var visibleFieldInfos = array.filter(config.popup.fields,lang.hitch(this,function(fieldInfo){
            return fieldInfo.showInInfoWindow;
          }));
          var visibleFieldNames = array.map(visibleFieldInfos,lang.hitch(this,function(fieldInfo){
            return fieldInfo.name;
          }));
          fields = array.map(layerInfo.fields,lang.hitch(this,function(fieldInfo){
            var item;
            var index = visibleFieldNames.indexOf(fieldInfo.name);
            if(index >= 0){
              var configFieldInfo = visibleFieldInfos[index];
              item = lang.mixin({},configFieldInfo);
              item.visible = true;
            }
            else{
              item = lang.mixin({},fieldInfo);
              item.specialType = 'none';
              item.visible = false;
            }

            return item;
          }));
        }
        this.popupConfig.setConfig({
          title: config.popup.title,
          fields: fields
        });
      }

      //reset symbol
      var sym1 = esriSymbolJsonUtils.fromJson(config.resultsSymbol);
      this.layerSymbolPicker.showBySymbol(sym1);
    },

    _isObject:function(o){
      return o && typeof o === 'object';
    }
    
  });
});