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
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'dojo/_base/lang',
    'dojo/on',
    "dojo/dom-style",
    "jimu/dijit/SymbolChooser",
    "dojo/query",
    "esri/symbols/jsonUtils",
    'jimu/dijit/Message',
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "jimu/dijit/CheckBox",
    "../utils"
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Table,
    lang,
    on,
    domStyle,
    SymbolChooser,
    query,
    jsonUtils,
    Message,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol, CheckBox, utils) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-attributetable-setting',
      featureLayers: [],
      currentLabel: "",

      startup: function() {
        this.inherited(arguments);
        if (!this.config.layers) {
          this.config.layers = [];
        }

        var fields = [{
          name: 'label',
          title: this.nls.label,
          type: 'text'
        }, {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          actions: ['edit'],
          'class': 'symbol'
        }, {
          name: 'show',
          title: this.nls.show,
          type: 'checkbox',
          'class': 'show'
        }];

        var args = {
          fields: fields,
          selectable: false
        };
        this.displayFieldsTable = new Table(args);
        this.displayFieldsTable.placeAt(this.tableLayerInfos);
        this.displayFieldsTable.startup();
        this.own(on(this.displayFieldsTable, 'actions-edit', lang.hitch(this, this.gotoEditPage)));
        this.own(on(this.symbolChooser, 'change', lang.hitch(this, this.onChange)));
        this.setConfig(this.config);
      },

      switchPage: function() {
        var display = domStyle.get(this.firstPage, "display");
        if (display === "none") {
          domStyle.set(this.secondPage, "display", "none");
          domStyle.set(this.firstPage, "display", "");
          this.currentLabel = "";
        } else {
          domStyle.set(this.firstPage, "display", "none");
          domStyle.set(this.secondPage, "display", "");
        }
      },

      onChange: function(newSymbol){
        if (this.currentLabel) {
          var len = this.config.layers.length;
          for (var i = 0; i < len; i++) {
            if (this.config.layers[i].name === this.currentLabel) {
              this.config.layers[i].selectionSymbol = newSymbol.toJson();
            }
          }
        }
      },

      gotoEditPage: function(tr) {
        var tds = query(".action-item-parent", tr);
        var data;
        if (tds && tds.length) {
          data = this.displayFieldsTable.getRowData(tr);
          if (!data.show) {
            var popup = new Message({
              message: this.nls.warning,
              buttons: [{
                label: this.nls.ok,
                onClick: lang.hitch(this, function() {
                  popup.close();
                })
              }]
            });
          } else {
            this.switchPage();
            this.currentLabel = data.label;
            this.getConfig();
            this.showSymbol(data);
          }
        }
      },

      showSymbol: function(data) {
        if (data.show && data.label) {
          var symbol = this.getSymbol(data.label);
          if (symbol) {
            this.symbolChooser.showBySymbol(symbol);
          }
        }
      },

      getSymbol: function(label) {
        var symbol;
        var len = this.config.layers.length;
        for (var i = 0; i < len; i++) {
          if (this.config.layers[i].name === label) {
            if (this.config.layers[i].selectionSymbol) {
              symbol = jsonUtils.fromJson(this.config.layers[i].selectionSymbol);
            }else{
              var layer = this.getLayer(label);
              if(layer.geometryType === "esriGeometryPoint"){
                symbol = new SimpleMarkerSymbol();
              }else if(layer.geometryType === "esriGeometryPolyline"){
                symbol = new SimpleLineSymbol();
              }else{
                symbol = new SimpleFillSymbol();
              }
            }
            break;
          }
        }
        return symbol;
      },

      setConfig: function(config) {
        this.config = config;
        
        this.displayFieldsTable.clear();
        this.featureLayers.length = 0;
        utils.readLayersFromMap(this.map).then(lang.hitch(this, function(layers){
          this._init(layers, config);
        }));
      },

      _init: function(layers, config){
        for(var i = 0; i < layers.length; i++){
          var show;
          if(config.layers && config.layers.length > 0){
            show = this.isLayerInConfig(layers[i], config);
          }else{
            //by default, show visible layers
            show = layers[i].visible;
          }
          this.displayFieldsTable.addRow({
            label: layers[i].name,
            show: show
          });
          this.featureLayers.push({
            label: layers[i].name,
            layer: layers[i]
          });
        }
        
        if (layers.length === 0) {
          domStyle.set(this.tableEditInfosError, "display", "");
          this.tableEditInfosError.innerHTML = this.nls.noLayers;
        } else {
          domStyle.set(this.tableEditInfosError, "display", "none");
        }
        if(this.config.hideExportButton){
          this.exportcsv.uncheck();
        }else{
          this.exportcsv.check();
        }
      },

      isLayerInConfig: function(layer, config) {
        if (config.layers) {
          var info = config.layers;
          var len = info.length;
          for (var i = 0; i < len; i++) {
            if (info[i].layer && info[i].layer.url) {
              if (info[i].layer.url.toLowerCase() === layer.url.toLowerCase()) {
                return true;
              }
            }
          }
        }
        return false;
      },

      getLayer: function(label) {
        var len = this.featureLayers.length;
        for (var i = 0; i < len; i++) {
          if (this.featureLayers[i].label === label) {
            return this.featureLayers[i].layer;
          }
        }
        return null;
      },

      getConfigLayer: function(label) {
        var len = this.config.layers.length;
        for (var i = 0; i < len; i++) {
          if (this.config.layers[i].name === label) {
            return this.config.layers[i];
          }
        }
        return null;
      },

      getSymbolInConfig: function(label, config) {
        if (config.layers) {
          var info = config.layers;
          var len = info.length;
          for (var i = 0; i < len; i++) {
            if (info[i].name === label) {
              if (info[i].selectionSymbol) {
                return jsonUtils.fromJson(info[i].selectionSymbol);
              } else {
                return null;
              }

            }
          }
        }
        return null;
      },

      getOperationalLayerTitle: function(layer) {
        var title = "";
        if (this.appConfig.map && this.appConfig.map.operationallayers) {
          var len = this.appConfig.map.operationallayers.length;
          for (var i = 0; i < len; i++) {
            if (this.appConfig.map.operationallayers[i].url.toLowerCase() === layer.url.toLowerCase()) {
              title = this.appConfig.map.operationallayers[i].label;
              break;
            }
          }
        }
        if (!title) {
          title = layer.name;
        }
        if (!title) {
          title = layer.url;
        }
        return title;
      },

      getConfig: function() {
        var data = this.displayFieldsTable.getData();
        var table = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
          if (data[i].show) {
            var json = {};
            json.name = data[i].label;
            json.layer = {};
            json.layer.url = this.getLayer(json.name).url;
            var clayer = this.getConfigLayer(json.name);
            if(clayer){
              json.selectionSymbol = clayer.selectionSymbol;
            }
            json.show = data[i].show;
            table.push(json);
          }
        }
        this.config.layers.length = table.length;
        this.config.layers = table;
        if(this.exportcsv.getValue()){
          this.config.hideExportButton = false;
        }else{
          this.config.hideExportButton = true;
        }
        return this.config;
      }

    });
  });