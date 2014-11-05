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
  'dojo/_base/array',
  'dojo/on',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dijit/registry'
],
function(declare, _WidgetBase, lang, array, on, domClass, domConstruct, registry) {
  return declare(_WidgetBase, {
    'class': 'jimu-radio',

    checked: false,
    group: null,

    constructor: function(){
    },
    postCreate: function(){
      domConstruct.create('div', {
        'class': 'jimu-radio-inner'
      }, this.domNode);
      if(this.checked){
        domClass.add(this.domNode, 'jimu-radio-checked');
      }
      this.own(
        on(this.domNode, 'click', lang.hitch(this, function(){
          if(!this.checked){
            this.check();
          }
        }))
      );
    },

    check: function(changeOthersState){
      if(changeOthersState === undefined){
        changeOthersState = true;
      }
      this.checked = true;
      domClass.add(this.domNode, 'jimu-radio-checked');
      if(changeOthersState){
        this._changeOthersState(false);
      }
      this.onStateChange();
    },

    uncheck: function(changeOthersState){
      if(changeOthersState === undefined){
        changeOthersState = true;
      }
      this.checked = false;
      domClass.remove(this.domNode, 'jimu-radio-checked');
      if(changeOthersState){
        this._changeOthersState(false);
      }
      this.onStateChange();
    },

    _changeOthersState: function(state){
      if(this.group === null){
        return;
      }
      array.forEach(registry.toArray(), function(dijit){
        if(dijit.id !== this.id && dijit['class'] === this['class'] && dijit.group === this.group){
          if(state){
            dijit.check(false);
          }else{
            dijit.uncheck(false);
          }
        }
      }, this);
    },

    onStateChange: function(){

    }
  });
});