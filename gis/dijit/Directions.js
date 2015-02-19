define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'esri/dijit/Directions',
	'dojo/text!./Directions/templates/Directions.html',
	'dojo/_base/lang',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/PopupMenuItem',
	'dijit/MenuSeparator',
	'esri/geometry/Point',
	'esri/SpatialReference',
	'dojo/topic',
	'dojo/i18n!./Directions/nls/resource'
], function (declare, _WidgetBase, _TemplatedMixin, Directions, template, lang, Menu, MenuItem, PopupMenuItem, MenuSeparator, Point, SpatialReference, topic, i18n) {

	return declare([_WidgetBase, _TemplatedMixin], {
		templateString: template,
		i18n: i18n,
		postCreate: function () {
			this.inherited(arguments);
			this.directions = new Directions(lang.mixin({
				map: this.map
			}, this.options), this.directionsNode);
			this.directions.startup();

			if (this.mapRightClickMenu) {
				this.addRightClickMenu();
			}
		},
		addRightClickMenu: function () {
			// capture map right click position
			this.map.on('MouseDown', lang.hitch(this, function (evt) {
				this.mapRightClickPoint = evt.mapPoint;
			}));

			this.menu = new Menu();
			this.menu.addChild(new MenuItem({
				label: this.i18n.labels.directionsFromHere,
				onClick: lang.hitch(this, 'directionsFrom')
			}));
			this.menu.addChild(new MenuItem({
				label: this.i18n.labels.directionsToHere,
				onClick: lang.hitch(this, 'directionsTo')
			}));
			this.menu.addChild(new MenuSeparator());
			this.menu.addChild(new MenuItem({
				label: this.i18n.labels.addStop,
				onClick: lang.hitch(this, 'addStop')
			}));
			this.menu.addChild(new MenuSeparator());
			this.menu.addChild(new MenuItem({
				label: this.i18n.labels.useMyLocationAsStart,
				onClick: lang.hitch(this, 'getGeoLocation', 'directionsFrom')
			}));
			this.menu.addChild(new MenuItem({
				label: this.i18n.labels.useMyLocationAsEnd,
				onClick: lang.hitch(this, 'getGeoLocation', 'directionsTo')
			}));

			// add this widgets menu as a sub menu to the map right click menu
			this.mapRightClickMenu.addChild(new PopupMenuItem({
				label: this.i18n.labels.directions,
				popup: this.menu
			}));
		},
		clearStops: function () {
			this.directions.reset();
		},
		directionsFrom: function () {
			this.directions.updateStop(this.mapRightClickPoint, 0).then(lang.hitch(this, 'doRoute'));
		},
		directionsTo: function () {
			this.directions.updateStop(this.mapRightClickPoint, this.directions.stops.length - 1).then(lang.hitch(this, 'doRoute'));
		},
		addStop: function () {
			this.directions.addStop(this.mapRightClickPoint, this.directions.stops.length - 1).then(lang.hitch(this, 'doRoute'));
		},
		doRoute: function () {
			if (this.parentWidget && !this.parentWidget.open) {
				this.parentWidget.toggle();
			}
			if (this.directions.stops[0] && this.directions.stops[1]) {
				this.directions.getDirections();
			}
		},
		startAtMyLocation: function () {
			this.getGeoLocation('directionsFrom');
		},
		endAtMyLocation: function () {
			this.getGeoLocation('directionsTo');
		},
		getGeoLocation: function (leg) {
			if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(lang.hitch(this, 'locationSuccess', leg), lang.hitch(this, 'locationError'));
			} else {
				topic.publish('growler/growl', {
					title: this.i18n.errors.geoLocation.title,
					message: this.i18n.errors.geoLocation.message,
					level: 'default',
					timeout: 10000,
					opacity: 1.0
				});
			}
		},
		locationSuccess: function (leg, event) {
			this.mapRightClickPoint = new Point(event.coords.longitude, event.coords.latitude, new SpatialReference({
				wkid: 4326
			}));
			this[leg]();
		},
		locationError: function (error) {
			topic.publish('growler/growl', {
				title: this.i18n.errors.location.title,
				message: this.i18n.errors.location.message + error.message,
				level: 'default',
				timeout: 10000,
				opacity: 1.0
			});
		}
	});
});