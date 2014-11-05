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
  'dojo/text!./Parameters.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dijit/registry',
  'jimu/filterUtils',
  './SingleParameter'
],
  function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang,
  html, array, on, query, registry, filterUtils, SingleParameter) {/*jshint unused: false*/
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-query-parameters',
      templateString: template,
      nls: null,
      partsObj: null,
      layerInfo: null,

      _filterUtils:null,

      postCreate:function(){
        this.inherited(arguments);
        this._filterUtils = new filterUtils();
        if(this.partsObj){
          this.build(this.partsObj);
        }
      },

      destroy: function(){
        this.clear();
        this._filterUtils = null;
        this.inherited(arguments);
      },

      getNewFilterExpr:function(){
        var newPartsObj = lang.mixin({},this.partsObj);
        var spArray = this._getAllIntractiveSinglePartArray(newPartsObj);
        for(var i=0;i<spArray.length;i++){
          var singlePart = spArray[i];
          var id = singlePart.spId;
          if(id){
            var selector = '#'+id;
            var spDom = query(selector, this.tbody)[0];
            if(spDom){
              var sp = registry.byNode(spDom);
              var newValueObj = sp.getValueObj();
              if(!newValueObj){
                return null;
              }
              singlePart.valueObj = newValueObj;
            }
          }
        }
        var expr = this._filterUtils.getExprByFilterObj(newPartsObj);
        return expr;
      },

      clear:function(){
        var spDoms = query('.jimu-widget-query-single-parameter',this.tbody);
        array.forEach(spDoms,lang.hitch(this,function(spDom){
          var sp = registry.byNode(spDom);
          sp.destroy();
        }));
        html.empty(this.tbody);
        this.partsObj = null;
        this.layerInfo = null;
      },

      build:function(partsObj,layerInfo){
        this.clear();
        this.partsObj = lang.mixin({},partsObj);
        this.layerInfo = lang.mixin({},layerInfo);
        var interactiveSPA = this._getAllIntractiveSinglePartArray(partsObj);
        array.forEach(interactiveSPA,lang.hitch(this,function(singlePart){
          var strTr = "<tr><td></td></tr>";
          var tr = html.create('tr',{innerHTML:'<td></td>'},this.tbody);
          var td = query('td',tr)[0];
          var fieldName = singlePart.fieldObj.name;
          var fieldInfo = this._getFieldInfo(fieldName, this.layerInfo);
          var args = {
            nls: this.nls,
            part: singlePart,
            fieldInfo: fieldInfo
          };
          var sp = new SingleParameter(args);
          sp.placeAt(td);
          sp.startup();
          singlePart.spId = sp.id;
        }));
      },

      _getFieldInfo:function(fieldName,lyrDef){
        var fieldInfos = lyrDef.fields;
        for(var i=0;i<fieldInfos.length;i++){
          var fieldInfo = fieldInfos[i];
          if(fieldName === fieldInfo.name){
            return lang.mixin({},fieldInfo);
          }
        }
        return null;
      },

      _getAllIntractiveSinglePartArray:function(partsObj){
        var result = [];
        for(var i=0;i<partsObj.parts.length;i++){
          var p = partsObj.parts[i];
          if(p.parts){
            for(var j=0;j<p.parts.length;j++){
              var p2 = p.parts[j];
              if(p2.interactiveObj){
                result.push(p2);
              }
            }
          }
          else{
            if(p.interactiveObj){
              result.push(p);
            }
          }
        }
        return result;
      }

    });
  });