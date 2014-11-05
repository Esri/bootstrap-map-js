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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  'dojo/keys',
  "dojo/dom-style",
  "dojo/dom-attr",
  "dojo/query",
  'dojo/mouse',
  'dojo/aspect',
  'dojo/string',
  'esri/geometry/Extent',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/Popup',
  'jimu/dijit/Message',
  './Edit'
],
function(declare, _WidgetsInTemplateMixin, lang, array, html, on, keys, domStyle, domAttr, query, mouse, aspect, string,
   Extent, BaseWidgetSetting, Popup, Message, Edit) {
  /* global store */
  //for now, this setting page suports 2D mark only
  return declare([BaseWidgetSetting,_WidgetsInTemplateMixin], {
    //these two properties is defined in the BaseWidget
    baseClass: 'jimu-widget-bookmark-setting',

    //bookmarks: Object[]
    //    all of the bookmarks, the format is the same as the config.json
    bookmarks: [],
    edit: null,
    popup: null,
    popupState: "", // ADD or EDIT
    editIndex: null,

    startup: function(){
      this.inherited(arguments);
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.config = config;
      this.bookmarks = this.config.bookmarks2D;
      //add webmap bookmarks
      if(this.map.itemInfo && this.map.itemInfo.itemData && this.map.itemInfo.itemData.bookmarks){
        array.forEach(this.map.itemInfo.itemData.bookmarks, function(bookmark){
          bookmark.isInWebmap = true;
          bookmark.name = bookmark.name;
          // if (array.indexOf(this.bookmarks, bookmark) === -1){
          //   this.bookmarks.push(bookmark);
          // }
          var repeat = 0;
          for (var i = 0; i <this.bookmarks.length; i++ ){
            if (this.bookmarks[i].name === bookmark.name){
              repeat ++;
            }
          }
          if (!repeat){
            this.bookmarks.push(bookmark);
          }
        }, this);
      }
      this.currentBookmark = null;
      this.displayBookmarks();
    },

    getConfig: function (isOk) {
      this.config.bookmarks2D = this.bookmarks;
      if(isOk){
        //clear local store
        var key = this._getKeysKey();
        for(var p in store.getAll()){
          if(p.startWith(key)){
            store.remove(p);
          }
        }
      }
      return this.config;
    },

    displayBookmarks: function() {
      // summary:
      //    remove all and then add
      this._clearBookmarksDiv();
      this._createmarkItems();
    },

    _clearBookmarksDiv:function(){
      //html.empty(this.bookmarkListNode);
      var bookmarkItemDoms = query('.mark-item-div', this.domNode);
      for (var i = 0; i< bookmarkItemDoms.length;i++){
        html.destroy(bookmarkItemDoms[i]);
      }
    },

    destroy: function(){
      this.inherited(arguments);
    },

    _getKeysKey: function(){
      // summary:
      // we use className plus 2D/3D as the local store key
      if(this.appConfig.map['3D']){
        return this.name + '.3D';
      }else{
        return this.name + '.2D';
      }
    },

    onAddBookmarkClick: function(){
        this.popupState = "ADD";
        this._openEdit(this.nls.addBookmark, {});
      },

    getBookmarkByName: function(name){
      var len = this.bookmarks.length;
      for (var i = 0; i < len; i++) {
        if (this.bookmarks[i].name === name) {
          this.editIndex = i;
          return this.bookmarks[i];
        }
      }
    },

    _onEditClick: function(name){
        this.getBookmarkByName(name);
        var bookmark = this.bookmarks[this.editIndex];
        this.popupState = "EDIT";
        this._openEdit(this.nls.edit, bookmark);
      },

    _openEdit: function(name, bookmark){
        this.edit = new Edit({
          nls: this.nls,
          folderUrl: this.folderUrl,
          portalUrl : this.appConfig.map.portalUrl,
          itemId: this.appConfig.map.itemId
        });
        this.edit.setConfig(bookmark || {});
        this.popup = new Popup({
          titleLabel: name,
          autoHeight: true,
          content: this.edit,
          container: 'main-page',
          width: 640,
          buttons: [
            {
              label: this.nls.ok,
              key:keys.ENTER,
              disable: true,
              onClick: lang.hitch(this, '_onEditOk')
            },{
              label: this.nls.cancel,
              key:keys.ESCAPE
            }
          ],
          onClose: lang.hitch(this, '_onEditClose')
        });
        html.addClass(this.popup.domNode, 'widget-setting-popup');
        this.edit.startup();
      },

    _onEditOk: function() {
        var bookmark = this.edit.getConfig();
        var editResult = null;
        if (!bookmark.name || !bookmark.extent) {
          new Message({
            message: this.nls.warning
          });
          return;
        }
        if (this.popupState === "ADD"){
          this.bookmarks.push(bookmark);
          this.displayBookmarks();
          editResult = true;
        }else if (this.popupState === "EDIT"){
          this.bookmarks.splice(this.editIndex,1,bookmark);
          this.displayBookmarks();
          editResult = true;
        }
        
        if (editResult){
          this.popup.close();
          this.popupState = "";
          this.editIndex = null;
          editResult = false;
        }else{
          var repeatnames = array.mark(editResult.repeatFields, lang.hitch(this, function(field) {
            return field && field.name;
          }));
          new Message({
            message: this.nls[editResult.errorCode] + repeatnames.toString()
          });
        }
      },

    _onEditClose: function() {
      this.edit = null;
      this.popup = null;
    },

    _createmarkItems: function() {
      for(var i = 0;i < this.bookmarks.length; i++){
        var markItem = this._createmarkItem(this.bookmarks[i]);
        html.place(markItem,this.bookmarksDiv);
      }
    },

    _createmarkItem: function(bookmark) {
      var str = "<div class='mark-item-div'>" + "<div class='mark-item-bg'>" + "<div class='mark-item-thumbnail'></div>"+ "<div class='mark-item-delete-icon'></div>" + "<div class='mark-item-detail-icon'></div>" + "<span class='mark-item-title'></span>" + "</div>";
      var markItem = html.toDom(str);
      var markItemBg = query('.mark-item-bg', markItem)[0];
      var markItemThumbnail = query('.mark-item-thumbnail', markItem)[0];
      var markItemTitle = query('.mark-item-title', markItem)[0];
      var markItemDeleteIcon = query('.mark-item-delete-icon',markItem)[0];
      this.own(on(markItemDeleteIcon, 'click', lang.hitch(this, this._onmarkItemDeleteClick)));
      var markItemEditIcon = query('.mark-item-detail-icon',markItem)[0];
      this.own(on(markItemEditIcon, 'click', lang.hitch(this, this._onmarkItemEditClick)));
      markItem.item = bookmark;
      var thumbnail;
      if(bookmark.thumbnail && bookmark.thumbnail.startWith('data:')){
        thumbnail = bookmark.thumbnail;
      }else if(bookmark.thumbnail){
        thumbnail = this.folderUrl + bookmark.thumbnail;
      }else{
        thumbnail = this.folderUrl + 'images/thumbnail_default.png';
      }
      html.setStyle(markItemThumbnail, 'backgroundImage', "url(" + thumbnail + ")");
      this.own(on(markItemBg, 'click', lang.hitch(this, this._onmarkItemBgClick)));
      markItemTitle.innerHTML = bookmark.name;
      return markItem;
    },

    _clearBasemarksDiv:function(){
      var markItemDoms = query('.mark-item-div', this.domNode);
      for (var i = 0; i< markItemDoms.length;i++){
        html.destroy(markItemDoms[i]);
      }
    },

    _onmarkItemBgClick:function(event){
      var target = event.target || event.srcElement;
      var markItemBg = target.parentNode;
      var markItemBgs = query('.mark-item-bg', this.domNode);
      markItemBgs.removeClass('selected');
      html.addClass(markItemBg, 'selected');
    },

    _onmarkItemEditClick:function(event){
      var target = event.target || event.srcElement;
      var markItem = target.parentNode;
      var titleDom = query('.mark-item-title', markItem)[0];
      this._onEditClick(titleDom.innerHTML);
    },

    _onmarkItemDeleteClick:function(event){
      var target = event.target || event.srcElement;
      var markItem = target.parentNode;
      var titleDom = query('.mark-item-title', markItem)[0];
      this.getBookmarkByName(titleDom.innerHTML);
      if (this.editIndex !== null){
        this.bookmarks.splice(this.editIndex,1);
      }
      this.displayBookmarks();
    }

  });
});