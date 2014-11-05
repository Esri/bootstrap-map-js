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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  './resultrenderers/simpleResultRenderers'
],
function(declare, _WidgetBase, lang, array, html, on, simpleResultRenderers) {
  var mo = {}, map, nls, config;

  mo.createResultRenderer = function(param, value) {
  //summary:
  //  create result renderer depends on the parameter type.
  //  renderer can't be in setting page
    var resultRenderer;
    var rendererName = getRendererNameFromParam(param);
    var o = {
      param: param,
      map: map,
      nls: nls,
      config: config
    };
    if(rendererName === 'DrawResultFeatureSet'){
      o.value = value.value;
      resultRenderer = new simpleResultRenderers.DrawResultFeatureSet(o);
    }else if(rendererName === 'RecordSetTable'){
      o.value = value.value;
      resultRenderer = new simpleResultRenderers.RecordSetTable(o);
    }else if(rendererName === 'SimpleResultRenderer'){
      var text;
      if(['GPLong', 'GPDouble', 'GPString', 'GPBoolean', 'GPMultiValue'].indexOf(param.dataType) > -1){
        text = value.value;
      }else if(param.dataType === 'GPLinearUnit'){
        text = value.value.distance + '&nbsp;' + value.value.units;
      }else if(param.dataType === 'GPDate'){
        text = new Date(value.value).toLocaleTimeString();
      }else if(param.dataType === 'GPRecordSet'){
        text = 'table';
      }else if(param.dataType === 'GPDataFile' || param.dataType === 'GPRasterDataLayer'){
        text = '<a target="_blank" href="' + value.value.url + '">' + value.value.url + '</a>';
      }
      
      o.message = text;
      resultRenderer = new simpleResultRenderers.SimpleResultRenderer(o);
    }else if(rendererName === 'UnsupportRenderer'){
      o.message = 'type ' + param.dataType + ' is not supported for now.';
      resultRenderer = new simpleResultRenderers.UnsupportRenderer(o);
    }else{
      o.message = 'unknown renderer name: ' + rendererName;
      resultRenderer = new simpleResultRenderers.UnsupportRenderer(o);
    }
    
    return resultRenderer;
  };

  mo.setMap = function(_map){
    map = _map;
  };

  mo.setNls = function(_nls){
    nls = _nls;
  };

  mo.setConfig = function(_config){
    config = _config;
  };

  function getRendererNameFromParam(param){
    //for now, we don't support config renderer in setting page

    if(param.dataType === 'GPFeatureRecordSetLayer'){
      return 'DrawResultFeatureSet';
    }else if(param.dataType === 'GPRecordSet'){
      return 'RecordSetTable';
    }else{
      return 'SimpleResultRenderer';
    }
  }

  return mo;
});