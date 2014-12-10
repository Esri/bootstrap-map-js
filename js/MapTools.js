/**
 * Created by Ahjung.Kim on 12/8/2014.
 */
var SpeedValue = 1;
var aLengthUnit, anAreaUnit, DrawPoly, DrawMeasureLine;
var AppViewModelObj;
var MODE = "APP";
var ForwardImages = [];
var NextForwardSet;
var NextBackwardsSet;
var CurrentSet;
var retrieved = false;
var SingleFrameRetrieved = false;
var FrameInc;
var VLG;
var TIMER;
var STOPPED = true;
var breakOut = null;
var jsonConfig;
var Masking = false;
var SelCounty, SelCity, SelQuad;
var clicknum = 0;
var CurrRoute, CurrDir, CurrOppDir, CurrDate, CurrIdx;
var CurrMile = null;
var NewBegMile, NewRevMile;
var Gear = "D";
var RNDDOpen = false;
var RoadList;
var filterstring;
var store;
var grid, griddata;
var FROMTOOL = false;

var spinnerOpts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 21,//The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 30, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent in px
    left: '50%' // Left position relative to parent in px
};

function afterInit() {
    var button = $("<button type='button'>&nbsp;</button>").attr("tabIndex", -1).attr("title", "Show all items").insertAfter("#RoadNameInput").button({
        icons: {
            primary: "ui-icon-triangle-1-s"
        },
        text: false
    }).removeClass("ui-corner-all").addClass("ui-corner-right ui-button-icon").click(function () {
        //$("#RoadNameInput").focus();
        if (RNDDOpen) {
            $("#RoadNameInput").autocomplete("close");
            RNDDOpen = false
        }
        else {
            $("#RoadNameInput").autocomplete('search', " ");
            RNDDOpen = true;
        }
    });
}


