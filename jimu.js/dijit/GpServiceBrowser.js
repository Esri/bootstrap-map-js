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
  './_BasicServiceBrowser',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Deferred'
],
function(declare, _BasicServiceBrowser, lang, array, Deferred) {
  return declare([_BasicServiceBrowser], {
    baseClass: 'jimu-gp-service-browser',
    declaredClass: 'jimu.dijit.GpServiceBrowser',

    _leafType: 'task',
    _serviceTypes: ['GPServer'],

    //options
    url: '',
    multiple: false,

    //public methods:
    //getSelectedItems return [{name, url}]

    //test urls
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/GPServer

    //override
    getSelectedItems: function(){
      var items = this.inherited(arguments);
      items = array.map(items, lang.hitch(this, function(item){
        return {
          name: item.name,
          url: item.url
        };
      }));
      return items;
    },

    //override, must return a deferred
    _searchServiceUrlCallback: function(serviceUrl, serviceItem, serviceMeta){
      var def = new Deferred();
      if (serviceMeta.tasks && serviceMeta.tasks.length > 0) {
        array.forEach(serviceMeta.tasks, lang.hitch(this, function(taskName) {
          var taskItem = {
            name: taskName,
            type: 'task',
            url: serviceUrl + '/' + taskName,
            parent: serviceItem.id
          };
          this._addItem(taskItem);
        }));
      }
      setTimeout(lang.hitch(this, function(){
        def.resolve();
      }), 0);
      return def;
    },

    //override, must resutn a deferred
    _searchChildResource: function(url, parent){
      return this._searchTaskUrl(url, parent, true);
    },

    //return deferred
    _searchTaskUrl:function(taskUrl, parent, /* optional */ showError){
      //url is end with task name
      var resultDef = new Deferred();
      this.shelter.show();
      this._getRestInfo(taskUrl).then(lang.hitch(this,function(taskResponse){
        if(!this.domNode){
          return;
        }
        this.shelter.hide();
        if(taskResponse.name){
          var taskItem = {
            name: taskResponse.name,
            type: 'task',
            url: taskUrl,
            parent: parent.id
          };
          this._addItem(taskItem);
        }
        resultDef.resolve();
      }),lang.hitch(this,function(err){
        console.error(err);
        if(!this.domNode){
          return;
        }
        this.shelter.hide();
        if(showError){
          var errObj = {
            errorCode: 'NETWORK_ERROR',
            error: err
          };
          resultDef.reject(errObj);
        }
        else{
          resultDef.reject(err);
        }
      }));
      return resultDef;
    },

    //override
    _getIconImageName: function(item, opened){/*jshint unused: false*/
      var imageName = '';
      if (item.type === 'GPServer') {
        imageName = 'toolbox.png';
      } else if (item.type === 'task') {
        imageName = 'tool.png';
      }
      return imageName;
    },

    //override
    _onTreeOpen:function(item,node){/*jshint unused: false*/
      var children = this._store.query({parent:item.id});
      if(item.type === 'GPServer' && children.length === 0){
        this.shelter.show();
        this._getRestInfo(item.url).then(lang.hitch(this, function(response){
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
          var tasks = response.tasks;
          array.forEach(tasks,lang.hitch(this, function(taskName){
            var taskItem = {
              name: taskName,
              type: "task",
              url: item.url+'/'+taskName,
              parent: item.id
            };
            this._addItem(taskItem);
          }));
        }),lang.hitch(this,function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.shelter.hide();
        }));
      }
    }

  });
});