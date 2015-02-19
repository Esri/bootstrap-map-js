define([
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/has',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/html',
    'dijit/registry',
    'dojox/gfx',
    'esri/request',
    // temp
    'esri/dijit/Legend',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/i18n!./../nls/resource'
], function (
    array,
    lang,
    has,
    topic,
    domConst,
    domClass,
    domStyle,
    html,
    registry,
    gfx,
    esriRequest,
    Legend,
    esriBundle,
    i18n
) {
    'use strict';
    esriBundle.widgets.legend.NLS_noLegend = i18n.noLegend;
    return {
        /////////////////////
        // utility methods //
        /////////////////////
        // check controlOptions and controller to determine legend/no legend
        // aliases e.g. controlOptions.noLegend
        isLegend: function (controlOptions, controller) {
            if (controller === null || controller === false) {
                if (controlOptions === true) {
                    return false;
                } else {
                    return true;
                }
            } else if (controller === true) {
                if (controlOptions === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        // request legend json
        _legendRequest: function (layer, expandNode, callback, errback) {
            esriRequest({
                url: layer.url + '/legend',
                callbackParamName: 'callback',
                content: {
                    f: 'json',
                    token: (typeof layer._getToken === 'function') ? layer._getToken() : null
                }
            }).then(
                lang.hitch(this, callback, layer, expandNode),
                lang.hitch(this, errback, layer, expandNode)
            );
        },
        // request arcgis.com legend json
        _arcgisLegendRequest: function (layer, expandNode, callback, errback) {
            var index = layer.url.toLowerCase().indexOf('/rest/');
            var soap = layer.url.substring(0, index) + layer.url.substring(index + 5, layer.url.length);
            var url = 'http://utility.arcgis.com/sharing/tools/legend?soapUrl=' + window.escape(soap);
            if (!has('ie') || has('ie') > 8) {
                url += '&returnbytes=true';
            }
            esriRequest({
                url: url,
                callbackParamName: 'callback',
                content: {
                    f: 'json'
                }
            }).then(
                lang.hitch(this, callback, layer, expandNode),
                lang.hitch(this, errback, layer, expandNode)
            );
        },
        // create a legend image from json
        _image: function (legend, layerId, layer) {
            var src = legend.url;
            if ((!has('ie') || has('ie') >= 9) && legend.imageData && legend.imageData.length > 0) {
                src = 'data:image/png;base64,' + legend.imageData;
            } else if (legend.url.indexOf('http') !== 0) {
                src = layer.url + '/' + layerId + '/images/' + legend.url;
                var token = layer._getToken();
                if (token) {
                    src += '?token=' + token;
                }
            }
            // create image
            var img = domConst.create('img', {
                src: src,
                'class': layer.id + '-layerLegendImage'
            });
            domStyle.set(img, {
                'width': legend.width + 'px',
                'height': legend.height + 'px',
                'opacity': layer.opacity
            });
            return img;
        },
        ////////////////////////////////////////
        // layer legend for dynamic and tiled //
        ////////////////////////////////////////
        // image layers will most likely have own legend methods...but use this for now
        layerLegend: function (layer, expandNode) {
            // a stop gap
            var legend = new Legend({
                map: layer.getMap(),
                layerInfos: [{
                    layer: layer
                }]
            }, domConst.create('div', {}, expandNode));
            // strange dijit/Popup error if startup() immediately...weird
            setTimeout(function () {
                legend.startup();
            }, 1);
            // check version and handle accordingly
            //if (layer.version >= 10.01) {
            //    this._legendRequest(layer, expandNode, '_createLayerLegend', '_layerLegendError');
            //} else {
            //    this._arcgisLegendRequest(layer, expandNode, '_createLayerLegend', '_layerLegendError');
            //}
        },
        /////////////////////////////
        // dynamic sublayer legend //
        /////////////////////////////
        // create legends for dynamic control w/ sublayers
        dynamicSublayerLegend: function (layer, expandNode) {
            // check version and handle accordingly
            if (layer.version >= 10.01) {
                this._legendRequest(layer, expandNode, '_createDynamicSublayerLegend', '_dynamicSublayerLegendError');
            } else {
                this._arcgisLegendRequest(layer, expandNode, '_createDynamicSublayerLegend', '_dynamicSublayerLegendError');
            }
        },
        // handle the response, build legends and place
        // TODO: is there a better way than using registry to place sublayer legends?
        //       could remove id's from sublayer controls and simplify some
        //       is query a better option or not?
        _createDynamicSublayerLegend: function (layer, expandNode, r) {
            array.forEach(r.layers, function (_layer) {
                var layerId = _layer.layerId;
                // create legend table
                var table = domConst.create('table');
                domClass.add(table, 'layerControlLegendTable');
                // iterate through legends
                array.forEach(_layer.legend, function (legend) {
                    // create a table row and symbol td
                    var row = domConst.create('tr', {}, table, 'last'),
                        symbol = domConst.create('td', {
                            'class': 'layerControlLegendImage'
                        }, row, 'first');
                    // create label td
                    domConst.create('td', {
                        innerHTML: legend.label || '&nbsp;',
                        'class': 'layerControlLegendLabel'
                    }, row, 'last');

                    domConst.place(this._image(legend, layerId, layer), symbol);
                }, this);
                // place legend in the appropriate sublayer expandNode
                // or if a single layer use control expandNode
                if (layer.layerInfos.length > 1) {
                    var sublayerExpandNode = registry.byId(layer.id + '-' + _layer.layerId + '-sublayer-control').expandNode;
                    html.set(sublayerExpandNode, ''); //clear "No Legend" placeholder
                    domConst.place(table, sublayerExpandNode);
                } else {
                    domConst.place(table, expandNode);
                }
            }, this);
        },
        // handle error
        _dynamicSublayerLegendError: function (layer, expandNode, e) {
            if (layer.layerInfos.length === 1) {
                html.set(expandNode, 'No Legend');
            }
            topic.publish('viewer/handleError', {
                source: 'LayerControl/legendUtil/_createDynamicSublayerLegend',
                error: e
            });
        },
        /////////////////////////
        // vector layer legend //
        /////////////////////////
        // width and height of surface
        _surfaceDims: [20, 20],
        // determine what the renderer is and handle appropriately
        vectorLegend: function (layer, expandNode) {
            //  layer.renderer.symbol = single symbol (esri.renderer.SimpleRenderer, etc)
            //  layer.renderer.infos = multiple symbols (esri.renderer.UniqueValueRenderer, etc)
            //  TODO: read up on every single renderer! (just to be a better person)
            var symbol = layer.renderer.symbol,
                infos = layer.renderer.infos;
            // are we dealing w/ a single symbol, multiple symbols or nothing
            if (symbol) {
                // pass array with single object equivalent to an `infos` object
                this._createVectorLegend([{
                    symbol: symbol,
                    description: '',
                    label: '',
                    value: ''
                }], layer, expandNode);
            } else if (infos) {
                this._createVectorLegend(infos, layer, expandNode);
            } else {
                html.set(expandNode, 'No Legend');
            }
        },
        // create legends for vector layers (feature, etc)
        _createVectorLegend: function (infos, layer, expandNode) {
            //create legend table
            var table = domConst.create('table');
            domClass.add(table, 'layerControlLegendTable');
            //iterate over infos
            array.forEach(infos, function (info) {
                //create a table row and symbol
                var row = domConst.create('tr', {}, table, 'last'),
                    symbol = domConst.create('td', {
                        'class': 'layerControlLegendImage'
                    }, row, 'first');
                domConst.create('td', {
                    innerHTML: info.label || '&nbsp;',
                    'class': 'layerControlLegendLabel'
                }, row, 'last');
                // the symbol and descriptors
                var sym = info.symbol,
                    descriptor = sym.getShapeDescriptors(),
                    ds = descriptor.defaultShape,
                    fill = descriptor.fill,
                    stroke = descriptor.stroke;
                // it's either an image or we're creating a gfx shape representation of the symbol
                if (!ds.src) {
                    if (sym) {
                        // width and height
                        var w = this._surfaceDims[0],
                            h = this._surfaceDims[1];
                        if (sym.width && sym.height) {
                            w = sym.width;
                            h = sym.height;
                        }
                        // create node for surface
                        var surfaceNode = domConst.create('span', {}, symbol);
                        domStyle.set(surfaceNode, {
                            'width': w + 'px',
                            'height': h + 'px',
                            'display': 'inline-block'
                        });
                        // create surface and add shape
                        var surface = gfx.createSurface(surfaceNode, w, h);
                        var shape = surface.createShape(ds);
                        if (fill) {
                            shape.setFill(fill);
                        }
                        if (stroke) {
                            shape.setStroke(stroke);
                        }
                        shape.applyTransform({
                            dx: w / 2,
                            dy: h / 2
                        });
                        // set opacity of td
                        //  it works but is there a better way?
                        domStyle.set(symbol, {
                            'opacity': layer.opacity
                        });
                        domClass.add(symbol, layer.id + '-layerLegendImage');
                    } else {
                        html.set(expandNode, 'No Legend');
                        topic.publish('viewer/handleError', {
                            source: 'LayerControl/legendUtil/_createVectorLegend',
                            error: 'renderer does not contain symbol(s)'
                        });
                    }
                } else {
                    // create image
                    var img = domConst.create('img', {
                        src: ds.src
                    }, symbol);
                    domStyle.set(img, {
                        'width': sym.width + 'px',
                        'height': sym.height + 'px',
                        'opacity': layer.opacity
                    });
                    domClass.add(img, layer.id + '-layerLegendImage');
                }
                // place legend in expandNode
                domConst.place(table, expandNode);
            }, this);
        }
    };
});