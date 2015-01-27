define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    'dijit/_Container',
    'dijit/layout/ContentPane',
    'dijit/form/Button',
    'esri/tasks/ProjectParameters',
    'esri/config',
    'require',
    'xstyle/css!./LayerControl/css/LayerControl.css'
], function (
    declare,
    array,
    lang,
    topic,
    domAttr,
    domConst,
    WidgetBase,
    Container,
    ContentPane,
    Button,
    ProjectParameters,
    esriConfig,
    require
) {
    var LayerControl = declare([WidgetBase, Container], {
        map: null,
        layerInfos: [],
        icons: {
            expand: 'fa-plus-square-o',
            collapse: 'fa-minus-square-o',
            checked: 'fa-check-square-o',
            unchecked: 'fa-square-o',
            update: 'fa-refresh',
            menu: 'fa-bars',
            folder: 'fa-folder-o',
            folderOpen: 'fa-folder-open-o'
        },
        separated: false,
        overlayReorder: false,
        overlayLabel: false,
        vectorReorder: false,
        vectorLabel: false,
        noMenu: null,
        noLegend: null,
        noZoom: null,
        noTransparency: null,
        swipe: null,
        swiperButtonStyle: 'position:absolute;top:20px;left:120px;z-index:50;',
        // ^args
        baseClass: 'layerControlDijit',
        _vectorContainer: null,
        _overlayContainer: null,
        _swiper: null,
        _swipeLayerToggleHandle: null,
        _controls: {
            dynamic: './LayerControl/controls/Dynamic',
            feature: './LayerControl/controls/Feature',
            image: './LayerControl/controls/Image',
            tiled: './LayerControl/controls/Tiled',
            csv: './LayerControl/controls/CSV',
            georss: './LayerControl/controls/GeoRSS',
            wms: './LayerControl/controls/WMS',
            kml: './LayerControl/controls/KML'
        },
        constructor: function (options) {
            options = options || {};
            if (!options.map) {
                topic.publish('viewer/handleError', {
                    source: 'LayerControl',
                    error: 'map option is required'
                });
                return;
            }
        },
        postCreate: function () {
            this.inherited(arguments);
            if (this.separated) {
                var ControlContainer = declare([WidgetBase, Container]);
                // vector layer label
                if (this.vectorLabel !== false) {
                    this.addChild(new ContentPane({
                        className: 'vectorLabelContainer',
                        content: this.vectorLabel
                    }, domConst.create('div')), 'first');
                }
                // vector layer control container
                this._vectorContainer = new ControlContainer({
                    className: 'vectorLayerContainer'
                }, domConst.create('div'));
                this.addChild(this._vectorContainer, 'last');
                // overlay layer label
                if (this.overlayLabel !== false) {
                    this.addChild(new ContentPane({
                        className: 'overlayLabelContainer',
                        content: this.overlayLabel
                    }, domConst.create('div')), 'last');
                }
                // overlay layer control container
                this._overlayContainer = new ControlContainer({
                    className: 'overlayLayerContainer'
                }, domConst.create('div'));
                this.addChild(this._overlayContainer, 'last');
            } else {
                this.overlayReorder = false;
                this.vectorReorder = false;
            }
            // load only the modules we need
            var modules = [];
            // push layer control mods
            array.forEach(this.layerInfos, function (layerInfo) {
                // check if control is excluded
                var controlOptions = layerInfo.controlOptions;
                if (controlOptions && controlOptions.exclude === true) {
                    return;
                }
                var mod = this._controls[layerInfo.type];
                if (mod) {
                    modules.push(mod);
                } else {
                    topic.publish('viewer/handleError', {
                        source: 'LayerControl',
                        error: 'the layer type "' + layerInfo.type + '" is not supported'
                    });
                }
            }, this);
            // load and go
            require(modules, lang.hitch(this, function () {
                array.forEach(this.layerInfos, function (layerInfo) {
                    // exclude from widget
                    var controlOptions = layerInfo.controlOptions;
                    if (controlOptions && controlOptions.exclude === true) {
                        return;
                    }
                    var control = this._controls[layerInfo.type];
                    if (control) {
                        require([control], lang.hitch(this, '_addControl', layerInfo));
                    }
                }, this);
                this._checkReorder();
            }));
        },
        // create layer control and add to appropriate _container
        _addControl: function (layerInfo, LayerControl) {
            var layerControl = new LayerControl({
                controller: this,
                layer: (typeof layerInfo.layer === 'string') ? this.map.getLayer(layerInfo.layer) : layerInfo.layer, // check if we have a layer or just a layer id
                layerTitle: layerInfo.title,
                controlOptions: lang.mixin({
                    noLegend: null,
                    noZoom: null,
                    noTransparency: null,
                    swipe: null,
                    expanded: false,
                    sublayers: true
                }, layerInfo.controlOptions)
            });
            layerControl.startup();
            if (this.separated) {
                if (layerControl._layerType === 'overlay') {
                    this._overlayContainer.addChild(layerControl, 'first');
                } else {
                    this._vectorContainer.addChild(layerControl, 'first');
                }
            } else {
                this.addChild(layerControl, 'first');
            }
        },
        // move control up in controller and layer up in map
        _moveUp: function (control) {
            var id = control.layer.id,
                node = control.domNode,
                index;
            if (control._layerType === 'overlay') {
                if (control.getPreviousSibling()) {
                    index = array.indexOf(this.map.layerIds, id);
                    this.map.reorderLayer(id, index + 1);
                    this._overlayContainer.containerNode.insertBefore(node, node.previousSibling);
                    this._checkReorder();
                }
            } else if (control._layerType === 'vector') {
                if (control.getPreviousSibling()) {
                    index = array.indexOf(this.map.graphicsLayerIds, id);
                    this.map.reorderLayer(id, index + 1);
                    this._vectorContainer.containerNode.insertBefore(node, node.previousSibling);
                    this._checkReorder();
                }
            }
        },
        // move control down in controller and layer down in map
        _moveDown: function (control) {
            var id = control.layer.id,
                node = control.domNode,
                index;
            if (control._layerType === 'overlay') {
                if (control.getNextSibling()) {
                    index = array.indexOf(this.map.layerIds, id);
                    this.map.reorderLayer(id, index - 1);
                    this._overlayContainer.containerNode.insertBefore(node, node.nextSibling.nextSibling);
                    this._checkReorder();
                }
            } else if (control._layerType === 'vector') {
                if (control.getNextSibling()) {
                    index = array.indexOf(this.map.graphicsLayerIds, id);
                    this.map.reorderLayer(id, index - 1);
                    this._vectorContainer.containerNode.insertBefore(node, node.nextSibling.nextSibling);
                    this._checkReorder();
                }
            }
        },
        // enable/disable move up/down menu items when the last or first child respectively
        _checkReorder: function () {
            if (this.separated) {
                if (this.vectorReorder) {
                    array.forEach(this._vectorContainer.getChildren(), function (child) {
                        if (!child.getPreviousSibling()) {
                            child._reorderUp.set('disabled', true);
                        } else {
                            child._reorderUp.set('disabled', false);
                        }
                        if (!child.getNextSibling()) {
                            child._reorderDown.set('disabled', true);
                        } else {
                            child._reorderDown.set('disabled', false);
                        }
                    }, this);
                }
                if (this.overlayReorder) {
                    array.forEach(this._overlayContainer.getChildren(), function (child) {
                        if (!child.getPreviousSibling()) {
                            child._reorderUp.set('disabled', true);
                        } else {
                            child._reorderUp.set('disabled', false);
                        }
                        if (!child.getNextSibling()) {
                            child._reorderDown.set('disabled', true);
                        } else {
                            child._reorderDown.set('disabled', false);
                        }
                    }, this);
                }
            }
        },
        // zoom to layer
        _zoomToLayer: function (layer) {
            if (layer.declaredClass === 'esri.layers.KMLLayer') {
                return;
            }

            // need to "merge" each kml layers fullExtent for project geometries

            var map = this.map;
            if (layer.spatialReference === map.spatialReference) {
                map.setExtent(layer.fullExtent, true);
            } else {
                if (esriConfig.defaults.geometryService) {
                    esriConfig.defaults.geometryService.project(lang.mixin(new ProjectParameters(), {
                        geometries: [layer.fullExtent],
                        outSR: map.spatialReference
                    }), function (r) {
                        map.setExtent(r[0], true);
                    }, function (e) {
                        topic.publish('viewer/handleError', {
                            source: 'LayerControl._zoomToLayer',
                            error: e
                        });
                    });
                } else {
                    topic.publish('viewer/handleError', {
                        source: 'LayerControl._zoomToLayer',
                        error: 'esriConfig.defaults.geometryService is not set'
                    });
                }
            }
        },
        // layer swiper
        _swipeLayer: function (layer, type) {
            if (!layer || !layer.visible) {
                return;
            }
            if (!this._swiper) {
                require(['esri/dijit/LayerSwipe'], lang.hitch(this, function (LayerSwipe) {
                    this._swiper = new LayerSwipe({
                        type: type || 'vertical',
                        map: this.map,
                        layers: [layer]
                    }, domConst.create('div', {}, this.map.id, 'first'));
                    this._swiper.startup();
                    this._swiper.disableBtn = new Button({
                        label: 'Exit Layer Swipe',
                        onClick: lang.hitch(this, '_swipeDisable')
                    }, domConst.create('div', {}, this.map.id));
                    domAttr.set(this._swiper.disableBtn.domNode, 'style', this.swiperButtonStyle);
                }));
            } else {
                this._swiper.disable();
                if (this._swipeLayerToggleHandle) {
                    this._swipeLayerToggleHandle.remove();
                }
                this._swiper.set('layers', [layer]);
                this._swiper.set('type', type);
                this._swiper.enable();
                domAttr.set(this._swiper.disableBtn.domNode, 'style', this.swiperButtonStyle);
            }
            this._swipeLayerToggleHandle = topic.subscribe('layerControl/layerToggle', lang.hitch(this, function (d) {
                if (d.id === layer.id && !d.visible) {
                    this._swipeDisable();
                }
            }));
        },
        _swipeDisable: function () {
            this._swiper.disable();
            if (this._swipeLayerToggleHandle) {
                this._swipeLayerToggleHandle.remove();
            }
            domAttr.set(this._swiper.disableBtn.domNode, 'style', 'display:none;');
        },
        // turn all layers on/off
        //   no arguments
        //   b/c controls are self aware of layer visibility change simply show/hide layers
        showAllLayers: function () {
            if (this.separated) {
                array.forEach(this._vectorContainer.getChildren(), function (child) {
                    child.layer.show();
                });
                array.forEach(this._overlayContainer.getChildren(), function (child) {
                    child.layer.show();
                });
            } else {
                array.forEach(this.getChildren(), function (child) {
                    child.layer.show();
                });
            }
        },
        hideAllLayers: function () {
            if (this.separated) {
                array.forEach(this._vectorContainer.getChildren(), function (child) {
                    child.layer.hide();
                });
                array.forEach(this._overlayContainer.getChildren(), function (child) {
                    child.layer.hide();
                });
            } else {
                array.forEach(this.getChildren(), function (child) {
                    child.layer.hide();
                });
            }
        }
    });
    return LayerControl;
});