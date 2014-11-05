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
  'dijit/_WidgetBase'],
  function (declare, lang, html, _WidgetBase) {
  return declare([_WidgetBase], {
    widget: null,
    baseClass: 'jimu-widget-frame jimu-container',

    postCreate: function(){
      this.inherited(arguments);
      if(!this.containerNode){
        this.containerNode = this.domNode;
      }
      if(this.widget){
        this.setWidget(this.widget);
      }
    },

    startup: function(){
      this.inherited(arguments);
      if(this.widget){
        this.widget.startup();
      }
    },

    resize: function(){
      if(this.widget && lang.isFunction(this.widget.resize)){
        this.widget.resize();
      }
    },

    setLoading: function(_loading){
      this.loading = _loading;
      this.loading.placeAt(this.containerNode);
    },

    getWidget: function(){
      return this.widget;
    },

    setWidget: function(w){
      this.widget = w;
      if(this.loading){
        this.loading.destroy();
      }
      html.place(w.domNode, this.containerNode);
      this.resize();
    },

    destroy: function(){
      if(this.widget && this.widget.domNode){
        try{
          this.widget.destroy();
        }catch(error){
          console.error('destroy widget error. widget: [' + this.widget.uri + '], ' + error.stack);
        }
      }
      if(this.loading && this.loading.domNode){
        this.loading.destroy();
      }
    }

  });
});