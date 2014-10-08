/**
 * Created by ak on 9/26/14.
 */
/**
 * Created by Ahjung.Kim on 9/4/2014.
 */
require([
        "esri/map",
        "dojo/dom",
        "application/bootstrapmap",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/FeatureLayer",

        "esri/dijit/OverviewMap",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Geocoder",
        "esri/dijit/Measurement",
        "esri/dijit/Scalebar",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",

        "dojo/domReady!"
    ],
    function(Map, Scalebar, BootstrapMap, FeatureLayer, ArcGISTiledMapServiceLayer, dom, HomeButton, LocateButton, Geocoder,
             OverviewMap, Measurement, Popup) {
        // Get a reference to the ArcGIS Map class
        var map = BootstrapMap.create("mapDiv", {
            basemap: "topo",
            center: [-85.724, 37.593],
            zoom: 8,
            scrollWheelZoom: true,
            logo: false,
            nav: false,
            sliderPosition: "top-right"
//            infoWindow: popup
        });

        /*var KYBase = new ArcGISTiledMapServiceLayer("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer");
         map.addLayer(KYBase);*/

        // Add overview map
        var overviewMapDijit = new esri.dijit.OverviewMap({
            map: map,
            attachTo: "bottom-right",
            height: 150,
            width: 200,
            visible: true,
            opacity: 0.4,
            expandFactor: 3.0
        });
        overviewMapDijit.startup();

//        var measurement = new esri.dijit.Measurement({
//            map:map
//        },dojo.byId("measurement"));
//        measurement.startup();

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

//        var scalebar = new Scalebar({
//            map: map,
//            scalebarUnit: "dual"
//        });

        // Add geocoder
        var geocoder2 = new esri.dijit.Geocoder({
            map: map,
            autoComplete: true,
            arcgisGeocoder: {
                name: "Esri World Geocoder"
            }
        }, "search");
        geocoder2.startup();

        $(document).ready(function() {
            $("#basemapList li").click(function(e) {
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

        // Add DGN basemap
        var DGNBasemap  = new esri.layers.ArcGISTiledMapServiceLayer("http://kygisserver.ky.gov/arcgis/rest/services/WGS84WM_Services/Ky_TCM_Base_WGS84WM/MapServer");

        // Add layers
        var syp0 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/0", {
            mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"]
            //infoTemplate: popupTemplate,
        });
        var syp1 = new esri.layers.FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/1", {
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
        });


        map.addLayer(DGNBasemap);
        map.addLayer(syp0);
//        map.addLayer(syp1);
//        map.addLayer(syp2);
//        map.addLayer(syp3);
//        map.addLayer(syp4);

    });