require(["doh/runner", 'jimu/WidgetManager', 'jimu/DataManager', 'dojo/aspect', 'dojo/topic'],
function(doh, WidgetManager, DataManager, aspect, topic) {
	function removeAllWidgets(wm){
		wm.loaded.forEach(function (w) {
      w.destroy();
    });
    wm.loading = [];
		wm.loaded = [];
	}

	doh.register("widget communication tests", [
	function testPublishData1() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig = {
				"id": "testwidget2",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			};
		removeAllWidgets(wm);
		wm.appConfig = {locale: 'en-US'};
		wm.loadWidget(widgetConfig).then(function(widget) {

			widget.publishData('a');
			dohDeferred.getTestCallback(function(widget) {
				doh.assertEqual(['a'], dm._dataStore['testwidget2']);
				topic.publish('removeData', 'testwidget2');
				doh.assertEqual(undefined, dm._dataStore['testwidget2']);
			})(widget);
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	},
	//widget2, widget3 loaded, then widget2 publish data.
	function testPublishSub1() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig2 = {
				"id": "testwidget21",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			},
			widgetConfig3 = {
				"id": "testwidget31",
				"uri": "jimu/tests/testwidgets/Widget3/TestWidget3"
			};
		topic.publish('clearAllData');
		removeAllWidgets(wm);
		wm.loadWidget(widgetConfig2).then(function(widget2) {
			wm.loadWidget(widgetConfig3).then(function(widget3) {
				widget3.listenWidgetIds = ["testwidget21"];
				widget2.publishData(['a']);
				dohDeferred.getTestCallback(function() {
					doh.assertEqual(['a'], widget3.widget2Data);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	},
	//widget2 publishs data, then load widget3.
	function testPublishSub2() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig2 = {
				"id": "testwidget22",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			},
			widgetConfig3 = {
				"id": "testwidget32",
				"uri": "jimu/tests/testwidgets/Widget3/TestWidget3"
			};
		topic.publish('clearAllData');
		removeAllWidgets(wm);
		wm.loadWidget(widgetConfig2).then(function(widget2) {
			widget2.publishData(['a']);
			wm.loadWidget(widgetConfig3).then(function(widget3) {
				dohDeferred.getTestCallback(function() {
					widget3.fetchData();
					doh.assertEqual(['a'], widget3.widget2Data);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	},
	//widget2 publishs data, then load widget3, but widget set listenWidgetIds property.
	function testPublishSub21() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig2 = {
				"id": "testwidget23",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			},
			widgetConfig3 = {
				"id": "testwidget33",
				"uri": "jimu/tests/testwidgets/Widget3/TestWidget3",
				listenWidgetIds: ['not-widget2']
			};
		topic.publish('clearAllData');
		removeAllWidgets(wm);
		wm.loadWidget(widgetConfig2).then(function(widget2) {
			widget2.publishData(['a']);
			wm.loadWidget(widgetConfig3).then(function(widget3) {
				dohDeferred.getTestCallback(function() {
					doh.assertEqual(undefined, widget3.widget2Data);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	},
	//widget2, widget3 loaded, then widget2 publish data two times with different data.
	//After that, widget3's data will be the second data.
	function testPublishSub3() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig2 = {
				"id": "testwidget24",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			},
			widgetConfig3 = {
				"id": "testwidget34",
				"uri": "jimu/tests/testwidgets/Widget3/TestWidget3"
			};
		topic.publish('clearAllData');
		removeAllWidgets(wm);
		wm.loadWidget(widgetConfig2).then(function(widget2) {
			wm.loadWidget(widgetConfig3).then(function(widget3) {
				widget2.publishData(['a']);
				widget2.publishData(['b']);
				dohDeferred.getTestCallback(function() {
					doh.assertEqual(['b'], widget3.widget2Data);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	},
	//widget2, widget3 loaded, then widget2 publish data two times with different data, but use append mode.
	//After that, widget3's data will be the concatenated data.
	function testPublishSub4() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig2 = {
				"id": "testwidget25",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			},
			widgetConfig3 = {
				"id": "testwidget35",
				"uri": "jimu/tests/testwidgets/Widget3/TestWidget3"
			};
		topic.publish('clearAllData');
		removeAllWidgets(wm);
		wm.loadWidget(widgetConfig2).then(function(widget2) {
			wm.loadWidget(widgetConfig3).then(function(widget3) {
				widget2.publishData(['a']);
				widget2.publishData(['b'], false);
				widget3.fetchData('testwidget25');
				dohDeferred.getTestCallback(function() {
					doh.assertEqual(['a', 'b'], widget3.widget2Data);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	},
	//widget2, widget3 loaded, then widget3 fetch data, the noData function should be called.
	function testPublishSub5() {
		var wm = WidgetManager.getInstance(),
			dohDeferred = new doh.Deferred(),
			dm = DataManager.getInstance(),
			widgetConfig2 = {
				"id": "testwidget26",
				"uri": "jimu/tests/testwidgets/Widget2/TestWidget2"
			},
			widgetConfig3 = {
				"id": "testwidget36",
				"uri": "jimu/tests/testwidgets/Widget3/TestWidget3"
			};
		topic.publish('clearAllData');
		removeAllWidgets(wm);
		wm.loadWidget(widgetConfig2).then(function(widget2) {
			wm.loadWidget(widgetConfig3).then(function(widget3) {
				doh.assertEqual(false, widget3.noData);
				widget3.fetchData('testwidget26');
				dohDeferred.getTestCallback(function() {
					doh.assertEqual(true, widget3.noData);
				})();
			}, function(err) {
				dohDeferred.errback(err);
			});
		}, function(err) {
			dohDeferred.errback(err);
		});

		return dohDeferred;
	}
	]);

doh.runOnLoad();
});