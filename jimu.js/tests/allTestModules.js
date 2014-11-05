define([
  'doh/main', 'require'
], function(doh, require) {
  var url = '/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/my-test-loader.html';
  doh.register('widget manager tests',url + "?file=test-widgetmanager",30000);
  //doh.register('app config tests',url + "?file=test-config",30000);
  doh.register('data manager tests',url + "?file=test-datamanager",30000);
  doh.register('utils tests',url + "?file=test-utils",30000);
  // doh.register('jquery loader tests',url + "?file=test-jquery-loader",30000);
  doh.register('order loader tests',url + "?file=test-order-loader",30000);

  // if (doh.isBrowser) {
  //   doh.register(" tests.Overview", require.toUrl("./testwidgets/Overview/test_Overview.html"), 3000000);
  //   doh.register(" tests.AttributeTable", require.toUrl("./testwidgets/AttributeTable/AttributeTable.html"), 3000000);
  // }
});