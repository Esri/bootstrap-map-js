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
  'dojo/text!./templates/SymbolChooser.html',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dojox/gfx',
  'dojo/_base/Color',
  'dojo/request/xhr',
  'dijit/form/Select',
  'dijit/form/NumberSpinner',
  'jimu/dijit/ColorPicker',
  'jimu/utils',
  'jimu/symbolUtils',
  'esri/request',
  'esri/symbols/jsonUtils',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/CartographicLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/TextSymbol',
  'esri/symbols/Font',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Evented, lang,
  html, array, on, query, gfx, Color, xhr, Select, NumberSpinner, ColorPicker, jimuUtils, jimuSymUtils,
  esriRequest, esriSymJsonUtils, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, CartographicLineSymbol,
  SimpleFillSymbol, TextSymbol, Font, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString:template,
    baseClass: 'jimu-symbol-chooser',
    declaredClass: 'jimu.dijit.SymbolChooser',
    nls: null,
    _pointEventsBinded: false,
    _lineEventBinded: false,
    _fillEventBinded: false,
    _textEventBinded: false,
    _invokeSymbolChangeEvent: true,

    //options:
    //you must set symbol or type
    symbol: null,//optional
    type: null,//optional, available values:marker,line,fill,text

    //public methods:
    //reset
    //showBySymbol
    //showByType
    //getSymbol

    //events:
    //change

    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.symbolChooser;
    },

    postCreate:function(){
      this.inherited(arguments);
      if(this.symbol){
        this.showBySymbol(this.symbol);
      }
      else if(this.type){
        this.showByType(this.type);
      }
    },

    reset: function(){
      this.type = null;
      this.symbol = null;
      this._hideAllSections();
    },

    showBySymbol:function(symbol){
      this.reset();

      var declaredClass = symbol && symbol.declaredClass;
      var isValid = declaredClass && typeof declaredClass === 'string' && declaredClass.indexOf('esri.symbol') >= 0;
      if(!isValid){
        return;
      }
      
      this.symbol = this._cloneSymbol(symbol);

      if(this._isSimpleMarkerSymbol(this.symbol) || this._isPictureMarkerSymbol(this.symbol)){
        this.type = 'marker';
        this._initPointSection();
      }
      else if(this._isSimpleLineSymbol(this.symbol)){
        this.type = 'line';
        this._initLineSection();
      }
      else if(this._isSimpleFillSymbol(this.symbol)){
        this.type = 'fill';
        this._initFillSection();
      }
      else if(this._isTextSymbol(this.symbol)){
        this.type = 'text';
        this._initTextSection();
      }
    },

    showByType:function(type){
      this.reset();

      if(type === 'marker' || type === 'line' || type === 'fill' || type === 'text'){
        this.type = type;
      }
      else{
        return;
      }

      if(this.type === 'marker'){
        this._initPointSection();
      }
      else if(this.type === 'line'){
        this._initLineSection();
      }
      else if(this.type === 'fill'){
        this._initFillSection();
      }
      else if(this.type === 'text'){
        this._initTextSection();
      }
    },

    getSymbol:function(){
      var symbol = null;

      if(this.type === 'marker'){
        symbol = this._getPointSymbolBySetting();
      }
      else if(this.type === 'line'){
        symbol = this._getLineSymbolBySetting();
      }
      else if(this.type === 'fill'){
        symbol = this._getFillSymbolBySetting();
      }
      else if(this.type === 'text'){
        symbol = this._getTextSymbolBySetting();
      }

      var result = null;
      if(symbol){
        result = this._cloneSymbol(symbol);
      }
      return result;
    },

    _onChange:function(newSymbol){
      var cloneSym = this._cloneSymbol(newSymbol);
      this.emit('change', cloneSym);
    },

    _hideAllSections: function(){
      query('.symbol-section',this.domNode).style('display','none');
    },

    _showSection:function(type){
      this._hideAllSections();
      var s = '.' + type + '-symbol-section';
      query(s,this.domNode).style('display','block');
    },

    _getAncestor:function(dom, checkFunc, maxLoop){
      return jimuUtils.getAncestorDom(dom, checkFunc, maxLoop);
    },

    _getAbsoluteUrl:function(module){
      return window.location.protocol + "//" + window.location.host +  require.toUrl(module);
    },

    _cloneSymbol:function(symbol){
      if(!symbol){
        return null;
      }
      var jsonSym = symbol.toJson();
      var clone = esriSymJsonUtils.fromJson(jsonSym);
      return clone;
    },

    _createSymbolIconTable:function(fileName,jsonSyms){
      var countPerRow = 8;
      var class0 = 'icon-table';
      var class1 = this.type+"-icon-table";
      var class2 = class1+"-"+fileName;
      var className = class0 + " " + class1+" "+class2;
      var table = html.toDom('<table class="'+className+'"><tbody></tbody></table>');
      var tbody = query('tbody',table)[0];
      var rowCount = Math.ceil(jsonSyms.length / countPerRow);
      for(var i=0;i<rowCount;i++){
        html.create('tr',{},tbody);
      }
      var trs = query('tr',table);
      array.forEach(jsonSyms,lang.hitch(this,function(jsonSym,index){
        var jsonSymClone = lang.clone(jsonSym);
        var sym = esriSymJsonUtils.fromJson(jsonSym);
        var rowIndex = Math.floor(index / countPerRow);
        var tr = trs[rowIndex];
        var td = html.create('td',{},tr);
        html.addClass(td,'symbol-td-item');
        var symNode = this._createSymbolNode(sym);
        html.addClass(symNode,'symbol-div-item');
        symNode.symbol = jsonSymClone;
        html.place(symNode,td);
      }));
      return table;
    },

    _updatePreview:function(previewNode){
      var node = previewNode;
      var symbol = this._cloneSymbol(this.symbol);

      html.empty(node);

      var symbolNode = jimuSymUtils.createSymbolNode(symbol);
      html.place(symbolNode, previewNode);
    },

    _createSymbolNode:function(symbol){
      var surfaceSize = {
        width: 32,
        height: 32
      };
      var symbolNode = jimuSymUtils.createSymbolNode(symbol, surfaceSize);
      html.setStyle(symbolNode,{
        width: '36px',
        height: '36px'
      });
      return symbolNode;
    },

    _getLineShapeDesc:function(symbol){
      var result = null;
      if (this._isSimpleLineSymbol(symbol) || this._isCartographicLineSymbol(symbol)) {
        // we want a longer line
        var shape = {
          type: "path",
          path: "M -90,0 L 90,0 E"
        };
        result = {
          defaultShape: shape,
          fill: null,
          stroke: symbol.getStroke()
        };
      }
      return result;
    },

    /* point section */
    _initPointSection:function(){
      this._showSection('point');
      if (!this._pointEventsBinded) {
        this._pointEventsBinded = true;
        this._bindPointEvents();
        this._onPointSymClassSelectChange();
      }
      
      if(this._isPictureMarkerSymbol(this.symbol)){
        this._showPictureMarkerSymSettings();
      }
      else if(this._isSimpleMarkerSymbol(this.symbol)){
        this._showSimpleMarkerSymSettings();
      }
      else{
        var args = {"style":"esriSMSCircle","color":[0,0,128,128],"name":"Circle","outline":{"color":[0,0,128,255],"width":1},"type":"esriSMS","size":18};
        this.symbol = new SimpleMarkerSymbol(args);
        this._showSimpleMarkerSymSettings();
      }
      this._initPointSettings(this.symbol);
      this._getPointSymbolBySetting();
    },

    _bindPointEvents:function(){
      this.own(on(this.pointIconTables,'.symbol-div-item:click',lang.hitch(this,this._onPointSymIconItemClick)));
      this.own(on(this.pointSymClassSelect,'Change',lang.hitch(this,this._onPointSymClassSelectChange)));
      this.own(on(this.pointSize,'change',lang.hitch(this,this._onPointSymbolChange)));
      this.own(on(this.pointColor,'change',lang.hitch(this,this._onPointSymbolChange)));
      this.own(on(this.pointAlpha,'change',lang.hitch(this,this._onPointSymbolChange)));
      this.own(on(this.pointOutlineColor,'change',lang.hitch(this,this._onPointSymbolChange)));
      this.own(on(this.pointOutlineWidth,'change',lang.hitch(this,this._onPointSymbolChange)));
    },

    _onPointSymbolChange:function(){
      if(this._invokeSymbolChangeEvent){
        this._getPointSymbolBySetting();
        this._onChange(this.symbol);
      }
    },

    _initPointSettings:function(symbol){
      if(!symbol){
        return;
      }
      this._invokeSymbolChangeEvent = false;

      if(this._isSimpleMarkerSymbol(symbol)){
        this.pointSize.set('value',symbol.size);
        this.pointColor.setColor(symbol.color);
        this.pointAlpha.set('value',parseFloat(symbol.color.a.toFixed(2)));
        var outlineSymbol = symbol.outline;
        if(outlineSymbol){
          this.pointOutlineColor.setColor(outlineSymbol.color);
          this.pointOutlineWidth.set('value',parseFloat(outlineSymbol.width.toFixed(0)));
        }
      }
      else if(this._isPictureMarkerSymbol(symbol)){
        this.pointSize.set('value',symbol.width);
      }
      this._invokeSymbolChangeEvent = true;
    },

    _isSimpleMarkerSymbol: function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.SimpleMarkerSymbol';
    },

    _isPictureMarkerSymbol: function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.PictureMarkerSymbol';
    },

    _onPointSymClassSelectChange:function(){
      this._showSelectedPointSymIconTable();
      var fileName = this.pointSymClassSelect.get('value');
      var defName = 'def' + fileName;
      var def = this.pointSymClassSelect[defName];
      if (!def) {
        this._requestPointSymJson(fileName);
      }
    },

    _showSelectedPointSymIconTable:function(){
      var fileName = this.pointSymClassSelect.get('value');
      query('.marker-icon-table',this.pointIconTables).style('display','none');
      var tables = query('.marker-icon-table-'+fileName,this.pointIconTables);
      if(tables.length > 0){
        tables.style('display','table');
      }
    },

    _requestPointSymJson:function(fileName){
      var defName = 'def'+fileName;
      var def = this.pointSymClassSelect[defName];
      if(def){
        return;
      }
      var module = "jimu/dijit/SymbolsInfo/"+fileName+".json";
      var url = this._getAbsoluteUrl(module);
      def = xhr(url, {
        handleAs:'json'
      });
      // def = esriRequest({
      //   url:url,
      //   handleAs:'json',
      //   callbackParamName:'callback'
      // });
      this.pointSymClassSelect[defName] = def;
      def.then(lang.hitch(this,function(jsonSyms){
        var table = this._createSymbolIconTable(fileName,jsonSyms);
        html.place(table,this.pointIconTables);
        this._showSelectedPointSymIconTable();
      }),lang.hitch(this,function(error){
        console.error('get point symbol failed',error);
      }));
    },

    _onPointSymIconItemClick:function(event){
      var target = event.target||event.srcElement;
      var symDivItem = this._getAncestor(target,function(dom){
        return html.hasClass(dom,'symbol-div-item');
      },5);

      if(!symDivItem){
        return;
      }

      var td = symDivItem.parentNode;
      var tr = td.parentNode;
      var tbody = tr.parentNode;
      query('.selected-symbol-div-item',tbody).removeClass('selected-symbol-div-item');
      html.addClass(symDivItem,'selected-symbol-div-item');

      var jsonSym = symDivItem.symbol;
      if(!jsonSym){
        return;
      }
      this.symbol = esriSymJsonUtils.fromJson(jsonSym);
      if(this._isSimpleMarkerSymbol(this.symbol)){
        this._showSimpleMarkerSymSettings();
      }
      else{
        this._showPictureMarkerSymSettings();
      }
      this._onPointSymbolChange();
    },

    _showSimpleMarkerSymSettings:function(){
      html.setStyle(this.pointColorTr,'display','');
      html.setStyle(this.pointOpacityTr,'display','');
      html.setStyle(this.pointOutlineColorTr,'display','');
      html.setStyle(this.pointOulineWidthTr,'display','');
    },

    _showPictureMarkerSymSettings:function(){
      html.setStyle(this.pointColorTr,'display','none');
      html.setStyle(this.pointOpacityTr,'display','none');
      html.setStyle(this.pointOutlineColorTr,'display','none');
      html.setStyle(this.pointOulineWidthTr,'display','none');
    },

    _getPointSymbolBySetting:function(){
      if(!this.symbol){
        return null;
      }
      var size = parseFloat(this.pointSize.get('value'));
      if(this._isSimpleMarkerSymbol(this.symbol)){
        this.symbol.setSize(size);
        var color = this.pointColor.getColor();
        var opacity = parseFloat(this.pointAlpha.get('value'));
        color.a = opacity;
        this.symbol.setColor(color);
        var outlineColor = this.pointOutlineColor.getColor();
        var outlineWidth = parseFloat(this.pointOutlineWidth.get('value'));
        var outlineSym = new SimpleLineSymbol();
        outlineSym.setStyle(SimpleLineSymbol.STYLE_SOLID);
        outlineSym.setColor(outlineColor);
        outlineSym.setWidth(outlineWidth);
        this.symbol.setOutline(outlineSym);
      }
      else if(this._isPictureMarkerSymbol(this.symbol)){
        this.symbol.setWidth(size);
        this.symbol.setHeight(size);
      }
      this._updatePreview(this.pointSymPreview);
      return this.symbol;
    },

    /* line section */
    _initLineSection:function(){
      this._showSection('line');
      if (!this._lineEventBinded) {
        this._lineEventBinded = true;
        this._bindLineEvents();
        this._requestLineSymJson('line');
      }
      
      this._initLineSettings(this.symbol);
      this._getLineSymbolBySetting();
    },

    _bindLineEvents:function(){
      this.own(on(this.lineIconTables,'.symbol-div-item:click',lang.hitch(this,this._onLineSymIconItemClick)));
      this.own(on(this.lineColor,'change',lang.hitch(this,this._onLineSymbolChange)));
      this.own(on(this.lineStylesSelect,'change',lang.hitch(this,this._onLineSymbolChange)));
      this.own(on(this.lineAlpha,'change',lang.hitch(this,this._onLineSymbolChange)));
      this.own(on(this.lineWidth,'change',lang.hitch(this,this._onLineSymbolChange)));
    },

    _onLineSymbolChange:function(){
      if(this._invokeSymbolChangeEvent){
        this._getLineSymbolBySetting();
        this._onChange(this.symbol);
      }
    },

    _initLineSettings:function(symbol){
      if(!symbol){
        return;
      }
      this._invokeSymbolChangeEvent = false;
      this.lineColor.setColor(symbol.color);
      this.lineAlpha.set('value',parseFloat(symbol.color.a.toFixed(2)));
      this.lineWidth.set('value',parseFloat(symbol.width.toFixed(0)));
      this.lineStylesSelect.set('value',symbol.style);
      this._invokeSymbolChangeEvent = true;
    },

    _isSimpleLineSymbol: function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.SimpleLineSymbol';
    },

    _isCartographicLineSymbol: function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.CartographicLineSymbol';
    },

    _requestLineSymJson:function(fileName){
      var module = "jimu/dijit/SymbolsInfo/"+fileName+".json";
      var url = this._getAbsoluteUrl(module);
      var def = xhr(url, {
        handleAs:'json'
      });
      // var def = esriRequest({
      //   url:url,
      //   handleAs:'json',
      //   callbackParamName:'callback'
      // });
      def.then(lang.hitch(this,function(jsonSyms){
        var table = this._createSymbolIconTable(fileName,jsonSyms);
        html.place(table,this.lineIconTables);
      }),lang.hitch(this,function(error){
        console.error('get line symbol failed',error);
      }));
    },

    _onLineSymIconItemClick:function(event){
      var target = event.target||event.srcElement;
      var symDivItem = this._getAncestor(target,function(dom){
        return html.hasClass(dom,'symbol-div-item');
      },5);

      if(!symDivItem){
        return;
      }

      var td = symDivItem.parentNode;
      var tr = td.parentNode;
      var tbody = tr.parentNode;
      query('.selected-symbol-div-item',tbody).removeClass('selected-symbol-div-item');
      html.addClass(symDivItem,'selected-symbol-div-item');

      var jsonSym = symDivItem.symbol;
      if(!jsonSym){
        return;
      }
      var symbol = esriSymJsonUtils.fromJson(jsonSym);
      this._initLineSettings(symbol);
      this._onLineSymbolChange();
    },

    _getLineSymbolBySetting:function(){
      this.symbol = new SimpleLineSymbol();
      var color = this.lineColor.getColor();
      var style = this.lineStylesSelect.get('value');
      color.a = parseFloat(this.lineAlpha.get('value'));
      var width = parseFloat(this.lineWidth.get('value'));
      this.symbol.setStyle(style);
      this.symbol.setColor(color);
      this.symbol.setWidth(width);
      this._updatePreview(this.lineSymPreview);
      return this.symbol;
    },


    /* fill section */
    _initFillSection:function(){
      this._showSection('fill');
      if(!this._fillEventBinded){
        this._fillEventBinded = true;
        this._bindFillEvents();
        this._requestFillSymJson('fill');
      }
      
      this._initFillSettings(this.symbol);
      this._getFillSymbolBySetting();
    },

    _bindFillEvents:function(){
      this.own(on(this.fillIconTables,'.symbol-div-item:click',lang.hitch(this,this._onFillSymIconItemClick)));
      this.own(on(this.fillColor,'change',lang.hitch(this,this._onFillSymbolChange)));
      this.own(on(this.fillAlpha,'change',lang.hitch(this,this._onFillSymbolChange)));
      this.own(on(this.fillOutlineColor,'change',lang.hitch(this,this._onFillSymbolChange)));
      this.own(on(this.fillOutlineWidth,'change',lang.hitch(this,this._onFillSymbolChange)));
    },

    _onFillSymbolChange:function(){
      if(this._invokeSymbolChangeEvent){
        this._getFillSymbolBySetting();
        this._onChange(this.symbol);
      }
    },

    _initFillSettings:function(symbol){
      if(!symbol){
        return;
      }
      this._invokeSymbolChangeEvent = false;
      this.fillColor.setColor(symbol.color);
      this.fillAlpha.set('value',parseFloat(symbol.color.a.toFixed(2)));
      if(symbol.outline){
        this.fillOutlineColor.setColor(symbol.outline.color);
        this.fillOutlineWidth.set('value',parseInt(symbol.outline.width,10));
      }
      this._invokeSymbolChangeEvent = true;
    },

    _isSimpleFillSymbol: function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.SimpleFillSymbol';
    },

    _requestFillSymJson:function(fileName){
      var module = "jimu/dijit/SymbolsInfo/"+fileName+".json";
      var url = this._getAbsoluteUrl(module);
      var def = xhr(url, {
        handleAs:'json'
      });
      // var def = esriRequest({
      //   url:url,
      //   handleAs:'json',
      //   callbackParamName:'callback'
      // });
      def.then(lang.hitch(this,function(jsonSyms){
        var table = this._createSymbolIconTable(fileName,jsonSyms);
        html.place(table,this.fillIconTables);
      }),lang.hitch(this,function(error){
        console.error('get fill symbol failed',error);
      }));
    },

    _onFillSymIconItemClick:function(event){
      var target = event.target||event.srcElement;
      var symDivItem = this._getAncestor(target,function(dom){
        return html.hasClass(dom,'symbol-div-item');
      },5);

      if(!symDivItem){
        return;
      }

      var td = symDivItem.parentNode;
      var tr = td.parentNode;
      var tbody = tr.parentNode;
      query('.selected-symbol-div-item',tbody).removeClass('selected-symbol-div-item');
      html.addClass(symDivItem,'selected-symbol-div-item');

      var jsonSym = symDivItem.symbol;
      if(!jsonSym){
        return;
      }
      var symbol = esriSymJsonUtils.fromJson(jsonSym);
      this._initFillSettings(symbol);
      this._onFillSymbolChange();
    },

    _getFillSymbolBySetting:function(){
      this.symbol = new SimpleFillSymbol();
      var color = this.fillColor.getColor();
      color.a = parseFloat(this.fillAlpha.get('value').toFixed(2));
      var outlineColor = this.fillOutlineColor.getColor();
      var outlineWidth = parseInt(this.fillOutlineWidth.get('value'),10);
      this.symbol.setColor(color);
      this.symbol.setStyle(SimpleFillSymbol.STYLE_SOLID);
      var outlineSym = new SimpleLineSymbol();
      outlineSym.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSym.setColor(outlineColor);
      outlineSym.setWidth(outlineWidth);
      this.symbol.setOutline(outlineSym);
      this._updatePreview(this.fillSymPreview);
      return this.symbol;
    },


    /* text section */
    _initTextSection:function(){
      this._showSection('text');
      if(!this._textEventBinded){
        this._textEventBinded = true;
        this._bindTextEvents();
      }
      
      this._initTextSettings();
      this._getTextSymbolBySetting();
    },

    _bindTextEvents:function(){
      this.own(on(this.inputText,'change',lang.hitch(this,this._onTextSymbolChange)));
      this.own(on(this.textColor,'change',lang.hitch(this,this._onTextSymbolChange)));
      this.own(on(this.textFontSize,'change',lang.hitch(this,this._onTextSymbolChange)));
    },

    _onTextSymbolChange:function(){
      if (this._invokeSymbolChangeEvent) {
        this._getTextSymbolBySetting();
        this._onChange(this.symbol);
      }
    },

    _initTextSettings:function(symbol){
      if(!symbol){
        return;
      }
      this._invokeSymbolChangeEvent = false;
      this.inputText.value = symbol.text;
      this.textColor.setColor(symbol.color);
      var size = parseInt(symbol.font.size,10);
      this.textFontSize.set('value',size);
      this._invokeSymbolChangeEvent = true;
    },

    _isTextSymbol: function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.TextSymbol';
    },

    _updateTextPreview:function(){
      var colorHex = this.textColor.getColor().toHex();
      var size = parseInt(this.textFontSize.get('value'),10)+'px';
      html.setStyle(this.textPreview,{color:colorHex,fontSize:size});
      this.textPreview.innerHTML = this.inputText.value;
    },

    _getTextSymbolBySetting:function(){
      this.symbol = new TextSymbol();
      var text = this.inputText.value;
      var color = this.textColor.getColor();
      var size = parseInt(this.textFontSize.get('value'),10);
      var font = new Font();
      font.setSize(size);
      this.symbol.setText(text);
      this.symbol.setColor(color);
      this.symbol.setFont(font);
      this._updateTextPreview();
      return this.symbol;
    }

  });
});