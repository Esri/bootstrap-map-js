/*
Copyright ©2014 Esri. All rights reserved.
 
TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
Unpublished material - all rights reserved under the
Copyright Laws of the United States and applicable international
laws, treaties, and conventions.
 
For additional information, contact:
Attn: Contracts and Legal Department
Environmental Systems Research Institute, Inc.
380 New York Street
Redlands, California, 92373
USA
 
email: contracts@esri.com
*/

define([
  'dojo/_base/declare',
  'dojo/topic',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/_ItemSelector.html',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/Deferred',
  'dojo/promise/all',
  'dojo/query',
  'dojo/on',
  'jimu/utils',
  'jimu/portalUtils',
  'jimu/tokenUtils',
  'jimu/portalUrlUtils',
  'jimu/dijit/ViewStack',
  'jimu/dijit/Search',
  'jimu/dijit/TabContainer3',
  'jimu/dijit/_ItemTable',
  'dojo/i18n'
], function(declare, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
  Evented, lang, array, html, Deferred, all, query, on, jimuUtils, portalUtils, tokenUtils,
  portalUrlUtils, ViewStack, Search, TabContainer3,  _ItemTable, i18n) {/*jshint unused: false*/
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: "item-selector",
    tab: null,

    _user: null,
    _group: null,
    //public portal
    _allPublicPortalQuery: null,
    _filterPublicPortalQuery: null,
    //public ArcGIS.com
    _allPublicOnlineQuery: null,
    _filterPublicOnlineQuery: null,
    //organization
    _allOrganizationQuery: null,
    _filterOrganizationQuery: null,
    //my content
    _allMyContentQuery: null,
    _filterMyContentQuery: null,
    //group
    _allGroupQuery: null,
    _filterGroupQuery: null,

    _isPublicTabShow: false,
    _signIn:false,
    _itemTypeQueryString:'',

    //options:
    appConfig: null,//portalUrl(required),appId(optional)
    itemTypes: '',// such as ['Web Map'], ['Feature Service','Map Service']...
    
    //public methods:
    //getSelectedItem

    postMixInProperties: function(){
      if(!(this.itemTypes && this.itemTypes.length > 0)){
        this.itemTypes = [];
      }
      this._itemTypes = '';
      array.forEach(this.itemTypes,lang.hitch(this,function(type,index){
        this._itemTypes += '"'+ type +'"';
        if(index !== this.itemTypes.length-1){
          this._itemTypes += ',';
        }
      }));
      this._itemTypes = '['+this._itemTypes+']';

      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.itemSelector;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._initOptions();
      this._initSearchQuery();
      this._initTabs();
      this._initPortalRadio();
      this._initItemTables();
      this._initPublic();
      this._initPrivate();
      this._updateUIbySignIn();
    },

    _initOptions: function(){
      this._itemTypeQueryString = jimuUtils.getItemQueryStringByTypes(this.itemTypes);
      if(!this._itemTypeQueryString){
        throw "itemTypes is not a valid item type array.";
      }
    },

    _initTabs: function(){
      var tabMyContent = {
        title: this.nls.myContent,
        content: this.mycontentTabNode
      };

      var tabOrganization = {
        title: this.nls.myOrganization,
        content: this.organizationTabNode
      };

      var tabGroup = {
        title: this.nls.myGroup,
        content: this.groupTabNode
      };

      var tabPublic = {
        title: this.nls.publicMap,
        content: this.publicTabNode
      };

      var tabs = [tabMyContent, tabOrganization, tabGroup, tabPublic];

      this.tab = new TabContainer3({
        tabs: tabs
      }, this.tabNode);

      this.own(on(this.tab, "tabChanged", lang.hitch(this, function(title) {
        html.setStyle(this.signinSection, 'display', 'none');
        if (title !== this.nls.publicMap) {
          this._isPublicTabShow = false;
          this._updateUIbySignIn();
        } else {
          this._isPublicTabShow = true;
        }
      })));
    },

    _updateUIbySignIn: function(){
      html.setStyle(this.signinSection, 'display', 'none');
      var contentMains = query('.organization-tab-content-main,.group-tab-content-main,.mycontent-tab-content-main',this.domNode);
      var signIn = tokenUtils.userHaveSignInPortal(this._getPortalUrl());
      if (signIn) {
        contentMains.style('display','block');
      } else {
        contentMains.style('display','none');
        if(!this._isPublicTabShow){
          html.setStyle(this.signinSection, 'display', 'block');
        }
      }
    },

    _initPortalRadio: function(){
      var portalUrl = this._getPortalUrl();
      var portalServer = portalUrlUtils.getServerByUrl(portalUrl);
      if(portalUrlUtils.isArcGIScom(portalServer)){
        this.portalPublicRaido.disabled = true;
        this.onlinePublicRaido.checked = true;
        html.setStyle(this.portalPublicRaido,'display','none');
        html.setStyle(this.portalServer,'display','none');
      }
      else{
        this.portalPublicRaido.disabled = false;
        this.portalPublicRaido.checked = true;
        this.portalServer.innerHTML = portalServer;
      }
    },

    _initSearchQuery: function(){
      //portal public
      this._allPublicPortalQuery = this._getQuery({
        sortField:'numViews',
        sortOrder:'desc',
        q: this._itemTypeQueryString + ' AND access:public'
      });

      this._filterPublicPortalQuery = this._getQuery({
        q:this._itemTypeQueryString + ' AND access:public'
      });

      //ArcGIS.com public
      this._allPublicOnlineQuery = this._getQuery({
        sortField:'numViews',
        sortOrder:'desc',
        q:'(group:"c755678be14e4a0984af36a15f5b643e" OR group:"b8787a74b4d74f7fb9b8fac918735153") ' + this._itemTypeQueryString + ' AND access:public'
      });

      this._filterPublicOnlineQuery = this._getQuery({
        q:this._itemTypeQueryString + ' AND access:public'
      });

      //organization
      this._allOrganizationQuery = this._getQuery();
      this._filterOrganizationQuery = this._getQuery();

      //my content
      this._allMyContentQuery = this._getQuery();
      this._filterMyContentQuery = this._getQuery();

      //group
      this._allGroupQuery = this._getQuery();
      this._filterGroupQuery = this._getQuery();
    },

    _getQuery: function(other){
      var other2 = other||{};
      var query = lang.mixin({
        start:1,
        num:16,
        f:'json'
      },other2);
      return query;
    },

    _getPortalUrl: function(){
      var portalUrl = "";
      if(this.appConfig){
        portalUrl = this.appConfig.portalUrl;
      }
      portalUrl = portalUrlUtils.getStandardPortalUrl(portalUrl);
      return portalUrl;
    },

    _initItemTables: function(){
      //bind events
      this.own(on(this.publicPortalItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked)));
      this.own(on(this.publicOnlineItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked)));
      this.own(on(this.organizationItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked)));
      this.own(on(this.groupItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked)));
      this.own(on(this.mycontentItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked)));

      var portalUrl = this._getPortalUrl();
      //portal public
      if(!this.portalPublicRaido.disabled){
        this.publicPortalItemTable.set('portalUrl',portalUrl);
        this.publicPortalItemTable.searchAllItems(this._allPublicPortalQuery);
        this.publicPortalItemTable.set('filteredQuery',this._filterPublicPortalQuery);
      }

      //ArcGIS.com public
      this.publicOnlineItemTable.set('portalUrl','http://www.arcgis.com');
      this.publicOnlineItemTable.searchAllItems(this._allPublicOnlineQuery);
      this.publicOnlineItemTable.set('filteredQuery',this._filterPublicOnlineQuery);
    },

    _initPublic: function(){
      this.own(on(this.portalPublicRaido,'click',lang.hitch(this,this._onPublicRaidoClicked)));
      this.own(on(this.onlinePublicRaido,'click',lang.hitch(this,this._onPublicRaidoClicked)));
      this._onPublicRaidoClicked();
    },

    _onPublicRaidoClicked: function(){
      if(this.portalPublicRaido.checked){
        this.publicPortalItemTable.show();
        this.publicOnlineItemTable.hide();
      }
      else if(this.onlinePublicRaido.checked){
        this.publicPortalItemTable.hide();
        this.publicOnlineItemTable.show();
      }
    },

    _onPublicSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        this.publicPortalItemTable.showFilterItemsSection();
        this.publicOnlineItemTable.showFilterItemsSection();

        if (this.portalPublicRaido.checked) {
          this._filterPublicPortalQuery.q = text + this._itemTypeQueryString + ' AND access:public';
          this._filterPublicPortalQuery.start = 1;
          this.publicPortalItemTable.searchFilteredItems(this._filterPublicPortalQuery);
        } else if (this.onlinePublicRaido.checked) {
          this._filterPublicOnlineQuery.q = text + this._itemTypeQueryString + ' AND access:public';
          this._filterPublicOnlineQuery.start = 1;
          this.publicOnlineItemTable.searchFilteredItems(this._filterPublicOnlineQuery);
        }
      }
      else{
        //show all section
        this.publicPortalItemTable.showAllItemsSection();
        this.publicOnlineItemTable.showAllItemsSection();
      }
    },

    _initPrivate: function(){
      this._resetPortalMaps();
      // this.own(topic.subscribe('userSignIn', lang.hitch(this, this._onSignIn)));
      // this.own(topic.subscribe('userSignOut', lang.hitch(this, this._onSignOut)));
      // this.own(on(this.btnSignIn, 'click', lang.hitch(this, function() {
      //   tokenUtils.signInPortal(this._getPortalUrl(), this.appConfig.appId);
      // })));
      this.own(on(this.groupsSelect, 'change', lang.hitch(this, this._onGroupsSelectChange)));
      var portalServer = portalUrlUtils.getServerByUrl(this._getPortalUrl());
      if(portalUrlUtils.isArcGIScom(portalServer)){
        portalServer = 'ArcGIS.com';
      }
      this.signinSection.title = this.nls.signInTo+' '+portalServer;
      var signIn = tokenUtils.userHaveSignInPortal(this._getPortalUrl());
      if(signIn){
        this._onSignIn();
      }
    },

    _onOrganizationSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        if(this._allOrganizationQuery){
          var q = this._allOrganizationQuery.q;
          if(q){
            this._filterOrganizationQuery.q = text + ' ' + q;
            this._filterOrganizationQuery.start = 1;
            this.organizationItemTable.searchFilteredItems(this._filterOrganizationQuery);
          }
        }
      }
      else{
        //show all section
        this.organizationItemTable.showAllItemsSection();
      }
    },

    _onMyContentSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        if(this._allMyContentQuery){
          var q = this._allMyContentQuery.q;
          if(q){
            this._filterMyContentQuery.q = text + ' ' + q;
            this._filterMyContentQuery.start = 1;
            this.mycontentItemTable.searchFilteredItems(this._filterMyContentQuery);
          }
        }
      }
      else{
        //show all section
        this.mycontentItemTable.showAllItemsSection();
      }
    },

    _onGroupSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        if(this._allGroupQuery){
          var q = this._allGroupQuery.q;
          if(q){
            this._filterGroupQuery.q = text + ' ' + q;
            this._filterGroupQuery.start = 1;
            this.groupItemTable.searchFilteredItems(this._filterGroupQuery);
          }
        }
      }
      else{
        this.groupItemTable.showAllItemsSection();
      }
    },

    _onSignIn: function(){
      this._updateUIbySignIn();
      if(this._signIn){
        return;
      }
      this._signIn = true;
      var portalUrl = this._getPortalUrl();
      var portal = portalUtils.getPortal(portalUrl);
      portal.getUser().then(lang.hitch(this, function(user){
        if(!this.domNode){
          return;
        }
        this._resetPortalMaps();
        this._searchOrganization(user);
        this._searchMyContent(user);
        this._searchGroups(user);
      }));
    },

    _onSignOut: function(){
      this._signIn = false;
      this._resetPortalMaps();
      this._updateUIbySignIn();
    },

    _resetPortalMaps: function(){
      this.organizationItemTable.clear();
      this.mycontentItemTable.clear();
      this._resetGroupsSection();
    },

    _searchOrganization: function(user) {
      this.organizationItemTable.clear();
      var q = " orgid:" + user.orgId + " AND " + this._itemTypeQueryString + " AND (access:org OR access:public) ";
      var portalUrl = this._getPortalUrl();
      this._allOrganizationQuery = this._getQuery({q:q});
      this._filterOrganizationQuery = this._getQuery({q:q});
      this.organizationItemTable.set('portalUrl',portalUrl);
      this.organizationItemTable.searchAllItems(this._allOrganizationQuery);
    },

    _searchMyContent: function(user) {
      this.mycontentItemTable.clear();
      var portalUrl = this._getPortalUrl();
      var q = "owner:" + user.username + " AND " + this._itemTypeQueryString;
      this._allMyContentQuery = this._getQuery({q:q});
      this._filterMyContentQuery = this._getQuery({q:q});
      this.mycontentItemTable.set('portalUrl',portalUrl);
      this.mycontentItemTable.searchAllItems(this._allMyContentQuery);
    },

    _searchGroups: function(user){
      this._resetGroupsSection();
      html.setStyle(this.groupsSection, "display", "block");
      var groups = user.getGroups();
      if (groups.length > 0) {
        html.setStyle(this.groupSearch.domNode, 'display', 'block');
        this.groupItemTable.show();
        html.empty(this.groupsSelect);
        for (var i = 0; i < groups.length; i++) {
          var group = groups[i];
          html.create("option", {
            value: group.id,
            innerHTML: group.title
          }, this.groupsSelect);
        }
        this._onGroupsSelectChange();
      }
      this._updateUIbyGroups(groups.length);
    },

    _resetGroupsSection: function(){
      html.setStyle(this.groupsSection, "display", "none");
      html.empty(this.groupsSelect);
      html.create("option", {
        value: 'nodata',
        innerHTML: this.nls.noneGroups
      }, this.groupsSelect);
      this.groupItemTable.clear();
      html.setStyle(this.groupSearch.domNode,'display','none');
      this.groupItemTable.hide();
      this._updateUIbyGroups(0);
    },

    _updateUIbyGroups: function(groupIdsCount){
      if(groupIdsCount === 0){
        html.setStyle(this.groupsSection,'top','15px');
      }
      else{
        html.setStyle(this.groupsSection,'top','50px');
      }
    },

    _onGroupsSelectChange: function(){
      var groupId = this.groupsSelect.value;
      this.groupItemTable.clear();
      if (groupId === 'nodata') {
        html.setStyle(this.groupSearch,'display','none');
        this.groupItemTable.hide();
      }
      else{
        html.setStyle(this.groupSearch,'display','block');
        this.groupItemTable.show();
        var portalUrl = this._getPortalUrl();
        var q = "group:" + groupId + " AND " + this._itemTypeQueryString;
        this._allGroupQuery = this._getQuery({q:q});
        this._filterGroupQuery = this._getQuery({q:q});
        this.groupItemTable.set('portalUrl',portalUrl);
        this.groupItemTable.searchAllItems(this._allGroupQuery);
      }
    },

    _onItemDomClicked: function(itemDiv){
      var isSelected = html.hasClass(itemDiv, 'selected');
      query('.item-div.selected', this.domNode).removeClass('selected');
      if(isSelected){
        html.addClass(itemDiv, 'selected');
      }
      var item = this.getSelectedItem();
      if(item){
        this.emit('item-selected', item);
      }
      else{
        this.emit('none-item-selected');
      }
    },

    getSelectedItem: function(){
      var item = null;
      var itemDivs = query('.item-div.selected', this.domNode);
      if(itemDivs.length > 0){
        var itemDiv = itemDivs[0];
        item = lang.mixin({}, itemDiv.item);
      }
      return item;
    }
  });
});