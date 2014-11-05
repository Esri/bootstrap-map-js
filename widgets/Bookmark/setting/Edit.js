define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/_base/html',
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/query",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/registry",
    "jimu/BaseWidgetSetting",
    "jimu/dijit/Message",
    'esri/SpatialReference',
    'esri/geometry/Extent',
    'jimu/dijit/ImageChooser',
    'jimu/dijit/ExtentChooser',
    "dojo/text!./Edit.html"
  ],
  function(
    declare,
    lang,
    array,
    html,
    on,
    domStyle,
    domAttr,
    query,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    registry,
    BaseWidgetSetting,
    Message,
    SpatialReference,
    Extent,
    ImageChooser,
    ExtentChooser,
    template
    ){
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: "jimu-Bookmark-Edit",
      ImageChooser: null,
      templateString: template,
      extent:  {},
      portalUrl: null,
      itemId: null,

      postCreate: function(){
        this.inherited(arguments);
        this.imageChooser = new ImageChooser({
          displayImg: this.showImageChooser
        });
        this.own(on(this.name, 'Change', lang.hitch(this, '_onNameChange')));
        // html.addClass(this.imageChooser.domNode, 'thumbnail-img');
        html.addClass(this.imageChooser.domNode, 'img-chooser');
        html.place(this.imageChooser.domNode, this.imageChooserBase, 'replace');
        this.own(on(this.imageChooser, 'imageChange', lang.hitch(this, this.imageChange)));
        this.own(on(this.thumbnail, 'change', lang.hitch(this, this.onThumbnailChange)));
        domAttr.set(this.showImageChooser, 'src', this.folderUrl + "images/thumbnail_default.png");
      },

      setConfig: function(bookmark){
        var thumbnail;

        if (bookmark.name){
          this.name.set('value', bookmark.name);
        }
        if (bookmark.thumbnail){
          this.thumbnail.set('value', bookmark.thumbnail);
        }
        // if(bookmark.thumbnail && bookmark.thumbnail.startWith('data:')){
        //     thumbnail = bookmark.thumbnail;
        //   }else if(bookmark.thumbnail){
        //     thumbnail = this.folderUrl + bookmark.thumbnail;
        //   }else{
        //     thumbnail = this.folderUrl + 'images/thumbnail_default.png';
        //   }
        if (bookmark.extent){
          //this.extentChooser.setExtent(new Extent(ext));
          this.extentChooser = new ExtentChooser({
            portalUrl : this.portalUrl,
            itemId: this.itemId,
            initExtent: new Extent(bookmark.extent)
          }, this.extentChooserNode);
        }else{
          this.extentChooser = new ExtentChooser({
            portalUrl : this.portalUrl,
            itemId: this.itemId
          }, this.extentChooserNode);
        }
        //this.name.value = bookmark.name;
        html.setAttr(this.imageChooserBase, 'src', thumbnail);
        this.own(on(this.extentChooser, 'extentChange', lang.hitch(this, this._onExtentChange)));
        // this.currentBookmark = bookmark;
      },

      getConfig: function(){
        var bookmark = {
          name: this.name.get("value"),
          extent: this.extentChooser.getExtent(),
          thumbnail: this.thumbnail.get("value")
        };
        return bookmark;
      },

      onThumbnailChange: function(){
        var value = this.thumbnail.get('value');
        if (value.indexOf('data:image') > -1){
          domAttr.set(this.showImageChooser, 'src', value);
        }else{
          domAttr.set(this.showImageChooser, 'src', this.folderUrl + value);
        }
        var height = html.getMarginBox(this.showImageChooser).h;
        html.setStyle(this.imageChooser.domNode, 'height', height+"px");
      },

      imageChange: function(data){
        this.thumbnail.set('value', data);
      },

      _onNameChange: function(){
        this._checkRequiredField();
      },

      _onExtentChange: function(extent){
        this.currentExtent = extent;
      },

      _checkRequiredField: function(){
        if (!this.name.get('value')){
          if (this.popup){
            this.popup.disableButton(0);
          }
        }else{
          if (this.popup){
            this.popup.enableButton(0);
          }
        }
      }
    });
  });