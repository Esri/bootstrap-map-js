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
  'dojo/text!./templates/FeaturelayerSource.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/Evented',
  'dojo/query',
  'jimu/dijit/FeaturelayerChooserFromMap',
  'jimu/dijit/FeaturelayerChooserFromPortal',
  'jimu/dijit/_FeaturelayerServiceChooserContent',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang, html,
  array, on, Evented, query, FeaturelayerChooserFromMap, FeaturelayerChooserFromPortal, _FeaturelayerServiceChooserContent, i18n) {
  var FeaturelayerChooserWithButtons = declare([_WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, Evented],{
    baseClass: 'jimu-featurelayer-chooser-with-buttons',
    templateString: '<div>' +
      '<div class="flc-container" data-dojo-attach-point="flcDiv"></div>' +
      '<div class="footer">'+
        '<div class="jimu-btn cancel" data-dojo-attach-point="btnCancel">${nls.cancel}</div>'+
        '<div class="jimu-btn ok jimu-state-disabled" data-dojo-attach-point="btnOk">${nls.ok}</div>'+
      '</div>' +
    '</div>',

    featureLayerChooserArgs: null,

    //events:
    //ok
    //cancel

    //public methods:
    //getSelectedItems

    postMixInProperties: function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.common;
    },

    postCreate: function(){
      this.inherited(arguments);

      this.flcMap = new FeaturelayerChooserFromMap(this.featureLayerChooserArgs);
      this.flcMap.placeAt(this.flcDiv);
      html.setStyle(this.flcMap.domNode, {
        width: '100%',
        height: '100%'
      });

      this.own(on(this.flcMap, 'tree-click', lang.hitch(this, function(){
        var items = this.getSelectedItems();
        if(items.length > 0){
          html.removeClass(this.btnOk, 'jimu-state-disabled');
        }
        else{
          html.addClass(this.btnOk, 'jimu-state-disabled');
        }
      })));

      this.own(on(this.btnOk, 'click', lang.hitch(this, function(){
        var items = this.getSelectedItems();
        if(items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.btnCancel, 'click', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    getSelectedItems: function(){
      return this.flcMap.getSelectedItems();
    },

    startup: function(){
      this.inherited(arguments);
      this.flcMap.startup();
    }
  });

  return declare([_WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-featurelayer-source',
    nls: null,

    //common options:
    multiple: false,
    types: null, //available values:point,polyline,polygon

    //FeaturelayerChooserFromMap options
    createMapResponse: null,
    
    //FeaturelayerChooserFromPortal options
    appConfig: null,

    //public methods:
    //getSelectedItems

    //events:
    //ok
    //cancel

    postMixInProperties: function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.featureLayerSource;

      this._initTypes();
    },

    postCreate: function(){
      this.inherited(arguments);
      this._initSelf();
    },

    getSelectedItems: function(){
      var items = [];
      if(this.mapRadio.checked){
        items = this.flcMap.getSelectedItems();
      }
      else if(this.portalRadio.checked){
        items = this.flcPortal.getSelectedItems();
      }
      else if(this.urlRadio.checked){
        items = this.flcUrl.getSelectedItems();
      }
      return items;
    },

    startup: function(){
      this.inherited(arguments);
      this.flcMap.startup();
      this.flcPortal.startup();
      this.flcUrl.startup();
    },

    _initTypes:function(){
      var allTypes = ['point','polyline','polygon'];
      if(this.types && this.types.length > 0){
        this.types = array.filter(this.types,lang.hitch(this,function(type){
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

    _initSelf: function(){
      this._initRadios();

      //create FeaturelayerChooserWithButtons
      this._createFeaturelayerChooserWithButtons();

      //create FeaturelayerChooserFromPortal
      this._createFeaturelayerChooserFromPortal();

      //create _FeaturelayerServiceChooserContent
      this._createFeaturelayerServiceChooserContent();

      this._onRadioClicked();
    },

    _createFeaturelayerChooserWithButtons: function(){
      var args1 = {
        multiple: this.multiple,
        types: this.types,
        style: {
          width: '100%',
          height: '100%'
        },
        featureLayerChooserArgs:{
          createMapResponse: this.createMapResponse
        }
      };
      this.flcMap = new FeaturelayerChooserWithButtons(args1);
      this.flcMap.operationTip = this.nls.selectLayer;
      this.flcMap.placeAt(this.flcContainer);

      this.own(on(this.flcMap, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.flcMap, 'cancel', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    _createFeaturelayerChooserFromPortal: function(){
      var args2 = {
        multiple: this.multiple,
        types: this.types,
        appConfig: this.appConfig,
        style: {
          width: '100%',
          height: '100%'
        }
      };
      this.flcPortal = new FeaturelayerChooserFromPortal(args2);
      this.flcPortal.operationTip = this.nls.chooseItem;
      this.flcPortal.placeAt(this.hflcContainer);

      this.own(on(this.flcPortal, 'next',lang.hitch(this, function(){
        this.flcPortal.operationTip = this.nls.chooseItem +" -> " + this.nls.selectLayer;
        this._updateOperationTip();
      })));

      this.own(on(this.flcPortal, 'back',lang.hitch(this, function(){
        this.flcPortal.operationTip = this.nls.chooseItem;
        this._updateOperationTip();
      })));

      this.own(on(this.flcPortal, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.flcPortal, 'cancel', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    _createFeaturelayerServiceChooserContent: function(){
      var args3 = {
        multiple: this.multiple,
        style: {
          width: '100%',
          height: '100%'
        }
      };
      this.flcUrl = new _FeaturelayerServiceChooserContent(args3);
      this.flcUrl.operationTip = this.nls.setServiceUrl;
      this.flcUrl.placeAt(this.flscContainer);

      this.own(on(this.flcUrl, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.flcUrl, 'cancel', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    _initRadios: function(){
      var name = "featureLayerSourceRadios_" + this._getRandomString();
      this.mapRadio.name = name;
      html.setAttr(this.mapRadio, 'id', "mapRadio_"+this._getRandomString());
      html.setAttr(this.mapLabel, 'for', this.mapRadio.id);

      this.portalRadio.name = name;
      html.setAttr(this.portalRadio, 'id', "portalRadio_"+this._getRandomString());
      html.setAttr(this.portalLabel, 'for', this.portalRadio.id);

      this.urlRadio.name = name;
      html.setAttr(this.urlRadio, 'id', "urlRadio_"+this._getRandomString());
      html.setAttr(this.urlLabel, 'for', this.urlRadio.id);
    },

    _getRandomString: function(){
      var str = Math.random().toString();
      str = str.slice(2,str.length);
      return str;
    },

    _onRadioClicked: function(){
      html.setStyle(this.flcContainer, 'display', 'none');
      html.setStyle(this.hflcContainer, 'display', 'none');
      html.setStyle(this.flscContainer, 'display', 'none');

      if(this.mapRadio.checked){
        html.setStyle(this.flcContainer, 'display', 'block');
        this.operationTip.innerHTML = this.nls.selectLayer;
      }
      else if(this.portalRadio.checked){
        html.setStyle(this.hflcContainer, 'display', 'block');
        this.operationTip.innerHTML = this.nls.chooseItem;
      }
      else if(this.urlRadio.checked){
        html.setStyle(this.flscContainer, 'display', 'block');
        this.operationTip.innerHTML = this.nls.setServiceUrl;
      }

      this._updateOperationTip();
    },

    _updateOperationTip: function(){
      if(this.mapRadio.checked){
        this.operationTip.innerHTML = this.flcMap.operationTip;
      }
      else if(this.portalRadio.checked){
        this.operationTip.innerHTML = this.flcPortal.operationTip;
      }
      else if(this.urlRadio.checked){
        this.operationTip.innerHTML = this.flcUrl.operationTip;
      }
    }

  });
});