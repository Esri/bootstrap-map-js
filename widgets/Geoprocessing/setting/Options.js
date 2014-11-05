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
  'dojo/text!./Options.html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/form/TextBox',
  'jimu/dijit/CheckBox',
  'esri/request'
],
function(declare, lang, html, array, on, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, TextBox, CheckBox, esriRequest) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-setting-gp-options',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
    },

    setConfig: function(config){
      this.config = config;
      this.helpUrl.setValue(config.helpUrl);
      this.useResultMapServer.setValue(config.useResultMapServer);
      this.useResultMapServer.set('disabled', true);
      this._setResultMapServerCheckBoxEnable();

      this.shareResults.setValue(config.shareResults);
    },

    acceptValue: function(){
      this.config.helpUrl = this.helpUrl.getValue();
      this.config.useResultMapServer = this.useResultMapServer.getValue();
      this.config.shareResults = this.shareResults.getValue();
    },

    _setResultMapServerCheckBoxEnable: function(){
      if(this.config.isSynchronous){
        return;
      }
      var segs = this.config.taskUrl.split('/');
      segs.pop();
      var serviceUrl = segs.join('/');
      esriRequest({
        url : serviceUrl + '?f=json',
        handleAs : "json",
        callbackParamName:'callback'
      }).then(lang.hitch(this, function(serviceMeta){
        if(serviceMeta.resultMapServerName){
          this.useResultMapServer.set('disabled', false);
        }
      }));
    }

  });
});