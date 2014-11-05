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
    'dojo/on',
    "dojo/dom-construct",
    "dojo/dom-attr",
    'dojo/dom',
    'dojo/dom-class',
    'dojo/Evented'
  ],
  function(declare,
    _WidgetBase,
    lang,
    on,
    domConstruct,
    domAttr,
    dom,
    domClass,
    Evented) {
    return declare([_WidgetBase, Evented], {

      'class': 'jimu-list',
      _itemCSS: "jimu-list-item",
      _itemSelectedCSS: "jimu-list-item selected",

      startup: function() {
        this.items = [];
        this.selectedIndex = -1;
        this._selectedNode = null;
        this._listContainer = domConstruct.create("div");
        domClass.add(this._listContainer, "jimu-list-container");
        this.own(on(this._listContainer, "click", lang.hitch(this, this._onClick)));
        domConstruct.place(this._listContainer, this.domNode);
      },

      add: function(item) {
        if (arguments.length === 0) {
          return;
        }
        this.items.push(item);
        var div = domConstruct.create("div");
        domAttr.set(div, "id", this.id.toLowerCase()+item.id);
        domAttr.set(div, "title", item.label);
        domClass.add(div, this._itemCSS);
        var label = domConstruct.create("label");
        domClass.add(label, "label");
        label.textContent = item.label;
        domConstruct.place(label, div);
        domConstruct.place(div, this._listContainer);
      },

      remove: function(index) {
        var item = this.items[index];
        this.items.splice(index, 1);
        domConstruct.destroy(item.id + "");
        if (this.items.length === 0) {
          this._init();
        }
      },

      _init: function() {
        this.selectedIndex = -1;
        this._selectedNode = null;
      },

      clear: function() {
        this.items.length = 0;
        this._listContainer.innerHTML = "";
        this._init();
      },

      _onClick: function(evt) {
        if (evt.target.id === "" && evt.target.parentNode.id === "") {
          return;
        }
        var id = evt.target.id.toLowerCase();
        if (!id) {
          id = evt.target.parentNode.id;
        }
        var item = this._getItemById(id);
        if (!item) {
          return;
        }

        domClass.add(id, this._itemSelectedCSS);
        if (this._selectedNode) {
          domClass.replace(this._selectedNode, this._itemCSS, this._itemSelectedCSS);
        }
        this._selectedNode = id;
        this.emit('click', this.selectedIndex, item);
      },

      _getItemById: function(id) {
        id = id.replace(this.id.toLowerCase(),"");
        var len = this.items.length;
        var item;
        for (var i = 0; i < len; i++) {
          item = this.items[i];
          if (item.id === id) {
            this.selectedIndex = i;
            return item;
          }
        }
        return null;
      }

    });
  });