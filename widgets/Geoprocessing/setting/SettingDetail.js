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
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dojo/text!./SettingDetail.html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/TitlePane',
  'esri/request',
  'jimu/dijit/ViewStack',
  'jimu/dijit/LoadingShelter',
  './ParamSetting',
  './LayerOrder',
  './Options'
],
function(declare, lang, html, array, on, query, template, _WidgetBase, _TemplatedMixin, TitlePane, esriRequest,
  ViewStack, LoadingShelter, ParamSetting, LayerOrder, Options) {
  return declare([_WidgetBase,_TemplatedMixin], {
    baseClass: 'jimu-widget-setting-gp-detail',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
      
      this.paramSetting = new ParamSetting({
        map: this.map,
        nls: this.nls
      });
      this.layerOrder = new LayerOrder({nls: this.nls});
      this.options = new Options({nls: this.nls});

      this.viewStack = new ViewStack({
        viewType: 'dijit',
        views: [this.paramSetting, this.layerOrder, this.options]
      }, this.settingPaneNode);

      this.loadingCover = new LoadingShelter({hidden: true});
      this.loadingCover.placeAt(this.domNode);
      this.loadingCover.startup();
    },

    startup: function(){
      this.inherited(arguments);
      this.viewStack.startup();
    },

    setConfig: function(_config){
      var config = lang.clone(_config);
      this.hasInputParam = true;
      if(this.config && this.config.taskUrl === config.taskUrl){
        this.config = config;
        this._initNavPane();
      }else{
        this.config = config;
        this.loadingCover.show();
        var args = {
          url: this.config.taskUrl,
          content: {f: "json"},
          handleAs:"json",
          timeout:10000
        };

        esriRequest(args).then(lang.hitch(this, function(taskInfo){
          this.loadingCover.hide();
          this._changeTaskInfoToConfig(taskInfo);
          this._initNavPane();
        }));
      }
    },

    getConfig: function(){
      //paramSetting, layerOrder, options will update this.config directly,
      //so, return it
      this.paramSetting.acceptValue();
      this.layerOrder.acceptValue();
      this.options.acceptValue();
      return this.config;
    },

    _changeTaskInfoToConfig: function(taskInfo){
      var taskUrl = this.config.taskUrl;
      this.config = taskInfo;
      this.config.taskUrl = taskUrl;
      ///////
      if(this.config.executionType === 'esriExecutionTypeSynchronous'){
        this.config.isSynchronous = true;
      }else{
        this.config.isSynchronous = false;
      }
      delete this.config.executionType;

      this.config.inputParams = [];
      this.config.outputParams = [];
      this.config.shareResults = true;
      array.forEach(taskInfo.parameters, function(param){
        
        //////////
        param.label = param.displayName;
        delete param.displayName;

        //////
        if(param.direction === 'esriGPParameterDirectionInput'){
          this.config.inputParams.push(param);
        }else{
          this.config.outputParams.push(param);
        }
        delete param.direction;

        ///////
        param.visible = true;

        //////////////
        if(param.parameterType === 'esriGPParameterTypeRequired'){
          param.required = true;
        }else{
          param.required = false;
        }
        delete param.parameterType;

        /////set the default input type
        if(param.dataType === 'GPFeatureRecordSetLayer'){
          param.featureSetMode = 'draw';
        }
      }, this);
      delete this.config.parameters;
    },

    _initNavPane: function(){
      html.empty(this.navPaneNode);
      
      this._createParamsSection('input');
      this._createParamsSection('output');
      this._createLayerOrderNode();
      this._createOptionsNode();

      this.layerOrder.setConfig(this.config);
      this.options.setConfig(this.config);

      //the paramSetting needs inputParams because that the editor chooser needs the inputParams
      this.paramSetting.setInputParams(this.config.inputParams);
    },

    _onParamClick: function(param, direction, evt){
      this._setActiveLinkNode(evt.currentTarget);
      //accept the current input values
      if(this.paramSetting.param){
        this.paramSetting.acceptValue();
      }

      this.viewStack.switchView(this.paramSetting);
      this.paramSetting.setParam(param, direction);
    },

    _setActiveLinkNode: function(node){
      query('.jimu-state-active', this.domNode).removeClass('jimu-state-active');
      html.addClass(node, 'jimu-state-active');
    },

    _createParamsSection: function(direction){
      var nodes = html.create('div', {
        'class': 'nodes'
      });
      var titlePane = new TitlePane({
        title: this.nls[direction],
        content: nodes,
        open: direction === 'input'
      });
      titlePane.placeAt(this.navPaneNode);
      var params = direction === 'input'? this.config.inputParams: this.config.outputParams;

      if(direction === 'input' && params.length === 0){
        this.hasInputParam = false;
      }
      array.forEach(params, function(param, i){
        var node = this._createParamLinkNode(param, direction, nodes);
        //select the first one by default
        if(this.hasInputParam && i === 0 && direction === 'input' || //first input param
          this.hasInputParam === false && i === 0 && direction === 'output'){//first output param
          if(node.click){
            node.click();
          }else{
            on.emit(node, 'click', {
              cancelable: true,
              bubble: true
            });
          }
        }
        
      }, this);
    },

    _createParamLinkNode: function(param, direction, containerNode){
      var node = html.create('div', {
        'class': 'link-action-node param-node'
      }, containerNode);
      html.create('div', {
        innerHTML: '<span>' + this.nls.name + ':</span><span style="margin-left: 2px">' + param.name + '</span>'
      }, node);
      html.create('div', {
        innerHTML: '<span>' + this.nls.type + ':</span><span style="margin-left: 2px">' + param.dataType + '</span>'
      }, node);
      html.create('div', {
        innerHTML: '<span>' + this.nls.required + ':</span><span style="margin-left: 2px">' + param.required + '</span>'
      }, node);

      this.own(on(node, 'click', lang.hitch(this, this._onParamClick, param, direction)));
      return node;
    },

    _createLayerOrderNode: function(){
      var node = html.create('div', {
        'class': 'link-action-node nav-pane-node layer-order-node',
        innerHTML: this.nls.layerOrder
      }, this.navPaneNode);
      this.own(on(node, 'click', lang.hitch(this, function(){
        this._setActiveLinkNode(node);
        this.viewStack.switchView(this.layerOrder);
      })));
    },

    _createOptionsNode: function(){
      var node = html.create('div', {
        'class': 'link-action-node nav-pane-node options-node',
        innerHTML: this.nls.options
      }, this.navPaneNode);
      this.own(on(node, 'click', lang.hitch(this, function(){
        this._setActiveLinkNode(node);
        this.viewStack.switchView(this.options);
      })));
    }

  });
});