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
  'dojo/text!./templates/PopupConfig.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'esri/request',
  'jimu/dijit/SimpleTable',
  'dijit/form/TextBox',
  'dijit/form/DropDownButton',
  'dijit/TooltipDialog',
  'dijit/Menu',
  'dijit/MenuItem',
  'dojo/i18n!../nls/main'
],
function(declare, _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, template, lang, html, array, esriRequest, SimpleTable,
  TextBox, DropDownButton, TooltipDialog, Menu, MenuItem,mainNls) {
  return declare([_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin], {
    _def:null,

    baseClass:'jimu-dijit-popup-config',
    templateString:template,
    url:null,
    title:null,
    fields:null,//array,{name,alias,type,/*optional*/ visible}
    config:null,

    postMixInProperties:function(){
      this.nls = mainNls.popupConfig;
    },

    postCreate:function(){
      this.inherited(arguments);
      this.clear();
      if(this.title){
        this.titleTextBox.set('value',this.title);
      }
      if(this.fields instanceof Array){
        this.setFields(this.fields);
      }
      else if(this.url){
        this.setUrl(this.url);
      }
    },

    getConfig:function(){
      var config = {
        title:lang.trim(this.titleTextBox.get('value')),
        fields:[]
      };
      var trs = this.fieldsTable.getRows();
      array.forEach(trs,lang.hitch(this,function(tr){
        var rowData = this.fieldsTable.getRowData(tr);
        if (rowData.visibility) {
          config.fields.push({
            name: rowData.name,
            alias: rowData.alias,
            type: tr.fieldType
          });
        }
      }));
      return config;
    },

    setUrl:function(url){
      if(typeof url === 'string'){
        url = lang.trim(url);
      }
      else{
        return;
      }
      this.url = url;
      this.clear();
      var def = this._requestLayerInfo(url);
      return def;
    },

    setFields:function(fields){
      if(fields instanceof Array){
        this._setFields(fields);
      }
    },

    clear:function(){
      this.fieldsTable.clear();
      this._resetMenu();
      this._addEmptyMenuItem();
    },

    _resetMenu:function(){
      var menuItems = this.menu.getChildren();
      array.forEach(menuItems,lang.hitch(this,function(menuItem){
        this.menu.removeChild(menuItem);
      }));
    },

    _addEmptyMenuItem:function(){
      var menuItem = new MenuItem({
        label:this.nls.noField,
        onClick:lang.hitch(this,function(){
          var dialog = this.menu.getParent();
          html.setStyle(dialog.domNode.parentNode,'display','none');
        })
      });
      this.menu.addChild(menuItem);
    },

    _setFields:function(fields){
      this._resetMenu();
      this.fields = array.filter(fields, function(item) {
        return item.type !== 'esriFieldTypeGeometry';
      });
      if (this.fields.length > 0) {
        array.forEach(this.fields, lang.hitch(this, function(fieldInfo) {
          this._addMenuItem(fieldInfo);
          this._addRow(fieldInfo);
        }));
      } else {
        this._addEmptyMenuItem();
      }
    },

    _requestLayerInfo:function(url){
      if(this._def){
        this._def.cancel();
      }
      this._def = esriRequest({
        url:url,
        content:{f:"json"},
        handleAs:"json",
        callbackParamName:"callback"
      });
      this._def.then(lang.hitch(this,function(response){
        if(response && response.fields){
          this._setFields(response.fields);
        }
      }),lang.hitch(this,function(error){
        console.error("request layer info failed",error);
      }));
      return this._def;
    },

    _addMenuItem:function(fieldInfo){
      var label = fieldInfo.name + " {" + fieldInfo.name + "}";
      var menuItem = new MenuItem({
        label:label,
        onClick:lang.hitch(this,function(){
          var a = this.titleTextBox.get('value');
          var b = a + "${" + fieldInfo.name + "}";
          this.titleTextBox.set('value',b);
          var dialog = this.menu.getParent();
          html.setStyle(dialog.domNode.parentNode,'display','none');
        })
      });
      this.menu.addChild(menuItem);
    },

    _addRow:function(fieldInfo){
      var rowData = {
        visibility:fieldInfo.visible !== false,
        name:fieldInfo.name,
        alias:fieldInfo.alias||fieldInfo.name
      };
      var result = this.fieldsTable.addRow(rowData);
      if(result.success){
        result.tr.fieldType = fieldInfo.type;
      }
    }

  });
});