/**
 * Created by ahjung.kim on 1/14/2015.
 */
define([
        "dojo/Evented",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "esri/kernel",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/on",
        // load template
        "dojo/text!application/dijit/templates/TableOfContents.html",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-construct",
        "dojo/_base/event",
        "dojo/_base/array"
    ],
    function (
        Evented,
        declare,
        lang,
        has, esriNS,
        _WidgetBase, _TemplatedMixin,
        on,
        dijitTemplate,
        domClass, domStyle, domConstruct,
        event,
        array
    ) {
        var Widget = declare("esri.dijit.TableOfContents", [_WidgetBase, _TemplatedMixin, Evented], {
            templateString: dijitTemplate,
            // defaults
            options: {
                theme: "TableOfContents",
                map: null,
                layers: null,
                visible: true
            },
            // lifecycle: 1
            constructor: function(options, srcRefNode) {
                // mix in settings and defaults
                var defaults = lang.mixin({}, this.options, options);
                // widget node
                this.domNode = srcRefNode;
                // properties
                this.set("map", defaults.map);
                this.set("layers", defaults.layers);
                this.set("theme", defaults.theme);
                this.set("visible", defaults.visible);
                // listeners
                this.watch("theme", this._updateThemeWatch);
                this.watch("visible", this._visible);
                this.watch("layers", this._refreshLayers);
                this.watch("map", this.refresh);
                // classes
                this.css = {
                    container: "toc-container",
                    layer: "toc-layer",
                    firstLayer: "toc-first-layer",
                    title: "toc-title",
                    titleContainer: "toc-title-container",
                    content: "toc-content",
                    titleCheckbox: "toc-checkbox",
                    checkboxCheck: "icon-check-1",
                    titleText: "toc-text",
                    accountText: "toc-account",
                    visible: "toc-visible",
                    settingsIcon: "icon-cog",
                    settings: "toc-settings",
                    actions: "toc-actions",
                    account: "toc-account",
                    clear: "clear"
                };
            },
            // start widget. called by user
            startup: function() {
                // map not defined
                if (!this.map) {
                    this.destroy();
                    console.log('TableOfContents::map required');
                }
                // when map is loaded
                if (this.map.loaded) {
                    this._init();
                } else {
                    on.once(this.map, "load", lang.hitch(this, function() {
                        this._init();
                    }));
                }
            },
            // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
            destroy: function() {
                this._removeEvents();
                this.inherited(arguments);
            },
            /* ---------------- */
            /* Public Events */
            /* ---------------- */
            // load
            // toggle
            // expand
            // collapse
            /* ---------------- */
            /* Public Functions */
            /* ---------------- */
            show: function() {
                this.set("visible", true);
            },
            hide: function() {
                this.set("visible", false);
            },
            refresh: function() {
                this._createList();
            },
            /* ---------------- */
            /* Private Functions */
            /* ---------------- */
            _createList: function() {
                var layers = this.get("layers");
                this._nodes = [];
                // kill events
                this._removeEvents();
                // clear node
                this._layersNode.innerHTML = '';
                // if we got layers
                if (layers && layers.length) {
                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];
                        // ceckbox class
                        var titleCheckBoxClass = this.css.titleCheckbox;
                        // layer class
                        var layerClass = this.css.layer;
                        // first layer
                        if (i === (layers.length - 1)) {
                            layerClass += ' ';
                            layerClass += this.css.firstLayer;
                        }
                        if (layer.visibility) {
                            layerClass += ' ';
                            layerClass += this.css.visible;
                            titleCheckBoxClass += ' ';
                            titleCheckBoxClass += this.css.checkboxCheck;
                        }
                        // layer node
                        var layerDiv = domConstruct.create("div", {
                            className: layerClass
                        });
                        domConstruct.place(layerDiv, this._layersNode, "first");
                        // title of layer
                        var titleDiv = domConstruct.create("div", {
                            className: this.css.title
                        });
                        domConstruct.place(titleDiv, layerDiv, "last");
                        // title container
                        var titleContainerDiv = domConstruct.create("div", {
                            className: this.css.titleContainer
                        });
                        domConstruct.place(titleContainerDiv, titleDiv, "last");
                        // Title checkbox
                        var titleCheckbox = domConstruct.create("div", {
                            className: titleCheckBoxClass
                        });
                        domConstruct.place(titleCheckbox, titleContainerDiv, "last");
                        // Title text
                        var titleText = domConstruct.create("div", {
                            className: this.css.titleText,
                            title: layer.title,
                            innerHTML: layer.title
                        });
                        domConstruct.place(titleText, titleContainerDiv, "last");
                        // Account text
                        var accountText;
                        if(layer.account){
                            accountText = domConstruct.create("a", {
                                className: this.css.accountText,
                                id: layer.account
                            });
                            domConstruct.place(accountText, titleText, "last");
                        }
                        // settings
                        var settingsDiv, settingsIcon;
                        if(layer.settings){
                            settingsDiv = domConstruct.create("div", {
                                className: this.css.settings,
                                id: layer.settings
                            });
                            domConstruct.place(settingsDiv, titleContainerDiv, "last");
                            // settings icon
                            settingsIcon = domConstruct.create("div", {
                                className: this.css.settingsIcon
                            });
                            domConstruct.place(settingsIcon, settingsDiv, "last");
                        }
                        // clear css
                        var clearCSS = domConstruct.create("div", {
                            className: this.css.clear
                        });
                        domConstruct.place(clearCSS, titleContainerDiv, "last");
                        // lets save all the nodes for events
                        var nodesObj = {
                            checkbox: titleCheckbox,
                            title: titleDiv,
                            titleContainer: titleContainerDiv,
                            titleText: titleText,
                            accountText: accountText,
                            settingsIcon: settingsIcon,
                            settingsDiv: settingsDiv,
                            layer: layerDiv
                        };
                        this._nodes.push(nodesObj);
                        // create click event
                        this._checkboxEvent(i);
                    }
                    this._setLayerEvents();
                }
            },
            _refreshLayers: function(){
                this.refresh();
            },
            _removeEvents: function() {
                var i;
                // checkbox click events
                if (this._checkEvents && this._checkEvents.length) {
                    for (i = 0; i < this._checkEvents.length; i++) {
                        this._checkEvents[i].remove();
                    }
                }
                // layer visibility events
                if (this._layerEvents && this._layerEvents.length) {
                    for (i = 0; i < this._layerEvents.length; i++) {
                        this._layerEvents[i].remove();
                    }
                }
                this._checkEvents = [];
                this._layerEvents = [];
            },
            _toggleVisible: function(index, visible) {
                // update checkbox and layer visibility classes
                domClass.toggle(this._nodes[index].layer, this.css.visible, visible);
                domClass.toggle(this._nodes[index].checkbox, this.css.checkboxCheck, visible);
                this.emit("toggle", {
                    index: index,
                    visible: visible
                });
            },
            _layerEvent: function(layer, index) {
                // layer visibility changes
                var visChange = on(layer, 'visibility-change', lang.hitch(this, function(evt) {
                    // update checkbox and layer visibility classes
                    this._toggleVisible(index, evt.visible);
                }));
                this._layerEvents.push(visChange);
            },
            _featureCollectionVisible: function(layer, index, visible){
                // all layers either visible or not
                var equal;
                // feature collection layers turned on by default
                var visibleLayers = layer.visibleLayers;
                // feature collection layers
                var layers = layer.featureCollection.layers;
                // if we have layers set
                if(visibleLayers && visibleLayers.length){
                    // check if all layers have same visibility
                    equal = array.every(visibleLayers, function(item){
                        // check if current layer has same as first layer
                        return layers[item].layerObject.visible === visible;
                    });
                }
                else {
                    // check if all layers have same visibility
                    equal = array.every(layers, function(item){
                        // check if current layer has same as first layer
                        return item.layerObject.visible === visible;
                    });
                }
                // all are the same
                if(equal){
                    this._toggleVisible(index, visible);
                }
            },
            _createFeatureLayerEvent: function(layer, index, i){
                var layers = layer.featureCollection.layers;
                // layer visibility changes
                var visChange = on(layers[i].layerObject, 'visibility-change', lang.hitch(this, function(evt) {
                    var visible = evt.visible;
                    this._featureCollectionVisible(layer, index, visible);
                }));
                this._layerEvents.push(visChange);
            },
            _featureLayerEvent: function(layer, index){
                // feature collection layers
                var layers = layer.featureCollection.layers;
                if(layers && layers.length){
                    // make event for each layer
                    for(var i = 0; i < layers.length; i++){
                        this._createFeatureLayerEvent(layer, index, i);
                    }
                }
            },
            _setLayerEvents: function() {
                // this function sets up all the events for layers
                var layers = this.get("layers");
                var layerObject;
                if (layers && layers.length) {
                    // get all layers
                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];
                        // if it is a feature collection with layers
                        if (layer.featureCollection && layer.featureCollection.layers && layer.featureCollection.layers.length) {
                            this._featureLayerEvent(layer, i);
                        } else {
                            // 1 layer object
                            layerObject = layer.layerObject;
                            this._layerEvent(layerObject, i);
                        }
                    }
                }
            },
            _toggleLayer: function(layerIndex) {
                // all layers
                if (this.layers && this.layers.length) {
                    var newVis;
                    var layer = this.layers[layerIndex];
                    var layerObject = layer.layerObject;
                    var featureCollection = layer.featureCollection;
                    var visibleLayers;
                    var i;
                    if (featureCollection) {
                        // visible feature layers
                        visibleLayers = layer.visibleLayers;
                        // new visibility
                        newVis = !layer.visibility;
                        // set visibility for layer reference
                        layer.visibility = newVis;
                        // toggle all feature collection layers
                        if (visibleLayers && visibleLayers.length) {
                            // toggle visible sub layers
                            for (i = 0; i < visibleLayers.length; i++) {
                                layerObject = featureCollection.layers[visibleLayers[i]].layerObject;
                                // toggle to new visibility
                                layerObject.setVisibility(newVis);
                            }
                        }
                        else{
                            // toggle all sub layers
                            for (i = 0; i < featureCollection.layers.length; i++) {
                                layerObject = featureCollection.layers[i].layerObject;
                                // toggle to new visibility
                                layerObject.setVisibility(newVis);
                            }
                        }
                    } else if(layerObject) {
                        newVis = !layer.layerObject.visible;
                        layer.visibility = newVis;
                        layerObject.setVisibility(newVis);
                    }
                }
            },
            _checkboxEvent: function(index) {
                // when checkbox is clicked
                var checkEvent = on(this._nodes[index].checkbox, 'click', lang.hitch(this, function(evt) {
                    // toggle layer visibility
                    this._toggleLayer(index);
                    event.stop(evt);
                }));
                this._checkEvents.push(checkEvent);
                // when title is clicked
                var titleEvent = on(this._nodes[index].titleText, 'click', lang.hitch(this, function(evt) {
                    // toggle layer visibility
                    this._toggleLayer(index);
                    event.stop(evt);
                }));
                this._checkEvents.push(titleEvent);
            },
            _init: function() {
                this._visible();
                this._createList();
                this.set("loaded", true);
                this.emit("load", {});
            },
            _updateThemeWatch: function() {
                var oldVal = arguments[1];
                var newVal = arguments[2];
                domClass.remove(this.domNode, oldVal);
                domClass.add(this.domNode, newVal);
            },
            _visible: function() {
                if (this.get("visible")) {
                    domStyle.set(this.domNode, 'display', 'block');
                } else {
                    domStyle.set(this.domNode, 'display', 'none');
                }
            }
        });
        if (has("extend-esri")) {
            lang.setObject("dijit.TableOfContents", Widget, esriNS);
        }
        return Widget;
    });