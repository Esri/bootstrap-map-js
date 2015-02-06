/*
require(["dojo/parser", "dojo/ready", "dojo/dom", "dojo/dom-construct", "esri/main",
        "esri/dijit/Attribution", "dijit/form/ComboBox", "dojo/data/ItemFileReadStore",
        "dojo/_base/array", "dijit/registry"],

    function (parser, ready, dom, domConstruct, esri, Attribution, ComboBox, ItemFileReadStore, array, registry) {

        ready(function () {
            //parser.parse();

            var populateList = function (results) {
                //Populate the ComboBox with unique values
                var zone;
                var values = [];
                var testVals = {};

                //Add option to display all zoning types to the ComboBox
                values.push({
                    name: "Select a county"
                });

                //Loop through the QueryTask results and populate an array
                //with the unique values
                var features = results.features;
                array.forEach(features, function (feature) {
                    zone = feature.attributes.NAME;
                    if (zone) {
                        if (!testVals[zone]) {
                            testVals[zone] = true;
                            values.push({
                                name: zone
                            });
                        }
                    }
                });

                //Create a ItemFileReadStore and use it for the
                //ComboBox's data source
                var dataItems = {
                    identifier: 'name',
                    label: 'name',
                    items: values
                };
                var store = new ItemFileReadStore({
                    data: dataItems
                });
                registry.byId("mySelect").set('store', store);
            };

            var queryTask = new esri.tasks.QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer/5");
            var query = new esri.tasks.Query();
            query.returnGeometry = false;
            query.outFields = ["NAME"];
            query.where = "NAME<> ''";
            //console.log(query.where);
            queryTask.execute(query, populateList);

            */
/*$("#locateCounty").click(function () {
                var county = $('#mySelect').val();
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
            }*//*

        });
    });




*/
