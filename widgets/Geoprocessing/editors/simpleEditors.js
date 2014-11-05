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
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  'dojo/Deferred',
  'dojo/promise/all',
  'dijit/form/NumberTextBox',
  'dijit/form/Select',
  'dijit/form/TextBox',
  'dijit/form/DateTextBox',
  'dijit/form/TimeTextBox',
  'jimu/dijit/CheckBox',
  'jimu/dijit/URLInput',
  'jimu/dijit/DrawBox',
  'esri/SpatialReference',
  'esri/tasks/LinearUnit',
  'esri/tasks/FeatureSet',
  'esri/layers/FeatureLayer',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/request',
  '../BaseEditor'
],
function(declare, lang, array, html, on, Deferred, all, NumberTextBox, Select, TextBox, DateTextBox, TimeTextBox,
CheckBox, URLInput, DrawBox, SpatialReference, LinearUnit, FeatureSet, FeatureLayer, Query, QueryTask, esriRequest, BaseEditor) {
  var mo = {};

  mo.UnsupportEditor = declare(BaseEditor, {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-unsupport',

    postCreate: function(){
      this.inherited(arguments);
      html.setAttr(this.domNode, 'innerHTML', this.message);
    },

    getValue: function(){
      return null;
    }
  });

  mo.ShowMessage = declare(BaseEditor, {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-message',

    postCreate: function(){
      this.inherited(arguments);
      html.setAttr(this.domNode, 'innerHTML', this.message);
    },

    getValue: function(){
      return null;
    }
  });

  mo.GeneralEditorWrapperEditor = declare(BaseEditor, {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-wrapper',

    postCreate: function(){
      this.inherited(arguments);
      html.setStyle(this.gEditor.domNode, 'width', '100%');
      this.gEditor.placeAt(this.domNode);
    },

    getValue: function(){
      return this.gEditor.getValue();
    }
  });

  mo.MultiValueChooser = declare(BaseEditor, {
  //this dijit is used to choose multi value from choice list
  //we support simple value only for now
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-multivalue-chooser',

    postCreate: function(){
      this.inherited(arguments);
      this.checkBoxs = [];
      array.forEach(this.param.choiceList, function(choice){
        var dijit = new CheckBox({
          label: choice,
          checked: this.param.defaultValue && this.param.defaultValue.indexOf(choice) > -1? true: false
        });
        dijit.placeAt(this.domNode);
        this.checkBoxs.push(dijit);
      }, this);
    },

    getValue: function(){
      var value = [];
      array.forEach(this.checkBoxs, function(checkBox){
        if(checkBox.checked){
          value.push(checkBox.label);
        }
      }, this);
      return value;
    }
  });

  mo.MultiValueEditor = declare(BaseEditor, {
  //this dijit is used to edit multi value, can add/delete value
  //we support simple value only for now
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-multivalue',

    postCreate: function(){
      this.inherited(arguments);
      this.editors = [];

      var inputListNode = html.create('div', {
        'class': 'input-list'
      }, this.domNode);

      var _param = lang.clone(this.param, inputListNode);
      _param.dataType = this.param.dataType.substr('GPMultiValue'.length + 1, this.param.dataType.length);
      _param.originParam = this.param;

      setTimeout(lang.hitch(this, this._initChildEditors, _param, inputListNode), 100);
      
      this._createAddInputNode(_param, inputListNode);
    },

    _initChildEditors: function(_param, inputListNode){
      if(this.param.defaultValue && this.param.defaultValue.length > 0){
        array.forEach(this.param.defaultValue, function(v){
          _param.defaultValue = v;
          this._createSingleInputContainerNode(_param, inputListNode);
        }, this);
      }else{
        //if no default value, create a default input area
        delete _param.defaultValue;
        this._createSingleInputContainerNode(_param, inputListNode);
      }
    },

    getValue: function(){
      var value = [];
      array.forEach(this.editors, function(editor){
        value.push(editor.getValue());
      }, this);
      return value;
    },

    getGPValue: function(){
      var def = new Deferred(),defs = [];
      array.forEach(this.editors, function(editor){
        defs.push(editor.getGPValue());
      }, this);
      all(defs).then(function(values){
        def.resolve(values);
      }, function(err){
        def.reject(err);
      });
      return def;
    },

    destroy: function(){
      array.forEach(this.editors, function(editor){
        editor.destroy();
      });
      this.editors = [];
      this.inherited(arguments);
    },

    _createSingleInputContainerNode: function(param, inputListNode){
      var node = html.create('div', {
        'class': 'single-input'
      }, inputListNode);

      var inputEditor = this.editorManager.createEditor(param, 'input', this.context);
      var width = html.getContentBox(this.domNode).w - 30 -3;
      html.setStyle(inputEditor.domNode, {
        display: 'inline-block',
        width: width + 'px'
      });
      inputEditor.placeAt(node);
      
      this._createRemoveInputNode(node);
      node.inputEditor = inputEditor;
      this.editors.push(inputEditor);
      return node;
    },

    _createRemoveInputNode: function(containerNode){
      var node = html.create('div', {
        'class': 'remove',
        innerHTML: '-'
      }, containerNode);
      this.own(on(node, 'click', lang.hitch(this, function(){
        this.editors.splice(this.editors.indexOf(containerNode.inputEditor), 1);
        containerNode.inputEditor.destroy();
        html.destroy(containerNode);
      })));
      return node;
    },

    _createAddInputNode: function(param, inputListNode){
      var node = html.create('div', {
        'class': 'add-input'
      }, this.domNode);
      var addNode = html.create('div', {
        'class': 'add-btn',
        innerHTML: '+'
      }, node);
      this.own(on(addNode, 'click', lang.hitch(this, function(){
        this._createSingleInputContainerNode(param, inputListNode);
      })));
      return node;
    }
  });

  mo.LinerUnitEditor = declare(BaseEditor, {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-liner-unit',

    postCreate: function(){
      this.inherited(arguments);
      this.distance = this.param.defaultValue === undefined? '': this.param.defaultValue.distance;
      this.units = this.param.defaultValue === undefined? '': this.param.defaultValue.units;

      if(this.distance === undefined){
        this.distance = 0;
      }
      if(this.units === undefined){
        this.units = 'esriMeters';
      }
      this.inputDijit = new NumberTextBox({value: this.distance});
      this.selectDijit = new Select({
        value: this.units,
        options: [
          {label: 'Meters', value: 'esriMeters'},
          {label: 'Kilometers', value: 'esriKilometers'},
          {label: 'Feet', value: 'esriFeet'},
          {label: 'Miles', value: 'esriMiles'},
          {label: 'NauticalMiles', value: 'esriNauticalMiles'},
          {label: 'Yards', value: 'esriYards'}
        ]
      });
      this.inputDijit.placeAt(this.domNode);
      this.selectDijit.placeAt(this.domNode);
    },

    getValue: function(){
      var ret = new LinearUnit();
      ret.distance = this.inputDijit.getValue();
      ret.units = this.selectDijit.getValue();
      return ret;
    }
  });

  mo.DateTimeEditor = declare(BaseEditor, {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-datatime',

    postCreate: function(){
      this.value = this.param.defaultValue? new Date(this.param.defaultValue): new Date();
      this.inherited(arguments);
      this.dateDijit = new DateTextBox({
        value: this.value,
        style: {width: '60%'}
      });
      this.timeDijit = new TimeTextBox({value: this.value, style: {width: '40%'}});
      this.dateDijit.placeAt(this.domNode);
      this.timeDijit.placeAt(this.domNode);
    },

    getValue: function(){
      var ret = new Date();
      var dt = this.dateDijit.getValue();
      var time = this.timeDijit.getValue();
      ret.setFullYear(dt.getFullYear());
      ret.setMonth(dt.getMonth());
      ret.setDate(dt.getDate());
      ret.setHours(time.getHours());
      ret.setMinutes(time.getMinutes());
      ret.setSeconds(time.getSeconds());
      return ret.getTime();
    }
  });

  mo.SelectFeatureSetFromDraw = declare([BaseEditor, DrawBox], {
    constructor: function(options){
      this.drawLayerId = options.param.name;
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-gp-editor-draw');
      html.addClass(this.domNode, 'jimu-gp-editor-base');
      this.startup();
    },

    onDrawEnd: function(graphic){
      this.graphic = graphic;
    },

    onClear:function(){
      this.graphic = null;
    },

    getValue: function(){
      if(this.graphic){
        var featureset = new FeatureSet();
        featureset.features = [this.graphic];
        return featureset;
      }else{
        return null;
      }
    }
  });

  mo.SelectFeatureSetFromLayer = declare([BaseEditor, Select], {
    postCreate: function(){
      this.options = [];
      array.forEach(this.map.graphicsLayerIds, function(layerId){
        var layer = this.map.getLayer(layerId);
        if(layer.declaredClass === 'esri.layers.FeatureLayer' && (!this.geometryType || layer.geometryType === this.geometryType)){
          this.options.push({
            label: layer.label || layer.title || layer.name || layer.id,
            value: layer.id
          });
        }
      }, this);

      this.inherited(arguments);

      this.setValue(this.value);
      html.addClass(this.domNode, 'jimu-gp-editor-sffl');
      html.addClass(this.domNode, 'jimu-gp-editor-base');
    },

    getValue: function(){
      return this.value;
    },

    getGPValue: function(){
      var query = new Query();
      query.where = '1=1';
      var layer = this.map.getLayer(this.value);
      return layer.queryFeatures(query);
    }
  });

  mo.GetUrlObjectFromLayer = declare([BaseEditor, Select], {
    postCreate: function(){
      this.options = [];
      array.forEach(this.map.graphicsLayerIds, function(layerId){
        var layer = this.map.getLayer(layerId);
        if(layer.declaredClass === 'esri.layers.FeatureLayer' && (!this.geometryType || layer.geometryType === this.geometryType)){
          this.options.push({
            label: layer.label || layer.title || layer.name || layer.id,
            value: layer.id
          });
        }
      }, this);

      this.inherited(arguments);

      this.setValue(this.value);
      html.addClass(this.domNode, 'jimu-gp-editor-sffl');
      html.addClass(this.domNode, 'jimu-gp-editor-base');
    },

    getValue: function(){
      return this.value;
    },

    getGPValue: function(){
      var url, value;
      array.forEach(this.map.graphicsLayerIds, function(layerId){
        var layer = this.map.getLayer(layerId);
        if(layerId === this.getValue()){
          url = layer.url;
        }
      }, this);

      value = {url: url};
      value = this.wrapGPValue(value);
      return this.wrapValueToDeferred(value);
    }
  });

  mo.SelectFeatureSetFromUrl = declare([BaseEditor, URLInput], {
    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-gp-editor-sffu');
      html.addClass(this.domNode, 'jimu-gp-editor-base');
      
      this.queryTask = new QueryTask(this.value);
    },

    getValue: function(){
      return this.value;
    },

    getGPValue: function(){
      var query = new Query();
      query.where = '1=1';
      query.returnGeometry = true;
      query.outFields = array.map(this.querySetting.fields, function(field){
        return field.name;
      }, this);
      query.outSpatialReference = new SpatialReference(this.querySetting.spatialReference.wkid);
      return this.queryTask.execute(query);
    }
  });

  mo.ObjectUrlEditor = declare([BaseEditor, URLInput], {
    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-gp-editor-ourl');
      html.addClass(this.domNode, 'jimu-gp-editor-base');
    },

    getValue: function(){
      return this.value;
    },

    getGPValue: function(){
      var value = {url: this.getValue()};
      value = this.wrapGPValue(value);
      return this.wrapValueToDeferred(value);
    }
  });

  mo.LayerFieldChooser = declare([BaseEditor, Select], {
    postCreate: function(){
      this.options = [];
      this.inherited(arguments);
      this.setValue(this.value);
      html.addClass(this.domNode, 'jimu-gp-editor-lfc');
      html.addClass(this.domNode, 'jimu-gp-editor-base');
    },

    update: function(layerId){
      this.inherited(arguments);
      var options = [];
      var layer;

      this.set('options', []);
      this.set('value', '');

      array.some(this.map.graphicsLayerIds, function(_layerId){
        if(_layerId === layerId){
          layer = this.map.getLayer(layerId);
          return true;
        }
      }, this);

      if(layer){
        this._requestLayerInfo(layer.url).then(lang.hitch(this,function(response){
          if(response && response.fields){
            var fields = array.filter(response.fields,function(item){
              return item.type !== 'esriFieldTypeOID' && item.type !== 'esriFieldTypeGeometry';
            });
            
            options = array.map(fields, function(field){
              return {
                label: field.alias || field.name,
                value: field.name
              };
            }, this);
            this.set('options', options);
          }
        }));
      }
    },

    _requestLayerInfo:function(url){
      return esriRequest({
        url:url,
        content:{f:"json"},
        handleAs:"json",
        callbackParamName:"callback"
      });
    }
  });

  return mo;
});