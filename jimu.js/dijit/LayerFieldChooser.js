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
  'jimu/dijit/SimpleTable',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/Deferred',
  'esri/request'
],
function(declare, SimpleTable, lang, html, array, Deferred, esriRequest) {
  return declare([SimpleTable], {
    _def:null,
    _layerInfo:null,

    url:null,
    fields:[{name:'name',title:'Name',type:'text',editable:false}],
    selectable:true,
    fieldType:null,//string,number

    postCreate:function(){
      this.inherited(arguments);
      html.addClass(this.domNode,'jimu-layer-field-chooser');
      if(typeof this.url === 'string'){
        this.url = lang.trim(this.url);
      }
      else{
        this.url = null;
      }
      this.refresh(this.url);
    },

    refresh:function(url){
      url = lang.trim(url||'');
      this.url = url;
      this._layerInfo = null;
      this.clear();
      var def = this._requestLayerInfo(url);
      return def;
    },

    setFieldItems:function(fields){
      this._addFieldItems(fields);
    },

    onRefreshed:function(response){/*jshint unused: false*/},

    getLayerInfo:function(){
      return this._layerInfo;
    },

    _requestLayerInfo:function(url){
      if(!url){
        return;
      }
      var def = new Deferred();
      if(this._def){
        this._def.cancel();
      }
      this._def = esriRequest({
        url:url,
        content:{f:"json"},
        handleAs:"json",
        callbackParamName:"callback",
        timeout:20000
      },{
        useProxy:false
      });
      this._def.then(lang.hitch(this,function(response){
        this._layerInfo = response;
        if(response && response.fields){
          var fields = array.filter(response.fields,function(item){
            return item.type !== 'esriFieldTypeOID' && item.type !== 'esriFieldTypeGeometry';
          });
          if(fields.length > 0){
            this.setFieldItems(fields);
          }
          this.onRefreshed(response);
        }
        def.resolve(lang.mixin({},this.fields));
      }),lang.hitch(this,function(error){
        this._layerInfo = null;
        console.error("request layer info failed",error);
        def.resolve(error);
      }));
      return def;
    },

    _addFieldItems:function(fields){
      var length = fields.length;
      if(fields && length !== undefined){
        fields = lang.mixin({},fields);
        for(var i=0;i<length;i++){
          this._createFieldItem(fields[i]);
        }
      }
    },

    _createFieldItem:function(fieldInfo){
      if(this.fieldType === 'number'){
        if(!this._isNumberType(fieldInfo.type)){
          return false;
        }
      }
      if(this.fieldType === 'string'){
        if(!this._isStringType(fieldInfo.type)){
          return false;
        }
      }
      var rowData = {
        name:fieldInfo.name||fieldInfo.alias
      };
      var result = this.addRow(rowData);
      if(result.success){
        result.tr.fieldInfo = fieldInfo;
      }
      return result.success;
    },

    _isNumberType:function(type){
      var numberTypes = ['esriFieldTypeOID','esriFieldTypeSmallInteger','esriFieldTypeInteger','esriFieldTypeSingle','esriFieldTypeDouble'];
      return array.indexOf(numberTypes,type) >= 0;
    },

    _isStringType:function(type){
      var stringTypes = ['esriFieldTypeString'];
      return array.indexOf(stringTypes,type) >= 0;
    }

  });
});