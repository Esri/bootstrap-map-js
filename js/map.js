require(["esri/map",
    "application/bootstrapmap",

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
  function (Map, BootstrapMap, Query, QueryTask, Navigation, on, array, Scalebar, FeatureLayer, ArcGISTiledMapServiceLayer, ArcGISImageServiceLayer,
            ArcGISDynamicMapServiceLayer, WebTiledLayer, LabelLayer, OverviewMap, HomeButton,
            LocateButton, Geocoder, Measurement, InfoTemplate, InfoWindow, domConstruct, Popup, PopupTemplate,
            Bookmarks, Draw, Graphic,
            Color, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font,
            Print, Legend, registry, Toolbar, parser, dom) {
    //var popup = new Popup(null, dojo.create("div"));

    var navToolbar;

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
    var bookmarks = new Bookmarks({
      map: map,
      bookmarks: [],
      editable: true
    }, dom.byId("bookmarks"));



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

    function extentHistoryChangeHandler() {
      registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
      registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
    }

    var scalebar = new Scalebar({
      map: map,
      scalebarUnit: "dual"
    });
    //scalebar.startup();

    // Add overview map
    var overviewBase = new ArcGISTiledMapServiceLayer(
      "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
    var overviewMapDijit;

    var visibleBool;
    if(!('ontouchstart' in window))
    {
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


/*    if (map.basemapLayerIds && map.basemapLayerIds.length > 0) {
      array.forEach(map.basemapLayerIds, function(lid) {
        map.removeLayer(map.getLayer(lid));
      });
      map.basemapLayerIds = [];
    } else {
      map.removeLayer(map.getLayer(map.layerIds[0]));
    }*/


    $(document).ready(function () {
      var l, options;
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

    var json = {
      title: "<b>Awarded Current Hwy Plan</b>",
      content: "<strong>District No.</strong> : <td>${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_PRO_DISTNO}<br>" +
      "<strong>Item No.</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_PRO_ITEMNO}<br>" +
      "<strong>Highway Plan </strong> : <a target='_blank' href = ${KYTCDynamic_ProgramMgmt.DBO.SYP.PRECON_INFO_LINK}>${KYTCDynamic_ProgramMgmt.DBO.SYP.PRECON_INFO_LINK}</a><br>" +
      "<strong>County & Route</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.LOCUNIQUE}<br>" +
      "<strong>Beginning Mile Point</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.BMP}<br>" +
      "<strong>Ending Mile Point</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.EM}<br>" +
      "<strong>County Name</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.COUNTYNAME}<br>" +
      "<strong>Type Work</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_TYPEWORK}<br>" +
      "<strong>Project Description</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_DESC }<br>" +
      "<strong>Bridge Number</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.RPL_BRG_NUM}<br>" +
      "<strong>Construction Phase Stage</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.SYP_RPT_STAGEC}<br>"
    };

    var ConstInfoTemplate = new InfoTemplate(json);

    //define custom popup options
    //create a popup to replace the map's info window
    var syp0 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/0", {
      mode: FeatureLayer.MODE_ONDEMAND,
      infoTemplate: ConstInfoTemplate,
      outFields: ["*"]
    });


    var KytcBaseLayer = new ArcGISDynamicMapServiceLayer(
      "http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer",
      {id: "kytc-basemap"});
    map.addLayer(KytcBaseLayer);
    map.addLayer(syp0);

    map.infoWindow.resize(320, 285);

    /*var syp1 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/1", {
     mode: FeatureLayer.MODE_ONDEMAND,
     //infoTemplate: PlanningInfoTemplate,
     outFields: ["*"]
     });
     var syp2 = new FeatureLayer("http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ActiveHighwayPlan/MapServer/2", {
     mode: FeatureLayer.MODE_ONDEMAND,
     //infoTemplate: infoTemplate,
     outFields: ["*"]
     });
     */

    /* Legend widget*/
    var legend = new Legend({
      map: map
    }, "legendDiv");
    legend.startup();

    /* Mutually exclusive checkbox for toggling basemaps */
    $('input[name="myCheckbox"]').change(function () {

      // If this checkbox is checked, turn off other checkboxes
      if ($(this).prop("checked")) {
        $('input[name="myCheckbox"]').prop("checked", false);
        // TODO:
        $(this).prop("checked", true);
      }
      ToggleBasemap();
    });

    function ToggleBasemap() {
      $("input[name=myCheckbox]").each(function () {
        var Layer;
        switch ($(this).attr("id")){
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
  });


