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
  'dojo/text!./templates/ImageChooser.html',
  'dojo/sniff',
  '../utils',
  'jimu/dijit/Message'
],
function(declare, _WidgetBase, _TemplatedMixin, lang, html, on, template, has, utils, Message) {
  //summary:
  //  popup the image file chooser dialog, when choose an image file,
  //  display the image file and return the image's base64 code
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,
    displayImg: null,
    displayCss: null,


    postCreate: function(){
      this._setupPosition();
      this._setupFileInput();
    },

    _setupPosition: function(){
      if (this.displayClass){
        html.addClass(this.domNode, this.displayCss);
      }
      html.setStyle(this.domNode, {
        'opacity': 0,
        'visibility': 'visible',
        'float': 'left',
        'zIndex': 9999,
        'overflow': 'hidden',
        'position': 'absolute'
      });
      html.setStyle(this.fileInput, {
        'width': '100%',
        'height': '100%',
        'cursor': 'pointer'
      });
    },

    _setupFileInput: function(){
      this.own(on(this.fileInput, 'change', lang.hitch(this, function(evt){
        if(!utils.file.supportHTML5() && !utils.file.supportFileAPI()){
          alert('TODO: not suport file reader API');
          return;
        }
        utils.file.readFile(evt, 'image/*', 1048576, lang.hitch(this, function(err, fileName, fileData){
          if (err){
            new Message({
              message: err
            });
            return;
          }
          this.onImageChange(fileData);
          if(this.displayImg){
            html.setAttr(this.displayImg, 'src', fileData);
          }
        }));
      })));
    },

    onImageChange: function(fileData){
      /*jshint unused:false*/
    }

  });
});