$(function () {
    $("#ZoomAccordion").accordion({ heightStyle: "content" });
    $("#IDAccordion").accordion({ heightStyle: "fill" });
    $("#ToolsTab").tabs({ active: parseInt(jsonConfig.TabPriority) });
    //$("#LegendTab").tabs();
    var speeds = ["1X", "2X", "3X", "4X", "5X"];
    $("#SpeedSliderPL").slider({
        min: 0,
        max: 4,
        value:3,
        animate: true,
        stop: function (event, ui) {
            $("#SpeedSliderPL").find(".ui-slider-handle").text(speeds[ui.value]);
            AppViewModelObj.selectedTimeInc(ui.value + 1);
        }
    });



    var value = $("#SpeedSliderPL").slider("option", "value");
    $("#SpeedSliderPL").find(".ui-slider-handle").text(speeds[value]);
    $("#SpeedSliderPL").position({
        "my": "top center",
        "at": "center-6% center",
        "of": $('#SpeedSliderDiv')
    });



    if ($('html').hasClass("ie8")) {
        $("#PLInfo tr:nth-child(2n+1)").addClass("odd");
        $("#PLInfo td:nth-child(2n+1)").addClass("odd");
        $("#PLInfo td:nth-child(2n)").addClass("even");
    }
    //Listeners?


    $("#SinglePointChk").click(function () {
        var cb = document.getElementById("ToMPText");
        if (document.getElementById("SinglePointChk").checked)
            cb.disabled = true;
        else
            cb.disabled = false;
    });

    $("#DistrictGo").on('click', function () {
        require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/graphic", "esri/tasks/GeometryService", "dojo/_base/Color", "dojo/domReady!"],
            function (Query, QueryTask, SimpleLineSymbol, SimpleFillSymbol, Graphic, GeometryService, Color) {
                if (document.getElementById("DistrictInput").value !== "") {
                    var gL = MainMap.getLayer("MaskingDistrict");
                    var ExtentsLayer = MainMap.getLayer("ExtentsLayer");
                    ExtentsLayer.clear();
                    var QT = new QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/3");
                    var Q = new Query();
                    Q.returnGeometry = true;
                    Q.where = "DISTNBR = " + document.getElementById("DistrictInput").value;
                    QT.execute(Q, function (results) {
                        FromDistrict = true;
                        var FeatSet = results.features;
                        var ext;
                        for (var i = 0, il = FeatSet.length; i < il; i++) {
                            var feat = FeatSet[i];
                            if (ext) {
                                ext = ext.union(feat.geometry.getExtent());
                            }
                            else {
                                ext = feat.geometry.getExtent();
                            }
                        }
                        if (Masking == true) {

                            gL.setVisibility(true);
                            for (i = 0; i < gL.graphics.length; i++) {
                                var G = gL.graphics[i];
                                G.setSymbol(CountyPoly);
                            }
                            var G2 = $(gL.graphics).filter(function () { return this.attributes.DISTNBR == document.getElementById("DistrictInput").value; });
                            for (j = 0; j < G2.length; j++) {
                                G2[j].setSymbol(TranspPoly);
                            }
                            gL.redraw();
                            MainMap.setExtent(ext, true);

                        }
                        else {
                            FromDistrict2 = true;
                            MainMap.setExtent(ext, true);


                        }

                    });
                }
            });
    });


    $("#DDForm").submit(function (event) {
        // cancels the form submission
        event.preventDefault();

        var latitude = document.getElementById("ddLatitude").value;
        var longitude = document.getElementById("ddLongitude").value * -1;
        require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/geometry/Point", "esri/graphic", "dojo/_base/Color",
                "esri/geometry/Extent", "esri/symbols/SimpleMarkerSymbol", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "esri/InfoTemplate", "esri/request", "spin/spin"],
            function (Query, QueryTask, SpatialReference, Point, Graphic, Color, Extent, SimpleMarkerSymbol, GeometryService, ProjectParameters, InfoTemplate, esriRequest, Spinner) {
                var spinner = new Spinner(spinnerOpts).spin(document.getElementById("DDForm"));
                inContact = true;
                var KYSingleZone = new SpatialReference({ wkid: 3089 });
                var LatLongLayer = MainMap.getLayer("LatLongLayer");
                LatLongLayer.clear();
                var InputPoint = new Point(longitude, latitude, new SpatialReference({ wkid: 4326 }));
                var GS = new GeometryService("http://maps.kytc.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                var Params = new ProjectParameters();
                Params.geometries = [InputPoint];
                Params.outSR = KYSingleZone; // new SpatialReference({ wkid: 3089 });

                GS.project(Params, function (result) {
                    var geom = result[0];
                    var request = esriRequest({
                        url: "http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/InCorpBounds",
                        content: {
                            X: geom.x,
                            Y: geom.y,
                            f: "json"
                        },
                        handleAs: "json",
                        callbackParamName: "callback"
                    });
                    request.then(function (resp2) {
                        var CityName = resp2.CityName;
                        if (CityName == "")
                            CityName = "Not in KY City";
                        var countyName = resp2.CountyName;
                        if (countyName == "")
                            countyName = "Not in KY County";

                        var request2 = esriRequest({
                            url: "http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/GetRouteMilePointByXY",
                            content: {
                                X: geom.x,
                                Y: geom.y,
                                SearchRadius: 100,
                                ReturnLatLong: "false",
                                f: "json"
                            },
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        request2.then(function (resp) {
                            var RTUnique = "";
                            var MilePoint = "";
                            var RoadName = "Not on road";
                            if (resp.RouteResults.length == 1) {
                                RTUnique = resp.RouteResults[0].RTUNIQUE;
                                MilePoint = resp.RouteResults[0].MilePoint;
                                RoadName = resp.RouteResults[0].RoadName;
                            }

                            var QT = new QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/3");
                            var Q = new Query();
                            Q.returnGeometry = false,
                                Q.geometry = new Point(geom.x, geom.y, KYSingleZone);
                            Q.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                            Q.outFields = ["DISTNBR"];
                            QT.execute(Q, function (distresult) {
                                var District = "Not in KYTC district";
                                if (distresult.features.length == 1)
                                    District = distresult.features[0].attributes.DISTNBR;

                                var ProjectedPoint = new Graphic(geom, LatLongSymbol, { "Latitude": latitude, "Longitude": longitude, "X": geom.x, "Y": geom.y, "County": countyName, "District": District, "City": CityName, "Roadname": RoadName, "RTUnique": RTUnique, "Milepoint": MilePoint },
                                    new InfoTemplate("Location", "<h4>Decimal Degrees, WGS84</h4><br/>Latitude: ${Latitude} <br/> Longitude: ${Longitude} <br/><h4>Kentucky Single Zone, NAD83, U.S. Feet</h4> X: ${X} <br/> Y: ${Y} <br/> County: ${County} <br/> District: ${District} <br/> City: ${City} <br/> Road name: ${Roadname} </br> RTUnique: ${RTUnique} <br/> Milepoint: ${Milepoint}"));
                                LatLongLayer.add(ProjectedPoint);
                                var Env = new Extent(geom.x - 5280, geom.y - 5280, geom.x + 5280, geom.y + 5280, KYSingleZone);
                                MainMap.setExtent(Env);
                                spinner.stop();
                                spinner = null;
                                $('.spinner').remove();
                                inContact = false;
                            });
                        });
                    });
                });

            }
        );
    });

    $("#DMSForm").submit(function (event) {
        event.preventDefault();
        var latitude = parseFloat(document.getElementById("dmslatdeg").value) + parseFloat((document.getElementById("dmslatmin").value / 60)) + parseFloat((document.getElementById("dmslatsec").value / 3600));
        var longitude = (parseFloat(document.getElementById("dmslongdeg").value) + parseFloat(document.getElementById("dmslongmin").value / 60) + parseFloat(document.getElementById("dmslongsec").value / 3600)) * -1;
        require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/geometry/Point", "esri/graphic", "dojo/_base/Color",
                "esri/geometry/Extent", "esri/symbols/SimpleMarkerSymbol", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "esri/InfoTemplate", "esri/request", "spin/spin"],
            function (Query, QueryTask, SpatialReference, Point, Graphic, Color, Extent, SimpleMarkerSymbol, GeometryService, ProjectParameters, InfoTemplate, esriRequest, Spinner) {
                var spinner = new Spinner(spinnerOpts).spin(document.getElementById("DMSForm"));
                inContact = true;
                var KYSingleZone = new SpatialReference({ wkid: 3089 });
                var LatLongLayer = MainMap.getLayer("LatLongLayer");
                LatLongLayer.clear();
                var InputPoint = new Point(longitude, latitude, new SpatialReference({ wkid: 4326 }));
                var GS = new GeometryService("http://maps.kytc.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                var Params = new ProjectParameters();
                Params.geometries = [InputPoint];
                Params.outSR = KYSingleZone; // new SpatialReference({ wkid: 3089 });

                GS.project(Params, function (result) {
                    var geom = result[0];
                    var request = esriRequest({
                        url: "http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/InCorpBounds",
                        content: {
                            X: geom.x,
                            Y: geom.y,
                            f: "json"
                        },
                        handleAs: "json",
                        callbackParamName: "callback"
                    });
                    request.then(function (resp2) {
                        var CityName = resp2.CityName;
                        if (CityName == "")
                            CityName = "Not in KY City";
                        var countyName = resp2.CountyName;
                        if (countyName == "")
                            countyName = "Not in KY County";

                        var request2 = esriRequest({
                            url: "http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/GetRouteMilePointByXY",
                            content: {
                                X: geom.x,
                                Y: geom.y,
                                SearchRadius: 100,
                                ReturnLatLong: "false",
                                f: "json"
                            },
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        request2.then(function (resp) {
                            var RTUnique = "";
                            var MilePoint = "";
                            var RoadName = "Not on road";
                            if (resp.RouteResults.length == 1) {
                                RTUnique = resp.RouteResults[0].RTUNIQUE;
                                MilePoint = resp.RouteResults[0].MilePoint;
                                RoadName = resp.RouteResults[0].RoadName;
                            }

                            var QT = new QueryTask("http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/3");
                            var Q = new Query();
                            Q.returnGeometry = false,
                                Q.geometry = new Point(geom.x, geom.y, KYSingleZone);
                            Q.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                            Q.outFields = ["DISTNBR"];
                            QT.execute(Q, function (distresult) {
                                var District = "Not in KYTC district";
                                if (distresult.features.length == 1)
                                    District = distresult.features[0].attributes.DISTNBR;

                                var ProjectedPoint = new Graphic(geom, LatLongSymbol, { "Latitude": latitude, "Longitude": longitude, "X": geom.x, "Y": geom.y, "County": countyName, "District": District, "City": CityName, "Roadname": RoadName, "RTUnique": RTUnique, "Milepoint": MilePoint },
                                    new InfoTemplate("Location", "<h4>Decimal Degrees, WGS84</h4><br/>Latitude: ${Latitude} <br/> Longitude: ${Longitude} <br/><h4>Kentucky Single Zone, NAD83, U.S. Feet</h4> X: ${X} <br/> Y: ${Y} <br/> County: ${County} <br/> District: ${District} <br/> City: ${City} <br/> Road name: ${Roadname} </br> RTUnique: ${RTUnique} <br/> Milepoint: ${Milepoint}"));
                                LatLongLayer.add(ProjectedPoint);
                                var Env = new Extent(geom.x - 5280, geom.y - 5280, geom.x + 5280, geom.y + 5280, KYSingleZone);
                                MainMap.setExtent(Env);
                                spinner.stop();
                                spinner = null;
                                $('.spinner').remove();
                                inContact = false;
                            });
                        });
                    });
                });

            }
        );
    });
    $("#helpButton").button().click(function () {
        window.open('Photolog help.pdf', '_blank');
    });

    $("#MapFeedBack").button().click(function () {
        if (window.location.search == "")
            window.location.href ="mailto:kytc.gis.support@ky.gov?subject=KYTC%20Photolog%20Application&body=" + "I%20am%20having%20trouble%20with%20the%20following map:%20" + window.location.origin + window.location.pathname + window.location.search + "?x1=" + MainMap.extent.xmin + "%26y1=" + MainMap.extent.ymin + "%26x2=" + MainMap.extent.xmax + "%26y2=" + MainMap.extent.ymax + "%26MODE=APP%0A%0AI'm%20using " + browserDetector() + ".%0AMy%20browser%20info:%20" + navigator.userAgent + ".%0A%0AMy%20problem%20is:";
        else
            window.location.href = "mailto:kytc.gis.support@ky.gov?subject=KYTC%20Photolog%20Application&body=" + "I%20am%20having%20trouble%20with%20the%20following map:%20" + window.location.origin + window.location.pathname + window.location.search + "%26x1=" + MainMap.extent.xmin + "%26y1=" + MainMap.extent.ymin + "%26x2=" + MainMap.extent.xmax + "%26y2=" + MainMap.extent.ymax + "%26MODE=APP%0A%0AI'm%20using " + browserDetector() + ".%0AMy%20browser%20info:%20" + navigator.userAgent + ".%0A%0AMy%20problem%20is:";

    });


    $("#GeneralFeedBack").button().click(function () {
        window.location.href = "mailto:kytc.gis.support@ky.gov";
    });

    $("#progressBarOff").progressbar({ value: false });

    $("#nextExtent").button({ disabled: true }).click(function () {
        if (ExtentHistoryIdx != ExtentHistory.length - 1) {
            ExtentHistoryIdx++;
            MainMap.setExtent(ExtentHistory[ExtentHistoryIdx]);
            NewExtent = false;
        }
    });

    $("#prevExtent").button({ disabled: true }).click(function () {
        if (ExtentHistoryIdx != 0) {
            ExtentHistoryIdx--;
            MainMap.setExtent(ExtentHistory[ExtentHistoryIdx]);
            NewExtent = false;
        }
    });

    $("#identifyFeat").button().click(function () {
        MODE = 'ID';
    });

    $("#PrintOptionsBox").dialog({
        autoOpen: false,
        title: "Print Options",
        draggable: true,
        resizable: false,
        show: "slow",
        open: function (event, ui) {
        }
    });

    $("#DownloadOptionsBox").dialog({
        autoOpen: false,
        title: "Download Road Information",
        draggable: false,
        resizable: false,
        show: "slow",
        width:650,
        open: function (event, ui) {
        }
    });

    $("#DownloadTableBox").dialog({
        autoOpen: false,
        title: "Road Information",
        draggable: false,
        resizable: false,
        show: "slow",
        height: 500,
        width:800,
        open: function(event, ui) {
            require(["dojo","dojox/grid/DataGrid", "dojo/data/ItemFileReadStore"], function(dojo, DataGrid, ItemFileReadStore) {
                if (dijit.byId('grid')) {
                    dijit.byId('grid').destroyRecursive(true);
                    var element = document.getElementById("grid");
                    element.parentNode.removeChild(element);
                }
                $.ajax({
                    url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/KYAllRoads?$filter=" + filterstring + "&$select=CO_NAME,RT_UNIQUE,RD_NAME,STATUS,BEGIN_MP,END_MP,SURFTYPE,GOV_LEVEL&$orderby=RT_UNIQUE,BEGIN_MP&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        for (i = 0; i < result.value.length; i++) {
                            result.value[i].BEGIN_MP = parseFloat(result.value[i].BEGIN_MP).toFixed(3);
                            result.value[i].END_MP = parseFloat(result.value[i].END_MP).toFixed(3);
                            result.value[i].SURFTYPE = $.grep(AppViewModelObj.SurfType(), function (n) { return n.SurfCode == parseInt(result.value[i].SURFTYPE); })[0].SurfaceType;
                            result.value[i].GOV_LEVEL = $.grep(AppViewModelObj.GovLevel(), function (n) { return n.GovLevel == result.value[i].GOV_LEVEL; })[0].GovLevelName;
                        }
                        griddata = {
                            label: "RD_NAME", //Name field for display. Not pertinent to a grid but may be used elsewhere.
                            items: result.value
                        }

                        grid = new DataGrid({
                            id: "grid",
                            store: new ItemFileReadStore({data: griddata}),
                            structure: [{ name: "County Name", field: "CO_NAME", width: "150px"},
                                { name: "RT_Unique", field: "RT_UNIQUE", width: "150px" },
                                { name: "Road Name", field: "RD_NAME", width: "150px" },
                                { name: "Status", field: "STATUS", width: "150px" },
                                { name: "Begin MP", field: "BEGIN_MP", width: "80px" }, // formatter: function (BEGIN_MP) { var value = parseFloat(BEGIN_MP).toFixed(3); return value; } },
                                { name: "End MP", field: "END_MP", width: "150px"}, // formatter: function (END_MP) { var value = parseFloat(END_MP).toFixed(3); return value; } },
                                { name: "Surface Type", field: "SURFTYPE", width: "150px"}, // formatter: function (SURFTYPE) { var value = $.grep(AppViewModelObj.SurfType(), function (n) { return n.SurfCode == parseInt(SURFTYPE); })[0].SurfaceType; return value; } },
                                { name: "Government Level", field: "GOV_LEVEL", width: "150px"}, // formatter: function (GOV_LEVEL) { var value = $.grep(AppViewModelObj.GovLevel(), function (n) { return n.GovLevel == GOV_LEVEL; })[0].GovLevelName; return value; } }
                            ]
                        }, document.createElement("DownloadTable"));
                        dojo.byId("DownloadTableBox").appendChild(grid.domNode);
                        $("#grid").css("height", "400px");
                        grid.startup();
                    }
                });


            });
        },
        close: function(event, ui) {
        }
    });
    $("#PLprogress").dialog({
        autoOpen: false,
        title: "Loading Photolog Data",
        draggable: false,
        resizable: false,
        show: "slow"
    });

    $("#PhotoLoadPB").progressbar({ value: 0 });

    $("#OptionsBox").dialog({
        autoOpen: false,
        title: "Measure Tool",
        draggable: true,
        resizable: false,
        show: "slow",
        open: function (event, ui) {
            MODE = "MEASURE";
            $("#identifyFeat").button("option", "disabled", true);
            $("#getCoords").button("option", "disabled", true);
            $("#rdInfo").button("option", "disabled", true);

            if ($("#RBarea").is(":checked"))
                MeasureArea();
            if ($("#RBdist").is(":checked"))
                MeasureLength();
        },
        close: function (event, ui) {
            MODE = "APP";
            $("#identifyFeat").button("option", "disabled", false);
            $("#getCoords").button("option", "disabled", false);
            $("#rdInfo").button("option", "disabled", false);
            if ($("#RBarea").is(":checked"))
                DrawPoly.deactivate();
            if ($("#RBdist").is(":checked"))
                DrawMeasureLine.deactivate();
            MainMap.setCursor("default");
        }
    });

    $("#measureDist").button().click(function () {
        $("#OptionsBox").dialog("open");
    });

    $("#getCoords").button().click(function () {
        MODE = "COORDS";
        MainMap.setMapCursor("crosshair");
        if ($("#RBarea").is(":checked"))
            if (DrawPoly != null || DrawPoly != undefined)
                DrawPoly.deactivate();
        if ($("#RBdist").is(":checked"))
            if (DrawMeasureLine != null || DrawMeasureLine != undefined)
                DrawMeasureLine.deactivate();

    });

    $("#linkButton").button().click(function () {
        if ((window.location.href).indexOf("config") != -1)
            prompt("To Copy Link: CTRL+C, ENTER", window.location.href + "&x1=" + MainMap.extent.xmin + "&y1=" + MainMap.extent.ymin + "&x2=" + MainMap.extent.xmax + "&y2=" + MainMap.extent.ymax + "&MODE=APP");
        else
            prompt("To Copy Link: CTRL+C, ENTER", window.location.href + "?x1=" + MainMap.extent.xmin + "&y1=" + MainMap.extent.ymin + "&x2=" + MainMap.extent.xmax + "&y2=" + MainMap.extent.ymax + "&MODE=APP");
    });

    $("#download").button().click(function () {
        $("#DownloadOptionsBox").dialog("open");
    });


    $("#rdInfo").button().click(function () {
        MODE = "RI";
        MainMap.setMapCursor("crosshair");
    });

    $("#eraseButton").button().click(function () {
        var gLList = ["FlashLayer", "FlashCounty", "ExtentsLayer", "LatLongLayer", "ZoomRoadLayer", "ZoomEndPointsLayer", "QPRoadPoints", "PLLocLayer","IDLayer"];
        for (i = 0; i < gLList.length; i++) {
            MainMap.getLayer(gLList[i]).clear();
        }
        MainMap.graphics.clear();
    });

    $("#mapResize").button();

    $("#printButton").button().click(function () {
        $("#PrintOptionsBox").dialog("open");
    });

    $("#fullExtent").button().click(function () {
        require(["esri/geometry/Extent", "esri/SpatialReference"], function (Extent, SpatialReference) {
            var ext = [];
            var newExt;
            if (jsonConfig.dynamicmap.extent) {
                ext = jsonConfig.dynamicmap.extent.split(',');
            }
            if (ext.length != 0) {
                var newExt = new Extent(parseFloat(ext[0]), parseFloat(ext[1]), parseFloat(ext[2]), parseFloat(ext[3]), new SpatialReference({ wkid: 3089 }));

            }
            else {
                var newExt = ExtentHistory[0]

            }
            MainMap.setExtent(newExt, true);
        });
    });

    $("button").tooltip();

    $("#leftimage").click(function () {
        breakOut = "LEFT";
        window.open("/photolog/BreakOutPlayer.html");

    });
    $("#centerimage").click(function () {
        breakOut = "CENTER";
        window.open("/photolog/BreakOutPlayer.html");
    });

    $("#rightimage").click(function () {
        breakOut = "RIGHT";
        window.open("/photolog/BreakOutPlayer.html");
    });

    $("#OptionsButton").click(function () {
        $("#BasemapOptionsBox").dialog("open");
    });



    $("#BasemapOptionsBox").dialog({
        autoOpen: false,
        height: 450,
        width: 300,
        title: "Basemap/Aerial Service Selector",
        draggable: true,
        resizable: false,
        show: "slow",
        open: function () {
            var basemapidx, aerialidx
            for (x = 0; x < baseMaps.length; x++) {
                if (baseMaps[x].id == CurrBaseMap)
                    basemapidx = x;
            }
            for (y = 0; y < aerials.length; y++) {
                if (aerials[y].id == CurrAerial)
                    aerialidx = y;
            }
            AppViewModelObj.selectedBaseMap(AppViewModelObj.KOBaseMaps()[basemapidx]);
            AppViewModelObj.selectedAerial(AppViewModelObj.KOAerials()[aerialidx]);
        },
        close: function () { }
    });

    $("#DisclaimerText").text(jsonConfig.disclaimer);

    if ($('html').hasClass("ie8")) {
        setTimeout(function () {
            $("#OptionsButton").backstretch('http://maps.kytc.ky.gov/photolog/img/gear.png');
            $("#prevExtent").backstretch('http://maps.kytc.ky.gov/photolog/img/icon-prev.png');
            $("#nextExtent").backstretch('http://maps.kytc.ky.gov/photolog/img/icon-next.png');
            $("#fullExtent").backstretch('http://maps.kytc.ky.gov/photolog/img/Globe-icon.png');
            $("#identifyFeat").backstretch('http://maps.kytc.ky.gov/photolog/img/identify.png');
            $("#measureDist").backstretch('http://maps.kytc.ky.gov/photolog/img/measure.png');
            $("#download").backstretch('http://maps.kytc.ky.gov/photolog/img/download.png');
            $("#linkButton").backstretch('http://maps.kytc.ky.gov/photolog/img/Link_Icon.png');
            $("#eraseButton").backstretch('http://maps.kytc.ky.gov/photolog/img/eraser.png');
            $("#getCoords").backstretch('http://maps.kytc.ky.gov/photolog/img/coord.png');
            $("#printButton").backstretch('http://maps.kytc.ky.gov/photolog/img/PDF.jpg');
            $("#BeginCurrentSegmentPL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-GoToBeginning-icon.png');
            $("#AdvanceReversePL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-Previous-icon.png');
            $("#DriveReversePL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-Playreverse-icon.png');
            $("#StopPL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-Stop-icon.png');
            $("#UturnPL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-uturn-icon.png');
            $("#DriveForwardPL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-Play-icon.png');
            $("#AdvanceForwardPL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-Next-icon.png');
            $("#EndCurrentSegmentPL").backstretch('http://maps.kytc.ky.gov/photolog/img/NN-GoToEnd-icon.png');
            $("#rdInfo").backstretch('http://maps.kytc.ky.gov/photolog/img/RoadInfo.png');
            $("#BBButtonOpen").backstretch('http://maps.kytc.ky.gov/photolog/img/kgpg_edit.png')
        }, 500);
    }

    $(function () {

        setTimeout(function () {
            if (document.getElementById("BannerOpen")) {
                document.getElementById("BannerOpen").setAttribute("id", "BannerClosed");
                document.getElementById("BannerChevronOpen").setAttribute("id", "BannerChevronClosed");
            }
            //document.getElementById("TITLEOPEN").setAttribute("id", "TITLECLOSED");
            //document.getElementById("KYTCLogoOpen").setAttribute("id", "KYTCLogoClosed");
        }, 7000);
    });

    $(function () {
        //afterInit();
    });

    AppViewModelObj = AppViewModel();
    ko.applyBindings(AppViewModelObj);
});




function AppViewModel() {
    // set up parameters
    // Cities from service
    var self = {};
    self.Cities = ko.observableArray();
    self.selectedCity = ko.observable();
    // Counties for Zoom Tool - from service
    self.Counties = ko.observableArray();
    self.selectedCounty = ko.observable();
    // USGS Quads from Service
    self.Quads = ko.observableArray();
    self.selectedQuad = ko.observable();
    // Counties for Zoom To Road tool.
    self.selectedRoadCounty = ko.observable();
    self.Prefixes = ko.observableArray();
    self.selectedPrefix = ko.observable();
    // Route numbers from ODATA service
    self.RoadNumbers = ko.observableArray();
    self.selectedRoadNumber = ko.observable();
    // Route names from ODATA service
    self.RoadNames = ko.observableArray();
    self.selectedRoadName = ko.observable();
    // Mile Point pairs from ODATA service
    self.RTUnique = ko.observable();
    self.FromMP = ko.observable();
    self.ToMP = ko.observable();
    //Needed items for the measure tool
    self.LengthUnits = ko.observableArray(["FEET", "MILES", "METERS", "KILOMETERS"]);
    self.selectedLengthUnit = ko.observable();
    self.AreaUnits = ko.observableArray(["ACRES", "SQUARE FEET", "SQUARE MILES", "HECTARES", "SQUARE METERS", "SQUARE KILOMETERS"]);
    self.selectedAreaUnit = ko.observable();
    //Needed items for Photolog
    self.CollectionDates = ko.observableArray();
    self.selectedCollDate = ko.observable();
    self.Lanes = ko.observableArray();
    self.selectedLane = ko.observable();
    self.Directions = ko.observableArray();
    self.selectedDir = ko.observable();
    //Needed items for frame increment
    self.FrameIncrement = ko.observableArray([{ text: "Every Image - 26 ft.", value: 1 },
        { text: "Every Other - 52 ft.", value: 2 },
        { text: "Every Third - 78 ft.", value: 3 },
        { text: "Every Fourth - 104 ft.", value: 4 },
        { text: "Every Fifth - 130 ft.", value: 5 }]);
    self.selectedFrameInc = ko.observable();
    //Needed items for slider bar selected
    self.selectedTimeInc = ko.observable(4);
    self.PrintOptions = ko.observableArray();
    self.selectedPrintOptions = ko.observable();
    self.PrintTypes = ko.observableArray();
    self.selectedPrintType = ko.observable();
    self.KOBaseMaps = ko.observableArray();
    self.selectedBaseMap = ko.observable();
    self.KOAerials = ko.observableArray();
    self.selectedAerial = ko.observable();
    self.numberOfClicks = ko.observable(0);
    self.GovLevel = ko.observableArray();
    self.SurfType = ko.observableArray();
    self.Status = ko.observableArray();
    self.selectedDLCounty = ko.observable();
    self.selectedDLGovLev = ko.observable();
    self.selectedDLSurface = ko.observable();
    self.selectedStatus = ko.observable();
    self.SurfaceLookup = ko.observableArray();
    self.GovLevelLookup = ko.observableArray();

    self.DownloadCSV = function () {
        var theCounty;
        var fields = ["County Name", "RT_Unique", "Road Name", "Status", "Begin MP", "End MP", "Surface Type", "Government Level"];
        var csvContent = fields.join(",") + "\r\n ";
        griddata.items.forEach(function (infoArray, index) {
            datastring = infoArray.CO_NAME[0] + "," + infoArray.RT_UNIQUE[0] + "," + infoArray.RD_NAME[0] + "," + infoArray.STATUS[0] + "," + infoArray.BEGIN_MP[0] + "," + infoArray.END_MP[0] + ",\"" + infoArray.SURFTYPE[0] + "\"," + infoArray.GOV_LEVEL[0] + " \r\n ";
            theCounty = infoArray.CO_NAME[0];
            csvContent += datastring;
        });
        var filename = window.prompt("Please enter a file name:", theCounty);

        $('<form>', {
            "id": "csvform",
            "html": '<input type=\"hidden\" name=\"filename\" value=\"' + theCounty + '\" /> <input type=\"hidden\" name=\"csvtext\" value=\"' + encodeURI(csvContent) + '\" />',
            "action": "../photolog/CreateCSV.ashx",
            "method": "POST"
        }).appendTo(document.body).submit().remove();
    };
    self.onSelectedDLCountychange = ko.computed(function () {
        if (self.selectedDLCounty()) {
            self.SurfType.removeAll();
            self.Status.removeAll();
            self.GovLevel.removeAll();
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/KYAllRoads?$filter=CO_NAME eq '" + self.selectedDLCounty().Name + "'&$select=STATUS,SURFTYPE,GOV_LEVEL&$orderby=RT_UNIQUE,BEGIN_MP&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (result) {
                    if (result.value.length > 0) {
                        RoadList = result.value;
                        GovLevelVals = [];
                        SurfaceTypeVals = [];
                        StatusVals = [];
                        for (i = 0; i < RoadList.length; i++) {
                            GovLevelVals.push(RoadList[i].GOV_LEVEL);
                            SurfaceTypeVals.push(parseInt(RoadList[i].SURFTYPE));
                            StatusVals.push(RoadList[i].STATUS);
                        }
                        var GovLevelU = GetUnique(GovLevelVals);
                        var SurfaceTypeU = GetUnique(SurfaceTypeVals);
                        var StatusValsU = GetUnique(StatusVals);
                        GovLevelU.sort();
                        SurfaceTypeU.sort();
                        StatusValsU.sort();
                        for (j = 0; j < SurfaceTypeU.length; j++) {
                            self.SurfType.push($.grep(self.SurfaceLookup(), function (n) { return n.SurfCode == SurfaceTypeU[j] })[0]);
                        }
                        for (k = 0; k < GovLevelU.length; k++) {
                            self.GovLevel.push($.grep(self.GovLevelLookup(), function (n) { return n.GovLevel == GovLevelU[k] })[0]);
                        }

                        self.Status(StatusValsU);

                        var stophere = "X";
                    }
                    else
                        RoadList = []
                }
            });
        }
    });

    self.Download = function () {
        var surfaceparams = "";
        var statusparams = "";
        var govlevparams = "";

        if (self.selectedDLSurface() == undefined) {
            if (self.SurfType().length > 1) {
                surfaceparams = self.SurfType().map(function (elem) { return elem.SurfCode }).join("' or SURFTYPE  eq '");
            }
            else {
                surfaceparams = " eq '" + self.SurfType()[0].SurfCode + "'";
            }
        }
        else {
            surfaceparams = self.selectedDLSurface().SurfCode;
        }

        if (self.selectedDLGovLev() == undefined) {
            if (self.GovLevel().length > 1) {
                govlevelparams = self.GovLevel().map(function (elem) { return elem.GovLevel }).join("' or GOV_LEVEL eq '");
            }
            else {
                govlevelparams = " eq '" + self.GovLevel()[0].GovLevel + "'";
            }
        }
        else {
            govlevelparams =  self.selectedDLGovLev().GovLevel
        }

        if (self.selectedStatus() == undefined) {
            if (self.Status().length > 1) {
                statusparams = self.Status().join("' or STATUS eq '");
            }
            else {
                statusparams = self.Status()[0];
            }
        }
        else {
            statusparams = self.selectedStatus();
        }

        filterstring = "(CO_NAME eq '" + self.selectedDLCounty().Name + "') and (GOV_LEVEL eq '" + govlevelparams + "') and (SURFTYPE eq '" + surfaceparams + "') and (STATUS eq '" + statusparams + "')";
        $("#DownloadTableBox").dialog("open");
    }


    self.SwitchBasemaps = function () {
        if ((self.selectedAerial().id != CurrAerial) && (self.selectedBaseMap().id != CurrBaseMap)) {
            CurrAerial = self.selectedAerial().id;
            CurrBaseMap = self.selectedBaseMap().id;
            if (CurrentlyShowing == "BASEMAP") {
                for (i = 0; i < baseMaps.length; i++) {
                    if (baseMaps[i].id == CurrBaseMap)
                        MainMap.getLayer(baseMaps[i].id).setVisibility(true);
                    else
                        MainMap.getLayer(baseMaps[i].id).setVisibility(false);
                }
                for (j = 0; j < aerials.length; j++) {
                    MainMap.getLayer(aerials[j].id).setVisibility(false);
                }
            }
            if (CurrentlyShowing == "AERIAL") {

                for (i = 0; i < aerials.length; i++) {
                    if (aerials[i].id == CurrAerial)
                        MainMap.getLayer(aerials[i].id).setVisibility(true);
                    else
                        MainMap.getLayer(aerials[i].id).setVisibility(false);
                }
                for (j = 0; j < baseMaps.length; j++) {
                    MainMap.getLayer(baseMaps[j].id).setVisibility(false);
                }
            }

        }

        if ((self.selectedAerial().id != CurrAerial) && (self.selectedBaseMap().id == CurrBaseMap)) {
            CurrAerial = self.selectedAerial().id;
            for (i = 0; i < aerials.length; i++) {
                if (aerials[i].id == CurrAerial)
                    MainMap.getLayer(aerials[i].id).setVisibility(true);
                else
                    MainMap.getLayer(aerials[i].id).setVisibility(false);
            }
            for (j = 0; j < baseMaps.length; j++) {
                MainMap.getLayer(baseMaps[j].id).setVisibility(false);
            }
            CurrentlyShowing = "AERIAL";
        }
        if ((self.selectedAerial().id == CurrAerial) && (self.selectedBaseMap().id != CurrBaseMap)) {
            CurrBaseMap = self.selectedBaseMap().id;
            for (i = 0; i < baseMaps.length; i++) {
                if (baseMaps[i].id == CurrBaseMap)
                    MainMap.getLayer(baseMaps[i].id).setVisibility(true);
                else
                    MainMap.getLayer(baseMaps[i].id).setVisibility(false);
            }
            for (j = 0; j < aerials.length; j++) {
                MainMap.getLayer(aerials[j].id).setVisibility(false);
            }
            CurrentlyShowing = "BASEMAP";
        }

        $("#BasemapOptionsBox").dialog("close");
    };

    self.BaseMapButton = function () {
        for (i = 0; i < aerials.length; i++) {
            MainMap.getLayer(aerials[i].id).setVisibility(false);
        }
        for (j = 0; j < baseMaps.length; j++) {
            MainMap.getLayer(baseMaps[j].id).setVisibility(false);
            if (baseMaps[j].id == CurrBaseMap) {
                MainMap.getLayer(baseMaps[j].id).setVisibility(true);
            }
        }
        CurrentlyShowing = "BASEMAP";
    };

    self.AerialButton = function () {
        for (i = 0; i < baseMaps.length; i++) {
            MainMap.getLayer(baseMaps[i].id).setVisibility(false);
        }
        for (j = 0; j < aerials.length; j++) {
            MainMap.getLayer(aerials[j].id).setVisibility(false);
            if (aerials[j].id == CurrAerial) {
                MainMap.getLayer(aerials[j].id).setVisibility(true);
            }
        }
        CurrentlyShowing = "AERIAL";
    };

    //*******************PHOTOLOG BACKGROUND PROCESSINGS ******************************
    self.onselectedTimeIncChange = ko.computed(function () {
        if (self.selectedTimeInc()) {
            switch (self.selectedTimeInc()) {
                case 1:
                    SpeedValue = 850;
                    clearInterval(TIMER);
                    if (STOPPED == false && Gear == "D")
                        self.Play();
                    else if (STOPPED == false && Gear == "R")
                        self.Reverse();
                    break;
                case 2:
                    SpeedValue = 625;
                    clearInterval(TIMER);
                    if (STOPPED == false && Gear == "D")
                        self.Play();
                    else if (STOPPED == false && Gear == "R")
                        self.Reverse();
                    break;
                case 3:
                    SpeedValue = 450;
                    clearInterval(TIMER);
                    if (STOPPED == false && Gear == "D")
                        self.Play();
                    else if (STOPPED == false && Gear == "R")
                        self.Reverse();
                    break;
                case 4:
                    SpeedValue = 250;
                    clearInterval(TIMER);
                    if (STOPPED == false && Gear == "D")
                        self.Play();
                    else if (STOPPED == false && Gear == "R")
                        self.Reverse();
                    break;
                case 5:
                    SpeedValue = 125;
                    clearInterval(TIMER);
                    if (STOPPED == false && Gear == "D")
                        self.Play();
                    else if (STOPPED == false && Gear == "R")
                        self.Reverse();
                    break;

            }
        };
    });

    self.onSelectedFrameIncChange = ko.computed(function () {
        if (self.selectedFrameInc()) {
            FrameInc = self.selectedFrameInc().value;
        }
    });

    self.OnselectedCollDateChange = ko.computed(function () {
        if (self.selectedCollDate() !== null) {
            CurrDate = self.selectedCollDate();
            self.selectedDir(self.Directions()[self.Directions.indexOf(CurrDir)]);

        }
    });

    self.OnselectedDirChange = ko.computed(function () {
        if (self.selectedCollDate() != undefined) {
            $.ajax({
                url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetLanes?Route='" + CurrRoute + "'&Dir='" +
                self.selectedDir() + "'&Date='" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (result) {
                    CurrDir = self.selectedDir();
                    if (result.value.length != 0)
                        self.Lanes(result.value);
                }
            });
        }
        else {
            $.ajax({
                url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetRecentLanes?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (result) {
                    CurrDir = self.selectedDir();
                    if (result.value.length != 0)
                        self.Lanes(result.value);
                }
            });
        }
    });

    self.OnselectedLaneChange = ko.computed(function () {
        if (self.selectedLane()) {
            require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["spin/spin"], function (Spinner) {
                SingleFrameRetrieved = false;
                if (self.selectedLane() != undefined && self.selectedDir() != undefined) {
                    if (self.selectedCollDate() != undefined) {
                        if (self.selectedDir() == "N" || self.selectedDir() == "E") {
                            var spinner = new Spinner(spinnerOpts).spin(document.getElementById("PhotoLogMap"));
                            inContact = true;
                            CurrRoute = CurrRoute.substring(0, 14) + "000";
                            $.ajax({
                                url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/PLPTs()?$filter=ROUTE eq '" + CurrRoute + "' and DIR eq '" + self.selectedDir() + "' and COLL_DATE eq '" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "' and LANE eq " + self.selectedLane() + "M and MILE_POINT gt " + (CurrMile - 0.25) + "M and MILE_POINT le " + (CurrMile + 1) + "M and UpdateIndicator eq 2M&$orderby=MILE_POINT&$select=ROUTE,EASTING,NORTHING,CNTYNAME,MILE_POINT,COLL_DATE,LANE,LEFT_URL,FRONT_URL,RIGHT_URL&$format=json",
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'jsonp',
                                jsonp: '$callback',
                                success: function (result) {
                                    CurretSet = result;
                                    NewBegMile = CurrMile + 1.0;
                                    NewRevMile = CurrMile - 0.25;
                                    NextForwardSet = [];
                                    NextBackwardsSet = [];
                                    DrawLine(result);
                                    spinner.stop();
                                    spinner = null;
                                    $('.spinner').remove();
                                    inContact = false;
                                }
                            });
                        }
                        else {
                            var spinner = new Spinner(spinnerOpts).spin(document.getElementById("PhotoLogMap"));
                            inContact = true;
                            $.ajax({
                                url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNewCurrRoute?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&CurrMile=" + CurrMile + "M&$format=json",
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'jsonp',
                                jsonp: '$callback',
                                success: function (result) {
                                    CurrRoute = result.value[0];
                                    $.ajax({
                                        url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNonCardinal?ROUTE='" + CurrRoute + "'&Date='" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=" + (CurrMile + 0.25) + "M&ToMile=" + (CurrMile - 1.0) + "M&$format=json",
                                        contentType: 'application/json; charset=utf-8',
                                        dataType: 'jsonp',
                                        jsonp: '$callback',
                                        success: function (result) {
                                            CurrentSet = result;
                                            NewBegMile = CurrMile - 1.0;
                                            NewRevMile = CurrMile + 0.25;
                                            NextForwardSet = [];
                                            NextBackwardsSet = [];
                                            DrawLine(result);
                                            spinner.stop();
                                            spinner = null;
                                            $('.spinner').remove();
                                            inContact = false;
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        if (self.selectedDir() == "N" || self.selectedDir() == "E") {
                            var spinner = new Spinner(spinnerOpts).spin(document.getElementById("PhotoLogMap"));
                            inContact = true;
                            CurrRoute = CurrRoute.substring(0, 14) + "000";
                            $.ajax({
                                url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentCardinal?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=" + (CurrMile - 0.25) + "M&ToMile=" + (CurrMile + 1.0) + "M&$format=json",
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'jsonp',
                                jsonp: '$callback',
                                success: function (result) {
                                    CurrentSet = result;
                                    NewBegMile = CurrMile + 1.0;
                                    NewRevMile = CurrMile - 0.25;
                                    NextForwardSet = [];
                                    NextBackwardsSet = [];
                                    DrawLine(result);
                                    spinner.stop();
                                    spinner = null;
                                    $('.spinner').remove();
                                    inContact = false;
                                }
                            });
                        }
                        else {
                            var spinner = new Spinner(spinnerOpts).spin(document.getElementById("PhotoLogMap"));
                            inContact = true;
                            $.ajax({
                                url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNewCurrRoute?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&CurrMile=" + CurrMile + "M&$format=json",
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'jsonp',
                                jsonp: '$callback',
                                success: function (result) {
                                    CurrRoute = result.value[0];
                                    $.ajax({
                                        url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentNonCardinal?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=" + (CurrMile + 0.25) + "M&ToMile=" + (CurrMile - 1.0) + "M&$format=json",
                                        contentType: 'application/json; charset=utf-8',
                                        dataType: 'jsonp',
                                        jsonp: '$callback',
                                        success: function (result) {
                                            CurrentSet = result;
                                            NewBegMile = CurrMile - 1.0;
                                            NewRevMile = CurrMile + 0.25;
                                            NextForwardSet = [];
                                            NextBackwardsSet = [];
                                            DrawLine(result);
                                            spinner.stop();
                                            spinner = null;
                                            $('.spinner').remove();
                                            inContact = false;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    //****************************** Measure Tool Items *******************************************************************************************
    self.OnLengthUnitsChange = ko.computed(function () {
        if (self.selectedLengthUnit()) {
            aLengthUnit = self.selectedLengthUnit();
        }
    });

    self.OnAreaUnitsChange = ko.computed(function () {
        if (self.selectedAreaUnit()) {
            anAreaUnit = self.selectedAreaUnit();
        }
    });

    //**********************************************************************************************************************************************
    // Zoom to Route Tool Items
    //When selected Road Name Changes go get the mile points for the new selected value
    self.OnselectedRoadNameChange = ko.computed(function () {
        if (self.selectedRoadName()) {
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/GetMPPairByRtUniqueAndRtName?RTUNIQUE='" + self.selectedRoadName().RTUnique + "'&RteName='" + self.selectedRoadName().RouteName + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (MPResults) {
                    self.RTUnique(MPResults.RTUnique);
                    self.FromMP(MPResults.FromMP);
                    self.ToMP(MPResults.ToMP);
                }
            });
        }
    });
    // When the Road Number changes go get the Road Name and the Mile Points for the new selected value for the new selected value
    self.OnselectedRoadNumberChange = ko.computed(function () {
        self.FromMP(null);
        self.ToMP(null);
        if (self.selectedRoadNumber()) {
            $("#RoadNumberInput").prop('disabled', true);

            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/GetRouteNamesByCountyRoutePrefixRouteNumber?CountyName='" + self.selectedRoadCounty().Name + "'&RtePrefix='" + self.selectedPrefix().PreName + "'&RteNumber='" + self.selectedRoadNumber() + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (roadNameResult3) {
                    self.RoadNames(roadNameResult3.value);

                }
            });
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/GetMPPair?CountyName='" + self.selectedRoadCounty().Name + "'&RtePrefix='" + self.selectedPrefix().PreName + "'&RteNumber='" + self.selectedRoadNumber() + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (MPResults) {
                    $("#RoadNumberInput").prop('disabled', false);
                    self.RTUnique(MPResults.RTUnique);
                    self.FromMP(MPResults.FromMP);
                    self.ToMP(MPResults.ToMP);

                }
            });
        }
    });
    //When the Road Prefix changes get the route numbers and road names for the selected prefix
    self.OnSelectedPrefixChange = ko.computed(function () {
        //$("#RoadNameInput").prop('disabled', true);
        $("#RoadNumberInput").prop('disabled', true);
        self.FromMP(null);
        self.ToMP(null);
        if (self.selectedPrefix()) {
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KYAllRoads.svc/GetRouteNumbers?CountyName='" + self.selectedRoadCounty().Name + "'&RtePrefix='" + self.selectedPrefix().PreName + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (roadNumResult) {
                    $("#RoadNumberInput").prop('disabled', false);
                    self.RoadNumbers(roadNumResult.value);

                }
            });
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KYAllRoads.svc/GetRouteNamesByCountyRoutePrefix?CountyName='" + self.selectedRoadCounty().Name + "'&RtePrefix='" + self.selectedPrefix().PreName + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (roadNameResult2) {
                    //$("#RoadNameInput").prop('disabled', false);
                    self.RoadNames(roadNameResult2.value);


                }
            });
            self.selectedRoadNumber(null);
            self.selectedRoadName(null);
        };
    });
    // When the county changes get the route prefixes and route names for that county
    self.OnSelectedRoadCountyChange = ko.computed(function () {
        // $("#RoadNameInput").prop('disabled', true);
        $("#RoadNumberInput").prop('disabled', true);
        self.FromMP(null);
        self.ToMP(null);
        if (self.selectedRoadCounty()) {
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/GetRoutePrefixes?CountyName='" + self.selectedRoadCounty().Name + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (prefixResult) {
                    $.ajax({
                        url: "http://maps.kytc.ky.gov/webservices/kytcextents/kytcextents.svc/GetRoutePrefixes?PrefixList='" + prefixResult.value.join(',') + "'&$format=json",
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'jsonp',
                        jsonp: '$callback',
                        success: function (prefixResult2) {
                            $("#RoadNumberInput").prop('disabled', false);
                            self.Prefixes(prefixResult2.value);

                        }
                    });

                }
            });
            $.ajax({
                url: "http://maps.kytc.ky.gov/webservices/KYAllRoads/KyAllRoads.svc/GetRouteNamesByCounty?CountyName='" + self.selectedRoadCounty().Name + "'&$format=json",
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonp: '$callback',
                success: function (roadNameResult) {
                    // $("#RoadNameInput").prop('disabled', false);
                    self.RoadNames(roadNameResult.value);

                }
            });
            self.selectedPrefix(null);
            self.selectedRoadNumber(null);
            self.selectedRoadName(null);
        }
    });

    self.ZoomToRoad = function (formElement) {
        require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["esri/request", "esri/graphic", "esri/geometry/Polyline", "esri/geometry/Point", "esri/geometry/Extent",
            "esri/SpatialReference", "esri/graphicsUtils", "spin/spin"], function (esriRequest, Graphic, Polyline, Point, Extent, SpatialReference, graphicsUtils, Spinner) {
            if ($('input[name=WhereTo]:checked').val() == "ZoomToMap") {

                var spinner = new Spinner(spinnerOpts).spin(document.getElementById("ZoomToRoad"));
                //The Road
                var ZoomRoadLayer = MainMap.getLayer("ZoomRoadLayer");
                var ZoomEnds = MainMap.getLayer("ZoomEndPointsLayer");
                ZoomRoadLayer.clear();
                ZoomEnds.clear();
                var KYSZ = new SpatialReference({ wkid: 3089 });
                var URL1 = "http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/GetRouteBetweenTwoMP"
                var GetMPs = esriRequest({
                    url: URL1,
                    content: {
                        RTUNIQUE: self.RTUnique(),
                        BP: self.FromMP(),
                        EP: self.ToMP(),
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                });
                GetMPs.then(function (response) {

                    var i, j;

                    for (i = 0; i <= response.geometries.length - 1; i++) {
                        for (j = 0; j <= response.geometries[i].paths.length - 1; j++) {
                            var polyline = new Polyline(KYSZ);
                            polyline.addPath(response.geometries[i].paths[j]);
                            var G = new Graphic(polyline);
                            G.setSymbol(ZoomRoadLine);
                            if (!document.getElementById("SinglePointChk").checked) {
                                ZoomRoadLayer.add(G);
                            }
                        }
                    }

                    if (!document.getElementById("SinglePointChk").checked) {
                        MainMap.setExtent(graphicsUtils.graphicsExtent(ZoomRoadLayer.graphics), true);
                    }
                    // Green Dot
                    var URL2 = "http://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/GetXYByRouteAndMP";
                    var GetStartPoint = esriRequest({
                        url: URL2,
                        content: {
                            RTUNIQUE: self.RTUnique(),
                            MP: self.FromMP(),
                            f: "json"
                        },
                        handleAs: "json",
                        callbackParamName: "callback"
                    });

                    GetStartPoint.then(function (response2) {
                        var point = new Point(response2.x, response2.y, KYSZ);
                        var G2 = new Graphic(point);
                        G2.setSymbol(GreenDot);
                        ZoomEnds.add(G2);
                        if (document.getElementById("SinglePointChk").checked) {
                            var env = new Extent(point.x - 2740, point.y - 2740, point.x + 2740, point.y + 2740, KYSZ);
                            MainMap.setExtent(env);
                        }
                        // Red Dot

                        var GetEndPoint = esriRequest({
                            url: URL2,
                            content: {
                                RTUNIQUE: self.RTUnique(),
                                MP: self.ToMP(),
                                f: "json"
                            },
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        GetEndPoint.then(function (response3) {
                            var point = new Point(response3.x, response3.y, KYSZ);
                            var G3 = new Graphic(point);
                            G3.setSymbol(RedDot);
                            if (!document.getElementById("SinglePointChk").checked) {
                                ZoomEnds.add(G3);
                            }
                            spinner.stop();
                            spinner = null;
                            $('.spinner').remove();
                        }, function (error) {
                            spinner.stop();
                            spinner = null;
                            $('.spinner').remove();
                            alert("Error: " + error.message);
                        });
                    }, function (error) {
                        spinner.stop();
                        spinner = null;
                        $('.spinner').remove();
                        alert("Error: " + error.message);
                    });

                }, function (error) {
                    spinner.stop();
                    spinner = null;
                    $('.spinner').remove();
                    alert("Error: " + error.message);
                });
            }
            else {
                var URL2 = "http:/maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/GetXYByRouteAndMP";
                var GetStartPoint = esriRequest({
                    url: URL2,
                    content: {
                        RTUNIQUE: self.RTUnique(),
                        MP: self.FromMP(),
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                });

                GetStartPoint.then(function (res) {
                    if (MODE != "PL") {
                        MODE = "PL";

                        MapDivResize();
                    }
                    FROMTOOL = true;
                    OpenPhotolog(res.x, res.y, "", "");
                });
            }
        });
    };
    //************************************************************************************************************************************************************************************
    //Other Zoom Tools
    //When the city changes zoom to its extents
    //self.OnSelectedCityChange = ko.computed(function () {
    self.CityGo = function() {
        if (self.selectedCity()) {
            var item = self.selectedCity();
            var ext = new esri.geometry.Extent({ "xmin": item.XMin, "ymin": item.YMin, "xmax": item.XMax, "ymax": item.YMax, "spatialReference": { "wkid": 3089 } });
            FromCity = true;
            MainMap.setExtent(ext, true);
        }
    };

    //When the county changes zoom to its extents
    self.CountyGo = function () {
        if (self.selectedCounty()) {
            FromCounty = true;
            var item = self.selectedCounty();
            var ext = new esri.geometry.Extent({ "xmin": item.XMin, "ymin": item.YMin, "xmax": item.XMax, "ymax": item.YMax, "spatialReference": { "wkid": 3089 } });
            if (Masking == true) {
                require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/FeatureSet", "esri/graphic", "esri/layers/GraphicsLayer"], function (Query, QueryTask, FeatureSet, Graphic, GraphicsLayer) {
                    var gL = MainMap.getLayer("MaskingLayer");
                    gL.setVisibility(true);
                    for (i = 0; i < gL.graphics.length; i++) {
                        var G = gL.graphics[i];
                        G.setSymbol(CountyPoly);
                    }
                    var G2 = $(gL.graphics).filter(function () { return this.attributes.NAME == item.Name; });

                    G2[0].setSymbol(TranspPoly);
                    gL.redraw();

                }, function (results) { });
                MainMap.setExtent(ext, true);
            }
            else {
                FromCounty2 = true;
                MainMap.setExtent(ext, true);
            }
            //alert(clicknum);
            clicknum = 0;
        }
    };


    //When the quad changes zoom to its extents
    //self.OnSelectedQuadChange = ko.computed(function () {
    self.QuadGo = function() {
        if (self.selectedQuad()) {
            require(["esri/geometry/Extent", "esri/graphic", "esri/geometry/Polygon", "esri/SpatialReference"],
                function (Extent, Graphic, Polygon, SpatialReference) {
                    var item = self.selectedQuad();
                    var Poly = new Polygon(new SpatialReference({ wkid: 3089 }));
                    Poly.addRing([[item.XMin, item.YMin], [item.XMin, item.YMax], [item.XMax, item.YMax], [item.XMax, item.YMin], [item.XMin, item.YMin]]);
                    var gra = new Graphic(Poly, DFlashPoly);
                    FromQuad = true;
                    MainMap.setExtent(gra.geometry.getExtent(), true);

                });
        };
    };



    //**********************************************************************************************************************************************
    //Player Buttons
    self.Play = function () {
        STOPPED = true;
        clearInterval(TIMER);

        retrieved = false;

        Gear = "D";
        var totalImagesDisplayed = 0;
        STOPPED = false;
        if (CurrIdx < 0)
            CurrIdx = 0;
        if (ForwardImages.length != 0 && STOPPED == false) {
            TIMER = setInterval(function () {
                var HasSwitched = false;
                var dist;
                if (CurrIdx <= ForwardImages.length) {
                    if (HasSwitched)
                        dist = 0.05;
                    else
                        dist = 0.25;

                    playForward();
                    //document.getElementById("ImageCounter").innerHTML = CurrIdx + " of " + ForwardImages.length + "NewBegMile: " + NewBegMile + " NewRevMile: " + NewRevMile;
                    CurrIdx = CurrIdx + self.selectedFrameInc().value;

                    if (CurrIdx / ForwardImages.length >= dist && retrieved == false) {
                        GetNextForwardSet();

                        HasSwitched = true;
                        retrieved = true;
                    }
                    if (ForwardImages.length - CurrIdx < self.selectedFrameInc().value) {
                        NextBackwardsSet = CurrentSet;
                        CurrentSet = NextForwardSet;
                        DrawLine(CurrentSet);
                        CurrIdx = 0;
                        retrieved = false;

                    }
                }
                else {
                    STOPPED = true;
                    clearInterval(TIMER);
                    alert("You have reached the end of this route.");
                }
            }, SpeedValue);
        };

    };

    self.Reverse = function () {
        STOPPED = true;
        clearInterval(TIMER);

        retrieved = false;

        Gear = "R";
        STOPPED = false;
        if (ForwardImages.length != 0 && STOPPED == false) { //&& CurrIdx != ForwardImages.length - 1

            TIMER = setInterval(function () {
                var HasSwitched = false;
                var dist;
                if (CurrIdx <= ForwardImages.length) {
                    if (HasSwitched)
                        dist = 0.95;
                    else
                        dist = 0.25;

                    if (CurrIdx > 0) {
                        playForward();
                        CurrIdx = CurrIdx - self.selectedFrameInc().value;
                        // document.getElementById("ImageCounter").innerHTML = CurrIdx + " of " + ForwardImages.length + "NewBegMile: " + NewBegMile + " NewRevMile: " + NewRevMile;
                        if (CurrIdx / ForwardImages.length <= dist && retrieved == false) {
                            GetNextBackwardSet();
                            retrieved = true;
                        }

                        if (CurrIdx <= self.selectedFrameInc().value) {
                            NextForwardSet = CurrentSet
                            CurrIdx = NextBackwardsSet.value.length - 1;
                            CurrentSet = NextBackwardsSet;
                            DrawLine(CurrentSet);
                            retrieved = false;

                        }

                    }
                }
                else {
                    STOPPED = true;
                    clearInterval(TIMER);
                    alert("You have reached the beginning of this route.");
                }
            }, SpeedValue);
        };
    };
    self.Stop = function () {
        clearInterval(TIMER);
        STOPPED = true;
    };

    self.GoToBeginning = function (SpatialReference) {
        STOPPED = true;
        clearInterval(TIMER);
        NextForwardSet = null;
        NextBackwardSet = null;
        CurrentSet = null;
        if (self.selectedCollDate() != undefined) {
            if (self.selectedDir() == "N" || self.selectedDir() == "E") {
                inContact = true;
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/PLPTs()?$filter=ROUTE eq '" + CurrRoute + "' and DIR eq '" + self.selectedDir() + "' and COLL_DATE eq '" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "' and LANE eq " + self.selectedLane() + "M and MILE_POINT gt " + "0M and MILE_POINT le 1M and UpdateIndicator eq 2M&$orderby=MILE_POINT&$select=ROUTE,EASTING,NORTHING,CNTYNAME,MILE_POINT,COLL_DATE,LANE,LEFT_URL,FRONT_URL,RIGHT_URL&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = 1.0;
                        NewRevMile = 0;
                        CurrentSet = result;
                        NextBackwardSet = null;
                        NextForwardSet = null;
                        CurrIdx = 0;
                        CurrMile = 0;
                        DrawLine(CurrentSet);
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
            else {
                inContact = true;
                var whatField = "END_MP";
                if (CurrRoute.substring(14) != "000")
                    whatField = "BEGIN_MP";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/kyallroads/kyallroads.svc/KYAllRoads?$filter=RT_UNIQUE eq '" + CurrRoute + "'&$select="+whatField+"&$orderby=BEGIN_MP&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result2) {
                        if (whatField == "END_MP")
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].END_MP);
                        else
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].BEGIN_MP);

                        $.ajax({
                            url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNonCardinal?ROUTE='" + CurrRoute + "'&Date='" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=" + HighMile + "M&ToMile=" + (HighMile - 1) + "M&$format=json",
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'jsonp',
                            jsonp: '$callback',
                            success: function (result) {
                                NewBegMile = HighMile;
                                NewRevMile = HighMile - 1;
                                CurrIdx = result.value.length - 1;
                                CurrMile = HighMile;
                                CurrentSet = result;
                                DrawLine(CurrentSet);
                                inContact = false;
                                return true;
                            },
                            error: function (err) {
                                return false;
                            }
                        });
                    }
                });
            }
        }
        else {
            if (self.selectedDir() == "N" || self.selectedDir() == "E") {

                inContact = true;
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentCardinal?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=0M&ToMile=1M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = 1.0;
                        NewRevMile = 0;
                        CurrentSet = result;
                        NextBackwardSet = null;
                        NextForwardSet = null;
                        CurrIdx = 0;
                        CurrMile = 0;
                        DrawLine(CurrentSet);
                        inContact = false;
                        return true;
                    },
                    error: function (err) {

                        return false;
                    }
                });
            }
            else {
                inContact = true;
                var whatField = "END_MP";
                if (CurrRoute.substring(14) != "000")
                    whatField = "BEGIN_MP";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/kyallroads/kyallroads.svc/KYAllRoads?$filter=RT_UNIQUE eq '" + CurrRoute + "'&$select="+whatField+"&$orderby=BEGIN_MP&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result2) {
                        if (whatField == "END_MP")
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].END_MP);
                        else
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].BEGIN_MP);
                        $.ajax({
                            url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentNonCardinal?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=" + (HighMile) + "M&ToMile=" + (HighMile - 1.0) + "M&$format=json",
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'jsonp',
                            jsonp: '$callback',
                            success: function (result) {
                                NewBegMile = HighMile;
                                NewRevMile = HighMile - 1;
                                CurrIdx = result.value.length - 1;
                                CurrMile = HighMile;
                                CurrentSet = result;
                                DrawLine(CurrentSet);
                                inContact = false;
                                return true;
                            },
                            error: function (err) {
                                return false;
                            }
                        });
                    }
                });
            }
        }
    };
