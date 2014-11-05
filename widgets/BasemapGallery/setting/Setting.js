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
//
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/_base/html",
    'dojo/on',
    'dojo/keys',
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/query",
    'jimu/dijit/Message',
    'jimu/dijit/Popup',
    'jimu/dijit/CheckBox',
    './Edit',
    'esri/request',
    'jimu/portalUtils'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    lang,
    array,
    html,
    on,
    keys,
    domStyle,
    domAttr,
    query,
    Message,
    Popup,
    CheckBox,
    Edit,
    esriRequest,
    portalUtils) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-basemapgallery-setting',
      baseMaps: [],
      displayContent: [],
      edit: null,
      editTr: null,
      popup: null,
      popupState: "", // ADD or EDIT
      editIndex: null,
      spatialRef: null,

      startup: function() {
        this.inherited(arguments);
        if (!this.config.basemapGallery) {
          this.config.basemapGallery = {};
        }
        this.setConfig(this.config);
      },

      setConfig: function(config) {
        this.config = config;
        this.clearBaseMapsDiv();
        this.displayContent = [];
        this.baseMaps.length = 0;
        // this.showArcGISBasemaps.set('checked', config.basemapGallery.showArcGISBasemaps);
        this.showArcGISBasemaps.setValue(config.basemapGallery.showArcGISBasemaps);

        //get spatial reference from portal
        //this.spatialRef = 102100;
        this.getSRIDByPortal(this.appConfig.portalUrl);

        if(config.basemapGallery.basemaps){
          var len = config.basemapGallery.basemaps.length;
          var configuration = config.basemapGallery.basemaps;
          for (var i = 0; i < len; i++){
            this.baseMaps.push({
              title: configuration[i].title,
              thumbnailUrl: configuration[i].thumbnailUrl,
              layers: configuration[i].layers
            });
            this.displayContent.push({
              title: configuration[i].title,
              thumbnailUrl: configuration[i].thumbnailUrl
            });
          }
          this.refreshMapGallary();
        }
      },

      getSRIDByPortal: function(portalUrl){
        var def = portalUtils.getPortalSelfInfo(portalUrl);
        def.then(lang.hitch(this, function(response) {
          // this.basemapGalleryGroup = response.basemapGalleryGroupQuery;
          this.spatialRef = response.defaultBasemap.baseMapLayers[0].resourceInfo.spatialReference.wkid;
        }), lang.hitch(this, function(err) {
          new Message({
            message: this.nls.portalConnectionError
          });
          console.error(err);
        })).always(lang.hitch(this, function () {
        }));
      },

      getBaseMapByTitle: function(title) {
        var len = this.baseMaps.length;
        for (var i = 0; i < len; i++) {
          if (this.baseMaps[i].title === title) {
            this.editIndex = i;
            return this.baseMaps[i];
          }
        }
      },
     
      getConfig: function() {
        // this.config.basemapGallery.showArcGISBasemaps = this.showArcGISBasemaps.checked;
        this.config.basemapGallery.showArcGISBasemaps = this.showArcGISBasemaps.getValue();
        this.config.basemapGallery.basemaps = this.baseMaps;
        return this.config;
      },

      onAddBaseMapClick: function(){
        this.popupState = "ADD";
        this._openEdit(this.nls.addlayer, {});
      },

      _onEditClick: function(title){
        this.getBaseMapByTitle(title);
        var basemap = this.baseMaps[this.editIndex];
        this.popupState = "EDIT";
        this._openEdit(this.nls.edit, basemap);
      },

      _openEdit: function(title, basemap){
        this.edit = new Edit({
          nls: this.nls,
          folderUrl: this.folderUrl,
          baseMapSRID: this.spatialRef
        });
        this.edit.setConfig(basemap || {});
        this.popup = new Popup({
          titleLabel: title,
          autoHeight: true,
          content: this.edit,
          container: 'main-page',
          width: 840,
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
        var baseMap = this.edit.getConfig();
        var editResult = null;

        if (!baseMap.title || !baseMap.layers) {
          new Message({
            message: this.nls.warning
          });
          return;
        }
        var json = {
          title: baseMap.title,
          thumbnailUrl: baseMap.thumbnailUrl
        };
        if (this.popupState === "ADD"){
          this.baseMaps.push(baseMap);
          this.displayContent.push(json);
          editResult = this.refreshMapGallary(this.displayContent);
        }else if (this.popupState === "EDIT"){
          this.baseMaps.splice(this.editIndex,1,baseMap);
          this.displayContent.splice(this.editIndex,1,json);
          editResult = this.refreshMapGallary(this.displayContent);
        }
        
        if (editResult){
          this.popup.close();
          this.popupState = "";
          this.editIndex = null;
        }else{
          var repeatTitles = array.map(editResult.repeatFields, lang.hitch(this, function(field) {
            return field && field.title;
          }));
          new Message({
            message: this.nls[editResult.errorCode] + repeatTitles.toString()
          });
        }
      },

      _onEditClose: function() {
        this.edit = null;
        this.popup = null;
      },

      refreshMapGallary:function(){
        this.clearBaseMapsDiv();
        this._createMapItems();
        return true;
      },

      _createMapItems: function() {
        for(var i = 0;i < this.displayContent.length; i++){
          var mapItem = this._createMapItem(this.displayContent[i]);
          html.place(mapItem,this.baseMapsDiv);
        }
      },

      _createMapItem: function(webMap) {
        var str = "<div class='map-item-div'>" + "<div class='map-item-bg'>" + "<div class='map-item-thumbnail'></div>"+ "<div class='map-item-delete-icon'></div>" + "<div class='map-item-detail-icon'></div>" + "<span class='map-item-title'></span>" + "</div>";
        var mapItem = html.toDom(str);
        var mapItemBg = query('.map-item-bg', mapItem)[0];
        var mapItemThumbnail = query('.map-item-thumbnail', mapItem)[0];
        var mapItemTitle = query('.map-item-title', mapItem)[0];
        var mapItemDeleteIcon = query('.map-item-delete-icon',mapItem)[0];
        this.own(on(mapItemDeleteIcon, 'click', lang.hitch(this, this._onMapItemDeleteClick)));
        var mapItemEditIcon = query('.map-item-detail-icon',mapItem)[0];
        this.own(on(mapItemEditIcon, 'click', lang.hitch(this, this._onMapItemEditClick)));
        mapItem.item = webMap;
        if (webMap.thumbnailUrl) {
          html.setStyle(mapItemThumbnail, 'backgroundImage', "url(" + webMap.thumbnailUrl + ")");
        } else {
          mapItemThumbnail.innerHTML = this.nls.noneThumbnail;
        }
        this.own(on(mapItemBg, 'click', lang.hitch(this, this._onMapItemBgClick)));
        mapItemTitle.innerHTML = webMap.title;
        return mapItem;
      },

      clearBaseMapsDiv:function(){
        var mapItemDoms = query('.map-item-div', this.domNode);
        for (var i = 0; i< mapItemDoms.length;i++){
          html.destroy(mapItemDoms[i]);
        }
      },

      _onMapItemBgClick:function(event){
        var target = event.target || event.srcElement;
        var mapItemBg = target.parentNode;
        var mapItemBgs = query('.map-item-bg', this.domNode);
        mapItemBgs.removeClass('selected');
        html.addClass(mapItemBg, 'selected');
      },

      _onMapItemEditClick:function(event){
        var target = event.target || event.srcElement;
        var mapItem = target.parentNode;
        var titleDom = query('.map-item-title', mapItem)[0];
        this._onEditClick(titleDom.innerHTML);
      },

      _onMapItemDeleteClick:function(event){
        var target = event.target || event.srcElement;
        var mapItem = target.parentNode;
        var titleDom = query('.map-item-title', mapItem)[0];
        this.getBaseMapByTitle(titleDom.innerHTML);
        if (this.editIndex !== null){
          this.baseMaps.splice(this.editIndex,1);
          this.displayContent.splice(this.editIndex,1);
        }
        this.refreshMapGallary(this.displayContent);
      }
    });
  });