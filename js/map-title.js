/**
 * Created by ahjung.kim on 11/26/2014.
 *//*

*/
/*Title disappear when mouse is inactive*//*

var timedelay = 1;
function delayCheck()
{
    if(timedelay == 5)
    {
        $('#title-bar').fadeOut();
        timedelay = 1;
    }
    timedelay = timedelay+1;
}

$(document).mousemove(function() {
    $('#title-bar').fadeIn();
    timedelay = 1;
    clearInterval(_delay);
    _delay = setInterval(delayCheck, 500);
});
// page loads starts delay timer
_delay = setInterval(delayCheck, 500)

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});*/
