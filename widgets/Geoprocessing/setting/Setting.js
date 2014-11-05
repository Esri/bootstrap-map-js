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
  'jimu/BaseWidgetSetting',
  'dijit/form/ValidationTextBox',
  'jimu/dijit/GpServiceChooser',
  'jimu/dijit/ViewStack',
  './SettingDetail'
],
function(declare, lang, array, html, on, BaseWidgetSetting, ValidationTextBox, GpServiceChooser, ViewStack, SettingDetail) {
  return declare([BaseWidgetSetting], {
    baseClass: 'jimu-widget-setting-gp',

    startup: function(){
      this.inherited(arguments);
      this.serviceUrlInput = new ValidationTextBox({
        required:true,
        placeholder: this.nls.serviceURLPlaceholder,
        style: {
          position:'absolute',
          left: '80px',
          right:'45px',
          top:'5px',
          bottom: '5px',
          width: 'auto'
        }
      }, this.serviceUrlNode);

      this.serviceChooser = new GpServiceChooser({
        url: this.config.taskUrl
      }, this.gpServiceChooserNode);

      this.own(on(this.serviceChooser, 'ok', lang.hitch(this, this._onServiceSelected)));

      this.settingDetail = new SettingDetail({
        config: this.config,
        nls: this.nls,
        map: this.map
      }, this.settingDetailNode);
      
      this.viewStack = new ViewStack({
        viewType: 'dijit',
        views: [this.settingDetail]
      }, this.stackNode);
      this.viewStack.startup();
      this.setConfig(this.config);

      this.resize();
    },

    resize: function(){
      var box = html.getContentBox(this.domNode);
      html.setStyle(this.stackNode, {
        height: (box.h - 40 - 3) + 'px'
      });
    },

    setConfig: function(config){
      this.settingDetail.setConfig(config);
    },

    getConfig: function () {
      //because the setting detail maybe re-write the config object,
      //so, call setting detail's getConfig here
      return this.settingDetail.getConfig();
    },

    _onServiceSelected: function(service){
      if(this.config.taskUrl === service.url){
        return;
      }
      this.config.taskUrl = service.url;
      this.settingDetail.setConfig(this.config);
    }

  });
});