/**
 * Created by ahjung.kim on 12/5/2014.
 */

/*$(".elements-with-tooltips").on('show', function (e) {
    if ('ontouchstart' in document.documentElement) e.preventDefault();
});*/



$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});




var accordion = $("#accordion");
var accordionClose = $("#accordion-close");
var queryIcon = $("#query-icon");

queryIcon.on("click", function (){
        accordion.show();
});

accordionClose.on("click", function () {
    accordion.hide();
});

//noinspection JSUnresolvedFunction
$('.selectpicker').selectpicker();




