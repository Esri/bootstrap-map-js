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
  'dojo/_base/html',
  'dojo/on',
  'dojo/string'
],
function(declare, _WidgetBase, lang, html, on, string) {
  //summary:
  //  when double click the div, show a input to edit the div.
  //  after the input lose focus, update the div's content
  return declare(_WidgetBase, {
    'class': 'jimu-editable-div',

    postCreate: function(){
      var zIndex = html.getStyle(this.domNode, 'z-index');
      if(!zIndex){
        zIndex = 0;
      }else{
        zIndex = parseInt(zIndex, 10);
      }
      if(!this.value){
        this.value = this.domNode.innerHTML;
      }else{
        this.domNode.innerHTML = this.value;
      }

      this.own(on(this.domNode, 'dblclick', lang.hitch(this, function(){
        var inputNode = html.create('input', {
          style: 'position: absolute;z-index: ' + (zIndex + 1),
          'class': 'jimu-input',
          value: this.value
        }, this.domNode.parentNode),
        cs = html.getComputedStyle(this.domNode),
        mbox = html.getMarginBox(this.domNode, cs),
        mext = html.getMarginExtents(this.domNode, cs);

        html.setStyle(inputNode, {
          left: (mbox.l + mext.l) + 'px',
          top: (mbox.t + 3) + 'px',
          width: (mbox.w - mext.l) + 'px',
          height: (mbox.h - mext.t) + 'px'
        });
        inputNode.focus();
        inputNode.select();
        this.own(on(inputNode, 'blur', lang.hitch(this, function(){
          this.updateDiv(inputNode.value);
          html.destroy(inputNode);
        })));

        this.own(on(inputNode, 'keydown', lang.hitch(this, function(evt){
          var keyNum = evt.keyCode !== undefined ? evt.keyCode : evt.which;
          if (keyNum === 13) {
            this.updateDiv(inputNode.value);
            html.destroy(inputNode);
          }
          
        })));
      })));
    },

    updateDiv: function(value){
      if(value !== this.value && string.trim(value).length !== 0){
        this.domNode.innerHTML = value;
        this.value = value;
        this.onChange(this.value);
      }
    },

    onChange: function(value){
      /*jshint unused:false*/
    }

  });
});