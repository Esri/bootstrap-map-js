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
  './_BasicServiceChooserContent',
  './GpServiceBrowser'
],
function(declare, _BasicServiceChooserContent, GpServiceBrowser) {
  return declare([_BasicServiceChooserContent], {
    baseClass: 'jimu-gp-service-chooser-content',

    _examples:['http://myserver/arcgis/rest/services',
    'http://myserver/arcgis/rest/services/folder',
    'http://myserver/arcgis/rest/services/myservice/GpServer',
    'http://myserver/arcgis/rest/services/myservice/GpServer/taskname'],

    //test urls:
    //test urls
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/GPServer

    //methods need to override:
    //_createServiceBrowser, return a service browser

    //to be override,return a service browser
    _createServiceBrowser: function(args){
      return new GpServiceBrowser(args);
    }

  });
});