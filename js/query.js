$(document).ready(function () {
  require([
      "dojo/dom", "dojo/_base/array", "esri/tasks/QueryTask", "esri/tasks/query", "dojo/domReady!"],
    function (dom, array, QueryTask, Query) {

      function showCounties(results) {
        var features = results.features;
        var attrArray = [];
        array.forEach(features, function (feature) {
          attribute = feature.attributes.NAME;
          attrArray.push(attribute);
        });
        var option = '';
        attrArray.sort();
        for (i = 0; i < attrArray.length; i++) {
          option += '<option value="' + attrArray[i] + '">' + attrArray[i] + '</option>';
        }
        $("#select-county").append(option);
        //$('.selectpicker').selectpicker('refresh');
      }

      function showCities(results) {
        var features = results.features;
        var attrArray = [];
        array.forEach(features, function (feature) {
          attribute = feature.attributes.NAME;
          attrArray.push(attribute);
        });
        var option = '';
        attrArray.sort();
        for (i = 0; i < attrArray.length; i++) {
          option += '<option value="' + attrArray[i] + '">' + attrArray[i] + '</option>';
        }
        $("#select-city").append(option);
        //$('.selectpicker').selectpicker('refresh');
      }

      function QueryCounties(serviceLayer, attrName) {
        var queryTask = new QueryTask(serviceLayer);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = [attrName];
        query.where = attrName + "<> ''";
        queryTask.execute(query, showCounties);
      }

      QueryCounties("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/5", "NAME");

      function QueryCities(serviceLayer, attrName) {
        var queryTask = new QueryTask(serviceLayer);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [attrName];
        query.where = attrName + "<> ''";
        queryTask.execute(query, showCities);
      }

      QueryCities("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/268", "NAME");

    });
});



