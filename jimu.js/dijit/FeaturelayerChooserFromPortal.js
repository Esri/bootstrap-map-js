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
  'dojo/text!./templates/FeaturelayerChooserFromPortal.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dojo/Deferred',
  'dojo/Evented',
  'dojo/promise/all',
  'jimu/dijit/_ItemSelector',
  'esri/request',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
  lang, html, array, on, query, Deferred, Evented, promiseAll, ItemSelector, esriRequest, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {/*jshint unused: false*/
    templateString: template,
    baseClass: 'jimu-featurelayer-chooser-from-portal',

    _layersDef:null,
    
    //options:
    appConfig: null,
    multiple: false,

    //events:
    //ok
    //cancel

    //public methods:
    //getSelectedItems return [{name,url,definition}]

    postMixInProperties: function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = lang.mixin({}, mainNls.common);
      this.nls = lang.mixin(this.nls, mainNls.featureLayerChooserFromPortal);
    },

    postCreate: function(){
      this.inherited(arguments);
      this._initSelf();
    },

    getSelectedItems: function(){
      var cbxs = query('.layer-checkbox', this.layersTable);
      cbxs = array.filter(cbxs, lang.hitch(this, function(cbx){
        return cbx.checked;
      }));
      var items = array.map(cbxs, lang.hitch(this, function(cbx){
        var td = cbx.parentNode;
        var tr = td.parentNode;
        var url = tr.url || '';
        var definition = tr.layerInfo;
        var name = (definition && definition.name) || '';
        return {
          name: name,
          url: url,
          definition: definition
        };
      }));
      return items;
    },

    _initSelf: function(){
      //init selector
      this.selector = new ItemSelector({
        appConfig: this.appConfig,
        itemTypes: ['Feature Service','Map Service']
      });
      this.own(on(this.selector, 'item-selected', lang.hitch(this, this._onItemSelected)));
      this.own(on(this.selector, 'none-item-selected', lang.hitch(this, this._onNoneItemSelected)));
      this.selector.placeAt(this.selectorContainer);
      this.selector.startup();
    },

    _onItemSelected: function(){
      html.removeClass(this.btnNext, 'jimu-state-disabled');
    },

    _onNoneItemSelected: function(){
      html.addClass(this.btnNext, 'jimu-state-disabled');
    },

    _onBtnBackClicked: function(){
      if(this._layersDef && !this._layersDef.isFulfilled()){
        this._layersDef.cancel();
      }
      html.setStyle(this.btnOk, 'display', 'none');
      html.setStyle(this.btnNext, 'display', 'block');
      html.setStyle(this.btnBack, 'display', 'none');
      html.addClass(this.btnOk, 'jimu-state-disabled');
      html.setStyle(this.selectorContainer, 'display', 'block');
      html.setStyle(this.layersSection, 'display', 'none');
      this._resetLayers();
      this.emit('back');
    },

    _onBtnOkClicked: function(){
      var items = this.getSelectedItems();
      if(items.length > 0){
        this.emit('ok', items);
      }
    },

    _onBtnNextClicked: function(){
      var item = this.selector.getSelectedItem();
      if(!item){
        return;
      }
      html.setStyle(this.btnNext, 'display', 'none');
      html.setStyle(this.btnBack, 'display', 'block');
      html.setStyle(this.btnOk, 'display', 'block');
      html.addClass(this.btnOk, 'jimu-state-disabled');
      html.setStyle(this.selectorContainer, 'display', 'none');
      html.setStyle(this.layersSection, 'display', 'block');
      this._resetLayers();
      var url = item.url || item.item;
      this.layersShelter.show();
      this._layersDef = esriRequest({
        url: url,
        content: {
          f: 'json'
        },
        handleAs: 'json',
        callbackParamName: 'callback'
      });
      this._layersDef.then(lang.hitch(this, function(serviceDef) {
        if (!this.domNode) {
          return;
        }
        this.layersShelter.hide();
        this._layersDef = null;
        this._showLayers(item, serviceDef);
      }), lang.hitch(this, function(err) {
        if (!this.domNode) {
          return;
        }
        this.layersShelter.hide();
        console.error(err);
        this._layersDef = null;
      }));
      this.emit('next');
    },

    _resetLayers: function(){
      this.serviceName.innerHTML = '';
      this.errorTip.innerHTML = '';
      html.setStyle(this.errorSection, 'display', 'none');
      html.setStyle(this.layersTable, 'display', 'table');
      html.empty(this.layersTbody);
    },

    _showLayers: function(item, serviceDef){
      this.serviceName.innerHTML = item.title;
      var isQuery = serviceDef.capabilities && serviceDef.capabilities.indexOf('Query') >= 0;
      if(isQuery){
        var serviceUrl = item.url||item.item;
        var layers = array.filter(serviceDef.layers, lang.hitch(this, function(layer){
          return !layer.subLayerIds;
        }));
        var defs = array.map(layers, lang.hitch(this, function(layer){
          var layerUrl = serviceUrl + '/' + layer.id;
          var d = new Deferred();
          esriRequest({
            url: layerUrl,
            content: {f:'json'},
            handleAs: 'json',
            callbackParamName: 'callback'
          }).then(lang.hitch(this,function(layerDef){
            if(!this.domNode){
              return;
            }
            var trStr = '<tr><td><input class="layer-checkbox" type="checkbox" /></td><td><span class="layer-name"></span></td></tr>';
            var tr = html.toDom(trStr);
            html.place(tr, this.layersTbody);
            tr.layerInfo = layerDef;
            tr.url = layerUrl;
            var layerNameSpan = query('.layer-name', tr)[0];
            layerNameSpan.innerHTML = layerDef.name;
            d.resolve(layerDef);
          }),lang.hitch(this,function(err){
            if(!this.domNode){
              return;
            }
            console.error(err);
            d.reject(err);
          }));
          return d;
        }));

        if(defs.length > 0){
          this.layersShelter.show();
          this._layersDef = promiseAll(defs);
          this._layersDef.then(lang.hitch(this,function(results){
            if(!this.domNode){
              return;
            }
            this.layersShelter.hide();
            this._layersDef = null;
          }),lang.hitch(this, function(err){
            if(!this.domNode){
              return;
            }
            console.error(err);
            this.layersShelter.hide();
            this._layersDef = null;
          }));
        }
      }
      else{
        this._showLayersErrorInfo("The service doesn't support query.");
      }
    },

    _onLayersTableClicked: function(event){
      var target = event.target || event.srcElement;
      if (!html.hasClass(target, 'layer-checkbox')) {
        return;
      }

      var allCbxs = query('.layer-checkbox', this.layersTable);
      var existChecked = array.some(allCbxs, lang.hitch(this, function(cbx) {
        return cbx.checked;
      }));

      if(existChecked){
        html.removeClass(this.btnOk, 'jimu-state-disabled');
      }
      else{
        html.addClass(this.btnOk, 'jimu-state-disabled');
      }

      if (!this.multiple) {
        var layerCbx = target;
        if (layerCbx.checked) {
          array.forEach(allCbxs, lang.hitch(this, function(cbx) {
            cbx.checked = false;
          }));
          layerCbx.checked = true;
        }
      }
    },

    _showLayersErrorInfo: function(errMsg){
      html.setStyle(this.errorSection, 'display', 'block');
      this.errorTip.innerHTML = errMsg;
    },

    _onBtnCancelClicked: function(){
      this.emit('cancel');
    }

  });
});