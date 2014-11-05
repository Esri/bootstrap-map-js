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
  'dijit/_WidgetBase',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/dom-construct',
  'dojo/dom-geometry',
  'dojo/on',
  'dojo/aspect',
  'dojo/query',
  'jimu/dijit/CheckBox',
  './PopupMenu',
  'dijit/_TemplatedMixin',
  'dojo/text!./LayerListView.html',
  'esri/dijit/Legend',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-style'
], function(_WidgetBase, declare, lang, array, domConstruct, domGeometry, on, aspect, query,
  CheckBox, PopupMenu, _TemplatedMixin, template, Legend, domAttr, domClass, domStyle) {

  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,
    _currentSelectedLayerRowNode: null,

    postCreate: function() {
      array.forEach(this.operLayerInfos.finalLayerInfos, function(layerInfo) {
        this.drawListNode(layerInfo, 0, this.layerListTable, true);
      }, this);
    },

    drawListNode: function(layerInfo, level, toTableNode) {
      if(layerInfo.newSubLayers.length === 0) {
        //addLayerNode
        layerInfo.layerNode = this.addLayerNode(layerInfo, level, toTableNode);
        //add legend node
        if(this.config.showLegend) {
          this.addLegendNode(layerInfo, level, layerInfo.layerNode.subNode);
        } else {
          domStyle.set(query(".showLegend-image", layerInfo.layerNode.currentNode)[0], 'display', 'none');
        }
        return;
      }
      //addLayerNode
      layerInfo.layerNode = this.addLayerNode(layerInfo, level, toTableNode);
      array.forEach(layerInfo.newSubLayers, lang.hitch(this ,function(level, subLayerInfo){
        this.drawListNode(subLayerInfo, level+1, layerInfo.layerNode.subNode);
      }, level));
    },

    addLayerNode: function(layerInfo, level, toTableNode) {

      var layerTrNode = domConstruct.create('tr', {
        'class': 'jimu-widget-row layer-row ' + ( /*visible*/ false ? 'jimu-widget-row-selected' : ''),
        'layerTrNodeId': layerInfo.id
      }, toTableNode), layerTdNode, ckSelectDiv, ckSelect, imageShowLegendNode, imageNoLegendDiv, imageNoLegendNode, popupMenuNode, i, imageShowLegendDiv, popupMenu, divLabel;
  
      layerTdNode = domConstruct.create('td', {
        'class': 'col col1'
      }, layerTrNode);

      for (i = 0; i < level; i++) {
        domConstruct.create('div', {
          'class': 'begin-blank-div'
        }, layerTdNode);
      }

      imageShowLegendDiv = domConstruct.create('div', {
        'class': 'showLegend-div'
      }, layerTdNode);

      imageShowLegendNode = domConstruct.create('img', {
        'class': 'showLegend-image',
        'src': this.layerListWidget.folderUrl + 'images/v_right.png',
        'alt': 'l'
      }, imageShowLegendDiv);

      ckSelectDiv = domConstruct.create('div', {
        'class': 'div-select'
      }, layerTdNode);

      ckSelect = new CheckBox({
        checked: layerInfo._obtainIsVisible()//layerInfo.visible
      });
      domConstruct.place(ckSelect.domNode, ckSelectDiv);

      imageNoLegendDiv = domConstruct.create('div', {
        'class': 'noLegend-div'
      }, layerTdNode);

      imageNoLegendNode = domConstruct.create('img', {
        'class': 'noLegend-image',
        'src': this.layerListWidget.folderUrl + 'images/noLegend.png',
        'alt': 'l'
      }, imageNoLegendDiv);

      if(layerInfo.noLegend) {
        domStyle.set(imageShowLegendDiv, 'display', 'none');
        //domStyle.set(imageShowLegendNode, 'display', 'none');
        domStyle.set(ckSelectDiv, 'display', 'none');
      } else {
        domStyle.set(imageNoLegendDiv, 'display', 'none');
      }


      // set tdNode width
      domStyle.set(layerTdNode, 'width', level*12 + 35 + 'px');

      layerTdNode = domConstruct.create('td', {
        'class': 'col col2'
      }, layerTrNode);
      divLabel = domConstruct.create('div', {
        'innerHTML': layerInfo.title.charAt(0).toUpperCase() + layerInfo.title.slice(1),
        'class': 'div-content'
      }, layerTdNode);

      //domStyle.set(divLabel, 'width', 263 - level*13 + 'px');

      layerTdNode = domConstruct.create('td', {
        'class': 'col col3'
      }, layerTrNode);

      // add popupMenu
      popupMenuNode = domConstruct.create('div', {
        'class': 'layers-list-popupMenu-div'
      }, layerTdNode);

      popupMenu = new PopupMenu({
        items: layerInfo.popupMenuInfo.menuItems,
        box: this.layerListWidget.domNode.parentNode
      }).placeAt(popupMenuNode);
      this.own(on(popupMenu, 'onMenuClick', lang.hitch(this, this._onPopupMenuItemClick, layerInfo, popupMenu)));
      
      //add a tr node to toTableNode.
      var trNode = domConstruct.create('tr', {
        'class': '',
        'layerContentTrNodeId': layerInfo.id
      }, toTableNode);

      var tdNode = domConstruct.create('td', {
        'class': '',
        'colspan': '3'
      }, trNode);

      var tableNode = domConstruct.create('table', {
        'class': 'layer-sub-node'
      }, tdNode);

      //bind event
      this.own(on(layerTrNode, 'click', lang.hitch(this, this._onRowTrClick, layerInfo, imageShowLegendNode, layerTrNode)));
      this.own(on(layerTrNode, 'mouseover', lang.hitch(this, this._onLayerNodeMouseover, layerTrNode, popupMenu)));
      this.own(on(layerTrNode, 'mouseout', lang.hitch(this, this._onLayerNodeMouseout, layerTrNode, popupMenu)));
      //this.own(on(imageShowLegendDiv, 'click', lang.hitch(this, this._onImageShowLegendClick, layerInfo, imageShowLegendNode)));
      this.own(on(ckSelect.domNode, 'click', lang.hitch(this, this._onCkSelectNodeClick, layerInfo, ckSelect)));
      
      this.own(on(popupMenuNode, 'click', lang.hitch(this, this._onPopupMenuClick, layerInfo, popupMenu, layerTrNode)));
      
      return {currentNode: layerTrNode, subNode: tableNode};
    },

    addLegendNode: function(layerInfo, level, toTableNode) {
      //var legendsDiv;
      var legendTrNode = domConstruct.create('tr', {
        'class': 'legend-node-tr'
      }, toTableNode), legendTdNode;
  
      legendTdNode = domConstruct.create('td', {
        'class': 'legend-node-td'
      }, legendTrNode);
      
/*
      array.forEach(layerInfo.legendInfos, function(legendInfo){
        var i;
        for (i = 0; i < level+1; i++) {
          domConstruct.create('div', {
            'class': 'begin-blank-div'
          }, legendTdNode);
        }
        domConstruct.place(legendInfo.legendDiv, legendTdNode);
      }, this);
*/
      //legendsDiv = layerInfo.obtainLegendsNode();
      layerInfo.legendsNode = domConstruct.create("div", {
        "class": "legends-div"
      });
      domConstruct.create("img", {
        "class": "legends-loading-img",
        "src": this.layerListWidget.folderUrl + 'images/loading.gif'
      }, layerInfo.legendsNode);
      layerInfo.initLegendsNode(layerInfo.legendsNode);
      //domStyle.set(layerInfo.legendsNode, 'background-image', 'url(' + this.layerListWidget.folderUrl + 'images/loading.gif)')
      domStyle.set(layerInfo.legendsNode, 'margin-left', (level+1)*12 + 'px');
      domConstruct.place(layerInfo.legendsNode, legendTdNode);
    },

    _fold: function(layerInfo, imageShowLegendNode) {
      if (domStyle.get(layerInfo.layerNode.subNode, 'display')  === 'none') {
        //unfold
        domStyle.set(layerInfo.layerNode.subNode, 'display', 'table');
        //domClass.add(imageShowLegendNode, "layers-list-imageShowLegend-down");
        domAttr.set(imageShowLegendNode, 'src', this.layerListWidget.folderUrl + 'images/v.png');
      } else {
        //fold
        domStyle.set(layerInfo.layerNode.subNode, 'display', 'none');
        //domClass.remove(imageShowLegendNode, "layers-list-imageShowLegend-down");
        domAttr.set(imageShowLegendNode, 'src', this.layerListWidget.folderUrl + 'images/v_right.png');
      }
    },

    _onImageShowLegendClick: function(layerInfo, imageShowLegendNode, evt) {
      this._fold(layerInfo, imageShowLegendNode);
      if(evt) {
        evt.stopPropagation();
      }
    },

    _onCkSelectNodeClick: function(layerInfo, ckSelect, evt) {
      if (ckSelect.checked) {
        layerInfo.setTopLayerVisible(true);
      } else {
        layerInfo.setTopLayerVisible(false);
      }
      evt.stopPropagation();
    },

    _onPopupMenuClick: function(layerInfo, popupMenu, layerTrNode, evt) {
      this._changeSelectedLayerRow(layerTrNode);
      if (popupMenu && popupMenu.state === 'opened') {
        popupMenu.closeDropMenu();
      } else {
        //topic.publish("popupMenuAll/hide");
        this._hideCurrentPopupMenu();
        if (popupMenu) {
          popupMenu.openDropMenu(layerInfo.getDeniedItems());
          this.currentPopupMenu = popupMenu;
        }
      }
      evt.stopPropagation();
    },

    _hideCurrentPopupMenu: function() {
      if(this.currentPopupMenu && this.currentPopupMenu.state === 'opened') {
        this.currentPopupMenu.closeDropMenu();
      }
    },

    _onLayerNodeMouseover: function(layerTrNode, popupMenu) {
      domClass.add(layerTrNode, "layer-row-mouseover");
      if (popupMenu) {
        //domClass.add(popupMenuNode, "layers-list-popupMenu-div-selected");
        domClass.add(popupMenu.btnNode, "jimu-icon-btn-selected");
      }
    },

    _onLayerNodeMouseout: function(layerTrNode, popupMenu) {
      domClass.remove(layerTrNode, "layer-row-mouseover");
      if (popupMenu) {
        //domClass.remove(popupMenuNode, "layers-list-popupMenu-div-selected");
        domClass.remove(popupMenu.btnNode, "jimu-icon-btn-selected");
      }
    },

    _onPopupMenuHide: function() {
      /*
      if (popupMenu && popupMenu.state === 'opened') {
        //popupMenu.hide();
        popupMenu.closeDropMenu();
      }
      */
      console.log("aaa");
    },

    _onLayerListWidgetPaneClick: function(popupMenu) {
      if (popupMenu) {
        //popupMenu.hide();
        popupMenu.closeDropMenu();
      }
    },

    _onRowTrClick: function(layerInfo, imageShowLegendNode, layerTrNode) {
      this._changeSelectedLayerRow(layerTrNode);
      this._onImageShowLegendClick(layerInfo, imageShowLegendNode);
      layerInfo.loadLayer();
    },

    _changeSelectedLayerRow: function(layerTrNode) {
      if (this._currentSelectedLayerRowNode && this._currentSelectedLayerRowNode === layerTrNode) {
        return;
      }
      if(this._currentSelectedLayerRowNode) {
        domClass.remove(this._currentSelectedLayerRowNode, 'jimu-widget-row-selected');
      }
      domClass.add(layerTrNode, 'jimu-widget-row-selected');
      this._currentSelectedLayerRowNode = layerTrNode;
    },

    _onPopupMenuItemClick: function(layerInfo, popupMenu, item, data) {
      var evt = {
        item: item,
        data: data,
        layerListWidget: this.layerListWidget,
        layerListView: this
      }, result;

      if (item === 'Transparency') {
        if (domStyle.get(popupMenu.transparencyDiv, 'display') === 'none') {
          popupMenu.showTransNode(layerInfo.getOpacity());
        } else {
          popupMenu.hideTransNode();
        }
      } else {
        result = layerInfo.onPopupMenuClick(evt);
        if (result.closeMenu) {
          popupMenu.closeDropMenu();
        }
      }
    },

    // befor exchange:  id1 -> id2
    // after exchanged: id2 -> id1
    _exchangeLayerTrNode: function(id1, id2) {
      var layer1TrNode = query("tr[layerTrNodeId='" + id1 + "']", this.layerListTable)[0];
      //var layer1ContentTrNode = query("tr[layerContentTrNodeId='" + id1 + "']", this.layerListTable)[0];
      var layer2TrNode = query("tr[layerTrNodeId='" + id2 + "']", this.layerListTable)[0];
      var layer2ContentTrNode = query("tr[layerContentTrNodeId='" + id2 + "']", this.layerListTable)[0];
      // change layerTr
      this.layerListTable.removeChild(layer2TrNode);
      this.layerListTable.insertBefore(layer2TrNode, layer1TrNode);
      // change LayerContentTr
      this.layerListTable.removeChild(layer2ContentTrNode);
      this.layerListTable.insertBefore(layer2ContentTrNode, layer1TrNode);
    },

    moveUpLayer: function(id) {
      // summary:
      //    move up layer in layer list.
      // description:
      //    call the moveUpLayer method of LayerInfos to change the layer order in map, and update the data in LayerInfos
      //    then, change layerNodeTr and layerContentTr domNode
      var beChangedId = this.operLayerInfos.moveUpLayer(id);
      if(beChangedId) {
        this._exchangeLayerTrNode(beChangedId, id);
      }
    },

    moveDownLayer: function(id) {
      // summary:
      //    move down layer in layer list.
      // description:
      //    call the moveDownLayer method of LayerInfos to change the layer order in map, and update the data in LayerInfos
      //    then, change layerNodeTr and layerContentTr domNode
      var beChangedId = this.operLayerInfos.moveDownLayer(id);

      if(beChangedId) {
        this._exchangeLayerTrNode(id, beChangedId);
      }
    }

  });
});
