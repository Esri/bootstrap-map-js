define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/lang',
  'dojo/query',
  'dojo/on',
  'jimu/dijit/DropMenu',
  'dijit/_TemplatedMixin',
  'dijit/form/HorizontalSlider',
  'dijit/form/HorizontalRuleLabels',
  'dojo/text!./PopupMenu.html',
  'dojo/dom-style'
], function(declare, array, html, lang, query, on, DropMenu, _TemplatedMixin, HorizSlider, HorzRuleLabels, template, domStyle) {
  return declare([DropMenu, _TemplatedMixin], {
    templateString: template,
    _deniedItems: null,

    _getDropMenuPosition: function(){
      return {
        top: "15px",
        //left: "-107px"
        left: 12 - html.getStyle(this.dropMenuNode, 'width') + 'px'
      };
    },

    _getTransNodePosition: function() {
      return {
        top: "15px",
        //left: "-107px"
        left: -174 - html.getStyle(this.dropMenuNode, 'width') + 'px'
      };
    },

    _onBtnClick: function(){
      if(!this.dropMenuNode){
        this._createDropMenuNode();
        this.own(on(this.dropMenuNode, 'click', lang.hitch(this, function(evt){
          evt.stopPropagation();
        })));
      }
    },

    // will call after openDropMenu 
    _refresh: function() {
      this._denyItems();
    },

    _denyItems: function() {
      var itemNodes = query("div[class~='menu-item']", this.dropMenuNode).forEach(function(itemNode){
        html.removeClass(itemNode, "menu-item-dissable");
      });
      array.forEach(this._deniedItems, function(item) {
        itemNodes.forEach(function(itemNode){
          if (html.getAttr(itemNode, 'innerHTML') === item) {
            html.addClass(itemNode, "menu-item-dissable");
          }
        });
      }, this);
    },

    selectItem: function(item){
      var index = this._deniedItems.indexOf(item);
      if (index === -1) {
        this.emit('onMenuClick', item);
      }
    },

    openDropMenu: function(deniedItems){
      if (deniedItems) {
        this._deniedItems = deniedItems;
      } else {
        this._deniedItems = [];
      }
      this._refresh();
      this.inherited(arguments);
    },

    closeDropMenu: function(){
      this.inherited(arguments);
      this.hideTransNode();
    },

    // about transparcency
    _onTransparencyDivClick: function(evt) {
      // summary:
      //    response to click transparency in popummenu.
      evt.stopPropagation();
    },

    showTransNode: function(transValue) {
      if (!this.transHorizSlider) {
        this._createTransparencyWidget();
        this.transHorizSlider.set("value", 1 - transValue);
      }
      domStyle.set(this.transparencyDiv, "top", this._getTransNodePosition().top);
      domStyle.set(this.transparencyDiv, "left", this._getTransNodePosition().left);
      domStyle.set(this.transparencyDiv, "display", "block");
    },

    hideTransNode: function() {
      domStyle.set(this.transparencyDiv, "display", "none");
    },

    _createTransparencyWidget: function() {
      this.transHorizSlider= new HorizSlider({
        minimum: 0,
        maximum: 1,
        intermediateChanges: true
      }, this.transparencyBody);

      this.own(this.transHorizSlider.on("change", lang.hitch(this, function(newTransValue){
        var data = {newTransValue: newTransValue};
        this.emit('onMenuClick', 'transparencyChanged', data);
      })));

      new HorzRuleLabels({
        container: "bottomDecoration"
      }, this.transparencyRule);
    }
    

  });
});