//***********************************************************************************************************************************************
    self.GoToEnd = function () {
        STOPPED = true;
        clearInterval(TIMER);
        NextForwardSet = null;
        NextBackwardSet = null;
        CurrentSet = null;
        CurrRoute = CurrRoute.substring(0, 14) + "000";
        if (self.selectedCollDate() != undefined) {
            if (self.selectedDir() == "N" || self.selectedDir() == "E") {
                inContact = true;
                var whatField = "END_MP";
                if (CurrRoute.substring(15) == "000")
                    whatField = "BEGIN_MP";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/kyallroads/kyallroads.svc/KYAllRoads?$filter=RT_UNIQUE eq '" + CurrRoute + "'&$select=" + whatField + "&$orderby=BEGIN_MP&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result2) {
                        if (whatField == "END_MP")
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].END_MP);
                        else
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].BEGIN_MP);

                        $.ajax({
                            url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/PLPTs()?$filter=ROUTE eq '" + CurrRoute + "' and DIR eq '" + self.selectedDir() + "' and COLL_DATE eq '" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "' and LANE eq " + self.selectedLane() + "M and MILE_POINT gt " + (HighMile - 1) + "M and MILE_POINT le " + HighMile + "M and UpdateIndicator eq 2M&$orderby=MILE_POINT&$select=ROUTE,EASTING,NORTHING,CNTYNAME,MILE_POINT,COLL_DATE,LANE,LEFT_URL,FRONT_URL,RIGHT_URL&$format=json",
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'jsonp',
                            jsonp: '$callback',
                            success: function (result) {
                                NewBegMile = HighMile;
                                NewRevMile = HighMile - 1;
                                CurrIdx = result.value.length - 1;
                                CurrMile = HighMile;
                                CurrentSet = result;
                                DrawLine(CurrentSet);
                                inContact = false;
                                return true;
                            },
                            error: function (err) {
                                return false;
                            }
                        });
                    }
                });
            }

            else {

                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNonCardinal?ROUTE='" + CurrRoute + "'&Date='" + Padder(new Date(self.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(self.selectedCollDate()).getDate()) + "-" + new Date(self.selectedCollDate()).getFullYear() + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=1M&ToMile=0M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = 0;
                        NewRevMile = 1.0;
                        CurrentSet = result;
                        NextBackwardSet = null;
                        NextForwardSet = null;
                        CurrIdx = 0;
                        CurrMile = 0;
                        DrawLine(CurrentSet);
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
        }
        else {
            if (self.selectedDir() == "N" || self.selectedDir() == "E") {
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                inContact = true;
                var whatField = "END_MP";
                if (CurrRoute.substring(15) == "000")
                    whatField = "BEGIN_MP";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/kyallroads/kyallroads.svc/KYAllRoads?$filter=RT_UNIQUE eq '" + CurrRoute + "'&$select=" + whatField + "&$orderby=BEGIN_MP&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result2) {
                        if (whatField == "END_MP")
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].END_MP);
                        else
                            var HighMile = parseFloat(result2.value[result2.value.length - 1].BEGIN_MP);

                        $.ajax({
                            url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentCardinal?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile="  + (HighMile - 1) + "M&ToMile=" + (HighMile)+ "M&$format=json",
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'jsonp',
                            jsonp: '$callback',
                            success: function (result) {
                                NewBegMile = HighMile;
                                NewRevMile = HighMile - 1;
                                CurrIdx = result.value.length - 1;
                                CurrMile = HighMile;
                                CurrentSet = result;
                                DrawLine(CurrentSet);
                                inContact = false;
                                return true;
                            },
                            error: function (err) {

                                return false;
                            }
                        });
                    }
                });
            }
            else {
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentNonCardinal?Route='" + CurrRoute + "'&Dir='" + self.selectedDir() + "'&Lane=" + self.selectedLane() + "M&FromMile=1M&ToMile=0M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = 0;
                        NewRevMile = 1.0;
                        CurrentSet = result;
                        NextBackwardSet = null;
                        NextForwardSet = null;
                        CurrIdx = 0;
                        CurrMile = 0;
                        DrawLine(CurrentSet);
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
        }
    };

    self.AdvanceOneFrame = function () {
        Gear = "D";
        STOPPED = true;
        if (CurrIdx < ForwardImages.length -1) {
            var HasSwitched = false;
            var dist;
            if (CurrIdx <= ForwardImages.length) {
                if (HasSwitched)
                    dist = 0.05;
                else
                    dist = 0.25;


                //document.getElementById("ImageCounter").innerHTML = CurrIdx + " of " + ForwardImages.length + "NewBegMile: " + NewBegMile + " NewRevMile: " + NewRevMile;
                CurrIdx = CurrIdx + self.selectedFrameInc().value;
                playForward();
                if (CurrIdx / ForwardImages.length >= dist && SingleFrameRetrieved == false) {
                    SingleFrameRetrieved = GetNextForwardSet();
                    if (SingleFrameRetrieved == false)
                        alert("Didn't load the next forward set");
                    HasSwitched = true;

                }
                if (ForwardImages.length - CurrIdx < self.selectedFrameInc().value) {
                    NextBackwardsSet = CurrentSet;
                    CurrentSet = NextForwardSet;
                    DrawLine(CurrentSet);
                    CurrIdx = 0;
                    SingleFrameRetrieved = false;
                }
            }
            else {
                STOPPED = true;
                clearInterval(TIMER);
                alert("You have reached the end of this route.");
            }
        };
    };
    self.BackOneFrame = function () {
        Gear = "D";
        STOPPED = true;

        var HasSwitched = false;
        var dist;
        if (CurrIdx >= 0) {
            if (HasSwitched)
                dist = 0.05;
            else
                dist = 0.25;


            //document.getElementById("ImageCounter").innerHTML = CurrIdx + " of " + ForwardImages.length + "NewBegMile: " + NewBegMile + " NewRevMile: " + NewRevMile;
            CurrIdx = CurrIdx - self.selectedFrameInc().value;
            playForward();
            if (CurrIdx / ForwardImages.length <= dist && SingleFrameRetrieved == false) {
                SingleFrameRetrieved = GetNextBackwardSet();
                if (SingleFrameRetrieved == false)
                    alert("Didn't load the next forward set");
                HasSwitched = true;

            }
            if (CurrIdx <= self.selectedFrameInc().value) {
                NextForwardSet = CurrentSet
                CurrIdx = NextBackwardsSet.value.length - 1;
                CurrentSet = NextBackwardsSet;
                DrawLine(CurrentSet);
                SingleFrameRetrieved = false;
            }
        }
        else {
            STOPPED = true;
            clearInterval(TIMER);
            alert("You have reached the end of this route.");
        }

    };

    self.Uturn = function () {
        STOPPED = true;
        ForwardImages = [];
        clearInterval(TIMER);
        if (self.selectedDir() == "N" || self.selectedDir() == "E") {
            CurrDir = self.Directions()[1];
            self.selectedDir(self.Directions()[1]);
        }
        else {
            CurrDir = self.Directions()[0];
            self.selectedDir(self.Directions()[0]);
        }
    };
    //**********************************************************************************************************************************************
    //Print Button
    self.Print = function () {
        require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/SpatialReference", "esri/tasks/PrintTemplate", "spin/spin"],
            function (PrintTask, PrintParameters, SpatialReference, PrintTemplate, Spinner) {
                var url = jsonConfig.PrintService;
                var spinner = new Spinner(spinnerOpts).spin(document.getElementById("PrintOptionsBox"));
                //document.getElementById("PrintProcessingOff").setAttribute("id", "PrintProcessing");
                var Template = new PrintTemplate();
                Template.layout = self.selectedPrintOptions();
                Template.format = self.selectedPrintType();
                Template.layoutOptions = { customTextElements: [{ "Title1": document.getElementById("TitleBox").value }] };
                if (document.getElementById("ScalePresChk").checked) {
                    Template.preserveScale = true;
                }
                else {
                    Template.preserveScale = false;
                }
                var PrintParams = new PrintParameters();
                PrintParams.map = MainMap;
                PrintParams.outSpatialReference = new SpatialReference({ wkid: 3089 });
                PrintParams.template = Template;
                var PT = new PrintTask(url);
                PT.execute(PrintParams, function (printResult) {
                    spinner.stop();
                    spinner = null;
                    $('.spinner').remove();
                    //document.getElementById("PrintProcessing").setAttribute("id", "PrintProcessingOff");
                    window.open(printResult.url);

                }, function () { });
            });

    };
    self.PLPrint = function () {
    }
    self.PLLink = function () {
        if (CurrIdx == undefined) {
            if ((window.location.href).indexOf("config") != -1)
                prompt("To Copy Link: CTRL+C, ENTER", window.location.origin + window.location.pathname + "&x1=" + MainMap.extent.xmin + "&y1=" + MainMap.extent.ymin + "&x2=" + MainMap.extent.xmax + "&y2=" + MainMap.extent.ymax + "&MODE=PL");

            else
                prompt("To Copy Link: CTRL+C, ENTER", window.location.origin + window.location.pathname + "?x1=" + MainMap.extent.xmin + "&y1=" + MainMap.extent.ymin + "&x2=" + MainMap.extent.xmax + "&y2=" + MainMap.extent.ymax + "&MODE=PL");
        }
        else {
            if ((window.location.href).indexOf("config") != -1)
                prompt("To Copy Link: CTRL+C, ENTER", window.location.origin + window.location.pathname + "&x1=" + MainMap.extent.xmin + "&y1=" + MainMap.extent.ymin + "&x2=" + MainMap.extent.xmax + "&y2=" + MainMap.extent.ymax + "&MODE=PL&x=" + ForwardImages[CurrIdx].EASTING + "&y=" + ForwardImages[CurrIdx].NORTHING + "&Dir=" + CurrDir + "&Date=" + CurrDate);
            else
                prompt("To Copy Link: CTRL+C, ENTER", window.location.origin + window.location.pathname + "?x1=" + MainMap.extent.xmin + "&y1=" + MainMap.extent.ymin + "&x2=" + MainMap.extent.xmax + "&y2=" + MainMap.extent.ymax + "&MODE=PL&x=" + ForwardImages[CurrIdx].EASTING + "&y=" + ForwardImages[CurrIdx].NORTHING + "&Dir=" + CurrDir + "&Date=" + CurrDate);
        }
    }

    //*****************
    self.getRoads = (function () {
        var Roads = []
        for (i = 0; i < self.RoadNames().length; i++) {
            Roads.push({ label: self.RoadNames()[i].DisplayLabel, value: self.RoadNames()[i].DisplayLabel });

        }
        return Roads;
    });

    self.selectARoad = function (event, ui) {
        var searchItem = ui.item.value;
        var value = $.grep(self.RoadNames(), function (n) { return n.DisplayLabel == searchItem; })[0];
        self.selectedRoadName(value);
    };

    //**********************************************************************************************************************************************
    // Initial AJAX calls to set city, counties, and quads
    $.ajax({
        url: "http://maps.kytc.ky.gov/webservices/kytcextents/kytcextents.svc/Cities?$orderby=Name&$format=json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        jsonp: '$callback',
        success: function (result) {
            self.Cities(result.value);
        }
    });

    $.ajax({
        url: "http://maps.kytc.ky.gov/webservices/kytcextents/kytcextents.svc/CountyExtents?$orderby=Name&$format=json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        jsonp: '$callback',
        success: function (result2) {
            self.Counties(result2.value);
        }
    });

    $.ajax({
        url: "http://maps.kytc.ky.gov/webservices/kytcextents/kytcextents.svc/QuadExtents?$orderby=Name&$format=json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        jsonp: '$callback',
        success: function (result3) {
            self.Quads(result3.value);
        }
    });

    $.ajax({
        url: "http://maps.kytc.ky.gov/webservices/kytcextents/kytcextents.svc/LookupGovLevels?$format=json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        jsonp: '$callback',
        success: function (result4) {
            self.GovLevelLookup(result4.value);
        }
    });

    $.ajax({
        url:"http://maps.kytc.ky.gov/webservices/kytcextents/kytcextents.svc/LookupSurfaceTypes?$format=json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        jsonp: '$callback',
        success: function (result5) {
            self.SurfaceLookup(result5.value);
        }
    });
    $(function () {
        require(["esri/request", "dojo/_base/array", "esri/config"], function (esriRequest, arrayUtils, esriConfig) {
            //esriConfig.defaults.io.proxyUrl = "/proxy";
            var url = jsonConfig.PrintService;
            var printInfo = esriRequest({
                "url": url,
                handleAs: "json",
                callbackParamName: "callback",
                "content": { "f": "json" }
            });
            printInfo.then(function (response) {
                var layoutTemplate = arrayUtils.filter(response.parameters, function (param, idx) {
                    return param.name === "Layout_Template";
                });
                var typeTemplate = arrayUtils.filter(response.parameters, function (param, idx) {
                    return param.name === "Format";
                });
                self.PrintOptions(layoutTemplate[0].choiceList);
                self.PrintTypes(typeTemplate[0].choiceList);

            }, function () { });
        });
    });
    return self;
}


