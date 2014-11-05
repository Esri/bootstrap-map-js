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
  'dojo/on',
  'dojo/aspect',
  'dojo/Deferred',
  'dojo/cookie',
  'dojo/json',
  'dojo/topic',
  'esri/request',
  'esri/IdentityManager',
  'esri/Credential',
  'esri/arcgis/OAuthInfo',
  'jimu/portalUrlUtils',
  'jimu/utils'
],
function(declare ,lang, array, on, aspect, Deferred, cookie, json, topic, esriRequest,
  IdentityManager, Credential, OAuthInfo, portalUrlUtils, jimuUtils) {
  /*jshint -W069 */

  //patch for JS API 3.10
  var hasMethod = typeof cookie.getAll === 'function';
  if(!hasMethod){
    cookie.getAll = function(e){
      var result = [];
      var v = cookie(e);
      if(v){
        result.push(v);
      }
      return result;
    };
  }

  //events:
  //anyUserSignIn: any user sign in, including portal user and arcgis server user
  //userSignIn: current portal user sign in
  //userSignOut: current portal user sign out
  //externalUserSignOut: any portal user sign out in another window
  //externalUserSignIn: any user sign in in another window, including portal user and arcgis server user

  //return a function, not object
  return declare([], {
    portalUrl: null,
    cookiePath: '/',
    _started: false,

    //public methods:
    //isInBuilderWindow
    //isInStemappWindow
    //isInDeployedAppWindow
    //isRightWindowScope
    //signInPortal
    //signOutPortal
    //userHaveSignInPortal
    //isValidCredential
    //isValidPortalCredentialOfPortalUrl
    //getPortalCredential
    //getUserIdByToken
    //xtGetCredentialFromCookie
    //isStart
    //startup

    //need to be overrided
    isRightWindowScope: function(){},

    isInBuilderWindow: function(){
      return !!(window.isBuilder);
    },

    isInStemappWindow: function(){
      var b = !window.isBuilder && window.parent && window.parent !== window && window.parent.isBuilder;
      return !!b;
    },

    isInDeployedAppWindow: function(){
      return !this.isInBuilderWindow() && !this.isInStemappWindow();
    },

    isRunInPortal: function(){
      return window.isRunInPortal;
      // var testPortalUrl = portalUrlUtils.getPortalUrlFromLocation();
      // var mainPortalUrl = this.portalUrl;
      // return portalUrlUtils.isSamePortalUrl(testPortalUrl, mainPortalUrl);
    },

    isStringStartWith: function(str, prefix){
      return str.substr(0, prefix.length) === prefix;
    },

    getCookiePath: function() {
      return this.cookiePath;
    },

    setPortalUrl: function(_portalUrl) {
      var thePortalUrl = portalUrlUtils.getStandardPortalUrl(_portalUrl);
      if (thePortalUrl) {
        thePortalUrl += '/';
      }
      this.portalUrl = thePortalUrl;
    },

    getPortalUrl: function() {
      return this.portalUrl;
    },

    tryRegisterCredential: function( /* esri.Credential */ credential) {
      if(!this.isValidCredential(credential)){
        return false;
      }
      
      var isExist = array.some(IdentityManager.credentials, lang.hitch(this, function(c) {
        return credential.token === c.token;
      }));

      if (!isExist) {
        IdentityManager.credentials.push(credential);
        return true;
      }

      return false;
    },

    _isInvalidPortalUrl: function(s){
      return s && typeof s === 'string' && lang.trim(s);
    },

    signInPortal: function(_portalUrl){
      var def = new Deferred();
      
      if(!this._isInvalidPortalUrl(_portalUrl)){
        setTimeout(lang.hitch(this, function(){
          def.reject("Invalid portalurl.");
        }), 0);
      }
      else{
        var thePortalUrl = portalUrlUtils.getStandardPortalUrl(_portalUrl);
        var sharingUrl = portalUrlUtils.getSharingUrl(thePortalUrl);
        var credential = this.getPortalCredential(thePortalUrl);
        if(credential){
          setTimeout(lang.hitch(this, function(){
            def.resolve(credential);
          }), 0);
        }
        else{
          def = IdentityManager.getCredential(sharingUrl);
        }
      }

      return def;
    },

    _loadPortalSelfInfo: function(_portalUrl){
      var portalSelfUrl = portalUrlUtils.getPortalSelfInfoUrl(_portalUrl);
      return esriRequest({
        url: portalSelfUrl,
        handleAs: 'json',
        content: {f:'json'},
        callbackParamName: 'callback'
      });
    },

    registerOAuthInfo: function(portalUrl, appId){
      var oAuthInfo = IdentityManager.findOAuthInfo(portalUrl);
      if(!oAuthInfo){
        var oauthReturnUrl = window.location.protocol + "//" + window.location.host + require.toUrl("jimu") + "/oauth-callback.html";
        oAuthInfo = new OAuthInfo({
          appId: appId,
          expiration: 14 * 24 * 60,
          portalUrl: portalUrl,
          authScope: '/',
          popup: true,
          popupCallbackUrl: oauthReturnUrl
        });
        IdentityManager.registerOAuthInfos([oAuthInfo]);
      }
      oAuthInfo.appId = appId;
      return oAuthInfo;
    },

    signOutAll: function(){
      var portalUrl = portalUrlUtils.getStandardPortalUrl(this.portalUrl);
      var sharingRest = portalUrl + '/sharing/rest';
      var cre = IdentityManager.findCredential(sharingRest);
      var isPublishEvent = !!cre;
      this.removeWabAuthCookie();
      this.removeEsriAuthCookieStorage();
      IdentityManager.destroyCredentials();
      if(isPublishEvent){
        this._publishCurrentPortalUserSignOut(portalUrl);
      }
    },

    signOutPortal: function(_portalUrl) {
      var thePortalUrl = lang.trim(_portalUrl || '');
      if (!thePortalUrl) {
        return;
      }

      var isMainPortal = portalUrlUtils.isSamePortalUrl(thePortalUrl, this.portalUrl);
      var credential = this.getPortalCredential(thePortalUrl);
      var isPublishEvent = credential && isMainPortal;

      this._removePortalCredential(thePortalUrl);

      if(isMainPortal){
        // var testPortalUrl = portalUrlUtils.getPortalUrlFromLocation();
        // var isRunInPortal = portalUrlUtils.isSamePortalUrl(testPortalUrl, thePortalUrl);
        var isRunInPortal = this.isRunInPortal();
        if(isRunInPortal){
          this.removeCookie("esri_auth");
        }
        else{
          this.removeCookie("wab_auth");
        }
      }
      
      if (isPublishEvent) {
        this._publishCurrentPortalUserSignOut(thePortalUrl);

        // try{
        //   this.tryPublishUserSignOutToExternal(thePortalUrl);
        // }
        // catch(e){
        //   console.error(e);
        // }
      }
    },

    userHaveSignInPortal: function(_portalUrl) {
      return !!this.getPortalCredential(lang.trim(_portalUrl || ''));
    },

    isValidCredential: function(/* esri.Credential */ credential){
      var isValid = false;

      if(credential){
        var token = credential.token;
        var server =credential.server;
        var theScope = credential['scope'];
        var isValidToken = token && typeof token === "string" && lang.trim(token);
        var isValidServer = server && typeof server === "string" && lang.trim(server);
        var isValidScope = theScope === 'portal' || theScope === "server";
        var isValidExpires = true;
        if (credential.expires) {
          var expireTime = parseInt(credential.expires, 10);
          var nowDate = new Date();
          var nowTime = nowDate.getTime();
          isValidExpires = expireTime > nowTime;
        }
        isValid = isValidToken && isValidServer && isValidScope && isValidExpires;
      }

      return isValid;
    },

    isValidPortalCredentialOfPortalUrl: function(thePortalUrl, credential){
      var isValid = false;

      if(this.isValidCredential(credential)){
        var isPortalScope = credential['scope'] === 'portal';
        var isSameServer = portalUrlUtils.isSameServer(thePortalUrl, credential.server);
        isValid = isPortalScope && isSameServer;
      }

      return isValid;
    },

    getPortalCredential: function(_portalUrl) {
      var credential = null;
      var thePortalUrl = lang.trim(_portalUrl || '');
      if (!thePortalUrl) {
        return null;
      }
      thePortalUrl = portalUrlUtils.getStandardPortalUrl(thePortalUrl);
      //var credentials =[];

      //var sharingUrl = thePortalUrl + '/sharing';
      //c = IdentityManager.findCredential(sharingUrl);
      
      //find portal credential from esri.id.credentials
      credential = this._filterPortalCredential(thePortalUrl, IdentityManager.credentials);

      /*if(!credential){
        //try find portal credential from builder
        if(this.isInStemappWindow()){
          var builderWindow = window.parent;
          if(builderWindow && builderWindow.esri && builderWindow.esri.id){
            credentials = builderWindow.esri.id.credentials;
            credential = this._filterPortalCredential(thePortalUrl, credentials);
          }
        }
      }*/

      return credential;
    },

    //save wab_auth cookie, register token, return credential
    saveAndRegisterCookieToCredential: function(cookieValue){
      //server,token,userId,expires
      var wabAuth = lang.clone(cookieValue);
      wabAuth.referer = window.location.host;
      wabAuth.scope = 'portal';
      wabAuth.isAdmin = !!wabAuth.isAdmin;

      this.saveWabCookie(wabAuth);

      var sharingRest = wabAuth.server + "/sharing/rest";
      wabAuth.server = sharingRest;
      IdentityManager.registerToken(wabAuth);
      var cre = IdentityManager.findCredential(sharingRest, wabAuth.userId);
      //cre.resources = ["http://portalUrl/sharing/rest"]
      return cre;
    },

    //save wab_auth cookie, register token, return credential
    registerAuth2Hash: function(_authHash){
      var authHash = lang.clone(_authHash);
      //{access_token,expires_in,persist,username,state}

      //check expires
      var expiresInS = parseInt(authHash.expires_in, 10); //seconds
      var expiresInMS = expiresInS * 1000; //milliseconds
      var dateNow = new Date();
      var expiresTime = dateNow.getTime() + expiresInMS;
      var server = portalUrlUtils.getStandardPortalUrl(authHash.state.portalUrl);

      var wabAuth = {
        referer: window.location.host,
        server: server,
        token: authHash.access_token,
        expires: expiresTime,
        userId: authHash.username,
        scope: 'portal',
        isAdmin: !!authHash.isAdmin
      };

      var cre = this.saveAndRegisterCookieToCredential(wabAuth);
      return cre;
    },

    saveWabCookie: function(wabAuth){
      var cookieName = "wab_auth";
      this.removeCookie(cookieName);
      cookie(cookieName, JSON.stringify(wabAuth), {
        expires: new Date(wabAuth.expires),
        path: '/'
      });
    },

    removeWabAuthCookie: function(){
      this.removeCookie("wab_auth");
    },

    removeEsriAuthCookieStorage: function() {
      this.removeCookie('esri_auth');

      var itemName = "esriJSAPIOAuth";
      if (window.localStorage) {
        window.localStorage.removeItem(itemName);
      }
      if (window.sessionStorage) {
        window.sessionStorage.removeItem(itemName);
      }
    },

    _filterPortalCredential: function(thePortalUrl, credentials){
      var credential = null;

      if(credentials && credentials.length > 0){
        var filterCredentials = array.filter(credentials, lang.hitch(this, function(c){
          return this.isValidPortalCredentialOfPortalUrl(thePortalUrl, c);
        }));

        //return the last valid credential
        if(filterCredentials.length > 0){
          var lastIndex = filterCredentials.length - 1;
          credential = filterCredentials[lastIndex];
        }
      }

      return credential;
    },

    _removePortalCredential: function(_portalUrl) {
      var thePortalUrl = lang.trim(_portalUrl || '');
      if (!thePortalUrl) {
        return;
      }
      thePortalUrl = portalUrlUtils.getStandardPortalUrl(thePortalUrl);

      var filterCredentials = array.filter(IdentityManager.credentials, lang.hitch(this, function(c) {
        return this.isValidPortalCredentialOfPortalUrl(thePortalUrl, c);
      }));

      while (filterCredentials.length > 0) {
        var c = filterCredentials[0];
        //if c has attribute _oAuthCred, c._oAuthCred will also destroy and remove relevant info from storage
        c.destroy();
        filterCredentials.splice(0, 1);
      }

      IdentityManager.credentials = array.filter(IdentityManager.credentials, lang.hitch(this, function(c) {
        return !this.isValidPortalCredentialOfPortalUrl(thePortalUrl, c);
      }));
    },

    getUserIdByToken: function(token, _portalUrl) {
      var def = new Deferred();
      var validToken = token && typeof token === 'string';
      var validPortalUrl = _portalUrl && typeof _portalUrl === 'string';
      if (validToken && validPortalUrl) {
        var thePortalUrl = portalUrlUtils.getStandardPortalUrl(_portalUrl);
        var cs = array.filter(IdentityManager.credentials, lang.hitch(this, function(credential) {
          var b = credential.token === token && credential.userId;
          var isSameServer = portalUrlUtils.isSameServer(thePortalUrl, credential.server);
          return b && isSameServer;
        }));

        if(cs.length > 0){
          var c = cs[0];
          setTimeout(lang.hitch(this, function(){
            def.resolve(c.userId);
          }), 0);
          return def;
        }

        var url = portalUrlUtils.getCommunitySelfUrl(thePortalUrl);
        esriRequest({
          url: url,
          handleAs: 'json',
          content: {
            f: 'json'
          },
          callbackParamName: 'callback'
        }).then(lang.hitch(this, function(response) {
          var username = (response && response.username) || '';
          def.resolve(username);
        }), lang.hitch(this, function(err) {
          console.error(err);
          def.reject('fail to get userId by token');
        }));
        return def;
      } else {
        setTimeout(lang.hitch(this, function(){
          def.reject('invalid parameters');
        }), 0);
        return def;
      }
      return def;
    },

    xtGetCredentialFromCookie: function(portalUrl){
      //{referer,server,scope,token,expires,userId,isAdmin}
      var strAuth = cookie("wab_auth");
      var wabAuth = null;

      if(strAuth){
        try{
          wabAuth = json.parse(strAuth);
        }
        catch(e){
          console.error(e);
        }
      }

      if(!(wabAuth && typeof wabAuth === 'object')){
        return null;
      }

      //check server
      var server = wabAuth.server;
      var isValidServer = portalUrlUtils.isSameServer(portalUrl, server);
      if(!isValidServer){
        return null;
      }

      //check referer
      var isValidReferer = window.location.host === wabAuth.referer;
      if (!isValidReferer) {
        return null;
      }

      //check expires
      wabAuth.expires = parseInt(wabAuth.expires, 10);
      var dateNow = new Date();
      var timeNow = dateNow.getTime();
      var isValidExpires = wabAuth.expires > timeNow;
      if (!isValidExpires) {
        this.removeCookie("wab_auth");
        return null;
      }

      //var sharingUrl = portalUrlUtils.getSharingUrl(portalUrl);
      //wabAuth.resources = [sharingUrl];

      //expires,isAdmin,server,ssl,token,userId,scope
      //var cre = new Credential(wabAuth);
      //return cre;

      //Note: server must include '/sharing'
      var restUrl = portalUrl + '/sharing/rest';
      wabAuth.server = restUrl;
      var cre = IdentityManager.findCredential(restUrl);
      if(!cre){
        IdentityManager.registerToken(wabAuth);
      }

      cre = IdentityManager.findCredential(restUrl);

      return cre;
    },

    removeCookie: function(cookieName) {
      var path = this.getCookiePath();
      jimuUtils.removeCookie(cookieName, path);
    },

    _getDomainsByServerName: function(serverName){
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
    },

    _publishCurrentPortalUserSignIn: function(/* esri.Credential */ credential){
      if(!this.isValidCredential(credential)){
        return;
      }

      try{
        topic.publish('userSignIn', credential);
      }
      catch(e){
        console.error(e);
      }
    },

    _publishAnyUserSignIn: function(/* esri.Credential */ credential){
      if(!this.isValidCredential(credential)){
        return;
      }

      try{
        topic.publish('anyUserSignIn', credential);
      }
      catch(e){
        console.error(e);
      }
    },

    _publishCurrentPortalUserSignOut: function(thePortalUrl){
      try {
        topic.publish('userSignOut', thePortalUrl);
      } catch (e) {
        console.error(e);
      }
    },

    _signInSuccess: function(/* esri.Credential */ credential /*, persist*/) {
      try{
        var isCreOfCurrentPortal = this.isValidPortalCredentialOfPortalUrl(this.portalUrl, credential);

        if(isCreOfCurrentPortal){
          this._publishCurrentPortalUserSignIn(credential);
        }

        this._publishAnyUserSignIn(credential);

        if(!this._isNormalScope(credential)){
          return;
        }

        // try{
        //   this.tryPublishUserSignInToExternal(credential);
        // }
        // catch(e){
        //   console.error(e);
        // }

        //condition of storing cookie
        //1.persist is true
        //2.The credential is a portal credential.
        //3.The credential is a credential of main portalUrl.
        // if (persist && isCreOfCurrentPortal) {
        //   this._saveCredentialCookie(credential);
        // }
      }
      catch(e){
        console.error(e);
      }
    },

    _isNormalScope: function(/* esri.Credential */ credential){
      var isNormalScope = true;
      if (IdentityManager._isRESTService && credential.resources && credential.resources.length > 0) {
        isNormalScope = array.every(credential.resources, lang.hitch(this, function(resourceUrl) {
          var theScope = IdentityManager._isRESTService(resourceUrl) ? 'server' : 'portal';
          return theScope === credential['scope'];
        }));
      }
      return isNormalScope;
    },

    //need to be overrided
    tryPublishUserSignInToExternal: function(credential) { /* jshint unused: false */ },

    //need to be overrided
    tryPublishUserSignOutToExternal: function(_portalUrl) { /* jshint unused: false */ },

    _bindEvents: function(){
      if(!this.isRightWindowScope()){
        return;
      }

      //signIn event
      aspect.after(IdentityManager, 'signIn', lang.hitch(this, function(def , signInInputParams){
        // var url = signInInputParams[0];
        var serverInfo = signInInputParams[1];
        console.log(serverInfo);
        aspect.after(def, 'callback', lang.hitch(this, function(returnValue, callbackInputParams){
          var credential = callbackInputParams[0];
          //IdentityManager._isRESTService
          this._signInSuccess(credential, false);
        }));
        return def;
      }));

      //signIn from out
      /*topic.subscribe('externalUserSignIn', lang.hitch(this, function(credential) {
        if(!this.isRightWindowScope()){
          return;
        }
        var portalUrl = this.getPortalUrl();
        if(this.isValidPortalCredentialOfPortalUrl(portalUrl, credential)){
          if(!this.getPortalCredential(portalUrl)){
            this.tryRegisterCredential(credential);
            this._publishCurrentPortalUserSignIn(credential);
            this._publishAnyUserSignIn(credential);
            return;
          }
        }
        this.tryRegisterCredential(credential);
      }));*/
    },

    _bind: false,

    //need to be overrided
    bindEvents: function(){
      if(!this._bind && !this.isRightWindowScope()){
        return;
      }
      this._bind = true;
      this._bindEvents();
    },

    isStart: function(){
      return this._started;
    },

    startup: function(){
      if(this.isInStemappWindow()){
        var builderWindow = window.parent;
        if(builderWindow){
          var builderIM = builderWindow.esri && builderWindow.esri.id;
          if(builderIM){
            IdentityManager = builderIM;
            window.esri.id = builderIM;
          }
        }
      }

      //only startup when the window scope is right
      if(this.isRightWindowScope()){
        if(!this._started){
          this.bindEvents();
        }
        this._started = true;
      }
    }

  });
});