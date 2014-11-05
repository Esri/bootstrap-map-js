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
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/Deferred',
  'esri/graphicsUtils',
  'dojo/aspect',
  'dojo/dom-style',
  'dojo/dom-class',
  'dojo/dom-attr',
  //'./NlsStrings',
  'dojo/dom-construct',
  'esri/layers/FeatureLayer',
  'esri/config',
  'esri/tasks/ProjectParameters',
  'esri/SpatialReference',
  'esri/geometry/webMercatorUtils'
], function(declare, array, lang, Deferred, graphicsUtils, aspect, domStyle, domClass, domAttr, /*NlsStrings,*/ domConstruct, FeatureLayer, esriConfig, ProjectParameters, SpatialReference, webMercatorUtils) {
  return declare(null, {
    originOperLayer: null,
    layerObject:     null,
    map:             null,
    title:           null,
    id:              null,
    newSubLayers:    null,

    constructor: function(operLayer, map) {
      this.originOperLayer = operLayer;
      this.layerObject = operLayer.layerObject;
      this.map = map;
      this.title = this.originOperLayer.title;
      this.id = this.originOperLayer.id;
      this.popupMenuInfo = {
        //descriptionTitle: NlsStrings.value.itemDesc,
        menuItems: ['Zoom to', 'Transparency', '', 'Move up', 'Move down', '', 'Description'],
        deniedItems: []
      };
    },

    init: function() {
      //new section
      this.newSubLayers = this.obtainNewSubLayers();
      this.visible = this._obtainIsVisible();
      if (this.originOperLayer.popupInfo) {
        this.popupVisible = true;
      }
    },

    // to decide layer display in whitch group, now only has two groups: graphic or nographic
    isGraphicLayer: function() {
      var layerIndexesInMap = this._obtainLayerIndexesInMap();
      // to decide layer display in whitch group, now only has two groups: graphic or nographic
      return layerIndexesInMap.length ? layerIndexesInMap[0].isGraphicLayer : false;
    },

    obtainLayerIndexesInMap: function() {
      return this._obtainLayerIndexesInMap();
    },

    getExtent: function() {
      // implemented by sub class.
    },

    // about transparency
    getOpacity: function() {
      var i, opacity = 0;
      for (i = 0; i < this.newSubLayers.length; i++) {
        if (this.newSubLayers[i].layerObject.opacity) {
          opacity = this.newSubLayers[i].layerObject.opacity > opacity ? this.newSubLayers[i].layerObject.opacity : opacity;
        } else {
          return 1;
        }
      }
      return opacity;
    },

    setOpacity: function(opacity) {
      array.forEach(this.newSubLayers, function(subLayer) {
        if (subLayer.layerObject.setOpacity) {
          subLayer.layerObject.setOpacity(opacity);
        }
      });
    },

    // about change layer order.
    moveLeftOfIndex: function(index) {
      this.map.reorderLayer(this.layerObject, index);
    },

    // *************** need to refactor.
    moveRightOfIndex: function(index) {
      this.map.reorderLayer(this.layerObject, index);
    },
    
    traversal: function(callback) {
      callback(this);
      array.forEach(this.getSubLayers(), lang.hitch(this, function(subLayerInfo) {
        subLayerInfo.traversal(callback);
      }));
    },

    findLayerInfoById: function(id) {
      // summary:
      //    recursion find LayerInof in subLayerInfos.
      // description:
      //    return null if does not find.
      var layerInfo = null;
      var i = 0;
      if (this.id && this.id === id) {
        return this;
      } else {
        for(i = 0; i < this.newSubLayers.length; i++) {
          layerInfo = this.newSubLayers[i].findLayerInfoById(id);
          if (layerInfo) {
            break;
          }
        }
        return layerInfo;
      }
    },

    setTopLayerVisible: function(visible) {
      /*jshint unused: false*/
      // implemented by sub class.
    },

    setSubLayerVisible: function(subLayerId, visible) {
      /*jshint unused: false*/
      // implemented by sub class.
    },

    setLayerVisiblefromTopLayer: function() {
      // implemented by sub class.
    },

    // about layer visible.
    _obtainIsVisible: function() {
      // implemented by sub class.
    },

    //about layer indexes
    //indexes:[{
    //  isGraphicLayer:
    //  index:
    //},{}]
    //
    _obtainLayerIndexesInMap: function() {
      var indexes = [];
      var index;
      index = this._getLayerIndexesInMapByLayerId(this.id);
      if (index) {
        indexes.push(index);
      }
      return indexes;
    },

    _getLayerIndexesInMapByLayerId: function(id) {
      var i;
      for (i = 0; i < this.map.graphicsLayerIds.length; i++) {
        if (this.map.graphicsLayerIds[i] === id) {
          return {
            isGraphicLayer: true,
            index: i
          };
        }
      }

      for (i = 0; i < this.map.layerIds.length; i++) {
        if (this.map.layerIds[i] === id) {
          return {
            isGraphicLayer: false,
            index: i
          };
        }
      }
      return null;
    },

    _convertGeometryToMapSpatialRef: function(geometry) {
      /*
      if (this.map.spatialReference.isWebMercator()) {
        if (!geometry.spatialReference.isWebMercator()) {
          return webMercatorUtils.geographicToWebMercator(geometry);
        }
      } else {
        if (geometry.spatialReference.isWebMercator()) {
          return webMercatorUtils.webMercatorToGeographic(geometry);
        }
      }
      return geometry;
      */
      var def = new Deferred();
      if (this.map.spatialReference.equals(geometry.spatialReference)) {
        def.resolve([geometry]);
        return def;
      }
      if (this.map.spatialReference.isWebMercator() && geometry.spatialReference.equals(new SpatialReference(4326))) {
        def.resolve([webMercatorUtils.geographicToWebMercator(geometry)]);
        return def;
      }
      if (this.map.spatialReference.equals(new SpatialReference(4326)) && geometry.spatialReference.isWebMercator()) {
        def.resolve([webMercatorUtils.webMercatorToGeographic(geometry)]);
        return def;
      }
      var params = new ProjectParameters();
      params.geometries = [geometry];
      params.outSR = this.map.spatialReference;
      return esriConfig.defaults.geometryService.project(params);
    },

    /*
    _onSubLayerVisibleChange: function(subLayerInfo, visibleFlage, visible) {
      if(this.responseVisibleChangeFlag) {
        subLayerInfo.visible = visible;
        if(visible && this.originOperLayer.featureCollection) {
          this.visible = visible;
        }
      } 
      this.responseVisibleChage = true;
    },*/

    // new section--------------------------------------------------------------------

    obtainNewSubLayers: function( /*operLayer*/ ) {
      //implemented by sub class.
      var newSubLayers = [];
      return newSubLayers;
    },

    obtainLegendsNode: function() {
      var legendsNode = domConstruct.create("div", {
        "class": "legends-div"
      });
      return legendsNode;
    },

    initLegendsNode: function(legendsNode) {
      /*jshint unused: false*/
      // implemented by sub class.
    },

    loadLayer: function() {
      // implemented by sub class.
    },


    getDeniedItems: function() {
      var dynamicDeniedItems = [];
      if (this.isFirst) {
        dynamicDeniedItems.push('Move up');
      } else if (this.isLast) {
        dynamicDeniedItems.push('Move down');
      }

      if ( this.layerObject.declaredClass !== 'esri.layers.FeatureLayer') {
        dynamicDeniedItems.push('Open attribute table');
      }

      if(!this.layerObject || !this.layerObject.url) {
        dynamicDeniedItems.push('Description');
        dynamicDeniedItems.push('Download');
      }
      return this.popupMenuInfo.deniedItems.concat(dynamicDeniedItems);
    },

    onPopupMenuClick: function(evt) {
      var result = {
        closeMenu: true
      };
      switch (evt.item) {
      case 'Zoom to':
        this._onItemZoomToClick(evt);
        break;
      case 'Move up':
        this._onMoveUpItemClick(evt);
        break;
      case 'Move down':
        this._onMoveDownItemClick(evt);
        break;
      case 'Open attribute table':
        this._onTableItemClick(evt);
        break;
      case 'Description':
      case 'Download':
        this._onUrlItemClick(evt);
        break;
      case 'transparencyChanged':
        this._onTransparencyChanged(evt);
        result.closeMenu = false;
        break;

      }
      return result;
    },

    // about popupMenu item click response
    _onItemZoomToClick: function(evt) {
      /*jshint unused: false*/
      //this.map.setExtent(this.getExtent());
      this.getExtent().then(lang.hitch(this, function(geometries) {
        this.map.setExtent(geometries[0]);
      }));
    },

    _onTransparencyItemClick: function(evt) {
      /*jshint unused: false*/
    },

    _onMoveUpItemClick: function(evt) {
      if (!this.isFirst) {
        evt.layerListView.moveUpLayer(this.id);
      }
    },

    _onMoveDownItemClick: function(evt) {
      if (!this.isLast) {
        evt.layerListView.moveDownLayer(this.id);
      }
    },

    _onTableItemClick: function(evt) {
      if (this.layerObject.declaredClass === 'esri.layers.FeatureLayer') {
        evt.layerListWidget.publishData({
          'target': 'AttributeTable',
          'layer': this.layerObject
        });
      }
    },

    _onUrlItemClick: function(evt) {
      /*jshint unused: false*/
      var a;
      if (this.layerObject && this.layerObject.url) {
        a = domConstruct.create('a', {
          'href': this.layerObject.url,
          'target': '_blank'
        });
        a.click();
      }
    },

    _onTransparencyChanged: function(evt) {
      this.setOpacity(1 - evt.data.newTransValue);
    },

    //--------------public interface---------------------------
    getLayerObject: function() {
      var def = new Deferred();
      if (this.layerObject) {
        def.resolve(this.layerObject);
      } else {
        def.reject("layerObject is null");
      }
      return def;
    },

    getSubLayers: function() {
      return this.newSubLayers;
    }

  });
});
