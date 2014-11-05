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
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/text!./FeatureSetEditorChooser.html',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/form/RadioButton',
  'jimu/dijit/SymbolChooser',
  'esri/symbols/jsonUtils',
  '../BaseEditor'
],
function(declare, lang, html, array, on, template, _TemplatedMixin, _WidgetsInTemplateMixin, RadioButton, SymbolChooser, jsonUtils, BaseEditor) {
  return declare([BaseEditor, _TemplatedMixin, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-fsec',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
      this.value = {};
      if(this.param.featureSetMode){
        html.setAttr(this[this.param.featureSetMode + 'Mode'], 'checked', true);
        on.emit(this[this.param.featureSetMode + 'Mode'], 'click', {
          cancelable: true,
          bubble: true
        });
      }
      if(this.param.featureSetMode === 'url' && this.param.featureSetUrl){
        this.featureSetUrl.setValue(this.param.featureSetUrl);
      }
    },

    getValue: function(){
      if(this.featureSetUrl.value){
        this.value.featureSetUrl = this.featureSetUrl.value;
      }
      if(this.symbolChooser && html.getStyle(this.symbolChooserSection, 'display') === 'block'){
        this.value.symbol = this.symbolChooser.getSymbol().toJson();
      }
      return this.value;
    },

    _getSymbolType: function(){
      switch(this.param.defaultValue.geometryType){
      case 'esriGeometryPoint':
        return 'marker';
      case 'esriGeometryPolyline':
        return 'line';
      case 'esriGeometryPolygon':
        return 'fill';
      }
    },

    _onDrawModeSelect: function(){
      if(!this.symbolChooser){
        var o = {};
        if(this.param.symbol){
          o.symbol = jsonUtils.fromJson(this.param.symbol);
        }else{
          o.type = this._getSymbolType();
        }
        this.symbolChooser = new SymbolChooser(o, this.symbolChooserNode);
        this.symbolChooser.startup();
      }
      html.setStyle(this.symbolChooserSection, 'display', 'block');
      this.featureSetUrl.set('disabled', true);
      this.value.featureSetMode = 'draw';
    },

    _onLayersModeSelect: function(){
      html.setStyle(this.symbolChooserSection, 'display', 'none');
      this.featureSetUrl.set('disabled', true);
      this.value.featureSetMode = 'layers';
    },

    _onUrlModeSelect: function(){
      html.setStyle(this.symbolChooserSection, 'display', 'none');
      this.featureSetUrl.set('disabled', false);
      this.value.featureSetMode = 'url';
    }

  });
});