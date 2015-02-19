/*
 * show mouse coords, scale and zoom
 */
define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/_base/lang',
    'dojo/html',
    'dojo/dom-style',
    'dojo/number',
    'dojo/topic',
    '//cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4.js',
    'xstyle/css!./MapInfo/css/MapInfo.css'
], function (
    declare,
    WidgetBase,
    TemplatedMixin,
    lang,
    html,
    style,
    number,
    topic,
    proj4
) {
    'use strict';
    return declare([WidgetBase, TemplatedMixin], {
        map: null,
        mode: 'map',
        firstCoord: 'x',
        unitScale: 2,
        showScale: false,
        showZoom: false,
        xLabel: 'X:',
        yLabel: 'Y:',
        scaleLabel: '1:',
        zoomLabel: 'Z:',
        minWidth: 0,
        proj4Catalog: null,
        proj4Wkid: null,
        proj4CustomURL: null,
        //0 = Web Mercator as grid
        //1 = Web Mercator as dec or DMS
        //2 = geographic as dec (grid) or DMS
        //3 = grid unprojected
        //4 = grid projected as dec or DMS
        _mode: 0,
        _projection: null,
        _projectionLoaded: false,
        constructor: function (options) {
            declare.safeMixin(this, options || {});
            //template
            var ts = '<div class="gis-dijit-MapInfo">';
            if (this.showScale) {
                ts += '${scaleLabel}<span data-dojo-attach-point="scaleNode"></span>&nbsp;&nbsp;';
            }
            if (this.showZoom) {
                ts += '${zoomLabel}<span data-dojo-attach-point="zoomNode"></span>&nbsp;&nbsp;';
            }
            var fc = this.firstCoord;
            if (fc === 'x') {
                ts += '${xLabel}<span data-dojo-attach-point="xNode"></span>&nbsp;&nbsp;${yLabel}<span data-dojo-attach-point="yNode"></span>';
            } else if (fc === 'y') {
                ts += '${yLabel}<span data-dojo-attach-point="yNode"></span>&nbsp;&nbsp;${xLabel}<span data-dojo-attach-point="xNode"></span>';
            } else {
                this.firstCoord = 'x';
                ts += '${xLabel}<span data-dojo-attach-point="xNode"></span>&nbsp;&nbsp;${yLabel}<span data-dojo-attach-point="yNode"></span>';
            }
            ts += '</div>';
            this.templateString = ts;
        },
        postCreate: function () {
            var map = this.map;
            if (!map) {
                topic.publish('viewer/handleError', {
                    source: 'MapInfo',
                    error: 'A map reference is required'
                });
                this.destroy();
                return;
            }
            //initialize when map loaded
            if (map.loaded) {
                this._initialize(map);
            } else {
                map.on('load', lang.hitch(this, '_initialize', map));
            }
        },
        _initialize: function (map) {
            var wkid = map.spatialReference.wkid,
                mode = this.mode;
            if (wkid === 102100 && mode !== 'dec' && mode !== 'dms') {
                this._mode = 0; //assume wm grid
            } else if (wkid === 102100) {
                this._mode = 1; //assume wm and proj to geo
            } else if (wkid === 4326) {
                this._mode = 2;
            } else if (mode !== 'dec' && mode !== 'dms') {
                this._mode = 3;
            } else {
                this._mode = 4;
                // spatialreference.org uses the old
                // Proj4js style so we need an alias
                // https://github.com/proj4js/proj4js/issues/23
                window.Proj4js = proj4;
                //load custom projection file or default to spatialreference.org
                if (!this.proj4Catalog && !this.proj4Wkid && !this.proj4CustomURL) {
                    topic.publish('viewer/handleError', {
                        source: 'MapInfo',
                        error: 'MapInfo error::a proj4Catalog/proj4Wkid or custom URL must be defined'
                    });
                    return;
                }
                if (this.proj4CustomURL) {
                    require([this.proj4CustomURL], lang.hitch(this, function () {
                        this._projectionLoaded = true;
                        this._projection = this.proj4Catalog + ':' + this.proj4Wkid;
                    }));
                } else {
                    require(['http://spatialreference.org/ref/' + this.proj4Catalog.toLowerCase() + '/' + this.proj4Wkid + '/proj4js/'], lang.hitch(this, function () {
                        this._projectionLoaded = true;
                        this._projection = this.proj4Catalog + ':' + this.proj4Wkid;
                    }));
                }
            }
            if (this.minWidth) {
                style.set(this.domNode, 'minWidth', this.minWidth + 'px');
            }
            if (this.showScale) {
                this._setScale();
                map.on('zoom-end', lang.hitch(this, '_setScale'));
            }
            if (this.showZoom) {
                this._setZoom();
                map.on('zoom-end', lang.hitch(this, '_setZoom'));
            }
            map.on('mouse-move, mouse-drag', lang.hitch(this, '_setCoords'));
        },
        _setCoords: function (evt) {
            var pnt = evt.mapPoint,
                mode = this.mode,
                scale = this.unitScale;
            switch (this._mode) {
            case 0:
            case 3:
                this._xCoord(number.round(pnt.x, scale));
                this._yCoord(number.round(pnt.y, scale));
                break;
            case 1:
                if (mode === 'dms') {
                    this._xCoord(this._decToDMS(pnt.getLongitude(), 'x'));
                    this._yCoord(this._decToDMS(pnt.getLatitude(), 'y'));
                } else {
                    this._xCoord(number.round(pnt.getLongitude(), scale));
                    this._yCoord(number.round(pnt.getLatitude(), scale));
                }
                break;
            case 2:
                if (mode === 'dms') {
                    this._xCoord(this._decToDMS(pnt.x, 'x'));
                    this._yCoord(this._decToDMS(pnt.y, 'y'));
                } else {
                    this._xCoord(number.round(pnt.x, scale));
                    this._yCoord(number.round(pnt.y, scale));
                }
                break;
            case 4:
                if (this._projectionLoaded) {
                    this._project(pnt);
                }
                break;
            }
        },
        _project: function (pnt) {
            var projPnt = proj4(proj4.defs[this._projection]).inverse([pnt.x, pnt.y]);
            if (this.mode === 'dms') {
                this._xCoord(this._decToDMS(projPnt[0], 'x'));
                this._yCoord(this._decToDMS(projPnt[1], 'y'));
            } else {
                this._xCoord(number.round(projPnt[0], this.unitScale));
                this._yCoord(number.round(projPnt[1], this.unitScale));
            }
        },
        _setScale: function () {
            html.set(this.scaleNode, String(number.format(number.round(this.map.getScale(), 0))));
        },
        _setZoom: function () {
            html.set(this.zoomNode, String(this.map.getLevel()));
        },
        _xCoord: function (value) {
            html.set(this.xNode, String(value));
        },
        _yCoord: function (value) {
            html.set(this.yNode, String(value));
        },
        _decToDMS: function (l, type) {
            var dir = '?',
                abs = Math.abs(l),
                deg = parseInt(abs, 10),
                min = (abs - deg) * 60,
                minInt = parseInt(min, 10),
                sec = number.round((min - minInt) * 60, this.unitScale),
                minIntTxt = (minInt < 10) ? '0' + minInt : minInt,
                secTxt = (sec < 10) ? '0' + sec : sec;
            if (type === 'lat' || type === 'y') {
                dir = (l > 0) ? 'N' : 'S';
            }
            if (type === 'lng' || type === 'x') {
                dir = (l > 0) ? 'E' : 'W';
            }
            return deg + '&deg;' + minIntTxt + '\'' + secTxt + '"&nbsp;' + dir;
        }
    });
});