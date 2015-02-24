$(document).ready(function () {
  require(["esri/map",
      "application/bootstrapmap",
      "TOC/dijit/TOC",

      "esri/tasks/query",
      "esri/tasks/QueryTask",

      "esri/toolbars/navigation",
      "dojo/on",
      "dojo/_base/array",

      "esri/dijit/Scalebar",
      "esri/layers/FeatureLayer",
      "esri/layers/ArcGISTiledMapServiceLayer",
      "esri/layers/ArcGISImageServiceLayer",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/layers/WebTiledLayer",
      "esri/layers/LabelLayer",
      "esri/dijit/OverviewMap",
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
    function (Map, BootstrapMap, TOC, Query, QueryTask, Navigation, on, array, Scalebar, FeatureLayer, ArcGISTiledMapServiceLayer,
              ArcGISImageServiceLayer, ArcGISDynamicMapServiceLayer, WebTiledLayer, LabelLayer, OverviewMap, HomeButton,
              LocateButton, Geocoder, Measurement, InfoTemplate, InfoWindow, domConstruct, Popup, PopupTemplate,
              Bookmarks, Draw, Graphic,
              Color, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font,
              Print, Legend, registry, Toolbar, parser, dom) {

      // Get a reference to the ArcGIS Map class
      var map = BootstrapMap.create("mapDiv", {
        basemap: "streets",
        center: [-85.724, 37.593],
        zoom: 7,
        scrollWheelZoom: true,
        logo: false,
        nav: false,
        sliderPosition: "top-right"
        //infoWindow: popup,
        //showInfoWindowOnClick: true
      });

      // Create the bookmark widget
      var bookmarks;
      bookmarks = new Bookmarks({
        map: map,
        bookmarks: [],
        editable: true
      }, dom.byId("bookmarks"));

      // Create prev, next extent buttons
      var navToolbar;
      navToolbar = new Navigation(map);
      on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);

      $("#zoomprev").on("click", function () {
        navToolbar.zoomToPrevExtent();
      });
      $("#zoomnext").on("click", function () {
        navToolbar.zoomToNextExtent();
      });

      // Printer widget
      // TODO: Try Viewer map's widget
      var printer;
      printer = new Print({
        map: map,
        url: "http://maps.kytc.ky.gov/arcgis/rest/services/ExportWebMap/GPServer/Export%20Web%20Map"
      }, dom.byId("printButton"));
      printer.startup();

      function extentHistoryChangeHandler() {
        registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
        registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
      }

      // Add scale bar
      var scalebar;
      scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
      });

      // Add overview map
      var overviewBase = new ArcGISTiledMapServiceLayer(
        "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"), overviewMapDijit;

      var visibleBool;
      if (!("ontouchstart" in window)) {
        visibleBool = true;
      }
      // If touch screen,
      else {
        visibleBool = false;
      }

      overviewMapDijit = new OverviewMap({
        map: map,
        baseLayer: overviewBase,
        attachTo: "bottom-right",
        height: 120,
        width: 144,
        visible: visibleBool,
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

      // Add locate me button
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

      //Legend widget
      var legend = new Legend({
        map: map
      }, "legendDiv");
      legend.startup();

      // Basemap toggle
      $(document).ready(function () {
        $("#basemapList").find("li").click(function (e) {
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
      /* Mutually exclusive checkbox for toggling basemaps */
      $("input[name=myCheckbox]").change(function () {

        // If this checkbox is checked, turn off other checkboxes
        if ($(this).prop("checked")) {
          $("input[name=myCheckbox]").prop("checked", false);
          // TODO:
          $(this).prop("checked", true);
        }
        ToggleBasemap();
      });

      function ToggleBasemap() {
        $("input[name=myCheckbox]").each(function () {
          var Layer;
          switch ($(this).attr("id")) {
            case "ky-basemap-toggle":
              Layer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer",
                {id: "kytc-basemap"});
              break;
            case "dgi-toggle":
              Layer = new ArcGISTiledMapServiceLayer(
                "http://kygisserver.ky.gov/arcgis/rest/services/WGS84WM_Services/Ky_TCM_Base_WGS84WM/MapServer",
                {id: "dgi-basemap"});
              break;
            case "ky-krg-toggle":
              Layer = new ArcGISImageServiceLayer(
                "http://kyraster.ky.gov/arcgis/rest/services/ImageServices/Ky_KRG/ImageServer",
                {id: "krg-basemap"});
              break;
            case "usgs-10m-dem":
              Layer = new ArcGISImageServiceLayer(
                "http://kyraster.ky.gov/arcgis/rest/services/ElevationServices/KY_ShadedRelief_USGS_10M/ImageServer",
                {id: "10m-dem-basemap"});
              break;
            case "ky-gq-toggle":
              Layer = new ArcGISImageServiceLayer(
                "http://kyraster.ky.gov/arcgis/rest/services/ImageServices/Ky_Geologic_Quadrangle_Maps/ImageServer",
                {id: "gq-basemap"});
              break;
          }
          if (!this.checked) {

            if ($.inArray(Layer.id, map.layerIds) !== -1) {
              map.removeLayer(map.getLayer(Layer.id));
            }
          } else {
            map.addLayer(Layer);
          }
        });
      }

      // Add layers
      // Awarded current Hwy Plan Projects
      var infoTempalteContentString =
        "<strong>Object ID</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.OBJECTID}<br>" +
        "<strong>Plan Year</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.PLAN_YEAR}<br>" +
        "<strong>Current Plan</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.CURRENT_PLAN }<br>" +
        "<strong>Publication Status</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.PUBLICATION_STATUS}<br>" +
        "<strong>Highway Plan </strong> : <a target='_blank' href = ${KYTCDynamic_ProgramMgmt.DBO.SYP.PRECON_INFO_LINK}>${KYTCDynamic_ProgramMgmt.DBO.SYP.PRECON_INFO_LINK}</a><br>" +
        "<strong>District No.</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_PRO_DISTNO}<br>" +
        "<strong>Item No.</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_PRO_ITEMNO}<br>" +
        "<strong>Location Unique</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.LOCUNIQUE}<br>" +
        "<strong>Beginning Mile Point</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.BMP}<br>" +
        "<strong>Ending Mile Point</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.EMP}<br>" +
        "<strong>County Number</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.COUNTY}<br>" +
        "<strong>County Name</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.COUNTYNAME}<br>" +
        "<strong>Prefix</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.PREFIX}<br>" +
        "<strong>Route No.</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.ROUTENO}<br>" +
        "<strong>Suffix</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SUFFIX}<br>" +
        "<strong>Couplet ID</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.COUPLETID}<br>" +
        "<strong>SYP Number 1</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.COUPLETID}<br>" +
        "<strong>RT Unique</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.RT_NE_UNIQUE}<br>" +
        "<strong>SYP Number 2</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.DIST_ITEM_MOD}<br>" +
        "<strong>Description</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_DESC}<br>" +
        "<strong>Type of Work</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_TYPEWORK}<br>" +
        "<strong>Active or Inactive</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_PRECONFLAG}<br>" +
        "<strong>Plan Phase Code</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_PHASECODEP}<br>" +
        "<strong>Plan Funding Code</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_CSYFUNDCODEP}<br>" +
        "<strong>Plan Funding Cost</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_CSYFUNDCOSTP}<br>" +
          //"<strong></strong> : ${}<br>" +
        "<strong>County & Route</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.LOCUNIQUE}<br>" +
        "<strong>Bridge Number</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.RPL_BRG_NUM}<br>" +
        "<strong>Construction Phase Stage</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_STAGEC}<br>";

      var json0 = {
        title: "<strong>Awarded Current Hwy Plan</strong>",
        content: infoTempalteContentString
      }; // json for InfoTemplate
      var sypInfoTemplate0 = new InfoTemplate(json0);


      var json1 = {
        title: "<strong>Current Hwy Plan</strong>",
        content: infoTempalteContentString
      };
      var sypInfoTemplate1 = new InfoTemplate(json1);

      var json2 = {
        title: "<strong>Previous Hwy Plan</strong>",
        content: infoTempalteContentString
      };
      var sypInfoTemplate2 = new InfoTemplate(json2);

      //define custom popup options
      //create a popup to replace the map's info window
      var syp0 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/0", {
        mode: FeatureLayer.MODE_ONDEMAND,
        infoTemplate: sypInfoTemplate0,
        outFields: ["*"]
      });
      var syp1 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/1", {
        mode: FeatureLayer.MODE_ONDEMAND,
        infoTemplate: sypInfoTemplate1,
        outFields: ["*"]
      });
      var syp2 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/2", {
        mode: FeatureLayer.MODE_ONDEMAND,
        infoTemplate: sypInfoTemplate2,
        outFields: ["*"]
      });

      // Add KYTC basemap on startup
      var KytcBaseLayer;
      KytcBaseLayer = new ArcGISDynamicMapServiceLayer(
        "http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer",
        {id: "kytc-basemap"});
      map.addLayer(KytcBaseLayer);
      //map.infoWindow.resize(320, 285);

      /* var TrafficCountLayer;
       TrafficCountLayer = new ArcGISDynamicMapServiceLayer(
       "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/TrafficCounts/MapServer",
       {id: "Traffic Counts"});*/

      map.addLayers([syp2, syp1, syp0]);

      // Map.on addlayers then TOC
      var toc = new agsjs.dijit.TOC({
        map: map,
        layerInfos: [{
          layer: syp0,
          title: 'Awarded Current Hwy Plan Projects',
          slider: true
        }, {
          layer: syp1,
          title: 'Current Hwy Plan Projects',
          slider: true
        }, {
          layer: syp2,
          title: 'Previous Hwy Plan Projects',
          slider: true
        }]

      }, 'tocDiv');

      $("input[name=opLayerCheckbox]").change(function () {
        ToggleOpLayer();
      });

      function ToggleOpLayer() {
        $("input[name=opLayerCheckbox]").each(function () {
          var opLayer;
          switch ($(this).attr("id")) {
            case "prjArchToggle":
              opLayer = new ArcGISDynamicMapServiceLayer(
              "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ProjectArchives/MapServer",
                {id: "prj-archive-lyrs"});
              break;
            case "trafficToggle":
              opLayer = new ArcGISTiledMapServiceLayer(
                "//maps.kytc.ky.gov/arcgis/rest/services/Apps/TrafficCounts/MapServer",
                {id: "traffic-counts-layers"});
              break;
          }
          /*if (opLayer == null) {
           opLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
           "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/TrafficCounts/MapServer", {
           opacity: 0.8
           });*/
          var h = dojo.connect(map, 'onLayerAddResult', function (result) {
            toc.layerInfos.splice(0, 0, {
              layer: opLayer,
              //title: "Traffic Counts",
              // collapsed: true, // whether this root layer should be collapsed initially, default false.
              slider: true, // whether to display a transparency slider. default false.
              autoToggle: false //whether to automatically collapse when turned off, and expand when turn on for groups layers. default true.
            });
            toc.refresh();
            dojo.disconnect(h);
          });
          map.addLayer(opLayer);
        });
      }
    });
  // Camera button brings up photo log divs
  $("#CameraButton").click(function () {
    //$(".content").css({"width":"550px"});
  });
});