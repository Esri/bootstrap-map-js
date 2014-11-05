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
  'dojo/Evented',
  'dojo/query',
  'dojo/NodeList-manipulate',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  './ViewStack',
  '../utils'
],
function(declare, lang, array, html, on, Evented, query, nlm, _WidgetBase, _TemplatedMixin, ViewStack, utils){
  return declare([_WidgetBase, _TemplatedMixin, Evented], {
    // summary:
    //    a tab dijit
    // description:
    //    constructor options:
    /*======
      {
        tabs: [{
          title: String
          content: DomNode|dijit
        }],
        selected: String
        // summary:
        //    the default selected tab title
      }
    =====*/

    'class': 'jimu-tab',

    templateString: '<div>' +
      '<div class="control" data-dojo-attach-point="controlNode"></div>' +
      '<div class="jimu-container" data-dojo-attach-point="containerNode"></div>' +
      '</div>',

    postCreate: function(){
      this.inherited(arguments);
      if(this.tabs.length === 0){
        return;
      }
      this.controlNodes = [];
      this.viewStack = new ViewStack(null, this.containerNode);
      var width = 1/this.tabs.length * 100;
      if(this.isNested){
        html.addClass(this.domNode, 'nested');
      }
      array.forEach(this.tabs, function(tabConfig){
        this._createTab(tabConfig, width);
      }, this);
    },

    startup: function() {
      // this.inherited(arguments);
      if(this.selected){
        this.selectTab(this.selected);
      }else if(this.tabs.length > 0){
        this.selectTab(this.tabs[0].title);
      }
      utils.setVerticalCenter(this.domNode);
    },

    _createTab: function(tabConfig, width){
      var ctrlNode;
      ctrlNode = html.create('div', {
        innerHTML: tabConfig.title,
        'class': 'tab jimu-vcenter-text',
        style: {
          width: this.isNested? 'auto': width + '%'
        },
        label: tabConfig.title
      }, this.controlNode);
      if(tabConfig.content.domNode){
        this.viewStack.viewType = 'dijit';
      }else{
        this.viewStack.viewType = 'dom';
      }
      tabConfig.content.label = tabConfig.title;
      this.viewStack.addView(tabConfig.content);
      this.own(on(ctrlNode, 'click', lang.hitch(this, this.onSelect, tabConfig.title)));
      ctrlNode.label = tabConfig.title;
      this.controlNodes.push(ctrlNode);
    },

    onSelect: function(title){
      this.selectTab(title);
    },

    selectTab: function(title){
      this._selectControl(title);
      this.viewStack.switchView(title);
      this.emit('tabChanged', title);
    },

    _selectControl: function(title){
      array.forEach(this.controlNodes, function(ctrlNode) {
        html.removeClass(ctrlNode, 'jimu-state-selected');
        if(ctrlNode.label === title){
          html.addClass(ctrlNode, 'jimu-state-selected');
        }
      });
    }

  });
});