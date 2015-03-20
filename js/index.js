/* Controls for non-map-related buttons */


$( document ).ready(function() {
  // Enable select picker
  $('.selectpicker').selectpicker();
  // Disable to
  if(!('ontouchstart' in window)){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  //Mutually exclusive checkbox for basemap selection
  $('.checkbox').click(function () {
    var checkedState = $(this).attr('checked');
    $(this).parent('div').children('.checkbox:checked').each(function(){
      $(this).attr('checked', false);
    });
    $(this).attr('checked', checkedState);
  });

  /*Panel open close*/
  PanelToggle("#accordion", "#find-icon");
  PanelToggle("#layers-list", "#layers-icon");
  PanelToggle("#tool-accordion","#kytc-tools-icon");

  function PanelToggle (objectId,btnId){
    var object = $(objectId);
    //var closeBtn = $(closeBtnId);
    var btn = $(btnId);

    btn.on("click", function(){
      object.show(0,onPanelShow);
      object.css("z-index","1000");
      object.siblings().css("z-index","50");
    });

    // Close(x) button closes all left panel
    $(".close").on("click", function(){
      $(".kytc-left-panel").hide(0, onPanelHide())
    });
  }

  function onPanelShow(){
    $(".map-tools-left").css("margin-left","300px");
    //$("#mapDiv").css("padding-left","200px");
  }

  // When panel is closed, no left button is active
  function onPanelHide(){
    $(".map-tools-left").css("margin-left","0");
    $(".map-tools-left.active").removeClass("active");
    //$("#mapDiv").css("padding-left","0");
  }

// Only one tool is active in a group
  $(".map-tools-left").click(function () {
    $('.map-tools-left.active').removeClass('active');
    // add active class to clicked element
    $(this).addClass('active');
  });
});