//**************************************************************************************************************************************************************************F
function GetNextForwardSet() {
    require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["spin/spin"], function (Spinner) {
        if (AppViewModelObj.selectedCollDate() != undefined) {
            if (AppViewModelObj.selectedDir() == "N" || AppViewModelObj.selectedDir() == "E") {
                inContact = true;
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/PLPTs()?$filter=ROUTE eq '" + CurrRoute + "' and DIR eq '" + AppViewModelObj.selectedDir() + "' and COLL_DATE eq '" + Padder(new Date(AppViewModelObj.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(AppViewModelObj.selectedCollDate()).getDate()) + "-" + new Date(AppViewModelObj.selectedCollDate()).getFullYear() + "' and LANE eq " + AppViewModelObj.selectedLane() + "M and MILE_POINT gt " + NewBegMile + "M and MILE_POINT le " + (NewBegMile + 1) + "M and UpdateIndicator eq 2M&$orderby=MILE_POINT&$select=ROUTE,EASTING,NORTHING,CNTYNAME,MILE_POINT,COLL_DATE,LANE,LEFT_URL,FRONT_URL,RIGHT_URL&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = NewBegMile + 1.0;
                        NewRevMile = NewBegMile - 1.0;
                        if (NewRevMile < 0)
                            NewRevMile = 0;
                        NextForwardSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
            else {
                inContact = true;
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNonCardinal?ROUTE='" + CurrRoute + "'&Date='" + Padder(new Date(AppViewModelObj.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(AppViewModelObj.selectedCollDate()).getDate()) + "-" + new Date(AppViewModelObj.selectedCollDate()).getFullYear() + "'&Dir='" + AppViewModelObj.selectedDir() + "'&Lane=" + AppViewModelObj.selectedLane() + "M&FromMile=" + (NewBegMile) + "M&ToMile=" + (NewBegMile - 1.0) + "M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = NewBegMile - 1.0;
                        if (NewBegMile < 0)
                            NewBegMile = 0;
                        NewRevMile = NewBegMile + 1.0;
                        NextForwardSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
        }
        else {
            if (AppViewModelObj.selectedDir() == "N" || AppViewModelObj.selectedDir() == "E") {

                inContact = true;
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentCardinal?Route='" + CurrRoute + "'&Dir='" + AppViewModelObj.selectedDir() + "'&Lane=" + AppViewModelObj.selectedLane() + "M&FromMile=" + NewBegMile + "M&ToMile=" + (NewBegMile + 1.0) + "M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = NewBegMile + 1.0;
                        NewRevMile = NewBegMile - 1.0;
                        if (NewRevMile < 0)
                            NewRevMile = 0;
                        NextForwardSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {

                        return false;
                    }
                });
            }
            else {
                inContact = true;
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentNonCardinal?Route='" + CurrRoute + "'&Dir='" + AppViewModelObj.selectedDir() + "'&Lane=" + AppViewModelObj.selectedLane() + "M&FromMile=" + (NewBegMile) + "M&ToMile=" + (NewBegMile - 1.0) + "M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewBegMile = NewBegMile - 1.0;
                        if (NewBegMile < 0)
                            NewBegMile = 0;
                        NewRevMile = NewBegMile + 1.0;
                        NextForwardSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
        }
    });
}

