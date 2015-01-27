define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'esri/dijit/Measurement',
    'dojo/aspect',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/topic'
], function (declare, _WidgetBase, Measurement, aspect, lang, domConstruct, topic) {

    return declare([_WidgetBase], {
        declaredClass: 'gis.dijit.Measurement',
        mapClickMode: null,
        postCreate: function () {
            this.inherited(arguments);
            this.measure = new Measurement({
                map: this.map,
                defaultAreaUnit: this.defaultAreaUnit,
                defaultLengthUnit: this.defaultLengthUnit
            }, domConstruct.create('div')).placeAt(this.domNode);
            this.measure.startup();
            aspect.after(this.measure, 'setTool', lang.hitch(this, 'checkMeasureTool'));
            aspect.after(this.measure, 'closeTool', lang.hitch(this, 'checkMeasureTool'));
            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));
            if (this.parentWidget && this.parentWidget.toggleable) {
                this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                    this.onLayoutChange(this.parentWidget.open);
                })));
            }
        },
        checkMeasureTool: function () {
            // no measurement tool is active
            if (!this.measure.activeTool || this.measure.activeTool === '') {
                if (this.mapClickMode === 'measure') {
                    this.connectMapClick();
                }
                // a measurement tool is active
            } else {
                if (this.mapClickMode !== 'measure') {
                    this.disconnectMapClick();
                }
            }
        },
        disconnectMapClick: function () {
            topic.publish('mapClickMode/setCurrent', 'measure');
        },
        connectMapClick: function () {
            topic.publish('mapClickMode/setDefault');
        },
        onLayoutChange: function (open) {
            // end measurement on close of title pane
            if (!open && this.mapClickMode === 'measure') {
                this.connectMapClick();
            }
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
            if (mode !== 'measure') {
                this.measure.setTool('area', false);
                this.measure.setTool('distance', false);
                this.measure.setTool('location', false);
                this.measure.clearResult();
            }
        }
    });
});