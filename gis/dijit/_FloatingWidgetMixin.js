define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/_base/lang'
], function (declare, on, lang) {
	return declare(null, {
		startup: function () {
			// var parentWidget = this.getParent();
			if (this.parentWidget && this.parentWidget.declaredClass === 'gis.dijit.FloatingWidget' && this.onOpen) {
				on(this.parentWidget, 'show', lang.hitch(this, 'onOpen'));
			}
			if (this.parentWidget && this.parentWidget.declaredClass === 'gis.dijit.FloatingWidget' && this.onClose) {
				on(this.parentWidget, 'hide', lang.hitch(this, 'onClose'));
			}
			if (this.parentWidget && this.parentWidget.declaredClass === 'gis.dijit.FloatingWidget' && this.openOnStartup) {
				this.parentWidget.show();
			}

			this.inherited(arguments);
		}
	});
});