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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/TabContainer3.html',
  'jimu/dijit/ViewStack'
],
function(declare, lang, array, html, on, Evented, query, _WidgetBase, _TemplatedMixin, template, ViewStack){
  return declare([_WidgetBase, _TemplatedMixin, Evented], {
    templateString: template,
    selected:'',
    tabs:null,
    average:false,

    'class':'jimu-tab3',

    //public methods:
    //selectTab
    //hideShelter
    //showShelter

    //event: tabChanged

    postCreate: function(){
      this.inherited(arguments);
      this._initSelf();
      if(this.selected){
        this.selectTab(this.selected);
      }else if(this.tabs.length > 0){
        this.selectTab(this.tabs[0].title);
      }
    },

    selectTab: function(title){
      var tds = query('td',this.tabTr);
      array.forEach(tds,lang.hitch(this,function(td){
        html.removeClass(td,'selected');
        if(td.label === title){
          html.addClass(td,'selected');
          td.style.borderLeft = '1px solid #ccc';
          td.style.borderRight = '1px solid #ccc';
          td.style.borderTop = '2px solid #15a4fa';
          td.style.borderBottom = '0';
        }
        else{
          td.style.borderLeft = '0';
          td.style.borderRight = '0';
          td.style.borderTop = '0';
          td.style.borderBottom = '1px solid #ccc';
        }
      }));
      this.controlNode.removeChild(this.controlTable);
      html.place(this.controlTable,this.controlNode);
      this.viewStack.switchView(title);
      this.emit('tabChanged', title);
    },

    showShelter: function(){
      html.setStyle(this.shelter,'display','block');
    },

    hideShelter: function(){
      html.setStyle(this.shelter,'display','none');
    },

    _initSelf:function(){
      this.viewStack = new ViewStack(null, this.containerNode);
      array.forEach(this.tabs, function(tabConfig){
        this._createTab(tabConfig);
      }, this);
      if(this.average){
        this.controlTable.style.tableLayout = 'fixed';
      }
      else{
        var strTabItemTd = '<td nowrap class="tab-item-td" style="border-bottom:1px solid #ccc;"><div class="tab-item-div"></div></td>';
        var tabItemTd = html.toDom(strTabItemTd);
        html.place(tabItemTd,this.tabTr);
      }
    },

    startup: function() {
      this.inherited(arguments);
      this._started = true;
    },

    _createTab:function(tabConfig){
      var strTabItemTd = '<td nowrap class="tab-item-td"><div class="tab-item-div"></div></td>';
      var tabItemTd = html.toDom(strTabItemTd);
      tabItemTd.label = tabConfig.title||'';
      html.place(tabItemTd,this.tabTr);
      var tabItemDiv = query('.tab-item-div',tabItemTd)[0];
      tabItemDiv.innerHTML = tabItemTd.label;
      tabItemDiv.label = tabItemTd.label;
      tabConfig.content.label = tabItemTd.label;
      this.viewStack.addView(tabConfig.content);
      this.own(on(tabItemTd,'click',lang.hitch(this,this._onSelect,tabConfig.title)));
    },

    _onSelect: function(title){
      this.selectTab(title);
    }

  });
});