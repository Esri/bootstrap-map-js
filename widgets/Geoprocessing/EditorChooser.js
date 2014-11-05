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
  'dojo/query',
  'dijit/_WidgetBase',
  'dijit/form/Select'
],
function(declare, lang, html, array, on, query, _WidgetBase, Select) {
  //summary:
  var clazz = declare([_WidgetBase], {

    baseClass: 'jimu-gp-editor-chooser',

    //we can't choose these editors because:
    //  MultivalueEditor: some bugs
    //  SelectFeatureSetFromDraw: we don't know the feature type, but GP parameter has geometryType property
    editors: [
      {name: 'NumberTextBox', label: 'NumberTextBox', description: ''},
      {name: 'URLInput',  label: 'URLInput', description: ''},
      {name: 'CheckBox',  label: 'CheckBox', description: ''},
      {name: 'DateTimeEditor',  label: 'DateTime Chooser', description: ''},
      {name: 'LinerUnitEditor',  label: 'LinerUnit Editor', description: ''},
      {name: 'SelectFeatureSetFromLayer',  label: 'SelectFeatureSetFromLayer', description: ''},
      {name: 'SelectFeatureSetFromUrl',  label: 'SelectFeatureSetFromUrl', description: ''},
      {name: 'GetUrlObjectFromLayer',  label: 'GetUrlObjectFromLayer', description: ''},
      {name: 'LayerFieldChooser',  label: 'LayerFieldChooser', description: ''}
    ],

    postCreate: function(){
      this.inherited(arguments);
      this._createEditorNodes();
    },

    _createEditorNodes: function(){
      array.forEach(this.editors, function(editor){
        this._createEditorNode(editor);
      }, this);
    },

    _createEditorNode: function(editor){
      var node = html.create('div', {
        'class': 'editor-node'
      }, this.domNode);
      this.box = html.create('div', {
        'class': 'node-box'
      }, node);
      html.create('img', {
        'src': editor.img
      }, this.box);
      html.create('div', {
        'class': 'node-label',
        'innerHTML': editor.label
      }, node);

      if(editor.name === 'LayerFieldChooser'){
        var paramSelect = new Select({
          options: array.map(this.inputParams, function(param) {
            return {
              label: param.name,
              value: param.name
            };
          }),
          style: {
            position: 'absolute',
            right: 0,
            bottom: 0
          }
        });
        paramSelect.placeAt(this.box);
      }
      this.own(on(node, 'click', lang.hitch(this, function(){
        query('.editor-node').removeClass('jimu-state-selected');
        html.addClass(node, 'jimu-state-selected');
        this.selectedEditor = editor;
        if(paramSelect){
          this.selectedEditor.dependParam = paramSelect.getValue();
        }
      })));
      return node;
    }
  });
  return clazz;
});