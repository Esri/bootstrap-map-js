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
  'dojo/Deferred'
],
function(declare, Deferred) {
  var mo = {};

  mo.promisifyGetValue = function(inputEditor){
    var oldGetValue = inputEditor.getValue;
    inputEditor.getValue = function(){
      var value = oldGetValue.apply(inputEditor);
      //for now, we use then to check whether the return value is a deferred object
      if(value !== null && value.then){
        return value;
      }else{
        var def = new Deferred();
        def.resolve(value);
        return def;
      }
    };
  };

  return mo;
});