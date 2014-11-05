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

/***
* amd loader plugin which is used to load modules by sequence.
* mainly, this plugin is used to load js files which is not a amd module.
***/
define([
  "dojo/Deferred",
  "dojo/promise/all"
], function(Deferred, all) {
  var require;
  function doLoad(modules){
    var currentIndex = 0, allDefs = [], i, def;
    for(i = 0; i < modules.length; i++){
      def = new Deferred();
      def.module = modules[i];
      allDefs.push(def);
    }

    loadModule(allDefs, currentIndex);

    return allDefs;
  }

  function loadModule(allDefs, currentIndex){
    if(currentIndex + 1 > allDefs.length){
      return;
    }
    require([allDefs[currentIndex].module], function(){
      allDefs[currentIndex].resolve();
      currentIndex ++;
      loadModule(allDefs, currentIndex);
    });
  }
  return {
    load: function(id, _require, callback) {
      var parts = id.split(",");
      require = _require;
      if (parts.length === 0) {
        callback(null);
      } else {
        all(doLoad(parts)).then(function(){
          callback();
        });
      }
    }
  };
});