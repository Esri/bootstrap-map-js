/**
 * Created by ahjung.kim on 12/5/2014.
 */

/*$(".elements-with-tooltips").on('show', function (e) {
 if ('ontouchstart' in document.documentElement) e.preventDefault();
 });*/

/*
    Activate tool tip
* */
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});


/*
    Query icon opens zoom-to-sel panel
*/

var accordion = $("#accordion");
var accordionClose = $("#accordion-close");
var queryIcon = $("#query-icon");

queryIcon.on("click", function () {
    accordion.show();
});

accordionClose.on("click", function () {
    accordion.hide();
});

/*  */






//noinspection JSUnresolvedFunction
$('.selectpicker').selectpicker();




