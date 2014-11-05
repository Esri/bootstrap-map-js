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
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/NumberTextBox',
    'dijit/form/CheckBox'
  ],
  function(
    declare,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-legend-setting',

      startup: function() {
        this.inherited(arguments);
        if (!this.config.legend) {
          this.config.legend = {};
        }
        this.setConfig(this.config);
      },

      setConfig: function(config) {
        this.config = config;
        if (config.legend.arrangement !== undefined) {
          this.selectArrangement.set('value', config.legend.arrangement);
        }
        this.autoUpdate.set('checked', config.legend.autoUpdate);
        this.respectCurrentMapScale.set('checked', config.legend.respectCurrentMapScale);
      },

      getConfig: function() {
        this.config.legend.arrangement = parseInt(this.selectArrangement.get('value'), 10);
        this.config.legend.autoUpdate = this.autoUpdate.checked;
        this.config.legend.respectCurrentMapScale = this.respectCurrentMapScale.checked;
        return this.config;
      }
    });
  });