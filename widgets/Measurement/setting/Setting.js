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

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    "dijit/form/Select"
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-measurement-setting',

      startup: function() {
        this.inherited(arguments);
        if (!this.config.measurement) {
          this.config.measurement = {};
        }
        this.setConfig(this.config);
      },

      setConfig: function(config) {
        this.config = config;
        if (config.measurement.defaultAreaUnit) {
          this.selectAreaUnit.set('value', config.measurement.defaultAreaUnit);
        } else {
          this.selectAreaUnit.set('value', "esriAcres");
        }
        if (config.measurement.defaultLengthUnit) {
          this.selectLengthUnit.set('value', config.measurement.defaultLengthUnit);
        } else {
          this.selectLengthUnit.set('value', "esriMiles");
        }
      },

      getConfig: function() {
        this.config.measurement.defaultAreaUnit = this.selectAreaUnit.value;
        this.config.measurement.defaultLengthUnit = this.selectLengthUnit.value;
        return this.config;
      }

    });
  });