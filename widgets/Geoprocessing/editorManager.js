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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  'dojo/aspect',
  'dojo/Deferred',
  'dojo/promise/all',
  'dijit/form/NumberTextBox',
  'dijit/form/Select',
  'dijit/form/TextBox',
  'dijit/form/DateTextBox',
  'dijit/form/TimeTextBox',
  'esri/symbols/jsonUtils',
  'jimu/dijit/CheckBox',
  'jimu/dijit/URLInput',
  './editors/simpleEditors',
  './editors/FeatureSetEditorChooser',
  './editors/FeatureSetRendererEditor',
  './editors/FeatureSetResultEditor'
],
function(declare, _WidgetBase, lang, array, html, on, aspect, Deferred, all, NumberTextBox, Select, TextBox, DateTextBox, TimeTextBox,
  symbolUtils, CheckBox, URLInput, simpleEditors, FeatureSetEditorChooser, FeatureSetRendererEditor, FeatureSetResultEditor) {
  var mo = {}, map, editors = [], nls;

  mo.createEditor = function(param, direction, context) {
  //summary:
  //  create input eidtor depends on the parameter type.
  //context: the editor is in the setting page, or the runtime widget page
  //  setting, widget
    var editor;
    var editorName = getEditorNameFromParam(param, direction, context);
    var o = {
      param: param,
      map: map,
      nls: nls,
      context: context,
      editorManager: mo,
      style: {
        width: '100%'
      }
    };
    if(editorName === 'UnsupportEditor'){
      o.message = 'type ' + param.dataType + ' is not supported for now.';
      editor = new simpleEditors.UnsupportEditor(o);
    }else if(editorName === 'ShowMessage'){
      o.message = getRendererTipMessage(param);
      editor = new simpleEditors.UnsupportEditor(o);
    }else if(editorName === 'MultiValueChooser'){
      editor = new simpleEditors.MultiValueChooser(o);
    }else if(editorName === 'MultiValueEditor'){
      editor = new simpleEditors.MultiValueEditor(o);
    }else if(editorName === 'NumberTextBox'){
      o.gEditor = new NumberTextBox({
        value: param.defaultValue === undefined? '': param.defaultValue
      });
      editor = new simpleEditors.GeneralEditorWrapperEditor(o);
    }else if(editorName === 'Select'){
      o.gEditor = new Select({
        options: array.map(param.choiceList, function(choice) {
          return {
            label: choice,
            value: choice
          };
        })
      });
      editor = new simpleEditors.GeneralEditorWrapperEditor(o);
    }else if(editorName === 'TextBox'){
      o.gEditor = new TextBox({value: param.defaultValue === undefined? '': param.defaultValue});

      editor = new simpleEditors.GeneralEditorWrapperEditor(o);
    }else if(editorName === 'CheckBox'){
      o.gEditor = new CheckBox({checked: param.defaultValue === undefined? false: param.defaultValue});

      editor = new simpleEditors.GeneralEditorWrapperEditor(o);
    }else if(editorName === 'LinerUnitEditor'){
      editor = new simpleEditors.LinerUnitEditor(o);
    }else if(editorName === 'DateTimeEditor'){
      editor = new simpleEditors.DateTimeEditor(o);
    }else if(editorName === 'URLInput'){
      o.gEditor = new URLInput({value: param.defaultValue === undefined? '': param.defaultValue});

      editor = new simpleEditors.GeneralEditorWrapperEditor(o);
    }else if(editorName === 'ObjectUrlEditor'){
      if(param.defaultValue && typeof param.defaultValue === 'string'){
        o.value = param.defaultValue;
      }
      editor = new simpleEditors.ObjectUrlEditor(o);
    }else if(editorName === 'SelectFeatureSetFromDraw'){
      if(param.defaultValue === undefined){
        o.message = 'No defaultValue property.';
        editor = new simpleEditors.UnsupportEditor(o);
      }else{
        var drawType = param.defaultValue.geometryType.substr('esriGeometry'.length, param.defaultValue.geometryType.length).toLowerCase();
        o.types = [drawType];
        o.showClear = true;
        if(param.symbol){
          o[drawType + 'Symbol'] = symbolUtils.fromJson(param.symbol);
        }
        editor = new simpleEditors.SelectFeatureSetFromDraw(o);
      }
    }else if(editorName === 'SelectFeatureSetFromLayer'){
      if(param.defaultValue && param.defaultValue.geometryType){
        o.geometryType = param.defaultValue.geometryType;
      }
      if(param.defaultValue){
        o.value = param.defaultValue;
      }
      editor = new simpleEditors.SelectFeatureSetFromLayer(o);
    }else if(editorName === 'SelectFeatureSetFromUrl'){
      o.querySetting = param.defaultValue;
      o.value = param.featureSetUrl;
      editor = new simpleEditors.SelectFeatureSetFromUrl(o);
    }else if(editorName === 'FeatureSetEditorChooser'){
      editor = new FeatureSetEditorChooser(o);
    }else if(editorName === 'LayerFieldChooser'){
      if(param.defaultValue){
        o.value = param.defaultValue;
      }
      editor = new simpleEditors.LayerFieldChooser(o);
    }else if(editorName === 'FeatureSetResultEditor'){
      editor = new FeatureSetResultEditor(o);
    }else if(editorName === 'GetUrlObjectFromLayer'){
      if(param.defaultValue){
        o.value = param.defaultValue;
      }
      editor = new simpleEditors.GetUrlObjectFromLayer(o);
    }else{
      o.message = 'wrong editorName.' + editorName;
      editor = new simpleEditors.UnsupportEditor(o);
    }

    if(param.editorDependParamName){
      editor.dependParam = param.editorDependParamName;
    }

    //destroy
    aspect.before(editor, 'destroy', function(){
      editors.splice(editors.indexOf(editor), 1);
    });

    //init the editor depends on the dependParam
    if(editor.dependParam){
      array.forEach(editors, function(_editor){
        if(_editor.param.name === editor.dependParam){
          editor.update(_editor.getValue());
        }
      });
    }

    //update layer field when layer change
    if(editorName === 'SelectFeatureSetFromLayer'){
      on(editor, 'change', function(){
        array.forEach(editors, function(_editor){
          if(_editor.dependParam === param.name){
            _editor.update(editor.getValue());
          }
        });
      });
    }
    editors.push(editor);
    return editor;
  };

  mo.setMap = function(_map){
    map = _map;
  };

  mo.setNls = function(_nls){
    nls = _nls;
  };

  function getEditorNameFromParam(param, direction, context){
    if(param.editorName && param.dataType.indexOf('GPMultiValue') < 0){
      return param.editorName;
    }
    if(direction === 'input'){
      return geteditorName(param, context);
    }else{
      return getOutputEditorName(param, context);
    }
  }

  function geteditorName(param, context){
    if(param.dataType === 'GPMultiValue:GPFeatureRecordSetLayer'){
      return 'UnsupportEditor';
    }else if(param.dataType.indexOf('GPMultiValue') > -1 && (param.choiceList && param.choiceList.length > 0)){
      return 'MultiValueChooser';
    }else if(param.dataType.indexOf('GPMultiValue') > -1 && (!param.choiceList || param.choiceList.length === 0)){
      return 'MultiValueEditor';
    }else if(param.dataType === 'GPLong' || param.dataType === 'GPDouble'){
      return 'NumberTextBox';
    }else if(param.dataType === 'GPString'){
      if(param.choiceList && param.choiceList.length > 0){
        return 'Select';
      }else{
        return 'TextBox';
      }
    }else if(param.dataType === 'GPBoolean'){
      return 'CheckBox';
    }else if(param.dataType === 'GPLinearUnit'){
      return 'LinerUnitEditor';
    }else if(param.dataType === 'GPDate'){
      return 'DateTimeEditor';
    }else if(param.dataType === 'GPDataFile'){
      return 'ObjectUrlEditor';
    }else if(param.dataType === 'GPRasterDataLayer'){
      return 'ObjectUrlEditor';
    }else if(param.dataType === 'GPRecordSet'){
      //for now, we support url only
      return 'ObjectUrlEditor';
    }else if(param.dataType === 'GPFeatureRecordSetLayer'){
      //if code run to here, it's must be in setting page,
      //because when in widget, the editor name property must be existed.
      if(context === 'setting'){
        return 'FeatureSetEditorChooser';
      }else{
        if(param.featureSetMode === 'draw'){
          return 'SelectFeatureSetFromDraw';
        }else if(param.featureSetMode === 'layers'){
          return 'SelectFeatureSetFromLayer';
        }else if(param.featureSetMode === 'url'){
          return 'SelectFeatureSetFromUrl';
        }else{
          return 'UnsupportEditor';
        }
      }
    }else{
      return 'UnsupportEditor';
    }
  }

  function getOutputEditorName(param){
  //editors for output can only in setting page
    if(param.dataType === 'GPFeatureRecordSetLayer'){
      return 'FeatureSetResultEditor';
    }else{
      return 'ShowMessage';
    }
  }

  function getRendererTipMessage(param){
    var message;
    if(param.dataType === 'GPRecordSet'){
      message = 'table';
    }else if(param.dataType === 'GPDataFile' || param.dataType === 'GPRasterDataLayer'){
      message = 'link';
    }else{
      message = 'text';
    }
    
    return message;
  }
  
  return mo;
});