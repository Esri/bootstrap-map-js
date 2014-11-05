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
  'dijit/form/ValidationTextBox',
  'dojox/validate/regexp',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/i18n'],
function(declare, ValidationTextBox, regexp, array, lang, i18n) {
  return declare([ValidationTextBox], {
    required:true,
    invalidMessage:"Invalid url.",
    trim: true,
    rest:true,

    postMixInProperties:function(){
      this.inherited(arguments);
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.urlInput;
      this.invalidMessage = this.nls.invalidUrl;
    },

    validator:function(value){
      var strReg = '^' + regexp.url();
      var reg = new RegExp(strReg,'g');
      var b1 = reg.test(value);

      if(this.rest){
        var p2 = /\/rest\/services/gi;
        var b2 = p2.test(value);
        return b1 && b2;
      }
      else{
        return b1;
      }

    }
  });
});