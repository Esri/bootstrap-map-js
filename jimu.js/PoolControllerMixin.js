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
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/topic',
  'dojo/aspect',
  'dojo/Deferred',
  'jimu/WidgetManager',
  'jimu/PanelManager'
], function(declare, lang, array, html, topic, aspect, Deferred, WidgetManager, PanelManager){
  var clazz = declare(null, {
    // summary:
    //    this mixin process the widgets in the widget pool.
    // description:
    //    the controller widget should have a config object, which has two properties: groups, widgets.
    //    Both of them are optional.
    //groups: String[]|String
    //    If array, is array of gropus label. If String, "all" means read all of the groups.
    //    If not set, do not read any group.
    //widgets: String[]|String
    //    If array, is array of widgets label. If String, "all" means read all of the widgets.
    //    If not set, do not read any widget.

    constructor: function(){
      this.widgetManager = WidgetManager.getInstance();
      this.panelManager = PanelManager.getInstance();
    },

    postCreate: function(){
      //we set default value to 'all', because of most of the time, we have one controller only.
      if(!this.controlledWidgets){
        this.controlledWidgets = 'all';
      }
      if(!this.controlledGroups){
        this.controlledGroups = 'all';
      }
    },


    getOpenedIds: function(){
      //return the Ids the the controller has opened
      //return [];
    },

    setOpenedIds: function(ids){
      /*jshint unused:false*/
      //set the Ids that should be opened
    },

    getConfigById: function(id){
      var allConfigs = this.getAllConfigs();
      for(var i = 0; i < allConfigs.length; i++){
        if(allConfigs[i].id === id){
          return allConfigs[i];
        }
      }
    },

    getAllConfigs: function(){
      var ret = [];
      ret = ret.concat(this.getWidgetConfigs(), this.getGroupConfigs());
      ret = array.filter(ret, function(o){
        return o.visible;
      });
      return ret.sort(function(a, b){
        return a.index - b.index;
      });
    },

    isControlled: function(id){
      return array.some(this.getAllConfigs(), function(config){
        return config.id === id;
      });
    },

    widgetIsControlled: function(widgetId){
      return array.some(this.getAllConfigs(), function(config){
        if(config.id === widgetId){
          return true;
        }else{
          return array.some(config.widgets, function(widgetConfig){
            return widgetConfig.id === widgetId;
          });
        }
      });
    },

    getGroupConfigs: function(){
      var ret = [];
      if(!this.appConfig.widgetPool){
        return ret;
      }
      if(this.appConfig.widgetPool.groups){
        array.forEach(this.appConfig.widgetPool.groups, function(g){
          if(this.controlledGroups){
            if(Array.isArray(this.controlledGroups)){
              if(this.controlledGroups.indexOf(g.label) > -1){
                ret.push(g);
              }
            }else if(this.controlledGroups === 'all'){
              ret.push(g);
            }
          }
        }, this);
      }
      
      return ret;
    },

    getWidgetConfigs: function(){
      var ret = [];
      if(!this.appConfig.widgetPool){
        return ret;
      }
      if(this.appConfig.widgetPool.widgets){
        array.forEach(this.appConfig.widgetPool.widgets, function(w){
          if(this.controlledWidgets){
            if(Array.isArray(this.controlledWidgets)){
              if(this.controlledWidgets.indexOf(w.label) > -1){
                ret.push(w);
              }
            }else if(this.controlledWidgets === 'all'){
              ret.push(w);
            }
          }
        }, this);
      }
      
      return ret;
    }
  });

  return clazz;
});