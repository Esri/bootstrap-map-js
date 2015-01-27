define([
	'dojo/_base/declare',
	'dijit/Dialog'
], function (declare, Dialog) {
	return declare([Dialog], {
		declaredClass: 'gis.dijit.FloatingWidget',
		title: 'Floating Widget',
		draggable: true,
		'class': 'floatingWidget',
		close: function () {
			this.hide();
		},
		focus: function () {}
	});
});