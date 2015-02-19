define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/_base/lang',
    'dojo/dom-style',
    'dojo/dom-construct',
    'dojo/_base/fx',
    'dojo/dom-class',
    'dojo/topic',
    'xstyle/css!./Growler/css/Growler.css'
], function (declare, _WidgetBase, _TemplatedMixin, lang, Style, domConstruct, fx, domClass, topic) {

    // main growler dijit container
    var Growler = declare([_WidgetBase, _TemplatedMixin], {
        templateString: '<div class="gis-dijit-Growl" data-dojo-attach-point="containerNode"></div>',
        postCreate: function () {
            this.inherited(arguments);
            this.own(topic.subscribe('growler/growl', lang.hitch(this, 'growl')));
        },
        growl: function (props) {
            props = props || {};
            lang.mixin(props, {
                _container: this.containerNode
            });
            var g = new Growl(props);
            g.startup();
        }
    });

    // the growl itself
    var Growl = declare([_WidgetBase, _TemplatedMixin], {
        templateString: '<div class="growl ${level}" data-dojo-attach-event="onmouseover:hoverOver,onmouseout:hoverOut,onclick:close"><h3>${title}</h3>${message}</div>',
        title: 'Title',
        message: 'Message',
        level: 'default',
        timeout: 10000,
        opacity: 1.0,
        _container: null,
        _timer: null,
        postCreate: function () {
            this.inherited(arguments);
            if (this._container) {
                Style.set(this.domNode, 'opacity', 0);
                domConstruct.place(this.domNode, this._container);
                fx.anim(this.domNode, {
                    opacity: this.opacity
                }, 250);
                this.setTimeout();
            } else {
                topic.publish('viewer/handleError', {
                    source: 'Growler',
                    error: 'Growl container not found/specified.'
                });
            }
        },
        setTimeout: function () {
            if (this.timeout > 0) {
                this._timer = setTimeout(lang.hitch(this, 'close'), this.timeout);
            }
        },
        hoverOver: function () {
            clearInterval(this._timer);
            domClass.add(this.domNode, 'hover');
        },
        hoverOut: function () {
            if (this.timeout > 0) {
                this.setTimeout();
            }
            domClass.remove(this.domNode, 'hover');
        },
        close: function () {
            fx.anim(this.domNode, {
                opacity: 0
            }, 500, null, lang.hitch(this, 'remove'));
        },
        remove: function () {
            fx.anim(this.domNode, {
                height: 0,
                margin: 0
            }, 250, null, lang.partial(domConstruct.destroy, this.domNode));
        }
    });
    return Growler;
});