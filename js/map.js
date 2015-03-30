$(document).ready(function () {
  require([
      "esri/map", "application/bootstrapmap", "dojo/data/ItemFileReadStore", "esri/tasks/FindTask", "esri/tasks/FindParameters","esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/graphic", "esri/graphicsUtils", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "TOC/dijit/TOC", "esri/toolbars/navigation", "dojo/on", "dojo/_base/array", "esri/dijit/Scalebar", "esri/layers/FeatureLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/LabelLayer", "esri/dijit/OverviewMap", "esri/dijit/HomeButton", "esri/dijit/LocateButton", "esri/dijit/Geocoder", "esri/dijit/Measurement", "esri/InfoTemplate", "esri/dijit/InfoWindow", "esri/dijit/Bookmarks", "esri/dijit/Print", "esri/dijit/Legend", "dijit/registry", "esri/dijit/Attribution", "dojo/parser", "dojo/dom", "dojo/domReady!"],
    function (Map, BootstrapMap, ItemFileReadStore, FindTask, FindParameters, Query, QueryTask, SpatialReference, Graphic, graphicsUtils, SimpleFillSymbol, SimpleLineSymbol, Color, TOC, Navigation, on, array, Scalebar, FeatureLayer, ArcGISTiledMapServiceLayer, ArcGISImageServiceLayer, ArcGISDynamicMapServiceLayer, LabelLayer, OverviewMap, HomeButton, LocateButton, Geocoder, Measurement, InfoTemplate, InfoWindow, Bookmarks, Print, Legend, registry, Attribution, parser, dom) {

      var map = BootstrapMap.create("mapDiv", {
        basemap: "national-geographic",
        center: [-85.50111111111111, 37.35138888888889],
        zoom: 6,
        /*minZoom: 2,
         maxZoom: 10,*/
        scrollWheelZoom: true,
        logo: false,
        nav: false,
        sliderPosition: "top-right"
        //infoWindow: popup,
        //showInfoWindowOnClick: true
      });

      function ZoomToQueryResult(btnId, getValue,layerIds,searchFields,service){
        $(btnId).click(function () {
          var text = $(getValue).val();
          var findParams = new FindParameters();
          findParams.returnGeometry = true;
          findParams.layerIds = layerIds;
          findParams.searchFields = [searchFields];
          findParams.outSpatialReference = map.spatialReference;

          //set the search text to find parameters
          findParams.searchText = text;
          var findTask = new FindTask(service);
          findTask.execute(findParams, zoomToResults);

/*
          function zoomToResults(results) {
            //This function works with an array of FindResult that the task returns
            map.graphics.clear();
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([98, 194, 204]), 2), new Color([98, 194, 204, 0.5]));
            var items;
            items = array.map(results, function (result) {
              var graphic = result.feature;
              graphic.setSymbol(symbol);
              map.graphics.add(graphic);
              var geometry = graphic.geometry.getExtent();
              map.setExtent(geometry.expand(2.0));
              return result.feature.attributes;
            });
          }
*/
        });
      }

      $()

      $("#locate-road-btn").click(function(){
        var County2, RtPrefix, RoadName;

        County2 = $("#select-county2").val();
        RoadName = $("#select-road").val();
        RtPrefix = $("#select-prefix").val();

        var findParams = new FindParameters();
        var findTask = new FindTask("//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer");

        findParams.returnGeometry = true;
        findParams.layerIds = [1];
        findParams.searchFields = ["CO_NAME", "RT_PREFIX", "SHIELD_LBL"];
        /*findParams.layerDefinitions[1] = "CO_NAME =" + "'" + County2 +"' AND RT_PREFIX='" + RtPrefix + "' AND SHIELD_LBL = " + "'" + RoadName + "'";*/
        findParams.searchText = "";
console.log("CO_NAME =" + "'" + County2 +"'");
        findParams.layerDefinitions[1] = "CO_NAME =" + "'" + County2 +"'";
        //findParams.layerDefinitions[1] = "RT_PREFIX =" + "'" + RtPrefix + "'";
        //findParams.layerDefinitions[1] = "SHIELD_LBL =" + "'" + RoadName + "'" ;
        console.log(findParams.layerDefinitions[1]);
        findParams.outSpatialReference = map.spatialReference;
        //set the search text to find parameters
        //findParams.searchText = text;
        findTask.execute(findParams, zoomToPolylineResults());

        /*var queryTask = new QueryTask("//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/1");
        var query = new Query();
        query.outSpatialReference = map.spatialReference;
        query.returnGeometry = true;
        //query.outFields = ["SHIELD_LBL"];
        query.where = "CO_NAME =" + "'" + County2 +"' AND RT_PREFIX='" + RtPrefix + "' AND SHIELD_LBL = " + "'" + RoadName + "'";
        console.log(query.where);
        queryTask.execute(query, zoomToPolylineResults);*/
      });

      function zoomToPolylineResults(results) {
        console.log(results);
        map.graphics.clear();
        var symbol = new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 255, 255]),
          3
        );
        var items;
        items = array.map(results, function (result) {
          var graphic = result.feature;
          console.log(graphic);
          graphic.setSymbol(symbol);
          map.graphics.add(graphic);
          var geometry = graphic.geometry.getExtent();
          map.setExtent(geometry.expand(2.0));
          return result.feature.attributes;
        });
      }

      function zoomToResults(results) {
        //This function works with an array of FindResult that the task returns
        map.graphics.clear();
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([98, 194, 204]), 2), new Color([98, 194, 204, 0.5]));
        var items;
        items = array.map(results, function (result) {
          var graphic = result.feature;
          graphic.setSymbol(symbol);
          map.graphics.add(graphic);
          var geometry = graphic.geometry.getExtent();
          map.setExtent(geometry.expand(2.0));
          return result.feature.attributes;
        });
      }

      // Road
      /*ZoomToQueryResult("#locate-road-btn", "#select-road", [1], "SHIELD_LBL", "//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/1")*/

      // City
      ZoomToQueryResult("#locate-city-btn", "#select-city", [10], "NAME", "//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer");
      // County
      ZoomToQueryResult("#locate-county-btn", "#select-county", [2], "NAME", "//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer");
      // KYTC district
      ZoomToQueryResult("#locate-district-btn", "#select-district", [3], "DISTNBR", "//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer");
      // USGS quadrangle
      ZoomToQueryResult("#locate-usgs-btn", "#select-usgs", [4], "QUAD_NAME", "//maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer");

      // Create a bookmark widget
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
      visibleBool = !("ontouchstart" in window);

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
        scale: 20000
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
            console.log(map.layerIds);
            console.log(map.graphicsLayerIds);
            map.addLayer(Layer, 1);
            /*var totalLayersLength = map.LayerIds.length + map.graphicsLayerIds.length;
             map.addLayer(Layer, totalLayersLength - 1);*/
          }
        });
      }

      // Add layers
      // Awarded current Hwy Plan Projects
      var infoTemplateContentString = "<strong>Object ID</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.OBJECTID}<br>" +
        "<strong>Plan Year</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.PLAN_YEAR}<br>" +
        "<strong>Current Plan</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP.CURRENT_PLAN}<br>" +
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
        "<strong>SYP Number 1</strong> : ${KYTCDynamic_ProgramMgmt.DBO.SYP_TABLE_VW.DIST_ITEM}<br>" +
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
        content: infoTemplateContentString
      }; // json for InfoTemplate
      var sypInfoTemplate0 = new InfoTemplate(json0);

      var json1 = {
        title: "<strong>Current Hwy Plan</strong>",
        content: infoTemplateContentString
      };
      var sypInfoTemplate1 = new InfoTemplate(json1);

      var json2 = {
        title: "<strong>Previous Hwy Plan</strong>",
        content: infoTemplateContentString
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
     /* var KytcBaseLayer;
      KytcBaseLayer = new ArcGISDynamicMapServiceLayer(
        "http://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/KYTCBaseMap/MapServer",
        {id: "kytc-basemap"});*/
      //map.addLayer(KytcBaseLayer);
      //map.infoWindow.resize(320, 285);

      map.addLayers([syp2, syp1, syp0]);

      // TODO: Add this to config for prod.
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

      // Disable add layer buttons on click
      $(".add-layer-btn").click(function () {
        $(this).toggleClass("active");
        ToggleOpLayer();
      });

      // Toggle operational layers TODO: Remove local, rural roads
      function ToggleOpLayer() {
        $(".add-layer-btn").each(function () {
          var opLayer, h, serviceTitle;
          switch ($(this).attr("id")) {
            case "traffic-counts":
              var _TrafficStationCountsInfoTemplate = new InfoTemplate();
              _TrafficStationCountsInfoTemplate.setTitle("<strong>Traffic Station Counts</strong>");
              _TrafficStationCountsInfoTemplate.setContent(
                "<strong>Object ID :</strong> ${KYTCVector.HIS.TS.OBJECTID}<br>" +
                "<strong>Station ID :</strong> ${KYTCVector.HIS.TS.ADTSTATN}<br>" +
                "<strong>Shape :</strong> ${KYTCVector.HIS.TS.Shape}");
              /*opLayer = new FeatureLayer("//maps.kytc.ky.gov/arcgis/rest/services/Apps/TrafficCounts/MapServer/0",
               {
               infoTemplate: _TrafficStationCountsInfoTemplate,
               mode: FeatureLayer.MODE_AUTO,
               outFields:["*"]
               });
               */
              opLayer = new ArcGISDynamicMapServiceLayer(
                "//maps.kytc.ky.gov/arcgis/rest/services/Apps/TrafficCounts/MapServer", {
                  id: "traffic-counts-layers"
                });
              opLayer.setInfoTemplates({
                0: {infoTemplate: _TrafficStationCountsInfoTemplate}
              });
              serviceTitle = "Traffic Counts";
              break;
            case "snow-and-ice":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/SNIC/MapServer", {
                  id: "snow-ice-layers"
                });
              break;
            case "bridge":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/BridgeDataMiner/MapServer",
                {id: "bridge-layers"});
              break;
            case "row-monument":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ProjectControl/MapServer", {
                  id: "row-monument-layers"
                });
              serviceTitle = "Right-of-Way Monument";
              break;
            case "kazc":
              //var infoTemplate = new InfoTemplate("${NAME}");
              var _permitInfoTemplate = new InfoTemplate();
              _permitInfoTemplate.setTitle("Part77 Surface");
              _permitInfoTemplate.setContent("Part 77 content");
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/KAZC_Permit/MapServer", {
                  id: "kazc-layers"
                });
              opLayer.setInfoTemplates({
                2: {infoTemplate: _permitInfoTemplate}
              });
              serviceTitle = "Part77";
              break;
            case "local-roads":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/LocalRoads/MapServer", {
                  id: "local-roads-layers"
                });
              opLayer.setVisibleLayers([6, 7, 8]);
              serviceTitle = "Local Roads";
              break;
            case "rural-secondary":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/RuralAndSecondaryRoads/MapServer", {
                  id: "rural-secondary-layers"
                });
              opLayer.setVisibleLayers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
              break;
            case "fema-emergency":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/FEMA_FHWA_EmergencyFundingRoutes/MapServer", {
                  id: "fema-emergency-layers"
                });
              serviceTitle = "Emergency Funding Routes";
              break;
            case "general-hwy":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/GeneralHighwayRoads/MapServer", {
                  id: "general-hwy-layers"
                });
              serviceTitle = "General Highway Roads"
              break;
            case "environmental":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "//maps.kytc.ky.gov/arcgis/rest/services/Apps/EnvironmentalOverview/MapServer", {
                  id: "env-layers"
                });
              break;
            case "prj-archive":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/Apps/ProjectArchives/MapServer", {
                  id: "prj-archive-layers"
                });
              break;
            case "traffic-camera":
              opLayer = new ArcGISDynamicMapServiceLayer(
                "http://maps.kytc.ky.gov/arcgis/rest/services/SensorsAndMonitors/TrafficCameras/MapServer", {
                  id: "traffic-camera-layers"
                });
          }
          // If button is disabled, add the map to the layer and the TOC node
          if ($(this).hasClass("active")) {
            //console.log(this.id);
            if ($.inArray(opLayer.id, map.layerIds) == -1) {
              map.addLayer(opLayer);
              /*h = dojo.connect(map, 'onLayerAddResult', function (result) {
               toc.layerInfos.splice(0, 0, {
               layer: opLayer,
               title: serviceTitle,
               collapsed: true, // whether this root layer should be collapsed initially, default false.
               slider: true, // whether to display a transparency slider. default false.
               autoToggle: true //whether to automatically collapse when turned off, and expand when turn on for groups layers. default true.
               });
               toc.refresh();
               dojo.disconnect(h);
               });*/
            }
          }
          // If button is not active, remove the layer
          else {
            /*$("#tocDiv").children().each(function () {
             console.log($(this));
             });*/
            if (opLayer) {
              if ($.inArray(opLayer.id, map.layerIds) !== -1) {
                map.removeLayer(map.getLayer(opLayer.id));
                toc.layerInfos.slice(0, 1)
                toc.refresh();
              }
            }
          }
        });
      }
    });//require
}); // doc ready

/*// Camera button brings up photo log divs
 $("#CameraButton").click(function () {
 //$(".content").css({"width":"550px"});
 });*/
