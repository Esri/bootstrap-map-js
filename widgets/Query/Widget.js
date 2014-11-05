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
    'dojo/_base/query',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/_base/fx',
    'dojo/promise/all',
    'dojo/on',
    'dojo/Deferred',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'jimu/dijit/Message',
    'jimu/dijit/LoadingShelter',
    'jimu/dijit/DrawBox',
    'jimu/utils',
    './Parameters',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    'esri/renderers/SimpleRenderer',
    'esri/graphic',
    'esri/geometry/Point',
    'esri/geometry/Polyline',
    'esri/geometry/Extent',
    'esri/InfoTemplate',
    'esri/symbols/jsonUtils',
    'esri/lang',
    'esri/request',
    'esri/graphicsUtils'
  ],
  function(declare, lang, query, html, array, fx, all, on, Deferred, _WidgetsInTemplateMixin, BaseWidget,
    Message, LoadingShelter, DrawBox, jimuUtils, Parameters, EsriQuery, QueryTask, GraphicsLayer,
    FeatureLayer, SimpleRenderer, Graphic, Point, Polyline, Extent, InfoTemplate, symbolJsonUtils,
    esriLang, esriRequest, graphicsUtils) {/*jshint unused: false*/
    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'Query',
      baseClass: 'jimu-widget-query',
      isValidConfig:false,
      currentAttrs:null,
      tempResultLayer: null,

      operationalLayers:[],

      //test:
      //http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer
      //http://map.floridadisaster.org/GIS/rest/services/Events/FL511_Feeds/MapServer/4
      //http://maps.usu.edu/ArcGIS/rest/services/MudLake/MudLakeMonitoringSites/MapServer/0

      _resetCurrentAttrs: function(){
        this.currentAttrs = {
          queryTr:null,
          config:null,
          layerInfo:null,
          askForValues: null,
          query:{
            maxRecordCount: 1000,
            resultLayer: null,//GraphicsLayer or FeatureLayer
            where:'',
            nextIndex: 0,
            objectIds:[]//optional
          }
        };
      },

      postMixInProperties: function(){
        this.inherited(arguments);
        var strClearResults = this.nls.clearResults;
        this.nls.operationalTip = esriLang.substitute({clearResults:strClearResults},this.nls.operationalTip);
      },

      postCreate:function(){
        this.inherited(arguments);
        this._initDrawBox();
        this._resetAndAddTempResultLayer();
        this._initSelf();
      },

      onOpen: function(){
        if(this.tempResultLayer){
          this.tempResultLayer.show();
        }
      },

      onClose:function(){
        if(this.tempResultLayer){
          this.tempResultLayer.hide();
        }
        this._hideInfoWindow();
        this._resetDrawBox();
        this.inherited(arguments);
      },

      destroy:function(){
        this._hideInfoWindow();
        this._resetDrawBox();
        this._removeAllResultLayers();
        this.inherited(arguments);
      },

      _resetAndAddTempResultLayer: function(){
        this._removeTempResultLayer();
        this.tempResultLayer = new GraphicsLayer();
        this.map.addLayer(this.tempResultLayer);
      },

      _removeTempResultLayer: function(){
        if(this.tempResultLayer){
          this.map.removeLayer(this.tempResultLayer);
        }
        this.tempResultLayer = null;
      },

      _removeAllResultLayers: function(){
        this._hideInfoWindow();
        this._removeTempResultLayer();
        this._removeAllOperatonalLayers();
        this._clearResultPage();
        this._fromCurrentPageToQueryList();
      },

      _fromCurrentPageToQueryList: function(){
        html.setStyle(this.queryList, 'display', 'block');

        if(html.getStyle(this.queryParams, 'display') === 'block'){
          this._slide(this.queryList, -100, 0);
          this._slide(this.queryParams, 0, 100);
        }
        else if(html.getStyle(this.queryResults, 'display') === 'block'){
          this._slide(this.queryList, -100, 0);
          this._slide(this.queryResults, 0, 100);
        }
      },

      _removeAllOperatonalLayers: function(){
        var layers = this.operationalLayers;
        while(layers.length > 0){
          var layer = layers[0];
          if(layer){
            this.map.removeLayer(layer);
          }
          layers[0]=null;
          layers.splice(0,1);
        }
        this.operationalLayers = [];
      },

      _isConfigValid:function(){
        return true;
      },

      _initDrawBox: function(){
        this.drawBox = new DrawBox({
          types: ['point','polyline','polygon'],
          map: this.map,
          showClear: true,
          keepOneGraphic: true
        });
        this.drawBox.placeAt(this.drawBoxDiv);
        this.drawBox.startup();
      },

      _initSelf:function(){
        var uniqueId = jimuUtils.getRandomString();
        var cbxName = "Query_"+uniqueId;
        this.cbxUseMapExtent.name = cbxName;
        this.cbxDrawGraphic.name = cbxName;

        this.paramsDijit = new Parameters({
          nls: this.nls
        });
        this.paramsDijit.placeAt(this.parametersDiv);
        this.paramsDijit.startup();
        
        this.isValidConfig = this._isConfigValid();
        if(!this.isValidConfig){
          html.setStyle(this.queriesNode,'display','none');
          html.setStyle(this.invalidConfigNode,{
            display:'block',
            left:0
          });
          return;
        }

        var queries = this.config.queries;
        array.forEach(queries,lang.hitch(this,function(singleConfig,index){
          var name = singleConfig.name;
          var strTr = '<tr class="single-query">'+
          '<td class="first-td"></td>'+
          '<td class="second-td">'+
            '<div class="query-name-div"></div>'+
          '</td>'+
          '<td class="third-td">'+
            '<div class="arrow"></div>'+
          '</td>'+
          '</tr>';
          var tr = html.toDom(strTr);
          var queryNameDiv = query(".query-name-div", tr)[0];
          queryNameDiv.innerHTML = name;
          html.place(tr, this.queriesTbody);
          tr.singleConfig = singleConfig;
          if(index%2 === 0){
            html.addClass(tr,'even');
          }
          else{
            html.addClass(tr,'odd');
          }
        }));
      },

      _slide:function(dom, startLeft, endLeft){
        html.setStyle(dom, 'display', 'block');
        html.setStyle(dom, 'left', startLeft+"%");
        fx.animateProperty({
          node: dom,
          properties:{
            left:{
              start: startLeft,
              end: endLeft,
              units:'%'
            }
          },
          duration: 500,
          onEnd: lang.hitch(this,function(){
            html.setStyle(dom, 'left', endLeft);
            if(endLeft === 0){
              html.setStyle(dom, 'display', 'block');
            }
            else{
              html.setStyle(dom, 'display', 'none');
            }
          })
        }).play();
      },

      _onQueryListClicked:function(event){
        var target = event.target||event.srcElement;
        var tr = jimuUtils.getAncestorDom(target,lang.hitch(this,function(dom){
          return html.hasClass(dom,'single-query');
        }),10);
        if(!tr){
          return;
        }

        var singleConfig = tr.singleConfig;
        this._resetCurrentAttrs();
        this.currentAttrs.queryTr = tr;
        this.currentAttrs.config = lang.clone(singleConfig);
        this.currentAttrs.layerInfo = this.currentAttrs.queryTr.layerInfo;//may be null

        var filterInfo = this.currentAttrs.config.filter;
        var parts = filterInfo.parts;
        this.currentAttrs.askForValues = array.some(parts, lang.hitch(this, function(item) {
          if (item.parts) {
            return array.some(item.parts, lang.hitch(this, function(part) {
              return part.interactiveObj;
            }));
          } else {
            return item.interactiveObj;
          }
        }));

        if(this.currentAttrs.askForValues){
          html.setStyle(this.parametersDiv, 'display', 'block');
        }
        else{
          html.setStyle(this.parametersDiv, 'display', 'none');
        }
        
        query('tr.single-query',this.queriesTbody).removeClass('selected');
        html.addClass(this.currentAttrs.queryTr,'selected');

        var callback = lang.hitch(this, function() {
          this.currentAttrs.layerInfo = this.currentAttrs.queryTr.layerInfo;
          this._fromQueryListToQueryParams();
        });

        if(this.currentAttrs.queryTr.layerInfo){
          callback();
        }
        else{
          var layerUrl = this.currentAttrs.config.url;
          this.shelter.show();
          esriRequest({
            url: layerUrl,
            content: {
              f: 'json'
            },
            handleAs: 'json',
            callbackParamName: 'callback'
          }).then(lang.hitch(this, function(response){
            if (!this.domNode) {
              return;
            }
            this.shelter.hide();
            this.currentAttrs.queryTr.layerInfo = response;
            this.currentAttrs.layerInfo = this.currentAttrs.queryTr.layerInfo;
            callback();
          }), lang.hitch(this, function(err){
            console.error(err);
            if (!this.domNode) {
              return;
            }
            this.shelter.hide();
            var errMsg = "";
            if(err && err.httpCode === 403){
              errMsg = this.nls.noPermissionsMsg;
            }
            this._showQueryErrorMsg(errMsg);
          }));
        }
      },

      _onCbxUseSpatialClicked: function(){
        if(this.cbxUseSpatial.checked){
          html.setStyle(this.selectSpatialDiv, 'display', 'block');
        }
        else{
          html.setStyle(this.selectSpatialDiv, 'display', 'none');
        }

        if (this.cbxUseMapExtent.checked) {
          this._onCbxUseMapExtentClicked();
        } else {
          this._onCbxDrawGraphicClicked();
        }

        this._resetDrawBox();
      },

      _onCbxUseMapExtentClicked: function(){
        if(this.cbxUseMapExtent.checked){
          this._resetDrawBox();
          html.setStyle(this.drawBoxDiv, 'display', 'none');
        }
      },

      _onCbxDrawGraphicClicked: function(){
        if(this.cbxDrawGraphic.checked){
          html.setStyle(this.drawBoxDiv, 'display', 'block');
        }
      },

      _onBtnClearAllClicked: function(){
        this._removeAllResultLayers();
      },

      _resetDrawBox: function(){
        this.drawBox.deactivate();
        this.drawBox.clear();
      },

      _resetQueryParamsPage: function(){
        this.paramsDijit.clear();
        this.cbxOperational.checked = false;
        this.cbxUseSpatial.checked = false;
        this._onCbxUseSpatialClicked();
        this._resetDrawBox();
      },

      _getLayerIndexByLayerUrl: function(layerUrl){
        var lastIndex = layerUrl.lastIndexOf("/");
        var a = layerUrl.slice(lastIndex + 1, layerUrl.length);
        return parseInt(a, 10);
      },

      _getServiceUrlByLayerUrl: function(layerUrl){
        var lastIndex = layerUrl.lastIndexOf("/");
        var serviceUrl = layerUrl.slice(0, lastIndex);
        return serviceUrl;
      },

      _fromQueryListToQueryParams:function(){
        //reset UI of params page
        this._resetQueryParamsPage();
        var layerUrl = this.currentAttrs.config.url;
        this.btnResultsBack.innerHTML = '&lt; ' + this.nls.parameters;
        var partsObj = lang.clone(this.currentAttrs.config.filter);
        this.paramsDijit.build(partsObj, this.currentAttrs.layerInfo);

        //slide
        var showDom = this.queryParams;
        var hideDom = this.queryResults;

        html.setStyle(this.queryList, {
          left: 0,
          display: 'block'
        });

        html.setStyle(showDom, {
          left: '100%',
          display: 'block'
        });

        html.setStyle(hideDom, 'display', 'none');
        this._slide(this.queryList, 0, -100);
        this._slide(showDom, 100, 0);
      },

      _onBtnParamsBackClicked:function(){
        this._resetDrawBox();
        html.setStyle(this.queryList,'display','block');
        html.setStyle(this.queryParams,'display','block');
        html.setStyle(this.queryResults,'display','none');
        this._slide(this.queryList, -100, 0);
        this._slide(this.queryParams, 0, 100);
      },

      //start to query
      _onBtnApplyClicked:function(){
        //reset result page
        this._clearResultPage();
        html.setStyle(this.resultsNumberDiv, 'display', 'none');

        var layerInfo = this.currentAttrs.layerInfo;

        //query{maxRecordCount,resultLayer,where,nextIndex,objectIds}
        //set query.where
        if(this.currentAttrs.askForValues){
          var newExpr = this.paramsDijit.getNewFilterExpr();
          var validExpr = newExpr && typeof newExpr === 'string';
          if(!validExpr){
            return;
          }
          this.currentAttrs.query.where = newExpr;
        }
        else{
          this.currentAttrs.query.where = this.currentAttrs.config.filter.expr;
        }

        //set query.maxRecordCount
        this.currentAttrs.query.maxRecordCount = layerInfo.maxRecordCount || 1000;

        //set query.nextIndex
        this.currentAttrs.query.nextIndex = 0;

        //set query.objectIds
        this.currentAttrs.query.objectIds = [];

        var where = this.currentAttrs.query.where;
        var geometry = null;

        if(this.cbxUseSpatial.checked){
          if(this.cbxUseMapExtent.checked){
            geometry = this.map.extent;
          }
          else{
            var gs = this.drawBox.drawLayer.graphics;
            if(gs.length > 0){
              var g = gs[0];
              geometry = g.geometry;
            }
          }
          if(!geometry){
            new Message({message: this.nls.specifySpatialFilterMsg});
            return;
          }
        }

        if(this.tempResultLayer){
          this.map.removeLayer(this.tempResultLayer);
        }
        this.tempResultLayer = null;

        //set query.resultLayer
        this._createQueryResultLayer();

        this._resetDrawBox();

        html.setStyle(this.queryList, 'display','none');
        html.setStyle(this.queryParams, 'display', 'block');
        html.setStyle(this.queryResults, 'display', 'block');
        this._slide(this.queryParams, 0, -100);
        this._slide(this.queryResults, 100, 0);

        var currentVersion = 0;
        if(layerInfo.currentVersion){
          currentVersion = parseFloat(layerInfo.currentVersion);
        }

        if(currentVersion > 10.0){
          this._doQuery_SupportObjectIds(where, geometry);
        }
        else{
          this._doQuery_NotSupportObjectIds(where, geometry);
        }
        
      },

      _createQueryResultLayer: function(){
        var resultLayer = null;

        var symbol = symbolJsonUtils.fromJson(this.currentAttrs.config.resultsSymbol);
        var renderer = new SimpleRenderer(symbol);

        if (this.cbxOperational.checked) {
          //new a feature layer
          var layerInfo = lang.clone(this.currentAttrs.layerInfo);
          var queryName = this._getBestQueryName(this.currentAttrs.config.name||'');

          //override layerInfo
          layerInfo.name = queryName;
          layerInfo.drawingInfo.renderer = renderer.toJson();
          layerInfo.drawingInfo.transparency = 0;
          layerInfo.minScale = 0;
          layerInfo.maxScale = 0;
          layerInfo.effectiveMinScale = 0;
          layerInfo.effectiveMaxScale = 0;
          layerInfo.defaultVisibility = true;

          var featureCollection = {
            layerDefinition: layerInfo,
            featureSet: null
          };
          resultLayer = new FeatureLayer(featureCollection);
          this.operationalLayers.push(resultLayer);
          this.map.addLayer(resultLayer);
        } else {
          //use graphics layer
          this._resetAndAddTempResultLayer();
          resultLayer = this.tempResultLayer;
        }

        this.currentAttrs.query.resultLayer = resultLayer;
        this.queryResults.resultLayer = resultLayer;

        //set renderer
        resultLayer.setRenderer(renderer);

        return resultLayer;
      },

      _getBestQueryName: function(queryName){
        if(queryName){
          queryName += " _" + this.nls.queryResult;
        }
        else{
          queryName += this.nls.queryResult;
        }
        var finalName = queryName;
        var allNames = array.map(this.map.graphicsLayerIds, lang.hitch(this, function(glId){
          var layer = this.map.getLayer(glId);
          return layer.name;
        }));
        var flag = 2;
        while(array.indexOf(allNames, finalName) >= 0){
          finalName = queryName + '_' + flag;
          flag++;
        }
        return finalName;
      },

      /*--------------------query support objectIds------------------------*/
      _doQuery_SupportObjectIds: function(where, geometry){
        html.setStyle(this.resultsNumberDiv, 'display', 'block');
        var resultLayer = this.currentAttrs.query.resultLayer;

        this.shelter.show();
        var defIDs = this._queryIds(where, geometry);
        defIDs.then(lang.hitch(this, function(objectIds){
          if(!this.domNode){
            return;
          }

          var hasResults = objectIds && objectIds.length > 0;

          if(!hasResults){
            this.shelter.hide();
            return;
          }
          
          var allCount = objectIds.length;
          this.numSpan.innerHTML = allCount;
          this.currentAttrs.query.objectIds = objectIds;
          this.currentAttrs.query.nextIndex = 0;//reset nextIndex
          var maxRecordCount = this.currentAttrs.query.maxRecordCount;

          var partialIds = [];
          if (allCount > maxRecordCount) {
            partialIds = objectIds.slice(0, maxRecordCount);
          } else {
            partialIds = objectIds;
          }

          //do query by objectIds
          var def = this._queryByObjectIds(partialIds, true);
          def.then(lang.hitch(this, function(response){
            if (!this.domNode) {
              return;
            }
            // this.currentAttrs.query.nextIndex += partialIds.length;
            this.shelter.hide();
            var features = response.features;
            this.currentAttrs.query.maxRecordCount= features.length;
            this.currentAttrs.query.nextIndex += features.length;

            this._addResultItems(features, resultLayer);
            this._zoomToLayer(resultLayer);
          }), lang.hitch(this, function(err){
            console.error(err);
            if (!this.domNode) {
              return;
            }
            this.shelter.hide();
            if(resultLayer){
              this.map.removeLayer(resultLayer);
            }
            resultLayer = null;
            this._showQueryErrorMsg();
          }));
        }), lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          if(resultLayer){
            this.map.removeLayer(resultLayer);
          }
          resultLayer = null;
          this._showQueryErrorMsg();
        }));
      },

      _onResultsScroll:function(){
        if(!jimuUtils.isScrollToBottom(this.resultsContainer)){
          return;
        }

        var layerInfo = this.currentAttrs.layerInfo;

        var currentVersion = 0;
        if(layerInfo.currentVersion){
          currentVersion = parseFloat(layerInfo.currentVersion);
        }

        if(currentVersion < 10.0){
          return;
        }

        var resultLayer = this.currentAttrs.query.resultLayer;
        var maxRecordCount = this.currentAttrs.query.maxRecordCount;
        var allObjectIds = this.currentAttrs.query.objectIds;
        var nextIndex = this.currentAttrs.query.nextIndex;
        if(nextIndex >= allObjectIds.length){
          return;
        }

        var countLeft = allObjectIds.length - nextIndex;
        var queryNum = Math.min(countLeft, maxRecordCount);
        var partialIds = allObjectIds.slice(nextIndex, nextIndex + queryNum);
        if(partialIds.length === 0){
          return;
        }

        this.shelter.show();
        //do query by objectIds
        var def = this._queryByObjectIds(partialIds, true);
        def.then(lang.hitch(this, function(response) {
          if (!this.domNode) {
            return;
          }
          
          this.shelter.hide();
          var features = response.features;
          this.currentAttrs.query.nextIndex += features.length;
          this._addResultItems(features, resultLayer);
        }), lang.hitch(this, function(err) {
          console.error(err);
          if (!this.domNode) {
            return;
          }
          this._showQueryErrorMsg();
          this.shelter.hide();
        }));
      },

      /*--------------------query doesn't support objectIds-------------------------*/
      _doQuery_NotSupportObjectIds: function(where, geometry){
        html.setStyle(this.resultsNumberDiv, 'display', 'none');
        var resultLayer = this.currentAttrs.query.resultLayer;

        this.shelter.show();
        this._query(where, geometry).then(lang.hitch(this, function(response){
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          var features = response.features;
          this._addResultItems(features, resultLayer);
          this._zoomToLayer(resultLayer);
        }), lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          if(resultLayer){
            this.map.removeLayer(resultLayer);
          }
          resultLayer = null;
          this._showQueryErrorMsg();
        }));
      },


      /*-------------------------common functions----------------------------------*/
      _clearResultPage: function(){
        this._hideInfoWindow();
        this._unSelectResultTr();
        html.empty(this.resultsTbody);
        this.numSpan.innerHTML = '0';
      },

      _unSelectResultTr: function(){
        if(this.queryResults.resultTr){
          html.removeClass(this.queryResults.resultTr,'selected');
        }
        this.queryResults.resultTr = null;
      },

      _selectResultTr: function(tr){
        this._unSelectResultTr();
        this.queryResults.resultTr = tr;
        if(this.queryResults.resultTr){
          html.addClass(this.queryResults.resultTr, 'selected');
        }
      },

      _zoomToLayer: function(gl){
        try{
          var ext = graphicsUtils.graphicsExtent(gl.graphics);
          if(ext){
            ext = ext.expand(1.4);
            this.map.setExtent(ext);
          }
        }
        catch(e){
          console.log(e);
        }
      },

      // _onClearClicked: function(){
      //   this._clearResultPage();
      //   var layer = this.queryResults.resultLayer;
      //   if(layer){
      //     this.map.removeLayer(layer);
      //   }
      //   this.queryResults.resultLayer = null;
      // },

      _getOutputFields: function(){
        var objectIdField = this.currentAttrs.config.objectIdField;
        var outFields = array.map(this.currentAttrs.config.popup.fields, lang.hitch(this,function(fieldInfo){
          return fieldInfo.name;
        }));
        if(array.indexOf(outFields, objectIdField) < 0){
          outFields.push(objectIdField);
        }
        return outFields;
      },

      _queryIds: function(where, /*optional*/ geometry){
        var queryParams = new EsriQuery();
        queryParams.where = where;
        if(geometry){
          queryParams.geometry = geometry;
        }
        queryParams.returnGeometry = false;
        queryParams.outSpatialReference = this.map.spatialReference;
        var queryTask = new QueryTask(this.currentAttrs.config.url);
        return queryTask.executeForIds(queryParams);
      },

      _queryByObjectIds: function(objectIds, returnGeometry){
        var queryParams = new EsriQuery();
        queryParams.returnGeometry = !!returnGeometry;
        queryParams.outSpatialReference = this.map.spatialReference;
        queryParams.outFields = this._getOutputFields();
        queryParams.objectIds = objectIds;
        var queryTask = new QueryTask(this.currentAttrs.config.url);
        return queryTask.execute(queryParams);
      },

      _query: function(where, /*optional*/ geometry){
        var queryParams = new EsriQuery();
        queryParams.where = where;
        if(geometry){
          queryParams.geometry = geometry;
        }
        queryParams.outSpatialReference = this.map.spatialReference;
        queryParams.returnGeometry = true;
        queryParams.outFields = this._getOutputFields();
        var queryTask = new QueryTask(this.currentAttrs.config.url);
        return queryTask.execute(queryParams);
      },

      _addResultItems: function(features, resultLayer){
        var featuresCount = features.length;

        var sym = symbolJsonUtils.fromJson(this.currentAttrs.config.resultsSymbol);
        var popup = this.currentAttrs.config.popup;
        var fieldNames = array.map(popup.fields,lang.hitch(this,function(fieldInfo){
          return fieldInfo.name;
        }));

        var fieldInfosInAttrContent = array.filter(popup.fields,lang.hitch(this,function(fieldInfo){
          return fieldInfo.showInInfoWindow;
        }));

        array.forEach(features, lang.hitch(this, function(feature, i){
          var trClass = '';
          if(i%2 === 0){
            trClass = 'even';
          }
          else{
            trClass = 'odd';
          }

          //process attributes
          var attributes = feature.attributes;
          array.forEach(popup.fields, lang.hitch(this, function(fieldInfo){
            var fieldName = fieldInfo.name;
            if(attributes.hasOwnProperty(fieldName)){
              var fieldValue = attributes[fieldName];
              if(fieldInfo.type === 'esriFieldTypeDate'){
                if(fieldValue){
                  var date = new Date(parseInt(fieldValue, 10));
                  fieldValue = date.toLocaleDateString();
                  attributes[fieldName] = fieldValue;
                }
              }
              if(fieldValue === null){
                attributes[fieldName] = this.nls.noValue;
              }
            }
          }));

          if(feature.geometry){
            feature.setSymbol(sym);
            resultLayer.add(feature);
          }

          var options = {
            feature: feature,
            titleTemplate: popup.title,
            fieldInfosInAttrContent: fieldInfosInAttrContent,
            trClass: trClass
          };

          this._createQueryResultItem(options);
        }));
      },

      _createQueryResultItem:function(options){
        var feature = options.feature;
        var titleTemplate = options.titleTemplate;
        var fieldInfosInAttrContent = options.fieldInfosInAttrContent;
        var trClass = options.trClass;

        var attributes = feature && feature.attributes;
        if(!attributes){
          return;
        }

        var strItem = '<tr class="query-result-item" cellpadding="0" cellspacing="0"><td><span class="title"></span><table class="feature-attributes" valign="top">'+
        '<tbody></tbody></table></td></tr>';
        var trItem = html.toDom(strItem);
        html.addClass(trItem, trClass);
        html.place(trItem, this.resultsTbody);
        trItem.feature = feature;
        var spanTitle = query("span.title",trItem)[0];
        var tbody = query("tbody",trItem)[0];
        var title = esriLang.substitute(attributes, titleTemplate);
        if(!title){
          title = this.nls.noValue;
        }
        spanTitle.innerHTML = title;
        var infoTemplateTitle = title;
        var infoTemplateContent = '';

        array.forEach(fieldInfosInAttrContent, lang.hitch(this, function(fieldInfo, i){
          var fieldName = fieldInfo.name;
          var fieldAlias = fieldInfo.alias || fieldName;
          var fieldValue = attributes[fieldName];
          var fieldValueInWidget = fieldValue;
          var fieldValueInPopup = fieldValue;
          var specialType = fieldInfo.specialType;
          if(specialType === 'image'){
            if(fieldValue && typeof fieldValue === 'string'){
              fieldValueInWidget = '<a href="'+fieldValue+'" target="_blank">'+fieldValue+'</a>';
              fieldValueInPopup = '<img src="'+fieldValue+'" />';
            }
          }
          else if(specialType === 'link'){
            if(fieldValue && typeof fieldValue === 'string'){
              fieldValueInWidget = '<a href="'+fieldValue+'" target="_blank">'+fieldValue+'</a>';
              fieldValueInPopup = fieldValueInWidget;
            }
          }

          var strFieldTr = '<tr><td class="attr-name">'+fieldAlias+':</td><td class="attr-value">'+fieldValueInWidget+'</td></tr>';
          var fieldTr = html.toDom(strFieldTr);
          html.place(fieldTr, tbody);
          var rowStr = fieldAlias+": "+fieldValueInPopup;
          if(i !== fieldInfosInAttrContent.length-1){
            rowStr+='<br/>';
          }
          infoTemplateContent += rowStr;
        }));

        trItem.infoTemplateTitle = infoTemplateTitle;
        trItem.infoTemplateContent = infoTemplateContent;
        var infoTemplate = new InfoTemplate();
        infoTemplate.setTitle(infoTemplateTitle);
        infoTemplate.setContent(infoTemplateContent||"<span></span>");
        feature.setInfoTemplate(infoTemplate);
      },

      _showQueryErrorMsg: function(/* optional */ msg){
        new Message({message: msg || this.nls.queryError});
      },

      _onResultsTableClicked: function(event){
        var target = event.target||event.srcElement;
        if(!html.isDescendant(target,this.resultsTable)){
          return;
        }
        var tr = jimuUtils.getAncestorDom(target, lang.hitch(this,function(dom){
          return html.hasClass(dom,'query-result-item');
        }),10);
        if(!tr){
          return;
        }

        this._selectResultTr(tr);

        var spanTitle = query("span.title",tr)[0];
        var featureAttrTable = query(".feature-attributes",tr)[0];
        var attrTable = lang.clone(featureAttrTable);

        html.addClass(tr,'selected');
        var feature = tr.feature;
        var geometry = feature.geometry;
        if(geometry){
          var infoTitle = tr.infoTemplateTitle||'';
          var infoContent = tr.infoTemplateContent||'<span></span>';
          var geoType = geometry.type;
          var centerPoint,extent;
          var def = null;
          if(geoType === 'multipoint' || geoType === 'point'){
            centerPoint = geometry;
            def = new Deferred();
            var maxLevel = this.map.getNumLevels();
            var currentLevel = this.map.getLevel();
            var level2 = Math.floor(maxLevel * 2 / 3);
            var zoomLevel = Math.max(currentLevel, level2);
            this.map.setLevel(zoomLevel).then(lang.hitch(this, function(){
              this.map.centerAt(centerPoint).then(lang.hitch(this, function(){
                def.resolve();
              }));
            }));
          }
          else if(geoType === 'polyline'){
            extent = geometry.getExtent();
            extent = extent.expand(1.4);
            centerPoint = extent.getCenter();
            def = this.map.setExtent(extent);
          }
          else if(geoType === 'polygon'){
            extent = geometry.getExtent();
            extent = extent.expand(1.4);
            centerPoint = extent.getCenter();
            def = this.map.setExtent(extent);
          }
          else if(geoType === 'extent'){
            extent = geometry;
            extent = extent.expand(1.4);
            centerPoint = extent.getCenter();
            def = this.map.setExtent(extent);
          }

          if(def){
            def.then(lang.hitch(this, function(){
              this.map.infoWindow.setFeatures([feature]);
              this.map.infoWindow.setTitle(infoTitle);
              this.map.infoWindow.setContent(infoContent);
              this.map.infoWindow.reposition();
              this.map.infoWindow.show(centerPoint);
            }));
          }
        }
      },

      _hideInfoWindow:function(){
        if(this.map &&　this.map.infoWindow){
          this.map.infoWindow.hide();
          this.map.infoWindow.setFeatures([]);
          this.map.infoWindow.setTitle('');
          this.map.infoWindow.setContent('');
        }
      },

      _onBtnResultsBackClicked: function(){
        var showDom,hideDom;

        showDom = this.queryParams;
        hideDom = this.queryList;

        html.setStyle(hideDom,'display','none');
        html.setStyle(showDom,{
          display:'block',
          left:'-100%'
        });
        this._slide(showDom, -100, 0);
        this._slide(this.queryResults, 0, 100);
      }

    });
  });