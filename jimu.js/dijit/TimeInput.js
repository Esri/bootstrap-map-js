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
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/on',
  'dijit/_WidgetBase',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/dom-attr',
  '../utils'
],

function(declare, array, lang, on, _WidgetBase, domConstruct, domClass, domAttr, utils) {
  return declare(_WidgetBase, {
    baseClass: 'jimu-timeinput',
    time: 0,
    step: 1000,
    disabled: false,

    postCreate: function() {
      this.inherited(arguments);
      this.subNode = domConstruct.create('div', {
        'class': 'sub-btn'
      }, this.domNode);
      this.timeInputNode = domConstruct.create('input', {
        'class': 'time-input',
        value: utils.formatTime(this.time)
      }, this.domNode);
      this.addNode = domConstruct.create('div', {
        'class': 'add-btn'
      }, this.domNode);

      this.own(on(this.subNode, 'click', lang.hitch(this, function() {
        if(this.disabled){
          return;
        }
        var t = this.time;
        t -= this.step;
        if(t <= 0){
          t = 0;
        }
        this.setTime(t);
      })));
      this.own(on(this.addNode, 'click', lang.hitch(this, function() {
        if(this.disabled){
          return;
        }
        var t = this.time;
        t += this.step;
        this.setTime(t);
      })));
      // on(this.subNode, 'mousedown', lang.hitch(this, function() {
      //   if(this.disabled){
      //     return;
      //   }
      //   domClass.add(this.timeInputNode, 'focus');
      //   domClass.add(this.subNode, 'jimu-state-active');        
      // }));
      // on(this.subNode, 'mouseup', lang.hitch(this, function() {
      //   if(this.disabled){
      //     return;
      //   }
      //   domClass.remove(this.timeInputNode, 'focus');
      //   domClass.remove(this.subNode, 'jimu-state-active');
      // }));
      // on(this.addNode, 'mousedown', lang.hitch(this, function() {
      //   if(this.disabled){
      //     return;
      //   }
      //   domClass.add(this.timeInputNode, 'focus');
      //   domClass.add(this.addNode, 'jimu-state-active');
      // }));
      // on(this.addNode, 'mouseup', lang.hitch(this, function() {
      //   if(this.disabled){
      //     return;
      //   }
      //   domClass.remove(this.timeInputNode, 'focus');
      //   domClass.remove(this.addNode, 'jimu-state-active');
      // }));
      this.own(on(this.timeInputNode, 'change', lang.hitch(this, function() {
        var t = utils.parseTime(this.timeInputNode.value);
        if(t > 0){
          this.setTime(t);
        }else{
          this.timeInputNode.focus();
          domClass.add(this.timeInputNode, 'focus');
        }
      })));
      this.own(on(this.timeInputNode, 'focus', lang.hitch(this, function() {
        domClass.add(this.timeInputNode, 'focus');
      })));
      this.own(on(this.timeInputNode, 'blur', lang.hitch(this, function() {
        var t = utils.parseTime(this.timeInputNode.value);
        if(t < 0){
          this.timeInputNode.focus();
          return;
        }
        domClass.remove(this.timeInputNode, 'focus');
      })));
    },

    setTime: function(time, triggerEvent){
      if(triggerEvent === undefined){
        triggerEvent = true;
      }
      this.time = time;
      this.updateInputNode();
      if(triggerEvent){
        this.timeChange(time);
      }
    },

    disable: function(){
      this.disabled = true;
      domAttr.set(this.timeInputNode, 'disabled', true);
    },

    enable: function(){
      this.disabled = false;
      domAttr.remove(this.timeInputNode, 'disabled');
    },

    timeChange: function(time){
      /*jshint unused:false*/
    },

    updateInputNode: function(){
      this.timeInputNode.value = utils.formatTime(this.time);
    }

  });
});