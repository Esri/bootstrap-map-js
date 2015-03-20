require(["dojo/ready", "dojo/dom", "esri/dijit/Attribution", "dojo/_base/array", "esri/tasks/QueryTask", "esri/tasks/query"],
  function (ready, dom, Attribution, array, QueryTask, Query) {
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
        query.returnGeometry = false;
        query.outFields = [attrName];
        query.where = attrName + "<> ''";
        queryTask.execute(query, showCities);
      }
      QueryCities("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/268", "NAME");

      $("#locate-county-btn").click(function(){
        var county = $("#select-county").val();
        if (county!=="Nothing selected"){
        //  zoom to query
          var queryTask = new QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/5");
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = "NAME";
          query.where = "'NAME' = " +  county;
          queryTask.executeForExtent(query, zoomToExtent);
          zoomToExtent = map.setExtent;
        }
      });
    });
  });




