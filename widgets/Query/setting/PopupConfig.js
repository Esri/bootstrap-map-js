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
  'dojo/text!./PopupConfig.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'jimu/dijit/SimpleTable',
  'dijit/form/TextBox',
  'dijit/TooltipDialog',
  'dijit/Menu',
  'dijit/MenuItem',
  'dijit/popup'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang, html,
  array, on, query, SimpleTable, TextBox, TooltipDialog, Menu, MenuItem, dojoPopup) {
  return declare([_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin], {
    baseClass: 'query-setting-popup-config',
    templateString: template,

    nls: null,
    sqs: null,
    config:null,//{title,fields}

    postCreate:function(){
      this.inherited(arguments);
      this._initFieldsTable();
      this._initAddFields();
      this.clear();
      if(this.config){
        this.setConfig(this.config);
      }
    },

    setConfig:function(config){
      this.clear();

      this.config = lang.mixin({},config);
      var validTitle = this.config.title && typeof this.config.title === 'string';
      if(validTitle){
        this.titleTextBox.set('value', this.config.title||'');
      }
      else{
        this.titleTextBox.set('value','');
      }
      if(this.config.fields && this.config.fields.length > 0){
        this._setFields(this.config.fields);
      }
    },

    getConfig:function(){
      var config = {
        title:'',
        fields:[]
      };

      if(!this.titleTextBox.validate()){
        this.sqs.showResultsSetting();
        this.sqs.scrollToDom(this.titleTextBox.domNode);
        this.sqs.showValidationErrorTip(this.titleTextBox);
        return null;
      }
      config.title = this.titleTextBox.get('value');
      
      var trs = this.fieldsTable.getRows();
      var fields = [];
      array.forEach(trs,lang.hitch(this,function(tr){
        var rowData = this.fieldsTable.getRowData(tr);
        if (rowData.visibility) {
          fields.push({
            name: rowData.name,
            alias: rowData.alias,
            type: tr.fieldType,
            specialType: rowData.specialType,
            showInInfoWindow: true
          });
        }
        else{
          var s = "${"+rowData.name+"}";
          if(config.title.indexOf(s) >= 0){
            fields.push({
              name: rowData.name,
              alias: rowData.alias,
              type: tr.fieldType,
              specialType: rowData.specialType,
              showInInfoWindow: false
            });
          }
        }
      }));
      config.fields = fields;

      return config;
    },

    clear:function(){
      this.fields = null;
      this.titleTextBox.set('value','');
      this.fieldsTable.clear();
      this._resetMenu();
      this._addEmptyMenuItem();
    },

    destroy:function(){
      this.sqs = null;
      this.titleTextBox.focusNode.blur();
      this.inherited(arguments);
    },

    _initFieldsTable: function(){
      var args = {
        maxHeight:"202px",
        fields:[{name:"visibility",title:this.nls.visibility,type:"checkbox"},
        {name:"name",title:this.nls.name,type:"text",editable:false},
        {name:"alias",title:this.nls.alias,type:"text",editable:true},
        {name:"specialType",title:this.nls.specialType,type:"extension",
        create:lang.hitch(this,this._createSpecialType),
        setValue:lang.hitch(this,this._setValue4SpecialType),
        getValue:lang.hitch(this,this._getValueOfSpecialType)},
        {name:"actions",title:this.nls.actions,type:"actions",actions:["up","down"]}]
      };
      this.fieldsTable = new SimpleTable(args);
      this.fieldsTable.placeAt(this.fieldsContainer);
      this.fieldsTable.startup();
    },

    _createSpecialType: function(td){
      var select = html.create('select',{},td);
      html.create('option',{
        value:'none',
        label:this.nls.none,
        selected:true
      },select);
      html.create('option',{
        value:'link',
        label:this.nls.link
      },select);
      html.create('option',{
        value:'image',
        label:this.nls.image
      },select);
    },

    _setValue4SpecialType: function(td, value){
      var select = query('select',td)[0];
      select.value = value;
    },

    _getValueOfSpecialType:function(td){
      var select = query('select',td)[0];
      return select.value;
    },

    _initAddFields:function(){
      var ttdContent = html.create("div");
      this.tooltipDialog = new TooltipDialog({
        style: "cursor:pointer",
        content: ttdContent
      });
      this.menu = new Menu();
      this.menu.placeAt(ttdContent);
      this.own(on(window,'click',lang.hitch(this,function(){
        dojoPopup.close(this.tooltipDialog);
      })));
    },

    _onAddClicked:function(event){
      event.stopPropagation();
      event.preventDefault();
      dojoPopup.close(this.tooltipDialog);
      dojoPopup.open({
        popup: this.tooltipDialog,
        around: this.btnAddFields
      });
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
        visibility:fieldInfo.visible,
        name:fieldInfo.name,
        alias:fieldInfo.alias||fieldInfo.name,
        specialType: fieldInfo.specialType||'none'
      };
      var result = this.fieldsTable.addRow(rowData);
      if(result.success){
        result.tr.fieldType = fieldInfo.type;
      }
    }

  });
});