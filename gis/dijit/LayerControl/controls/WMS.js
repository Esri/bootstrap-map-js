define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_Contained',
    './_Control' // layer control base class
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _Contained,
    _Control
) {
    var WMSControl = declare([_WidgetBase, _TemplatedMixin, _Contained, _Control], {
        _layerType: 'overlay', // constant
        _esriLayerType: 'wms', // constant
        _layerTypeInit: function () {
            this._expandRemove();
        }
    });
    return WMSControl;
});