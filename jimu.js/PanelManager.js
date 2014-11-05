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
  'dojo/_base/fx',
  'dojo/Deferred',
  'dojo/on',
  'dojo/aspect',
  'require',
  './utils',
  './WidgetManager'],
function (declare, lang, array, html, baseFx, Deferred, on, aspect, require, utils, WidgetManager) {
  var clazz, instance = null;

  clazz = declare(null, {
    constructor: function(){
      //{id, uri, object}
      this.panels = [];
      this.widgetManager = WidgetManager.getInstance();

      on(window, 'resize', lang.hitch(this, this.onWindowResize));
    },

    
    showPanel: function(config){
      /*global jimuConfig*/
      // summary: 
      //    show panel depends on the config object(widget/group's config)
      var pid = config.id + '_panel',  panel = this.getPanelById(pid), def = new Deferred();
      if(panel){
        if(panel.state === 'closed'){
          this.openPanel(panel, config.panel.position);
        }
        
        // if(panel.windowState){
        //   this.changeWindowStateTo(panel, panel.windowState);
        // }

        def.resolve(panel);
      }else{
        require([config.panel.uri], lang.hitch(this, function(Panel){
          var containerId;
          if(config.panel.positionRelativeTo === 'map'){
            containerId = jimuConfig.mapId;
          }else{
            containerId = jimuConfig.layoutId;
          }

          var options = {
            widgetIcon: config.panel.widgetIcon,
            label: config.label,
            config: config,
            uri: config.panel.uri,
            position: config.panel.position,
            positionRelativeTo: config.panel.positionRelativeTo,
            map: this.map,
            widgetManager: this.widgetManager,
            panelManager: this,
            containerId: containerId,
            id: pid,
            gid: config.gid
          };
          lang.mixin(options, config.panel.options);
          var panel;

          try{
            panel = new Panel(options);
            console.log('panel [' + pid + '] created.');
          }catch(error){
            console.log('create panel error: ' + error + ', panelId: ' + pid);
            def.reject(error);
          }

          html.setStyle(panel.domNode, 'opacity', 0);
          html.setStyle(panel.domNode, utils.getPositionStyle(config.panel.position));
          aspect.before(panel, 'destroy', lang.hitch(this, this.onDestroyPanel, panel));

          html.place(panel.domNode, containerId);

          try{
            panel.startup();
          }catch(err){
            console.log(console.error('fail to startup panel ' + panel.id + '. ' + err.stack));
          }
          
          this.openPanel(panel);
          //use the widget/group default state as the panel's default state
          // if(config.defaultState){
          //   panel.defaultState = config.defaultState;
          // }
          // this.changeWindowStateTo(panel, panel.defaultState);

          utils.setVerticalCenter(panel.domNode);
          this.panels.push(panel);
          def.resolve(panel);
        }));
      }
      return def;
    },

    closeOtherPanelsInTheSameGroup: function (panel){
      for(var i = 0; i < this.panels.length; i++){
        if(this.panels[i].gid === panel.gid && this.panels[i].id !== panel.id){
          this.closePanel(this.panels[i], false);
        }
      }
    },

    openPanel: function(panel, position){
      var def = new Deferred();

      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          return;
        }
      }

      if(panel.state === 'opened'){
        def.resolve();
        return;
      }

      try{
        this.closeOtherPanelsInTheSameGroup(panel);
        html.setStyle(panel.domNode, 'display', 'block');
        html.setStyle(panel.domNode, utils.getPositionStyle(position));
        baseFx.animateProperty({
          node: panel.domNode,
          properties: {opacity: 1},
          duration: 200,
          onEnd: lang.hitch(this, function(){
            panel.setState('opened');
            panel.onOpen();
            def.resolve();
          })
        }).play();
      }catch(err){
        console.log(console.error('fail to open panel ' + panel.id + '. ' + err.stack));
      }

      
      return def;
    },

    closePanel: function(panel, anim){
      var def = new Deferred();

      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          def.resolve();
          return def;
        }
      }

      if(anim === undefined){
        anim = true;
      }

      if(panel.state === 'closed'){
        def.resolve();
        return def;
      }

      try{
        if(anim){
          baseFx.animateProperty({
            node: panel.domNode,
            properties: {opacity: 0},
            duration: 200,
            onEnd: function(){
              panel.setState('closed');
              panel.onClose();
              html.setStyle(panel.domNode, 'display', 'none');
              def.resolve();
            }
          }).play();
        }else{
          panel.setState('closed');
          panel.onClose();
          html.setStyle(panel.domNode, 'display', 'none');
          def.resolve();
        }
      }catch(err){
        console.log(console.error('fail to close panel ' + panel.id + '. ' + err.stack));
      }
      
      return def;
    },

    minimizePanel: function(panel){
      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          return;
        }
      }

      if(panel.state === 'closed'){
        this.openPanel(panel);
      }

      panel.setWindowState('minimized');

      try{
        panel.onMinimize();
      }catch(err){
        console.log(console.error('fail to minimize panel ' + panel.id + '. ' + err.stack));
      }
    },

    maximizePanel: function(panel){
      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          return;
        }
      }

      if(panel.state === 'closed'){
        this.openPanel(panel);
      }

      panel.setWindowState('maximized');
      try{
        panel.onMaximize();
      }catch(err){
        console.log(console.error('fail to maximize panel ' + panel.id + '. ' + err.stack));
      }
    },

    normalizePanel: function(panel){
      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          return;
        }
      }

      if(panel.state === 'closed'){
        this.openPanel(panel);
      }

      panel.setWindowState('normal');
      try{
        panel.onNormalize();
      }catch(err){
        console.log(console.error('fail to noralize panel ' + panel.id + '. ' + err.stack));
      }
    },

    changeWindowStateTo: function(panel, state){
      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          return;
        }
      }

      if(state === 'normal'){
        this.normalizePanel(panel);
      }else if(state === 'minimized'){
        this.minimizePanel(panel);
      }else if(state === 'maximized'){
        this.maximizePanel(panel);
      }else{
        console.log('error state: ' + state);
      }
    },

    getPanelById: function(pid){
      for(var i = 0; i < this.panels.length; i++){
        if(this.panels[i].id === pid){
          return this.panels[i];
        }
      }
    },

    onWindowResize: function(){
      for(var i = 0; i < this.panels.length; i++){
        if(this.panels[i].state !== 'closed'){
          this.panels[i].resize();
        }
      }
    },

    destroyPanel: function(panel){
      if(typeof panel === 'string'){
        panel = this.getPanelById(panel);
        if(!panel){
          return;
        }
      }
      
      if(!panel.domNode){
        return;
      }
      if(panel.state !== 'closed'){
        this.closePanel(panel, false);
      }
      this._removePanel(panel);
      try{
        panel.destroy();
      }catch(err){
        console.log(console.error('fail to destroy panel ' + panel.id + '. ' + err.stack));
      }
    },

    onDestroyPanel: function(panel){
      if(panel.state !== 'closed'){
        this.closePanel(panel, false);
      }
      this._removePanel(panel);
      console.log('destroy panel ' + panel.id);
    },
    
    destroyAllPanels: function(){
      var allPanelIds = array.map(this.panels, function(panel){
        return panel.id;
      });
      array.forEach(allPanelIds, function (panelId) {
        this.destroyPanel(panelId);
      }, this);
      this.panels = [];
    },

    reloadWidgetInPanel: function(widgetConfig){
      this.panels.forEach(function (panel) {
        panel.reloadWidget(widgetConfig);
      }, this);
    },

    _removePanel: function(panel){
      var index = this.panels.indexOf(panel);
      if(index > -1){
        this.panels.splice(index, 1);
      }
    }

  });

  clazz.getInstance = function () {
    if(instance === null) {
      instance = new clazz();
    }
    return instance;
  };

  return clazz;
});
