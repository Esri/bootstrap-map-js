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
  'dojo/text!./templates/_FilterSet.html',
  'dijit/registry',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/aspect',
  'dojo/query',
  './_SingleFilter',
  'esri/lang',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, registry,
  lang, html, array, on, aspect, query, SingleFilter, esriLang, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString:template,
    baseClass: 'jimu-filter-set',
    nls: null,
    url: null,
    layerInfo: null,
    stringFieldType: '',
    dateFieldType: '',
    numberFieldTypes: [],
    partsObj: null,
    OPERATORS: null,

    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.filterBuilder;
      var strSelect = '<select data-dojo-attach-point=allAnySelect>'+
      '<option value=AND selected>'+this.nls.all+'</option>'+
      '<option value=OR>'+this.nls.any+'</option></select>';
      this.nls.matchMsgSet = esriLang.substitute({any_or_all:strSelect},this.nls.matchMsgSet);
    },

    postCreate:function(){
      this.inherited(arguments);
      this._initSelf();
    },

    toJson:function(){
      var nodes = query('.jimu-single-filter',this.allExpsBox);
      var parts = array.map(nodes,lang.hitch(this,function(node){
        var filter = registry.byNode(node);
        return filter.toJson();
      }));
      var validParts = array.every(parts,lang.hitch(this,function(part){
        return part;
      }));
      if(validParts && parts.length > 0){
        var result = {
          logicalOperator: this.allAnySelect.value,
          parts: parts
        };
        return result;
      }
      else{
        return null;
      }
    },

    showDelteIcon:function(){
      html.setStyle(this.btnDelete,'display','block');
    },

    hideDeleteIcon:function(){
      html.setStyle(this.btnDelete,'display','none');
    },

    _initSelf:function(){
      this.own(on(this.btnAdd,'click',lang.hitch(this,this._addSingleFilter)));
      if(this.partsObj){
        this.allAnySelect.value = this.partsObj.logicalOperator;
        var parts = this.partsObj.parts||[];
        if(parts.length === 0){
          this._addSingleFilter();
          this._addSingleFilter();
        }
        else if(parts.length === 1){
          this._addSingleFilter(parts[0]);
          this._addSingleFilter();
        }
        else{
          array.forEach(parts,lang.hitch(this,function(part){
            this._addSingleFilter(part);
          }));
        }
      }
      else{
        this._addSingleFilter();
        this._addSingleFilter();
      }
    },

    _addSingleFilter:function(/* optional */ part){
      var args = {
        url: this.url,
        layerInfo: this.layerInfo,
        stringFieldType: this.stringFieldType,
        dateFieldType: this.dateFieldType,
        numberFieldTypes: this.numberFieldTypes,
        part:part,
        OPERATORS: this.OPERATORS,
        style:{
          margin:'15px auto 0 auto',
          border:0,
          background:'inherit'
        }
      };
      var singleFilter = new SingleFilter(args);
      singleFilter.placeAt(this.allExpsBox);
      singleFilter.startup();
      this.own(aspect.after(singleFilter,'_destroySelf',lang.hitch(this,this._checkFilterNumbers)));
      this._checkFilterNumbers();
    },

    _checkFilterNumbers:function(){
      var nodes = query('.jimu-single-filter',this.allExpsBox);
      var isShowIcon = nodes.length > 2;
      array.forEach(nodes,lang.hitch(this,function(node){
        var filter = registry.byNode(node);
        if(isShowIcon){
          filter.showDelteIcon();
        }
        else{
          filter.hideDeleteIcon();
        }
      }));
    },

    _destroySelf:function(){
      this.destroy();
    }
  });
});