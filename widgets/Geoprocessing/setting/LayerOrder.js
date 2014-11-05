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
  'dijit/_WidgetBase',
  'jimu/dijit/SimpleTable'
],
function(declare, lang, html, array, on, _WidgetBase, SimpleTable) {
  return declare([_WidgetBase], {
    baseClass: 'jimu-widget-setting-gp-layer-order',

    postCreate: function(){
      this.inherited(arguments);
      this.table = new SimpleTable({
        fields: [{
          name: 'layerName',
          title: this.nls.layer,
          type: 'text'
        }, {
          name: 'actions',
          title: this.nls.action,
          type: 'actions',
          actions: ['up', 'down']
        }]
      });
      this.table.placeAt(this.domNode);
    },

    startup: function(){
      this.inherited(arguments);
      this.table.startup();
    },

    setConfig: function(config){
      this.config = config;
      this.table.clear();
      this._initLayerTable();
    },

    acceptValue: function(){
      this.config.layerOrder = array.map(this.table.getData(), function(data){
        return data.layerName;
      });
    },

    _initLayerTable: function(){
      var layerOrder = [];
      if(this.config.layerOrder){
        layerOrder = this.config.layerOrder;
      }else{
        //input is on the above most
        array.forEach(this.config.inputParams, function(param){
          if(param.dataType === 'GPFeatureRecordSetLayer'){
            layerOrder.push(param.name);
          }
        }, this);

        layerOrder.push('Operational Layers');

        //out put is on the low most
        array.forEach(this.config.outputParams, function(param){
          if(param.dataType === 'GPFeatureRecordSetLayer'){
            layerOrder.push(param.name);
          }
        }, this);
      }
      array.forEach(layerOrder, function(paramName){
        this.table.addRow({
          layerName: paramName
        });
      }, this);
    }

  });
});