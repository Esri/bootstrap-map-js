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

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/on',
  'dojo/mouse',
  'dojo/query'
],
function (declare, lang, html, _WidgetBase, _TemplatedMixin, on, mouse, query) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div class="jimu-img-node"></div>',
    /**
    *options:
    *img: the img url,
    *label:
    *width/height/marginTop/marginLeft: can be px or %
    **/
    constructor: function(options, dom){
      /*jshint unused: false*/
    },
    postCreate: function () {
      this.box = html.create('div', {
        'class': 'node-box'
      }, this.domNode);
      html.create('img', {
        'src': this.img
      }, this.box);
      html.create('div', {
        'class': 'node-label',
        'innerHTML': this.label,
        title: this.label
      }, this.domNode);

      this.own(on(this.domNode, 'click', lang.hitch(this, this.onClick)));
    },

    onClick: function(){
      query('.jimu-img-node', this.getParent().domNode).removeClass('jimu-state-selected');
      query(this.domNode).addClass('jimu-state-selected');
    },

    highLight: function(){
      query('.jimu-img-node', this.getParent().domNode).removeClass('jimu-state-selected');
      query(this.domNode).addClass('jimu-state-selected');
    },

    startup: function(){

    }

  });
});