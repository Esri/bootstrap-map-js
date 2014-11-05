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
    'jimu/dijit/ImageChooser',
    "dojo/text!./Edit.html",
    "jimu/dijit/ServiceURLInput",
    "dijit/form/ValidationTextBox"
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
    ImageChooser,
    template,
    ServiceURLInput){
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: "jimu-basemapgallery-Edit",
      ImageChooser: null,
      templateString: template,
      validUrl: false,
      mapName: null,
      subLayerUrlNum:  0,
      urlInputS: [],
      baseMapSRID: null,

      postCreate: function(){
        this.inherited(arguments);

        this.imageChooser = new ImageChooser({
          displayImg: this.showImageChooser
        });
        html.addClass(this.imageChooser.domNode, 'thumbnail-img');
        html.addClass(this.imageChooser.domNode, 'img-chooser');
        html.place(this.imageChooser.domNode, this.imageChooserBase, 'replace');
        this.own(on(this.imageChooser, 'imageChange', lang.hitch(this, this.imageChange)));
        this.own(on(this.thumbnail, 'change', lang.hitch(this, this.onThumbnailChange)));
        domAttr.set(this.showImageChooser, 'src', this.folderUrl + "images/default.jpg");
        

        this.own(on(this.url, 'Change', lang.hitch(this, '_onServiceUrlChange')));
        this.own(on(this.title, 'Change', lang.hitch(this, '_onBaseMapTitleChange')));
        this.own(on(this.url, 'Fetch', lang.hitch(this, '_onServiceFetch')));
        this.own(on(this.url, 'FetchError', lang.hitch(this, '_onServiceFetchError')));
      },

      setConfig: function(config){
        if (config.title){
          this.title.set('value', config.title);
        }
        if (config.thumbnailUrl){
          this.thumbnail.set('value', config.thumbnailUrl);
        }
        if (config.layers){
          this.urlInputS = [];
          var numLayer = config.layers.length;
          this.url.set('value', config.layers[0].url);
          if (numLayer > 1){
            for (var j = 0; j < numLayer-1; j++){
              this.onAddLayerUrl();
              var urlStr = config.layers[j+1].url;
              this.urlInputS[j].set("value",urlStr);
            }
          }
        }
      },

      getConfig: function(){
        var baseMapLayers = [];
        baseMapLayers.push({
          url: this.url.get("value")
        });
        var numLayer = this.urlInputS.length;
        for (var i = 0; i < numLayer; i++){
          baseMapLayers.push({
            url: this.urlInputS[i].get("value")
          });
        }
        var basemap = {
          title: this.title.get("value"),
          thumbnailUrl: this.thumbnail.get("value"),
          layers: baseMapLayers
        };
        return basemap;
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

      _onServiceUrlChange: function(){
        this.validUrl = false;
        this._checkRequiredField();
      },

      _onBaseMapTitleChange: function(){
        this._checkRequiredField();
      },

      _checkRequiredField: function(){
        if (!this.validUrl || !this.title.get('value')){
          if (this.popup){
            this.popup.disableButton(0);
          }
        }else{
          if (this.popup){
            this.popup.enableButton(0);
          }
        }
      },

      _onServiceFetch: function(evt){
        var data = evt.data;
        var spid = null;
        var def = evt.deferred;
        // 1. valid basemap 2. image service
        if ( (data && data.mapName && data.singleFusedMapCache) ) {
          spid = data.spatialReference.wkid;
          if (spid !== this.baseMapSRID){
            this.validUrl = false;
            new Message({
              message: this.nls.spError +
              "\n\r The WKID of base map is "+ this.baseMapSRID +
              "\n\r The WKID of this map is "+ spid
            });
          }
          this.mapName = data.mapName;
          this.validUrl = true;
          def.resolve('success');
        }else if (data && data.serviceDataType) {
          alert("image layer");
          this.mapName = data.name;
          this.validUrl = true;
          def.resolve('success');
        }else {
          def.reject('invalid service');
        }
        
        if (this.validUrl){
          this._checkRequiredField();
        }
      },

      _onServiceFetchError: function(){
        new Message({
          message: this.nls.warning
        });
      },

      onAddLayerUrl: function(){
        this.subLayerUrlNum ++ ;
        var A = '<tr><td class="first"></td><td class="second"></td><td class="third"></td></tr>';
        var args = {
            placeHolder: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map_2/MapServer",
            required: true,
            style:{width:"100%"}
          };
        var tr = html.toDom(A);
        html.place(tr, this.addLayerTr,'before');
        var secTd = query(".second", tr)[0];
        var urlInput = new ServiceURLInput(args);
        urlInput.placeAt(secTd);

        var thiTd = query(".third", tr)[0];
        var C = '<span class="delete-layer-url-icon"></span>';
        var deletespan= html.toDom(C);
        html.place(deletespan, thiTd);

        this.own(on(urlInput, 'Fetch', lang.hitch(this, '_onServiceFetch')));
        this.own(on(urlInput, 'FetchError', lang.hitch(this, '_onServiceFetchError')));
        this.own(on(deletespan, 'click', lang.hitch(this, '_onDeleteClick')));

        urlInput.startup();
        this.urlInputS.push(urlInput);
      },

      _onDeleteClick:function(evt){
        var target = evt.target||evt.srcElement;
        var td = target.parentNode;
        var tr = td.parentNode;
        var urlInputTd = tr.childNodes[1];
        var urlInput = registry.byNode(urlInputTd.childNodes[0]);
        var urlInputIndex = array.indexOf(this.urlInputS,urlInput);
        this.urlInputS.splice(urlInputIndex,1);
        html.destroy(tr);
      }
    });
  });