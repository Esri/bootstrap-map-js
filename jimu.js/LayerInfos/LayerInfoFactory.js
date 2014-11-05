define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/aspect',
  'dojo/Deferred'
], function(declare, array, lang, aspect, Deferred) {
  var instance = null,
    clazz = declare(null, {
      constructor: function() {
        //this.map = map;
      },

      init: function() {
        var retDef = new Deferred();
        require(['jimu/LayerInfos/LayerInfoForCollection',
          'jimu/LayerInfos/LayerInfoForMapService',
          'jimu/LayerInfos/LayerInfoForKML',
          'jimu/LayerInfos/LayerInfoForGeoRSS',
          'jimu/LayerInfos/LayerInfoForDefault',
          'jimu/LayerInfos/LayerInfoForWMS',
          'jimu/LayerInfos/LayerInfoForGroup',
          'jimu/LayerInfos/LayerInfoForDefaultDynamic',
          'jimu/LayerInfos/LayerInfoForDefaultTile',
          'jimu/LayerInfos/LayerInfoForDefaultWMS'
        ], lang.hitch(this, function(
          LayerInfoForCollection,
          LayerInfoForMapService,
          LayerInfoForKML,
          LayerInfoForGeoRSS,
          LayerInfoForDefault,
          LayerInfoForWMS,
          LayerInfoForGroup,
          LayerInfoForDefaultDynamic,
          LayerInfoForDefaultTile,
          LayerInfoForDefaultWMS) {
          this.LayerInfoForCollection = LayerInfoForCollection;
          this.LayerInfoForMapService = LayerInfoForMapService;
          this.LayerInfoForKML = LayerInfoForKML;
          this.LayerInfoForGeoRSS = LayerInfoForGeoRSS;
          this.LayerInfoForDefault = LayerInfoForDefault;
          this.LayerInfoForWMS = LayerInfoForWMS;
          this.LayerInfoForGroup = LayerInfoForGroup;
          this.LayerInfoForDefaultDynamic = LayerInfoForDefaultDynamic;
          this.LayerInfoForDefaultTile = LayerInfoForDefaultTile;
          this.LayerInfoForDefaultWMS = LayerInfoForDefaultWMS;
          retDef.resolve();
        }));
        return retDef;
      },

      create: function(operLayer) {
        if (operLayer.featureCollection) {
          return new this.LayerInfoForCollection(operLayer, this.map);
        } else if (operLayer.layerObject.declaredClass === 'esri.layers.KMLLayer') {
          return new this.LayerInfoForKML(operLayer, this.map);
        } else if (operLayer.layerObject.declaredClass === 'esri.layers.GeoRSSLayer') {
          return new this.LayerInfoForGeoRSS(operLayer, this.map);
        } else if ((operLayer.layerObject.declaredClass === 'esri.layers.WMSLayer') && !operLayer.selfType) {
          return new this.LayerInfoForWMS(operLayer, this.map);
          //} else if (operLayer.layerObject && operLayer.layerObject.layerInfos) {
        } else if (operLayer.layerObject.declaredClass === 'esri.layers.ArcGISDynamicMapServiceLayer' || operLayer.layerObject.declaredClass === 'esri.layers.ArcGISTiledMapServiceLayer') {
          return new this.LayerInfoForMapService(operLayer, this.map);
          //} else if (operLayer.layerObject) {
        } else {
          switch (operLayer.selfType) {
          case 'mapservice_dynamic_group':
            return new this.LayerInfoForGroup(operLayer, this.map);
          case 'mapservice_tiled_group':
            return new this.LayerInfoForGroup(operLayer, this.map, true);
          case 'mapservice_dynamic':
            return new this.LayerInfoForDefaultDynamic(operLayer, this.map);
          case 'mapservice_tiled':
            return new this.LayerInfoForDefaultTile(operLayer, this.map);
          case 'wms':
            return new this.LayerInfoForDefaultWMS(operLayer, this.map);
          default:
            return new this.LayerInfoForDefault(operLayer, this.map);
          }
        }
      }
    });

  clazz.getInstance = function(map) {
    if (instance === null) {
      instance = new clazz();
    }
    // map can be changed.
    if(map) {
      instance.map = map;
    }
    return instance;
  };
  return clazz;
});
