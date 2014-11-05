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
  'dojo/Deferred',
  'dojo/text!./ParamSetting.html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/form/TextBox',
  'dijit/form/NumberTextBox',
  'dijit/form/Select',
  'jimu/dijit/CheckBox',
  'jimu/dijit/URLInput',
  'jimu/dijit/RendererChooser',
  'jimu/dijit/Popup',
  'esri/renderers/jsonUtils',
  '../editorManager',
  '../EditorChooser'
],
function(declare, lang, html, array, on, Deferred, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, TextBox, NumberTextBox, Select,
  CheckBox, URLInput, RendererChooser, Popup, rendererUtils, editorManager, EditorChooser) {
  var clazz = declare([_WidgetBase,_TemplatedMixin, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-setting-gp-param',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
      editorManager.setMap(this.map);
      editorManager.setNls(this.nls);
    },

    setParam: function(param, direction){
      this.param = param;
      this.direction = direction;
      
      if(param.label === undefined){
        param.label = '';
      }
      this.label.setValue(param.label);

      if(param.tooltip === undefined){
        if(param.label === undefined){
          param.tooltip = '';
        }else{
          param.tooltip = param.label;
        }
      }
      this.tooltip.setValue(param.tooltip);

      this.visible.setValue(param.visible);
      //spart, means special part, it's an editor(for input param) or a renderer(for output param)
      if(this.spart){
        this.spart.destroy();
        html.destroy(this.spartLabelNode);
        html.destroy(this.changeEditorNode);
      }
      this._createSpecialPart();
    },

    acceptValue: function(){
      this.param.label = this.label.getValue();
      this.param.tooltip = this.tooltip.getValue();
      this.param.visible = this.visible.getValue();

      var value;
      if(this.spart.getValue){
        value = this.spart.getValue();
        if(this.param.dataType === 'GPFeatureRecordSetLayer'){
          lang.mixin(this.param, value);
        }else{
          this.param.defaultValue = value;
        }
      }
    },

    setInputParams: function(inputParams){
      this.inputParams = inputParams;
    },

    _createSpecialPart: function(){
      var label;
      if(this.direction === 'input' && this.param.dataType === 'GPFeatureRecordSetLayer'){
        label = this.nls.inputFeatureBy;
        this.spart = editorManager.createEditor(this.param, 'input', 'setting');
      }else if(this.direction === 'input'){
        label = this.nls.defaultValue;
        this.spart = editorManager.createEditor(this.param, 'input', 'setting');
        //hide this feature temporary
        // if(this.param.dataType === 'GPString' || this.param.editorName ||
        //   this.param.dataType === 'GPMultiValue:GPString' && (!this.param.choiceList || this.param.choiceList.length === 0)){
        //   this.changeEditorNode = this._createChangeEditorNode();
        // }
      }else if(this.direction === 'output' && this.param.dataType === 'GPFeatureRecordSetLayer'){
        label = '';
        this.spart = editorManager.createEditor(this.param, 'output', 'setting');
      }else if(this.direction === 'output'){
        label = this.nls.displayType;
        this.spart = editorManager.createEditor(this.param, 'output', 'setting');
      }
      this.spartLabelNode = html.create('div', {
        'class': 'input-label',
        innerHTML: label,
        style: {
          display: label === ''? 'none': 'inline-block'
        }
      }, this.specialSectionNode);
      this.spart.placeAt(this.specialSectionNode);
      if(this.changeEditorNode){
        html.place(this.changeEditorNode, this.spartLabelNode, 'after');
      }
      this.spart.startup();
    },

    _createChangeEditorNode: function(){
      var node = html.create('div', {
        'class': 'change-editor',
        innerHTML: 'Change',
        style: {
          display: 'inline-block'
        }
      });
      this.own(on(node, 'click', lang.hitch(this, function(){
        var editorChooser = new EditorChooser({
          inputParams: this.inputParams
        });
        new Popup({
          titleLabel: 'Choose Editor',
          content: editorChooser,
          container: 'main-page',
          buttons: [
            {
              label: this.nls.ok,
              onClick: lang.hitch(this, this._onEditorChange, editorChooser)
            },{
              label: this.nls.cancel
            }
          ]
        });
        editorChooser.startup();
      })));
      return node;
    },

    _onEditorChange: function(editorChooser){
      if(this.param.editorName === editorChooser.selectedEditor.name){
        return;
      }

      editorChooser.popup.close();
      
      this.param.editorName = editorChooser.selectedEditor.name;

      if(editorChooser.selectedEditor.dependParam){
        this.param.editorDependParamName = editorChooser.selectedEditor.dependParam;
      }
      this.spart.destroy();
      this.spart = editorManager.createEditor(this.param, 'input', 'setting');
      html.place(this.spart.domNode, this.specialSectionNode);

    }
  });

  return clazz;

});