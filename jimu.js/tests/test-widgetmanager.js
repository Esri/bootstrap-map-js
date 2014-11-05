require(["doh/runner",
 'jimu/WidgetManager',
 'jimu/ConfigManager',
 'jimu/tokenUtils',
 'dojo/dom',
 'dojo/dom-construct',
 'dojo/query',
 'dojo/promise/all',
 'dojo/NodeList-dom'],
	function(doh, WidgetManager, ConfigManager, tokenUtils, dom, domConstruct, query, all, nld) {
	path = '/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/';
	
	function removeAllWidgets(wm){
		wm.loaded.forEach(function (w) {
      w.destroy();
    });
		wm.loaded = [];
	}

	// tokenUtils.setPortalUrl('arcgis.com');

	doh.register("load widget tests", [
	{
		name: 'test1',
		runTest: function () {
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "testwidget1",
				"label": "label1",
				"uri": "jimu/tests/testwidgets/Widget1/Widget"
			};
			wm.appConfig = {locale: 'en-US'};
			wm.loadWidget(widgetConfig).then(function(widget) {
				dohDeferred.getTestCallback(function(widget) {
					doh.assertEqual('jimu/tests/testwidgets/Widget1/Widget', widget['uri']);
					doh.assertEqual('jimu-widget', widget['class']);
					doh.assertEqual('jimu-widget-testwidget1', widget.baseClass);
					doh.assertEqual('/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/testwidgets/Widget1/', widget.folderUrl);
					doh.assertEqual('test-widget1', widget.name);
					doh.assertEqual('testwidget1', widget.id);
					// doh.assertEqual('normal', widget.defaultState);
					doh.assertEqual('closed', widget.state);
					doh.assertEqual('normal', widget.windowState);
					doh.assertEqual('/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/testwidgets/Widget1/images/icon.png', widget.icon);
					doh.assertEqual('label1', widget.label);
					
					doh.assertEqual({
						"attr1": "value1",
  					"attr2": "111"
  				}, widget.config);
										
					doh.assertEqual(null, widget.map);
					doh.assertEqual('111', widget.nls.msg1);
					doh.assertEqual('LINK', dom.byId('widget_style_jimu_tests_testwidgets_Widget1_Widget').tagName);
				})(widget);
			}, function(err) {
				dohDeferred.errback(err);
			});

		return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testWidgetConfig',
		runTest: function testWidgetConfig(){
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "testwidget2",
				"uri": "jimu/tests/testwidgets/Widget1/Widget",
				"config": {
					"attr1": "value1"
				}
			};
			removeAllWidgets(wm);
			wm.loadWidget(widgetConfig).then(function(widget) {
				dohDeferred.getTestCallback(function(widget) {
					doh.assertEqual({attr1: 'value1'}, widget.config);
				})(widget);
			}, function(err) {
				dohDeferred.errback(err);
			});
			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testWidgetConfig2',
		runTest: function (){
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "testwidget3",
				"uri": "jimu/tests/testwidgets/Widget1/Widget",
				"config": "testwidgets/Widget1/config.json"
			};
			removeAllWidgets(wm);
			wm.loadWidget(widgetConfig).then(function(widget) {
				dohDeferred.getTestCallback(function(widget) {
					doh.assertEqual({attr1: 'value1', attr2: '111'}, widget.config);
				})(widget);
			}, function(err) {
				dohDeferred.errback(err);
			});
			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testWidgetState',
		runTest: function (){
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "w111",
				"uri": "jimu/tests/testwidgets/Widget1/Widget"
			};
			removeAllWidgets(wm);
			wm.loadWidget(widgetConfig).then(function(widget) {
				dohDeferred.getTestCallback(function(widget) {
					doh.assertEqual('closed', widget.state);
					widget.startup();
					doh.assertEqual('opened', widget.state);
					wm.maximizeWidget(widget);
					doh.assertEqual('maximized', widget.windowState);
					wm.minimizeWidget(widget);
					doh.assertEqual('minimized', widget.windowState);
					wm.closeWidget(widget);
					doh.assertEqual('closed', widget.state);
					wm.maximizeWidget(widget);
					doh.assertEqual('maximized', widget.windowState);
					wm.changeWindowStateTo(widget, 'minimized');
					doh.assertEqual('minimized', widget.windowState);
				})(widget);
			}, function(err) {
				dohDeferred.errback(err);
			});
			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testWidgetLoad',
		runTest: function (){
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "testwidget4",
				"uri": "jimu/tests/testwidgets/Widget1/Widget"
			};
			removeAllWidgets(wm);
			wm.loadWidget(widgetConfig).then(function(widget1) {
				wm.loadWidget(widgetConfig).then(function(widget2) {
					dohDeferred.getTestCallback(function() {
						doh.assertTrue(widget1 === widget2);
						doh.assertEqual(1, wm.loaded.length);
					})();
				});
			}, function(err) {
				dohDeferred.errback(err);
			});
			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testWidgetLoadTwoTimes',
		runTest: function (){
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "testwidget42",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			};
			removeAllWidgets(wm);
			all([wm.loadWidget(widgetConfig), wm.loadWidget(widgetConfig)]).then(function(results) {
				dohDeferred.getTestCallback(function() {
					doh.assertEqual('testwidget42', results[0].id);
					doh.assertEqual(results[0], results[1]);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testWidgetDestroy',
		runTest: function (){
			var wm = WidgetManager.getInstance();
			var dohDeferred = new doh.Deferred();
			var widgetConfig = {
				"id": "testwidget5",
				"uri": "jimu/tests/testwidgets/Widget1/Widget"
			};
			removeAllWidgets(wm);
			wm.loadWidget(widgetConfig).then(function(widget) {
				widget.destroy();
				dohDeferred.getTestCallback(function() {
					doh.assertEqual(0, wm.loaded.length);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'testLoadWidgetStyle',
		runTest: function (){
			var dohDeferred = new doh.Deferred(),
				wm = WidgetManager.getInstance(),
				widgetConfig1 = {
					"id": "testwidget1",
					"uri": "jimu/tests/testwidgets/Widget1/Widget"
				},
				widgetConfig2 = {
					"id": "testwidget2",
					"uri": "jimu/tests/testwidgets/Widget1/Widget"
				};

			removeAllWidgets(wm);
			wm.loadWidget(widgetConfig1).then(function(widget1){			
				wm.loadWidget(widgetConfig2).then(function(widget2){
					dohDeferred.getTestCallback(function(){
						var node = query('#widget_style_jimu_tests_testwidgets_Widget1_Widget');
						doh.assertEqual(1, node.length);
						doh.assertEqual(1, query('link').length);
						doh.assertEqual('/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/testwidgets/Widget1/css/style.css', node.attr('href')[0]);
					})();
				});
			});
			return dohDeferred;
		},
		timeout: 1000
	}
	]);

doh.runOnLoad();
});