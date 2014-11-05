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
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojox/gfx',
    'esri/symbols/jsonUtils'
  ],
  function(lang, html, gfx, esriSymJsonUtils) {
    var mo = {};

    //public methods:
    //cloneSymbol
    //getDefaultMarkerSymbol
    //getDefaultLineSymbol
    //getDefaultFillSymbol
    //getHightlightMarkerSymbol
    //getHightlightLineSymbol
    //getHightlightFillSymbol
    //createSymbolNode

    mo.cloneSymbol = function(symbol){
      if(!symbol){
        return null;
      }
      var jsonSym = symbol.toJson();
      var cloneSym = esriSymJsonUtils.fromJson(jsonSym);
      return cloneSym;
    };

    mo.getDefaultMarkerSymbol = function(){
      var args = {"style":"esriSMSCircle","color":[0,0,128,128],"name":"Circle","outline":{"color":[0,0,128,255],"width":1},"type":"esriSMS","size":18};
      return esriSymJsonUtils.fromJson(args);
    };

    mo.getDefaultLineSymbol = function(){
      var args = {"tags":["solid"],"title":"Blue Thin","style":"esriSLSSolid","color":[79,129,189,255],"width":3,"name":"Blue 1","type":"esriSLS"};
      return esriSymJsonUtils.fromJson(args);
    };

    mo.getDefaultFillSymbol = function(){
      var args = {"tags":["opaque"],"title":"Blue","style":"esriSFSSolid","color":[79,129,189,255],"name":"Blue 6","type":"esriSFS","outline":{"style":"esriSLSSolid","color":[54,93,141,255],"width":1.5,"type":"esriSLS"}};
      return esriSymJsonUtils.fromJson(args);
    };

    mo.getHightlightMarkerSymbol = function(){
      var args = {"color":[255,255,255,128],"size":18,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSCircle","outline":{"color":[0,255,255,255],"width":1.5,"type":"esriSLS","style":"esriSLSSolid"}};
      return esriSymJsonUtils.fromJson(args);
    };

    mo.getHightlightLineSymbol = function(){
      var args = {"color":[0,255,255,255],"width":1.5,"type":"esriSLS","style":"esriSLSSolid"};
      return esriSymJsonUtils.fromJson(args);
    };

    mo.getHightlightFillSymbol = function(){
      var args = {"color":[255,255,255,128],"outline":{"color":[0,255,255,255],"width":1.5,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"};
      return esriSymJsonUtils.fromJson(args);
    };

    mo.createSymbolNode = function(symbol, /* optional */ surfaceSize){
      // var nodeWidth = 36;
      // var nodeHieght = 36;
      // var node = html.create('div',{style:{width:nodeWidth+'px',height:nodeHieght+'px'}});
      var sWidth = 32;
      var sHeight = 32;

      var node = html.create('div');
      html.setStyle(node, 'display', 'inline-block');

      if(surfaceSize){
        sWidth = surfaceSize.width;
        sHeight = surfaceSize.height;
      }
      else {
        sWidth = 80;
        sHeight = 30;

        if (this._isSimpleMarkerSymbol(symbol)) {
          // extra padding for the outline width
          sWidth = Math.min(symbol.size + 12, 125);
          sHeight = sWidth;
        } else if (this._isPictureMarkerSymbol(symbol)) {
          if (!symbol.url || symbol.url === "http://" || (symbol.url.indexOf("http://") === -1 && symbol.url.indexOf("https://") === -1 && symbol.url.indexOf("data:") === -1)) {
            // bad URL
            return;
          }
          sWidth = Math.min(Math.max(symbol.width, symbol.height), 125);
          sHeight = sWidth;
        } else if (this._isSimpleLineSymbol(symbol) || this._isCartographicLineSymbol(symbol)) {
          sWidth = 190;
          sHeight = 20;
        }
      }

      var surface = gfx.createSurface(node, sWidth, sHeight);
      if (gfx.renderer === "vml") {
        // Fixes an issue in IE where the shape is partially drawn and
        // positioned to the right of the table cell  
        var source = surface.getEventSource();
        html.setStyle(source, "position", "relative");
        html.setStyle(source.parentNode, "position", "relative");
      }

      var shapeDesc = null;

      if(surfaceSize){
        shapeDesc = esriSymJsonUtils.getShapeDescriptors(symbol);
      }
      else{
        if (this._isSimpleLineSymbol(symbol) || this._isCartographicLineSymbol(symbol)) {
          shapeDesc = this._getLineShapeDesc(symbol);
        } else {
          shapeDesc = esriSymJsonUtils.getShapeDescriptors(symbol);
        }
      }
      

      var gfxShape;
      try {
        //gfxShape = surface.createShape(shapeDesc.defaultShape).setFill(shapeDesc.fill).setStroke(shapeDesc.stroke);
        gfxShape = surface.createShape(shapeDesc.defaultShape);
        if(shapeDesc.fill){
          gfxShape.setFill(shapeDesc.fill);
        }
        if(shapeDesc.stroke){
          gfxShape.setStroke(shapeDesc.stroke);
        }
      } catch (e) {
        surface.clear();
        surface.destroy();
        return;
      }
      
      var dim = surface.getDimensions();
      var transform = {
        dx: dim.width / 2,
        dy: dim.height / 2
      };

      var bbox = gfxShape.getBoundingBox();
      var width = bbox.width;
      var height = bbox.height;

      if (width > sWidth || height > sHeight) {
        var actualSize = width > height ? width : height;
        var refSize = sWidth < sHeight ? sWidth : sHeight;
        var scaleBy = (refSize - 5) / actualSize;
        lang.mixin(transform,{
          xx: scaleBy,
          yy: scaleBy
        });
      }

      gfxShape.applyTransform(transform);
      // return surface;
      return node;
    };



    mo._getLineShapeDesc = function(symbol){
      var result = null;
      if (this._isSimpleLineSymbol(symbol) || this._isCartographicLineSymbol(symbol)) {
        // we want a longer line
        var shape = {
          type: "path",
          path: "M -90,0 L 90,0 E"
        };
        result = {
          defaultShape: shape,
          fill: null,
          stroke: symbol.getStroke()
        };
      }
      return result;
    };

    mo._isSimpleMarkerSymbol= function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.SimpleMarkerSymbol';
    };

    mo._isSimpleLineSymbol = function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.SimpleLineSymbol';
    };

    mo._isCartographicLineSymbol = function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.CartographicLineSymbol';
    };

    mo._isPictureMarkerSymbol= function(symbol){
      return symbol && symbol.declaredClass === 'esri.symbol.PictureMarkerSymbol';
    };

    return mo;
  });