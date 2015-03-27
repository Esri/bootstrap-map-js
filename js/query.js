$(document).ready(function () {
  require([
      "dojo/dom", "dojo/_base/array", "esri/tasks/QueryTask", "esri/tasks/query", "dojo/domReady!"],
    function (dom, array, QueryTask, Query) {

      function populateCounty(results) {
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
        $("#select-county2").append(option);
      }
      function populateCity(results) {
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
      }
      function populateUsgs(results){
        var features = results.features;
        var attrArray = [];
        array.forEach(features, function (feature) {
          attribute = feature.attributes.QUAD_NAME;
          attrArray.push(attribute);
        });
        var option = '';
        attrArray.sort();
        for (i = 0; i < attrArray.length; i++) {
          option += '<option value="' + attrArray[i] + '">' + attrArray[i] + '</option>';
        }
        $("#select-usgs").append(option);
      }

      $("#select-county2").change(function() {
        var county = $("#select-county2").val();
        var queryTask = new QueryTask("//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/1");
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = ["RT_PREFIX"];
        query.where = "CO_NAME =" + "'" + county +"'";
        console.log(query.where);
        queryTask.execute(query, populatePrefix);

        function populatePrefix(results){
          var features = results.features;
          console.log(features);
          var attrArray = [];
          array.forEach(features, function (feature) {
            attribute = feature.attributes.RT_PREFIX;
            attrArray.push(attribute);
          });
          var option = '';
          jQuery.unique(attrArray);
          attrArray.sort();
          for (i = 0; i < attrArray.length; i++) {
            option += '<option value="' + attrArray[i] + '">' + attrArray[i] + '</option>';
          }
          $("#select-prefix").append(option);
        }
      });

      function QueryAttribute(serviceLayer, attrName, populateDropdown) {
        var queryTask = new QueryTask(serviceLayer);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = [attrName];
        query.where = attrName + "<> ''";
        queryTask.execute(query, populateDropdown);
      }

      // County
      QueryAttribute("//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/2", "NAME", populateCounty);
      // City
      QueryAttribute("//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/10", "NAME", populateCity);
      // USGS quadrangles
      QueryAttribute("//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/4","QUAD_NAME", populateUsgs);
    });
});



