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
  'dojo/text!./templates/Filter.html',
  'jimu/filterUtils',
  'dijit/registry',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/aspect',
  'dojo/query',
  'dojo/Deferred',
  'esri/request',
  'esri/lang',
  './LoadingIndicator',
  './_SingleFilter',
  './_FilterSet',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, filterUtils,
  registry, lang, html, array, on, aspect, query, Deferred, esriRequest, esriLang,
  LoadingIndicator, SingleFilter, FilterSet, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, filterUtils], {
    templateString: template,
    baseClass: 'jimu-filter',
    declaredClass: 'jimu.dijit.Filter',
    nls: null,

    //test urls:
    //http://discomap.eea.europa.eu/arcgis/rest/services/NoiseWatch/NoiseWatch_Overview_WM/MapServer/8
    //http://ec2-50-16-225-130.compute-1.amazonaws.com/arcgis/rest/services/Agriculture/Inspection_history/MapServer/0
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/5
    //http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0
    _validOptions: false,
    _layerDefinition: null,

    //options:
    url: null,//required    
    expr: null,//optional
    partsObj: null,//optional    

    //public methods:
    //buildByExpr: expr->UI
    //buildByFilterObj: partsObj->UI
    //toJson: UI->partsObj
    //getFilterObjByExpr(inherited): expr->partsObj
    //getExprByFilterObj(inherited): partsObj->expr

    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.filterBuilder;
      var strSelect = '<select data-dojo-attach-point=allAnySelect>'+
      '<option value=AND selected>'+this.nls.all+'</option>'+
      '<option value=OR>'+this.nls.any+'</option></select>';
      this.nls.matchMsg = esriLang.substitute({any_or_all:strSelect},this.nls.matchMsg);
    },

    postCreate:function(){
      this.inherited(arguments);

      var validLD = this._validateLayerDefinition(this._layerDefinition);
      var validUrl = this.url && typeof this.url === 'string';

      if(!validUrl){
        this._showErrorOptions(this.nls.error.invalidParams);
      }
      else{
        if(validLD){
          this._init();
        }
        else{
          this._setUrl(this.url);
        }
      }
    },

    reset:function(){
      this.removeAllFilters();
      this.url = null;
      this._layerDefinition = null;
      this.expr = null;
      this.partsObj = null;
    },

    build:function(){
      this._init();
    },

    buildByExpr:function(expr){
      this.expr = expr;
      this._init("expr");
    },

    //partsObj:{logicalOperator,parts,expr}
    buildByFilterObj:function(partsObj){
      this.partsObj = partsObj;
      this._init("partsObj");
    },

    removeAllFilters:function(){
      this._destroyAllFilters();
    },

    _validateLayerDefinition:function(_layerDefinition){
      return this._isObject(_layerDefinition);
    },

    _setUrl:function(url){
      var def = new Deferred();
      this.url = url;
      this._layerDefinition = null;
      this.removeAllFilters();
      html.setStyle(this.contentSection, 'display', 'block');
      html.setStyle(this.errorSection, 'display', 'none');
      this.errorTip.innerHTML = '';
      this.loading.show();

      esriRequest({
        url: this.url,
        content: {
          f: 'json'
        },
        handleAs: 'json',
        callbackParamName: 'callback',
        preventCache: true
      }).then(lang.hitch(this,function(response){
        if(!this.domNode){
          return;
        }
        this.loading.hide();
        this._layerDefinition = response;
        this._init();
        def.resolve(response);
      }),lang.hitch(this,function(error){
        console.error(error);
        if(!this.domNode){
          return;
        }
        this.loading.hide();
        def.reject(error);
      }));

      return def;
    },

    _init:function(mode){
      if(!this._isString(this.url)){
        return;
      }
      if(!this._validateLayerDefinition(this._layerDefinition)){
        return;
      }
      html.setStyle(this.contentSection,'display','block');
      html.setStyle(this.errorSection,'display','none');
      this.removeAllFilters();
      var fields = this._layerDefinition.fields;
      if (fields && fields.length > 0) {
        fields = array.filter(fields, lang.hitch(this, function(fieldInfo) {
          return this._supportFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));
        var invalidFields = fields && fields.length > 0;
        if(!invalidFields){
          this._showErrorOptions(this.nls.error.noFilterFields);
          return;
        }
        this._validOptions = true;
        html.addClass(this.btnAddSet, 'enable');
        html.addClass(this.btnAddExp, 'enable');
        this.createFieldsStore();

        if(mode === 'expr'){
          if(this._isString(this.expr)){
            var expression = this.expr.replace(/\s/gi,'');
            if(expression === '1=1'){
              this.removeAllFilters();
            }
            this._parseExpr(this.expr);
          }
        }
        else if(mode === 'partsObj'){
          if(this._validatePartsObj(this.partsObj)){
            this._parsePartsObj(this.partsObj);
          }
        }
        else{
          if(this._validatePartsObj(this.partsObj)){
            this._parsePartsObj(this.partsObj);
          }
          else if(this._isString(this.expr)){
            this._parseExpr(this.expr);
          }
        }
      }
    },

    /**************************************************/
    /****  stringify                               ****/
    /**************************************************/
    toJson:function(){
      var json = {
        logicalOperator: this.allAnySelect.value,
        parts: []
      };
      var filters = this._getAllSingleFiltersAndFilterSets();
      if(filters.length === 0){
        json.expr = '1=1';
        return json;
      }
      array.forEach(filters,lang.hitch(this,function(filter){
        var part = filter.toJson();
        json.parts.push(part);
      }));
      var validParts = array.every(json.parts,lang.hitch(this,function(part){
        return part;
      }));
      if(validParts && json.parts.length > 0){
        json.expr = this.getExprByFilterObj(json);
        return json;
      }
      else{
        return null;
      }
    },

    /**************************************************/
    /****  lists                                   ****/
    /**************************************************/
    
    createFieldsStore: function(){
      if(!this._layerDefinition.fields || this._layerDefinition.fields.length === 0){
        this._showErrorOptions(this.nls.error.noFilterFields);
        return;
      }
      
      var copyLayerInfo = lang.mixin({},this._layerDefinition);
      var layerInfoFields = copyLayerInfo.fields;
      // layerInfoFields = layerInfoFields.sort(function(a, b){
      //   a.label = a.alias || a.name;
      //   b.label = b.alias || b.name;
      //   return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
      // });

      var validFieldCount = this.setFieldsStoreByFieldInfos(layerInfoFields);

      if(validFieldCount === 0){
        this._showErrorOptions(this.nls.error.noFilterFields);
      }
    },

    /**************************************************/
    /****  parse                                   ****/
    /**************************************************/
    testParser: function(){
      /*
       this.getFilterObjByExpr("FID = 5");
       this.getFilterObjByExpr("CITY_NAME = 'x'");
       this.getFilterObjByExpr("FID = 5 AND CITY_NAME = 'x'");
       this.getFilterObjByExpr("FID = 5 OR CITY_NAME = 'x'");
       this.getFilterObjByExpr("FID = 5 AND (CITY_NAME = 'x' OR FID = 3)");
       this.getFilterObjByExpr("(FID = 5) and (CITY_NAME = 'x' or FID = 3)");
       this.getFilterObjByExpr("(CITY_NAME = 'x' OR FID = 3) AND FID = 5");
       this.getFilterObjByExpr("(CITY_NAME = 'x' OR FID = 3) AND (FID = 5)");
       this.getFilterObjByExpr("unknown = 'x'");
       this.getFilterObjByExpr("CITY_NAME = 'x'");
       this.getFilterObjByExpr("FID = 10");
       this.getFilterObjByExpr("CITY_NAME <> 'x'");
       this.getFilterObjByExpr("FID <> 10");
       this.getFilterObjByExpr("FID < 10");
       this.getFilterObjByExpr("FID > 10");
       this.getFilterObjByExpr("FID >= 10");
       this.getFilterObjByExpr("FID <= 10");
       this.getFilterObjByExpr("CITY_NAME LIKE 'x%'");
       this.getFilterObjByExpr("CITY_NAME LIKE '%x'");
       this.getFilterObjByExpr("CITY_NAME LIKE '%x%'");
       this.getFilterObjByExpr("CITY_NAME NOT LIKE '%x%'");
       this.getFilterObjByExpr("FID BETWEEN 1 AND 10");
       this.getFilterObjByExpr("FID NOT BETWEEN 1 AND 10");
       this.getFilterObjByExpr("CITY_NAME IS NULL");
       this.getFilterObjByExpr("CITY_NAME IS NOT NULL");
       this.getFilterObjByExpr("CREATE_DATE BETWEEN '2012-11-02 00:00:00' AND '2012-11-02 23:59:59'");
       this.getFilterObjByExpr("CREATE_DATE NOT BETWEEN '2012-11-02 00:00:00' AND '2012-11-03 00:00:00'");
       var partsObj = this.getFilterObjByExpr("(COUNTY_NAME <> COUNTRY_NAME) AND (CITY_NAME LIKE 'Boul%')");
       var partsObj = this.getFilterObjByExpr(" COUNTY_NAME <> COUNTRY_NAME OR CITY_NAME LIKE 'Boul%'");
       var partsObj = this.getFilterObjByExpr("(COUNTY_NAME <> COUNTRY_NAME) OR (CITY_NAME LIKE 'Boul%') OR (FID > 10 AND FID < 100)");
       var partsObj = this.getFilterObjByExpr("(COUNTY_NAME <> COUNTRY_NAME) OR (CITY_NAME LIKE 'Boul%') OR (FID > 10 AND FID < 100 AND CITY_NAME = 'ADAMS')");
       var partsObj = this.getFilterObjByExpr(" (CREATE_DATE BETWEEN '2012-11-01 00:00:00' AND '2012-11-30 23:59:59') AND (CREATE_DATE BETWEEN '2012-11-01 00:00:00' AND '2012-11-01 23:59:59')");
       var partsObj = this.getFilterObjByExpr("(COUNTY_NAME = 'BOULDER') AND (CITY_NAME = 'ADAMS' OR FID BETWEEN 1 AND 10 OR FIPS_CODE IS NOT NULL)");
       
       defExpr = "(COUNTY_NAME = '''BOULD''ER''') AND CREATE_DATE BETWEEN '2012-11-02 00:00:00' AND '2012-11-02 23:59:59' AND (CITY_NAME = 'ADAMS' OR FID BETWEEN 1 AND 10 OR CITY_NAME = 'ADAMS AND BOULDER')";
       */
      var partsObj = this.getFilterObjByExpr("(COUNTY_NAME = 'BOULDER') AND (CITY_NAME = 'ADAMS' OR FID BETWEEN 1 AND 10 OR FIPS_CODE IS NOT NULL)");
      this._buildEditUIByPartsObj(partsObj);
    },

    _parsePartsObj:function(partsObj){
      if(!this._validatePartsObj(partsObj)){
        return;
      }
      this.removeAllFilters();
      this._buildEditUIByPartsObj(partsObj);
    },

    _parseExpr:function(expr){
      if(this._validateLayerDefinition(this._layerDefinition)){
        return;
      }
      this._destroyAllFilters();
      if(!expr || typeof expr !== 'string'){
        this._showErrorOptions(this.nls.error.invalidSQL);
        return;
      }
      var partsObj = this.getFilterObjByExpr(expr);
      if(!partsObj){
        this._showErrorOptions(this.nls.error.cantParseSQL);
        return;
      }
      this._buildEditUIByPartsObj(partsObj);
    },

    _buildEditUIByPartsObj:function(partsObj){
      if(!partsObj){
        return;
      }
      this._destroyAllFilters();
      this.allAnySelect.value = partsObj.logicalOperator;
      array.forEach(partsObj.parts,lang.hitch(this,function(item){
        if(item.parts){
          //FilterSet
          this._addFilterSet(item);
        }
        else if(item.fieldObj && item.operator && item.valueObj){
          //SingleFilter
          this._addSingleFilter(item);
        }
      }));
    },

    /**************************************************/
    /****  edit                                    ****/
    /**************************************************/

    _addSingleFilter:function(/*optional*/ part){
      var args = {
        url: this.url,
        layerInfo: this._layerDefinition,
        stringFieldType: this._stringFieldType,
        dateFieldType: this._dateFieldType,
        numberFieldTypes: this._numberFieldTypes,
        part: part,
        OPERATORS: lang.mixin({}, this.OPERATORS)
      };
      var singleFilter = new SingleFilter(args);
      singleFilter.placeAt(this.allExpsBox);
      singleFilter.startup();
      this.own(aspect.after(singleFilter,'_destroySelf',lang.hitch(this,this._checkFilterNumbers)));
      this._checkFilterNumbers();
    },

    _addFilterSet:function(/*optional*/ partsObj){
      var args = {
        url: this.url,
        layerInfo: this._layerDefinition,
        stringFieldType: this._stringFieldType,
        dateFieldType: this._dateFieldType,
        numberFieldTypes: this._numberFieldTypes,
        partsObj: partsObj,
        OPERATORS: lang.mixin({}, this.OPERATORS)
      };
      var filterSet = new FilterSet(args);
      filterSet.placeAt(this.allExpsBox);
      filterSet.startup();
      this.own(aspect.after(filterSet,'_destroySelf',lang.hitch(this,this._checkFilterNumbers)));
      this._checkFilterNumbers();
    },

    _destroyAllFilters:function(){
      var filters = this._getAllSingleFiltersAndFilterSets();
      while(filters.length > 0){
        var f = filters[0];
        f.destroy();
        filters.splice(0,1);
      }
      this._checkFilterNumbers();
    },

    _getAllSingleFiltersAndFilterSetsDoms: function(){
      return query('.allExpsBox>.jimu-single-filter,.allExpsBox>.jimu-filter-set',this.contentSection);
    },

    _getAllSingleFiltersAndFilterSets:function(){
      var nodes = this._getAllSingleFiltersAndFilterSetsDoms();
      var filters = array.map(nodes,lang.hitch(this,function(node){
        return registry.byNode(node);
      }));
      return filters;
    },

    _checkFilterNumbers:function(){
      var filterDoms = this._getAllSingleFiltersAndFilterSetsDoms();
      if(filterDoms.length > 1){
        html.setStyle(this.matchMsg,'display','block');
      }
      else{
        html.setStyle(this.matchMsg,'display','none');
      }
      array.forEach(filterDoms, lang.hitch(this, function(filterDom, index){
        html.removeClass(filterDom, 'even-filter');
        html.removeClass(filterDom, 'odd-filter');
        var cName = index % 2 === 0 ? "even-filter" : "odd-filter";
        html.addClass(filterDom, cName);
      }));
    },

    _showErrorOptions:function(strError){
      html.setStyle(this.contentSection,'display','none');
      html.setStyle(this.errorSection,'display','none');//block
      this.errorTip.innerHTML = strError;
      this.loading.hide();
    },

    _onBtnAddSetClick:function(){
      if(!this._layerDefinition || !this._validOptions){
        return;
      }
      this._addFilterSet();
    },

    _onBtnAddExpClick:function(){
      if(!this._layerDefinition || !this._validOptions){
        return;
      }
      this._addSingleFilter();
    }
  });
});