///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare',
	"dojo/_base/html",
	'dojo/query',
	'dojo/NodeList',
	'dojo/NodeList-dom',
	'dijit/_WidgetBase',
	'../utils'
], function(declare, html, query, nl, nld, _WidgetBase, utils) {
	return declare(_WidgetBase, {
		baseClass: 'jimu-iframe-pane',
		//border radius
		r: 8,
		color: 'white',

		postCreate: function(){
			if(this.position){
				this.setPosition(this.position);
			}
		},

		startup: function(){
			this.inherited(arguments);
			this._createLayoutTable();
		},

		resize: function(){
			var box = html.getMarginBox(this.domNode), r = this.r;
			this.inherited(arguments);
			query('.tr2', this.domNode).style('height', (box.h - r * 2) + 'px');
			query('.td2', this.domNode).style('width', (box.w - r * 2) + 'px');
			query('.td4', this.domNode).style('height', (box.h - r*2) + 'px');
			query('.td5', this.domNode).style("width", (box.w - r*2) + 'px').style("height", (box.h - r*2) + 'px');
			query('.td6', this.domNode).style('height', (box.h - r*2) + 'px');
			query('.td8', this.domNode).style('width', (box.w - r * 2) + 'px');
		},

		setPosition: function(position) {
      this.position = position;
      var style = utils.getPositionStyle(position);
      style.position = 'absolute';
			style.zIndex = 99;
			style.overflow = 'hidden';
      html.setStyle(this.domNode, style);
    },

		hide: function() {
      html.setStyle(this.domNode, {
        display: 'none'
      });
    },

    show: function() {
      html.setStyle(this.domNode, {
        display: 'block'
      });
    },

		_createLayoutTable: function(){
			var box = html.getMarginBox(this.domNode), tbl, trs = [], tds = [], r = this.r;

			//create table
			tbl = html.create("table", {
				'class': 'jimu-table iframe-float-layout-table',
				style: {
					width: '100%',
					height: '100%',
					display: 'block'
				}
			}, this.domNode);
			trs.push(html.create('tr', {'class': 'tr1', style: {"width": "100%","height": r + 'px'}}, tbl));
			trs.push(html.create('tr', {'class': 'tr2', style: {"width": "100%","height": (box.h - r*2) + 'px'}}, tbl));
			trs.push(html.create('tr', {'class': 'tr3', style: {"width": "100%","height": r + 'px'}}, tbl));

			tds.push(html.create('td', {'class': 'td1', style: {"width": r + 'px',"height": r + 'px'}}, trs[0]));
			tds.push(html.create('td', {'class': 'td2', style: {"width": (box.w - r * 2) + 'px',"height": r + 'px'}}, trs[0]));
			tds.push(html.create('td', {'class': 'td3', style: {"width": r + 'px',"height": r + 'px'}}, trs[0]));

			tds.push(html.create('td', {'class': 'td4', style: {"width": r + 'px',"height": (box.h - r*2) + 'px'}}, trs[1]));
			tds.push(html.create('td', {'class': 'td5', style: {"width": (box.w - r*2) + 'px',"height": (box.h - r*2) + 'px'}}, trs[1]));
			tds.push(html.create('td', {'class': 'td6', style: {"width": r + 'px',"height": (box.h - r*2) + 'px'}}, trs[1]));

			tds.push(html.create('td', {'class': 'td7', style: {"width": r + 'px',"height": r + 'px'}}, trs[2]));
			tds.push(html.create('td', {'class': 'td8', style: {"width": (box.w - r * 2) + 'px',"height": r + 'px'}}, trs[2]));
			tds.push(html.create('td', {'class': 'td9', style: {"width": r + 'px',"height": r + 'px'}}, trs[2]));

			for(var i = 0; i < tds.length; i++){
				html.setStyle(tds[i], 'position', 'relative');
			}
			//create iframe
			this._createRoundCorner(tds[0], 'lt');
			this._createFullIframe(tds[1]);
			this._createRoundCorner(tds[2], 'rt');
			this._createFullIframe(tds[3]);
			this._createFullIframe(tds[4]);
			this._createFullIframe(tds[5]);
			this._createRoundCorner(tds[6], 'lb');
			this._createFullIframe(tds[7]);
			this._createRoundCorner(tds[8], 'rb');
		},

		_createRoundCorner : function(td, position) {
			var i, iframe, r = this.r, w;
			for(i = 1; i <= r; i ++) {
				w = Math.sqrt(r*r - (r - i)*(r - i));
				if(position === 'lt'){
					iframe = this._createLineIframe(r - w, i - 1, w, 1, td);
				}else if(position === 'rt'){
					iframe = this._createLineIframe(0, i -1 , w, 1, td);
				}else if(position === 'lb'){
					iframe = this._createLineIframe(r - w, r - i, w, 1, td);
				}else if(position === 'rb'){
					iframe = this._createLineIframe(0, r - i, w, 1, td);
				}
			}
		},

		_createLineIframe: function(left, top, width, height, td){
			var iframe;
			iframe = html.create('iframe', {
				style: {
					border: 'none',
					position: "absolute",
					background: 'white',
					left: left + 'px',
					top: top + 'px',
					width: width + 'px',
					height: height + 'px',
					backgroundColor: this.color,
					display: 'block'
				}
			}, td);
			return iframe;
		},

		_createFullIframe: function(td){
			var iframe;
			iframe = html.create('iframe', {
				style: {
					border: 'none',
					background: 'white',
					width: '100%',
					height: '100%',
					backgroundColor: this.color,
					display: 'block'
				}
			}, td);
			return iframe;
		}

	});
});

