// Vim.js
// Used to serialize/deserialize the identitymanager storing
// credential objects (tokens) in either local storage or a cookie
// usage:
//	param 1: the name of the cookie/localstorage key
//	new Vim(idStateName);

define([
	'dojo/_base/declare',
	'esri/kernel',
	'dojo/cookie',
	'dojo/json',
	'dojo/_base/unload',
	'dojo/_base/lang'
], function(declare, kernel, cookie, JSON, baseUnload, lang) {
	return declare(null, {
		constructor: function(idStateName) {
			this.idStateName = idStateName || 'esri_jsapi_id_manager_data';
			baseUnload.addOnUnload(lang.hitch(this, 'storeCredentials'));
			this.loadCredentials();
		},
		loadCredentials: function() {
			var idJson, idObject;
			if (this._supportsLocalStorage()) {
				idJson = window.localStorage.getItem(this.idStateName);
			} else {
				idJson = cookie(this.idStateName);
			}
			if (idJson && idJson != 'null' && idJson.length > 4) {
				idObject = JSON.parse(idJson);
				kernel.id.initialize(idObject);
			}
		},
		storeCredentials: function() {
			if (kernel.id.credentials.length === 0) {
				return;
			}
			var idString = JSON.stringify(kernel.id.toJson());
			if (this._supportsLocalStorage()) {
				window.localStorage.setItem(this.idStateName, idString);
			} else {
				cookie(this.idStateName, idString, {
					expires: 1
				});
			}
		},
		_supportsLocalStorage: function() {
			try {
				return 'localStorage' in window && window.localStorage !== null;
			} catch (e) {
				return false;
			}
		}
	});
});
