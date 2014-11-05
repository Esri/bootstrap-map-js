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
    'dojo/_base/lang'
  ],
  function(lang) {
    var mo = {};

    String.prototype.startWith = function(str) {
      if (this.substr(0, str.length) === str) {
        return true;
      } else {
        return false;
      }
    };

    String.prototype.endWith = function(str) {
      if (this.substr(this.length - str.length, str.length) === str) {
        return true;
      } else {
        return false;
      }
    };

    mo.getServerByUrl = function(_url){
      //test: http://www.arcgis.com/sharing/rest => www.arcgis.com
      //test: https://www.arcgis.com/ => www.arcgis.com
      //test: http://10.112.18.151:6080/arcgis/rest/services => 10.112.18.151:6080
      _url = lang.trim(_url||'');
      _url = _url.replace(/http(s?):\/\//gi,'');
      return _url.split('/')[0];
    };

    mo.getServerWithProtocol = function(_url){
      var result = '';
      _url = lang.trim(_url||'');
      if(_url){
        var protocol = mo.getProtocol(_url) || "http";
        var server = mo.getServerByUrl(_url);
        result = protocol + "://" + server;
      }
      return result;
    };

    mo.isSameServer = function(_url1,_url2){
      _url1 = mo.getServerByUrl(_url1);
      _url2 = mo.getServerByUrl(_url2);
      return _url1 === _url2;
    };

    mo.fromOnline = function(_url){
      var server = mo.getServerByUrl(_url).toLowerCase();
      return server.indexOf('.arcgis.com') >= 0;
    };

    mo.isArcGIScom = function(_url){
      var server = mo.getServerByUrl(_url).toLowerCase();
      return server === 'www.arcgis.com' || server === 'arcgis.com';
    };

    mo.isPortal = function(_url){
      return !mo.isArcGIScom(_url);
    };

    mo.getStandardPortalUrl = function(_portalUrl){
      //test: http://www.arcgis.com/sharing/rest//// => http://www.arcgis.com
      //test: www.arcgis.com => http://www.arcgis.com
      //test: http://www.arcgis.com/ => http://www.arcgis.com
      //test: https://www.arcgis.com/ => https://www.arcgis.com
      //test: 10.112.18.151 => http://10.112.18.151/arcgis
      //test: 10.112.18.151/gis => http://10.112.18.151/gis
      //test: http://analysis.arcgis.com => http://analysis.arcgis.com
      var server = mo.getServerByUrl(_portalUrl);
      if (server === '') {
        return '';
      }
      if (mo.fromOnline(server)) {
        if(mo.isArcGIScom(server)){
          server = 'www.arcgis.com';
        }
        var protocol = mo.getProtocol(_portalUrl)||'http';
        _portalUrl = protocol + '://'+server;
      } else {
        _portalUrl = lang.trim(_portalUrl || '').replace(/sharing(.*)/gi, '').replace(/\/*$/g, '');
        _portalUrl = mo.addProtocol(_portalUrl);
        var pattStr = 'http(s?):\/\/' + server;
        var pattern = new RegExp(pattStr, 'g');
        var nail = _portalUrl.replace(pattern, '');
        if (!nail) {
          _portalUrl = _portalUrl + '/arcgis';
        }
      }
      
      return _portalUrl;
    };

    mo.isSamePortalUrl = function(_portalUrl1,_portalUrl2){
      //test: http://www.arcgis.com/sharing/rest === https://www.arcgis.com
      //test: http://www.arcgis.com/ === https://www.arcgis.com
      var patt = /^http(s?):\/\//gi;
      _portalUrl1 = mo.getStandardPortalUrl(_portalUrl1).toLowerCase().replace(patt,'');
      _portalUrl2 = mo.getStandardPortalUrl(_portalUrl2).toLowerCase().replace(patt,'');
      return _portalUrl1 === _portalUrl2;
    };

    mo.addProtocol = function(url){
      var noProtocol = url.indexOf('http://') <= -1 && url.indexOf('https://') <= -1;
      if(noProtocol){
        url = 'http://'+url;
      }
      return url;
    };

    mo.getProtocol = function(url){
      var protocol = '';
      if(url.indexOf('https://') === 0){
        protocol = 'https';
      }
      else if(url.indexOf('http://') === 0){
        protocol = 'http';
      }
      return protocol;
    };

    mo.setHttpProtocol = function(_url){
      _url = mo.addProtocol(_url);
      var reg = /^https:\/\//;
      var url = _url.replace(reg, 'http://');
      return url;
    };

    mo.setHttpsProtocol = function(_url){
      _url = mo.addProtocol(_url);
      var reg = /^http:\/\//;
      var url = _url.replace(reg, 'https://');
      return url;
    };

    mo.getSharingUrl = function(_portalUrl){
      var sharingUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        sharingUrl = portalUrl + '/sharing';
      }
      return sharingUrl;
    };

    mo.getOAuth2Url = function(_portalUrl){
      var oauth2Url = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        oauth2Url = portalUrl + '/sharing/oauth2';
      }
      return oauth2Url;
    };

    mo.getAppIdUrl = function(_portalUrl, _appId){
      var appIdUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        appIdUrl = portalUrl + '/sharing/oauth2/apps/' + _appId;
      }
      return appIdUrl;
    };

    mo.getSignInUrl = function(_portalUrl){
      var signInUrl = "";
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        signInUrl = portalUrl + "/home/signin.html";
      }
      return signInUrl;
    };

    mo.getBaseSearchUrl = function(_portalUrl){
      var searchUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      portalUrl = portalUrl.replace(/\/*$/g, '');
      if(portalUrl){
        searchUrl = portalUrl + '/' + 'sharing/rest/search';
      }
      return searchUrl;
    };

    mo.getBaseItemUrl = function(_portalUrl){
      var baseItemUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        baseItemUrl = portalUrl + '/sharing/rest/content/items';
      }
      return baseItemUrl;
    };

    mo.getItemUrl = function(_portalUrl, _itemId){
      var itemUrl = '';
      var baseItemUrl = mo.getBaseItemUrl(_portalUrl);
      if(baseItemUrl && _itemId){
        itemUrl = baseItemUrl + '/' + _itemId;
      }
      return itemUrl;
    };

    mo.getItemDataUrl = function(_portalUrl,_itemId){
      var itemDataUrl = '';
      var itemUrl = mo.getItemUrl(_portalUrl,_itemId);
      if(itemUrl){
        itemDataUrl = itemUrl + '/data';
      }
      return itemDataUrl;
    };

    mo.getGenerateTokenUrl = function(_portalUrl){
      var tokenUrl = '';
      if(_portalUrl){
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        tokenUrl = _portalUrl + '/sharing/generateToken';
      }
      return tokenUrl;
    };

    mo.getItemDetailsPageUrl = function(_portalUrl,_itemId){
      var url = '';
      if(_portalUrl && _itemId){
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        url = _portalUrl + "/home/item.html?id=" + _itemId;
      }
      return url;
    };

    mo.getUserProfilePageUrl = function(_portalUrl,_user){
      var url = '';
      if(_portalUrl && _user){
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        url = _portalUrl + '/home/user.html?user=' + _user;
      }
      return url;
    };

    mo.getBaseGroupUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/rest/community/groups';
      }
      return url;
    };

    mo.getPortalSelfInfoUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = _portalUrl||'';
      thePortalUrl = mo.getStandardPortalUrl(thePortalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/portals/self';
      }
      return url;
    };

    mo.getCommunitySelfUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = _portalUrl||'';
      thePortalUrl = mo.getStandardPortalUrl(thePortalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/rest/community/self';
      }
      return url;
    };

    mo.getBaseUserUrl = function(_portalUrl){
      var baseUserUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        baseUserUrl = portalUrl + '/sharing/rest/community/users';
      }
      return baseUserUrl;
    };

    mo.getUserUrl = function(_portalUrl, _userId){
      var userUrl = '';
      var baseUserUrl = mo.getBaseUserUrl(_portalUrl);
      if(_portalUrl && _userId){
        userUrl = baseUserUrl + '/' + _userId;
      }
      return userUrl;
    };

    mo.getUserTagsUrl = function(_portalUrl, _userId){
      var userTagsUrl = '';
      var userUrl = mo.getUserUrl(_portalUrl, _userId);
      if(_portalUrl && _userId){
        userTagsUrl = userUrl + '/tags';
      }
      return userTagsUrl;
    };

    mo.getContentUrl = function(_portalUrl){
      var contentUrl = '';
      if(_portalUrl) {
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        contentUrl = _portalUrl + '/sharing/rest/content';
      }
      return contentUrl;
    };

    mo.getUserContentUrl = function(_portalUrl, _user, _folderId){
      var contentUrl = '', userContentUrl = '';
      if(_portalUrl && _user) {
        contentUrl = mo.getContentUrl(_portalUrl);
        if(_folderId) {
          userContentUrl = contentUrl + '/users/' + _user + '/' + _folderId;
        } else {
          userContentUrl = contentUrl + '/users/' + _user;
        }
      }
      return userContentUrl;
    };

    mo.getAddItemUrl = function(_portalUrl, _user, _folderId){
      var userContentUrl = '', addItemUrl = '';
      if(_portalUrl && _user) {
        userContentUrl = mo.getUserContentUrl(_portalUrl, _user, _folderId);
        addItemUrl = userContentUrl + '/addItem' ;
      }
      return addItemUrl;
    };

    mo.getDeleteItemUrl = function(_portalUrl, _user, _itemId){
      var deleteItemUrl = '';
      var userItemsUrl = mo.getUserItemsUrl(_portalUrl, _user);
      if(userItemsUrl){
        deleteItemUrl = userItemsUrl + '/' + _itemId + '/delete';
      }
      return deleteItemUrl;
    };


    mo.getUserItemsUrl = function(_portalUrl, _user, _folderId) {
      var userContentUrl = '', userItemsUrl = '';
      if(_portalUrl && _user) {
        userContentUrl = mo.getUserContentUrl(_portalUrl, _user, _folderId);
        userItemsUrl = userContentUrl + '/items' ;
      }
      return userItemsUrl;
    };

    mo.getUpdateItemUrl = function(_portalUrl, _user, _itemId, _folderId) {
      var userItemsUrl = '', updateItem = '';
      if(_portalUrl && _user) {
        userItemsUrl = mo.getUserItemsUrl(_portalUrl, _user, _folderId);
        updateItem = userItemsUrl + '/' + _itemId + "/update";
      }
      return updateItem;
    };

    mo.shareItemUrl = function(_portalUrl, _user, _itemId, _folderId) {
      var userItemsUrl = '', shareItemUrl = '';
      if(_portalUrl && _user) {
        userItemsUrl = mo.getUserItemsUrl(_portalUrl, _user, _folderId);
        shareItemUrl = userItemsUrl + '/' + _itemId + "/share";
      }
      return shareItemUrl;
    };

    mo.getHomeIndexUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/index.html';
      }
      return url;
    };

    mo.getHomeGalleryUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/gallery.html';
      }
      return url;
    };

    mo.getHomeGroupsUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/groups.html';
      }
      return url;
    };

    mo.getHomeMyContentUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/content.html';
      }
      return url;
    };

    mo.getHomeMyOrganizationUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/organization.html';
      }
      return url;
    };

    mo.getHomeUserUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/user.html';
      }
      return url;
    };

    mo.getPortalHelpUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/portalhelp/en/website/help/';
      }
      return url;
    };

    mo.getPortalProxyUrl = function(_portalUrl){
      //examples:
      //http://esridevbeijing.maps.arcgis.com/sharing/proxy
      //http://gallery.chn.esri.com/arcgis/sharing/proxy
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/proxy';
        url = url.replace('https://','http://');
      }
      return url;
    };

    mo.getOAuth2SignOutUrl = function(_portalUrl){
      var signOutUrl = "";
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        signOutUrl = portalUrl + '/sharing/oauth2/signout';//?redirect_uri=http://...
      }
      return signOutUrl;
    };

    //////////////////////////////////////////////////
    //these functions are for integrated version only
    //////////////////////////////////////////////////
    mo.getPortalUrlFromLocation = function (){
      var portalUrl = mo.getPortalServerFromLocation() +  mo.getDeployContextFromLocation();
      return portalUrl;
    };

    mo.getPortalSignInUrlFromLocation = function(){
      var portalUrl = mo.getPortalUrlFromLocation();
      var url = portalUrl + 'home/signin.html';
      return url;
    };

    mo.getPortalServerFromLocation = function(){
      var server = window.location.protocol + '//' + window.location.host;
      return server;
    };

    mo.getDeployContextFromLocation = function (){
      var url = window.location.href.split("?")[0];

      var keyIndex = url.indexOf("/home");
      if(keyIndex < 0){
        keyIndex = url.indexOf("/apps");
      }
      var context = url.substring(url.indexOf(window.location.host) + window.location.host.length + 1, keyIndex);
      if (context !== "/") {
        context = "/" + context + "/";
      }
      return context;
    };

    mo.getRestBaseUrlFromLocation = function (){
      var restBaseUrl = window.location.protocol + '//' + window.location.host +  mo.getDeployContextFromLocation() + 'sharing/rest/';
      return restBaseUrl;
    };
    //----------------------end--------------------------//
    return mo;
  });
