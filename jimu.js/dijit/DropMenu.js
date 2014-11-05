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
  'dijit/_WidgetBase',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  'dojo/Evented',
  '../utils'
],
function(declare, _WidgetBase, lang, array, html, on, Evented, utils) {
  return declare([_WidgetBase, Evented], {
    // summary: 
    //    the params format:
    //    items: String[]
    //    box: String|DomNode. 
    //      if not set, use the menu's parent node to calculate the menu's position.
    'class': 'jimu-dropmenu',

    constructor: function(){
      this.state = 'closed';
    },
    postCreate: function(){
      this.btnNode = html.create('div', {
        'class': 'jimu-icon-btn'
      }, this.domNode);

      this.own(on(this.btnNode, 'click', lang.hitch(this, this._onBtnClick)));
      if(!this.box){
        this.box = this.domNode.parentNode;
      }
      this.own(on(this.box, 'click', lang.hitch(this, function(){
        if(this.dropMenuNode){
          this.closeDropMenu();
        }
      })));
    },

    _onBtnClick: function(evt){
      evt.stopPropagation();
      if(!this.dropMenuNode){
        this._createDropMenuNode();
      }
      if(this.state === 'closed'){
        this.openDropMenu();
      }else{
        this.closeDropMenu();
      }
    },

    _createDropMenuNode: function(){
      this.dropMenuNode = html.create('div', {
        'class': 'drop-menu',
        style: {
          display: 'none'
        }
      }, this.domNode);

      if(!this.items){
        this.items = [];
      }

      array.forEach(this.items, function(item){
        var node;
        if(item){
          node = html.create('div', {
            'class': 'menu-item',
            innerHTML: item
          }, this.dropMenuNode);

          this.own(on(node, 'click', lang.hitch(this, function(){
            this.selectItem(item);
          })));
        }else{
          html.create('hr', {
            'class': 'menu-item-line'
          }, this.dropMenuNode);
        }
      }, this);
    },

    _getDropMenuPosition: function(){
      var outBox = html.getContentBox(this.box);
      var thisBox = html.getMarginBox(this.domNode);
      var btnBox = html.getMarginBox(this.btnNode);
      var menuBox = html.getMarginBox(this.dropMenuNode);
      var pos = {}, max, l, t, b, r;
      //display at the bottom by default, if the space is not enough,
      //get the maximum space of the left/top/bottom/right
      pos.l = thisBox.l;
      pos.t = thisBox.t + btnBox.h;
      if(pos.t + menuBox.h > outBox.h){
        t = thisBox.t;
        b = outBox.h - thisBox.t - btnBox.h;
        max = Math.max(t, b);
        if(max === t){
          //put on top of the btn
          pos.t =  0 - menuBox.h;
        }
      }
      if(pos.l + menuBox.w > outBox.w){
        l = thisBox.l;
        r = outBox.w - thisBox.l - btnBox.w;
        max = Math.max(l, r);
        if(max === l){
          pos.l = '';
          pos.r = 0;
        }
      }
      pos.left = pos.l;
      pos.top = pos.t;
      pos.right = pos.r;
      return pos;
    },

    selectItem: function(item){
      this.closeDropMenu();
      this.emit('onMenuClick', item);
    },

    openDropMenu: function(){
      this.state = 'opened';
      html.setStyle(this.dropMenuNode, 'display', '');

      html.setStyle(this.dropMenuNode, utils.getPositionStyle(this._getDropMenuPosition()));

      this.emit('onOpenMenu');
    },

    closeDropMenu: function(){
      this.state = 'closed';
      html.setStyle(this.dropMenuNode, 'display', 'none');
      this.emit('onCloseMenu');
    }

  });
});