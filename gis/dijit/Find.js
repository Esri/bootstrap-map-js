define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/on',
	'dojo/keys',
	'dojo/store/Memory',
	'dgrid/OnDemandGrid',
	'dgrid/Selection',
	'dgrid/Keyboard',
	'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/graphicsUtils',
	'esri/tasks/FindTask',
	'esri/tasks/FindParameters',
	'esri/geometry/Extent',
	'dojo/text!./Find/templates/Find.html',
	'dojo/i18n!./Find/nls/resource',

	'dijit/form/Form',
	'dijit/form/FilteringSelect',
	'dijit/form/ValidationTextBox',
	'dijit/form/CheckBox',
	'xstyle/css!./Find/css/Find.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domConstruct, lang, array, on, keys, Memory, OnDemandGrid, Selection, Keyboard, GraphicsLayer, Graphic, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, graphicsUtils, FindTask, FindParameters, Extent, FindTemplate, i18n) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: FindTemplate,
		baseClass: 'gis_FindDijit',
		i18n: i18n,

		// Spatial Reference. uses the map's spatial reference if none provided
		spatialReference: null,

		// Use 0.0001 for decimal degrees (wkid 4326)
		// or 500 for meters/feet
		pointExtentSize: null,

		// default symbology for found features
		defaultSymbols: {
			point: {
				type: 'esriSMS',
				style: 'esriSMSCircle',
				size: 25,
				color: [0, 255, 255, 32],
				angle: 0,
				xoffset: 0,
				yoffset: 0,
				outline: {
					type: 'esriSLS',
					style: 'esriSLSSolid',
					color: [0, 255, 255, 255],
					width: 2
				}
			},
			polyline: {
				type: 'esriSLS',
				style: 'esriSLSSolid',
				color: [0, 255, 255, 255],
				width: 3
			},
			polygon: {
				type: 'esriSFS',
				style: 'esriSFSSolid',
				color: [0, 255, 255, 32],
				outline: {
					type: 'esriSLS',
					style: 'esriSLSSolid',
					color: [0, 255, 255, 255],
					width: 3
				}
			}
		},

		postCreate: function () {
			this.inherited(arguments);

			if (this.spatialReference === null) {
				this.spatialReference = this.map.spatialReference.wkid;
			}
			if (this.pointExtentSize === null) {
				if (this.spatialReference === 4326) { // special case for geographic lat/lng
					this.pointExtentSize = 0.0001;
				} else {
					this.pointExtentSize = 500; // could be feet or meters
				}
			}

			this.createGraphicLayers();

			// allow pressing enter key to initiate the search
			this.own(on(this.searchTextDijit, 'keyup', lang.hitch(this, function (evt) {
				if (evt.keyCode === keys.ENTER) {
					this.search();
				}
			})));

			this.queryIdx = 0;

			// add an id so the queries becomes key/value pair store
			var k = 0, queryLen = this.queries.length;
			for (k = 0; k < queryLen; k++) {
				this.queries[k].id = k;
			}

			// add the queries to the drop-down list
			if (queryLen > 1) {
				var queryStore = new Memory({
					data: this.queries
				});
				this.querySelectDijit.set('store', queryStore);
				this.querySelectDijit.set('value', this.queryIdx);
			} else {
				this.querySelectDom.style.display = 'none';
			}

		},

		createGraphicLayers: function () {
			var pointSymbol = null,
				polylineSymbol = null,
				polygonSymbol = null;
			var pointRenderer = null,
				polylineRenderer = null,
				polygonRenderer = null;

			var symbols = lang.mixin({}, this.symbols);
			// handle each property to preserve as much of the object heirarchy as possible
			symbols = {
				point: lang.mixin(this.defaultSymbols.point, symbols.point),
				polyline: lang.mixin(this.defaultSymbols.polyline, symbols.polyline),
				polygon: lang.mixin(this.defaultSymbols.polygon, symbols.polygon)
			};

			// points
			this.pointGraphics = new GraphicsLayer({
				id: 'findGraphics_point',
				title: 'Find'
			});

			if (symbols.point) {
				pointSymbol = new SimpleMarkerSymbol(symbols.point);
				pointRenderer = new SimpleRenderer(pointSymbol);
				pointRenderer.label = 'Find Results (Points)';
				pointRenderer.description = 'Find results (Points)';
				this.pointGraphics.setRenderer(pointRenderer);
			}

			// poly line
			this.polylineGraphics = new GraphicsLayer({
				id: 'findGraphics_line',
				title: 'Find Graphics'
			});

			if (symbols.polyline) {
				polylineSymbol = new SimpleLineSymbol(symbols.polyline);
				polylineRenderer = new SimpleRenderer(polylineSymbol);
				polylineRenderer.label = 'Find Results (Lines)';
				polylineRenderer.description = 'Find Results (Lines)';
				this.polylineGraphics.setRenderer(polylineRenderer);
			}

			// polygons
			this.polygonGraphics = new GraphicsLayer({
				id: 'findGraphics_polygon',
				title: 'Find Graphics'
			});

			if (symbols.polygon) {
				polygonSymbol = new SimpleFillSymbol(symbols.polygon);
				polygonRenderer = new SimpleRenderer(polygonSymbol);
				polygonRenderer.label = 'Find Results (Polygons)';
				polygonRenderer.description = 'Find Results (Polygons)';
				this.polygonGraphics.setRenderer(polygonRenderer);
			}

			this.map.addLayer(this.polygonGraphics);
			this.map.addLayer(this.polylineGraphics);
			this.map.addLayer(this.pointGraphics);
		},
		search: function () {
			var query = this.queries[this.queryIdx];
			var searchText = this.searchTextDijit.get('value');
			if (!query || !searchText || searchText.length === 0) {
				return;
			}
			if (query.minChars && (searchText.length < query.minChars)) {
				this.findResultsNode.innerHTML = 'You must enter at least ' + query.minChars + ' characters.';
				this.findResultsNode.style.display = 'block';
				return;
			}

			this.createResultsGrid();
			this.clearResultsGrid();
			this.clearFeatures();
			domConstruct.empty(this.findResultsNode);

			if (!query || !query.url || !query.layerIds || !query.searchFields) {
				return;
			}

			//create find parameters
			var findParams = new FindParameters();
			findParams.returnGeometry = true;
			findParams.layerIds = query.layerIds;
			findParams.searchFields = query.searchFields;
			findParams.layerDefinitions = query.layerDefs;

			findParams.searchText = searchText;
			findParams.contains = !this.containsSearchText.checked;

			findParams.outSpatialReference = {
				wkid: this.spatialReference
			};

			this.findResultsNode.innerHTML = this.i18n.searching;
			this.findResultsNode.style.display = 'block';

			var findTask = new FindTask(query.url);
			findTask.execute(findParams, lang.hitch(this, 'showResults'));
		},

		createResultsGrid: function () {
			if (!this.resultsStore) {
				this.resultsStore = new Memory({
					idProperty: 'id',
					data: []
				});
			}

			if (!this.resultsGrid) {
				var Grid = declare([OnDemandGrid, Keyboard, Selection]);
				this.resultsGrid = new Grid({
					selectionMode: 'single',
					cellNavigation: false,
					showHeader: true,
					store: this.resultsStore,
					columns: {
						layerName: 'Layer',
						foundFieldName: 'Field',
						value: 'Result'
					},
					sort: [{
						attribute: 'value',
						descending: false
					}]
					//minRowsPerPage: 250,
					//maxRowsPerPage: 500
				}, this.findResultsGrid);

				this.resultsGrid.startup();
				this.resultsGrid.on('dgrid-select', lang.hitch(this, 'selectFeature'));
			}
		},

		showResults: function (results) {
			var resultText = '';
			this.resultIdx = 0;
			this.results = results;

			if (this.results.length > 0) {
				//var s = (this.results.length === 1) ? '' : 's';
				var s = (this.results.length === 1) ? '' : this.i18n.resultsLabel.multipleResultsSuffix;
				//resultText = this.results.length + ' Result' + s + ' Found';
				resultText = this.results.length + ' ' + this.i18n.resultsLabel.labelPrefix + s + ' ' + this.i18n.resultsLabel.labelSuffix;
				this.highlightFeatures();
				this.showResultsGrid();
			} else {
				resultText = 'No Results Found';
			}
			this.findResultsNode.innerHTML = resultText;

		},

		showResultsGrid: function () {
			var query = this.queries[this.queryIdx];
			this.resultsGrid.store.setData(this.results);
			this.resultsGrid.refresh();

			var lyrDisplay = 'block';
			if (query.layerIds.length === 1) {
				lyrDisplay = 'none';
			}
			this.resultsGrid.styleColumn('layerName', 'display:' + lyrDisplay);

			if (query && query.hideGrid !== true) {
				this.findResultsGrid.style.display = 'block';
			}
		},

		highlightFeatures: function () {
			var unique = 0;
			array.forEach(this.results, function (result) {
				// add a unique key for the store
				result.id = unique;
				unique++;
				var graphic, feature = result.feature;
				switch (feature.geometry.type) {
				case 'point':
					// only add points to the map that have an X/Y
					if (feature.geometry.x && feature.geometry.y) {
						graphic = new Graphic(feature.geometry);
						this.pointGraphics.add(graphic);
					}
					break;
				case 'polyline':
					// only add polylines to the map that have paths
					if (feature.geometry.paths && feature.geometry.paths.length > 0) {
						graphic = new Graphic(feature.geometry);
						this.polylineGraphics.add(graphic);
					}
					break;
				case 'polygon':
					// only add polygons to the map that have rings
					if (feature.geometry.rings && feature.geometry.rings.length > 0) {
						graphic = new Graphic(feature.geometry, null, {
							ren: 1
						});
						this.polygonGraphics.add(graphic);
					}
					break;
				default:
				}
			}, this);

			// zoom to layer extent
			var zoomExtent = null;
			//If the layer is a single point then extents are null
			// if there are no features in the layer then extents are null
			// the result of union() to null extents is null

			if (this.pointGraphics.graphics.length > 0) {
				zoomExtent = this.getPointFeaturesExtent(this.pointGraphics.graphics);
			}
			if (this.polylineGraphics.graphics.length > 0) {
				if (zoomExtent === null) {
					zoomExtent = graphicsUtils.graphicsExtent(this.polylineGraphics.graphics);
				} else {
					zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(this.polylineGraphics.graphics));
				}
			}
			if (this.polygonGraphics.graphics.length > 0) {
				if (zoomExtent === null) {
					zoomExtent = graphicsUtils.graphicsExtent(this.polygonGraphics.graphics);
				} else {
					zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(this.polygonGraphics.graphics));
				}
			}

			if (zoomExtent) {
				this.zoomToExtent(zoomExtent);
			}
		},

		selectFeature: function (event) {
			var result = event.rows;

			// zoom to feature
			if (result.length) {
				var data = result[0].data;
				if (data) {
					var feature = data.feature;
					if (feature) {
						var extent = feature.geometry.getExtent();
						if (!extent && feature.geometry.type === 'point') {
							extent = this.getExtentFromPoint(feature);
						}
						if (extent) {
							this.zoomToExtent(extent);
						}
					}
				}
			}
		},

		zoomToExtent: function (extent) {
			this.map.setExtent(extent.expand(1.2));
		},

		clearResults: function () {
			this.results = null;
			this.clearResultsGrid();
			this.clearFeatures();
			this.searchFormDijit.reset();
			this.querySelectDijit.setValue(this.queryIdx);
			domConstruct.empty(this.findResultsNode);
		},

		clearResultsGrid: function () {
			if (this.resultStore) {
				this.resultsStore.setData([]);
			}
			if (this.resultsGrid) {
				this.resultsGrid.refresh();
			}
			this.findResultsNode.style.display = 'none';
			this.findResultsGrid.style.display = 'none';
		},

		clearFeatures: function () {
			this.pointGraphics.clear();
			this.polylineGraphics.clear();
			this.polygonGraphics.clear();
		},

		getPointFeaturesExtent: function (pointFeatures) {
			var extent = graphicsUtils.graphicsExtent(pointFeatures);
			if (extent === null && pointFeatures.length > 0) {
				extent = this.getExtentFromPoint(pointFeatures[0]);
			}

			return extent;
		},

		getExtentFromPoint: function (point) {
			var sz = this.pointExtentSize; // hack
			var pt = point.geometry;
			var extent = new Extent({
				'xmin': pt.x - sz,
				'ymin': pt.y - sz,
				'xmax': pt.x + sz,
				'ymax': pt.y + sz,
				'spatialReference': {
					wkid: this.spatialReference
				}
			});
			return extent;
		},

		_onQueryChange: function (queryIdx) {
			if (queryIdx >= 0 && queryIdx < this.queries.length) {
				this.queryIdx = queryIdx;
			}
		}
	});
});