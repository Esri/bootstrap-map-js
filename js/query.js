require(["dojo/parser", "dojo/ready", "dojo/dom", "dojo/dom-construct", "esri/main",
    "esri/dijit/Attribution", "dijit/form/ComboBox", "dojo/data/ItemFileReadStore",
    "dojo/_base/array", "dijit/registry", "esri/tasks/QueryTask", "esri/tasks/query"],

  function (parser, ready, dom, domConstruct, esri, Attribution, ComboBox, ItemFileReadStore, array, registry, QueryTask, Query) {

    ready(function () {
      showResults = function(results){
        var features = results.features;
        var attrArray = [];
        array.forEach(features, function (feature) {

          county = feature.attributes.NAME;
          attrArray.push(county);


        });

        var option = '';
        attrArray.sort();
        for (i=0;i<attrArray.length;i++){
          option += '<option value="'+ attrArray[i] + '">' + attrArray[i] + '</option>';
        }
        $("#select-county").append(option);

        $('.selectpicker').selectpicker('refresh');
      };

      var queryTask = new QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/5");
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = ["NAME"];
      query.where = "NAME<> ''";
      queryTask.execute(query, showResults);

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




