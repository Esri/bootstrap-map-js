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
    'dojo/_base/html',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/Evented',
    'dojo/Deferred',
    'esri/request',
    'dijit/form/ValidationTextBox'
  ],
  function(declare, html, lang, on, Evented, Deferred, esriRequest, ValidationTextBox) {
    return declare([ValidationTextBox], {
      _validatingNode: null,
      _validNode: null,
      _inValidNode: null,

      verify: true,

      postCreate: function() {
        this.inherited(arguments);

        this._validatingNode = html.create('div', {
          'class': 'jimu-service-validating'
        }, this.domNode);
        this._validNode = html.create('div', {
          'class': 'jimu-service-valid'
        }, this.domNode);
        this._inValidNode = html.create('div', {
          'class': 'jimu-service-invalid'
        }, this.domNode);

        html.addClass(this.domNode, 'jimu-serviceurl-input');

        if (this.verify){
          this.own(on(this, 'Change', lang.hitch(this, '_onServiceUrlChange')));
        }
      },

      onFetch: function(evt){
        /* jshint unused:false */
      },

      onFetchError: function(evt){
        /* jshint unused:false */
      },

      _onServiceUrlChange: function(serviceUrl) {
        var def = new Deferred();

        def.then(lang.hitch(this, function(){
          this._valid();
        }), lang.hitch(this, function(){
          this._inValid();
          this.onFetchError();
        }));

        this._validating();
        esriRequest({
          url: lang.trim(serviceUrl || ""),
          handleAs: 'json',
          content: {
            f: 'json'
          },
          callbackParamName: 'callback'
        }).then(lang.hitch(this, function(restData) {
          this.onFetch({
            url: this.getValue(),
            data: restData,
            deferred: def
          });
        }), lang.hitch(this, function(err){
          def.reject(err);
        }));
      },

      _hideStatus: function(){
        html.setStyle(this._validNode, {
          'display': 'none'
        });
        html.setStyle(this._inValidNode, {
          'display': 'none'
        });
        html.setStyle(this._validatingNode, {
          'display': 'none'
        });
      },

      _validating: function(){
        html.setStyle(this._validNode, {
          'display': 'none'
        });
        html.setStyle(this._inValidNode, {
          'display': 'none'
        });
        html.setStyle(this._validatingNode, {
          'display': 'inline-block'
        });
        
        html.removeClass(this.domNode, 'jimu-serviceurl-input-invalid');
      },

      _valid: function(){
        html.setStyle(this._validNode, {
          'display': 'inline-block'
        });
        html.setStyle(this._inValidNode, {
          'display': 'none'
        });
        html.setStyle(this._validatingNode, {
          'display': 'none'
        });

        html.removeClass(this.domNode, 'jimu-serviceurl-input-invalid');
      },

      _inValid: function(){
        html.setStyle(this._validNode, {
          'display': 'none'
        });
        html.setStyle(this._inValidNode, {
          'display': 'inline-block'
        });
        html.setStyle(this._validatingNode, {
          'display': 'none'
        });

        html.addClass(this.domNode, 'jimu-serviceurl-input-invalid');
      }
    });
  });