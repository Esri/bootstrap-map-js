/**
 * Created by ak on 9/26/14.
 */
/**
 * Created by Ahjung.Kim on 9/4/2014.
 */

/*if (!window.matchMedia || (window.matchMedia("(max-width: 767px)").matches)) {

 $(function () {
 $('[data-toggle="tooltip"]').tooltip();
 });
 }*/
var map;

require([
        "esri/config",
        "esri/map",
        "dojo/dom",
        "application/bootstrapmap",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/FeatureLayer",

        "esri/dijit/OverviewMap",
        "esri/dijit/Directions",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Geocoder",
        "esri/dijit/Measurement",
        "esri/dijit/Scalebar",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "esri/dijit/Legend",

        "esri/toolbars/navigation",

        "dijit/registry",

        "dojo/parser",
        "dojo/on",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane",


        "dojo/domReady!"
    ],
    function (esriConfig, Map, Scalebar, BootstrapMap, FeatureLayer, ArcGISTiledMapServiceLayer, dom, HomeButton,
              LocateButton, Geocoder, Legend, parser, Directions, arrayUtils, OverviewMap, Measurement, Popup,
              registry, Navigation, on) {

        // Get a reference to the ArcGIS Map class
        map = BootstrapMap.create("mapDiv", {
            basemap: "streets",
            center: [-85.724, 37.593],
            zoom: 7,
            scrollWheelZoom: true,
            logo: false,
            nav: false,
            sliderPosition: "top-right"
        });

        /*var navToolbar = new esri.toolbars.Navigation(map);
        on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);


        registry.byId("PrevExtent").on("click", function () {
            navToolbar.zoomToPrevExtent();
        });

        registry.byId("NextExtent").on("click", function () {
            navToolbar.zoomToNextExtent();
        });

        function extentHistoryChangeHandler () {
            registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
            registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
        }*/

/*        var directions = new esri.dijit.Directions({
            map: map
        }, "dir");
        directions.startup();*/


        // Add overview map
        var overviewMapDijit;
        overviewMapDijit = new esri.dijit.OverviewMap({
            map: map,
            attachTo: "bottom-right",
            height: 120,
            width: 144,
            visible: false,
            opacity: 0.4,
            expandFactor: 3.0

        });
        overviewMapDijit.startup();

        // Add measurement dijit
        var measurement = new esri.dijit.Measurement({
            map: map
        }, "measurementDiv");
        measurement.startup();


        // Add home button
        var home = new esri.dijit.HomeButton({
            map: map
        }, "HomeButton");
        home.startup();


        // Add locate button
        var geoLocate = new esri.dijit.LocateButton({
            map: map,
            scale: null
        }, "LocateButton");
        geoLocate.startup();


        // Add geocoder
        var geocoder2 = new esri.dijit.Geocoder({
            map: map,
            autoComplete: true,
            arcgisGeocoder: {
                name: "Esri World Geocoder"
            }
        }, "search");
        geocoder2.startup();

        $(document).ready(function () {
            $("#basemapList li").click(function (e) {
                switch (e.target.text) {
                    case "Streets":
                        map.setBasemap("streets");
                        break;
                    case "Imagery":
                        map.setBasemap("hybrid");
                        break;
                    case "National Geographic":
                        map.setBasemap("national-geographic");
                        break;
                    case "Topographic":
                        map.setBasemap("topo");
                        break;
                    case "Gray":
                        map.setBasemap("gray");
                        break;
                    case "Open Street Map":
                        map.setBasemap("osm");
                        break;
                    case "KYTC Basemap":
                        alert("lol");
                        break;
                }
            });
        });


/*
        Add layers
*/
        var KYTCBasemap =
            //new esri.layers.ArcGISTiledMapServiceLayer("http://kytca00s06d.kytc.ds.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer");
            new esri.layers.ArcGISTiledMapServiceLayer("http://kygisserver.ky.gov/arcgis/rest/services/WGS84WM_Services/Ky_TCM_Base_WGS84WM/MapServer");
        // Add layers
        var syp0 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/0", {
            mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"]
            //infoTemplate: popupTemplate,
        });
        /*var syp1 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/1", {
         mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
         //infoTemplate: popupTemplate,
         outFields: ["*"]
         });
         var syp2 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/2", {
         mode: esri.layers.FeatureLayer.MODE_ONDEMAND
         });
         var syp3 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/3", {
         mode: esri.layers.FeatureLayer.MODE_ONDEMAND
         });
         var syp4 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/4", {
         mode: esri.layers.FeatureLayer.MODE_ONDEMAND
         });*/
        //var countyPolyg = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/Overview/MapServer/5", {
        //    mode: esri.layers.FeatureLayer.MODE_ONDEMAND
        //});

        //Add legend

        map.addLayer(syp0);
        map.addLayer(KYTCBasemap);

        var legend = new esri.dijit.Legend({
            map:map
        },"legendDiv");

        legend.startup();

/*
        var myWidget = new TableOfContents({
            map: map,
            layers: syp0
        }, "TableOfContents");
        myWidget.startup();
*/

//        map.addLayer(syp1);
//        map.addLayer(syp2);
//        map.addLayer(syp3);
//        map.addLayer(syp4);






    });

