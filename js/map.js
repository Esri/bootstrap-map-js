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

        "esri/toolbars/navigation",
        "dojo/on",

        "esri/dijit/Scalebar",
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/LabelLayer",
        "esri/dijit/OverviewMap",
        "esri/dijit/Directions",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Geocoder",
        "esri/dijit/Measurement",
        "esri/InfoTemplate",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",

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
    function (Map, BootstrapMap, Navigation, on, Scalebar, FeatureLayer, ArcGISTiledMapServiceLayer, LabelLayer, OverviewMap, Directions, HomeButton,
              LocateButton, Geocoder, Measurement, InfoTemplate, InfoWindow, domConstruct, Popup, PopupTemplate,
              Draw, Graphic,
              Color, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,TextSymbol, Font,
              Print, Legend, registry, Toolbar, parser, dom)

    {

        var popup = new Popup(null, dojo.create("div"));


        var navToolbar;

        // Get a reference to the ArcGIS Map class
        var map = BootstrapMap.create("mapDiv", {
            basemap: "streets",
            center: [-85.724, 37.593],
            zoom: 7,
            scrollWheelZoom: true,
            logo: false,
            nav: false,
            sliderPosition: "top-right",
            infoWindow: popup,
            showInfoWindowOnClick: true
        });

        map.infoWindow.resize(320,500);


        navToolbar = new Navigation(map);
        on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);

        //jQuery.noConflict();

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
        var overviewMapDijit;
        overviewMapDijit = new OverviewMap({
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
                        window.alert("lol");
                        break;
                }
            });
        });

        var KYTCBasemap =
            //new esri.layers.ArcGISTiledMapServiceLayer("http://kytca00s06d.kytc.ds.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer");
            new ArcGISTiledMapServiceLayer("http://kygisserver.ky.gov/arcgis/rest/services/WGS84WM_Services/Ky_TCM_Base_WGS84WM/MapServer");

        var countyPolygon = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/BusinessIntelligence/Boundaries/MapServer/0",{
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["NAME"]
            });


        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,255,1.0]), 1),
            new Color([125,125,125,0.35]));
        countyPolygon.setRenderer(new SimpleRenderer(symbol));
        map.addLayer(countyPolygon);


        /* Add label for county polygon
        var countyColor = new Color([125,125,125,1.0]);
        var countyLabel = new TextSymbol().setColor(countyColor);
        countyLabel.font.setSize("8pt");
        countyLabel.font.setFamily("arial");
        countyLabel.font.setWeight(Font.WEIGHT_BOLD);
        var countyLabelRenderer = new SimpleRenderer(countyLabel);
        var labels = new LabelLayer({ id: "labels" });
        // tell the label layer to label the countries feature layer
        // using the field named "admin"
        labels.addFeatureLayer(countyPolygon, countyLabelRenderer, "{" + "NAME" + "}");
        map.addLayer(labels);*/



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



        /*var earthquakes = new FeatureLayer("http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Earthquakes/MapServer/0",{ mode:
        FeatureLayer.MODE_SNAPSHOT, outFields: ["Magnitude"]});

            var infoTemplate = new InfoTemplate("Test", "Magnitude : ${MAGNITUDE}");
            var featureLayer = new FeatureLayer("http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Earthquakes/MapServer/0",{
            mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["MAGNITUDE"],
                infoTemplate: infoTemplate
        });
        map.addLayer(featureLayer);
        map.infoWindow.resize(155,75);*/




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




        //Add legend

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


    });

