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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/on',
  'dojo/i18n!../nls/main'
],
function(declare, _WidgetBase, _TemplatedMixin, lang, html, on, mainNls) {
  return declare([_WidgetBase,_TemplatedMixin], {
    baseClass: 'jimu-include-button',
    templateString:'<div><span nowrap style="white-space:nowrap;">${nls.include}</span><div class="include-arrow"></div></div>',

    postMixInProperties:function(){
      this.nls = mainNls.includeButton;
    },

    postCreate: function(){
      this.inherited(arguments);
      this.own(on(this.domNode,'click',lang.hitch(this,function(){
        this.onClick();
      })));
    },

    enable:function(){
      html.addClass(this.domNode,'enable');
    },

    disable:function(){
      html.removeClass(this.domNode,'enable');
    },

    onClick:function(){}

  });
});