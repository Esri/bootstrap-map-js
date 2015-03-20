require(["dojo/parser", "dojo/ready", "dojo/dom", "dojo/dom-construct", "esri/main",
    "esri/dijit/Attribution", "dojo/_base/array", "dijit/registry", "esri/tasks/QueryTask", "esri/tasks/query"],

  function (parser, ready, dom, domConstruct, esri, Attribution, array, registry, QueryTask, Query) {

    ready(function () {
      function showCounties(results){
        var features = results.features;
        var attrArray = [];
        array.forEach(features, function (feature) {
          attribute = feature.attributes.NAME;
          attrArray.push(attribute);
        });
        var option = '';
        attrArray.sort();
        for (i=0;i<attrArray.length;i++){
          option += '<option value="'+ attrArray[i] + '">' + attrArray[i] + '</option>';
        }
        $("#select-county").append(option);
        $('.selectpicker').selectpicker('refresh');
      }
      function showCities(results){
        var features = results.features;
        var attrArray = [];
        array.forEach(features, function (feature) {
          attribute = feature.attributes.NAME;
          attrArray.push(attribute);
        });
        var option = '';
        attrArray.sort();
        for (i=0;i<attrArray.length;i++){
          option += '<option value="'+ attrArray[i] + '">' + attrArray[i] + '</option>';
        }
        $("#select-city").append(option);
        $('.selectpicker').selectpicker('refresh');
      }

      function QueryCounties(serviceLayer, attrName){
        var queryTask = new QueryTask(serviceLayer);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = [attrName];
        query.where = attrName + "<> ''";
        queryTask.execute(query, showCounties);
      }
      QueryCounties("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/5", "NAME");

      function QueryCities(serviceLayer, attrName){
        var queryTask = new QueryTask(serviceLayer);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = [attrName];
        query.where = attrName + "<> ''";
        queryTask.execute(query, showCities);
      }


      QueryCities("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/268", "NAME");
      /*$("#locateCounty").click(function () {
        var county = $('#countySelect').val();
        var queryTask = new QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/5");
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["NAME"];
        query.where = "NAME = " + county;
        queryTask.execute(query, showResults);
      });
      function showResults(results) {
        var result = results[0];
        var extent = result.geometry.getExtent().expand(5.0);
      }*/
    });
  });




