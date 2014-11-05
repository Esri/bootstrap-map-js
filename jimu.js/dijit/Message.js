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
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/query',
    'dojo/keys',
    'jimu/dijit/Popup'
  ],
  function(declare, lang, html, query, keys, Popup) {
    return declare(Popup, {
      //summary:
      //  show a popup message

      baseClass: 'jimu-popup jimu-message',

      //type: String
      //  the popup messge type, can be: message/question/error
      type: 'message',

      //type:String    
      message: '',

      autoHeight: true,

      maxWidth: 350,
      maxHeight: 180,

      postMixInProperties: function() {
        this.content = this.message;
      },

      _preProcessing: function() {
        if (this.buttons.length === 0) {
          this.buttons.push({
            label: 'OK',
            key: keys.ENTER,
            onClick: lang.hitch(this, this.close)
          });
        }
      },

      _increaseZIndex: function() {
        html.setStyle(this.domNode, 'zIndex', 9999);
        html.setStyle(this.overlayNode, 'zIndex', 9998);
      }
    });
  });