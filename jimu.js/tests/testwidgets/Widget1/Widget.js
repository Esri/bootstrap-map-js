define(['dojo/_base/declare', 'jimu/BaseWidget'],
  function(declare, BaseWidget){
  return declare([BaseWidget], {
    templateString: '<div></div>',
    baseClass: 'jimu-widget-testwidget1',
    name: 'test-widget1'
  });
});