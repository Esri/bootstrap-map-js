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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./SingleParameter.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/json',
  'dojo/on',
  'dojo/query',
  'dojo/Deferred',
  'dijit/form/FilteringSelect',
  'dijit/form/ValidationTextBox',
  'dijit/form/DateTextBox',
  'dijit/form/NumberTextBox',
  'dojo/store/Memory',
  'esri/request'
],
  function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang,
  html, array, json, on, query, Deferred, FilteringSelect, ValidationTextBox, DateTextBox,
  NumberTextBox, Memory, esriRequest) {/*jshint unused: false*/
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-query-single-parameter',
      templateString: template,
      fieldInfo:null,
      part:null,
      nls:null,

      _type:-1,

      postCreate:function(){
        this.inherited(arguments);
        if(this.fieldInfo && this.part){
          this.build(this.fieldInfo, this.part);
        }
      },

      getValueObj:function(){
        var shortType = this.part.fieldObj.shortType;
        if(shortType === 'string'){
          return this._getStirngValueObj();
        }
        else if(shortType === 'number'){
          return this._getNumberValueObj();
        }
        else if(shortType === 'date'){
          return this._getDateValueObj();
        }
        return null;
      },

      _getStirngValueObj:function(){
        var valueObj = null;
        if(this._type === 1){
          if(!this.stringTextBox.validate()){
            this._showValidationErrorTip(this.stringTextBox);
            return null;
          }
          valueObj = {};
          valueObj.value = this.stringTextBox.get('value');
        }
        else if(this._type === 2){
          if (!this.stringCodedValuesFS.validate()) {
            this._showValidationErrorTip(this.stringCodedValuesFS);
            return null;
          }
          valueObj = {};
          var stirngCodedItem = this._getSelectedFilteringItem(this.stringCodedValuesFS);
          valueObj.value = stirngCodedItem.code;
        }
        return valueObj;
      },

      _getNumberValueObj:function(){
        var valueObj = null;
        if(this._type === 1){
          if(!this.numberTextBox.validate()){
            this._showValidationErrorTip(this.numberTextBox);
            return null;
          }
          valueObj = {};
          valueObj.value = parseFloat(this.numberTextBox.get('value'));
        }
        else if(this._type === 2){
          if (!this.numberCodedValuesFS.validate()) {
            this._showValidationErrorTip(this.numberCodedValuesFS);
            return null;
          }
          valueObj = {};
          var numberCodedItem = this._getSelectedFilteringItem(this.numberCodedValuesFS);
          valueObj.value = parseFloat(numberCodedItem.code);
        }
        else if(this._type === 3){
          if(!this.numberTextBox1.validate()){
            this._showValidationErrorTip(this.numberTextBox1);
            return null;
          }
          if(!this.numberTextBox2.validate()){
            this._showValidationErrorTip(this.numberTextBox2);
            return null;
          }
          valueObj = {};
          valueObj.value1 = parseFloat(this.numberTextBox1.get('value'));
          valueObj.value2 = parseFloat(this.numberTextBox2.get('value'));
        }
        return valueObj;
      },

      _getDateValueObj:function(){
        var valueObj = null;
        if(this._type === 1){
          if (!this.dateTextBox.validate()) {
            this._showValidationErrorTip(this.dateTextBox);
            return null;
          }
          valueObj = {};
          valueObj.value = this.dateTextBox.get('value');
        }
        else if(this._type === 2){
          if (!this.dateTextBox1.validate()) {
            this._showValidationErrorTip(this.dateTextBox1);
            return null;
          }
          if (!this.dateTextBox2.validate()) {
            this._showValidationErrorTip(this.dateTextBox2);
            return null;
          }
          valueObj = {};
          valueObj.value1 = this.dateTextBox1.get('value');
          valueObj.value2 = this.dateTextBox2.get('value');
        }
        return valueObj;
      },

      build:function(fieldInfo, part){
        this.fieldInfo = fieldInfo;
        this.part = part;
        var interactiveObj = part.interactiveObj;
        this.promptNode.innerHTML = interactiveObj.prompt||'';
        this.hintNode.innerHTML = interactiveObj.hint||'';
        var shortType = this.part.fieldObj.shortType;

        if(shortType === 'string'){
          this._buildString(fieldInfo, this.part);
        }
        else if(shortType === 'number'){
          this._buildNumber(fieldInfo, this.part);
        }
        else if(shortType === 'date'){
          this._buildDate(fieldInfo, this.part);
        }
      },

      _getCodedValues:function(fieldInfo){
        var codedValues = null;
        var domain = fieldInfo.domain;
        if(domain && domain.type === 'codedValue' && domain.codedValues && domain.codedValues.length > 0){
          codedValues = domain.codedValues;
        }
        return codedValues;
      },

      _buildString: function(fieldInfo, part) {
        html.setStyle(this.stringTextBoxContainer, 'display', 'block');
        html.setStyle(this.numberTextBoxContainer, 'display', 'none');
        html.setStyle(this.dateTextBoxContainer, 'display', 'none');

        var fieldObj = part.fieldObj;//name,shortType
        var valueObj = part.valueObj;//value,value1,value2
        var codedValues = this._getCodedValues(fieldInfo);

        if (codedValues) {
          this._type = 2;
          this._showDijit(this.stringCodedValuesFS);
          this._hideDijit(this.stringTextBox);
          var stringCodedData = array.map(codedValues, lang.hitch(this, function(item, index) {
            //item:{name,code},name is the code description and code is code value.
            var dataItem = lang.mixin({}, item);
            dataItem.id = index;
            return dataItem;
          }));
          var stringCodedStore = new Memory({
            data: stringCodedData
          });
          this.stringCodedValuesFS.set('store', stringCodedStore);
          if (valueObj) {
            var stringSelectedItems = array.filter(stringCodedData, lang.hitch(this, function(item) {
              return item.code === valueObj.value;
            }));
            if (stringSelectedItems.length > 0) {
              this.stringCodedValuesFS.set('value', stringSelectedItems[0].id);
            } else {
              this.stringCodedValuesFS.set('value', stringCodedData[0].id);
            }
          }
        } else {
          this._type = 1;
          this._showDijit(this.stringTextBox);
          this._hideDijit(this.stringCodedValuesFS);
          this.stringTextBox.set('value', valueObj.value || '');
        }
      },

      _buildNumber: function(fieldInfo, part){
        html.setStyle(this.stringTextBoxContainer,'display','none');
        html.setStyle(this.numberTextBoxContainer,'display','block');
        html.setStyle(this.dateTextBoxContainer,'display','none');

        var fieldObj = part.fieldObj;//name,shortType
        var valueObj = part.valueObj;//value,value1,value2        
        var operator = part.operator;

        var isRange = operator === this.nls.numberOperatorIsBetween || operator === this.nls.numberOperatorIsNotBetween;
        if(isRange){
          this._type = 3;
          html.setStyle(this.numberRangeTable,'display','table');
          this._hideDijit(this.numberTextBox);
          this._hideDijit(this.numberCodedValuesFS);
          var value1 = parseFloat(valueObj.value1);
          var value2 = parseFloat(valueObj.value2);
          this.numberTextBox1.set('value',value1);
          this.numberTextBox2.set('value',value2);
        }
        else{
          html.setStyle(this.numberRangeTable,'display','none');
          var value = parseFloat(valueObj.value);
          var codedValues = this._getCodedValues(part);
          if(codedValues){
            this._type = 2;
            this._showDijit(this.numberCodedValuesFS);
            this._hideDijit(this.numberTextBox);
            var numberCodedData = array.map(codedValues,lang.hitch(this,function(item,index){
              //item:{name,code},name is the code description and code is code value.
              var dataItem = lang.mixin({},item);
              dataItem.id = index;
              return dataItem;
            }));
            var numberCodedStore = new Memory({data:numberCodedData});
            this.numberCodedValuesFS.set('store',numberCodedStore);
            if(valueObj && !isNaN(valueObj.value)){
              var number = parseFloat(valueObj.value);
              var numberSelectedItems = array.filter(numberCodedData,lang.hitch(this,function(item){
                return parseFloat(item.code) === number;
              }));
              if(numberSelectedItems.length > 0){
                this.numberCodedValuesFS.set('value',numberSelectedItems[0].id);
              }
              else{
                this.numberCodedValuesFS.set('value',numberCodedData[0].id);
              }
            }
            else{
              this.numberCodedValuesFS.set('value',numberCodedData[0].id);
            }
          }
          else{
            this._type = 1;
            this._showDijit(this.numberTextBox);
            this._hideDijit(this.numberCodedValuesFS);
            this.numberTextBox.set('value',value);
          }
        }
      },

      _buildDate: function(fieldInfo, part){/*jshint unused: false*/
        html.setStyle(this.stringTextBoxContainer,'display','none');
        html.setStyle(this.numberTextBoxContainer,'display','none');
        html.setStyle(this.dateTextBoxContainer,'display','block');

        var fieldObj = part.fieldObj;//name,shortType
        var valueObj = part.valueObj;//value,value1,value2        
        var operator = part.operator;

        var isRange = operator === this.nls.numberOperatorIsBetween || operator === this.nls.numberOperatorIsNotBetween;
        if(isRange){
          this._type = 2;
          html.setStyle(this.dateRangeTable,'display','table');
          this._hideDijit(this.dateTextBox);
          this.dateTextBox1.set('value',valueObj.value1);
          this.dateTextBox2.set('value',valueObj.value2);
        }
        else{
          this._type = 1;
          html.setStyle(this.dateRangeTable,'display','none');
          this._showDijit(this.dateTextBox);
          this.dateTextBox.set('value',valueObj.value);
        }
      },

      _getSelectedFilteringItem:function(_select){
        if(_select.validate()){
          var id = _select.get('value');
          if(isNaN(id)){
            this._showValidationErrorTip(_select);
          }
          else{
            var items = _select.store.query({id: id});
            if(items.length > 0){
              var item = items[0];
              if(item){
                return item;
              }
            }
          }
        }
        else{
          this._showValidationErrorTip(_select);
        }
        return null;
      },

      _showValidationErrorTip:function(_dijit){
        if(!_dijit.validate() && _dijit.domNode){
          if(_dijit.focusNode){
            _dijit.focusNode.focus();
            _dijit.focusNode.blur();
          }
        }
      },

      _showDijit:function(_dijit){
        if(_dijit && _dijit.domNode){
          html.setStyle(_dijit.domNode,'display','inline-block');
        }
      },

      _hideDijit:function(_dijit){
        if(_dijit && _dijit.domNode){
          html.setStyle(_dijit.domNode,'display','none');
        }
      },

      _onRangeNumberBlur:function(){
        if(this.numberTextBox1.validate() && this.numberTextBox2.validate()){
          var value1 = parseFloat(this.numberTextBox1.get('value'));
          var value2 = parseFloat(this.numberTextBox2.get('value'));
          if(value1 > value2){
            this.numberTextBox1.set('value',value2);
            this.numberTextBox2.set('value',value1);
          }
        }
      },

      _onRangeDateBlur:function(){
        if(this.dateTextBox1.validate() && this.dateTextBox2.validate()){
          var date1 = this.dateTextBox1.get('value');
          var time1 = date1.getTime();
          var date2 = this.dateTextBox2.get('value');
          var time2 = date2.getTime();
          if(time1 > time2){
            this.dateTextBox1.set('value',date2);
            this.dateTextBox2.set('value',date1);
          }
        }
      }

    });
  });