define([
    'doh/runner'
],function(doh){
  var url = '/arcgis/apps/webappbuilder/stemapp/jimu.js/tests/my-test-loader.html';
  doh.register('current tests',url + "?file=test-datamanager",30000);
});
