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
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/Deferred',
    'dojo/topic',
    'dojo/aspect',
    'dojo/on',
    'dojo/request/xhr',
    'dojo/i18n',
    'dojo/promise/all',
    'dojo/query',
    'dojo/NodeList-traverse',
    'dojo/dom-geometry',
    'dojo/dom-style',
    'esri/request',
    './utils',
    'jimu/tokenUtils',
    './dijit/Message'
  ],
  function(declare, lang, array, html, Deferred, topic, aspect, on, xhr, i18n,
    all, query, nlt, domGeometry, domStyle, esriRequest, utils, tokenUtils, Message) {
    var instance = null,
      clazz = declare(null, {

        constructor: function() {
          //the loaded widget list
          this.loaded = [];

          //action is triggered, but the widget has not been loaded
          //{id: widgetId, action: {}}
          this.missedActions = [];

          topic.subscribe("appConfigLoaded", lang.hitch(this, this._onAppConfigLoaded));
          topic.subscribe("appConfigChanged", lang.hitch(this, this._onAppConfigChanged));

          topic.subscribe("mapLoaded", lang.hitch(this, this._onMapLoaded));
          topic.subscribe("mapChanged", lang.hitch(this, this._onMapChanged));

          topic.subscribe('userSignIn', lang.hitch(this, this._onUserSignIn));
          topic.subscribe('userSignOut', lang.hitch(this, this._onUserSignOut));

          //events from builder
          topic.subscribe('actionTriggered', lang.hitch(this, this._onActionTriggered));
        },

        loadWidget: function(setting) {
          // summary:
          //    load and create widget, return deferred. when defer is resolved,
          //    widget is returned.
          // description:
          //    setting should contain 2 properties:
          //    id: id should be unique, same id will return same widget object.
          //    uri: the widget's main class

          var def = new Deferred(),
            findWidget;

          setting = lang.clone(setting);
          if (!setting.folderUrl) {
            utils.processWidgetSetting(setting);
          }

          findWidget = this.getWidgetById(setting.id);

          if (findWidget) {
            //widget have loaded(identified by id)
            def.resolve(findWidget);
          } else {
            all([this.loadWidgetClass(setting)])
              .then(lang.hitch(this, function(results) {
                var clazz = results[0];
                this.loadWidgetResources(setting).then(lang.hitch(this, function(resouces) {
                  try {
                    var widget = this.createWidget(setting, clazz, resouces);
                    console.log('widget [' + setting.uri + '] created.');
                  } catch (err) {
                    console.log('create [' + setting.uri + '] error:' + err.stack);
                    new Message({
                      message: 'create widget error: ' + setting.uri
                    });
                    def.reject(err);
                  }

                  //use timeout to let the widget can get the correct dimension in startup function
                  setTimeout(function() {
                    def.resolve(widget);
                  }, 50);

                }), function(err) {
                  def.reject(err);
                });
              }), function(err) {
                def.reject(err);
              });
          }
          return def;
        },

        loadWidgetClass: function(setting) {
          // summary:
          //    load the widget's main class, and return deferred
          var def = new Deferred();

          require(utils.getRequireConfig(), [setting.uri], lang.hitch(this, function(clazz) {
            def.resolve(clazz);
          }));

          utils.checkError(setting.uri, def);
          return def;
        },

        loadWidgetResources: function(setting) {
          // summary:
          //    load the widget's resources(local, style, etc.), and return deferred

          var def = new Deferred(),
            defConfig, defI18n, defStyle, defTemplate, defs = [];

          var setting2 = lang.clone(setting);

          defConfig = this.tryLoadWidgetConfig(setting2);
          defI18n = this._tryLoadResource(setting2, 'i18n');
          defStyle = this._tryLoadResource(setting2, 'style');
          defTemplate = this._tryLoadResource(setting2, 'template');

          defs.push(defConfig);
          defs.push(defI18n);
          defs.push(defTemplate);
          defs.push(defStyle);

          all(defs).then(lang.hitch(this, function(results) {
            var res = {};
            res.config = results[0];
            res.i18n = results[1];
            res.template = results[2];
            res.style = results[3];
            def.resolve(res);
          }), function(err) {
            def.reject(err);
          });

          return def;
        },

        createWidget: function(setting, clazz, resouces) {
          var widget;

          //here, check whether widget have loaded again because loading and create a widget
          //needs some time. If in this period time, more then one loading request will create
          //more widgets with the same id, it's a error.

          if (this.getWidgetById(setting.id)) {
            return this.getWidgetById(setting.id);
          }

          //the config can contain i18n placeholders
          if (resouces.config && resouces.i18n) {
            resouces.config = utils.replacePlaceHolder(resouces.config, resouces.i18n);
          }

          setting.rawConfig = setting.config;
          setting.config = resouces.config || {};
          if (this.appConfig.agolConfig) {
            this._mergeAgolConfig(setting);
          }
          setting.nls = resouces.i18n || {};
          if (resouces.template) {
            setting.templateString = resouces.template;
          }

          setting['class'] = 'jimu-widget';
          if (!setting.label) {
            setting.label = setting.name;
          }
          if (this.map) {
            setting.map = this.map;
          }
          setting.appConfig = this.appConfig;

          // for IE8 
          var setting2 = {};
          for (var prop in setting) {
            if (setting.hasOwnProperty(prop)) {
              setting2[prop] = setting[prop];
            }
          }

          widget = new clazz(setting2);
          widget.clazz = clazz;
          aspect.after(widget, 'startup', lang.hitch(this, this._postWidgetStartup, widget));
          aspect.before(widget, 'destroy', lang.hitch(this, this._onDestroyWidget, widget));
          this.loaded.push(widget);
          return widget;
        },

        getAllWidgets: function() {
          return this.loaded;
        },

        destroyAllWidgets: function() {
          var allWidgetIds = array.map(this.loaded, function(widget) {
            return widget.id;
          });
          array.forEach(allWidgetIds, function(widgetId) {
            this.destroyWidget(widgetId);
          }, this);
          this.loaded = [];
        },

        //load the widget setting page class and create setting page object
        //do not cache for now.
        loadWidgetSettingPage: function(setting) {
          var def = new Deferred();
          setting = lang.clone(setting);

          setting.id = setting.id + '_setting';
          all([this.loadWidgetSettingClass(setting)]).
          then(lang.hitch(this, function(results) {
            var clazz = results[0];

            this.loadWidgetSettingPageResources(setting).then(lang.hitch(this, function(resources) {
              var settingObject; // style = results[2]

              // for IE8
              var setting2 = {
                nls: resources.i18n,
                templateString: resources.template,
                appConfig: this.appConfig,
                map: this.map,
                'class': 'jimu-widget-setting'
              };
              for (var prop in setting) {
                if (setting.hasOwnProperty(prop)) {
                  setting2[prop] = setting[prop];
                }
              }
              try {
                settingObject = new clazz(setting2);
                aspect.before(settingObject, 'destroy', lang.hitch(this, this._onDestroyWidgetSetting, settingObject));
                def.resolve(settingObject);
              } catch (err) {
                new Message({
                  message: 'Create widget setting page error:' + setting.uri
                });
                def.reject(err);
              }
            }), function(err) {
              console.log(err);
            });

          }), function(err) {
            def.reject(err);
          });
          return def;
        },

        loadWidgetSettingClass: function(setting) {
          // summary:
          //    load the widget's main class, and return deferred
          var def = new Deferred();

          require(utils.getRequireConfig(), [setting.folderUrl + 'setting/Setting.js'], lang.hitch(this, function(clazz) {
            def.resolve(clazz);
          }));

          utils.checkError(setting.folderUrl + 'setting/Setting.js', def);
          return def;
        },

        loadWidgetSettingPageResources: function(setting) {
          var def = new Deferred();
          var defI18n, defStyle, defTemplate, defs = [];

          setting = lang.clone(setting);
          defI18n = this._tryLoadResource(setting, 'settingI18n');
          defTemplate = this._tryLoadResource(setting, 'settingTemplate');
          defStyle = this._tryLoadResource(setting, 'settingStyle');

          defs.push(defI18n);
          defs.push(defTemplate);
          defs.push(defStyle);

          all(defs).then(lang.hitch(this, function(results) {
            var res = {};
            res.i18n = results[0] || {};
            res.template = results[1];
            res.style = results[2];
            def.resolve(res);
          }), function(err) {
            console.log(err);
          });

          return def;
        },

        getWidgetById: function(id) {
          var ret;
          array.some(this.loaded, function(w) {
            if (w.id === id) {
              ret = w;
              return true;
            }
          }, this);
          return ret;
        },


        //normal, minimized, maximized
        changeWindowStateTo: function(widget, state) {
          if (state === 'normal') {
            this.normalizeWidget(widget);
          } else if (state === 'minimized') {
            this.minimizeWidget(widget);
          } else if (state === 'maximized') {
            this.maximizeWidget(widget);
          } else {
            console.log('error state: ' + state);
          }
        },

        closeWidget: function(widget) {
          if (typeof widget === 'string') {
            widget = this.getWidgetById(widget);
            if (!widget) {
              return;
            }
          }
          if (widget.state !== 'closed') {
            widget.setState('closed');
            try {
              widget.onClose();
            } catch (err) {
              console.log(console.error('fail to close widget ' + widget.name + '. ' + err.stack));
            }
          }
        },

        openWidget: function(widget) {
          if (typeof widget === 'string') {
            widget = this.getWidgetById(widget);
            if (!widget) {
              return;
            }
          }
          if (widget.state === 'closed') {
            widget.setState('opened');
            try {
              widget.onOpen();
            } catch (err) {
              console.log(console.error('fail to open widget ' + widget.name + '. ' + err.stack));
            }
          }
        },

        maximizeWidget: function(widget) {
          if (typeof widget === 'string') {
            widget = this.getWidgetById(widget);
            if (!widget) {
              return;
            }
          }
          if (widget.state === 'closed') {
            this.openWidget(widget);
          }

          widget.setWindowState('maximized');
          try {
            widget.onMaximize();
          } catch (err) {
            console.log(console.error('fail to maximize widget ' + widget.name + '. ' + err.stack));
          }
        },

        minimizeWidget: function(widget) {
          if (typeof widget === 'string') {
            widget = this.getWidgetById(widget);
            if (!widget) {
              return;
            }
          }

          if (widget.state === 'closed') {
            this.openWidget(widget);
          }
          widget.setWindowState('minimized');
          try {
            widget.onMinimize();
          } catch (err) {
            console.log(console.error('fail to minimize widget ' + widget.name + '. ' + err.stack));
          }
        },

        normalizeWidget: function(widget) {
          if (typeof widget === 'string') {
            widget = this.getWidgetById(widget);
            if (!widget) {
              return;
            }
          }

          if (widget.state === 'closed') {
            this.openWidget(widget);
          }
          widget.setWindowState('normal');
          try {
            widget.onNormalize();
          } catch (err) {
            console.log(console.error('fail to normalize widget ' + widget.name + '. ' + err.stack));
          }
        },

        destroyWidget: function(widget) {
          var m;
          if (typeof widget === 'string') {
            m = this.getWidgetById(widget);
            if (!m) {
              //maybe, the widget is loading
              return;
            } else {
              widget = m;
            }
          }
          this._removeWidget(widget);
          try {
            widget.destroy();
          } catch (err) {
            console.log(console.error('fail to destroy widget ' + widget.name + '. ' + err.stack));
          }
        },

        tryLoadWidgetConfig: function(setting) {
          var def = new Deferred();
          //need load config first, because the template may be use the config data
          if (setting.config && lang.isObject(setting.config)) {
            //if widget is configurated in the app config.json, the i18n has beed processed
            def.resolve(setting.config);
            return def;
          } else if (setting.config) {
            return xhr(setting.config, {
              handleAs: "json"
            });
          } else {
            return this._tryLoadResource(setting, 'config');
          }
        },

        /*
         * Load the css file in a widget.
         * This function load the widget's css file and insert it into the HTML page through <link>.
         * It also ensure that the css file is inserted only one time.
         */
        loadWidgetStyle: function(widgetSetting) {
          var id = 'widget/style/' + widgetSetting.uri,
            def = new Deferred();
          id = this._replaceId(id);
          if (html.byId(id)) {
            def.resolve('load');
            return def;
          }
          return utils.loadStyleLink(id, widgetSetting.styleFile);
        },

        loadWidgetSettingStyle: function(widgetSetting) {
          var id = 'widget/style/' + widgetSetting.uri + '/setting',
            def = new Deferred();
          id = this._replaceId(id);
          if (html.byId(id)) {
            def.resolve('load');
            return def;
          }
          return utils.loadStyleLink(id, widgetSetting.settingStyleFile);
        },

        loadWidgetConfig: function(widgetSetting) {
          return xhr(widgetSetting.configFile, {
            handleAs: "json"
          });
        },

        loadWidgetI18n: function(widgetSetting) {
          var def = new Deferred(),
            i18nFile, widget, locale = this.appConfig.locale;
          i18nFile = widgetSetting.amdFolder + 'nls/strings';
          widget = widgetSetting.amdFolder;
          require(utils.getRequireConfig(), ['dojo/i18n!' + i18nFile], function() {
            var nls = i18n.getLocalization(widget, widgetSetting.i18nFile, locale);
            def.resolve(nls);
          });

          utils.checkError(i18nFile, def);
          return def;
        },

        loadWidgetSettingI18n: function(widgetSetting) {
          var def = new Deferred(),
            i18nFile, widget, locale = this.appConfig.locale;
          i18nFile = widgetSetting.amdFolder + 'setting/nls/strings';
          widget = widgetSetting.amdFolder;
          require(utils.getRequireConfig(), [i18nFile], function() {
            var nls = i18n.getLocalization(widget + 'setting/', widgetSetting.settingI18nFile, locale);
            def.resolve(nls);
          });

          utils.checkError(i18nFile, def);
          return def;
        },

        loadWidgetTemplate: function(widgetSetting) {
          var def = new Deferred();
          require(utils.getRequireConfig(), ['dojo/text!' + widgetSetting.templateFile], function(template) {
            def.resolve(template);
          });

          utils.checkError(widgetSetting.templateFile, def);
          return def;
        },

        loadWidgetSettingTemplate: function(widgetSetting) {
          var def = new Deferred();
          require(utils.getRequireConfig(), ['dojo/text!' + widgetSetting.settingTemplateFile], function(template) {
            def.resolve(template);
          });

          utils.checkError(widgetSetting.settingTemplateFile, def);
          return def;
        },

        removeWidgetStyle: function(widget) {
          html.destroy(this._replaceId('widget/style/' + widget.uri));
        },

        removeWidgetSettingStyle: function(widget) {
          html.destroy(this._replaceId('widget/style/' + widget.uri + '/setting'));
        },

        getControllerWidgets: function() {
          return array.filter(this.loaded, function(widget) {
            return widget.isController;
          });
        },

        getPreloadPanelessWidgets: function() {
          return array.filter(this.loaded, function(widget) {
            return widget.isPreload && !widget.inPanel;
          });
        },

        _mergeAgolConfig: function(setting) {
          var i, j;

          function doMerge(values, preKey) {
            for (var key in values) {
              if (key.startWith(preKey)) {
                utils.setConfigByTemplate(setting.config, key.substr(preKey.length, key.length), values[key]);
              }
            }
          }

          if (this.appConfig.widgetOnScreen) {
            if (this.appConfig.widgetOnScreen.groups) {
              for (i = 0; i < this.appConfig.widgetOnScreen.groups.length; i++) {
                for (j = 0; j < this.appConfig.widgetOnScreen.groups[i].widgets.length; j++) {
                  if (this.appConfig.widgetOnScreen.groups[i].widgets[j].label === setting.label) {
                    doMerge(this.appConfig.agolConfig.values, 'app_preloadWidgets_groups[' + i + ']_widgets[' + j + ']_');
                    return;
                  }
                }
              }
            }

            if (this.appConfig.widgetOnScreen.widgets) {
              for (i = 0; i < this.appConfig.widgetOnScreen.widgets.length; i++) {
                if (this.appConfig.widgetOnScreen.widgets[i].label === setting.label) {
                  doMerge(this.appConfig.agolConfig.values, 'app_preloadWidgets_widgets[' + i + ']_');
                  return;
                }
              }
            }
          }

          if (this.appConfig.widgetPool) {
            if (this.appConfig.widgetPool.groups) {
              for (i = 0; i < this.appConfig.widgetPool.groups.length; i++) {
                for (j = 0; j < this.appConfig.widgetPool.groups[i].widgets.length; j++) {
                  if (this.appConfig.widgetPool.groups[i].widgets[j].label === setting.label) {
                    doMerge(this.appConfig.agolConfig.values, 'app_widgetPool_groups[' + i + ']_widgets[' + j + ']_');
                    return;
                  }
                }
              }
            }

            if (this.appConfig.widgetPool.widgets) {
              for (i = 0; i < this.appConfig.widgetPool.widgets.length; i++) {
                if (this.appConfig.widgetPool.widgets[i].label === setting.label) {
                  doMerge(this.appConfig.agolConfig.values, 'app_widgetPool_widgets[' + i + ']_');
                  return;
                }
              }
            }
          }
        },

        _onUserSignIn: function(credential) {
          array.forEach(this.loaded, function(m) {
            m.onSignIn(credential);
          }, this);
        },

        _onUserSignOut: function() {
          array.forEach(this.loaded, function(m) {
            m.onSignOut();
          }, this);
        },

        _onAppConfigLoaded: function(_appConfig) {
          var appConfig = lang.clone(_appConfig);
          this.appConfig = appConfig;
          tokenUtils.setPortalUrl(appConfig.portalUrl);
        },

        _onMapLoaded: function(map) {
          this.map = map;
        },

        _onMapChanged: function(map) {
          this.map = map;
        },

        _onAppConfigChanged: function(_appConfig, reason, changedData, otherOptions) {
          var appConfig = lang.clone(_appConfig);
          this.appConfig = appConfig;
          array.forEach(this.loaded, function(w) {
            if (!w) {
              //widget maybe deleted in the handler of appConfigChange event
              return;
            }
            w.onAppConfigChanged(appConfig, reason, changedData, otherOptions);
            if (reason === 'widgetChange') {
              this._onConfigChanged(changedData.id, changedData.config, otherOptions);
            }
            w.appConfig = appConfig;
          }, this);
        },

        _onConfigChanged: function(id, config) {
          //summary:
          //  widget which care it's own config change should override onConfigChanged function
          var w = this.getWidgetById(id);
          if (!w) {
            return;
          }

          w.onConfigChanged(config);
          lang.mixin(w.config, config);
        },

        _onActionTriggered: function(id, action, data) {
          if (id === 'map' || id === 'app') {
            return;
          }
          var m = this.getWidgetById(id);
          if (!m) {
            this.missedActions.push({
              id: id,
              action: {
                name: action,
                data: data
              }
            });
          } else {
            m.onAction(action, data);
          }
          //may be the controller widget also need process the action 
          array.forEach(this.getControllerWidgets(), function(ctrlWidget) {
            if (ctrlWidget.widgetIsControlled(id)) {
              ctrlWidget.onAction(action, {
                widgetId: id,
                data: data
              });
            }
          }, this);
        },

        _postWidgetStartup: function(widgetObject) {
          widgetObject.started = true;
          utils.setVerticalCenter(widgetObject.domNode);
          aspect.after(widgetObject, 'resize', lang.hitch(this, utils.setVerticalCenter, widgetObject.domNode));
          this.openWidget(widgetObject);
          // if(widgetObject.defaultState){
          //   this.changeWindowStateTo(widgetObject, widgetObject.defaultState);
          // }

          var portalUrl = this.appConfig.portalUrl;
          var credential = tokenUtils.getPortalCredential(portalUrl);
          if (credential) {
            widgetObject.onSignIn(credential);
          } else {
            widgetObject.onSignOut();
          }
          this._triggerMissedAction(widgetObject);
        },

        _triggerMissedAction: function(widget) {
          this.missedActions.forEach(function(info) {
            if (info.id === widget.id) {
              widget.onAction(info.action.name, info.action.data);
            }
          });
        },

        _remove: function(id) {
          return array.some(this.loaded, function(w, i) {
            if (w.id === id) {
              this.loaded.splice(i, 1);
              return true;
            }
          }, this);
        },

        _tryLoadResource: function(setting, flag) {
          var file, hasp,
            def = new Deferred(),
            doLoad = function() {
              var loadDef;
              if (flag === 'config') {
                loadDef = this.loadWidgetConfig(setting);
              } else if (flag === 'style') {
                loadDef = this.loadWidgetStyle(setting);
              } else if (flag === 'i18n') {
                loadDef = this.loadWidgetI18n(setting);
              } else if (flag === 'template') {
                loadDef = this.loadWidgetTemplate(setting);
              } else if (flag === 'settingTemplate') {
                loadDef = this.loadWidgetSettingTemplate(setting);
              } else if (flag === 'settingStyle') {
                loadDef = this.loadWidgetSettingStyle(setting);
              } else if (flag === 'settingI18n') {
                loadDef = this.loadWidgetSettingI18n(setting);
              } else {
                return def;
              }
              loadDef.then(function(data) {
                def.resolve(data);
              }, function(err) {
                new Message({
                  message: 'load widget resouce error: ' + setting.uri
                });
                def.reject(err);
              });
            };

          if (flag === 'config') {
            file = setting.folderUrl + 'config.json';
            setting.configFile = file;
            hasp = 'hasConfig';
          } else if (flag === 'style') {
            file = setting.folderUrl + 'css/style.css';
            setting.styleFile = file;
            hasp = 'hasStyle';
          } else if (flag === 'i18n') {
            file = setting.folderUrl + 'nls/strings.js';
            setting.i18nFile = 'strings';
            hasp = 'hasLocale';
          } else if (flag === 'template') {
            file = setting.folderUrl + 'Widget.html';
            setting.templateFile = file;
            hasp = 'hasUIFile';
          } else if (flag === 'settingTemplate') {
            file = setting.folderUrl + 'setting/Setting.html';
            setting.settingTemplateFile = file;
            hasp = 'hasSettingUIFile';
          } else if (flag === 'settingI18n') {
            file = setting.folderUrl + 'setting/nls/strings.js';
            setting.settingI18nFile = 'strings';
            hasp = 'hasSettingLocale';
          } else if (flag === 'settingStyle') {
            file = setting.folderUrl + 'setting/css/style.css';
            setting.settingStyleFile = file;
            hasp = 'hasSettingStyle';
          } else {
            return def;
          }

          if (setting[hasp] === false) {
            def.resolve(null);
          } else if (setting[hasp] === true) {
            doLoad.apply(this);
          } else {
            utils.checkFileExist(file).then(lang.hitch(this, function(exist) {
              if (exist) {
                doLoad.apply(this);
              } else {
                def.resolve(null);
              }
            }));
          }
          return def;
        },

        _replaceId: function(id) {
          return id.replace(/\//g, '_').replace(/\./g, '_');
        },

        _onDestroyWidget: function(widget) {
          if (widget.state !== 'closed') {
            this.closeWidget(widget);
          }
          this._removeWidget(widget);
          console.log('destroy widget [' + widget.uri + '].');
        },

        _onDestroyWidgetSetting: function(settingWidget) {
          this.removeWidgetSettingStyle(settingWidget);
        },

        _removeWidget: function(widget) {
          var m;
          if (typeof widget === 'string') {
            m = this.getWidgetById(widget);
            if (!m) {
              //maybe, the widget is loading
              return;
            } else {
              widget = m;
            }
          }
          this.removeWidgetStyle(widget);
          this._remove(widget.id);
        }
      });

    clazz.getInstance = function(urlParams) {
      if (instance === null) {
        instance = new clazz(urlParams);
      }
      return instance;
    };
    return clazz;
  });