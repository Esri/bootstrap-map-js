/**
 * Created by ahjung.kim on 12/5/2014.
 */

/*$(".elements-with-tooltips").on('show', function (e) {
 if ('ontouchstart' in document.documentElement) e.preventDefault();
 });*/

// Active tool tip
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

/*Panel open close*/
PanelToggle("#accordion", "#accordion-close", "#query-icon");
PanelToggle("#layers-list","#layers-list-close","#layers-icon");
PanelToggle("#tool-accordion","#tool-accordion-close","#kytc-tools-icon");

function PanelToggle (objectId,closeBtnId, btnId){
    var object = $(objectId);
    var closeBtn = $(closeBtnId);
    var btn = $(btnId);

    btn.on("click", function(){
        object.show();
    });

    closeBtn.on("click", function(){
        object.hide();
    });
}



/*// Accordion panel open/close
var accordion = $("#accordion");
var accordionClose = $("#accordion-close");
var queryIcon = $("#query-icon");

queryIcon.on("click", function () {
    accordion.show();
});

accordionClose.on("click", function () {
    accordion.hide();
});*/

/*
// Layers list panel open/close
var layersList = $("#layers-list");
var layersListClose = $("#layers-list-close");
var layersIcon = $("#layers-icon");

layersListClose.on("click", function () {
    layersList.hide();
});

layersIcon.on("click", function () {
    layersList.show();
});
*/

//noinspection JSUnresolvedFunction
//$('.selectpicker').selectpicker();




