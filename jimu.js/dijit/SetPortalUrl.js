define([
  "dojo/parser",
  "dojo/on",
  "dojo/dom",
  "dojo/_base/lang",
  'dojo/_base/declare',
  'dojo/_base/html',
  'dojo/topic',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/SetPortalUrl.html',
  'dojo/Evented',
  'dojo/request',
  'dojo/Deferred',
  'dojo/keys',
  'jimu/dijit/URLInput',
  'jimu/dijit/Message',
  'jimu/portalUtils',
  'jimu/portalUrlUtils',
  'jimu/utils',
  'dijit/form/TextBox',
  'esri/request',
  'dojo/i18n!../nls/main'
], function(
  parser,
  on,
  dom,
  lang,
  declare,
  html,
  topic,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  Evented,
  request,
  Deferred,
  keys,
  URLInput,
  Message,
  PortalUtils,
  PortalUrlUtils,
  utils,
  TextBox,
  esriRequest,
  mainNls) {
  return declare([Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    // preUrl: "",
    baseClass: 'jimu-set-portal-url',
    templateString: template,

    label: 'setportalurl',

    invalidInput: true,
    _enterKeyDown: false,
    _continueClick: false,

    validateDef: null,
    signinInfo: null,

    postMixInProperties: function() {
      this.nls = mainNls.setPortalUrl;
    },

    postCreate: function() {
      this.loadingUrl = html.create('div', {
        'class': 'loadingUrl'
      }, this.portalUrlInput.domNode);

      this.invalidUrl = html.create('div', {
        'class': 'invalidUrl'
      }, this.portalUrlInput.domNode);

      this.validUrl = html.create('div', {
        'class': 'validUrl'
      }, this.portalUrlInput.domNode);

      this.signinInfo = {
        portalUrl: "",
        supportsOAuth: false,
        appId: null
      };
      html.addClass(this.portalUrlInput.domNode, 'portalUrlInput');
    },

    setSigninInfo: function(signinInfo) {
      var def = new Deferred();

      def.then(lang.hitch(this, function(info) {
        if (info.portalUrl) {
          this.portalUrlInput.set('value', info.portalUrl);
        }
        this._validatePortal();
      }), lang.hitch(this, function(errMessage) {
        new Message({
          message: errMessage
        });
      }));

      if (signinInfo) {
        this.signinInfo = signinInfo;
        def.resolve(signinInfo);
      } else {
        request("/builder/rest/signininfo/getcurrentinfo", {
          handleAs: 'json',
          preventCache: true
        }).then(function(response) {
          if (!response.success) {
            console.error(response.message);
            def.reject(response.message);
          } else {
            this.signinInfo = signinInfo;
            def.resolve(response.info);
          }
        });
      }
    },

    _onContentKeyDown: function(evt) {
      var keyCode = evt.keyCode ? evt.keyCode : evt.which;
      if (keyCode === keys.ENTER) {
        this.portalUrlInput.onBlur();
        this._enterKeyDown = true;
        this.savePortalUrlBtn.focus();
        this.savePortalUrlBtn.click();
      } else {
        this._enterKeyDown = false;
        this._continueClick = false;
      }
    },

    _onPortalUrlFocus: function() {
      // html.setStyle(this.remind, 'display', 'none');
    },

    _onPortalUrlKeyDown: function() {
      this._cancelValidating();
    },

    _cancelValidating: function() {
      if (this.validateDef && !this.validateDef.isCanceled()) {
        this.validateDef.cancel();
        html.setStyle(this.invalidUrl, 'display', 'none');
        html.setStyle(this.errorRemind, 'display', 'none');
      }
    },

    _onPortalUrlChange: function() {
      html.setStyle(this.validUrl, 'display', 'none');
      html.setStyle(this.invalidUrl, 'display', 'none');

      this.invalidInput = true;
    },

    _validatePortal: function() {
      if (!this.portalUrlInput.get('value')) {
        html.setStyle(this.remind, 'display', 'block');
      } else {
        html.setStyle(this.remind, 'display', 'none');
      }
      this._cancelValidating();

      var url = "";
      if (this.portalUrlInput.get('value')) {
        var standardUrl = PortalUrlUtils.setHttpProtocol(this.portalUrlInput.get('value'));
        this.portalUrlInput.set('value', standardUrl);
      }

      if (this.portalUrlInput.validator(this.portalUrlInput.get('value'))) {
        url = this.portalUrlInput.get('value');
      }

      if (url) {
        // change https to http
        url = PortalUrlUtils.setHttpProtocol(url);
        this._showValidatingStatus();
        var portalUrl = PortalUrlUtils.getStandardPortalUrl(url);

        this.validateDef = esriRequest({
          url: portalUrl + "/sharing/rest/portals/self",
          content: {
            f: "json"
          },
          handleAs: "json",
          timeout: 8000, // 8 second
          callbackParamName: "callback"
        });

        this.validateDef.then(lang.hitch(this, function(portalInfo) {
          this.signinInfo.supportsOAuth = portalInfo.supportsOAuth;
          this._validateHasAppId(url).always(lang.hitch(this, function() {
            this._showValidStatus();
            if (this._enterKeyDown || this._continueClick) {
              this._onContinue();
              this._continueClick = false;
              this._enterKeyDown = false;
            }
          }));

          this.signinInfo.portalUrl = url;
          this.emit('valid-url-change', {
            portalUrl: url
          });
          topic.publish('portalUrlChange', {
            portalUrl: url
          });
        }), lang.hitch(this, function(err) {
          this._showInvalidStatus();
          // html.addClass(this.savePortalUrlBtn, 'Cont-btn-disable');
          console.error(err);
        }));

        // must be organization account
        if (/www.arcgis.com/.test(url)) {
          this.validateDef.cancel();
        }
      }
    },

    _validateHasAppId: function(portalUrl) {
      var def = new Deferred();
      request('/builder/rest/signininfo/getAppId', {
        handleAs: "json",
        preventCache: true,
        query: {
          portalUrl: portalUrl
        }
      }).then(lang.hitch(this, function(response) {
        if (response && response.success) {
          this.signinInfo.appId = response.appId;
          def.resolve(response);
        } else {
          this.signinInfo.appId = null;
          new Message({
            message: response.message
          });
          def.resolve(response);
        }
      }), lang.hitch(this, function(err) {
        this.signinInfo.appId = null;
        def.reject('error');
        console.error(err);
      }));

      return def.promise;
    },

    _showValidStatus: function() {
      html.removeClass(this.portalUrlInput.domNode, "errorStatus");
      html.setStyle(this.loadingUrl, 'display', 'none');
      html.setStyle(this.validUrl, 'display', 'block');
      html.setStyle(this.invalidUrl, 'display', 'none');
      // html.removeClass(this.savePortalUrlBtn, 'Cont-btn-disable');

      this.invalidInput = false;
    },

    _showValidatingStatus: function() {
      html.removeClass(this.portalUrlInput.domNode, "errorStatus");
      html.setStyle(this.loadingUrl, 'display', 'block');
      html.setStyle(this.validUrl, 'display', 'none');
      html.setStyle(this.invalidUrl, 'display', 'none');
      // html.addClass(this.savePortalUrlBtn, 'Cont-btn-disable');
      this.invalidInput = true;
    },

    _showInvalidStatus: function() {
      html.addClass(this.portalUrlInput.domNode, "errorStatus");
      html.setStyle(this.portalUrlInput.domNode, 'data-dojo-props', "missingMessage:'IPUT URL'");
      html.setStyle(this.loadingUrl, 'display', 'none');
      html.setStyle(this.validUrl, 'display', 'none');
      html.setStyle(this.invalidUrl, 'display', 'block');

      html.setStyle(this.errorRemind, 'display', 'block');
      var inputUrl = this.portalUrlInput.get('value');

      if (/www.arcgis.com/.test(inputUrl)) {
        this.errorRemind.innerHTML = this.nls.errOrg;
      } else {
        var errorInfo = this.nls.errPrefix + inputUrl;
        this.errorRemind.innerHTML = errorInfo + "<br>" + this.nls.errRemind;
      }
      this.invalidInput = true;
    },

    _onContinue: function() {
      if (!this.invalidInput) {
        topic.publish('switchToSignin', lang.clone(this.signinInfo));
      } else {
        this._validatePortal();
        this._continueClick = true;
      }
    }
  });
});