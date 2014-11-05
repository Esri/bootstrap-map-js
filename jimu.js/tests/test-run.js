document.write('<script src="' + apiUrl + '"></script>');

jimuConfig = {};

require({
  packages : [{
    name : "dojo",
    location : "/arcgis/apps/webappbuilder/libs/dojo/dojo"
  },{
    name : "dijit",
    location : "/arcgis/apps/webappbuilder/libs/dojo/dijit"
  },{
    name : "dojox",
    location : "/arcgis/apps/webappbuilder/libs/dojo/dojox"
  },{
    name : "widgets",
    location : "/arcgis/apps/webappbuilder/stemapp/widgets"
  }, {
    name : "jimu",
    location : "/arcgis/apps/webappbuilder/stemapp/jimu.js"
  }, {
    name : "doh",
    location : "/arcgis/apps/webappbuilder/libs/dojo/util/doh"
  }, {
    name : "esri",
    location : apiUrl + "js/esri"
  }]
},['dojo/io-query'], function (query) {
  var search = window.location.search,file;
  file = query.queryToObject(search.substring(1, search.length)).file;
  require(['jimu/tests/' + file]);
});