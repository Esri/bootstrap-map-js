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
  'dijit/_WidgetBase',
  'dijit/_Container',
  './dijit/LoadingIndicator',
  './dijit/IFramePane',
  './BaseWidgetFrame'],
  function (declare, lang, array, html, _WidgetBase, _Container, LoadingIndicator, IFramePane, BaseWidgetFrame) {
  return declare([_WidgetBase, _Container], {
    baseClass: 'jimu-widget-panel jimu-container',
    started: false,
    state: 'closed',
    windowState: 'normal',
    defaultState: 'normal',
    type: 'panel',

    constructor: function(){
    },

    postCreate: function(){
      this.inherited(arguments);
      if(this.map.usePlugin && this.position){
        //TODO
        //check whether the panel is above the map.
        //If it's not above onto the map, do not create iframe pane.
        this.iframePane = new IFramePane({
          r: 8,
          position: this.position
        });
        html.place(this.iframePane.domNode, this.containerId);
      }
    },

    startup: function(){
      this.inherited(arguments);
      
      if(this.iframePane){
        this.iframePane.startup();
      }
      this.loadAllWidgetsInOrder();
      this.started = true;
    },
    
    loadAllWidgetsInOrder: function(){
      var configs = this.getAllWidgetConfigs();
      if(Array.isArray(this.config.widgets)){
        configs = this.config.widgets;
      }else{
        configs = [this.config];
      }
      array.forEach(configs, function(widgetConfig){
        var frame, loading;

        loading = new LoadingIndicator();
        frame = this.createFrame(widgetConfig);
        this.addChild(frame);
        frame.setLoading(loading);

        this.widgetManager.loadWidget(widgetConfig).then(lang.hitch(this, function(widget){
          frame.setWidget(widget);
          widget.startup();
          // if(widget.defaultState){
          //   this.widgetManager.changeWindowStateTo(widget, widget.defaultState);
          // }
        }));
      }, this);
    },

    getAllWidgetConfigs: function(){
      var configs = [];
      if(Array.isArray(this.config.widgets)){
        configs = this.config.widgets;
      }else{
        configs = [this.config];
      }
      return configs;
    },

    getWidgetById: function(widgetId){
      var frames = this.getChildren();
      for(var i = 0; i < frames.length; i++){
        if(frames[i].getWidget() && frames[i].getWidget().id === widgetId){
          return frames[i].getWidget();
        }
      }
    },

    createFrame: function(widgetSetting){
      /*jshint unused: false*/
      return new BaseWidgetFrame();
    },

    setState: function(state){
      this.state = state;
    },

    setWindowState: function(state){
      this.windowState = state;
    },

    resize: function(){
      this.getChildren().forEach(function(frame){
        frame.resize();
      });
      if(this.iframePane){
        this.iframePane.resize();
      }
    },

    onOpen: function(){
      array.forEach(this.getChildren(), function(frame){
        if(frame.getWidget()){
          this.widgetManager.openWidget(frame.getWidget());
        }
      }, this);
      if(this.iframePane){
        html.setStyle(this.iframePane.domNode, 'display', "");
      }
    },

    onClose: function(){
      array.forEach(this.getChildren(), function(frame){
        if(frame.getWidget()){
          this.widgetManager.closeWidget(frame.getWidget());
        }
      }, this);
      if(this.iframePane){
        html.setStyle(this.iframePane.domNode, 'display', "none");
      }
    },

    onMaximize: function(){
      array.forEach(this.getChildren(), function(frame){
        if(frame.getWidget()){
          this.widgetManager.maximizeWidget(frame.getWidget());
        }
      }, this);
    },

    onMinimize: function(){
      array.forEach(this.getChildren(), function(frame){
        if(frame.getWidget()){
          this.widgetManager.minimizeWidget(frame.getWidget());
        }
      }, this);
    },

    onNormalize: function(){
      array.forEach(this.getChildren(), function(frame){
        if(frame.getWidget()){
          this.widgetManager.normalizeWidget(frame.getWidget());
        }
      }, this);
    },

    //update the config without reload the widget
    updateConfig: function(_config){
      this._updateConfig(_config);
    },

    reloadWidget: function(widgetConfig){
      if(!this.isWidgetInPanel(widgetConfig)){
        return;
      }

      this._updateConfig(widgetConfig);

      this.getChildren().forEach(function(frame){
        if(frame.getWidget() && frame.getWidget().id === widgetConfig.id){
          frame.getWidget().destroy();
          frame.setLoading(new LoadingIndicator());
          this.widgetManager.loadWidget(widgetConfig).then(lang.hitch(this, function(widget){
            frame.setWidget(widget);
            widget.startup();
            if(this.state === 'closed'){
              this.widgetManager.closeWidget(widget);
            }
          }));
        }
      }, this);
    },

    isWidgetInPanel: function(widgetConfig){
      if(array.some(this.getAllWidgetConfigs(), function(wc){
        if(widgetConfig.id === wc.id){
          return true;
        }
      })){
        //the widget is in the panel
        return true;
      }else{
        return false;
      }
    },

    _updateConfig: function(widgetConfig) {
      if(Array.isArray(this.config.widgets)){
        var index = -1;
        for(var i = 0; i < this.config.widgets.length; i++){
          if(this.config.widgets[i].id === widgetConfig.id){
            index = i;
          }
        }
        if(index > 0){
          this.config.widgets[index] = widgetConfig;
        }
      }else{
        this.config = widgetConfig;
      }
    },

    destroy: function(){
      this.getChildren().forEach(function(frame){
        try{
          if(frame.domNode){
            frame.destroy();
          }
        }catch(error){
          console.error('destroy widget frame error.' + error.stack);
        }
      });
      this.inherited(arguments);
    }
  });
});