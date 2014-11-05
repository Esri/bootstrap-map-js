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
  'dojo/_base/lang',
  'dojo/on',
  'dojo/dom-class'
],
function(declare, _WidgetBase, lang, on, domClass) {
  return declare(_WidgetBase, {
    'baseClass': 'jimu-selection-box',

    selected: false,

    postCreate: function(){
      if(this.selected){
        domClass.add(this.domNode, 'jimu-selection-box-selected');
      }
      this.own(
        on(this.domNode, 'click', lang.hitch(this, function(){
          if(this.selected){
            this.unSelect();
          }else{
            this.select();
          }
        }))
      );
    },

    select: function(){
      this.selected = true;
      domClass.add(this.domNode, 'jimu-selection-box-selected');
      this.onStateChange();
    },

    unSelect: function(){
      this.selected = false;
      domClass.remove(this.domNode, 'jimu-selection-box-selected');
      this.onStateChange();
    },

    onStateChange: function(){

    }
  });
});