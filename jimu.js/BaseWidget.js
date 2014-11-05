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
  'dojo/topic',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin'
], function(declare, lang, array, topic, _WidgetBase, _TemplatedMixin){
  var clazz = declare([_WidgetBase, _TemplatedMixin], {
    //listenWidgetNames: String[]
    //    builder uses this property to filter widgets
    listenWidgetNames: [],

    //listenWidgetIds: String[]
    //    app use this property to filter data message, if not set, all message will be received.
    //    this property can be set in config.json
    listenWidgetIds: [],

    //type: String
    //    the value shoulb be widget
    type: 'widget',

    /****these properties can be configured (be overrided) in app's config.json*****/
    //id: String
    //    the unique id of the widget, if not set in the config file, ConfigManager will generate one
    id: undefined,

    //label: String
    //    the display name of the widget
    label: undefined,

    //icon: String
    //    the uri of the icon, use images/icon.png if not set
    icon: undefined,

    //uir: String
    //    used in the config.json to locate where the widget is
    uri: undefined,

    /*======
      //left: int
      //top: int
      //right: int
      //bottom: int
      //width: int
      //height: int
    ======*/
    //    preload widget should config position property if it's not in group.
    //    the meaning of the property is the same as of the CSS
    position: {},
    
    //config: Object|String
    //    config info in config.json, url or json object
    //    if url is configured in the config.json, json file is parsed and stored in this property
    config: undefined,

    //defaultState: Boolean
    openAtStart: false,
    
    /***************************************************************/

    /*********these properties is set by the framework**************/
    //map: esri/Map|esri3d/Map
    map: null,

    //appConfig: Object
    //    the app's config.json
    appConfig: null,

    //folderUrl: String
    //    the folder url of the widget
    folderUrl: null,

    //state: String
    //    the current state of the widget, the available states are: opened, closed, active(TBD, when widget get focus)
    state: 'closed',

    //windowState: String
    //    the available states are normal, minimized, maximized
    windowState: 'normal',

    //started: boolean
    //    whether the widget has started
    started: false,

    //name: String
    //    the name is used to identify the widget. The name is the same as the widget folder name
    name: '',
    /***************************************************************/

    /*********these properties is set by the developer**************/

    //baseClass: String
    //    HTML CSS class name
    baseClass: null,

    //templateString: String
    //    widget UI part, the content of the file Widget.html will be set to this property
    templateString: '<div></div>',
    
    /***************************************************************/

    constructor: function(){
      this.listenWidgetClassNames = [];
      this.listenWidgetIds = [];
      this.own(topic.subscribe('publishData', lang.hitch(this, this._onReceiveData)));
      this.own(topic.subscribe('dataFetched', lang.hitch(this, this._onReceiveData)));
      this.own(topic.subscribe('noData', lang.hitch(this, this._onNoData)));
    },

    onOpen: function(){
      // summary:
      //    this function will be called when widget is opened everytime.
      // description:
      //    state has been changed to "opened" when call this method.
      //    this function will be called in two cases:
      //      1. after widget's startup
      //      2. if widget is closed, use re-open the widget
    },

    onClose: function(){
      // summary:
      //    this function will be called when widget is closed.
      // description:
      //    state has been changed to "closed" when call this method.
    },

    onNormalize: function(){
      // summary:
      //    this function will be called when widget window is normalized.
      // description:
      //    windowState has been changed to "normal" when call this method.
    },

    onMinimize: function(){
      // summary:
      //    this function will be called when widget window is minimized.
      // description:
      //    windowState has been changed to "minimized" when call this method.
    },

    onMaximize: function(){
      // summary:
      //    this function will be called when widget window is maximized.
      // description:
      //    windowState has been changed to "maximized" when call this method.
    },


    onSignIn: function(credential){
      // summary:
      //    this function will be called after user sign in.

      /*jshint unused: false*/
    },

    onSignOut: function(){
      // summary:
      //    this function will be called after user sign in.
    },

    onPositionChange: function(position){
      //summary:
      //  this function will be called when position change, widget's position will be changed when layout change
      //  the position object may contain w/h/t/l/b/r
      this.position = position;
    },

    setMap: function( /*esri.Map*/ map){
      this.map = map;
    },

    setState: function(state){
      this.state = state;
    },

    setWindowState: function(state){
      this.windowState = state;
    },

    resize: function(){
    },

    //these three methods are used by builder.
    onConfigChanged: function(config){
      /*jshint unused: false*/
    },

    onAppConfigChanged: function(appConfig, reason, changedData){
      /*jshint unused: false*/
    },

    onAction: function(action, data){
      /*jshint unused: false*/
    },

    publishData: function(data, replace){
      /*jshint unused: false*/
      if(typeof replace === 'undefined'){
        //replace the exist data by default.
        replace = true;
      }
      topic.publish('publishData', this.name, this.id, data, replace);
    },

    fetchData: function(widgetId){
      if(widgetId){
        topic.publish('fetcheData', widgetId);
      }else{
        if(this.listenWidgetIds.length !== 0){
          array.forEach(this.listenWidgetIds, function(widgetId){
            topic.publish('fetcheData', widgetId);
          }, this);
        }else{
          topic.publish('fetcheData');
        }
      }
    },

    _onReceiveData: function(name, widgetId, data){
      //the data is what I published
      if(name === this.name || widgetId === this.id){
        return;
      }
      //I am not interesting on the the widget id
      if(this.listenWidgetIds.length !== 0 && this.listenWidgetIds.indexOf(widgetId) < 0){
        return;
      }
      this.onReceiveData(name, widgetId, data);
    },

    onReceiveData: function(name, widgetId, data){
      /* jshint unused: false */
      // console.log('onReceiveData: ' + name + ',' + widgetId + ',data:' + data);
    },

    _onNoData: function(name, widgetId){
      /*jshint unused: false*/
      if(this.listenWidgetIds.length !== 0 && this.listenWidgetIds.indexOf(widgetId) < 0){
        return;
      }
      this.onNoData(name, widgetId);
    },

    onNoData: function(name, widgetId){
      /*jshint unused: false*/
    }
  });
  return clazz;
});