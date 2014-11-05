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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'jimu/BaseWidget',
  'dojo/on',
  'dojo/aspect',
  'dojo/string',
  'esri/SpatialReference',
  './ImageNode',
  'jimu/dijit/TileLayoutContainer'
],
function(declare, lang, array, html, BaseWidget, on, aspect, string,
  SpatialReference, ImageNode, TileLayoutContainer) {
  /* global store */
  return declare([BaseWidget], {
    //these two properties is defined in the BaseWidget
    baseClass: 'jimu-widget-bookmark',
    name: 'Bookmark',

    //bookmarks: Object[]
    //    all of the bookmarks, the format is the same as the config.json
    bookmarks: [],

    //currentIndex: int
    //    the current selected bookmark index
    currentIndex: -1,

    //use this flag to control delete button
    _canDelete: false,

    //use this flag to control play button
    //play function work only in 3D map
    _canPlay: false,

    //the status can be: stop, playing, none
    _playStatus: 'none',

    startup: function(){
      // summary:
      //    this function will be called when widget is started.
      // description:
      //    see dojo's dijit life cycle.
      this.inherited(arguments);

      this.bookmarkList = new TileLayoutContainer({
        strategy: 'fixCols',
        itemSize: {height: ((110/130)*100) + '%'},
        maxCols: 2
      }, this.bookmarkListNode);

      if(this.appConfig.map['3D']){
        html.setStyle(this.btnPlay, 'display', '');
        aspect.after(this.map, 'onCameraChangeEnd', lang.hitch(this, this._onFlytoEnd), true);
        aspect.after(this.map, 'onCameraChangeBreak', lang.hitch(this, this._onFlytoBreak), true);
      }else{
        html.setStyle(this.btnPlay, 'display', 'none');
      }
      this.bookmarkList.startup();

      this.own(on(this.bookmarkName, 'keydown', lang.hitch(this, function(evt){
        var keyNum = evt.keyCode !== undefined ? evt.keyCode : evt.which;
        if (keyNum === 13) {
          this._onAddBtnClicked();
        }
      })));
    },

    onOpen: function(){
      // summary:
      //    see description in the BaseWidget
      // description:
      //    this function will check local cache first. If there is local cache,
      //    use the local cache, or use the bookmarks configured in the config.json
      var localBks = this._getLocalCache();
      if(localBks.length > 0){
        this.bookmarks = localBks;
      }else{
        if(this.appConfig.map['3D']){
          this.bookmarks = lang.clone(this.config.bookmarks3D);
        }else{
          this.bookmarks = lang.clone(this.config.bookmarks2D);
        }
      }
      
      this._readBookmarksInWebmap();
      this.displayBookmarks();
    },

    onClose: function(){
      // summary:
      //    see description in the BaseWidget
      this.bookmarks = [];
      this.currentIndex = -1;
    },

    onMinimize: function(){
      this.resize();
    },

    onMaximize: function(){
      this.resize();
    },

    resize: function(){
      if(this.bookmarkList){
        this.bookmarkList.resize();
      }
    },

    destroy: function(){
      this.bookmarkList.destroy();
      this.inherited(arguments);
    },

    displayBookmarks: function() {
      // summary:
      //    remove all and then add
      var items = [];
      this.bookmarkList.empty();
      array.forEach(this.bookmarks, function(bookmark) {
        items.push(this._createBookMarkNode(bookmark));
      }, this);

      this.bookmarkList.addItems(items);
      this._switchDeleteBtn();
      this._switchPlayBtn();
      this.resize();
    },

    _readBookmarksInWebmap: function(){
      if(!this.map.itemInfo || !this.map.itemInfo.itemData || !this.map.itemInfo.itemData.bookmarks){
        return;
      }
      array.forEach(this.map.itemInfo.itemData.bookmarks, function(bookmark){
        bookmark.isInWebmap = true;
        bookmark.name = bookmark.name;
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
    },

    _switchDeleteBtn: function(){
      if(this.currentIndex > -1 && !this.bookmarks[this.currentIndex].isInWebmap){
        html.removeClass(this.btnDelete, 'jimu-state-disabled');
        this._canDelete = true;
      }else{
        html.addClass(this.btnDelete, 'jimu-state-disabled');
        this._canDelete = false;
      }
    },

    _switchPlayBtn: function(){
      if(this.bookmarks.length > 1){
        html.removeClass(this.btnPlay, 'jimu-state-disabled');
        this._canPlay = true;
      }else{
        html.addClass(this.btnPlay, 'jimu-state-disabled');
        this._canPlay = false;
      }
    },

    _switchPlayStatus: function(status){
      this._playStatus = status;
      if(this._playStatus === 'none' || this._playStatus === 'stop'){
        this.btnPlay.innerHTML = this.nls.labelPlay;
      }else{
        this.btnPlay.innerHTML = this.nls.labelStop;
      }
    },

    _createBookMarkNode: function(bookmark) {
      var thumbnail, node;

      if(bookmark.thumbnail && bookmark.thumbnail.startWith('data:')){
        thumbnail = bookmark.thumbnail;
      }else if(bookmark.thumbnail){
        thumbnail = this.folderUrl + bookmark.thumbnail;
      }else{
        thumbnail = this.folderUrl + 'images/thumbnail_default.png';
      }

      node = new ImageNode({
        img: thumbnail,
        label: bookmark.name
      });
      on(node.domNode, 'click', lang.hitch(this, lang.partial(this._onBookmarkClick, bookmark)));

      return node;
    },

    _getKeysKey: function(){
      // summary:
      //    we use className plus 2D/3D as the local storage key
      if(this.appConfig.map['3D']){
        return this.name + '.3D';
      }else{
        return this.name + '.2D';
      }
    },

    _saveAllToLocalCache: function() {
      // summary:
      //    if user add/delete a bookmark, we will save all of the bookmarks into the local storage.

      var keys = [];
      //clear
      array.forEach(store.get(this._getKeysKey()), function(bName){
        store.remove(bName);
      }, this);

      array.forEach(this.bookmarks, function(bookmark){
        if(bookmark.isInWebmap){
          return;
        }
        var key = this._getKeysKey() + '.' + bookmark.name;
        keys.push(key);
        store.set(key, bookmark);
      }, this);
      
      store.set(this._getKeysKey(), keys);
    },

    _getLocalCache: function() {
      var ret = [];
      if(!store.get(this._getKeysKey())){
        return ret;
      }
      array.forEach(store.get(this._getKeysKey()), function(bName){
        if(bName.startWith(this._getKeysKey())){
          ret.push(store.get(bName));
        }
      }, this);
      return ret;
    },

    _onFlytoEnd: function(/*jshint unused:false*/ camera){
      // summary:
      //    3D only.
      if(this._playStatus === 'stop' || this._playStatus === 'none'){
        return;
      }
      if(this.currentIndex + 1 === this.bookmarkList.items.length){
        this._switchPlayStatus('stop');
        return;
      }
      this.currentIndex ++;
      this.bookmarkList.items[this.currentIndex].highLight();
      setTimeout(lang.hitch(this, this._setCamera, this.bookmarks[this.currentIndex]), this.config.stopTime);
    },

    _onFlytoBreak: function(){
      // summary:
      //    3D only.
      if(this._playStatus === 'playing'){
        this._switchPlayStatus('stop');
      }
    },

    _onAddBtnClicked: function() {
      if (string.trim(this.bookmarkName.value).length === 0) {
        html.setStyle(this.errorNode, {visibility: 'visible'});
        this.errorNode.innerHTML = this.nls.errorNameNull;
        return;
      }
      if(array.some(this.bookmarks, function(b){
        if(b.name === this.bookmarkName.value){
          return true;
        }
      }, this)){
        html.setStyle(this.errorNode, {visibility: 'visible'});
        this.errorNode.innerHTML = this.nls.errorNameExist;
        return;
      }
      
      this._createBookmark();

      html.setStyle(this.errorNode, {visibility: 'hidden'});
      this.errorNode.innerHTML = '&nbsp;';
      this.bookmarkName.value = '';

      this.displayBookmarks();
    },

    _onPlayBtnClicked: function(){
      if(!this._canPlay){
        return;
      }
      if(this._playStatus === 'playing'){
        this._switchPlayStatus('stop');
      }else{
        this._switchPlayStatus('playing');
        this.currentIndex = 0;
        this._switchDeleteBtn();
        this.bookmarkList.items[this.currentIndex].highLight();
        this._setCamera(this.bookmarks[this.currentIndex]);
      }
    },

    _createBookmark: function(){
      var data, b;
      if(this.appConfig.map['3D']){
        data = this.map.getCamera(new SpatialReference(4326));
        b = {
          name: this.bookmarkName.value,
          camera: [data.x, data.y, data.z, data.heading, data.tilt]
        };
      }else{
        b = {
          name: this.bookmarkName.value,
          extent: this.map.extent.toJson()
        };
      }
      
      this.bookmarks.push(b);
      this._createBookMarkNode(b);
      this._saveAllToLocalCache();
      this.resize();
    },

    _onDeleteBtnClicked: function(){

      if(!this._canDelete ||this.currentIndex === -1){
        return;
      }

      array.some(this.bookmarks, function(b, i){
        if(i === this.currentIndex){
          this.bookmarks.splice(i, 1);
          return true;
        }
      }, this);

      this._saveAllToLocalCache();

      this.resize();

      this.currentIndex = -1;
      this.displayBookmarks();
    },

    _onBookmarkClick: function(bookmark) {
      // summary:
      //    set the map extent or camera, depends on it's 2D/3D map
      array.some(this.bookmarks, function(b, i){
        if(b.name === bookmark.name){
          this.currentIndex = i;
          return true;
        }
      }, this);

      this._switchDeleteBtn();

      //require the module on demand
      if(this.appConfig.map['3D']){
        this._setCamera(bookmark);
      }else{
        require(['esri/geometry/Extent'], lang.hitch(this, function(Extent){
          var ext = bookmark.extent, sr;
          if(ext.spatialReference){
            sr = new SpatialReference(ext.spatialReference);
          }else{
            sr = new SpatialReference({ wkid:4326});
          }
          this.map.setExtent(new Extent(ext));
        }));
      }
    },

    _setCamera: function(bookmark){
      this.map.setCamera(bookmark.camera, this.config.flyTime);
    }

  });
});