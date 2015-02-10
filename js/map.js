/*if (!window.matchMedia || (window.matchMedia("(max-width: 767px)").matches)) {

 $(function () {
 $('[data-toggle="tooltip"]').tooltip();
 });
 }*/


require(["esri/map",
        "application/bootstrapmap",

        "esri/tasks/query",
        "esri/tasks/QueryTask",

        "esri/toolbars/navigation",
        "dojo/on",

        "esri/dijit/Scalebar",
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/ArcGISImageServiceLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/LabelLayer",
        "esri/dijit/OverviewMap",
        //"esri/dijit/Directions",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Geocoder",
        "esri/dijit/Measurement",
        "esri/InfoTemplate",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "esri/dijit/Bookmarks",

        "esri/toolbars/draw",
        "esri/graphic",

        "dojo/_base/Color",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/TextSymbol",
        "esri/symbols/Font",

        "esri/dijit/Print",
        "esri/dijit/Legend",
        "dijit/registry",
        "dijit/Toolbar",
        "dojo/parser",
        "dojo/dom",
        "dijit/form/Button",
        "dojo/domReady!"],
    function (Map, BootstrapMap, Query, QueryTask, Navigation, on, Scalebar, FeatureLayer, ArcGISTiledMapServiceLayer, ArcGISImageServiceLayer,
              ArcGISDynamicMapServiceLayer, LabelLayer, OverviewMap, HomeButton,
              LocateButton, Geocoder, Measurement, InfoTemplate, InfoWindow, domConstruct, Popup, PopupTemplate,
              Bookmarks, Draw, Graphic,
              Color, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,TextSymbol, Font,
              Print, Legend, registry, Toolbar, parser, dom)
    {
        //var popup = new Popup(null, dojo.create("div"));

        var navToolbar;

        // Get a reference to the ArcGIS Map class
        var map = BootstrapMap.create("mapDiv", {
            basemap: "gray",
            center: [-85.724, 37.593],
            zoom: 8,
            scrollWheelZoom: true,
            logo: false,
            nav: false,
            sliderPosition: "top-right"
            //infoWindow: popup,
            //showInfoWindowOnClick: true
        });

        // Create the bookmark widget
        var bookmarks = new Bookmarks({
            map: map,
            bookmarks: [],
            editable: true
        }, dojo.byId('bookmarks'));
        //bookmarks.startup();


        //map.infoWindow.resize(320,500);

        navToolbar = new Navigation(map);
        on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);

        //jQuery.noConflict();

        // TODO: using jQuery and Dojo together

        $("#zoomprev").on("click", function () {
            navToolbar.zoomToPrevExtent();
        });
        $("#zoomnext").on("click", function () {
            navToolbar.zoomToNextExtent();
        });

        var printer = new Print({
            map: map,
            url: "http://maps.kytc.ky.gov/arcgis/rest/services/ExportWebMap/GPServer/Export%20Web%20Map"
    }, dom.byId("printButton"));
        printer.startup();

        function extentHistoryChangeHandler () {
            registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
            registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
        }

        var scalebar = new Scalebar({
            map: map,
            scalebarUnit: "dual"
        });

        // Add overview map
        var overviewBase = new ArcGISTiledMapServiceLayer(
            "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
        var overviewMapDijit;
        overviewMapDijit = new OverviewMap({
            map: map,
            baseLayer: overviewBase,
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
                    case "Terrain":
                        map.setBasemap("terrain");
                        break;
                    case "Dark Gray":
                        map.setBasemap("dark-gray");
                        break;
                }
            });
        });

        var json = {
            title: "<b>CONSTRUCTION SYP</b>",
            content:
                "<strong>District No.</strong> : <td>${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_DISTNO}<br>"+
                "<strong>Item No.</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_ITEMNO}<br>" +
                "<strong>Highway Plan </strong> : <a target='_blank' href = ${KYTCDynamic.PROGMGMT.SYP.PRECON_INFO_LINK}>${KYTCDynamic.PROGMGMT.SYP.PRECON_INFO_LINK}</a><br>" +
                "<strong>County & Route</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.LOCUNIQUE}<br>" +
                "<strong>Beginning Mile Point</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.BMP}<br>" +
                "<strong>Ending Mile Point</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.EM}<br>" +
                "<strong>County Name</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.COUNTYNAME}<br>" +
                "<strong>Type Work</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_TYPEWORK}<br>" +
                "<strong>Project Description</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_DESC}<br>" +
                "<strong>Bridge Number</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_BRNO}<br>" +
                "<strong>Construction Phase Stage</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PHA_STAGE}<br>" +
                "<strong>Contract Number</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_CONTRACTNO}<br>" +
                "<strong>Date Awarded</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PHA_AUTHDATE}<br>" +
                "<strong>Project Status</strong> : ${KYTCDynamic.ARCGISSERVERREAD.%SYP_CONSTRUCTION_Query_Layer_1_2_3_4_5_6_7_8_1_2.SYP_PRO_PRECONFLAG}<br>"
        };

        var ConstInfoTemplate =  new InfoTemplate(json);

        //define custom popup options
        //create a popup to replace the map's info window
        var syp0 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/0", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: ConstInfoTemplate,
            outFields : ["*"]
        });
        map.addLayer(syp0);
        //map.infoWindow.resize(500, 500);
        var syp1 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/1", {
            mode: FeatureLayer.MODE_ONDEMAND,
            //infoTemplate: PlanningInfoTemplate,
            outFields: ["*"]
        });
        var syp2 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/2", {
            mode: FeatureLayer.MODE_ONDEMAND,
            //infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var syp3 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/3", {
            mode: FeatureLayer.MODE_ONDEMAND,
            //infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var syp4 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/4", {
            mode: FeatureLayer.MODE_ONDEMAND,
            //infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var legend = new Legend({
            map:map
        },"legendDiv");
        legend.startup();

        map.addLayers([syp0,syp1, syp3, syp4]);

        function ToggleImageServiceLayer(serviceURL,ID) {

            var Layer = new ArcGISImageServiceLayer(serviceURL);
            $(ID).change(function(){
                if($(this).is(":checked")){
                    map.addLayer(Layer);}
                if(!$(this).is(":checked")){
                    map.removeLayer(Layer);}
            });
        }

        ToggleImageServiceLayer("http://kyraster.ky.gov/arcgis/rest/services/ImageServices/Ky_KRG/ImageServer","#ky-krg-toggle");
        ToggleImageServiceLayer("http://kyraster.ky.gov/arcgis/rest/services/ImageServices/Ky_Geologic_Quadrangle_Maps/ImageServer","#ky-gq-toggle");
        ToggleImageServiceLayer("http://kyraster.ky.gov/arcgis/rest/services/ElevationServices/KY_ShadedRelief_USGS_10M/ImageServer", "#usgs-10m-dem");

        function ToggleDynamicServiceLayer(serviceURL,ID) {

            var Layer = new ArcGISDynamicMapServiceLayer(serviceURL);
            $(ID).change(function(){
                if($(this).is(":checked")){
                    map.addLayer(Layer);}
                if(!$(this).is(":checked")){
                    map.removeLayer(Layer);}
            });
        }
        ToggleDynamicServiceLayer("http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer",'#ky-basemap-toggle');

        function ToggleTiledServiceLayer(serviceURL,ID) {

            var Layer = new ArcGISTiledMapServiceLayer(serviceURL);
            $(ID).change(function(){
                if($(this).is(":checked")){
                    map.addLayer(Layer);}
                if(!$(this).is(":checked")){
                    map.removeLayer(Layer);}
            });
        }
        ToggleTiledServiceLayer("http://kygisserver.ky.gov/arcgis/rest/services/WGS84WM_Services/Ky_TCM_Base_WGS84WM/MapServer", "#dgi-toggle");

        //map.on("click", addPoint);

        /*function addPoint(evt) {
            var latitude = evt.mapPoint.getLatitude();
            var longitude = evt.mapPoint.getLongitude();
            map.infoWindow.setTitle("Coordinates");
            map.infoWindow.setContent(
                "lat/lon : " + latitude.toFixed(2) + ", " + longitude.toFixed(2) +
                "<br>screen x/y : " + evt.screenPoint.x + ", " + evt.screenPoint.y
            );
            map.infoWindow.resize(250, 100);
            map.infoWindow.show(evt.mapPoint, map.getInfoWindowAnchor(evt.screenPoint));
        }*/
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
    });

