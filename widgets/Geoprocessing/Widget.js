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
  'dojo/on',
  'dojo/Deferred',
  'dojo/promise/all',
  "dojo/store/Memory",
  'dijit/_WidgetBase',
  'dijit/form/Select',
  'jimu/BaseWidget',
  'jimu/dijit/TabContainer',
  'jimu/dijit/LoadingIndicator',
  'jimu/dijit/Message',
  './editorManager',
  './resultRendererManager',
  'esri/tasks/Geoprocessor',
  'esri/tasks/JobInfo',
  'esri/layers/ImageParameters',
  'esri/request',
  'esri/geometry/Extent',
  'esri/graphicsUtils'
],
function(declare, lang, array, html, on, Deferred, all, Memory, _WidgetBase, Select,
  BaseWidget, TabContainer, LoadingIndicator, Message, editorManager, resultRendererManager,
  Geoprocessor, JobInfo, ImageParameters, esriRequest, Extent, graphicsUtils) {
  var clazz = declare([BaseWidget], {
    //these two properties is defined in the BaseWidget
    baseClass: 'jimu-widget-geoprocessing',
    name: 'Geoprocessing',

    startup: function(){
      this.inputNodes = [];

      //each result will be displayed by dijit
      this.resultNodes = [];
      this.resultLayers = [];

      editorManager.setMap(this.map);
      editorManager.setNls(this.nls);

      resultRendererManager.setMap(this.map);
      resultRendererManager.setNls(this.nls);
      resultRendererManager.setConfig(this.config);

      this.gp = new Geoprocessor(this.config.taskUrl);
      this.gp.setOutSpatialReference(this.map.spatialReference);

      if(this.config.updateDelay){
        this.gp.setUpdateDelay(this.config.updateDelay);
      }

      this.tab = new TabContainer({
        tabs: [{
          title: this.nls.input,
          content: this.inputPaneNode
        }, {
          title: this.nls.output,
          content: this.outputPaneNode
        }],
        selected: this.nls.input
      });
      this.tab.placeAt(this.domNode);
      this.tab.startup();

      this.loading = new LoadingIndicator({
        hidden: true
      }, this.loadingNode);
      this.loading.startup();

      this.own(on(this.gp, 'execute-complete', lang.hitch(this, this.onExecuteComplete)));
      this.own(on(this.gp, 'job-complete', lang.hitch(this, this.onJobComplete)));
      this.own(on(this.gp, 'job-cancel', lang.hitch(this, this.onJonCancel)));
      this.own(on(this.gp, 'status-update', lang.hitch(this, this.onStatusUpdate)));
      this.own(on(this.gp, 'get-result-data-complete', lang.hitch(this, this.onGetResultDataComplate)));
      this.own(on(this.gp, 'get-result-image-layer-complete', lang.hitch(this, this.onGetResultImageLayerComplate)));
      this.own(on(this.gp, 'error', lang.hitch(this, this.onError)));

      html.setAttr(this.helpLinkNode, 'href', this.config.helpUrl);

      this._createInputNodes();
    },

    executeGP: function(){
      this._clearLastResult();
      this._getInputParamValues().then(lang.hitch(this, function(inputValues){
        this._showLoading();

        html.addClass(this.exeNode, 'jimu-state-disabled');

        if(this.config.isSynchronous){
          this.gp.execute(inputValues);
        }else{
          this.gp.submitJob(inputValues);
        }
        this.tab.selectTab(this.nls.output);
      }));
    },

    onExecuteComplete: function(results){
      this._hideLoading();
      //the results.results is an array of ParameterValue, because it contains one or more parameters
      this._createOutputNodes(results.results);

      html.removeClass(this.exeNode, 'jimu-state-disabled');
    },

    onJobComplete: function(jobInfo){
      this._hideLoading();
      this.jobId = '';

      html.removeClass(this.exeNode, 'jimu-state-disabled');

      if(this.config.useResultMapServer){
        //only when GP task is async and the GP service publish the result map service,
        //the option "useResultMapServer" may be true. This will be guaranteed in builder
        var imageParameters = new ImageParameters({
          imageSpatialReference: this.map.spatialReference
        });
        array.forEach(this.config.outputParams, function(param){
          if(['GPFeatureRecordSetLayer', 'GPRasterDataLayer', 'GPRecordSet'].indexOf(param.dataType) > -1){
            this.gp.getResultImageLayer(jobInfo.jobInfo.jobId, param.name, imageParameters);
          }
        }, this);
        array.forEach(this.config.outputParams, function(param){
          if(['GPFeatureRecordSetLayer', 'GPRasterDataLayer', 'GPRecordSet'].indexOf(param.dataType) <= -1){
            this.gp.getResultData(jobInfo.jobInfo.jobId, param.name);
          }
        }, this);
      }else{
        array.forEach(this.config.outputParams, function(param){
          this.gp.getResultData(jobInfo.jobInfo.jobId, param.name);
        }, this);
      }
    },

    onJonCancel: function(){
      this.loading.hide();
      this.infoTextNode.innerHTML = 'Canceled';

      html.removeClass(this.exeNode, 'jimu-state-disabled');
      this.jobId = '';
    },

    onStatusUpdate: function(jobInfo){
      this.jobId = jobInfo.jobInfo.jobId;
      if(jobInfo.jobInfo.jobStatus === JobInfo.STATUS_SUCCEEDED){
        this._hideLoading();
      }else{
        this._showLoading(jobInfo.jobInfo.jobStatus);
      }
    },

    onGetResultDataComplate: function(result){
      //the result.result contains only one ParameterValue
      this._createOutputNode(this._getOutputParamByName(result.result.paramName), result.result);
    },

    onGetResultImageLayerComplate: function(result){
      this.resultLayers.push(result.layer);
      this.map.addLayer(result.layer);
      if(result.layer.fullExtent){
        this.map.setExtent(result.layer.fullExtent);
      }else{
        esriRequest({
          url : result.layer.url,
          content: {
            f: 'json',
            imageSR: this.map.spatialReference.wkid
          },
          handleAs : "json",
          callbackParamName:'callback'
        }).then(lang.hitch(this, function(layerInfo){
          if(layerInfo.value.mapImage.extent){
            this.map.setExtent(new Extent(layerInfo.value.mapImage.extent));
          }
        }));
      }
    },

    onError: function(error){
      this.loading.hide();
      this.infoTextNode.innerHTML = error.error.message;

      html.removeClass(this.exeNode, 'jimu-state-disabled');

      this.jobId = '';
    },

    destroy: function(){
      this._clearLastInput();
      this._clearLastResult();
      this.inherited(arguments);
    },

    _showLoading: function(text){
      this.loading.show();
      html.setStyle(this.infoNode, 'display', 'block');
      this.infoTextNode.innerHTML = text? text: this.nls.executing;
    },

    _hideLoading: function(){
      html.setStyle(this.infoNode, 'display', 'none');
      this.loading.hide();
    },

    _getOutputParamByName: function(paramName){
      for(var i = 0; i < this.config.outputParams.length; i ++){
        if(this.config.outputParams[i].name === paramName){
          return this.config.outputParams[i];
        }
      }
    },

    _getInputParamValues: function(){
      var retDef = new Deferred(), retValues = {}, defs = [], def, errorMessage = '';
      array.forEach(this.inputNodes, function(node){
        def = node.inputEditor.getGPValue();
        def.param = node.param;
        defs.push(def);
      }, this);

      all(defs).then(lang.hitch(this, function(values){
        for(var i = 0; i < values.length; i++){
          if(defs[i].param.required && (values[i] === null || values[i] === undefined)){
            errorMessage = defs[i].param.label + ' ' + this.nls.requiredInfo;
            new Message({
              message: errorMessage
            });
            retDef.reject(errorMessage);
            return;
          }else{
            retValues[defs[i].param.name] = values[i];
          }
        }
        retDef.resolve(retValues);
      }));
      return retDef;
    },

    _createInputNodes: function(){
      array.forEach(this.config.inputParams, function(param){
        this._createInputNode(param);
      }, this);
    },

    _clearLastInput: function(){
      array.forEach(this.inputNodes, function(node){
        if(node.inputEditor.clear && lang.isFunction(node.inputEditor.clear)){
          node.inputEditor.clear();
        }
      }, this);
    },

    _clearLastResult: function(){
      array.forEach(this.resultNodes, function(node){
        html.destroy(node.labelNode);
        node.resultRenderer.destroy();
        html.destroy(node);
      });
      array.forEach(this.resultLayers, function(layer){
        this.map.removeLayer(layer);
      }, this);

      this.resultNodes = [];
      this.resultLayers = [];
    },

    _createOutputNodes: function(values){
      array.forEach(this.config.outputParams, function(param, i){
        this._createOutputNode(param, values[i]);
      }, this);

      var allFeatures = [];
      array.forEach(values,lang.hitch(this, function(valueObj){
        if(valueObj.dataType === "GPFeatureRecordSetLayer"){
          var features = valueObj.value && valueObj.value.features;
          if(features && features.length > 0){
            allFeatures = allFeatures.concat(features);
          }
        }
      }));
      if(allFeatures.length > 0){
        try{
          var extent = graphicsUtils.graphicsExtent(allFeatures);
          if(extent){
            this.map.setExtent(extent.expand(1.4));
          }
        }
        catch(e){
          console.error(e);
        }
      }
    },

    _onExecuteClick: function(){
      if(html.hasClass(this.exeNode, 'jimu-state-disabled')){
        return;
      }
      this.executeGP();
    },

    _createInputNode: function(param) {
      var node = html.create('div', {
        'class': 'input-node'
      }, this.inputSectionNode);
      var labelNode = html.create('div', {
        'class': 'input-label',
        title: param.tooltip
      }, node);
      html.create('span', {
        'class': 'label-text',
        innerHTML: param.label
      }, labelNode);
      if(param.required){
        html.create('span', {
          'class': 'label-star',
          innerHTML: '*'
        }, labelNode);
      }

      var editorContainerNode = html.create('div', {
        'class': 'editor-container'
      }, node);

      var inputEditor = editorManager.createEditor(param, 'input', 'widget');
      inputEditor.placeAt(editorContainerNode);

      node.param = param;
      node.inputEditor = inputEditor;
      this.inputNodes.push(node);

      if(param.visible === false){
        html.setStyle(node, 'display', 'none');
      }
      return node;
    },

    _createOutputNode: function(param, value) {
      var node = html.create('div', {
        'class': 'output-node'
      }, this.outputSectionNode);

      var labelNode = html.create('div', {
        'class': 'output-label',
        title: param.tooltip,
        innerHTML: param.label
      }, node);

      var rendererContainerNode = html.create('div', {
        'class': 'renderer-container'
      }, node);

      var resultRenderer = resultRendererManager.createResultRenderer(param, value, 'widget');
      resultRenderer.placeAt(rendererContainerNode);
      resultRenderer.startup();

      node.param = param;
      node.labelNode = labelNode;
      node.resultRenderer = resultRenderer;

      this.resultNodes.push(node);

      this._reorderLayer();
      return node;
    },

    _reorderLayer: function(){
      if(!this.config.layerOrder || this.config.layerOrder.length === 0){
        return;
      }
      
      var operationalLayersIndex = this.config.layerOrder.indexOf('Operational Layers');
      var lastLayerIndex = this.map.graphicsLayerIds.length - 1;
      var i, layer;
      //put layers above operational layers
      for(i = operationalLayersIndex - 1; i >= 0; i --){
        layer = this.map.getLayer(this.config.layerOrder[i]);
        if(layer){
          this.map.reorderLayer(layer, lastLayerIndex);
        }
      }

      //put layers under operational layers
      for(i = operationalLayersIndex + 1; i < this.config.layerOrder.length; i ++){
        layer = this.map.getLayer(this.config.layerOrder[i]);
        if(layer){
          this.map.reorderLayer(layer, 0);
        }
      }
    }
  });
  
  return clazz;
});