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
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/on',
    'dijit/TooltipDialog',
    'dijit/popup',
    'jimu/dijit/SymbolChooser',
    'jimu/symbolUtils'
  ],
  function(declare, _WidgetBase, _TemplatedMixin, Evented, lang, html, on, TooltipDialog,
    dojoPopup, SymbolChooser, jimuSymUtils) {
    return declare([_WidgetBase, _TemplatedMixin, Evented], {
      baseClass: 'jimu-symbol-picker',
      declaredClass: 'jimu.dijit.SymbolPicker',
      templateString: '<div></div>',

      //options:
      //you must set symbol or type
      symbol: null, //optional
      type: null, //optional, available values:marker,line,fill,text

      //public methods:
      //reset
      //showBySymbol
      //showByType
      //getSymbol

      //events:
      //change

      postCreate: function() {
        this.inherited(arguments);
        this._createTooltipDialog(this.domNode);
        var symbol = this.symbolChooser.getSymbol();
        if(symbol){
          this._drawSymbol(symbol);
        }
      },

      destroy: function(){
        if(this.symbolChooser){
          this.symbolChooser.destroy();
        }
        this.symbolChooser = null;
        this.inherited(arguments);
      },

      _createTooltipDialog: function(dom) {
        var ttdContent = html.create("div");
        var myTooltipDialog = new TooltipDialog({
          // style: "width: 250px;cursor:pointer",
          content: ttdContent
        });

        this.symbolChooser = new SymbolChooser({
          symbol: this.symbol,
          type: this.type
        });

        this.symbolChooser.placeAt(ttdContent);
        this.symbolChooser.startup();

        this.own(on(this.symbolChooser, 'change', lang.hitch(this, function(newSymbol){
          this._drawSymbol(newSymbol);
          this.emit('change', newSymbol);
        })));

        this.own(on(dom, 'click', lang.hitch(this, function(event){
          event.stopPropagation();
          event.preventDefault();
          
          dojoPopup.open({
            parent: this.getParent(),
            popup: myTooltipDialog,
            around: dom
          });
        })));

        this.own(on(window, 'click', lang.hitch(this, function(event){
          var target = event.target || event.srcElement;
          var node = myTooltipDialog.domNode;
          var isInternal = target === node || html.isDescendant(target, node);
          if(!isInternal){
            dojoPopup.close(myTooltipDialog);
          }
        })));

        return myTooltipDialog;
      },

      reset: function(){
        this.type = null;
        this.symbol = null;
        html.empty(this.domNode);
        this.symbolChooser.reset();
      },

      showBySymbol: function(symbol){
        this.reset();
        if(symbol){
          this._drawSymbol(symbol);
          this.symbolChooser.showBySymbol(symbol);
        }
      },

      showByType: function(type){
        this.reset();
        this.symbolChooser.showByType(type);
        var symbol = this.symbolChooser.getSymbol();
        if (symbol) {
          this._drawSymbol(symbol);
        }
      },

      getSymbol: function(){
        return this.symbolChooser.getSymbol();
      },

      _drawSymbol: function(symbol) {
        html.empty(this.domNode);
        if (symbol) {
          var symbolNode = jimuSymUtils.createSymbolNode(symbol);
          if (symbolNode) {
            html.place(symbolNode, this.domNode);
          }
        }
      }

    });
  });