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
  'dojo/_base/array',
  'dijit/_WidgetBase'
],

function(declare, lang, html, array, _WidgetBase) {
  return declare(_WidgetBase, {
    // summary: 
    //    a dijit which can hold many views but display only one at on time
    // description:
    //    the constructor params is {views: []}, every view should have a property: label.
    //    View can be a dijit or dom
    baseClass: 'jimu-viewstack',

    _currentView: null,

    postCreate: function() {
      this.inherited(arguments);
      if(!this.views){
        this.views = [];
      }
      array.forEach(this.views,lang.hitch(this,function(view){
        if(view.nodeType === 1){
          html.place(view, this.domNode);
          html.addClass(view, 'view');
        }
        else if(view.domNode){
          html.place(view.domNode, this.domNode);
          html.addClass(view.domNode, 'view');
        }
      }));
    },

    startup: function() {
      this.inherited(arguments);
      if(this.views.length > 0){
        this.switchView(0);
      }
    },

    getSelectedView: function(){
      return this._currentView;
    },

    getSelectedLabel: function(){
      var label = '';
      var view = this.getSelectedView();
      if(view){
        label = view.label;
      }
      return label;
    },

    getViewByLabel: function(label){
      for(var i = 0; i < this.views.length; i++){
        if(label === this.views[i].label){
          return this.views[i];
        }
      }
      return null;
    },

    addView: function(view){
      this.views.push(view);
      if(view.nodeType === 1){
        html.place(view, this.domNode);
        html.addClass(view, 'view');
      }
      else if(view.domNode){
        html.place(view.domNode, this.domNode);
        html.addClass(view.domNode, 'view');
      }
    },

    removeView: function(view){
      var c1 = this.views.length;
      this.views = array.filter(this.views,function(v){
        return view !== v;
      });
      var c2 = this.views.length;
      if(c1 !== c2){
        if(view.nodeType === 1){
          html.destroy(view);
        }
        else if(view.domNode){
          view.destroyRecursive();
        }
      }
    },

    switchView: function(v){
      var view, dom;
      if(typeof v === 'number'){
        view = this.views[v];
      }else if(typeof v === 'string'){
        view = this.getViewByLabel(v);
      }else{
        view = v;
      }

      this.views.forEach(lang.hitch(this,function(_v){
        if(!_v){
          return;
        }
        if(_v.nodeType === 1){
          dom = _v;
        }
        else if(_v.domNode){
          dom = _v.domNode;
        }
        if(_v === view){
          html.setStyle(dom, 'display', 'block');
          if(_v.domNode && !_v._started){
            _v.startup();
            _v._started = true;
          }
        }
        else{
          html.setStyle(dom, 'display', 'none');
        }
      }));
      this._currentView = view;
      this.onViewSwitch(view);
    },

    onViewSwitch: function(){}
  });
});