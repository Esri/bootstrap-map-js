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
    'jimu/BaseWidget',
    'jimu/portalUtils',
    "jimu/dijit/Message",
    'jimu/PanelManager',
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer",
    'esri/dijit/BasemapGallery',
    'dojo/_base/lang',
    'dojo/_base/array',
    'esri/request',
    'dojo/on'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidget,
    portalUtils,
    Message,
    PanelManager,
    Basemap,
    BasemapLayer,
    BasemapGallery,
    lang,
    array,
    esriRequest,
    on) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      name: 'BasemapGallery',
      baseClass: 'jimu-widget-basemapgallery',
      basemapGallery: null,
      spatialRef: null,

      startup: function() {
        this.inherited(arguments);
        var showArcGISBasemaps = this.config.basemapGallery.showArcGISBasemaps;
        this.basemapGallery = new BasemapGallery(this.resetBasemaps(), this.basemapGalleryDiv);
        this.basemapGallery.startup();
        if (showArcGISBasemaps === true){
          this.loadPortalBaseMaps();
        }
        this.own(on(this.basemapGallery, "selection-change", lang.hitch(this, this.selectionChange)));
      },

      resetBasemaps: function() {
        var config = lang.clone(this.config.basemapGallery);
        config.map = this.map;
        if (this.appConfig.portalUrl) {
          config.portalUrl = this.appConfig.portalUrl;
        }
        var json = config.basemaps;
        if (json === undefined) {
          return;
        }

        var len = json.length;

        for (var i = 0; i < len; i++) {
          var n = json[i].layers.length;
          var layersArray = [];
          for (var j = 0; j < n; j++) {
            layersArray.push(new BasemapLayer(json[i].layers[j]));
          }
          json[i].layers = layersArray;
          if (json[i].thumbnailUrl) {
            if (json[i].thumbnailUrl.indexOf("data:image") !== 0) {
              json[i].thumbnailUrl = this.folderUrl + json[i].thumbnailUrl;
            }
          }else{
            json[i].thumbnailUrl = this.folderUrl + "images/default.jpg";
          }
          var basemap = new Basemap(json[i]);
          json[i] = basemap;
        }

        config.showArcGISBasemaps = false;

        return config;
      },

      loadPortalBaseMaps: function(){
        this.getSRIDByPortal(this.appConfig.portalUrl);
        var deff = portalUtils.getWebMapsFromBasemapGalleryGroup(this.appConfig.portalUrl);
        deff.then(lang.hitch(this, function(response){
          var webMapItems = response.results;
          array.forEach(webMapItems, lang.hitch(this, function(webMapItem){
            webMapItem.getItemData().then(lang.hitch(this, function(itemData){
              var layerURL = itemData.baseMap.baseMapLayers[0].url;
              if(!layerURL){
                return;
              }
              esriRequest({
                url: layerURL,
                content: {
                  f: 'json'
                },
                handleAs: 'json',
                callbackParamName: "callback"
              }).then(lang.hitch(this, function(layerMeta){
                var wkid = layerMeta.spatialReference && layerMeta.spatialReference.wkid;
                if(wkid){
                  wkid = parseInt(wkid,10);
                  if(wkid === this.spatialRef){
                    var layers = array.map(itemData.baseMap.baseMapLayers, lang.hitch(this, function(layerItem){
                      return new BasemapLayer({url: layerItem.url});
                    }));
                    var basemap = new Basemap({
                      layers: layers,
                      title: webMapItem.title,
                      thumbnailUrl:webMapItem.thumbnailUrl
                    });
                    this.basemapGallery.add(basemap);
                  }
                }
              }), lang.hitch(this, function(err){
                console.error(err);
              }));

            }), lang.hitch(this, function(err){
              console.error(err);
            }));
          }));
        }),lang.hitch(this,function(err){
          console.error(err);
        }));
      },

      getSRIDByPortal: function(portalUrl){
        var def = portalUtils.getPortalSelfInfo(portalUrl);
        def.then(lang.hitch(this, function(response) {
          this.spatialRef = response.defaultBasemap.baseMapLayers[0].resourceInfo.spatialReference.wkid;
          this.spatialRef = parseInt(this.spatialRef, 10);
        }), lang.hitch(this, function(err) {
          new Message({
            message: this.nls.portalConnectionError
          });
          console.error(err);
        })).always(lang.hitch(this, function () {
        }));
      },

      selectionChange: function() {
        var basemap = this.basemapGallery.getSelected();
        var layers = basemap.getLayers();
        if (layers.length > 0) {
          this.publishData(layers);
        }
        PanelManager.getInstance().closePanel(this.id + '_panel');
      }

    });

    return clazz;
  });