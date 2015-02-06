/**
 * Created by ahjung.kim on 12/5/2014.
 */

/*$(".elements-with-tooltips").on('show', function (e) {
 if ('ontouchstart' in document.documentElement) e.preventDefault();
 });*/

/* Disbale tooltip on touch device */
if(!('ontouchstart' in window))
{
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

}

/* Mutually exclusive checkbox */
$('.checkbox').click(function () {
    var checkedState = $(this).attr('checked');
    $(this).parent('div').children('.checkbox:checked').each(function () {
        $(this).attr('checked', false);
    });
    $(this).attr('checked', checkedState);
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

$('li>div .checkbox').click(function () {
    var checkedState = $(this).attr('checked');
    $(this).parent('div').children('.checkbox:checked').each(function () {
        $(this).attr('checked', false);
    });
    $(this).attr('checked', checkedState);
});



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




