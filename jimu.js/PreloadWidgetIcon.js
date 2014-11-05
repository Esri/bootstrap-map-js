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
  'dojo/on',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/dom-geometry',
  'dijit/_WidgetBase',
  './utils'
],
function(declare, lang, html, on, domConstruct, domStyle, domGeometry, _WidgetBase, utils) {
  /* global jimuConfig */
  return declare(_WidgetBase, {
    'class': 'jimu-preload-widget-icon',

    postCreate: function(){
      this.inherited(arguments);
      this.iconNode = html.create('img', {
        src: this.widgetConfig.icon
      }, this.domNode);
      html.setAttr(this.domNode, 'title', this.widgetConfig.label);
      this.own(on(this.domNode, 'click', lang.hitch(this, function(){
        this.onClick();
      })));
      this.state = 'closed';
    },

    startup: function(){
      this.inherited(arguments);
      //by default, preload widgets that are in panel will be "closed" state
      //so, if user set the state, let's switch to it.(open panel here, and panel manager will change to the correct state)
      // if(this.widgetConfig.defaultState && ['normal', 'maximized', 'minimized'].indexOf(this.widgetConfig.defaultState) > -1){
      //   this.onClick();
      // }
    },

    onClick: function(){
      if(this.state === 'closed'){
        this.switchToOpen();
      }else{
        this.switchToClose();
      }
    },

    moveTo: function(position){
      var style = {
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        top: 'auto',
        width: 'auto',
        height: 'auto'
      };
      style = lang.mixin(style, utils.getPositionStyle(position));
      //we don't change width and height through layout
      delete style.width;
      delete style.height;
      html.setStyle(this.domNode, style);
      if(this.state === 'opened' && this.panel){
        html.setStyle(this.panel.domNode, this.getIconPanelPosition());
      }
    },

    destroy: function(){
      if(this.panel){
        this.panelManager.destroyPanel(this.panel);
      }
      this.inherited(arguments);
    },

    switchToOpen: function(){
      this.state = 'opened';
      html.addClass(this.domNode, 'jimu-state-selected');
      this.widgetConfig.panel.widgetIcon = this.domNode;
      this.widgetConfig.panel.position = this.getIconPanelPosition();
      this.panelManager.showPanel(this.widgetConfig).then(lang.hitch(this, function(panel){
        this.panel = panel;
        this.own(on(panel, 'close', lang.hitch(this, function(){
          this.switchToClose();
        })));
      }));
    },

    switchToClose: function(){
      this.state = 'closed';
      html.removeClass(this.domNode, 'jimu-state-selected');
      this.panelManager.closePanel(this.panel);
    },

    getIconPanelPosition: function(){
      // summary:
      //    get panel position

      var pos = {}, pid, pbox, iconBox, margin = 2;

      if(this.widgetConfig.panel.positionRelativeTo === 'map'){
        pid = jimuConfig.mapId;
      }else{
        pid = jimuConfig.layoutId;
      }

      iconBox = html.getMarginBox(this.domNode);

      pos.width = this.widgetConfig.panel.position.width? this.widgetConfig.panel.position.width: 400;
      pos.height = this.widgetConfig.panel.position.height? this.widgetConfig.panel.position.height: 400;

      pbox = html.getContentBox(pid);

      var t, b, max;
      //under the icon by default
      pos.top = iconBox.t + iconBox.h + margin;
      if(pos.top + pos.height > pbox.h){
        t = iconBox.t;
        b = pbox.h - iconBox.t - iconBox.h;
        max = Math.max(t, b);
        if(max === t){
          //above the icon
          pos.top = iconBox.t - pos.height - margin;
        }
      }

      //left align width the icon
      pos.left = iconBox.l;
      if(pos.left + pos.width > pbox.w){
        //right align
        pos.left = '';
        pos.right = 0;
      }
      
      return pos;
    }
  });
});