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
  'dojo/text!./templates/RendererChooser.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dojox/gfx',
  'dojo/_base/Color',
  'dijit/form/Select',
  'dijit/form/ComboBox',
  'dijit/form/NumberSpinner',
  'dijit/form/NumberTextBox',
  'jimu/dijit/SymbolChooser',
  'esri/request',
  'esri/renderers/SimpleRenderer',
  'esri/renderers/UniqueValueRenderer',
  'esri/renderers/ClassBreaksRenderer',
  'esri/symbols/jsonUtils',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/CartographicLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, template, lang, html, array, on, query,gfx,Color,Select,ComboBox,NumberSpinner,NumberTextBox,
  SymbolChooser,esriRequest,SimpleRenderer,UniqueValueRenderer,ClassBreaksRenderer,jsonUtils,SimpleMarkerSymbol,PictureMarkerSymbol,SimpleLineSymbol,
  CartographicLineSymbol,SimpleFillSymbol,i18n) {
  return declare([_WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin], {
    templateString:template,
    baseClass: 'jimu-renderer-chooser',
    renderer:null,
    type:null,//available values:marker,line,fill
    nls:null,
    fields:[],
    _uniqueColors:{
      color1:['#fce138','#fff799','#fcd27e','#f1983c','#a553b7','#b1a9d0','#6ecffc','#4c81cd','#fc6f84','#fc3e5a','#69f488','#48885c'],
      color2:['#102432','#144d59','#ffc754','#ea9010','#a54e1d','#661510','#d8341a','#b31515','#4a0932','#8c213f','#18382e','#2c6954'],
      color3:['#be9626','#607100','#00734c','#704489','#01acca','#024e76','#f09100','#ea311f','#c6004b','#7570b3','#666666','#333333'],
      color4:['#fffa00','#f5cb11','#9fd40c','#46e29c','#32b8a6','#7ff2fa','#ad00f2','#c461ea','#eb7200','#e8a784','#bf2e2e','#6c7000'],
      color5:['#191921','#11495c','#78b1c2','#454f4b','#8f8f82','#99dbbc','#87b051','#f7ec88','#ebdcc1','#dbb658','#c43541','#75351e'],
      color6:['#332424','#751555','#d47013','#d68989','#211173','#82aad6','#7bfaeb','#6ec9a8','#6b6408','#e9da40','#ccc54a','#1fc235']
    },
    _classBreaksColors:{
      color1: ['#eaf0fd', '#03519e'],
      color2: ['#ebf9e7', '#046e2e'],
      color3: ['#f5f5f5', '#2a2a2a'],
      color4: ['#ffeddd', '#a83a00'],
      color5: ['#f2eef6', '#582890'],
      color6: ['#ffe3d7', '#a71713'],
      color7: ['#ecf7fb', '#006d2a'],
      color8: ['#edf8fa', '#83067e'],
      color9: ['#eef9e8', '#0167af'],
      color10: ['#fff1d7', '#b80201'],
      color11: ['#f0eef6', '#015b90'],
      color12: ['#f5eff7', '#006dfa'],
      color13: ['#f1eef7', '#9c0042'],
      color14: ['#ffebe2', '#7d0078'],
      color15: ['#ffffc9', '#016a35'],
      color16: ['#ffffcb', '#253197'],
      color17: ['#fffed1', '#9e3601'],
      color18: ['#ffffad', '#c20120'],
      color19: ['#a9620d', '#038772'],
      color20: ['#d3168c', '#46ae1b'],
      color21: ['#7c2d96', '#048936'],
      color22: ['#eb6300', '#603b9b'],
      color23: ['#cc0117', '#0471b2'],
      color24: ['#ce0118', '#424242'],
      color25: ['#db1a10', '#287cba'],
      color26: ['#da1baf', '#03983e'],
      color27: ['#db1a10', '#2483bb']
    },
    _selectedUniqueValueTr:null,
    _selectedClassBreakTr:null,
    _isDrawing:false,
    _jimuUrl:window.location.protocol + "//" + window.location.host + require.toUrl("jimu"),

    postMixInProperties:function(){
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.rendererChooser;
    },

    postCreate:function(){
      this.inherited(arguments);
      this._initFields();
      this.own(on(this.rendererSelect,'change',lang.hitch(this,this._onRendererSelectChange)));
      this.own(on(this.btnDefaultSym,'click',lang.hitch(this,this._showDefaultSymbol)));
      this.own(on(this.selectedSymbolChooser,'Change',lang.hitch(this,this._onSelectedSymbolChange)));
      this._bindUniqueSettingEvents();
      this._bindClassBreaksEvents();
      if(this.renderer){
        this.showByRenderer(this.renderer);
      }
      else if(this.type){
        this.showByType(this.type);
      }
      this._onRendererSelectChange();
    },

    getRenderer:function(){
      var renderer = null;
      var value = this.rendererSelect.get('value');
      if(value === 'simple'){
        renderer = this._getSimpleRenderer();
      }
      else if(value === 'unique'){
        renderer = this._getUniqueValueRenderer();
      }
      else if(value === 'color' || value === 'size'){
        renderer = this._getClassBreaksRenderer();
      }
      return renderer;
    },

    showByRenderer:function(renderer){
      this.renderer = renderer;
      this.type = null;
      var defaultSymbol = this.renderer && (this.renderer.defaultSymbol||this.renderer.symbol);
      this._setDefaultSymbol(defaultSymbol);
      this._updateRendererSelect();
      if(this.renderer instanceof SimpleRenderer){
        this.rendererSelect.set('value','simple');
      }
      else if(this.renderer instanceof UniqueValueRenderer){
        this._showUniqueValueRenderer(this.renderer);
      }
      else if(this.renderer instanceof ClassBreaksRenderer){
        this._showClassBreaksRenderer(this.renderer);
      }
      else{
        this.showByType(this.type);
      }
    },

    showByType:function(type){
      this.renderer = null;
      this.type = null;
      if(type !== 'marker' && type !== 'line' && type !== 'fill'){
        return;
      }
      this.type = type;
      this.defaultSymbolChooser.showByType(type);
      this._updateRendererSelect();
    },

    _setDefaultSymbol:function(defaultSymbol){
      this.type = null;

      if(!defaultSymbol){
        return;
      }

      if(defaultSymbol instanceof SimpleMarkerSymbol || defaultSymbol instanceof PictureMarkerSymbol){
        this.type = 'marker';
      }
      else if(defaultSymbol instanceof SimpleLineSymbol){
        this.type = 'line';
      }
      else if(defaultSymbol instanceof SimpleFillSymbol){
        this.type = 'fill';
      }

      if(this.type){
        this.defaultSymbolChooser.showBySymbol(defaultSymbol);
      }
    },

    _updateRendererSelect:function(){
      var sizeOption = this.rendererSelect.getOptions('size');
      if(this.type === 'marker'){
        if(!sizeOption){
          this.rendererSelect.addOption({
            value:'size',
            label:'Size'
          });
        }
      }
      else if(this.type === 'line' || this.type === 'fill'){
        if(sizeOption){
          this.rendererSelect.removeOption(sizeOption);
        }
      }
    },

    _initFields:function(){
      if(this.fields instanceof Array){
        var first = '';
        array.forEach(this.fields,lang.hitch(this,function(field){
          if(field && typeof field === 'string'){
            if(!first){
              first = field;
            }
            this._addField(field);
          }
        }));
        if(first && !this.fieldComboBox.get('displayedValue')){
          this.fieldComboBox.set('displayedValue',first);
        }
      }
    },

    _addField:function(field){
      this.fieldComboBox.get('store').add({name:field});
    },

    _onRendererSelectChange:function(){
      var value = this.rendererSelect.get('value');
      if(value === 'simple'){
        html.setStyle(this.fieldSelectTr,'display','none');
        html.setStyle(this.colorBlockTr,'display','none');
        html.setStyle(this.colorBarTr,'display','none');
        html.setStyle(this.domainTr,'display','none');
        html.setStyle(this.classCountTr,'display','none');
        html.setStyle(this.uniqueSetting,'display','none');
        html.setStyle(this.classBreaksSetting,'display','none');
        html.setStyle(this.btnDefaultSym,'display','none');
        html.setStyle(this.symbolSizeDomainTr,'display','none');
      }
      else if(value === 'unique'){
        html.setStyle(this.fieldSelectTr,'display','table-row');
        html.setStyle(this.colorBlockTr,'display','table-row');
        html.setStyle(this.colorBarTr,'display','none');
        html.setStyle(this.domainTr,'display','none');
        html.setStyle(this.classCountTr,'display','none');
        html.setStyle(this.uniqueSetting,'display','block');
        html.setStyle(this.classBreaksSetting,'display','none');
        html.setStyle(this.btnDefaultSym,'display','inline-block');
        html.setStyle(this.symbolSizeDomainTr,'display','none');
        this._updateUniqueValueDivVisibility();
      }
      else if(value === 'color'){
        html.setStyle(this.fieldSelectTr,'display','table-row');
        html.setStyle(this.colorBlockTr,'display','none');
        html.setStyle(this.classCountTr,'display','table-row');
        html.setStyle(this.domainTr,'display','table-row');
        html.setStyle(this.colorBarTr,'display','table-row');
        html.setStyle(this.uniqueSetting,'display','none');
        html.setStyle(this.btnDefaultSym,'display','inline-block');
        html.setStyle(this.symbolSizeDomainTr,'display','none');
        this._updateClassBreaksSettingVisibility();
      }
      else if(value === 'size'){
        html.setStyle(this.fieldSelectTr,'display','table-row');
        html.setStyle(this.colorBlockTr,'display','none');
        html.setStyle(this.colorBarTr,'display','none');
        html.setStyle(this.domainTr,'display','table-row');
        html.setStyle(this.classCountTr,'display','table-row');
        html.setStyle(this.uniqueSetting,'display','none');
        html.setStyle(this.btnDefaultSym,'display','inline-block');
        html.setStyle(this.symbolSizeDomainTr,'display','table-row');
        this._updateClassBreaksSettingVisibility();
      }
    },

    _showDefaultSymbol:function(){
      html.setStyle(this.defaultSymSection,'display','block');
      html.setStyle(this.selectedSymSection,'display','none');
    },

    _showSelectedSymbol:function(symbol){
      html.setStyle(this.defaultSymSection,'display','none');
      html.setStyle(this.selectedSymSection,'display','block');
      var value = this.rendererSelect.get('value');
      if(value === 'simple'){
        html.setStyle(this.uniqueSelectedSymInfoSet,'display','none');
        html.setStyle(this.classBreaksSelectedInfoSet,'display','none');
      }
      else if(value === 'unique'){
        html.setStyle(this.uniqueSelectedSymInfoSet,'display','block');
        html.setStyle(this.classBreaksSelectedInfoSet,'display','none');
      }
      else if(value === 'color' || value === 'size'){
        html.setStyle(this.uniqueSelectedSymInfoSet,'display','none');
        html.setStyle(this.classBreaksSelectedInfoSet,'display','block');
      }
      this.selectedSymbolChooser.showBySymbol(symbol);
    },

    _onSelectedSymbolChange:function(newSymbol){
      var value = this.rendererSelect.get('value');
      if(value === 'unique'){
        this._onUniqueSelectedSymbolChange(newSymbol);
      }
      else if(value === 'color'){
        this._onClassBreakSelectedSymbolChange(newSymbol);
      }
      else if(value === 'size'){
        this._onClassBreakSelectedSymbolChange(newSymbol);
      }
    },

    _cloneSymbol:function(symbol){
      if(!symbol){
        return null;
      }
      var jsonSym = symbol.toJson();
      var clone = jsonUtils.fromJson(jsonSym);
      return clone;
    },

    _drawSymbolPreview:function(previewNode,sym){
      var node = previewNode;
      var symbol = this._cloneSymbol(sym);

      html.empty(node);

      var sWidth = 80;
      var sHeight = 30;
      if (symbol.type === "simplemarkersymbol") {
        // extra padding for the outline width
        sWidth = Math.min(symbol.size + 12, 125);
        sHeight = sWidth;
      } else if (symbol.type === "picturemarkersymbol") {
        if (!symbol.url || symbol.url === "http://" || (symbol.url.indexOf("http://") === -1 && symbol.url.indexOf("https://") === -1 && symbol.url.indexOf("data:") === -1)) {
          // bad URL
          return;
        }
        sWidth = Math.min(Math.max(symbol.width, symbol.height), 125);
        sHeight = sWidth;
      } else if (symbol.type === "simplelinesymbol" || symbol.type === "cartographiclinesymbol") {
        sWidth = 190;
        sHeight = 20;
      }

      if(sWidth > 60){
        sWidth = 60;
      }

      var surface = gfx.createSurface(node, sWidth, sHeight);
      if (gfx.renderer === "vml") {
        // Fixes an issue in IE where the shape is partially drawn and
        // positioned to the right of the table cell  
        var source = surface.getEventSource();
        html.setStyle(source, "position", "relative");
        html.setStyle(source.parentNode, "position", "relative");
      }
      var shapeDesc = null;
      // if(symbol instanceof SimpleLineSymbol || symbol instanceof CartographicLineSymbol){
      //   shapeDesc = this._getLineShapeDesc(symbol);
      // }
      // else{
      shapeDesc = jsonUtils.getShapeDescriptors(symbol);
      // }

      var gfxShape;
      try {
        gfxShape = surface.createShape(shapeDesc.defaultShape).setFill(shapeDesc.fill).setStroke(shapeDesc.stroke);
      } catch (e) {
        surface.clear();
        surface.destroy();
        return;
      }

      var dim = surface.getDimensions();
      var transform = {
        dx: dim.width / 2,
        dy: dim.height / 2
      };

      var bbox = gfxShape.getBoundingBox(),
        width = bbox.width,
        height = bbox.height;
      if (width > sWidth || height > sHeight) {
        var actualSize = width > height ? width : height;
        var refSize = sWidth < sHeight ? sWidth : sHeight;
        var scaleBy = (refSize - 5) / actualSize;
        lang.mixin(transform, {
          xx: scaleBy,
          yy: scaleBy
        });
      }

      gfxShape.applyTransform(transform);
      return surface;
    },

    /* simple renderer */
    _getSimpleRenderer:function(){
      var symbol = this.defaultSymbolChooser.getSymbol();
      var renderer = new SimpleRenderer(symbol);
      return renderer;
    },

    /* unique symbols */
    _bindUniqueSettingEvents:function(){
      this.own(on(this.btnAddUniqueValue,'click',lang.hitch(this,this._onAddUniqueValue)));
      this.own(on(this.uniqueSelectedValue,'change',lang.hitch(this,this._onUniqueSelectedValueChange)));
      this.own(on(this.uniqueSelectedLabel,'change',lang.hitch(this,this._onUniqueSelectedLabelChange)));
      this.own(on(this.uniqueColorSelect,'change',lang.hitch(this,this._onUniqueColorSelectChange)));
    },

    _showUniqueValueRenderer:function(renderer){
      this.rendererSelect.set('value','unique');
      this.fieldComboBox.set('displayedValue',renderer.attributeField);
      html.empty(this.uniqueSysTbody);
      array.forEach(renderer.infos,lang.hitch(this,function(info){
        this._addUniqueValueTr(info.symbol,info.value,info.label||info.value);
      }));
    },

    _getUniqueValueRenderer:function(){
      var defaultSym = this.defaultSymbolChooser.getSymbol();
      var field = this.fieldComboBox.get('value');
      var renderer = new UniqueValueRenderer(defaultSym,field);
      var trs = query('.unique-symbol-tr',this.uniqueSysTbody);
      array.forEach(trs,lang.hitch(this,function(tr){
        renderer.addValue({
          value: tr.value,
          symbol: tr.symbol,
          label: tr.label,
          description: tr.label
        });
      }));
      return renderer;
    },

    _onUniqueColorSelectChange:function(){
      var colors = this._getSelectedUniqueColors();
      var trs = query('.unique-symbol-tr',this.uniqueSysTbody);
      array.forEach(trs,lang.hitch(this,function(tr,index){
        if(tr.symbol){
          if(!(tr.symbol instanceof PictureMarkerSymbol)){
            var idx = index % colors.length;
            var color = colors[idx];
            tr.symbol.setColor(color);
            var symbolDiv = query('.symbol-div',tr)[0];
            this._drawSymbolPreview(symbolDiv,tr.symbol);
            if(this._selectedUniqueValueTr === tr){
              this._showSelectedSymbol(tr.symbol);
            }
          }
        }
      }));
    },

    _onUniqueSelectedValueChange:function(){
      var tr = this._selectedUniqueValueTr;
      if(tr){
        tr.value = this.uniqueSelectedValue.value;
        tr.label = this.uniqueSelectedLabel.value;
        var labelDiv = query('.label-div',tr)[0];
        labelDiv.innerHTML = tr.label;
      }
    },

    _onUniqueSelectedLabelChange:function(){
      var tr = this._selectedUniqueValueTr;
      if(tr){
        tr.label = this.uniqueSelectedLabel.value;
        var labelDiv = query('.label-div',tr)[0];
        labelDiv.innerHTML = tr.label;
      }
    },

    _onUniqueSelectedSymbolChange:function(newSymbol){
      var tr = this._selectedUniqueValueTr;
      if(!tr){
        return;
      }
      tr.symbol = newSymbol;
      var symbolDiv = query('.symbol-div',tr)[0];
      if(!symbolDiv){
        return;
      }
      this._drawSymbolPreview(symbolDiv,newSymbol);
    },

    _onAddUniqueValue:function(){
      var uniqueValue = lang.trim(this.uniqueEditValue.value);
      if (uniqueValue) {
        var trs = query('.unique-symbol-tr', this.uniqueSysTbody);
        var colors = this._getSelectedUniqueColors();
        var colorIndex = trs.length % colors.length;
        var color = colors[colorIndex];
        var symbol = this._getUniqueSymbol(color);
        this._addUniqueValueTr(symbol, uniqueValue, uniqueValue);
      }
      this.uniqueEditValue.value = '';
    },

    _addUniqueValueTr:function(symbol,value,label){
      value = lang.trim(value);
      var s = '';
      s='<tr class="unique-symbol-tr">'+
          '<td class="symbol-td">'+
            '<div class="symbol-div"></div>'+
          '</td>'+
          '<td class="edit-td">'+
            '<div wrap class="label-div"></div>'+
          '</td>'+
          '<td class="delete-td">'+
            '<div class="delete-div"></div>'+
          '</td>'+
        '</tr>';
      var trDom = html.toDom(s);
      html.place(trDom,this.uniqueSysTbody);
      this._updateUniqueSymTableStyle();
      var symbolDiv = query('.symbol-div',trDom)[0];
      var labelDiv = query('.label-div',trDom)[0];
      var deleteDiv = query('.delete-div',trDom)[0];
      labelDiv.innerHTML = value;
      this.own(on(trDom,'click',lang.hitch(this,function(){
        this._selectUniqueValueTr(trDom);
      })));
      this.own(on(deleteDiv,'click',lang.hitch(this,function(event){
        event.stopPropagation();
        if(this._selectedUniqueValueTr === trDom){
          this._selectedUniqueValueTr = null;
        }
        html.destroy(trDom);
        this._updateUniqueSymTableStyle();
        this._updateUniqueValueDivVisibility();
      })));
      this._drawSymbolPreview(symbolDiv,symbol);
      trDom.symbol = symbol;
      trDom.value = value;
      trDom.label = label;
      this._selectUniqueValueTr(trDom);
      html.setStyle(this.uniqueValueDiv,'display','block');
    },

    _selectUniqueValueTr:function(tr){
      query('.unique-symbol-tr',this.uniqueSysTbody).removeClass('selected');
      html.addClass(tr,'selected');
      this._selectedUniqueValueTr = tr;
      this.uniqueSelectedValue.value = tr.value;
      this.uniqueSelectedLabel.value = tr.label;
      this._showSelectedSymbol(tr.symbol);
    },

    _updateUniqueSymTableStyle:function(){
    },

    _getSelectedUniqueColors:function(){
      var value = this.uniqueColorSelect.get('value');
      var strColors = this._uniqueColors[value];
      var colors = array.map(strColors,lang.hitch(this,function(str){
        return new Color(str);
      }));
      return colors;
    },

    _getUniqueSymbol:function(color){
      var symbol = null;
      if(this.type === 'marker'){
        var args = {"style":"esriSMSCircle","color":[0,0,128,128],"name":"Circle","outline":{"color":[191,151,39,255],"width":1},"type":"esriSMS","size":18};
        symbol = new SimpleMarkerSymbol(args);
        symbol.setColor(color);
      }
      else if(this.type === 'line' || this.type === 'fill'){
        var sym = this.defaultSymbolChooser.getSymbol();
        symbol = jsonUtils.fromJson(sym.toJson());
        symbol.setColor(color);
      }
      
      return symbol;
    },

    _updateUniqueValueDivVisibility:function(){
      var trs = query('.unique-symbol-tr',this.uniqueSysTbody);
      var display = trs.length === 0 ? 'none' : 'block';
      html.setStyle(this.uniqueValueDiv,'display',display);
    },

    /* class breaks renderer */
    _bindClassBreaksEvents:function(){
      this.own(on(this.minDomain,'change',lang.hitch(this,this._updateClassBreaksTable)));
      this.own(on(this.maxDomain,'change',lang.hitch(this,this._updateClassBreaksTable)));
      this.own(on(this.classCount,'change',lang.hitch(this,this._updateClassBreaksTable)));
      this.own(on(this.selectedFrom,'change',lang.hitch(this,this._onSelectedRangeChange)));
      this.own(on(this.selectedTo,'change',lang.hitch(this,this._onSelectedRangeChange)));
      this.own(on(this.classBreakSelectedLabel,'change',lang.hitch(this,this._onClassBreakSelectedLabelChange)));
      //color
      this.own(on(this.classBreaksColorSelect,'change',lang.hitch(this,this._updateClassBreaksTable)));
      //size
      this.own(on(this.minSymbolSize,'change',lang.hitch(this,this._updateClassBreaksTable)));
      this.own(on(this.maxSymbolSize,'change',lang.hitch(this,this._updateClassBreaksTable)));
    },

    _showClassBreaksRenderer:function(renderer){
      this._isDrawing = true;
      this.rendererSelect.set('value','color');
      var min = Infinity, max = -Infinity;
      this.fieldComboBox.set('displayedValue',renderer.attributeField);
      this.classCount.set('value',renderer.infos.length);
      html.empty(this.classBreaksTbody);
      array.forEach(renderer.infos,lang.hitch(this,function(info){
        var minValue = info.minValue;
        var maxValue = info.maxValue;
        var symbol = info.symbol;
        var label = info.label ? info.label : info.minValue + ' —— ' + info.maxValue;
        this._addClassBreaksTr(symbol,minValue,maxValue,label);
        min = Math.min(min,minValue);
        max = Math.max(max,maxValue);
      }));
      this.minDomain.set('value',min);
      this.maxDomain.set('value',max);

      if(this.type === 'marker'){
        var minSymSize = Infinity, maxSymSize = -Infinity;
        array.forEach(renderer.infos,lang.hitch(this,function(info){
          var symbol = info.symbol;
          var symbolSize = symbol instanceof PictureMarkerSymbol ? symbol.width : symbol.size;
          minSymSize = Math.min(symbolSize,minSymSize);
          maxSymSize = Math.max(symbolSize,maxSymSize);
        }));
        this.minSymbolSize.set('value',minSymSize);
        this.maxSymbolSize.set('value',maxSymSize);
        if(this.minSymSize !== this.maxSymSize){
          this.rendererSelect.set('value','size');
        }
      }
      var that = this;
      setTimeout(function(){
        that._isDrawing = false;
      },1000);
    },

    _getClassBreaksRenderer:function(){
      var defaultSym = this.defaultSymbolChooser.getSymbol();
      var field = this.fieldComboBox.get('value');
      var renderer = new ClassBreaksRenderer(defaultSym,field);
      var trs = query('.class-breaks-tr',this.classBreaksTbody);
      array.forEach(trs,lang.hitch(this,function(tr){
        renderer.addBreak({
          minValue: tr.from,
          maxValue: tr.to,
          symbol: tr.symbol,
          label: tr.label
        });
      }));
      return renderer;
    },

    _onClassBreakSelectedSymbolChange:function(newSymbol){
      var tr = this._selectedClassBreakTr;
      if(tr){
        tr.symbol = newSymbol;
        var symbolDiv = query('.symbol-div',tr)[0];
        this._drawSymbolPreview(symbolDiv,newSymbol);
      }
    },

    _onSelectedRangeChange:function(){
      var from = parseFloat(this.selectedFrom.get('value'));
      var to = parseFloat(this.selectedTo.get('value'));
      if(from > to){
        var temp = from;
        from = to;
        to = temp;
        this.selectedFrom.set('value',from);
        this.selectedTo.set('value',to);
      }
      var tr = this._selectedClassBreakTr;
      if(tr){
        tr.from = from;
        tr.to = to;
        var label = from + " — " + to;
        tr.label = label;
        this.classBreakSelectedLabel.value = label;
        var labelDiv = query('.label-div',tr)[0];
        labelDiv.innerHTML = label;
      }
    },

    _onClassBreakSelectedLabelChange:function(){
      var tr = this._selectedClassBreakTr;
      if(tr){
        var label = this.classBreakSelectedLabel.value;
        tr.label = label;
        var labelDiv = query('.label-div',tr)[0];
        labelDiv.innerHTML = label;
      }
    },

    _updateClassBreaksTable:function(){
      if(this._isDrawing){
        return;
      }
      html.setStyle(this.classBreaksSetting,'display','none');
      html.empty(this.classBreaksTbody);
      var min = parseFloat(this.minDomain.get('value'));
      var max = parseFloat(this.maxDomain.get('value'));
      if(min > max){
        var temp = min;
        min = max;
        max = temp;
        this.minDomain.set('value',min);
        this.maxDomain.set('value',max);
      }
      else if(min === max){
        return;
      }
      var minSymSize = parseFloat(this.minSymbolSize.get('value'));
      var maxSymSize = parseFloat(this.maxSymbolSize.get('value'));
      if(minSymSize > maxSymSize){
        var temp2 = minSymSize;
        minSymSize = maxSymSize;
        maxSymSize = temp2;
        this.minSymbolSize.set('value',minSymSize);
        this.maxSymbolSize.set('value',maxSymSize);
      }
      var count = parseInt(this.classCount.get('value'),10);
      var interval = (max-min)/count;
      var nums = [];//length=count+1
      var i;
      for(i=0;i<=count;i++){
        var num = min + interval * i;
        num = parseFloat(num.toFixed(4));
        nums.push(num);
      }
      var rendererType = this.rendererSelect.get('value');
      var symbols = [];//length = count
      if(rendererType === 'color'){
        symbols = this._createColorClassBreaksSymbols(count);
      }
      else if(rendererType === 'size'){
        symbols = this._createSizeClassBreaksSymbols(count,minSymSize,maxSymSize);
      }
      //create count tr
      for(i=0;i<count;i++){
        var from = nums[i];
        var to = nums[i+1];
        var label = from + " — " + to;
        this._addClassBreaksTr(symbols[i],from,to,label);
      }
      this._updateClassBreaksSettingVisibility();
    },

    _selectClassBreaksTr:function(tr){
      var trs = query('.class-breaks-tr',this.classBreaksTbody);
      trs.removeClass('selected');
      html.addClass(tr,'selected');
      this._selectedClassBreakTr = tr;
      var symbol = tr.symbol;
      var from = parseFloat(tr.from);
      var to = parseFloat(tr.to);
      var label = tr.label;
      this.selectedFrom.set('value',from);
      this.selectedTo.set('value',to);
      this.classBreakSelectedLabel.value = label;
      this._showSelectedSymbol(symbol);
    },

    _addClassBreaksTr:function(symbol,from,to,label){
      var s = '';
      s='<tr class="class-breaks-tr">'+
          '<td class="symbol-td">'+
            '<div class="symbol-div"></div>'+
          '</td>'+
          '<td class="label-td">'+
            '<div wrap class="label-div"></div>'+
          '</td>'+
          '<td class="delete-td">'+
            '<div class="delete-div"></div>'+
          '</td>'+
        '</tr>';
      var tr = html.toDom(s);
      html.place(tr,this.classBreaksTbody);
      tr.symbol = symbol;
      tr.from = from;
      tr.to = to;
      tr.label = label;
      var symbolDiv = query('.symbol-div',tr)[0];
      var labelDiv = query('.label-div',tr)[0];
      var deleteDiv = query('.delete-div',tr)[0];
      this._drawSymbolPreview(symbolDiv,symbol);
      labelDiv.innerHTML = label;
      this.own(on(tr,'click',lang.hitch(this,function(){
        this._selectClassBreaksTr(tr);
      })));
      this.own(on(deleteDiv,'click',lang.hitch(this,function(event){
        event.stopPropagation();
        if(this._selectClassBreaksTr === tr){
          this._selectClassBreaksTr = null;
        }
        html.destroy(tr);
        this._updateClassBreaksSettingVisibility();
      })));
      this._updateClassBreaksTableStyle();
      this._showDefaultSymbol();
      html.setStyle(this.classBreaksSetting,'display','block');
    },

    _updateClassBreaksTableStyle:function(){},

    _updateClassBreaksSettingVisibility:function(){
      var trs = query('.class-breaks-tr',this.classBreaksTbody);
      var display = trs.length === 0 ? 'none' : 'block';
      html.setStyle(this.classBreaksSetting,'display',display);
    },

    //color
    _createColorClassBreaksSymbols:function(count){
      var symbols = [];
      var colors = this._createClassBreaksColors(count);
      for(var i=0;i<count;i++){
        var color = colors[i];
        var sym = null;
        if(this.type === 'marker'){
          var args = {"style":"esriSMSCircle","color":[0,0,128,128],"name":"Circle","outline":{"color":[191,151,39,255],"width":1},"type":"esriSMS","size":18};
          sym = new SimpleMarkerSymbol(args);
          sym.setColor(color);
        }
        else if(this.type === 'line' || this.type === 'fill'){
          var a = this.defaultSymbolChooser.getSymbol();
          sym = jsonUtils.fromJson(a.toJson());
          sym.setColor(color);
        }
        symbols.push(sym);
      }
      return symbols;
    },

    _createClassBreaksColors:function(count){
      var colors = [];
      var value = this.classBreaksColorSelect.get('value');
      var c = this._classBreaksColors[value];
      var c1 = new Color(c[0]);
      var c2 = new Color(c[1]);
      var deltaR = Math.floor((c2.r - c1.r)/count);
      var deltaG = Math.floor((c2.g - c1.g)/count);
      var deltaB = Math.floor((c2.b - c1.b)/count);
      for(var i=0;i<count;i++){
        var r = c1.r + deltaR * i;
        var g = c1.g + deltaG * i;
        var b = c1.b + deltaB * i;
        var color = new Color([r,g,b,255]);
        colors.push(color);
      }
      return colors;
    },

    //size
    _createSizeClassBreaksSymbols:function(count,minSymSize,maxSymSize){
      var defaultSym = this.defaultSymbolChooser.getSymbol();
      var symbols = [];
      var interval = (maxSymSize-minSymSize)/(count-1);
      for(var i=0;i<count;i++){
        var size = Math.round(minSymSize + interval * i);
        var jsonSym = defaultSym.toJson();
        var sym = jsonUtils.fromJson(jsonSym);
        if(sym instanceof PictureMarkerSymbol){
          sym.setWidth(size);
          sym.setHeight(size);
        }
        else{
          sym.setSize(size);
        }
        symbols.push(sym);
      }
      return symbols;
    }
  });
});