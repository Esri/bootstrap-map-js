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
  'dojo/text!./templates/_SingleFilter.html',
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
  'esri/request',
  'dojo/i18n'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang,
  html, array, json, on, query, Deferred, FilteringSelect, ValidationTextBox, DateTextBox,
  NumberTextBox, Memory, esriRequest, i18n) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString:template,
    baseClass: 'jimu-single-filter',
    declaredClass: 'jimu.dijit._SingleFilter',
    nls: null,
    url: null,
    layerInfo: null,
    stringFieldType: '',
    dateFieldType: '',
    numberFieldTypes: [],
    supportFieldTypes: [],
    part: null,
    OPERATORS: null,

    postMixInProperties:function(){
      this.supportFieldTypes = [];
      this.supportFieldTypes.push(this.stringFieldType);
      this.supportFieldTypes.push(this.dateFieldType);
      this.supportFieldTypes = this.supportFieldTypes.concat(this.numberFieldTypes);
      var mainNls = window.jimuConfig && window.jimuConfig.nls;
      if(!mainNls){
        mainNls = i18n.getLocalization('jimu','main');
      }
      this.nls = mainNls.filterBuilder;
    },

    postCreate:function(){
      this.inherited(arguments);
      this._initSelf();
    },

    toJson:function(){
      var part = null;
      var fieldInfo = this._getSelectedFilteringItem(this.fieldsSelect);
      if(!fieldInfo){
        return null;
      }
      part = {
        fieldObj:'',
        operator:'',
        valueObj:'',
        interactiveObj:''
      };
      if(!this.cbxAskValues.disabled && this.cbxAskValues.checked){
        if(!this.promptTB.validate()){
          this._showValidationErrorTip(this.promptTB);
          return;
        }
        if(!this.hintTB.validate()){
          this._showValidationErrorTip(this.hintTB);
          return;
        }
        part.interactiveObj = {
          prompt: this.promptTB.get('value'),
          hint: this.hintTB.get('value')
        };
      }
      part.fieldObj = {
        name:fieldInfo.name,
        label:fieldInfo.name,
        shortType:fieldInfo.shortType,
        type:fieldInfo.type
      };
      if(this.operatorsSelect.get('value') === 'none'){
        return null;
      }
      part.operator = this.operatorsSelect.get('value');
      part.valueObj = {
        isValid:true
      };
      var shortType = fieldInfo.shortType;
      if(this.valueRadio.checked){
        if(shortType === 'string'){
          if(part.operator === this.OPERATORS.stringOperatorIsBlank || part.operator === this.OPERATORS.stringOperatorIsNotBlank){
            part.valueObj.value = null;
          }
          else{
            if(this._isFieldCoded(fieldInfo) && part.operator === this.OPERATORS.stringOperatorIs){
              if(!this.stringCodedValuesFS.validate()){
                this._showValidationErrorTip(this.stringCodedValuesFS);
                return null;
              }
              var stirngCodedItem = this._getSelectedFilteringItem(this.stringCodedValuesFS);
              part.valueObj.value = stirngCodedItem.code;
            }
            else{
              if(!this.stringTextBox.validate()){
                this._showValidationErrorTip(this.stringTextBox);
                return null;
              }
              part.valueObj.value = this.stringTextBox.get('value');
            }
          }
        }
        else if(shortType === 'number'){
          if(part.operator === this.OPERATORS.numberOperatorIsBlank || part.operator === this.OPERATORS.numberOperatorIsNotBlank){
            part.valueObj.value = null;
          }
          else if(part.operator === this.OPERATORS.numberOperatorIsBetween || part.operator === this.OPERATORS.numberOperatorIsNotBetween){
            if(!this.numberTextBox1.validate()){
              this._showValidationErrorTip(this.numberTextBox1);
              return null;
            }
            if(!this.numberTextBox2.validate()){
              this._showValidationErrorTip(this.numberTextBox2);
              return null;
            }
            part.valueObj.value1 = parseFloat(this.numberTextBox1.get('value'));
            part.valueObj.value2 = parseFloat(this.numberTextBox2.get('value'));
          }
          else{
            if(this._isFieldCoded(fieldInfo) && part.operator === this.OPERATORS.numberOperatorIs){
              if(!this.numberCodedValuesFS.validate()){
                this._showValidationErrorTip(this.numberCodedValuesFS);
                return null;
              }
              var numberCodedItem = this._getSelectedFilteringItem(this.numberCodedValuesFS);
              part.valueObj.value = parseFloat(numberCodedItem.code);
            }
            else{
              if(!this.numberTextBox.validate()){
                this._showValidationErrorTip(this.numberTextBox);
                return null;
              }
              part.valueObj.value = parseFloat(this.numberTextBox.get('value'));
            }
          }
        }
        else if(shortType === 'date'){
          if(part.operator === this.OPERATORS.dateOperatorIsBlank || part.operator === this.OPERATORS.dateOperatorIsNotBlank){
            part.valueObj.value = null;
          }
          else if(part.operator === this.OPERATORS.dateOperatorIsBetween || part.operator === this.OPERATORS.dateOperatorIsNotBetween){
            if(!this.dateTextBox1.validate()){
              this._showValidationErrorTip(this.dateTextBox1);
              return null;
            }
            if(!this.dateTextBox2.validate()){
              this._showValidationErrorTip(this.dateTextBox2);
              return null;
            }
            part.valueObj.value1 = this.dateTextBox1.get('value');
            part.valueObj.value2 = this.dateTextBox2.get('value');
          }
          else{
            if(!this.dateTextBox.validate()){
              this._showValidationErrorTip(this.dateTextBox);
              return null;
            }
            part.valueObj.value = this.dateTextBox.get('value');
          }
        }
      }
      else if(this.fieldRadio.checked){
        var fieldInfo2 = this._getSelectedFilteringItem(this.fieldsSelect2);
        if(!fieldInfo2){
          this._showValidationErrorTip(this.fieldsSelect2);
          return null;
        }
        part.valueObj.value = fieldInfo2.name;
        part.valueObj.label = fieldInfo2.name;
        part.valueObj.type = 'field';
      }
      else if(this.uniqueRadio && this.uniqueRadio.checked){
        var uniqueItem = this._getSelectedFilteringItem(this.uniqueValuesSelect);
        if(!uniqueItem){
          this._showValidationErrorTip(this.uniqueValuesSelect);
          return null;
        }
        
        if(shortType === 'string'){
          part.valueObj.value = uniqueItem.name;
        }
        else if(shortType === 'number'){
          part.valueObj.value = parseFloat(uniqueItem.name);
        }
      }
      
      return part;
    },

    showDelteIcon:function(){
      html.setStyle(this.btnDelete,'display','inline-block');
    },

    hideDeleteIcon:function(){
      html.setStyle(this.btnDelete,'display','none');
    },

    _initSelf:function(){
      this.layerInfo = lang.mixin({},this.layerInfo);
      this._initRadios();
      var version = parseFloat(this.layerInfo.currentVersion);
      if (version < 10.1) {
        html.destroy(this.uniqueTd);
      }
      var fields = this.layerInfo.fields;
      if (fields && fields.length > 0) {
        fields = array.filter(fields, lang.hitch(this, function(fieldInfo) {
          return this.supportFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));
        this._enableRadios();
        this._initFieldsSelect(fields);
      }
    },

    _showValidationErrorTip:function(_dijit){
      if(!_dijit.validate() && _dijit.domNode){
        if(_dijit.focusNode){
          _dijit.focusNode.focus();
          _dijit.focusNode.blur();
        }
      }
    },

    _focusValidationTextBox:function(_dijit){
      if(_dijit){
        if(_dijit.focusNode){
          _dijit.focusNode.focus();
        }
      }
    },

    _isFieldCoded:function(fieldInfo){
      var domain = fieldInfo.domain;
      return domain && domain.type === "codedValue" && domain.codedValues && domain.codedValues.length > 0;
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

    _getShortTypeByFieldType:function(fieldType){
      if(fieldType === this.stringFieldType){
        return 'string';
      }
      else if(fieldType === this.dateFieldType){
        return 'date';
      }
      else if(this.numberFieldTypes.indexOf(fieldType) >= 0){
        return 'number';
      }
      return null;
    },

    _getOperatorsByShortType:function(shortType){
      var operators = [];
      if(shortType === 'string'){
        operators = [this.OPERATORS.stringOperatorIs,
        this.OPERATORS.stringOperatorIsNot,
        this.OPERATORS.stringOperatorStartsWith,
        this.OPERATORS.stringOperatorEndsWith,
        this.OPERATORS.stringOperatorContains,
        this.OPERATORS.stringOperatorDoesNotContain,
        this.OPERATORS.stringOperatorIsBlank,
        this.OPERATORS.stringOperatorIsNotBlank];
      }
      else if(shortType === 'number'){
        operators = [this.OPERATORS.numberOperatorIs,
        this.OPERATORS.numberOperatorIsNot,
        this.OPERATORS.numberOperatorIsAtLeast,
        this.OPERATORS.numberOperatorIsLessThan,
        this.OPERATORS.numberOperatorIsAtMost,
        this.OPERATORS.numberOperatorIsGreaterThan,
        this.OPERATORS.numberOperatorIsBetween,
        this.OPERATORS.numberOperatorIsNotBetween,
        this.OPERATORS.numberOperatorIsBlank,
        this.OPERATORS.numberOperatorIsNotBlank];
      }
      else if(shortType === 'date'){
        operators = [this.OPERATORS.dateOperatorIsOn,
        this.OPERATORS.dateOperatorIsNotOn,
        this.OPERATORS.dateOperatorIsBefore,
        this.OPERATORS.dateOperatorIsAfter,
        this.OPERATORS.dateOperatorIsBetween,
        this.OPERATORS.dateOperatorIsNotBetween,
        this.OPERATORS.dateOperatorIsBlank,
        this.OPERATORS.dateOperatorIsNotBlank];
      }
      return operators;
    },

    _initFieldsSelect:function(fieldInfos){
      var data = array.map(fieldInfos,lang.hitch(this,function(fieldInfo,index){
        var item = lang.mixin({},fieldInfo);
        item.id = index;
        item.shortType = this._getShortTypeByFieldType(fieldInfo.type);
        if(!item.alias){
          item.alias = item.name;
        }
        var a = '';
        if(item.shortType === 'string'){
          a = this.nls.string;
        }
        else if(item.shortType === 'number'){
          a = this.nls.number;
        }
        else if(item.shortType === 'date'){
          a = this.nls.date;
        }
        item.displayName = item.alias + " (" + a + ")";
        return item;
      }));
      
      if(data.length > 0){
        var store = new Memory({data:data});
        this.fieldsSelect.set('store',store);
        this.fieldsSelect.set('value',data[0].id);
      }
      this.fieldsSelect.focusNode.focus();
      this.fieldsSelect.focusNode.blur();
      this._onFieldsSelectChange();

      if(this.part){
        this._showPart(this.part);
      }
    },

    _showPart:function(_part){
      this.part = _part;
      var validPart = this.part && this.part.fieldObj && this.part.operator && this.part.valueObj;
      if(!validPart){
        return;
      }

      var fieldName = this.part.fieldObj.name;
      var operator = this.part.operator;
      var valueObj = this.part.valueObj;
      var fieldItems = this.fieldsSelect.store.query({
        name: fieldName
      });
      if (fieldItems.length === 0) {
        return;
      }
      var fieldItem = fieldItems[0];
      if (!fieldItem) {
        return;
      }
      this.fieldsSelect.set('value', fieldItem.id);
      setTimeout(lang.hitch(this,function(){
        if(!this.domNode){
          return;
        }
        this._onFieldsSelectChange();
        this.operatorsSelect.set('value', operator);
        setTimeout(lang.hitch(this,function(){
          if (!this.domNode) {
            return;
          }
          this._resetByFieldAndOperation(valueObj);
        }),50);

        setTimeout(lang.hitch(this, function() {
          if (!this.domNode) {
            return;
          }
          var interactiveObj = this.part.interactiveObj;
          if (interactiveObj) {
            this.cbxAskValues.checked = true;
            this._updatePrompt();
            this.promptTB.set('value', interactiveObj.prompt || '');
            this.hintTB.set('value', interactiveObj.hint || '');
          }
        }), 100);
        
      }),0);
    },

    _onFieldsSelectChange:function(){
      this.operatorsSelect.removeOption(this.operatorsSelect.getOptions());
      this.operatorsSelect.addOption({value:'none',label:this.nls.none});
      this.valueRadio.checked = true;
      var fieldInfo = this._getSelectedFilteringItem(this.fieldsSelect);
      if (fieldInfo) {
        this.operatorsSelect.shortType = fieldInfo.shortType;
        var operators = this._getOperatorsByShortType(fieldInfo.shortType);
        this.operatorsSelect.removeOption(this.operatorsSelect.getOptions());
        array.forEach(operators, lang.hitch(this, function(operator) {
          var label = this.nls[operator];
          this.operatorsSelect.addOption({value: operator,label: label});
        }));
      }
      this._onOperatorsSelectChange();
    },

    _onOperatorsSelectChange:function(){
      this.valueRadio.checked = true;
      this._resetByFieldAndOperation();
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
    },

    _initRadios:function(){
      var group = "radio_"+Math.random();
      this.valueRadio.name = group;
      this.fieldRadio.name = group;
      this.own(on(this.valueRadio,'click',lang.hitch(this,this._resetByFieldAndOperation)));
      this.own(on(this.fieldRadio,'click',lang.hitch(this,this._resetByFieldAndOperation)));
      if(this.uniqueRadio){
        this.uniqueRadio.name = group;
        this.own(on(this.uniqueRadio,'click',lang.hitch(this,this._resetByFieldAndOperation)));
      }

      this._resetByFieldAndOperation();
    },

    _enableRadios:function(){
      this.valueRadio.disabled = false;
      this.fieldRadio.disabled = false;
      if(this.uniqueRadio){
        this.uniqueRadio.disabled = false;
      }
    },

    _disableRadios:function(){
      this.valueRadio.disabled = true;
      this.fieldRadio.disabled = true;
      if(this.uniqueRadio){
        this.uniqueRadio.disabled = true;
      }
    },

    _resetByFieldAndOperation:function(/* optional */ valueObj){
      html.setStyle(this.attributeValueContainer,'display','block');
      this._enableRadios();
      
      var fieldInfo = this._getSelectedFilteringItem(this.fieldsSelect);
      var shortType = fieldInfo && fieldInfo.shortType;
      var operator = this.operatorsSelect.get('value');
      if(fieldInfo){
        if(shortType === 'string'){
          switch(operator){
          case this.OPERATORS.stringOperatorStartsWith:
          case this.OPERATORS.stringOperatorEndsWith:
          case this.OPERATORS.stringOperatorContains:
          case this.OPERATORS.stringOperatorDoesNotContain:
            this.valueRadio.checked = true;
            this._disableRadios();
            break;
          default:
            break;
          }
        }
        else if(shortType === 'number'){
          switch(operator){
          case this.OPERATORS.numberOperatorIsBetween:
          case this.OPERATORS.numberOperatorIsNotBetween:
            this.valueRadio.checked = true;
            this._disableRadios();
            break;
          default:
            break;
          }
        }
        else if(shortType === 'date'){
          switch(operator){
          case this.OPERATORS.dateOperatorIsBetween:
          case this.OPERATORS.dateOperatorIsNotBetween:
            this.valueRadio.checked = true;
            this._disableRadios();
            break;
          default:
            break;
          }
          if(this.uniqueRadio){
            this.uniqueRadio.disabled = true;
            if(this.uniqueRadio.checked){
              this.valueRadio.checked = true;
            }
          }
        }
      }
      this._updateUIOfAttrValueContainer(fieldInfo, operator, valueObj);
    },

    _updateUIOfAttrValueContainer:function(fieldInfo, operator,/* optional */ valueObj){
      this._updatePrompt();
      //radio->shortType->operator
      //radio->interative
      var shortType = fieldInfo && fieldInfo.shortType;
      var isShortTypeValid = shortType === 'string' || shortType === 'number' || shortType === 'date';
      if(isShortTypeValid){
        html.setStyle(this.attributeValueContainer,'display','block');
      }
      else{
        html.setStyle(this.attributeValueContainer,'display','none');
        return;
      }

      if(valueObj && valueObj.type === 'field'){
        this.fieldRadio.disabled = false;
        this.fieldRadio.checked = true;
      }

      if(this.valueRadio.checked){
        html.setStyle(this.fieldsSelect2.domNode,'display','none');
        html.setStyle(this.uniqueValuesSelect.domNode,'display','none');
        this._showAllValueBoxContainer();
        this._resetValueTextBox();
        if(shortType === 'string'){
          html.setStyle(this.stringTextBoxContainer,'display','block');
          html.setStyle(this.numberTextBoxContainer,'display','none');
          html.setStyle(this.dateTextBoxContainer,'display','none');

          if(this._isFieldCoded(fieldInfo) && operator === this.OPERATORS.stringOperatorIs){
            html.setStyle(this.stringCodedValuesFS.domNode,'display','inline-block');
            html.setStyle(this.stringTextBox.domNode,'display','none');
            var stringDomain = fieldInfo.domain;
            var stringCodedData = array.map(stringDomain.codedValues,lang.hitch(this,function(item,index){
              //item:{name,code},name is the code description and code is code value.
              var dataItem = lang.mixin({},item);
              dataItem.id = index;
              return dataItem;
            }));
            var stringCodedStore = new Memory({data:stringCodedData});
            this.stringCodedValuesFS.set('store', stringCodedStore);
            if(valueObj){
              var stringSelectedItems = array.filter(stringCodedData,lang.hitch(this,function(item){
                return item.code === valueObj.value;
              }));
              if(stringSelectedItems.length > 0){
                this.stringCodedValuesFS.set('value',stringSelectedItems[0].id);
              }
              else{
                this.stringCodedValuesFS.set('value',stringCodedData[0].id);
              }
            }
            else{
              this.stringCodedValuesFS.set('value',stringCodedData[0].id);
            }
          }
          else{
            html.setStyle(this.stringTextBox.domNode,'display','inline-block');
            html.setStyle(this.stringCodedValuesFS.domNode,'display','none');
            if(valueObj){
              this.stringTextBox.set('value',valueObj.value||'');
            }
          }
          
          if(operator === this.OPERATORS.stringOperatorIsBlank || operator === this.OPERATORS.stringOperatorIsNotBlank){
            html.setStyle(this.attributeValueContainer,'display','none');
          }
        }
        else if(shortType === 'number'){
          html.setStyle(this.stringTextBoxContainer,'display','none');
          html.setStyle(this.numberTextBoxContainer,'display','block');
          html.setStyle(this.dateTextBoxContainer,'display','none');
          if(operator === this.OPERATORS.numberOperatorIsBetween || operator === this.OPERATORS.numberOperatorIsNotBetween){
            html.setStyle(this.numberTextBox.domNode,'display','none');
            html.setStyle(this.numberRangeTable,'display','table');
            html.setStyle(this.numberCodedValuesFS.domNode,'display','none');
            if(valueObj){
              if(!isNaN(valueObj.value1) && !isNaN(valueObj.value2)){
                var num1 = parseFloat(valueObj.value1);
                var num2 = parseFloat(valueObj.value2);
                var min = Math.min(num1,num2);
                var max = Math.max(num1,num2);
                this.numberTextBox1.set('value', min);
                this.numberTextBox2.set('value', max);
              }
            }
          }
          else{
            html.setStyle(this.numberRangeTable,'display','none');
            if(this._isFieldCoded(fieldInfo) && operator === this.OPERATORS.numberOperatorIs){
              html.setStyle(this.numberTextBox.domNode,'display','none');
              html.setStyle(this.numberCodedValuesFS.domNode,'display','inline-block');
              var numberDomain = fieldInfo.domain;
              var numberCodedData = array.map(numberDomain.codedValues,lang.hitch(this,function(item,index){
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
              html.setStyle(this.numberTextBox.domNode,'display','inline-block');
              html.setStyle(this.numberCodedValuesFS.domNode,'display','none');
              if(valueObj){
                if(!isNaN(valueObj.value)){
                  this.numberTextBox.set('value',parseFloat(valueObj.value));
                }
              }
            }
          }
          if(operator === this.OPERATORS.numberOperatorIsBlank || operator === this.OPERATORS.numberOperatorIsNotBlank){
            html.setStyle(this.attributeValueContainer,'display','none');
          }
        }
        else if(shortType === 'date'){
          html.setStyle(this.stringTextBoxContainer,'display','none');
          html.setStyle(this.numberTextBoxContainer,'display','none');
          html.setStyle(this.dateTextBoxContainer,'display','block');

          if(operator === this.OPERATORS.numberOperatorIsBetween || operator === this.OPERATORS.numberOperatorIsNotBetween){
            html.setStyle(this.dateTextBox.domNode,'display','none');
            html.setStyle(this.dateRangeTable,'display','table');
            if(valueObj && valueObj.value1 && valueObj.value2){
              this.dateTextBox1.set('value',valueObj.value1);
              this.dateTextBox2.set('value',valueObj.value2);
            }
          }
          else{
            html.setStyle(this.dateTextBox.domNode,'display','inline-block');
            html.setStyle(this.dateRangeTable,'display','none');
            if(valueObj && valueObj.value){
              this.dateTextBox.set('value',valueObj.value);
            }
          }

          if(operator === this.OPERATORS.numberOperatorIsBlank || operator === this.OPERATORS.numberOperatorIsNotBlank){
            html.setStyle(this.attributeValueContainer,'display','none');
          }
          // this._focusValidationTextBox(this.dateTextBox);
        }
      }
      else if(this.fieldRadio.checked){
        this._hideAllValueBoxContainer();
        html.setStyle(this.uniqueValuesSelect.domNode,'display','none');
        html.setStyle(this.fieldsSelect2.domNode,'display','inline-block');
        this._resetFieldsSelect2();

        if(valueObj && valueObj.value){
          var fieldItems2 = this.fieldsSelect2.store.query({name:valueObj.value});
          if(fieldItems2.length > 0){
            var fieldItem2 = fieldItems2[0];
            if(fieldItem2){
              var id = fieldItem2.id;
              this.fieldsSelect2.set('value',id);
            }
          }
        }
        // this._focusValidationTextBox(this.fieldsSelect2);
        //this._showValidationErrorTip(this.fieldsSelect2);
      }
      else if(this.uniqueRadio && this.uniqueRadio.checked){
        this._hideAllValueBoxContainer();
        html.setStyle(this.fieldsSelect2.domNode,'display','none');
        html.setStyle(this.uniqueValuesSelect.domNode,'display','inline-block');
        this._resetUniqueValuesSelect();
        // this._focusValidationTextBox(this.uniqueValuesSelect);
        //this._showValidationErrorTip(this.uniqueValuesSelect);
      }
    },

    _showAllValueBoxContainer:function(){
      html.setStyle(this.allValueBoxContainer,'display','block');
    },

    _hideAllValueBoxContainer:function(){
      html.setStyle(this.allValueBoxContainer,'display','none');
    },

    _resetValueTextBox:function(){
      this.stringTextBox.set('value','');
      this.numberTextBox.set('value','');
      this.dateTextBox.set('value',new Date());
    },

    _resetFieldsSelect2:function(){
      this.fieldsSelect2.set('displayedValue','');
      var store = new Memory({data:[]});
      this.fieldsSelect2.set('store',store);
      if(this.fieldsSelect.validate()){
        var selectedItem = this._getSelectedFilteringItem(this.fieldsSelect);
        if(selectedItem){
          var items = this.fieldsSelect.store.query({shortType:selectedItem.shortType});
          var data = array.filter(items,lang.hitch(this,function(item){
            return item.id !== selectedItem.id;
          }));
          store = new Memory({data:data});
          this.fieldsSelect2.set('store',store);
          if(data.length > 0){
            this.fieldsSelect2.set('value',data[0].id);
          }
        }
      }
    },

    _resetUniqueValuesSelect:function(){
      this.uniqueValuesSelect.set('displayedValue','');
      var store = new Memory({data:[]});
      this.uniqueValuesSelect.set('store',store);
      if(this.layerInfo){
        var version = parseFloat(this.layerInfo.currentVersion);
        if(version >= 10.1){
          var item = this._getSelectedFilteringItem(this.fieldsSelect);
          if(item){
            var url = this.url+"/generateRenderer";
            var classificationDef = {"type":"uniqueValueDef","uniqueValueFields":[item.name]};
            var str = json.stringify(classificationDef);
            esriRequest({
              url:url,
              content:{
                classificationDef:str,
                f:'json'
              },
              handleAs:'json',
              callbackParamName:'callback',
              timeout:15000
            }).then(lang.hitch(this,function(response){
              var uniqueValueInfos = response && response.uniqueValueInfos;
              var fieldInfo = this._getSelectedFilteringItem(this.fieldsSelect);
              if(uniqueValueInfos && item.id === fieldInfo.id){
                var store2 = new Memory({data:[]});
                this.uniqueValuesSelect.set('store',store);
                var data = array.map(uniqueValueInfos,lang.hitch(this,function(info,index){
                  var value = info.value;
                  if(fieldInfo.shortType === 'number'){
                    value = parseFloat(value);
                  }
                  var dataItem = {
                    id:index,
                    name:value
                  };
                  return dataItem;
                }));
                store2 = new Memory({data:data});
                this.uniqueValuesSelect.set('store',store2);
                if(data.length > 0){
                  this.uniqueValuesSelect.set('value',data[0].id);
                }
              }
            }),lang.hitch(this,function(error){
              console.error(error);
            }));
          }
        }
      }
    },

    _onCbxAskValuesClicked:function(){
      this._updatePrompt();
    },

    _updatePrompt:function(){
      this.promptTB.set('value','');
      this.hintTB.set('value','');
      this.cbxAskValues.disabled = false;
      html.setStyle(this.promptTable,'display','table');

      var operator = this.operatorsSelect.get('value');
      var label = this.nls[operator];
      if(this.fieldRadio.checked){
        this.cbxAskValues.disabled = true;
      }
      if(operator === this.OPERATORS.stringOperatorIsBlank){
        this.cbxAskValues.disabled = true;
      }
      if(operator === this.OPERATORS.stringOperatorIsNotBlank){
        this.cbxAskValues.disabled = true;
      }
      if(operator === this.OPERATORS.numberOperatorIsBlank){
        this.cbxAskValues.disabled = true;
      }
      if(operator === this.OPERATORS.numberOperatorIsNotBlank){
        this.cbxAskValues.disabled = true;
      }
      if(operator === this.OPERATORS.dateOperatorIsBlank){
        this.cbxAskValues.disabled = true;
      }
      if(operator === this.OPERATORS.dateOperatorIsNotBlank){
        this.cbxAskValues.disabled = true;
      }

      if(this.cbxAskValues.disabled){
        this.cbxAskValues.checked = false;
      }

      if(!this.cbxAskValues.disabled && this.cbxAskValues.checked){
        html.setStyle(this.promptTable,'display','table');
        var fieldInfo = this._getSelectedFilteringItem(this.fieldsSelect);
        if(fieldInfo){
          if(operator !== 'none'){
            var alias = fieldInfo.alias||fieldInfo.name;
            var prompt = alias + ' ' + label;
            this.promptTB.set('value', prompt);
          }
        }
      }
      else{
        html.setStyle(this.promptTable,'display','none');
      }
    },

    _destroySelf:function(){
      this.destroy();
    }
  });
});