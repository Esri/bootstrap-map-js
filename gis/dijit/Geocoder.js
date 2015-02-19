// adapted from https://github.com/esri/arcgis-dijit-geocoder-button-js/
define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/a11yclick',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom-class',
    'dojo/dom-style',
    'esri/dijit/Geocoder',
    'dijit/MenuItem',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/graphic',
    'esri/InfoTemplate',
    'esri/layers/GraphicsLayer',
    'dojo/text!./Geocoder/templates/Geocoder.html',
    'dojo/i18n!./Geocoder/nls/resource',

    'xstyle/css!./Geocoder/css/Geocoder.css'
], function (declare, _WidgetBase, _TemplatedMixin, a11yclick, lang, on, domClass, domStyle, Geocoder, MenuItem, SimpleMarkerSymbol, Graphic, InfoTemplate, GraphicsLayer, template, i18n) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        baseClass: 'gis_GeocoderDijit',
        expanded: true,
        collapsible: false,
        geocoderOptions: {
            autoComplete: true
        },
        reverseGeocodeTemplate: [
            '<table class="attrTable">',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.address}</td>', '<td class="attrValue">${Address}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.neighborhood}</td>', '<td class="attrValue">${Neighborhood}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.city}</td>', '<td class="attrValue">${City}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.subregion}</td>', '<td class="attrValue">${SubRegion}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.region}</td>', '<td class="attrValue">${Region}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.postalCode}</td>', '<td class="attrValue">${Postal}&nbsp;${PostalExt}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.countryCode}</td>', '<td class="attrValue">${CountryCode}</td>', '</tr>',
            '<tr valign="top">', '<td class="attrName">${i18n.labels.locatorName}</td>', '<td class="attrValue">${Loc_name}</td>', '</tr>',
            '</table>'
        ].join(''),

        postCreate: function () {
            this.inherited(arguments);
            var options = lang.mixin({}, this.geocoderOptions, {
                map: this.map
            });
            this.geocoder = new Geocoder(options, this.geocoderNode);

            on(this.geocoder, 'select', lang.hitch(this, function (e) {
                if (e.result) {
                    this.show();
                }
            }));

            if (this.collapsible) {
                on(this.map, 'pan-start', lang.hitch(this, function () {
                    this.hide();
                }));
                this.own(
                    on(this.searchNode, a11yclick, lang.hitch(this, this.toggle))
                );
            } else {
                this.expanded = true;
            }
            this.geocoder.startup();
            if (this.expanded === true) {
                this.show();
            } else {
                this.hide();
            }
            if (this.mapRightClickMenu) {
                this.addRightClickMenu();
            }
        },
        addRightClickMenu: function () {
            this.map.on('MouseDown', lang.hitch(this, function (evt) {
                this.mapRightClickPoint = evt.mapPoint;
            }));
            this.mapRightClickMenu.addChild(new MenuItem({
                label: this.i18n.labels.getAddressHere,
                onClick: lang.hitch(this, 'reverseGeocode')
            }));
            this.symbol = new SimpleMarkerSymbol();
            this.infoTemplate = new InfoTemplate('Location', this.reverseGeocodeTemplate);
            this.graphics = new GraphicsLayer({
                id: 'reverseGeocode'
            });
            this.map.addLayer(this.graphics);
        },
        toggle: function () {
            var display = domStyle.get(this.searchContainerNode, 'display');
            if (display === 'block') {
                this.hide();
            } else {
                this.show();
            }
        },
        hide: function () {
            domStyle.set(this.searchContainerNode, 'display', 'none');
            domClass.remove(this.containerNode, 'open');
            if (this.geocoder) {
                this.geocoder.blur();
            }
        },
        show: function () {
            domStyle.set(this.searchContainerNode, 'display', 'block');
            domClass.add(this.containerNode, 'open');
            if (this.geocoder && !this.expanded) {
                this.geocoder.focus();
            }
        },
        reverseGeocode: function () {
            this.geocoder._task.locationToAddress(this.mapRightClickPoint, 1000, lang.hitch(this, 'reverseGeocodeComplete'));
        },
        reverseGeocodeComplete: function (res) {
            var graphic = new Graphic(res.location, this.symbol, res.address, this.infoTemplate);
            this.graphics.add(graphic);

            this.map.infoWindow.clearFeatures();
            this.map.infoWindow.setTitle(graphic.getTitle());
            this.map.infoWindow.setContent(graphic.getContent());

            var screenPnt = this.map.toScreen(res.location);
            this.map.infoWindow.show(screenPnt, this.map.getInfoWindowAnchor(screenPnt));
            on.once(this.map.infoWindow, 'hide', lang.hitch(this, function () {
                this.graphics.clear();
            }));
        }
    });
});