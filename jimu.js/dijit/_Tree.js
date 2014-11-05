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
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/_TreeNode.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/event',
  'dojo/query',
  'dojo/on',
  'dojo/Evented',
  'dijit/registry',
  'dijit/Tree'
],
function(declare, _WidgetBase, _TemplatedMixin, tnTemplate, lang, html, array, dojoEvent,
  query, on, Evented, registry, DojoTree) {/*jshint unused: false*/
  var JimuTreeNode = declare([DojoTree._TreeNode, Evented],{
    templateString: tnTemplate,
    declaredClass: 'jimu._TreeNode',

    //options:
    isLeaf: false,

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-tree-node');
      this.isLeaf = !!this.isLeaf;
      if(this.isLeaf){
        html.setStyle(this.cbx, 'display', 'inline');
      }
      else{
        html.setStyle(this.cbx, 'display', 'none');
      }
    },

    select: function(){
      if(this.isLeaf){
        this.cbx.checked = true;
      }
    },

    unselect: function(){
      if(this.isLeaf){
        this.cbx.checked = false;
      }
    },

    _onClick: function(evt){
      var target = evt.target||evt.srcElement;
      if(target === this.cbx){
        this.tree._onCheckBoxClick(this, this.cbx.checked, evt);
      }
      else{
        this.tree._onClick(this, evt);
      }
    },

    _onChange: function(){
      if(this.isLeaf){
        setTimeout(lang.hitch(this, function(){
          if(this.cbx.checked){
            this.emit('tn-select', this);
          }
          else{
            this.emit('tn-unselect', this);
          }
        }),100);
      }
    },

    destroy: function(){
      delete this.tree;
      this.inherited(arguments);
    }
  });

  var JimuTree = declare([DojoTree, Evented], {
    declaredClass:'jimu._Tree',

    //options:
    leafType:"",
    multiple: true,

    //public methods:
    //getSelectedItems
    //getTreeNodeByItemId
    //selectItem
    //unselectItem
    //removeItem
    //getAllLeafTreeNodeWidgets
    //getAllTreeNodeWidgets

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-tree');
    },

    removeItem: function(id){
      this.model.store.remove(id);
    },

    getSelectedItems: function(){
      var allTNs = this.getAllTreeNodeWidgets();
      var selectedTNs = array.filter(allTNs, lang.hitch(this, function(tn){
        return tn.cbx.checked;
      }));
      var items = array.map(selectedTNs, lang.hitch(this, function(tn){
        return tn.item;
      }));
      return items;
    },

    getTreeNodeByItemId: function(itemId){
      var doms = this._getAllTreeNodeDoms();
      for(var i=0;i<doms.length;i++){
        var d = doms[i];
        var tn = registry.byNode(d);
        if(tn.item.id.toString() === itemId.toString()){
          return tn;
        }
      }
      return null;
    },

    selectItem: function(itemId){
      var tn = this.getTreeNodeByItemId(itemId);
      if(tn && tn.isLeaf){
        tn.select();
      }
    },

    unselectItem: function(itemId){
      var tn = this.getTreeNodeByItemId(itemId);
      if(tn && tn.isLeaf){
        tn.unselect();
      }
    },

    getAllLeafTreeNodeWidgets: function(){
      var tns = this.getAllTreeNodeWidgets();
      return array.filter(tns, lang.hitch(this, function(tn){
        return tn.isLeaf;
      }));
    },

    getAllTreeNodeWidgets: function(){
      var doms = this._getAllTreeNodeDoms();
      return array.map(doms, lang.hitch(this, function(node){
        return registry.byNode(node);
      }));
    },

    isLeafItem: function(item){
      return item && item.type === this.leafType;
    },

    _getAllTreeNodeDoms: function(){
      return query('.dijitTreeNode', this.domNode);
    },

    _createTreeNode: function(args){
      args.isLeaf = this.isLeafItem(args.item);
      var tn = new JimuTreeNode(args);
      // this.own(on(tn, 'tn-select', lang.hitch(this, this._onTreeNodeSelect)));
      // this.own(on(tn, 'tn-unselect', lang.hitch(this, this._onTreeNodeUnselect)));
      return tn;
    },

    _onTreeNodeSelect: function(/*TreeNode*/ nodeWidget){
      var item = lang.mixin({}, nodeWidget.item);
      var args = {
        item: item,
        treeNode: nodeWidget
      };
      this.emit('item-select', args);
    },

    _onTreeNodeUnselect: function(/*TreeNode*/ nodeWidget){
      var item = lang.mixin({}, nodeWidget.item);
      var args = {
        item: item,
        treeNode: nodeWidget
      };
      this.emit('item-unselect', args);
    },

    _onCheckBoxClick: function(/*TreeNode*/ nodeWidget,/*Boolean*/ newState, /*Event*/ evt){
      if(!this.multiple && newState){
        this._uncheckAllCheckboxes();
      }
      dojoEvent.stop(evt);
      this.focusNode(nodeWidget);
      setTimeout(lang.hitch(this, function(){
        nodeWidget.cbx.checked = newState;
        this.onClick(nodeWidget.item, nodeWidget, evt);
      }), 0);
    },

    _uncheckAllCheckboxes: function(){
      var allCbxes = query('.jimu-tree-checkbox', this.domNode);
      array.forEach(allCbxes, lang.hitch(this, function(cbx){
        cbx.checked = false;
      }));
    }

  });

  return JimuTree;
});