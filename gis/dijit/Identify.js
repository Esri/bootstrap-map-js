define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/MenuItem',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/promise/all',
    'dojo/topic',
    'dojo/query',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dnd/Moveable',
    'dojo/store/Memory',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'esri/dijit/PopupTemplate',
    'dojo/text!./Identify/templates/Identify.html',
    'dojo/i18n!./Identify/nls/resource',

    'dijit/form/Form',
    'dijit/form/FilteringSelect',
    'xstyle/css!./Identify/css/Identify.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, MenuItem, lang, array, all, topic, query, domStyle, domClass, Moveable, Memory, IdentifyTask, IdentifyParameters, PopupTemplate, IdentifyTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: IdentifyTemplate,
        baseClass: 'gis_IdentifyDijit',
        i18n: i18n,

        mapClickMode: null,
        identifies: {},
        infoTemplates: {},
        ignoreOtherGraphics: true,
        createDefaultInfoTemplates: true,
        draggable: false,
        layerSeparator: '||',
        allLayersId: '***',

        postCreate: function () {
            this.inherited(arguments);
            if (!this.identifies) {
                this.identifies = {};
            }
            this.layers = [];
            array.forEach(this.layerInfos, function (layerInfo) {
                var lyrId = layerInfo.layer.id;
                var layer = this.map.getLayer(lyrId);
                if (layer) {
                    var url = layer.url;

                    // handle feature layers
                    if (layer.declaredClass === 'esri.layers.FeatureLayer') {

                        // If is a feature layer that does not support
                        // Identify (Feature Service), create an
                        // infoTemplate for the graphic features. Create
                        // it only if one does not already exist.
                        if (layer.capabilities && layer.capabilities.toLowerCase().indexOf('data') < 0) {
                            if (!layer.infoTemplate) {
                                var infoTemplate = this.getInfoTemplate(layer, layer.layerId);
                                if (infoTemplate) {
                                    layer.setInfoTemplate(infoTemplate);
                                    return;
                                }
                            }
                        }

                        // If it is a feature Layer, we get the base url
                        // for the map service by removing the layerId.
                        var lastSL = url.lastIndexOf('/' + layer.layerId);
                        if (lastSL > 0) {
                            url = url.substring(0, lastSL);
                        }
                    }

                    this.layers.push({
                        ref: layer,
                        layerInfo: layerInfo,
                        identifyTask: new IdentifyTask(url)
                    });

                    // rebuild the layer selection list when any layer is hidden
                    // but only if we have a UI
                    if (this.parentWidget) {
                        layer.on('visibility-change', lang.hitch(this, function (evt) {
                            if (evt.visible === false) {
                                this.createIdentifyLayerList();
                            }
                        }));
                    }
                }
            }, this);

            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));

            this.map.on('click', lang.hitch(this, function (evt) {
                if (this.mapClickMode === 'identify') {
                    this.executeIdentifyTask(evt);
                }
            }));
            if (this.mapRightClickMenu) {
                this.addRightClickMenu();
            }

            // rebuild the layer selection list when the map is updated
            // but only if we have a UI
            if (this.parentWidget) {
                this.createIdentifyLayerList();
                this.map.on('update-end', lang.hitch(this, function () {
                    this.createIdentifyLayerList();
                }));
            }

            if (this.draggable) {
                this.setupDraggable();
            }
        },
        addRightClickMenu: function () {
            this.map.on('MouseDown', lang.hitch(this, function (evt) {
                this.mapRightClick = evt;
            }));
            this.mapRightClickMenu.addChild(new MenuItem({
                label: this.i18n.rightClickMenuItem.label,
                onClick: lang.hitch(this, 'handleRightClick')
            }));
        },
        setupDraggable: function () {
            var popups, handles, pointers, movable;
            // the popup, handle (title) and pointers (arrows)
            popups  = query('div.esriPopup');
            handles = query('div.esriPopup div.titlePane div.title');
            pointers = query('div.esriPopup div.outerPointer, div.esriPopup div.pointer');

            if (popups.length > 0 && handles.length > 0) {
                domStyle.set(handles[0], 'cursor', 'move');
                movable = new Moveable(popups[0], {
                    handle: handles[0]
                });

                if (pointers.length > 0) {
                    // hide the pointer arrow when you move the popup
                    movable.onMoveStart = function () {
                        array.forEach(pointers, function (pointer) {
                            domClass.remove(pointer, 'left right top bottom topLeft topRight bottomLeft bottomRight');
                        });
                    };
                }
            }
        },
        executeIdentifyTask: function (evt) {
            if (!this.checkForGraphicInfoTemplate(evt)) {
                return;
            }

            this.map.infoWindow.hide();
            this.map.infoWindow.clearFeatures();

            // don't identify on shift-click, ctrl-click or alt-click
            if (evt.shiftKey || evt.ctrlKey || evt.altKey) {
                return;
            }

            var mapPoint = evt.mapPoint;
            var identifyParams = this.createIdentifyParams(mapPoint);
            var identifies = [];
            var identifiedlayers = [];
            var selectedLayer = this.getSelectedLayer();

            array.forEach(this.layers, lang.hitch(this, function (layer) {
                var layerIds = this.getLayerIds(layer, selectedLayer);
                if (layerIds.length > 0) {
                    var params = lang.clone(identifyParams);
                    params.layerDefinitions = layer.ref.layerDefinitions;
                    params.layerIds = layerIds;
                    identifies.push(layer.identifyTask.execute(params));
                    identifiedlayers.push(layer);
                }
            }));

            if (identifies.length > 0) {
                this.map.infoWindow.setTitle( this.i18n.mapInfoWindow.identifyingTitle );
                this.map.infoWindow.setContent('<div class="loading"></div>');
                this.map.infoWindow.show(mapPoint);
                all(identifies).then(lang.hitch(this, 'identifyCallback', identifiedlayers), lang.hitch(this, 'identifyError'));
            }
        },

        checkForGraphicInfoTemplate: function (evt) {
            if (evt.graphic) {
                // handle feature layers that come from a feature service
                // and may already have an info template
                var layer = evt.graphic._layer;
                if (layer.infoTemplate || (layer.capabilities && layer.capabilities.toLowerCase().indexOf('data') < 0)) {
                    return false;
                }

                if (!this.ignoreOtherGraphics) {
                    // handles graphic from another type of graphics layer
                    // added to the map and so the identify is not found
                    if (!this.identifies.hasOwnProperty(layer.id)) {
                        return false;
                    }
                    // no layerId (graphics) or sublayer not defined
                    if (isNaN(layer.layerId) || !this.identifies[layer.id].hasOwnProperty(layer.layerId)) {
                        return false;
                    }
                }

            }

            return true;
        },

        createIdentifyParams: function (point) {
            var identifyParams = new IdentifyParameters();
            identifyParams.tolerance = this.identifyTolerance;
            identifyParams.returnGeometry = true;
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            identifyParams.geometry = point;
            identifyParams.mapExtent = this.map.extent;
            identifyParams.width = this.map.width;
            identifyParams.height = this.map.height;
            identifyParams.spatialReference = this.map.spatialReference;

            return identifyParams;
        },

        getSelectedLayer: function () {
            var selectedLayer = this.allLayersId; // default is all layers
            // if we have a UI, then get the selected layer
            if (this.parentWidget) {
                var form = this.identifyFormDijit.get('value');
                if (!form.identifyLayer || form.identifyLayer === '') {
                    this.identifyLayerDijit.set('value', selectedLayer);
                } else {
                    selectedLayer = form.identifyLayer;
                }
            }
            return selectedLayer;
        },

        getLayerIds: function (layer, selectedLayer) {
            var arrIds = selectedLayer.split(this.layerSeparator);
            var allLayersId = this.allLayersId;
            var ref = layer.ref,
                selectedIds = layer.layerInfo.layerIds;
            var layerIds = [];
            if (ref.visible) {
                if (arrIds[0] === allLayersId || ref.id === arrIds[0]) {
                    if (arrIds.length > 1 && arrIds[1]) { // layer explicity requested
                        layerIds = [arrIds[1]];
                    } else if ((ref.declaredClass === 'esri.layers.FeatureLayer') && !isNaN(ref.layerId)) { // feature layer
                        // do not allow feature layer that does not support
                        // Identify (Feature Service)
                        if (ref.capabilities && ref.capabilities.toLowerCase().indexOf('data') > 0) {
                            layerIds = [ref.layerId];
                        }
                    } else if (ref.layerInfos) {
                        layerIds = this.getLayerInfos(ref, selectedIds);
                    }
                }
            }
            return layerIds;
        },

        getLayerInfos: function (ref, selectedIds) {
            var layerIds = [];
            array.forEach(ref.layerInfos, lang.hitch(this, function (layerInfo) {
                if (!this.includeSubLayer(layerInfo, ref, selectedIds)) {
                    return;
                }
                layerIds.push(layerInfo.id);
            }));
            return layerIds;

        },

        identifyCallback: function (identifiedlayers, responseArray) {
            var fSet = [];
            array.forEach(responseArray, function (response, i) {
                var ref = identifiedlayers[i].ref;
                array.forEach(response, function (result) {
                    result.feature.geometry.spatialReference = this.map.spatialReference; //temp workaround for ags identify bug. remove when fixed.
                    if (result.feature.infoTemplate === undefined) {
                        var infoTemplate = this.getInfoTemplate(ref, null, result);
                        if (infoTemplate) {
                            result.feature.setInfoTemplate(infoTemplate);
                        } else {
                            return;
                        }
                    }
                    fSet.push(result.feature);
                }, this);
            }, this);
            this.map.infoWindow.setFeatures(fSet);
        },
        identifyError: function (err) {
            this.map.infoWindow.hide();
            topic.publish('viewer/handleError', {
                source: 'Identify',
                error: err
            });
        },
        handleRightClick: function () {
            this.executeIdentifyTask(this.mapRightClick);
        },

        getInfoTemplate: function (layer, layerId, result) {
            var popup = null;
            if (result) {
                layerId = result.layerId;
            } else if (layerId === null) {
                layerId = layer.layerId;
            }

            // see if we have a Popup config defined for this layer
            if (this.identifies.hasOwnProperty(layer.id)) {
                if (this.identifies[layer.id].hasOwnProperty(layerId)) {
                    popup = this.identifies[layer.id][layerId];
                    if (popup) {
                        if (typeof (popup.declaredClass) !== 'string') { // has it been created already?
                            popup = new PopupTemplate(popup);
                            this.identifies[layer.id][layerId] = popup;
                        }
                    }
                }
            }

            // if no Popup config found, create one with all attributes or layer fields
            if (!popup) {
                popup = this.createInfoTemplate(layer, layerId, result);
            }

            return popup;
        },

        createInfoTemplate: function (layer, layerId, result) {
            var popup = null, fieldInfos = [];

            var layerName = this.getLayerName(layer);
            if (result) {
                layerName = result.layerName;
            }

            // from the results
            if (result && result.feature) {
                var attributes = result.feature.attributes;
                if (attributes) {
                    for (var prop in attributes) {
                        if (attributes.hasOwnProperty(prop)) {
                            fieldInfos.push({
                                fieldName: prop,
                                visible: true
                            });
                        }
                    }
                }

            // from the outFields of the layer
            } else if (layer._outFields && (layer._outFields.length) && (layer._outFields[0] !== '*')) {

                var fields = layer.fields;
                array.forEach(layer._outFields, function (fieldName) {
                    var foundField = array.filter(fields, function (field) {
                        return (field.name === fieldName);
                    });
                    if (foundField.length > 0) {
                        fieldInfos.push({
                            fieldName: foundField[0].name,
                            label: foundField[0].alias,
                            visible: true
                        });
                    }
                });

            // from the fields layer
            } else if (layer.fields) {

                array.forEach(layer.fields, function (field) {
                    fieldInfos.push({
                        fieldName: field.name,
                        label: field.alias,
                        visible: true
                    });
                });
            }

            if (fieldInfos.length > 0) {
                popup = new PopupTemplate({
                    title: layerName,
                    fieldInfos: fieldInfos,
                    showAttachments: (layer.hasAttachments)
                });
                if (!this.identifies[layer.id]) {
                    this.identifies[layer.id] = {};
                }
                this.identifies[layer.id][layerId] = popup;
            }

            return popup;
        },

        createIdentifyLayerList: function () {
            var id = null;
            var identifyItems = [];
            var selectedId = this.identifyLayerDijit.get('value');
            var sep = this.layerSeparator;

            array.forEach(this.layers, lang.hitch(this, function (layer) {
                var ref = layer.ref,
                    selectedIds = layer.layerInfo.layerIds;
                // only include layers that are currently visible
                if (ref.visible) {
                    var name = this.getLayerName(layer);
                    if ((ref.declaredClass === 'esri.layers.FeatureLayer') && !isNaN(ref.layerId)) { // feature layer
                        identifyItems.push({
                            name: name,
                            id: ref.id + sep + ref.layerId
                        });
                        // previously selected layer is still visible so keep it selected
                        if (ref.id + sep + ref.layerId === selectedId) {
                            id = selectedId;
                        }
                    } else { // dynamic layer
                        array.forEach(ref.layerInfos, lang.hitch(this, function (layerInfo) {
                            if (!this.includeSubLayer(layerInfo, ref, selectedIds)) {
                                return;
                            }
                            identifyItems.push({
                                name: name + ' \\ ' + layerInfo.name,
                                id: ref.id + sep + layerInfo.id
                            });
                            // previously selected sublayer is still visible so keep it selected
                            if (ref.id + sep + layerInfo.id === selectedId) {
                                id = selectedId;
                            }
                        }));
                    }
                }
            }));

            identifyItems.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });

            this.identifyLayerDijit.set('disabled', (identifyItems.length < 1));
            if (identifyItems.length > 0) {
                identifyItems.unshift({
                    name: this.i18n.labels.allVisibleLayers,
                    id: '***'
                });
                if (!id) {
                    id = identifyItems[0].id;
                }
            }
            var identify = new Memory({
                data: identifyItems
            });
            this.identifyLayerDijit.set('store', identify);
            this.identifyLayerDijit.set('value', id);
        },

        includeSubLayer: function (layerInfo, ref, selectedIds) {
            // exclude group layers
            if (layerInfo.subLayerIds !== null) {
                return false;
            }
            // only include sublayers that are currently visible
            if (array.indexOf(ref.visibleLayers, layerInfo.id) < 0) {
                return false;
            }
            // only include sublayers that are within the current map scale
            if (!this.layerVisibleAtCurrentScale(layerInfo)) {
                return false;
            }

            // restrict which layers are included
            if (selectedIds) {
                if (array.indexOf(selectedIds, layerInfo.id) < 0) {
                    return false;
                }
            }

            // don't allow the layer if we don't have an  infoTemplate
            // already and creating a default one is not desired
            if (!this.createDefaultInfoTemplates) {
                var infoTemplate = this.getInfoTemplate(ref, layerInfo.id);
                if (!infoTemplate) {
                    return false;
                }
            }

            // all tests pass so include this sublayer
            return true;
        },

        getLayerName: function (layer) {
            var name = null;
            if (layer.layerInfo) {
                name = layer.layerInfo.title;
            }
            if (!name) {
                array.forEach(this.layers, function (lyr) {
                    if (lyr.ref.id === layer.id) {
                        name = lyr.layerInfo.title;
                        return;
                    }
                });
            }
            if (!name) {
                name = layer.name;
                if (!name && layer.ref) {
                    name = layer.ref._titleForLegend; // fall back to old method using title from legend
                }
            }
            return name;
        },

        layerVisibleAtCurrentScale: function (layer) {
            var mapScale = this.map.getScale();
            return !(((layer.maxScale !== 0 && mapScale < layer.maxScale) || (layer.minScale !== 0 && mapScale > layer.minScale)));
        },

        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
            var map = this.map;
            array.forEach(map.graphicsLayerIds, function (layerID) {
                var layer = map.getLayer(layerID);
                if (layer) {
                    // add back any infoTemplates that
                    // had been previously removed
                    if (mode === 'identify') {
                        if (this.infoTemplates[layer.id]) {
                            layer.infoTemplate = lang.clone(this.infoTemplates[layer.id]);
                        }
                    // remove any infoTemplates that might
                    // interfere with clicking on a feature
                    } else {
                        if (layer.infoTemplate) {
                            this.infoTemplates[layer.id] = lang.clone(layer.infoTemplate);
                            layer.infoTemplate = null;
                        }
                    }
                }
            }, this);
        }
    });
});