define([
    'dojo/_base/declare',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    './Transparency',
    'dojo/i18n!./../nls/resource'
], function (
    declare,
    Menu,
    MenuItem,
    PopupMenuItem,
    MenuSeparator,
    Transparency,
    i18n
) {
    return declare(Menu, {
        control: null,
        _removed: false, //for future use
        postCreate: function () {
            this.inherited(arguments);
            var control = this.control,
                layer = control.layer,
                controlOptions = control.controlOptions,
                controller = control.controller,
                layerType = control._layerType,
                menu = this;
            //reorder menu items
            if ((layerType === 'vector' && controller.vectorReorder) || (layerType === 'overlay' && controller.overlayReorder)) {
                control._reorderUp = new MenuItem({
                    label: i18n.moveUp,
                    onClick: function () {
                        controller._moveUp(control);
                    }
                });
                menu.addChild(control._reorderUp);
                control._reorderDown = new MenuItem({
                    label: i18n.moveDown,
                    onClick: function () {
                        controller._moveDown(control);
                    }
                });
                menu.addChild(control._reorderDown);
                menu.addChild(new MenuSeparator());
            }
            // toggle all dynamic sublayers
            if (control._dynamicToggleMenuItems) {
                control._dynamicToggleMenuItems(menu);
            }
            //zoom to layer
            if ((controlOptions.noZoom !== true && controller.noZoom !== true) || (controller.noZoom === true && controlOptions.noZoom === false)) {
                menu.addChild(new MenuItem({
                    label: i18n.zoomTo,
                    onClick: function () {
                        controller._zoomToLayer(layer);
                    }
                }));
            }
            //transparency
            if ((controlOptions.noTransparency !== true && controller.noTransparency !== true) || (controller.noTransparency === true && controlOptions.noTransparency === false)) {
                menu.addChild(new Transparency({
                    label: i18n.transparency,
                    layer: layer
                }));
            }
            //layer swipe
            if (controlOptions.swipe === true || (controller.swipe === true && controlOptions.swipe !== false)) {
                var swipeMenu = new Menu();
                swipeMenu.addChild(new MenuItem({
                    label: i18n.layerSwipeVertical,
                    onClick: function () {
                        controller._swipeLayer(layer, 'vertical');
                    }
                }));
                swipeMenu.addChild(new MenuItem({
                    label: i18n.layerSwipeHorizontal,
                    onClick: function () {
                        controller._swipeLayer(layer, 'horizontal');
                    }
                }));
                if (controlOptions.swipeScope === true) {
                    swipeMenu.addChild(new MenuItem({
                        label: i18n.layerSwipeScope,
                        onClick: function () {
                            controller._swipeLayer(layer, 'scope');
                        }
                    }));
                }
                menu.addChild(new PopupMenuItem({
                    label: i18n.layerSwipe,
                    popup: swipeMenu
                }));
            }
            // metadata link
            // service url
            if (controlOptions.metadataUrl === true && layer.url) {
                menu.addChild(new MenuSeparator());
                menu.addChild(new MenuItem({
                    label: i18n.metadata,
                    onClick: function () {
                        window.open(layer.url, '_blank');
                    }
                }));
            }
            // custom url
            if (controlOptions.metadataUrl && typeof controlOptions.metadataUrl === 'string') {
                menu.addChild(new MenuSeparator());
                menu.addChild(new MenuItem({
                    label: i18n.metadata,
                    onClick: function () {
                        window.open(controlOptions.metadataUrl, '_blank');
                    }
                }));
            }
            //if last child is a separator remove it
            var lastChild = menu.getChildren()[menu.getChildren().length - 1];
            if (lastChild && lastChild.isInstanceOf(MenuSeparator)) {
                menu.removeChild(lastChild);
            }
        }
    });
});