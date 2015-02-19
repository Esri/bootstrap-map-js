define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_Contained',
    './_Control', // layer control base class
    './../plugins/legendUtil'
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _Contained,
    _Control,
    legendUtil
) {
    var CSVControl = declare([_WidgetBase, _TemplatedMixin, _Contained, _Control], {
        _layerType: 'vector', // constant
        _esriLayerType: 'csv', // constant
        // create and legend
        _layerTypeInit: function () {
            if (legendUtil.isLegend(this.controlOptions.noLegend, this.controller.noLegend)) {
                this._expandClick();
                legendUtil.vectorLegend(this.layer, this.expandNode);
            } else {
                this._expandRemove();
            }
        }
    });
    return CSVControl;
});