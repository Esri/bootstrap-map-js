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
  "dojo/_base/array",
  "dojo/_base/lang",
  "dojo/Deferred",
  "dojo/promise/all",
  "dojo/string",
  "dojo/when"
], function(array, lang, Deferred, all, string, when) {

  //the context require object that is relative to the module that use the plugin
  var require,

  // plugins must be loaded with window.$ and window.jQuery set
  // to the correct jQuery version instance
  // this object serves as store the exist jquery object. After all plugins are loaded,
  // restore this jquery object.

  // when load more than one modules at the same time that use this loader plugin, we load it by order
  // we use cache be cause the dojo loader will cache the loaded file, which means when the same jquery
  // is loaded two times, only executed one time
  jqueryCache = {},

  loadjQuery = function( /*String*/ jQueryUrl) {
    // summary:
    //      returns a promise to return the requested version
    //      of jQuery 
    //
    // jQueryUrl:
    //      (String) the fully-qualified jQuery URL

    var def = new Deferred();

    if(jqueryCache.locked){
      setTimeout(function(){
        loadjQuery(jQueryUrl);
      }, 50);
      return def;
    }

    if(jqueryCache[jQueryUrl]){
      jqueryCache.locked = true;
      def.resolve(jqueryCache[jQueryUrl]);
      return def;
    }
   
    jqueryCache.locked = true;
    
    // load the jQuery version, run noConflict(), 
    require([jQueryUrl], function() {
      jqueryCache[jQueryUrl] = window.jQuery;
      def.resolve(jqueryCache[jQueryUrl]);
    });

    return def;
  },


  loadPlugin = function(/*String*/ pluginUrls, i, def) {
    // summary:
    //      load the given jQuery plugin into the jQuery object
    
    require([pluginUrls[i]], function() {
      if(i === pluginUrls.length - 1){
        def.resolve();
      }else{
        i ++;
        loadPlugin(pluginUrls, i, def);
      }
    });
  },

  loadPlugins = function( /*String*/ jQueryUrl, /*Array*/ pluginUrls) {
    // summary:
    //      load plugins by order
    var i = 0;
    var def = new Deferred();
    if(!pluginUrls[i]){
      def.resolve();
    }else{
      loadPlugin(pluginUrls, i, def);
    }
    return def;
  },


  jRequire = function(jqueryUrl, plugins) {
    // summary:
    //      Loads a jQuery and then loads each jQuery plugins in sequence. As each plugin
    //      is loaded, the global version of jQuery is set up
    //      with all previously loaded plugins.
    //
    //      The plugins will be loaded or run in sequence as all
    //      previous dependencies become available.
    //
    // jqueryUrl:
    //      (String) the jQuery url to load.
    //
    // plugins:
    //      (Array) an of array of plugin URLs, either absolute or path-relative.
    //

    var def = new Deferred();
    loadjQuery(jqueryUrl).then(function(jQuery){
      loadPlugins(jqueryUrl, plugins).then(function(){
        jqueryCache.locked = false;
        def.resolve(jQuery);
      });
    });
    return def;
  };

  return {
    load: function(id, _require, callback){
      var parts= id.split(","), jqueryUrl, plugins = [];
      require = _require;
      if(parts.length === 0){
        callback(null);
      }else{
        jqueryUrl = parts[0];
        plugins = parts.slice(1);
        when(jRequire(jqueryUrl, plugins), callback);
      }
    }
  };
});