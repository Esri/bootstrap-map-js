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
  'dojo/text!./FeatureSetResultEditor.html',
  'dijit/_TemplatedMixin',
  '../BaseEditor',
  './FeatureSetRendererEditor',
  'jimu/dijit/PopupConfig',
  'jimu/dijit/TabContainer',
  'jimu/dijit/CheckBox'
],
function(declare, lang, array, html, template, _TemplatedMixin, BaseEditor, FeatureSetRendererEditor, PopupConfig, TabContainer, CheckBox) {
  var clazz = declare([BaseEditor,_TemplatedMixin], {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-fsrse',

    templateString: template,
    featureSetRendererEditor:null,
    popupConfig:null,
    tab:null,
    args:null,

    constructor:function(o){
      this.args = lang.mixin({},o);
    },

    postCreate: function(){
      this.inherited(arguments);
      var tabs = [{title:'Renderer',content:this.rendererTab},{title:'Popup',content:this.popupConfigTab}];
      this.tab = new TabContainer({tabs:tabs,isNested:true});
      this.tab.placeAt(this.domNode);
      this.tab.startup();
      this.featureSetRendererEditor = new FeatureSetRendererEditor(this.args);
      this.featureSetRendererEditor.placeAt(this.rendererTab);
      this.featureSetRendererEditor.startup();
      var popupArgs = {};
      if(this.args && this.args.param){
        if(this.args.param.defaultValue){
          popupArgs.fields = this.args.param.defaultValue.fields;
        }
        var popup = this.args.param.popup;
        if(popup){
          var fieldNames = array.map(popup.fields,function(item){
            return item.name;
          });
          popupArgs.fields = array.map(popupArgs.fields,function(fieldInfo){
            var visible = array.indexOf(fieldNames,fieldInfo.name) >= 0;
            fieldInfo.visible = visible;
            return fieldInfo;
          });
          popupArgs.title = popup.title;
        }
      }
      this.popupConfig = new PopupConfig(popupArgs);
      this.popupConfig.placeAt(this.popupConfigTab);
      this.popupConfig.startup();

      this.enablePopup = new CheckBox({
        checked: !this.args.param.popup || this.args.param.popup.enablePopup === undefined || this.args.param.popup.enablePopup
      }, this.enablePopupNode);
      this.enablePopup.startup();
    },

    destroy:function(){
      if(this.featureSetRendererEditor){
        this.featureSetRendererEditor.destroy();
        this.featureSetRendererEditor = null;
      }
      if(this.popupConfig){
        this.popupConfig.destroy();
        this.popupConfig = null;
      }
      this.inherited(arguments);
    },

    getValue:function(){
      var result = {
        renderer:null,
        popup:this.popupConfig.getConfig()
      };
      if(this.enablePopup.checked){
        result.popup.enablePopup = true;
      }else{
        result.popup.enablePopup = false;
      }
      var rendererInfo = this.featureSetRendererEditor.getValue();
      if(rendererInfo){
        result.renderer = rendererInfo.renderer;
      }
      return result;
    }
  });
  return clazz;
});