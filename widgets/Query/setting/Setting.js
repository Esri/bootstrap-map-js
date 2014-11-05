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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/query',
  'dojo/on',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/TabContainer',
  'jimu/dijit/SimpleTable',
  './FeaturelayerSourcePopup',
  './SingleQuerySetting',
  'esri/request'
],
function(declare, lang, array, html, query, on, _WidgetsInTemplateMixin, BaseWidgetSetting,
  TabContainer, SimpleTable, FeaturelayerSourcePopup, SingleQuerySetting, esriRequest) {/*jshint unused: false*/
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-query-setting',
    currentSQS: null,

    postCreate:function(){
      this.inherited(arguments);

      if(this.config){
        this.setConfig(this.config);
      }
    },

    setConfig:function(config){
      if(this.currentSQS){
        this.currentSQS.destroy();
      }
      this.currentSQS = null;
      this.queryList.clear();

      this.config = config;
      var queries = this.config && this.config.queries;
      var validConfig = queries && queries.length >= 0;
      if(validConfig){
        array.forEach(queries,lang.hitch(this, function(singleConfig, index){
          var addResult = this.queryList.addRow({name: singleConfig.name || ''});
          var tr = addResult.tr;
          tr.singleConfig = lang.clone(singleConfig);
          if(index === 0){
            this.queryList.selectRow(tr);
          }
        }));
      }
    },

    getConfig: function () {
      if(this.currentSQS){
        var currentSingleConfig = this.currentSQS.getConfig();
        if(currentSingleConfig){
          this.currentSQS.tr.singleConfig = lang.clone(currentSingleConfig);
        }
        else{
          return false;
        }
      }
      var config = {
        queries:[]
      };
      var trs = this.queryList.getRows();
      for(var i = 0; i < trs.length; i++){
        var tr = trs[i];
        config.queries.push(lang.clone(tr.singleConfig));
      }
      this.config = lang.clone(config);
      return config;
    },

    _createSingleQuerySetting:function(tr){
      var args = {
        map: this.map,
        nls: this.nls,
        config: tr.singleConfig,
        tr: tr,
        _layerDefinition: tr._layerDefinition
      };
      this.currentSQS = new SingleQuerySetting(args);
      this.currentSQS.placeAt(this.singleQueryContainer);

      this.own(on(this.currentSQS,'name- change', lang.hitch(this, function(queryName){
        this.queryList.editRow(tr, {name: queryName});
      })));

      this.own(on(this.currentSQS, 'show-shelter', lang.hitch(this, function(){
        this.shelter.show();
      })));

      this.own(on(this.currentSQS, 'hide-shelter', lang.hitch(this, function(){
        this.shelter.hide();
      })));

      //first bind event, then setConfig, don't startup here
      this.currentSQS.setConfig(this.currentSQS.config);
      
      return this.currentSQS;
    },

    _addNewQueryItem:function(name){
      var addResult = this.queryList.addRow({name:name||''});
      return addResult.tr;
    },

    _onAddNewClicked:function(){
      if(this.currentSQS){
        var singleConfig = this.currentSQS.getConfig();
        if(singleConfig){
          this.currentSQS.tr.singleConfig = singleConfig;
          this.currentSQS.destroy();
          this.currentSQS = null;
        }
        else{
          return;
        }
      }

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

        //var queryName = this._getSuitableQueryName(item.name);
        var queryName = item.name||"";
        var addResult = this.queryList.addRow({name: queryName});
        if (addResult.success) {
          var tr = addResult.tr;
          this.queryList.selectRow(tr);
          if(this.currentSQS){
            this.currentSQS.setNewLayerDefinition(item.name, item.url, item.definition, queryName);
          }
        }
      })));

      this.own(on(featurePopup, 'cancel', lang.hitch(this, function(){
        featurePopup.close();
      })));

      featurePopup.startup();
    },

    _getSuitableQueryName: function(name){
      var finalName = name;
      var data = this.queryList.getData();
      var allNames = array.map(data, lang.hitch(this, function(rowData){
        return rowData.name;
      }));

      var flag = 2;
      while(array.indexOf(allNames, finalName) >= 0){
        name += ' ' + flag;
        flag++;
      }

      return name;
    },

    _onQueryItemRemoved:function(tr){
      if(this.currentSQS){
        if(this.currentSQS.tr === tr){
          this.currentSQS.destroy();
          this.currentSQS = null;
        }
      }
    },

    _onQueryItemSelected:function(tr){
      if(this.currentSQS){
        if(this.currentSQS.tr !== tr){
          var singleConfig = this.currentSQS.getConfig();
          if(singleConfig){
            this.currentSQS.tr.singleConfig = singleConfig;
            this.currentSQS.destroy();
            this.currentSQS = null;
            this._createSingleQuerySetting(tr);
          }
          else{
            this.queryList.selectRow(this.currentSQS.tr);
          }
        }
      }
      else{
        this._createSingleQuerySetting(tr);
      }
    }
    
  });
});