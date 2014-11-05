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
  'dojo/_base/lang',
  'dojo/topic',
  'dojo/on',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin'
],
  function(declare, lang, topic, on, _WidgetBase, _TemplatedMixin) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div></div>',
    postCreate: function(){
      this.own(on(window, 'resize', lang.hitch(this, this._onWindowResize)));
    },

    getConfig: function(){
      //implemented by sub class, should return the config object.
    },

    setConfig: function(/* jshint unused:false */ config){
      //implemented by sub class, should update the config UI
    },

    resize: function(){

    },

    _onWindowResize: function(){
      this.resize();
    }

  });
});