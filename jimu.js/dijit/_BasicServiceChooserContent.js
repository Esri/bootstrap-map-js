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
  'dojo/text!./templates/_BasicServiceChooserContent.html',
  'dojo/Evented',
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/aspect',
  'dojo/promise/all',
  'jimu/dijit/URLInput',
  'jimu/dijit/LoadingIndicator',
  'esri/request',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Evented,
  Deferred, html, array, lang, on, aspect, all, URLInput, LoadingIndicator, esriRequest, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,

    _examples:['http://myserver/arcgis/rest/services',
    'http://myserver/arcgis/rest/services/folder',
    'http://myserver/arcgis/rest/services/myservice/servicetype'],

    //options:
    multiple: false,
    url:'',

    //public methods:
    //setUrl

    //events:
    //ok
    //cancel

    //methods need to override:
    //_createServiceBrowser, return a service browser

    //public methods:
    //getSelectedItems return [{name,url, /*optional*/ definition}]

    getSelectedItems: function(){
      return this.serviceBrowser.getSelectedItems();
    },
    
    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = lang.mixin({}, mainNls.common);
      this.nls = lang.mixin(this.nls, mainNls.basicServiceChooser);
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-service-chooser-content');
      this.multiple = !!this.multiple;
      this._initSelf();
    },

    setUrl: function(url){
      this.url = url;
      if(this.url && typeof this.url === 'string'){
        this.urlInput.set('value', this.url);
        if(this.urlInput.validate()){
          this.serviceBrowser.setUrl(this.urlInput.get('value'));
        }
      }
    },

    _initSelf: function(){
      //set examples
      if(this._examples && this._examples.length > 0){
        array.forEach(this._examples, lang.hitch(this, function(example){
          html.create('div',{
            innerHTML: example,
            style:{
              'word-wrap':'break-word',
              'word-break':'break-all',
              'font-size':'13px'
            }
          }, this.exampleTd);
        }));
      }
      else{
        html.setStyle(this.exampleTr, 'display', 'none');
      }

      //set service browser
      var args = {
        multiple: this.multiple,
        _onTreeClick: lang.hitch(this, this._onTreeClick)
      };
      this.serviceBrowser = this._createServiceBrowser(args);
      this.serviceBrowser.placeAt(this.serviceBrowserContainer);
      this.serviceBrowser.startup();

      this.own(aspect.after(this.urlInput, 'validator', lang.hitch(this, this._afterUrlValidate)));

      if(this.url && typeof this.url === 'string'){
        this.setUrl(this.url);
      }
    },

    //to be override,return a service browser
    _createServiceBrowser: function(args){/* jshint unused: false */},

    _afterUrlValidate: function(isValidate){
      var disabledClass = 'jimu-state-disabled';
      if(isValidate){
        html.removeClass(this.btnValidate, disabledClass);
      }
      else{
        html.addClass(this.btnValidate, disabledClass);
      }
      return isValidate;
    },

    _onBtnValidateClick: function(){
      var isValidate = this.urlInput.validate();
      if(isValidate){
        var url = this.urlInput.get('value');
        this.serviceBrowser.setUrl(url).then(lang.hitch(this, function(){
          if(!this.domNode){
            return;
          }
          this._checkSelectedItemsNumber();
        }), lang.hitch(this, function(){
          if(!this.domNode){
            return;
          }
          this._checkSelectedItemsNumber();
        }));
      }
    },

    _checkSelectedItemsNumber: function(){
      var disabledClass = 'jimu-state-disabled';
      var items = this.getSelectedItems();
      if(items.length > 0){
        html.removeClass(this.btnOk, disabledClass);
      }
      else{
        html.addClass(this.btnOk, disabledClass);
      }
    },

    _onTreeClick: function(){
      this._checkSelectedItemsNumber();
    },

    _onBtnOkClick: function(){
      var items = this.getSelectedItems();
      if(items.length > 0){
        this.emit('ok', items);
      }
    },

    _onBtnCancelClick: function(){
      this.emit('cancel');
    }

  });
});