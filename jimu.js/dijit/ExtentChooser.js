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
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/Deferred',
  'dijit/_WidgetBase',
  'dojo/Evented',
  'esri/arcgis/utils',
  'esri/geometry/Point',
  'esri/geometry/Extent',
  'esri/geometry/webMercatorUtils',
  'jimu/portalUrlUtils',
  'jimu/dijit/LoadingShelter',
  'jimu/utils'
],
function(declare, lang, html, array, on, Deferred, _WidgetBase, Evented, agolUtils, Point, Extent,
  webMercatorUtils, portalUrlUtils, LoadingShelter, jimuUtils) {
  /* global esriConfig */

  return declare([_WidgetBase, Evented], {
    baseClass: 'jimu-extent-chooser',

    //portalUrl: String
    //  the portalUrl of webmap. Such as 'http://www.arcgis.com'.
    portalUrl: null,

    //itemId: String
    //  the webmap item id. For now, we only support webmap
    itemId: null,

    initExtent: null,
    //bingMapsKey: String
    //  required if working with Microsoft Bing Maps
    bingMapsKey: '',

    geometryServiceURL: null,

    shelter: null,

    postCreate:function(){
      this.inherited(arguments);

      if(!this.geometryServiceURL){
        if(esriConfig.defaults.geometryService){
          this.geometryServiceURL = esriConfig.defaults.geometryService.url;
        }
      }

      if(!this.geometryServiceURL){
        var servicesObj = jimuUtils.getServices();
        this.geometryServiceURL = servicesObj.geometryService;
      }

      this.shelter = new LoadingShelter({
        hidden: true
      });
      this.shelter.placeAt(this.domNode);
      this.shelter.startup();
      this.shelter.show();

      var mapNode = html.create('div', {
        style: {
          width: '100%',
          height: '100%'
        }
      }, this.domNode);
      
      if(!this.portalUrl || !this.itemId){
        return;
      }

      this.portalUrl = portalUrlUtils.getStandardPortalUrl(this.portalUrl);

      var args = {
        geometryServiceURL: this.geometryServiceURL,
        bingMapsKey: this.bingMapsKey
      };

      if(this.initExtent){
        if(this.initExtent.declaredClass !== "esri.geometry.Extent"){
          this.initExtent = new Extent(this.initExtent);
        }
        args.mapOptions = {
          extent:this.initExtent
        };
      }

      var mapDeferred = jimuUtils.createWebMap(this.portalUrl, this.itemId, mapNode, args);

      mapDeferred.then(lang.hitch(this, function(response) {
        this.map = response.map;
        this.map.webMapResponse = response;
        this.own(on(this.map, 'extent-change', lang.hitch(this, function(evt){
          this.onExtentChange(evt.extent);
        })));

        if(!this.initExtent){
          this.onExtentChange(this.map.extent); // send map default extent
        }else {
          this.onExtentChange(this.initExtent);
        }
        this.shelter.hide();
        this.emit('map-load', this.map);
      }),lang.hitch(this,function(err){
        console.error(err);
      }));
    },

    getExtent: function(){
      return this.map && this.map.extent;
    },

    setExtent: function(extent){
      if(this.map){
        return this.map.setExtent(extent);
      }
      else{
        var def = new Deferred();
        setTimeout(lang.hitch(this,function(){
          def.reject('map is null.');
        }),0);
        return def;
      }
    },

    restoreToDefaultWebMapExtent:function(){
      jimuUtils.restoreToDefaultWebMapExtent(this.map, this.map.webMapResponse, this.geometryServiceURL);
    },

    onExtentChange: function(extent){
      /* jshint unused:false */
    }

  });
});