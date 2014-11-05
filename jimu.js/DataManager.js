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
  'dojo/_base/lang',
  'dojo/topic',
  './WidgetManager'],
  function (declare, lang, topic, WidgetManager) {
  var instance  = null, clazz;

  clazz =  declare(null, {
    constructor: function () {
      topic.subscribe('publishData', lang.hitch(this, this.onDataPublished));
      topic.subscribe('fetcheData', lang.hitch(this, this.onFetchData));
      topic.subscribe('clearAllData', lang.hitch(this, this.onClearAllData));
      topic.subscribe('removeData', lang.hitch(this, this.onRemoveData));

      this.widgetManager = WidgetManager.getInstance();
    },

    //key=widgetid, value=[data]
    _dataStore: {},

    onDataPublished: function (name, id, data, replace) {
      if(typeof replace === 'undefined') {
        replace = true;
      }
      if(!lang.isArray(data)){
        data = [data];
      }
      if(this._dataStore[id] && replace || !this._dataStore[id]) {
        this._dataStore[id] = data;
      } else {
        this._dataStore[id] = this._dataStore[id].concat(data);
      }
    },

    onFetchData: function (id) {
      var w;
      if(id){
        w = this.widgetManager.getWidgetById(id);
        if(w){
          if(this._dataStore[id]) {
            topic.publish('dataFetched', w.name, id, this._dataStore[id]);
          } else {
            topic.publish('noData', w.name, id);
          }
        }else{
          topic.publish('noData', undefined, id);
        }
      }else{
        for(var p in this._dataStore){
          w = this.widgetManager.getWidgetById(p);
          topic.publish('dataFetched', w.name, p, this._dataStore[p]);
        }
      }
    },

    onClearAllData: function(){
      this._dataStore = {};
      topic.publish('allDataCleared');
    },

    onRemoveData: function(id){
      delete this._dataStore[id];
      topic.publish('dataRemoved', id);
    }

  });

  clazz.getInstance = function () {
    if(instance === null) {
      instance = new clazz();
    }
    return instance;
  };
  return clazz;
});