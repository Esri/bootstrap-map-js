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
  'dojo/topic',
  'dojo/_base/html',
  'dojo/dom-form',
  'dojo/_base/sniff',
  'dojo/request/registry',
  'dojo/keys',
  'dojo/cookie',
  'dojo/json',
  'dojo/aspect',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/io-query',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/PortalSignIn.html',
  'dojo/i18n',
  'esri/lang',
  'esri/request',
  'esri/arcgis/OAuthInfo',
  'esri/IdentityManager',
  'jimu/portalUrlUtils',
  'jimu/portalUtils',
  'jimu/utils',
  'jimu/dijit/CheckBox',
  'jimu/dijit/LoadingShelter',
  'jimu/dijit/Message',
  'builder/tokenUtils'
], function(
  declare,
  lang,
  array,
  on,
  topic,
  html,
  domForm,
  has,
  request,
  keys,
  cookie,
  JSON,
  aspect,
  Deferred,
  all,
  ioQuery,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  i18n,
  esriLang,
  esriRequest,
  ArcGISOAuthInfo,
  IdentityManager,
  PortalUrlUtils,
  PortalUtils,
  jimuUtils,
  CheckBox,
  LoadingShelter,
  Message,
  tokenUtils
) {

  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: template,
    nls: null,
    defaultExpires: 60 * 24 * 14, //minutes
    removeOldAppId: false,
    label: 'signin',

    _helpLink: "http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION2_20AF85308FD548B5ADBAE28836F66D3F",

    postMixInProperties: function() {
      this.inherited(arguments);

      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if (!mainNls) {
        mainNls = i18n.getLocalization('jimu', 'main');
      }

      this.nls = mainNls.portalSignIn;
      var hereNode = '<a class=help-link target=_blank href=' + this._helpLink + '>' + this.nls.here + '</a>';
      this.nls.appIdTip2 = esriLang.substitute({
        here: hereNode
      }, this.nls.appIdTip2);
    },

    postCreate: function() {
      this.inherited(arguments);
      this._bindEvents();
    },

    showAppIdTip: function() {
      html.setStyle(this.appIdTipSection, 'display', 'block');
    },

    hideAppIdTip: function() {
      html.setStyle(this.appIdTipSection, 'display', 'none');
    },

    _bindEvents: function() {
      this.remember = new CheckBox({
        label: this.nls.remember,
        checked: false
      }, this.remember);

      this.own(on(this.password, "blur", lang.hitch(this, this.changeSigninStatus)));
      this.own(on(this.domNode, 'keydown', lang.hitch(this, function(evt) {
        var keyCode = evt.keyCode ? evt.keyCode : evt.which;
        if (keyCode === keys.ENTER) {
          this.onSigninClick();
        }
      })));
    },

    generateTokenSignIn: function(portalUrl) {
      var def = new Deferred();

      var cre = tokenUtils.xtGetCredentialFromCookie(portalUrl);
      if(cre){
        def.resolve(cre.token);
        return def;
      }

      tokenUtils.removeWabAuthCookie();

      var standardUrl = this._standardizePortalUrl(PortalUrlUtils.getStandardPortalUrl(portalUrl));
      var tokenUrl = '/proxy.js?' + standardUrl + "/sharing/generateToken";
      if (window.XDomainRequest && has('ie') <=9) {
        request.register(new RegExp('^' + standardUrl), lang.hitch(this, this._crossByXdr));
      }

      var signingInTip = this.nls.signingIn + "...";
      this.shelter.show(signingInTip);

      request(tokenUrl, {
        handleAs: "json",
        method: 'POST',
        data: {
          request: "getToken",
          username: html.getAttr(this.username, 'value'),
          password: html.getAttr(this.password, 'value'),
          referer: window.location.host,
          expiration: this.remember.checked ? this.defaultExpires : 120, // two weeks or session
          f: "json"
        },
        headers: {
          "X-Requested-With": null
        }
      }).then(lang.hitch(this, function(result) {
        if (result && result.token) {
          this._clearUserPassword();

          //get user info
          var communityUrl = '/proxy.js?' + PortalUrlUtils.getCommunitySelfUrl(standardUrl);
          var portalSelfDef = this._getPortalSelf(result.token);
          var userDef = request(communityUrl, {
            handleAs: "json",
            method: 'POST',
            data: {
              token: result.token,
              f: "json"
            },
            headers: {
              "X-Requested-With": null
            }
          });

          all([portalSelfDef, userDef]).then(lang.hitch(this, function(results) {
            this.shelter.hide();

            var portalSelf = results[0],
              userInfo = results[1];

            if (!userInfo.orgId) {
              new Message({
                message: this.nls.namedUserTip,
                container: document.body
              });
              return;
            }

            if (!portalSelf.isPortal) {
              //is not an on-premise portal
              this.signinInfo.portalUrl = 'http://' + portalSelf.urlKey + '.' + portalSelf.customBaseUrl;
            }

            if (userInfo.username) {
              var server = PortalUrlUtils.getStandardPortalUrl(this.signinInfo.portalUrl);
              var isAdmin = userInfo.role === 'org_admin';
              // get cookie param
              var cookieValue = {
                server: server,
                token: result.token,
                userId: userInfo.username,
                expires: result.expires,
                referer: window.location.host,
                scope: 'portal',
                isAdmin: isAdmin
              };
              var cre = tokenUtils.saveAndRegisterCookieToCredential(cookieValue);
              topic.publish('userSignIn', cre);

              if (window.location.protocol !== 'http:' && has('ie') <= 9) {
                var info = {
                  portalUrl: this.signinInfo.portalUrl,
                  supportsOAuth: this.signinInfo.supportsOAuth
                };
                this._updateSigninInfo(info).then(function(){
                  var newUrl = window.location.href.replace(/(action=)(.+)/, '$1signin');
                  window.location.href = newUrl.replace('https', 'http');
                });
                return;
              }
              def.resolve(cookieValue);
            }
          }), lang.hitch(this, function(err) {
            console.error(err);
            this._loginStatus(true);
            def.reject(err);
          }));
        } else {
          this.shelter.hide();
          this._loginStatus(true);
          def.reject();
        }
      }), lang.hitch(this, function(err) {
        this.shelter.hide();
        console.error(err);
        this._loginStatus(true);
        def.reject(err);
      }));
      return def;
    },

    setSigninInfo: function(signinInfo, appIdError) {
      this.signinInfo = signinInfo;
      html.setStyle(this.domNode, 'display', 'block');
      var portalUrl = PortalUrlUtils.getStandardPortalUrl(signinInfo.portalUrl);
      this.forgot.href = portalUrl + '/home/troubleshoot.html';
      if (signinInfo.supportsOAuth && signinInfo.appId && !appIdError) {
        html.setStyle(this.domNode, 'display', 'none');
        //for oauth, we update signin info here, because we can't update signin info after oauth signin successfully
        this._updateSigninInfo(signinInfo).then(lang.hitch(this, function() {
          this.oauthSignIn(signinInfo.portalUrl, signinInfo.appId);
        }));
      } else {
        var cre = tokenUtils.xtGetCredentialFromCookie(signinInfo.portalUrl);
        if(cre){
          this.onSigninClick();
        }else{
          if(has('ie') <= 9){
            if (window.location.protocol !== 'https:') {
              window.location.href = window.location.href.replace('http', 'https');
              return;
            }
          }
        }
      }

      if (this.signinInfo.supportsOAuth) {
        this.showAppIdTip();
      } else {
        this.hideAppIdTip();
      }
    },

    oauthSignIn: function(portalUrl, appId) {
      var standardUrl = this._standardizePortalUrl(portalUrl);
      var authInfo = new ArcGISOAuthInfo({
        appId: appId,
        portalUrl: standardUrl,
        expiration: this.defaultExpires,
        authScope: '/',
        popup: false
      });

      IdentityManager.registerOAuthInfos([authInfo]);

      var sharingUrl = standardUrl + "/sharing"; //https
      IdentityManager.getCredential(sharingUrl);
    },

    removeCookie: function(cookieName) {
      var cookiePath = '/';
      jimuUtils.removeCookie(cookieName, cookiePath);
    },

    saveWabCookie: function(wabAuth) {
      var cookieName = "wab_auth";
      this.removeCookie(cookieName);
      cookie(cookieName, JSON.stringify(wabAuth), {
        expires: new Date(wabAuth.expires),
        path: '/'
      });
    },

    _crossByXdr: function(url, options) {
      var def = new Deferred();
      var xdr = new window.XDomainRequest();
      if (xdr) {
        xdr.onload = function() {
          var result = JSON.parse(xdr.responseText);
          def.resolve(result);
        };
        xdr.open(options.method, url + '?' + ioQuery.objectToQuery(options.data));
        xdr.send();
        return def;
      }
      def.reject(new Error('XDomainRequest not supported.'));
      return def;
    },

    _standardizePortalUrl: function(url) {
      var standardUrl = PortalUrlUtils.getStandardPortalUrl(url);
      standardUrl = PortalUrlUtils.setHttpsProtocol(standardUrl);

      return standardUrl;
    },

    _createAppId: function(portalUrl) {
      var def = new Deferred();
      var portal = PortalUtils.getPortal(portalUrl);
      var redirectUris = ['http://' + window.location.hostname, 'https://' + window.location.hostname];
      var loadingTip = this.nls.registeringAppID + "...";
      this.shelter.show(loadingTip);
      portal.createAndRegisterApp(redirectUris).then(lang.hitch(this, function(res) {
        this.shelter.hide();
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        this.shelter.hide();
        console.error(err);
        def.reject(err);
      }));

      return def;
    },

    _getPortalSelf: function(token) {
      return esriRequest({
        url: PortalUrlUtils.getPortalSelfInfoUrl(this.signinInfo.portalUrl),
        content: {
          f: 'json',
          token: token
        },
        handleAs: 'json',
        callbackParamName: 'callback',
        preventCache: true
      });
    },

    //sign in->create new appId
    _signInAndCreateAppId: function() {
      var defSignIn = this.generateTokenSignIn(this.signinInfo.portalUrl);
      defSignIn.then(lang.hitch(this, function() {
        if (this.signinInfo.supportsOAuth) {
          var defAppId = this._createAppId(this.signinInfo.portalUrl);
          defAppId.then(lang.hitch(this, function(appIdInfo) {
            var info = {
              portalUrl: this.signinInfo.portalUrl,
              appId: appIdInfo.client_id,
              supportsOAuth: this.signinInfo.supportsOAuth
            };
            this._updateSigninInfo(info).then(lang.hitch(this, function(response) {
              if (response.success) {
                topic.publish('switchToMainPage', info);
              } else {
                console.log(response);
              }
            }), function(err) {
              console.log(err);
            });
          }), lang.hitch(this, function(err) {
            console.error(err);
          }));
        } else {
          var info = {
            portalUrl: this.signinInfo.portalUrl,
            supportsOAuth: this.signinInfo.supportsOAuth
          };
          this._updateSigninInfo(info).then(lang.hitch(this, function(response) {
            if (response.success) {
              topic.publish('switchToMainPage', info);
            } else {
              console.log(response);
            }
          }), function(err) {
            console.log(err);
          });
        }
      }), lang.hitch(this, function(err) {
        console.error(err);
      }));
    },

    //sign in->try delete old appId->create new appId
    _signInAndRecrateAppId: function() {
      var defSignIn = this.generateTokenSignIn(this.signinInfo.portalUrl);
      defSignIn.then(lang.hitch(this, function() {
        //try remove old appId
        var oldAppId = this.signinInfo.appId;
        var portalUrl = this.signinInfo.portalUrl;
        var supportsOAuth = this.signinInfo.supportsOAuth;

        var portal = PortalUtils.getPortal(portalUrl);
        var defAppId = portal.getAppById(oldAppId);
        defAppId.promise.always(lang.hitch(this, function(res) {
          var itemId = res && res.itemId;

          var createNewAppId = lang.hitch(this, function() {
            this._createAppId(portalUrl).then(lang.hitch(this, function(response) {
              var info = {
                portalUrl: portalUrl,
                appId: response.client_id,
                supportsOAuth: supportsOAuth
              };
              this._updateSigninInfo(info).then(lang.hitch(this, function(response) {
                if (response.success) {
                  topic.publish('switchToMainPage', info);
                } else {
                  console.error(response);
                }
              }), function(err) {
                console.error(err);
              });
            }), lang.hitch(this, function(err) {
              console.error(err);
            }));
          });

          //if can access itemId,it means the itemId belongs to current user
          if (itemId) {
            portal.getUser().then(lang.hitch(this, function(user) {
              user.deleteItem(itemId).then(lang.hitch(this, function(deleteRes) {
                if (deleteRes.success) {
                  createNewAppId();
                }
              }), lang.hitch(this, function(err) {
                console.error(err);
              }));
            }), lang.hitch(this, function(err) {
              console.error(err);
            }));
          } else {
            createNewAppId();
          }
        }));
      }), lang.hitch(this, function(err) {
        console.error(err);
      }));
    },

    onSigninClick: function() {
      if (this.removeOldAppId) {
        this._signInAndRecrateAppId();
      } else {
        this._signInAndCreateAppId();
      }
    },

    onBackClick: function() {
      topic.publish("switchToSetPortalUrl", this.signinInfo);
    },

    _updateSigninInfo: function(info) {
      return request('/builder/rest/signininfo/setsignininfo', {
        handleAs: "json",
        preventCache: true,
        data: info,
        method: 'POST'
      });
    },

    _loginStatus: function(isFail) {
      if (isFail) {
        this.username.focus();
        html.setStyle(this.errorNode, 'display', 'block');
      } else {
        html.setStyle(this.errorNode, 'display', 'none');
      }
    },

    _clearUserPassword: function() {
      this.username.value = '';
      this.password.value = '';
    },

    changeSigninStatus: function() {
      if (this.password.value) {
        html.removeClass(this.signin, 'signin-btn-disable');
      } else if (!html.hasClass(this.signin, 'signin-btn-disable')) {
        html.addClass(this.signin, 'signin-btn-disable');
      }
    }
  });
});