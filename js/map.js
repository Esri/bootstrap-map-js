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

require(["esri/map",
        "application/bootstrapmap",
        "esri/dijit/Scalebar",
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/dijit/OverviewMap",
        "esri/dijit/Directions",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Geocoder",
        "esri/dijit/Measurement",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "esri/InfoTemplate",
        "esri/dijit/Legend",
        "esri/toolbars/navigation",
        "dijit/registry",
        "dojo/parser",
        "dojo/on",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/dom",
        "dojo/domReady!"],
    function (Map, BootstrapMap, Scalebar, FeatureLayer, ArcGISTiledMapServiceLayer, OverviewMap, Directions, HomeButton,
              LocateButton, Geocoder, Measurement, Popup, PopupTemplate, InfoTemplate, Legend, Navigation, Registry, Parser, on,
              BorderContainer, ContentPane, dom)

    {
        // Get a reference to the ArcGIS Map class
        var map = BootstrapMap.create("mapDiv", {
            basemap: "streets",
            center: [-85.724, 37.593],
            zoom: 7,
            scrollWheelZoom: true,
            logo: false,
            nav: false,
            sliderPosition: "top-right"
        });

        var scalebar = new Scalebar({
            map: map,
            scalebarUnit: "dual"
        });

        // Add overview map
        var overviewMapDijit;
        overviewMapDijit = new OverviewMap({
            map: map,
            attachTo: "bottom-right",
            height: 120,
            width: 144,
            visible: true,
            opacity: 0.4,
            expandFactor: 3.0

        });
        overviewMapDijit.startup();

        // Add measurement dijit
        var measurement = new Measurement({
            map: map
        }, "measurementDiv");
        measurement.startup();


        // Add home button
        var home = new HomeButton({
            map: map
        }, "HomeButton");
        home.startup();


        // Add locate button
        var geoLocate = new LocateButton({
            map: map,
            scale: null
        }, "LocateButton");
        geoLocate.startup();


        // Add geocoder
        var geocoder2 = new Geocoder({
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

        var ConstInfoTemplate =  new InfoTemplate();
        infoTemplate.setTitle("Six Year Plan");

        var KYTCBasemap =
            //new esri.layers.ArcGISTiledMapServiceLayer("http://kytca00s06d.kytc.ds.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer");
            new ArcGISTiledMapServiceLayer("http://kygisserver.ky.gov/arcgis/rest/services/WGS84WM_Services/Ky_TCM_Base_WGS84WM/MapServer");
        // Add layers
        var syp0 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/0", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: ConstInfoTemplate,
            outFields: ["*"]
        });
        var syp1 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/1", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var syp2 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/2", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var syp3 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/3", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var syp4 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/4", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: infoTemplate,
            outFields: ["*"]
        });




        //Add legend

        map.addLayers([syp0, syp1, syp2, syp3, syp4]);
        //map.addLayer(countyPolyg);
        //map.addLayer(KYTCBasemap);

        var legend = new Legend({
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

