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
  'jimu/BaseTokenUtils',
  'dojo/topic',
  'dojo/aspect',
  'dojo/_base/lang'
],
function(BaseTokenUtils, topic, aspect, lang) {
  /*jshint -W069 */

  var mo = new BaseTokenUtils();

  //note: mo.portalUrl point to appConfig.portalUrl,not builder window.portalUrl

  var appConfig = null;//new attribute

  mo.declaredClass = 'jimu.TokenUtils';// new attribute

  //new method
  mo.getAppConfig = function() {
    return appConfig;
  };

  //new method
  mo.setAppConfig = function(_appConfig) {
    appConfig = lang.mixin({}, _appConfig);
    this.setPortalUrl(appConfig.portalUrl);
  };

  //override method
  mo.isRightWindowScope = function(){
    return !this.isInBuilderWindow();
  };

  //override method
  mo.getAppMode = function(){
    var mode = '';
    if(appConfig){
      mode = appConfig.mode;
    }
    return mode;
  };

  //override method
  mo.tryPublishUserSignInToExternal = function(credential) {
    if(!this.isRightWindowScope()){
      return;
    }

    var mode = this.getAppMode();
    if (mode === 'config') {
      topic.publish('configUserSignIn', credential);
    } else if (mode === 'preview') {
      topic.publish('previewUserSignIn', credential);
    }
  };

  //override method
  mo.tryPublishUserSignOutToExternal = function(_portalUrl) {
    if(!this.isRightWindowScope()){
      return;
    }

    var mode = this.getAppMode();
    if (mode === 'config') {
      topic.publish('configUserSignOut', _portalUrl);
    } else if (mode === 'preview') {
      topic.publish('previewUserSignOut', _portalUrl);
    }
  };

  //new method
  mo.bindEvents = function(){
    if(!this._bind && !this.isRightWindowScope()){
      return;
    }

    this._bind = true;

    this._bindEvents();

    //appConfig events
    topic.subscribe('appConfigLoaded', lang.hitch(this, function(_appConfig){
      if(!this.isRightWindowScope()){
        return;
      }
      this.setAppConfig(_appConfig);
    }));

    topic.subscribe('appConfigChanged', lang.hitch(this, function(_appConfig){
      if(!this.isRightWindowScope()){
        return;
      }
      this.setAppConfig(_appConfig);
    }));
  };

  mo.startup();

  return mo;
});