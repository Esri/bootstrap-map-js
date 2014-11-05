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

define(['dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/_base/sniff',
    'dojo/io-query',
    'dojo/query',
    'dojo/NodeList-traverse',
    'dojo/Deferred',
    'dojo/on',
    'dojo/json',
    'dojo/cookie',
    'dojo/request/xhr',
    'esri/arcgis/utils',
    'esri/SpatialReference',
    'esri/geometry/Extent',
    'esri/geometry/webMercatorUtils',
    'esri/tasks/GeometryService',
    'esri/tasks/ProjectParameters',
    'jimu/portalUrlUtils',
    'esri/urlUtils'
  ],

  function(lang, array, html, has, ioQuery, query, nlt, Deferred, on, json, cookie, xhr, arcgisUtils,
    SpatialReference, Extent, webMercatorUtils, GeometryService, ProjectParameters,
    portalUrlUtils, esriUrlUtils) {
    /* global esriConfig */
    var mo = {};

    var servicesObj = {
      geometryService: 'http://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer'
    };

    //if no beforeId, append to head tag, or insert before the id
    function loadStyleLink(id, href, beforeId) {
      var def = new Deferred(),
        styleNode;

      if (beforeId) {
        styleNode = html.create('link', {
          id: id,
          rel: "stylesheet",
          type: "text/css",
          href: href
        }, html.byId(beforeId), 'before');
      } else {
        styleNode = html.create('link', {
          id: id,
          rel: "stylesheet",
          type: "text/css",
          href: href
        }, document.getElementsByTagName('head')[0]);
      }

      on(styleNode, 'load', function() {
        def.resolve('load');
      });

      //for the browser which doesn't fire load event
      //safari update documents.stylesheets when style is loaded.
      var ti = setInterval(function() {
        var loadedSheet;
        if (array.some(document.styleSheets, function(styleSheet) {
          if (styleSheet.href && styleSheet.href.substr(styleSheet.href.indexOf(href), styleSheet.href.length) === href) {
            loadedSheet = styleSheet;
            return true;
          }
        })) {
          if (!def.isFulfilled() && (loadedSheet.cssRules && loadedSheet.cssRules.length || loadedSheet.rules && loadedSheet.rules.length)) {
            def.resolve('load');
          }
          clearInterval(ti);
        }
      }, 50);
      return def;
    }

    var errorCheckLists = [];
    require.on("error", function(err) {
      array.forEach(errorCheckLists, function(o) {
        if (err.info[0] && err.info[0].indexOf(o.resKey) > -1) {
          o.def.reject(err);
        }
        for (var p in err.info) {
          if (p.indexOf(o.resKey) > -1) {
            o.def.reject(err);
          }
        }
      });
    });

    mo.checkError = function(resKey, def) {
      //when resKey match a error, def will be reject
      errorCheckLists.push({
        resKey: resKey,
        def: def
      });
    };

    /**
     * Repalce the placeholders in the obj Object properties with the props Object values,
     * return the replaced object
     * The placeholder syntax is: ${prop}
     */
    mo.replacePlaceHolder = function(obj, props) {
      var str = JSON.stringify(obj),
        m = str.match(/\$\{(\w)+\}/g),
        i;

      if (m === null) {
        return obj;
      }
      for (i = 0; i < m.length; i++) {
        var p = m[i].match(/(\w)+/g)[0];
        if (props[p]) {
          str = str.replace(m[i], props[p]);
        }
      }
      return JSON.parse(str);
    };

    /***
     * change latitude/longitude to degree, minute, second
     **/
    mo.changeUnit = function(val) {
      var abs = Math.abs(val),
        text, d, m, s;
      d = Math.floor(abs);
      m = Math.floor((abs - d) * 60);
      s = (((abs - d) * 60 - m) * 60).toFixed(2);
      //00B0 id degree character    
      text = d + '\u00B0' + ((m < 10) ? ('0' + m) : m) + '\'' + ((s < 10) ? ('0' + s) : s) + '"';
      return text;
    };

    /**
     * the formated format is: mm:ss.ms
     **/
    mo.formatTime = function(time) {
      var s = time / 1000,
        m = Math.floor(s / 60),
        s2 = Number(s - m * 60).toFixed(1),
        text = ((m < 10) ? '0' + m : m) + ':' + ((s2 < 10) ? '0' + s2 : s2);
      return text;
    };

    mo.parseTime = function(text) {
      var p = /(\d{2,})\:(\d{2})\.(\d{1})/,
        m, t;
      if (!p.test(text)) {
        console.log('wrong time format.');
        return -1;
      }
      m = text.match(p);
      t = (parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + parseInt(m[3], 10) / 10) * 1000;
      return t;
    };

    mo.preloadImg = function(imgs, rpath) {
      var imgArray = [];
      if (typeof imgs === 'string') {
        imgArray = [imgs];
      } else {
        imgArray = imgs;
      }
      array.forEach(imgArray, function(imgUrl) {
        var img = new Image();
        if (rpath) {
          img.src = rpath + imgUrl;
        } else {
          img.src = imgUrl;
        }
      });
    };

    /**
     * get style object from position
     * the position can contain 6 property: left, top, right, bottom, width, height
     * please refer to AbstractModule
     */
    mo.getPositionStyle = function(position) {
      var style = {};
      for (var p in position) {
        if (array.indexOf(['left', 'top', 'right', 'bottom', 'width', 'height'], p) >= 0) {
          if (typeof position[p] === 'number') {
            style[p] = position[p] + 'px';
          } else if (position[p]) {
            style[p] = position[p];
          }
        }
      }
      return style;
    };

    /**
     * compare two object/array recursively
     */
    function isEqual(o1, o2) {
      var leftChain, rightChain;

      function compare2Objects(x, y) {
        var p;
        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
          return true;
        }
        // Compare primitives and functions.     
        // Check if both arguments link to the same object.
        // Especially useful on step when comparing prototypes
        if (x === y) {
          return true;
        }
        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
          (x instanceof Date && y instanceof Date) ||
          (x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String && y instanceof String) ||
          (x instanceof Number && y instanceof Number)) {
          return x.toString() === y.toString();
        }
        // check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
          return false;
        }
        // Quick checking of one object beeing a subset of another.
        // todo: cache the structure of arguments[0] for performance
        if (y !== null) {
          for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
              return false;
            } else if (typeof y[p] !== typeof x[p]) {
              return false;
            }
          }
          for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
              return false;
            } else if (typeof y[p] !== typeof x[p]) {
              return false;
            }
            switch (typeof(x[p])) {
              case 'object':
              case 'function':
                leftChain.push(x);
                rightChain.push(y);
                if (!compare2Objects(x[p], y[p])) {
                  return false;
                }
                leftChain.pop();
                rightChain.pop();
                break;
              default:
                if (x[p] !== y[p]) {
                  return false;
                }
                break;
            }
          }
        }

        return true;
      }

      leftChain = []; //todo: this can be cached
      rightChain = [];
      if (!compare2Objects(o1, o2)) {
        return false;
      }
      return true;
    }

    mo.isEqual = isEqual;

    //merge the target and src object/array, return the merged object/array.
    function merge(target, src) {
      var array = Array.isArray(src);
      var dst = array && [] || {};

      if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function(e, i) {
          if (typeof target[i] === 'undefined') {
            dst[i] = e;
          } else if (typeof e === 'object') {
            dst[i] = merge(target[i], e);
          } else {
            if (target.indexOf(e) === -1) {
              dst.push(e);
            }
          }
        });
      } else {
        if (target && typeof target === 'object') {
          Object.keys(target).forEach(function(key) {
            dst[key] = target[key];
          });
        }
        Object.keys(src).forEach(function(key) {
          if (typeof src[key] !== 'object' || !src[key]) {
            dst[key] = src[key];
          } else {
            if (!target[key]) {
              dst[key] = src[key];
            } else {
              dst[key] = merge(target[key], src[key]);
            }
          }
        });
      }

      return dst;
    }

    function setVerticalCenter(contextNode) {
      function doSet() {
        var nodes = query('.jimu-vcenter-text', contextNode),
          h, ph;
        array.forEach(nodes, function(node) {
          h = html.getContentBox(node).h;
          html.setStyle(node, {
            lineHeight: h + 'px'
          });
        }, this);

        nodes = query('.jimu-vcenter', contextNode);
        array.forEach(nodes, function(node) {
          h = html.getContentBox(node).h;
          ph = html.getContentBox(query(node).parent()[0]).h;
          html.setStyle(node, {
            marginTop: (ph - h) / 2 + 'px'
          });
        }, this);
      }

      //delay sometime to let browser update dom
      setTimeout(doSet, 10);
    }

    /**
     * get uri info from the configured uri property,
     * the info contains: folderUrl, name
     */
    function getUriInfo(uri) {
      var pos, firstSeg, info = {},
        amdFolder;

      pos = uri.indexOf('/');
      firstSeg = uri.substring(0, pos);

      //config using package
      amdFolder = uri.substring(0, uri.lastIndexOf('/') + 1);
      info.folderUrl = require(mo.getRequireConfig()).toUrl(amdFolder);
      info.amdFolder = amdFolder;

      return info;
    }

    mo.file = {
      supportHTML5: function() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          return true;
        } else {
          return false;
        }
      },
      supportFileAPI: function() {
        if (has('safari') && has('safari') < 6) {
          return false;
        }
        if (window.FileAPI && window.FileAPI.readAsDataURL) {
          return true;
        }
        return false;
      },
      containSeparator: function(path) {
        if (path.indexOf("/") >= 0) {
          return true;
        } else {
          if (path.indexOf("\\") >= 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      getNameFromPath: function(path) {
        var separator = "";
        if (path.indexOf("/") >= 0) {
          separator = "/";
        } else {
          separator = "\\";
        }
        var segment = path.split(separator);
        if (segment.length > 0) {
          return segment[segment.length - 1];
        } else {
          return null;
        }

      },
      getFolderFromPath: function(path) {
        return path.substr(0, path.length - mo.file.getNameFromPath(path).length);
      },
      /********
       * read file by HTML5 API.
       *
       * parameters:
       * file: the file will be read.
       * filter: file type filter, files which don't match the filter will not be read and return false.
       * maxSize: file size which exceeds the size will return false;
       * cb: the callback function when file is read completed, signature: (err, fileName, fileData)
       */
      readFile: function(fileEvt, filter, maxSize, cb) {
        if (this.supportHTML5()) {
          var file = fileEvt.target.files[0];
          if (!file) {
            return;
          }
          // Only process image files.
          if (!file.type.match(filter)) {
            cb("Invalid file type.");
            return;
          }

          if (file.size >= maxSize) {
            cb("Too large file, max size is " + Math.floor(maxSize / 1000) + "K.");
            return;
          }

          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = function(e) {
            cb(null, file.name, e.target.result);
          };
          // Read in the image file as a data URL.
          reader.readAsDataURL(file);
        } else if (this.supportFileAPI()) {
          var files = window.FileAPI.getFiles(fileEvt);

          // Only process image files.
          if (!files[0].type.match(filter)) {
            cb("Invalid file type.");
            return;
          }

          if (files[0].size >= maxSize) {
            cb("Too large file, max size is " + Math.floor(maxSize / 1048576) + "M.");
            return;
          }

          window.FileAPI.readAsDataURL(files[0], function(evt) {
            if (evt && evt.result) {
              cb(null, files[0].name, evt.result);
            } else {
              cb("TODO: not suport file readerAsDataURL API");
            }
          });
        }
      }
    };

    mo.checkFileExist = function(file) {
      var def = new Deferred();
      xhr(file).then(function() {
        def.resolve(true);
      }, function() {
        def.resolve(false);
      });
      return def;
    };

    mo.processWidgetSetting = function(setting) {
      if (!setting.uri) {
        return setting;
      }
      lang.mixin(setting, getUriInfo(setting.uri));

      if (!setting.icon) {
        setting.icon = setting.folderUrl + 'images/icon.png';
      }
      if (!setting.thumbnail) {
        setting.thumbnail = setting.folderUrl + 'images/thumbnail.png';
      }
      return setting;
    };

    mo.getRequireConfig = function() {
      /* global jimuConfig */
      if (jimuConfig) {
        var packages = [];
        if (jimuConfig.widgetsPackage) {
          packages = packages.concat(jimuConfig.widgetsPackage);
        }
        if (jimuConfig.themesPackage) {
          packages = packages.concat(jimuConfig.themesPackage);
        }
        return {
          packages: packages
        };
      } else {
        return {};
      }
    };

    mo.getTypeByGeometryType = function(esriType) {
      var type = null;
      var _pointTypes = ['esriGeometryPoint', 'esriGeometryMultipoint'];
      var _lineTypes = ['esriGeometryLine', 'esriGeometryCircularArc', 'esriGeometryEllipticArc', 'esriGeometryBezier3Curve', 'esriGeometryPath', 'esriGeometryPolyline'];
      var _polygonTypes = ['esriGeometryRing', 'esriGeometryPolygon', 'esriGeometryEnvelope'];
      if (_pointTypes.indexOf(esriType) >= 0) {
        type = 'point';
      } else if (_lineTypes.indexOf(esriType) >= 0) {
        type = 'polyline';
      } else if (_polygonTypes.indexOf(esriType) >= 0) {
        type = 'polygon';
      }
      return type;
    };

    mo.getServices = function() {
      return servicesObj;
    };

    mo.getArcGISDefaultGeometryService = function() {
      var url = servicesObj.geometryService;
      var gs = new GeometryService(url);
      return gs;
    };

    mo.restoreToDefaultWebMapExtent = function(map, webMapResponse, geoServiceUrl) {
      var def = new Deferred();
      var isMapValid = map && map.declaredClass === 'esri.Map';
      if (!isMapValid) {
        setTimeout(function() {
          def.reject('Invalid map.');
        }, 0);
        return def;
      }
      var itemInfo = webMapResponse && webMapResponse.itemInfo;
      if (!itemInfo) {
        setTimeout(function() {
          def.reject('Invalid itemInfo');
        }, 0);
        return def;
      }

      var points = itemInfo.item && 　itemInfo.item.extent;

      if (!points) {
        setTimeout(function() {
          def.reject('Invalid itemInfo.item.extent');
        });
        return def;
      }

      var spatialRef = new SpatialReference({
        wkid: 4326
      });
      var extent = new Extent(points[0][0], points[0][1], points[1][0], points[1][1], spatialRef);

      var mapWkid = parseInt(map.spatialReference.wkid, 10);

      if (mapWkid === 4326) {
        return map.setExtent(extent);
      } else {
        if (map.spatialReference.isWebMercator()) {
          extent = webMercatorUtils.geographicToWebMercator(extent);
          return map.setExtent(extent);
        } else {
          var params = new ProjectParameters();
          params.geometries = [extent];
          params.outSR = map.spatialReference;

          var gs = esriConfig && esriConfig.defaults && esriConfig.defaults.geometryService;
          var existGS = gs && gs.declaredClass === "esri.tasks.GeometryService";
          if (!existGS) {
            var validGeoService = geoServiceUrl && typeof geoServiceUrl === 'string' && lang.trim(geoServiceUrl);
            if (validGeoService) {
              geoServiceUrl = lang.trim(geoServiceUrl);
              gs = new GeometryService(geoServiceUrl);
            } else {
              gs = mo.getArcGISDefaultGeometryService();
            }
          }

          gs.project(params).then(function(geometries) {
            var projectedExt = geometries && geometries[0];
            if (projectedExt) {
              return map.setExtent(projectedExt);
            } else {
              def.reject('Invalid projected geometry.');
              return def;
            }
          }, function(err) {
            console.error(err);
            def.reject(err);
            return def;
          });
        }
      }

      return def;
    };

    mo.getAncestorWindow = function() {
      var w = window;
      while (w && w.parent && w !== w.parent) {
        w = w.parent;
      }
      return w;
    };

    mo.getAncestorDom = function(child, verifyFunc, /*HTMLElement|Number optional */ maxLoopSizeOrDom) {
      if (child && child.nodeType === 1) {
        if (verifyFunc && typeof verifyFunc === 'function') {
          var maxLoopSize = 100;
          var maxLoopDom = document.body;

          if (maxLoopSizeOrDom) {
            if (typeof maxLoopSizeOrDom === 'number') {
              //Number
              maxLoopSizeOrDom = parseInt(maxLoopSizeOrDom, 10);
              if (maxLoopSizeOrDom > 0) {
                maxLoopSize = maxLoopSizeOrDom;
              }
            } else if (maxLoopSizeOrDom.nodeType === 1) {
              //HTMLElement
              maxLoopDom = maxLoopSizeOrDom;
            }
          }

          var loop = 0;
          while (child.parentNode && loop < maxLoopSize && html.isDescendant(child.parentNode, maxLoopDom)) {
            if (verifyFunc(child.parentNode)) {
              return child.parentNode;
            }
            child = child.parentNode;
            loop++;
          }
        }
      }
      return null;
    };

    mo.bindClickAndDblclickEvents = function(dom, clickCallback, dblclickCallback, /* optional */ _timeout) {
      var handle = null;
      var isValidDom = dom && dom.nodeType === 1;
      var isValidClick = clickCallback && typeof clickCallback === 'function';
      var isValidDblclick = dblclickCallback && typeof dblclickCallback === 'function';
      var isValid = isValidDom && isValidClick && isValidDblclick;
      if (isValid) {
        var timeout = 200;
        if (_timeout && typeof _timeout === 'number') {
          var t = parseInt(_timeout, 10);
          if (t > 0) {
            timeout = t;
          }
        }

        var clickCount = 0;
        handle = on(dom, 'click', function(evt) {
          clickCount++;
          if (clickCount === 1) {
            setTimeout(function() {
              if (clickCount === 1) {
                clickCount = 0;
                clickCallback(evt);
              }
            }, timeout);
          } else if (clickCount === 2) {
            clickCount = 0;
            dblclickCallback(evt);
          }
        });
      }
      return handle;
    };

    mo.isScrollToBottom = function(dom) {
      var box = html.getContentBox(dom);
      var a = dom.scrollTop + box.h;
      var b = dom.scrollHeight - a;
      return b === 0;
    };

    mo.getAllItemTypes = function() {
      var allTypes = [];
      //Web Content
      var maps1 = ['Web Map','Web Scene', 'CityEngine Web Scene'];
      var layers1 = ['Feature Service', 'Map Service', 'Image Service', 'KML', 'WMS', 'Feature Collection', 'Feature Collection Template', 'Geodata Service', 'Globe Service'];
      var tools1 = ['Geometry Service', 'Geocoding Service', 'Network Analysis Service', 'Geoprocessing Service'];
      var applications1 = ['Web Mapping Application', 'Mobile Application', 'Code Attachment', 'Operations Dashboard Add In', 'Operation View'];
      var datafiles1 = ['Symbol Set', 'Color Set', 'Shapefile', 'CSV', 'Service Definition', 'Document Link', 'Microsoft Word', 'Microsoft PowerPoint', 'Microsoft Excel', 'PDF', 'Image', 'Visio Document'];
      //Desktop Content
      var maps2 = ['Map Document', 'Map Package', 'Tile Package', 'ArcPad Package', 'Explorer Map', 'Globe Document', 'Scene Document', 'Published Map', 'Map Template', 'Windows Mobile Package'];
      var layers2 = ['Layer', 'Layer Package', 'Explorer Layer'];
      var tools2 = ['Geoprocessing Package', 'Geoprocessing Sample', 'Locator Package', 'Rule Package'];
      var applications2 = ['Workflow Manager Package', 'Desktop Application', 'Desktop Application Template', 'Code Sample', 'Desktop Add In', 'Explorer Add In'];

      allTypes = allTypes.concat(maps1).concat(layers1).concat(tools1).concat(applications1).concat(datafiles1);
      allTypes = allTypes.concat(maps2).concat(layers2).concat(tools2).concat(applications2);
      return allTypes;
    };

    mo.getItemQueryStringByTypes = function(itemTypes) {
      var queryStr = '';
      var allTypes = mo.getAllItemTypes();
      if (itemTypes && itemTypes.length > 0) {
        // var validTypes = array.filter(itemTypes, function(type) {
        //   return array.indexOf(allTypes, type) >= 0;
        // });
        var validTypes = itemTypes;
        if (validTypes.length > 0) {
          var validStr = '';
          array.forEach(validTypes, function(type, index) {
            var s = ' type:"' + type + '" ';
            validStr += s;
            if (index !== validTypes.length - 1) {
              validStr += ' OR ';
            }
          });
          queryStr = ' ( ' + validStr + ' ) ';
          array.forEach(allTypes, function(type) {
            var s = '';
            if (array.indexOf(validTypes, type) < 0) {
              s = ' -type:"' + type + '" ';
            }
            queryStr += s;
          });
        }
      }
      return queryStr;
    };

    mo.isNotEmptyString = function(str, /* optional */ trim) {
      var b = str && typeof str === 'string';
      if (b) {
        if (trim) {
          return b && lang.trim(str);
        } else {
          return true;
        }
      } else {
        return false;
      }
    };

    mo.isObject = function(o) {
      return o && typeof o === 'object';
    };

    mo.createWebMap = function(portalUrl, itemId, mapDiv, /* optional */ options) {
      var arcgisUrlOld = arcgisUtils.arcgisUrl;
      portalUrl = portalUrlUtils.getStandardPortalUrl(portalUrl);
      var itemUrl = portalUrlUtils.getBaseItemUrl(portalUrl);
      arcgisUtils.arcgisUrl = itemUrl;
      var def = arcgisUtils.createMap(itemId, mapDiv, options);
      arcgisUtils.arcgisUrl = arcgisUrlOld;
      return def;
    };

    mo.getRandomString = function() {
      var str = Math.random().toString();
      str = str.slice(2, str.length);
      return str;
    };

    mo._getDomainsByServerName= function(serverName){
      var splits = serverName.split('.');
      var length = splits.length;
      var domains = array.map(splits, lang.hitch(this, function(v, index){
        var arr = splits.slice(index, length);
        var str = "";
        var lastIndex = arr.length - 1;
        array.forEach(arr, lang.hitch(this, function(s, idx){
          str += s;
          if(idx !== lastIndex){
            str += '.';
          }
        }));
        return str;
      }));
      return domains;
    };

    mo.removeCookie = function(cookieName, path){
      var domains = this._getDomainsByServerName(window.location.hostname);

      array.forEach(domains, lang.hitch(this, function(domainName){
        cookie(cookieName, null, {
          expires: -1,
          path: path
        });

        cookie(cookieName, null, {
          expires: -1,
          path: path,
          domain: domainName
        });

        cookie(cookieName, null, {
          expires: -1,
          path: path,
          domain: '.' + domainName
        });
      }));
    };

    mo.hashToObject = function(hashStr){
      hashStr = hashStr.replace('#', '');
      var hashObj = ioQuery.queryToObject(hashStr);
      for (var p in hashObj) {
        if (hashObj.hasOwnProperty(p)) {
          try {
            hashObj[p] = json.parse(hashObj[p]);
          } catch (err) {
            continue;
          }
        }
      }
      return hashObj;
    };

    mo.reCreateArray = function(obj) {
      //summary:
      //  because of dojo's lang.isArray issue, we need re-create the array properties
      var ret;

      function copyArray(_array) {
        var retArray = [];
        _array.forEach(function(a) {
          if (Array.isArray(a)) {
            retArray.push(copyArray(a));
          } else if (typeof a === 'object') {
            retArray.push(copyObject(a));
          } else {
            retArray.push(a);
          }
        });
        return retArray;
      }

      function copyObject(_obj) {
        var ret = {};
        for (var p in _obj) {
          if (!_obj.hasOwnProperty(p)) {
            continue;
          }
          if (Array.isArray(_obj[p])) {
            ret[p] = copyArray(_obj[p]);
          } else if (typeof _obj[p] === 'object') {
            ret[p] = copyObject(_obj[p]);
          } else {
            ret[p] = _obj[p];
          }
        }
        return ret;
      }

      if (Array.isArray(obj)) {
        ret = copyArray(obj);
      } else {
        ret = copyObject(obj);
      }
      return ret;
    };

    mo.setVerticalCenter = setVerticalCenter;
    mo.merge = merge;
    mo.loadStyleLink = loadStyleLink;

    mo.changeLocation = function(newUrl){
      // debugger;
      if (window.history.pushState) {
        window.history.pushState({path:newUrl},'',newUrl);
      }/*else{
        window.location.href = newUrl;
      }*/
    };

    mo.urlToObject = function(url){
      var ih = url.indexOf('#'),
      obj = null;
      if (ih === -1){
        obj = esriUrlUtils.urlToObject(url);
        obj.hash = null;
      }else {
        var urlParts = url.split('#');
        obj = esriUrlUtils.urlToObject(urlParts[0]);
        obj.hash = urlParts[1] ? (urlParts[1].indexOf('=') > -1 ? ioQuery.queryToObject(urlParts[1]) : urlParts[1]) : null;
      }
      return obj;
    };

    // reset some field of config by template config.
    mo.setConfigByTemplate = function(config, key, value) {
      //config: Object
      //  the destination config object
      //key: String
      //  the key value relative to the config object, like this: app_p1_p2[0], app_p1_p2[1]--

      var keyArray = convertToKeyArray(key);

      var obj = config;
      for (var i = 1; i < keyArray.length - 1; i++) {
        obj = getSubObj(obj, keyArray[i]);
        if (!obj) {
          return;
        }
      }

      if (keyArray[keyArray.length - 1].deleteFlag) {
        if (value === true) {
          if (lang.isArray(obj[keyArray[keyArray.length - 1].key])) {
            //obj[keyArray[keyArray.length - 1].key].splice([keyArray[keyArray.length - 1].index], 1);
            delete obj[keyArray[keyArray.length - 1].key][keyArray[keyArray.length - 1].index];
          } else {
            delete obj[keyArray[keyArray.length - 1].key];
          }
        }
      } else {
        if (lang.isArray(obj[keyArray[keyArray.length - 1].key])) {
          obj[keyArray[keyArray.length - 1].key][keyArray[keyArray.length - 1].index] = value;
        } else {
          obj[keyArray[keyArray.length - 1].key] = value;
        }
      }

      function getSubObj(obj, keyInfo) {
        if (lang.isArray(obj[keyInfo.key])) {
          return obj[keyInfo.key][keyInfo.index];
        } else {
          return obj[keyInfo.key];
        }
      }

      function convertToKeyArray(str) {
        var arrayKey = [];
        str.split('_').forEach(function(str) {
          var deleteFlag = false;
          var pos;
          if (str.slice(str.length - 2) === "--") {
            deleteFlag = true;
            str = str.slice(0, str.length - 2);
          }
          pos = str.search(/\[[0-9]+\]/);
          if (pos === -1) {
            (pos = str.length);
          }
          arrayKey.push({
            "key": str.slice(0, pos),
            "index": Number(str.slice(pos + 1, -1)),
            "deleteFlag": deleteFlag
          });
        });
        return arrayKey;
      }
    };


    return mo;
  });