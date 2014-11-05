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
    'dojo/on',
    'dojo/aspect',
    'dojo/dom-style',
    'dijit/registry',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'esri/dijit/Measurement',
    "esri/symbols/jsonUtils"
  ],
  function(
    declare,
    lang,
    on,
    aspect,
    domStyle,
    registry,
    _WidgetsInTemplateMixin,
    BaseWidget,
    Measurement,
    jsonUtils) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      name: 'Measurement',
      measurement: null,

      startup: function() {
        this.inherited(arguments);

        var json = this.config.measurement;
        json.map = this.map;
        if(json.lineSymbol){
          json.lineSymbol = jsonUtils.fromJson(json.lineSymbol);
        }
        if(json.pointSymbol){
          json.pointSymbol = jsonUtils.fromJson(json.pointSymbol);
        }

        this.measurement = new Measurement(json, this.measurementDiv);
        aspect.after(this.measurement, 'setTool', lang.hitch(this, function(){
          if (this.measurement.activeTool){
            this.disableWebMapPopup();
          }else{
            this.enableWebMapPopup();
          }
        }));
        this.measurement.startup();
      },

      disableWebMapPopup:function(){
        if(this.map && this.map.webMapResponse){
          var handler = this.map.webMapResponse.clickEventHandle;
          if(handler){
            handler.remove();
            this.map.webMapResponse.clickEventHandle = null;
          }
        }
      },

      enableWebMapPopup:function(){
        if(this.map && this.map.webMapResponse){
          var handler = this.map.webMapResponse.clickEventHandle;
          var listener = this.map.webMapResponse.clickEventListener;
          if(listener && !handler){
            this.map.webMapResponse.clickEventHandle = on(this.map,'click',lang.hitch(this.map,listener));
          }
        }
      },

      onClose: function(){
        if (this.measurement && this.measurement.activeTool){
          this.measurement.clearResult();
          this.measurement.setTool(this.measurement.activeTool, false);
        }
      },

      destroy: function(){
        if (this.measurement){
          this.measurement.destroy();
        }
        this.inherited(arguments);
      }
    });
    return clazz;
  });