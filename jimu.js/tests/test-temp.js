require(["doh/runner",
 'jimu/WidgetManager',
 'jimu/ConfigManager',
 'dojo/dom',
 'dojo/dom-construct',
 'dojo/query',
 'dojo/promise/all',
 'dojo/NodeList-dom'],
  function(doh, WidgetManager, ConfigManager, dom, domConstruct, query, all, nld) {
  path = '/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/';
  ConfigManager.getInstance()._setConfig({
    locale: 'en-US'
  });
  doh.register("load widget tests", [
  {
    name: 'testWidgetConfigRPath',
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
  } 
  ]);

doh.runOnLoad();
});