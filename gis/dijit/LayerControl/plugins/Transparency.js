/* transparency component */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/query',
    'dojo/dom-style',
    'dijit/PopupMenuItem',
    'dijit/TooltipDialog',
    'dijit/form/HorizontalSlider',
    'dijit/form/HorizontalRuleLabels'
], function (
    declare,
    lang,
    array,
    query,
    domStyle,
    PopupMenuItem,
    TooltipDialog,
    HorizontalSlider,
    HorizontalRuleLabels
) {
    return declare(PopupMenuItem, {
        layer: null,
        constructor: function (options) {
            options = options || {};
            lang.mixin(this, options);
        },
        postCreate: function () {
            this.inherited(arguments);
            var transparencySlider = new HorizontalSlider({
                value: this.layer.opacity,
                minimum: 0,
                maximum: 1,
                discreteValues: 21,
                intermediateChanges: true,
                showButtons: false,
                onChange: lang.hitch(this, function (value) {
                    this.layer.setOpacity(value);
                    array.forEach(query('.' + this.layer.id + '-layerLegendImage'), function (img) {
                        domStyle.set(img, 'opacity', value);
                    });
                })
            });
            var rule = new HorizontalRuleLabels({
                labels: ['100%', '50%', '0%'],
                style: 'height:1em;font-size:75%;'
            }, transparencySlider.bottomDecoration);
            rule.startup();
            transparencySlider.startup();
            this.popup = new TooltipDialog({
                style: 'width:200px;',
                content: transparencySlider
            });
            domStyle.set(this.popup.connectorNode, 'display', 'none');
            this.popup.startup();
        }
    });
});