function GetNextBackwardSet() {
    require({ packages: [{ name: "spin", location: 'http://maps.kytc.ky.gov/photolog/js', main: 'spin' }] }, ["spin/spin"], function (Spinner) {
        if (AppViewModelObj.selectedCollDate() != undefined) {
            if (AppViewModelObj.selectedDir() == "N" || AppViewModelObj.selectedDir() == "E") {
                inContact = true;
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/PLPTs()?$filter=ROUTE eq '" + CurrRoute + "' and DIR eq '" + AppViewModelObj.selectedDir() + "' and COLL_DATE eq '" + Padder(new Date(AppViewModelObj.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(AppViewModelObj.selectedCollDate()).getDate()) + "-" + new Date(AppViewModelObj.selectedCollDate()).getFullYear() + "' and LANE eq " + AppViewModelObj.selectedLane() + "M and MILE_POINT le " + (NewRevMile) + "M and MILE_POINT gt " + (NewRevMile - 1.00) + "M and UpdateIndicator eq 2M&$orderby=MILE_POINT&$select=ROUTE,EASTING,NORTHING,CNTYNAME,MILE_POINT,COLL_DATE,LANE,LEFT_URL,FRONT_URL,RIGHT_URL&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {

                        NewRevMile = NewRevMile - 1.0;
                        NewBegMile = NewRevMile + 1.0;
                        NextBackwardsSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
            else {
                inContact = true;
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNonCardinal?ROUTE='" + CurrRoute + "'&Date='" + Padder(new Date(AppViewModelObj.selectedCollDate()).getMonth() + 1) + "-" + Padder(new Date(AppViewModelObj.selectedCollDate()).getDate()) + "-" + new Date(AppViewModelObj.selectedCollDate()).getFullYear() + "'&Dir='" + AppViewModelObj.selectedDir() + "'&Lane=" + AppViewModelObj.selectedLane() + "M&FromMile=" + (NewRevMile - 1.0) + "M&ToMile=" + (NewRevMile)+ "M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewRevMile = NewRevMile - 1.0;
                        NewBegMile = NewRevMile + 1.0;
                        NextBackwardsSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
        }
        else {
            if (AppViewModelObj.selectedDir() == "N" || AppViewModelObj.selectedDir() == "E") {

                inContact = true;
                CurrRoute = CurrRoute.substring(0, 14) + "000";
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentCardinal?Route='" + CurrRoute + "'&Dir='" + AppViewModelObj.selectedDir() + "'&Lane=" + AppViewModelObj.selectedLane() + "M&FromMile=" + (NewRevMile - 1.0) + "M&ToMile=" + (NewRevMile) + "M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewRevMile = NewRevMile - 1.0;
                        NewBegMile = NewRevMile + 1.0;
                        NextBackwardsSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {

                        return false;
                    }
                });
            }
            else {
                inContact = true;
                $.ajax({
                    url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/CurrentNonCardinal?Route='" + CurrRoute + "'&Dir='" + AppViewModelObj.selectedDir() + "'&Lane=" + AppViewModelObj.selectedLane() + "M&FromMile=" + (NewRevMile + 1) + "M&ToMile=" + (NewRevMile)  + "M&$format=json",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'jsonp',
                    jsonp: '$callback',
                    success: function (result) {
                        NewRevMile = NewRevMile + 1.0;
                        NewBegMile = NewRevMile - 1.0;
                        NextBackwardsSet = result;
                        inContact = false;
                        return true;
                    },
                    error: function (err) {
                        return false;
                    }
                });
            }
        }
    });
}
function DrawLine(result) {
    ForwardImages = result.value;

    $("#PLprogress").dialog("close");
    var ZoomRoadLayer = MainMap.getLayer("ZoomRoadLayer");
    var ZoomEnds = MainMap.getLayer("ZoomEndPointsLayer");
    var PLGL = MainMap.getLayer("PLLocLayer");
    ZoomEnds.clear();
    ZoomRoadLayer.clear();
    require(["esri/graphic", "esri/geometry/Polyline", "esri/geometry/Point", "esri/SpatialReference", "esri/graphicsUtils"], function (Graphic, Polyline, Point, SpatialReference, graphicsUtils) {
        var KYSZ = new SpatialReference({ wkid: 3089 });
        var theBlackLine = new Polyline(KYSZ);
        var CurrRouteVal = null;
        var pointArray = [];
        var prevIndex = 0;
        for (i = 0; i < ForwardImages.length; i++) {
            ZoomRoadLayer.add(new Graphic(new Point(ForwardImages[i].EASTING, ForwardImages[i].NORTHING, KYSZ), TeenyRedDot));
        }
        //Find closest milePoint
        var closest = null;
        curr = 0;
        $.each(ForwardImages, function () {
            if (closest == null || Math.abs(this.MILE_POINT - CurrMile) < Math.abs(closest.MILE_POINT - CurrMile)) {
                CurrIdx = curr;
                closest = this;
            }
            curr++;
        });
        if (closest != null) {
            document["leftimage"].src = ForwardImages[CurrIdx].LEFT_URL.replace(/\\/g, "/").replace(/F_/g, "R_");
            document["centerimage"].src = ForwardImages[CurrIdx].FRONT_URL.replace(/\\/g, "/").replace(/F_/g, "R_");
            document["rightimage"].src = ForwardImages[CurrIdx].RIGHT_URL.replace(/\\/g, "/").replace(/F_/g, "R_");
        }

        $("#CountyCell").text(ForwardImages[CurrIdx].CNTYNAME);
        $("#RTCell").text(ForwardImages[CurrIdx].ROUTE.substring(4, 6));
        $("#RNCell").text(ForwardImages[CurrIdx].ROUTE.substring(7, 11));
        $("#CDCell").text(ForwardImages[CurrIdx].COLL_DATE);
        $("#DCell").text(CurrDir);
        $("#RTUCell").text(ForwardImages[CurrIdx].ROUTE);
        $("#MPCell").text(ForwardImages[CurrIdx].MILE_POINT.match(/\d*\.\d{3}/)[0]);
        MainMap.centerAt(new Point(ForwardImages[CurrIdx].EASTING, ForwardImages[CurrIdx].NORTHING, KYSZ));
        var G = new Graphic(new Point(ForwardImages[CurrIdx].EASTING, ForwardImages[CurrIdx].NORTHING, KYSZ), PLPointSym);
        PLGL.clear();
        PLGL.add(G);



    });
}


function playForward() {
    var PLGL = MainMap.getLayer("PLLocLayer");


    require(["esri/tasks/GeometryService", "esri/geometry/Extent", "esri/graphic", "esri/geometry/Point", "esri/SpatialReference"], function (GeometryService, Extent, Graphic, Point, SpatialReference) {
        var KYSZ = new SpatialReference({ wkid: 3089 });
        var currentLocation = new Point(ForwardImages[CurrIdx].EASTING, ForwardImages[CurrIdx].NORTHING, KYSZ);
        //$("#leftimage").attr("src", ForwardImages[CurrIdx].LEFT_URL.replace(/\\/g, "/").replace(/F_/g, "R_"));
        //$("#centerimage").attr("src", ForwardImages[CurrIdx].FRONT_URL.replace(/\\/g, "/").replace(/F_/g, "R_"));
        //$("#rightimage").attr("src", ForwardImages[CurrIdx].RIGHT_URL.replace(/\\/g, "/").replace(/F_/g, "R_"));
        var G = new Graphic(currentLocation, PLPointSym);
        PLGL.clear();
        PLGL.add(G);
        $("#CountyCell").text(ForwardImages[CurrIdx].CNTYNAME);
        $("#RTCell").text(ForwardImages[CurrIdx].ROUTE.substring(4, 6));
        $("#RNCell").text(ForwardImages[CurrIdx].ROUTE.substring(7, 11));
        $("#CDCell").text(ForwardImages[CurrIdx].COLL_DATE);
        $("#DCell").text(CurrDir);
        $("#RTUCell").text(ForwardImages[CurrIdx].ROUTE);
        $("#MPCell").text(ForwardImages[CurrIdx].MILE_POINT.match(/\d*\.\d{3}/)[0]);
        CurrMile = parseFloat(ForwardImages[CurrIdx].MILE_POINT);
        document.getElementById("leftimage").src = ForwardImages[CurrIdx].LEFT_URL.replace(/\\/g, "/").replace(/F_/g, "R_");
        document.getElementById("centerimage").src = ForwardImages[CurrIdx].FRONT_URL.replace(/\\/g, "/").replace(/F_/g, "R_");
        document.getElementById("rightimage").src = ForwardImages[CurrIdx].RIGHT_URL.replace(/\\/g, "/").replace(/F_/g, "R_");
        var E = new Extent(MainMap.extent.xmin + ((MainMap.extent.xmax - MainMap.extent.xmin) * 0.1), MainMap.extent.ymin + ((MainMap.extent.ymax - MainMap.extent.ymin) * 0.1), MainMap.extent.xmax - ((MainMap.extent.xmax - MainMap.extent.xmin) * 0.1), MainMap.extent.ymax - ((MainMap.extent.ymax - MainMap.extent.ymin) * 0.1), KYSZ)
        if (currentLocation.x > E.xmax || currentLocation.x < E.xmin || currentLocation.y > E.ymax || currentLocation.y < E.ymin)
            MainMap.centerAt(currentLocation);

        $("#FEEDBACKLINK").attr("href", "mailto:kytc.gis.support@ky.gov?subject=KYTC%20Photolog%20Application&body=" + "I%20am%20having%20trouble%20with%20the%20following%20map:%20" + window.location.origin + window.location.pathname + "?x1=" + MainMap.extent.xmin + "%26y1=" + MainMap.extent.ymin + "%26x2=" + MainMap.extent.xmax + "%26y2=" + MainMap.extent.ymax + "%26MODE=PL%26x=" + currentLocation.x + "%26y=" + currentLocation.y + "%26Dir=" + CurrDir + "%26Date=" + CurrDate + "%0A%0AI'm%20using%20" + browserDetector() + ".%0AMy%20browser%20info:%20" + navigator.userAgent + ". %0A%0AMy%20problem%20is:");

    });

}

//When button is clicked slide the tabs in/out
function MapToolChangDiv() {
    if (document.getElementById("MapToolsButtonClosed")) {
        document.getElementById("MapToolsClosed").setAttribute("id", "MapToolsOpen");
        document.getElementById("MapToolsIndicatorClosed").setAttribute("id", "MapToolsIndicatorOpen");
        document.getElementById("MapToolsButtonClosed").setAttribute("id", "MapToolsButtonOpen");
        document.getElementById("DisclaimerCollapsed").setAttribute("id", "DisclaimerClosed");
        document.getElementById("DisclaimerAreaCollapsed").setAttribute("id", "DisclaimerAreaClosed");
    }
    else {
        document.getElementById("MapToolsOpen").setAttribute("id", "MapToolsClosed");
        document.getElementById("MapToolsIndicatorOpen").setAttribute("id", "MapToolsIndicatorClosed");
        document.getElementById("MapToolsButtonOpen").setAttribute("id", "MapToolsButtonClosed");
        if (document.getElementById("DisclaimerClosed")) {
            document.getElementById("DisclaimerClosed").setAttribute("id", "DisclaimerCollapsed");
            document.getElementById("DisclaimerAreaClosed").setAttribute("id", "DisclaimerAreaCollapsed");
            // document.getElementById("DisclaimerIndicatorOpen").setAttribute("id", "DisclaimerIndicatorClosed");
        }
        else if (document.getElementById("DisclaimerOpen")) {
            document.getElementById("DisclaimerOpen").setAttribute("id", "DisclaimerCollapsed");
            document.getElementById("DisclaimerAreaOpen").setAttribute("id", "DisclaimerAreaCollapsed");
            document.getElementById("DisclaimerIndicatorOpen").setAttribute("id", "DisclaimerIndicatorClosed");
        }
    }
}

function DisclaimerChangeDiv() {
    if (document.getElementById("DisclaimerCollapsed")) {
        document.getElementById("DisclaimerCollapsed").setAttribute("id", "DisclaimerOpen");
        document.getElementById("DisclaimerIndicatorClosed").setAttribute("id", "DisclaimerIndicatorOpen");
        document.getElementById("DisclaimerAreaCollapsed").setAttribute("id", "DisclaimerAreaOpen");
        document.getElementById("MapToolsClosed").setAttribute("id", "MapToolsOpen");
        document.getElementById("MapToolsButtonClosed").setAttribute("id", "MapToolsButtonOpen");
        document.getElementById("MapToolsIndicatorClosed").setAttribute("id", "MapToolsIndicatorOpen");
    }
    else if (document.getElementById("DisclaimerClosed")) {
        document.getElementById("DisclaimerClosed").setAttribute("id", "DisclaimerOpen");
        document.getElementById("DisclaimerIndicatorClosed").setAttribute("id", "DisclaimerIndicatorOpen");
        document.getElementById("DisclaimerAreaClosed").setAttribute("id", "DisclaimerAreaOpen");
    }
    else if (document.getElementById("DisclaimerOpen")) {
        document.getElementById("DisclaimerOpen").setAttribute("id", "DisclaimerClosed");
        document.getElementById("DisclaimerIndicatorOpen").setAttribute("id", "DisclaimerIndicatorClosed");
        document.getElementById("DisclaimerAreaOpen").setAttribute("id", "DisclaimerAreaClosed");
    }



}

//When button is clicked slide the ID tab in/out
function IDToolsChangeDiv() {
    if (document.getElementById("IDToolsButtonClosed")) {
        document.getElementById("IDToolsClosed").setAttribute("id", "IDToolsOpen");
        document.getElementById("IDToolsButtonClosed").setAttribute("id", "IDToolsButtonOpen");
        document.getElementById("IdentifyResultsIndicatorClosed").setAttribute("id", "IdentifyResultsIndicatorOpen");

    }
    else {
        document.getElementById("IDToolsOpen").setAttribute("id", "IDToolsClosed");
        document.getElementById("IDToolsButtonOpen").setAttribute("id", "IDToolsButtonClosed");
        document.getElementById("IdentifyResultsIndicatorOpen").setAttribute("id", "IdentifyResultsIndicatorClosed");

    }

}

// validation for Lat/Long boxes in ZoomToDD tool
function validateLat(DDLatitude) {
    if (DDLatitude.value.length > 11)
        DDLatitude.value = DDLatitude.value.slice(0, 11);

    if (DDLatitude.value > 90 || DDLatitude.value < -90)
        DDLatitude.setCustomValidity('Latitude cannot be greater than 90  or less than -90');
    else
        DDLatitude.setCustomValidity('');
}

function validateLong(DDLongitude) {
    if (DDLongitude.value.length > 11)
        DDLongitude.value = DDLongitude.value.slice(0, 11);

    if (DDLongitude.value > 180 || DDLongitude.value < -180)
        DDLongitude.setCustomValidity('Longitude cannot be greater than 180 or less than -180');
    else
        DDLongitude.setCustomValidity('');
}

function Padder(val) {
    if (val < 10) {
        return ('0' + val.toString());
    }
    else
        return val.toString();
}

function nextDate(startDate, dates) {
    var startTime = +startDate;
    var nearestDate, nearestDiff = Infinity;
    for (var i = 0, n = dates.length; i < n; ++i) {
        var diff = +dates[i] - startTime;
        if (diff > 0 && diff < nearestDiff) {
            nearestDiff = diff;
            nearestDate = dates[i];
        }
    }
    return nearestDate;
}



function GetNewCurrRoute() {
    $.ajax({
        url: "http://maps.kytc.ky.gov/WebServices/PLDS/PLDS.svc/GetNewCurrRoute?Route='" + CurrRoute + "'&Dir='" + CurrDir + "'&CurrMile=" + CurrMile + "M&$format=json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        jsonp: '$callback',
        success: function (result) {
            CurrRoute = result.value[0];
        }
    });

}

function HideBanner() {
    if (document.getElementById("BannerOpen")) {
        document.getElementById("BannerOpen").setAttribute("id", "BannerClosed");
        document.getElementById("BannerChevronOpen").setAttribute("id", "BannerChevronClosed");
    }
    else {
        document.getElementById("BannerClosed").setAttribute("id", "BannerOpen");
        document.getElementById("BannerChevronClosed").setAttribute("id", "BannerChevronOpen");
    }
}
function SlideToolBar() {
    if (document.getElementById("ButtonBarOpen")) {
        document.getElementById("ButtonBarOpen").setAttribute("id", "ButtonBarClosed");
    }
    else
        document.getElementById("ButtonBarClosed").setAttribute("id", "ButtonBarOpen");
}
function MapDivResize() {
    var resizeTimer;
    require(["esri/geometry/Extent", "esri/geometry/Point", "esri/SpatialReference"], function (Extent, Point, SpatialReference) {
        var x = ((MainMap.extent.xmax - MainMap.extent.xmin) / 2) + MainMap.extent.xmin;
        var y = ((MainMap.extent.ymax - MainMap.extent.ymin) / 2) + MainMap.extent.ymin;
        var env = MainMap.extent;
        clearTimeout(resizeTimer);
        if (document.getElementById("mainMap")) {
            MODE = "PL";
            $("#MapFeedBack").attr('disabled', true);
            $("#CBPhotolog").attr("value", "Return to Main Map");
            $("#identifyFeat").button("option", "disabled", true);
            $("#getCoords").button("option", "disabled", true);
            $("#rdInfo").button("option", "disabled", true);
            $("#measureDist").button("option", "disabled", true);
            MainMap.getLayer("PhotoLogLayer").setVisibility(true);

            document.getElementById("mainMap").setAttribute("id", "PhotoLogMap");
            document.getElementById("InfoDivClosed").setAttribute("id", "InfoDivOpen");
            document.getElementById("PhotoDivClosed").setAttribute("id", "PhotoDivOpen");
            document.getElementById("PhotoControlsClosed").setAttribute("id", "PhotoControlsOpen");
            if (document.getElementById("MapToolsButtonOpen")) {
                document.getElementById("MapToolsOpen").setAttribute("id", "MapToolsClosed");
                document.getElementById("MapToolsIndicatorOpen").setAttribute("id", "MapToolsIndicatorClosed");
                document.getElementById("MapToolsButtonOpen").setAttribute("id", "MapToolsButtonClosed");
                if (document.getElementById("DisclaimerClosed")) {
                    document.getElementById("DisclaimerClosed").setAttribute("id", "DisclaimerCollapsed");
                }
                else if (document.getElementById("DisclaimerOpen")) {
                    document.getElementById("DisclaimerOpen").setAttribute("id", "DisclaimerCollapsed");
                    document.getElementById("DisclaimerIndicatorOpen").setAttribute("id", "DisclaimerIndicatorClosed");
                }
                if (document.getElementById("DisclaimerAreaClosed")) {
                    document.getElementById("DisclaimerAreaClosed").setAttribute("id", "DisclaimerAreaCollapsed");
                    if (document.getElementById("DisclaimerIndicatorOpen"))
                        document.getElementById("DisclaimerIndicatorOpen").setAttribute("id", "DisclaimerIndicatorClosed");
                }
                else if (document.getElementById("DisclaimerAreaOpen")) {
                    document.getElementById("DisclaimerAreaOpen").setAttribute("id", "DisclaimerAreaCollapsed");
                    if (document.getElementById("DisclaimerAreaOpen"))
                        document.getElementById("DisclaimerIndicatorOpen").setAttribute("id", "DisclaimerIndicatorClosed");
                }
            }
            if (document.getElementById("IDToolsOpen")) {
                document.getElementById("IDToolsOpen").setAttribute("id", "IDToolsClosed");
                document.getElementById("IDToolsButtonOpen").setAttribute("id", "IDToolsButtonClosed");

            }
            if (document.getElementById("ButtonBarOpen")) {
                document.getElementById("ButtonBarOpen").setAttribute("id", "ButtonBarClosed");
            }

            document.getElementById("identifyFeat").setAttribute("disabled", true);
            document.getElementById("measureDist").setAttribute("disabled", true);
            document.getElementById("getCoords").setAttribute("disabled", true);
            document.getElementById("rdInfo").setAttribute("disabled", true);
            MainMap.getLayer("PhotoLogLayer").setVisibility(true);
            resizeTimer = setTimeout(function () {
                resizeMap("PhotoLogMap");
                repositionMap("PhotoLogMap");
                MainMap.setExtent(env, true);
                MainMap.centerAt(new Point(x, y, new SpatialReference({ wkid: 3089 })));
                if (MainMap.getScale() > 500000)
                    MainMap.setLevel(6);
            }, 1000);

            $("#FEEDBACKLINK").attr("href", "mailto:kytc.gis.support@ky.gov?subject=KYTC Photolog Application&body=" + "I am having trouble with the follwing map: " + window.location.origin + window.location.pathname + "?x1=" + MainMap.extent.xmin + "%26y1=" + MainMap.extent.ymin + "%26x2=" + MainMap.extent.xmax + "%26y2=" + MainMap.extent.ymax + "%26MODE=PL%0A%0AI'm using " + browserDetector() + ".%0A" + "My browser info: " + navigator.userAgent + ". %0A%0A My problem is: ");
        }
        else {
            MODE = "APP";
            $("#MapFeedBack").attr('disabled', false);
            $("#CBPhotolog").attr("value", "PHOTOLOG");
            $("#identifyFeat").button("option", "disabled", false);
            $("#getCoords").button("option", "disabled", false);
            $("#rdInfo").button("option", "disabled", false);
            $("#measureDist").button("option", "disabled", false);
            MainMap.getLayer("PLLocLayer").clear();
            MainMap.getLayer("ZoomRoadLayer").clear();
            MainMap.getLayer("PhotoLogLayer").setVisibility(false);
            document.getElementById("PhotoLogMap").setAttribute("id", "mainMap");
            document.getElementById("InfoDivOpen").setAttribute("id", "InfoDivClosed");
            document.getElementById("PhotoDivOpen").setAttribute("id", "PhotoDivClosed");
            document.getElementById("PhotoControlsOpen").setAttribute("id", "PhotoControlsClosed");
            if (document.getElementById("MapToolsIndicatorOpen"))
                document.getElementById("MapToolsIndicatorOpen").setAttribute("id", "MapToolsIndicatorClosed");
            document.getElementById("identifyFeat").removeAttribute("disabled");
            document.getElementById("measureDist").removeAttribute("disabled");
            document.getElementById("getCoords").removeAttribute("disabled");
            MainMap.getLayer("PhotoLogLayer").setVisibility(false);
            resizeTimer = setTimeout(function () {
                resizeMap("mainMap");
                repositionMap("mainMap");
                MainMap.setExtent(env, true);
                MainMap.centerAt(new Point(x, y, new SpatialReference({ wkid: 3089 })));
                //alert(MainMap.extent.xmin + "," + MainMap.extent.ymin + "," + MainMap.extent.xmax + "," + MainMap.extent.ymax);
            }, 1000);
        }

    });
}
function resizeMap(divname) {
    var isChromium = window.chrome,
        vendorName = window.navigator.vendor;
    if (isChromium != undefined && vendorName === "Google Inc.") {
        // is Google chrome
        MainMap.width = parseInt(document.defaultView.getComputedStyle(document.getElementById(divname)).getPropertyValue("width"));
        MainMap.height = parseInt(document.defaultView.getComputedStyle(document.getElementById(divname)).getPropertyValue("height"));
    } else {
        // not Google chrome
        MainMap.width = parseInt($(document.getElementById(divname)).css("width"));
        MainMap.height = parseInt($(document.getElementById(divname)).css("height"));
    }

    MainMap.resize();
};

function repositionMap(divname) {
    require(["esri/geometry/Point"], function (Point) {
        //var Point = new Point(parseInt(document.defaultView.getComputedStyle(document.getElementById(divname)).getPropertyValue("left")),
        //  parseInt(document.defaultView.getComputedStyle(document.getElementById(divname)).getPropertyValue("top")));
        var Point = new Point(parseInt($(document.getElementById(divname)).css("left")), parseInt($(document.getElementById(divname)).css("top")));
        MainMap.position = Point;
        MainMap.reposition();
    });
}

function MeasureArea() {
    require(["dojo/_base/lang", "esri/tasks/GeometryService", "esri/tasks/AreasAndLengthsParameters", "esri/toolbars/draw", "esri/symbols/SimpleFillSymbol", "esri/graphic"],
        function (lang, GeometryService, AreasAndLengthsParameters, Draw, SimpleFillSymbol, Graphic) {
            if (DrawMeasureLine != undefined || DrawMeasureLine != null)
                DrawMeasureLine.deactivate();
            DrawPoly = new Draw(MainMap);
            DrawPoly.on("draw-end", lang.hitch(MainMap, getAreaAndLength));
            DrawPoly.activate(Draw.POLYGON);
            var GS = new GeometryService("http://maps.kytc.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            GS.on("areas-and-lengths-complete", outputAreaAndLength);

            function getAreaAndLength(evtObj) {
                var geom = evtObj.geometry;
                MainMap.graphics.clear();
                var G = MainMap.graphics.add(new Graphic(geom, new SimpleFillSymbol()));

                var areasAndLengthParams = new AreasAndLengthsParameters();
                areasAndLengthParams.calculationType = "preserveShape";
                switch (aLengthUnit) {
                    case "FEET":
                        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_FOOT;
                        break;
                    case "MILES":
                        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_STATUTE_MILE;
                        break;
                    case "METERS":
                        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
                        break;
                    case "KILOMETERS":
                        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                        break;
                }
                switch (anAreaUnit) {
                    case "ACRES":
                        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_ACRES;
                        break;
                    case "SQUARE FEET":
                        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_FEET;
                        break;
                    case "SQUARE MILES":
                        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_MILES;
                        break;
                    case "HECTARES":
                        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_HECTARES;
                        break;
                    case "SQUARE METERS":
                        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
                        break;
                    case "SQUARE KILOMETERS":
                        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_KILOMETERS;
                        break;
                }
                GS.simplify([geom], function (simplifiedGeometries) {
                    areasAndLengthParams.polygons = simplifiedGeometries;
                    GS.areasAndLengths(areasAndLengthParams);
                });
            };
            function outputAreaAndLength(evtObj) {
                var result = evtObj.result;
                $("#area").show();
                $("#area").text(" " + numberWithCommas(result.areas[0]) + " " + anAreaUnit.toLowerCase());
                $("#length").text(" " + numberWithCommas(result.lengths[0]) + " " + aLengthUnit.toLowerCase());
            };
        });
}
function MeasureLength() {
    require(["dojo/_base/lang", "esri/tasks/GeometryService", "esri/tasks/LengthsParameters", "esri/toolbars/draw", "esri/symbols/SimpleLineSymbol", "esri/graphic"],
        function (lang, GeometryService, LengthsParameters, Draw, SimpleLineSymbol, Graphic) {
            if (DrawPoly != undefined || DrawPoly != null)
                DrawPoly.deactivate();
            DrawMeasureLine = new Draw(MainMap);
            DrawMeasureLine.on("draw-end", lang.hitch(MainMap, getLength));
            DrawMeasureLine.activate(Draw.POLYLINE);
            var GS = new GeometryService("http://maps.kytc.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            GS.on("lengths-complete", OutputLength);

            function getLength(evtObj) {
                var geom = evtObj.geometry;
                MainMap.graphics.clear();
                var G = MainMap.graphics.add(new Graphic(geom, new SimpleLineSymbol()));
                var LengthParams = new LengthsParameters()
                LengthParams.calculationType = "preserveShape";
                switch (aLengthUnit) {
                    case "FEET":
                        LengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_FOOT;
                        break;
                    case "MILES":
                        LengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_STATUTE_MILE;
                        break;
                    case "METERS":
                        LengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
                        break;
                    case "KILOMETERS":
                        LengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                        break;
                }
                LengthParams.polylines = [geom];
                GS.lengths(LengthParams);
            };
            function OutputLength(evtObj) {
                var result = evtObj.result;
                $("#area").hide();
                $("#length").text(" " + numberWithCommas(result.lengths[0]) + " " + aLengthUnit.toLowerCase());
            }

        });
}

function numberWithCommas(x) {

    var parts = x.toFixed(3).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function PLLayerOn() {
    if ($("#CBPhotolog").prop('checked')) {
        MainMap.getLayer("PhotoLogLayer").setVisibility(true);
    }
    else {
        MainMap.getLayer("PhotoLogLayer").setVisibility(false);
    }
}

if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}


if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisArg */) {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className) {
        return this.querySelectorAll("." + className);
    };
    Element.prototype.getElementsByClassName = document.getElementsByClassName;
}

function browserDetector() {
    var versionstring = "";
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
        var ffversion = new Number(RegExp.$1) // capture x.x portion and store as a number
        versionstring = "Firefox " + ffversion;
    }
    else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        var ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
        versionstring = "IE " + ieversion;
    }
    else if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
        var oprversion = new Number(RegExp.$1) // capture x.x portion and store as a number
        versionstring = "Opera " + oprversion;
    }
    else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var chromeversion = new Number(RegExp.$1) //
        versionstring = "Chrome " + chromeversion;
    }
    else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var safariversion = new Number(RegExp.$1) //
        versionstring = "Safari " + safariversion;
    }
    return versionstring;
}


