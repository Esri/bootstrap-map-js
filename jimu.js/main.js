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

define(["./ConfigManager",
 "./LayoutManager",
 'dojo/_base/html',
 'dojo/_base/lang',
 'dojo/_base/array',
 'dojo/on',
 'dojo/mouse',
 'dojo/topic',
 'dojo/cookie',
 'dojo/Deferred',
 'dojo/promise/all',
 'dojo/io-query',
 'dojo/domReady!',
 'esri/request',
 'esri/urlUtils',
 'esri/IdentityManager',
 'jimu/portalUrlUtils',
 './utils',
 'require'],
function(ConfigManager, LayoutManager, html, lang, array, on, mouse, topic, cookie, Deferred, all,
  ioquery, domReady, esriRequest, urlUitls, IdentityManager, portalUrlUtils, jimuUtils, require) {
  /* global jimuConfig:true */
  var mo = {};

  //patch for JS API 3.10
  var hasMethod = typeof cookie.getAll === 'function';
  if(!hasMethod){
    cookie.getAll = function(e){
      var result = [];
      var v = cookie(e);
      if(v){
        result.push(v);
      }
      return result;
    };
  }

  esriRequest.setRequestPreCallback(function(ioArgs) {
    //preventCache
    ioArgs.preventCache = true;

    //use https protocol
    var ancestorWindow = jimuUtils.getAncestorWindow();
    if(ancestorWindow.location.href.indexOf("https://") === 0){
      var patt = /^http(s?):\/\//gi;
      ioArgs.url = ioArgs.url.replace(patt,'//');
    }

    return ioArgs;
  });

  // disable middle mouse button scroll
  on(window, 'mousedown', function(evt){
    if (!mouse.isMiddle(evt)){
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();
    evt.returnValue = false;
    return false;
  });

  String.prototype.startWith = function(str){
    if(this.substr(0, str.length) === str){
      return true;
    }else{
      return false;
    }
  };

  String.prototype.endWith = function(str){
    if(this.substr(this.length - str.length, str.length) === str){
      return true;
    }else{
      return false;
    }
  };

  /*jshint unused: false*/
  if(typeof jimuConfig === 'undefined'){
    jimuConfig = {};
  }
  jimuConfig = lang.mixin({
    loadingId: 'main-loading',
    layoutId: 'jimu-layout-manager',
    mapId: 'map',
    mainPageId: 'main-page',
    timeout: 5000,
    widthBreaks: [600, 1280]
  }, jimuConfig);

  window.jimu = {version: '10.3 EAP2'};

  function initApp(){
    var urlParams, configManager, layoutManager;
    console.log('jimu.js init...');
    urlParams = getUrlParams();

    html.setStyle(jimuConfig.loadingId, 'display', 'none');
    html.setStyle(jimuConfig.mainPageId, 'display', 'block');

    layoutManager = LayoutManager.getInstance({
      mapId: jimuConfig.mapId
    }, jimuConfig.layoutId);
    configManager = ConfigManager.getInstance(urlParams);

    layoutManager.startup();
    configManager.loadConfig();
  }

  function getUrlParams(){
    var s = window.location.search, p;
    if(s === ''){
      return {};
    }

    p = ioquery.queryToObject(s.substr(1));
    return p;
  }

  mo.initApp = initApp;
  return mo;
});