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
  'dojo/_base/array',
  'dojo/date/locale',
  'esri/lang',
  'dojo/data/ItemFileWriteStore'
],
function(declare, lang, array, locale, esriLang, ItemFileWriteStore) {
  return declare([],{
    _stringFieldType: 'esriFieldTypeString',
    _dateFieldType: 'esriFieldTypeDate',
    _numberFieldTypes: ['esriFieldTypeSmallInteger','esriFieldTypeInteger','esriFieldTypeSingle','esriFieldTypeDouble'],
    _supportFieldTypes: [],
    dayInMS : (24 * 60 * 60 * 1000) - 1000,// 1 sec less than 1 day
    fieldsStore: null,

    //methods renamed:
    //parseDefinitionExpression->getFilterObjByExpr
    //builtCompleteFilter->getExprByFilterObj

    //public methods:
    //getFilterObjByExpr: expr->partsObj
    //getExprByFilterObj: partsObj->expr

    constructor: function(){
      String.prototype.startsWith = function(str) {
        return (this.indexOf(str) === 0);
      };

      String.prototype.endsWith = function(str) {
        return (this.substring(this.length - (str.length)) === str);
      };

      String.prototype.count = function (c) {
        return this.split(c).length - 1;
      };

      this._supportFieldTypes = [];
      this._supportFieldTypes.push(this._stringFieldType);
      this._supportFieldTypes.push(this._dateFieldType);
      this._supportFieldTypes = this._supportFieldTypes.concat(this._numberFieldTypes);
    },

    OPERATORS:{
      stringOperatorIs:'stringOperatorIs',
      stringOperatorIsNot:'stringOperatorIsNot',
      stringOperatorStartsWith:'stringOperatorStartsWith',
      stringOperatorEndsWith:'stringOperatorEndsWith',
      stringOperatorContains:'stringOperatorContains',
      stringOperatorDoesNotContain:'stringOperatorDoesNotContain',
      stringOperatorIsBlank:'stringOperatorIsBlank',
      stringOperatorIsNotBlank:'stringOperatorIsNotBlank',
      dateOperatorIsOn:'dateOperatorIsOn',
      dateOperatorIsNotOn:'dateOperatorIsNotOn',
      dateOperatorIsBefore:'dateOperatorIsBefore',
      dateOperatorIsAfter:'dateOperatorIsAfter',
      dateOperatorDays:'dateOperatorDays',
      dateOperatorWeeks:'dateOperatorWeeks',
      dateOperatorMonths:'dateOperatorMonths',
      dateOperatorInTheLast:'dateOperatorInTheLast',
      dateOperatorNotInTheLast:'dateOperatorNotInTheLast',
      dateOperatorIsBetween:'dateOperatorIsBetween',
      dateOperatorIsNotBetween:'dateOperatorIsNotBetween',
      dateOperatorIsBlank:'dateOperatorIsBlank',
      dateOperatorIsNotBlank:'dateOperatorIsNotBlank',
      numberOperatorIs:'numberOperatorIs',
      numberOperatorIsNot:'numberOperatorIsNot',
      numberOperatorIsAtLeast:'numberOperatorIsAtLeast',
      numberOperatorIsLessThan:'numberOperatorIsLessThan',
      numberOperatorIsAtMost:'numberOperatorIsAtMost',
      numberOperatorIsGreaterThan:'numberOperatorIsGreaterThan',
      numberOperatorIsBetween:'numberOperatorIsBetween',
      numberOperatorIsNotBetween:'numberOperatorIsNotBetween',
      numberOperatorIsBlank:'numberOperatorIsBlank',
      numberOperatorIsNotBlank:'numberOperatorIsNotBlank'
    },

    setFieldsStoreByFieldInfos: function(allFieldsInfos){
      var fieldsInfos = array.filter(allFieldsInfos, lang.hitch(this,function(fieldInfo){
        return  this._supportFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));
      var items = array.map(fieldsInfos, function(fieldInfo, idx){
        var shortType;
        switch (fieldInfo.type) {
        case "esriFieldTypeString":
          shortType = "string";
          break;
        case "esriFieldTypeDate":
          shortType = "date";
          break;
        default: // numbers
          shortType = "number";
          break;
        }

        return {
          id: idx,
          label: fieldInfo.name, //fieldInfo.label, //(fieldInfo.alias || fieldInfo.name),
          shortType: shortType,
          alias: fieldInfo.alias,
          editable: fieldInfo.editable,
          name: fieldInfo.name,
          nullable: fieldInfo.nullable,
          type: fieldInfo.type
        };
      }, this);

      this.fieldsStore = new ItemFileWriteStore({
        data: {
          identifier: 'id',
          label: 'label',
          items: items
        }
      });

      return items.length;
    },

    _validatePartsObj:function(partsObj){
      return partsObj && typeof partsObj === 'object';
    },

    _isObject: function(o){
      return o && typeof o === 'object';
    },

    _isString: function(s){
      return s && typeof s === 'string';
    },

    /**************************************************/
    /****  stringify                               ****/
    /**************************************************/
    getExprByFilterObj: function(partsObj) {
      var filterString = "";
      if (partsObj.parts.length === 1) {
        filterString = this.builtFilterString(partsObj.parts[0]);
      } else {
        var join = "";
        //dojo.forEach(allFilters, function(node){
        for (var i = 0; i < partsObj.parts.length; i++) {
          var str = this.builtFilterString(partsObj.parts[i]);
          if (!esriLang.isDefined(str)) {
            // we're missing input
            return null;
          }
          filterString += join + "(" + str + ")";
          join = join || (" " + partsObj.logicalOperator + " ");
        }
      }
      partsObj.expr = filterString;
      return filterString;
    },

    builtFilterString: function(partsObj) {
      var filterString = "";
      if (partsObj.parts) {
        // set
        var join = "";
        for (var i = 0; i < partsObj.parts.length; i++) {
          var part = partsObj.parts[i];
          var obj = this.builtSingleFilterString(part);
          part.expr = obj.whereClause;
          if (!esriLang.isDefined(obj.whereClause)) {
            // we're missing input
            return null;
          }
          filterString += join + obj.whereClause;
          join = " " + partsObj.logicalOperator + " ";
        }
      } else {
        // single expression
        filterString = this.builtSingleFilterString(partsObj).whereClause;
      }
      partsObj.expr = filterString;
      return filterString;
    },

    builtSingleFilterString: function(part, parameterizeCount) {
      // TODO check that expression value has a value ...
      if (esriLang.isDefined(part.valueObj.isValid) && !part.valueObj.isValid) {
        return {
          whereClause: null
        };
      }

      var value = part.valueObj.value;
      var value1 = part.valueObj.value1;
      var value2 = part.valueObj.value2;

      var parameterizeValues = false;
      if (part.interactiveObj) {
        if (!part.interactiveObj.prompt || !part.interactiveObj.hint) {
          return {
            whereClause: null
          };
        }
        if (esriLang.isDefined(parameterizeCount)) {
          parameterizeValues = true;
          if (esriLang.isDefined(part.valueObj.value)) {
            value = "{" + parameterizeCount + "}";
          }
          if (esriLang.isDefined(part.valueObj.value1)) {
            value1 = "{" + parameterizeCount + "}";
          }
          if (esriLang.isDefined(part.valueObj.value2)) {
            value2 = "{" + (parameterizeCount + 1) + "}";
          }
        }
      }

      var whereClause = "";

      if (part.fieldObj.shortType === "string") {

        var prefix = "";
        // if (value && part.valueObj.type !== 'field' && esriLang.arcgisonline.sharing.util.isHostedService(this.url)) {
        //   if (this.containsNonLatinCharacter(value)) {
        //     prefix = 'N';
        //   }
        // }

        switch (part.operator) {
        case this.OPERATORS.stringOperatorIs:
          if (part.valueObj.type === 'field') {
            whereClause = part.fieldObj.name + " = " + value;
          } else {
            whereClause = part.fieldObj.name + " = " + prefix + "'" + value.replace(/\'/g, "''") + "'";
          }
          break;
        case this.OPERATORS.stringOperatorIsNot:
          if (part.valueObj.type === 'field') {
            whereClause = part.fieldObj.name + " <> " + value;
          } else {
            whereClause = part.fieldObj.name + " <> " + prefix + "'" + value.replace(/\'/g, "''") + "'";
          }
          break;
        case this.OPERATORS.stringOperatorStartsWith:
          whereClause = part.fieldObj.name + " LIKE " + prefix + "'" + value.replace(/\'/g, "''") + "%'";
          break;
        case this.OPERATORS.stringOperatorEndsWith:
          whereClause = part.fieldObj.name + " LIKE " + prefix + "'%" + value.replace(/\'/g, "''") + "'";
          break;
        case this.OPERATORS.stringOperatorContains:
          whereClause = part.fieldObj.name + " LIKE " + prefix + "'%" + value.replace(/\'/g, "''") + "%'";
          break;
        case this.OPERATORS.stringOperatorDoesNotContain:
          whereClause = part.fieldObj.name + " NOT LIKE " + prefix + "'%" + value.replace(/\'/g, "''") + "%'";
          break;
        case this.OPERATORS.stringOperatorIsBlank:
          whereClause = part.fieldObj.name + " IS NULL";
          break;
        case this.OPERATORS.stringOperatorIsNotBlank:
          whereClause = part.fieldObj.name + " IS NOT NULL";
          break;
        }

      } else if (part.fieldObj.shortType === "number") {

        switch (part.operator) {
        case this.OPERATORS.numberOperatorIs:
          whereClause = part.fieldObj.name + " = " + value;
          break;
        case this.OPERATORS.numberOperatorIsNot:
          whereClause = part.fieldObj.name + " <> " + value;
          break;
        case this.OPERATORS.numberOperatorIsAtLeast:
          whereClause = part.fieldObj.name + " >= " + value;
          break;
        case this.OPERATORS.numberOperatorIsLessThan:
          whereClause = part.fieldObj.name + " < " + value;
          break;
        case this.OPERATORS.numberOperatorIsAtMost:
          whereClause = part.fieldObj.name + " <= " + value;
          break;
        case this.OPERATORS.numberOperatorIsGreaterThan:
          whereClause = part.fieldObj.name + " > " + value;
          break;
        case this.OPERATORS.numberOperatorIsBetween:
          whereClause = part.fieldObj.name + " BETWEEN " + value1 + " AND " + value2;
          break;
        case this.OPERATORS.numberOperatorIsNotBetween:
          whereClause = part.fieldObj.name + " NOT BETWEEN " + value1 + " AND " + value2;
          break;
        case this.OPERATORS.numberOperatorIsBlank:
          whereClause = part.fieldObj.name + " IS NULL";
          break;
        case this.OPERATORS.numberOperatorIsNotBlank:
          whereClause = part.fieldObj.name + " IS NOT NULL";
          break;
        }

      } else { // date
        // value is Date object when we had a DateTextBox
        // value is String when we had unique values list
        if (esriLang.isDefined(value) && part.valueObj.type !== 'field' && (typeof value === "string")) {
          // e.g. "7/7/2010 12:00:00 AM" returned by generateRenderer
          value = new Date(value);
        }

        switch (part.operator) {
        case this.OPERATORS.dateOperatorIsOn:
          if (part.valueObj.type === 'field') {
            whereClause = part.fieldObj.name + " = " + value;
          } else {
            if (parameterizeValues) {
              whereClause = part.fieldObj.name + " BETWEEN '{" + parameterizeCount + "}' AND '{" + (parameterizeCount + 1) + "}'";
            } else {
              whereClause = part.fieldObj.name + " BETWEEN '" + this.formatDate(value) + "' AND '" + this.formatDate(this.addDay(value)) + "'";
            }
          }
          break;
        case this.OPERATORS.dateOperatorIsNotOn:
          if (part.valueObj.type === 'field') {
            whereClause = part.fieldObj.name + " <> " + value;
          } else {
            if (parameterizeValues) {
              whereClause = part.fieldObj.name + " NOT BETWEEN '{" + parameterizeCount + "}' AND '{" + (parameterizeCount + 1) + "}'";
            } else {
              whereClause = part.fieldObj.name + " NOT BETWEEN '" + this.formatDate(value) + "' AND '" + this.formatDate(this.addDay(value)) + "'";
            }
          }
          break;
        case this.OPERATORS.dateOperatorIsBefore:
          if (part.valueObj.type === 'field') {
            whereClause = part.fieldObj.name + " < " + value;
          } else {
            whereClause = part.fieldObj.name + " < '" + this.formatDate(value) + "'";
          }
          break;
        case this.OPERATORS.dateOperatorIsAfter:
          if (part.valueObj.type === 'field') {
            whereClause = part.fieldObj.name + " > " + value;
          } else {
            whereClause = part.fieldObj.name + " > '" + this.formatDate(this.addDay(value)) + "'";
          }
          break;
          //case this.OPERATORS.dateOperatorInTheLast:
          //case this.OPERATORS.dateOperatorNotInTheLast:
        case this.OPERATORS.dateOperatorIsBetween:
          if (parameterizeValues) {
            whereClause = part.fieldObj.name + " BETWEEN '" + value1 + "' AND '" + value2 + "'";
          } else {
            whereClause = part.fieldObj.name + " BETWEEN '" + this.formatDate(value1) + "' AND '" + this.formatDate(this.addDay(value2)) + "'";
          }
          break;
        case this.OPERATORS.dateOperatorIsNotBetween:
          if (parameterizeValues) {
            whereClause = part.fieldObj.name + " NOT BETWEEN '" + value1 + "' AND '" + value2 + "'";
          } else {
            whereClause = part.fieldObj.name + " NOT BETWEEN '" + this.formatDate(value1) + "' AND '" + this.formatDate(this.addDay(value2)) + "'";
          }
          break;
        case this.OPERATORS.dateOperatorIsBlank:
          whereClause = part.fieldObj.name + " IS NULL";
          break;
        case this.OPERATORS.dateOperatorIsNotBlank:
          whereClause = part.fieldObj.name + " IS NOT NULL";
          break;
        }
      }
      return {
        whereClause: whereClause
      };
    },

    formatDate: function(value){
      // see also parseDate() 
      // to bypass the locale dependent connector character format date and time separately
      var s1 = locale.format(value, {
        datePattern: "yyyy-MM-dd",
        selector: "date"
      });
      var s2 = locale.format(value, {
        selector: "time",
        timePattern: "HH:mm:ss"
      });
      return s1 + " " + s2;
      /* contains comma '2013-03-01, 00:00:00' for locale 'en'
      return dojo.date.locale.format(value, {
        datePattern: "yyyy-MM-dd",
        timePattern: "HH:mm:ss"
      });
      */
    },

    addDay: function(date){
      return new Date(date.getTime() + this.dayInMS);
    },

    /**************************************************/
    /****  parse                                   ****/
    /**************************************************/
    //expr->partsObj
    getFilterObjByExpr: function(defExpr){
      if (!defExpr || !this.fieldsStore) {
        return;
      }

      var obj = this.replaceStrings(defExpr);
      defExpr = obj.defExpr;
      
      var partsObj = this.findParts(defExpr, "AND");
      if (partsObj.parts.length === 1) {
        partsObj = this.findParts(defExpr, "OR");
        if (partsObj.parts.length === 1) {
          // just a simple expression
          partsObj.logicalOperator = "AND";
        }
      }
      
      // only 2 levels
      array.forEach(partsObj.parts, function(part){
        part.expr = part.expr.trim();
        if (part.expr.startsWith('(') && (part.expr.search(/\)$/) > -1)) {
          // part.expr.endsWith(')') -> Invalid regular expression: /)$/: Unmatched ')' 
          // (field = 1 AND field = 2)
          // (field = 1) AND (field = 2)
          var str = part.expr.substring(1, part.expr.length - 1);
          var pos1 = str.indexOf('(');
          var pos2 = str.indexOf(')');
          if ((pos1 === -1 && pos2 === -1) || pos1 < pos2) {
            part.expr = str;
          }
        }
        
        var subPartsObj = this.findParts(part.expr, "AND");
        if (subPartsObj.parts.length === 1) {
          subPartsObj = this.findParts(part.expr, "OR");
        }
        if (subPartsObj.parts.length > 1) {
          part.parts = subPartsObj.parts;
          part.logicalOperator = subPartsObj.logicalOperator;
        }
      }, this);
      
      this.parseExpr(partsObj);
      
      this.reReplaceStrings(obj, partsObj);
      
      // console.log(dojo.json.stringify(partsObj));
      return partsObj;
    },

    replaceStrings: function(defExpr){
      var origDefExpr = defExpr;
      
      // remove all strings from defExpr so parsing is easier
      // 'Bob' / '''Bob' / 'Bob''' / 'Bob''Fred' / ''
      var getEnd = function(defExpr, start, pos){
        var end = -1;
        var pos2;
        if (pos === start + 1) {
          pos2 = defExpr.indexOf("'", pos + 1);
          if (pos2 === pos + 1) {
            // single quotes inside string
            end = defExpr.indexOf("'", pos2 + 1);
            return getEnd(defExpr, start, end);
          } else {
            // end of string
            end = pos;
          }
        } else {
          pos2 = defExpr.indexOf("'", pos + 1);
          if (pos2 === pos + 1) {
            // single quotes inside string
            end = defExpr.indexOf("'", pos2 + 1);
            return getEnd(defExpr, start, end);
          } else {
            // end of string
            end = pos;
          }
        }
        return end;
      };
      
      var savedStrings = [];
      var pos = defExpr.indexOf("'");
      while (pos > -1) {
        var start = pos;
        var end = defExpr.indexOf("'", pos + 1);
        var endAdd = 0;
        end = getEnd(defExpr, start, end);
        if (defExpr[start+1] === '%') {
          start++;
        }
        if (defExpr[end-1] === '%') {
          end = end-1;
          endAdd++;
        }
        var string = defExpr.substring(start + 1, end);
        
        // non-latin strings have to start with N; supported only on hosted FS
        if (defExpr[start-1] === 'N') {
          defExpr = defExpr.substring(0,start-1) + defExpr.substring(start);
          start = start-1;
          end = end -1;
        }
      
        if (!this.isDateString(string) && string.indexOf("{") === -1) {
          // no dates and no parameterized values
          savedStrings.push(string);
          defExpr = defExpr.substring(0, start + 1) + "#" + (savedStrings.length - 1) + "#" + defExpr.substring(end);
          pos = defExpr.indexOf("'", (defExpr.lastIndexOf('#') + 2 + endAdd));
        } else {
          pos = defExpr.indexOf("'", end + 1 + endAdd);
        }
      }
      
      return {
        origDefExpr: origDefExpr,
        defExpr: defExpr,
        savedStrings: savedStrings
      };
    },

    reReplaceStrings: function(obj, partsObj){
      var savedStrings = obj.savedStrings;
      if (!savedStrings.length) {
        return;
      }
      
      if (savedStrings.length) {
        // put the strings back in
        var replace = function(part, savedStrings){
          if (part.fieldObj.shortType !== "string") {
            return false;
          }
          var start = part.valueObj.value.indexOf("#");
          var end = part.valueObj.value.lastIndexOf("#");
          if (esriLang.isDefined(part.valueObj.value) && start > -1) {
            part.valueObj.value = savedStrings[parseInt(part.valueObj.value.substring(start+1, end),10)].replace(/\'\'/g, "'");
            this.builtSingleFilterString(part);
            return true;
          }
          return false;
        };
        replace = lang.hitch(this, replace);
        
        var replaced = false;
        array.forEach(partsObj.parts, function(part){
          if (part.parts) {
            // set
            var setReplaced = false;
            array.forEach(part.parts, function(subPart){
              // expr
              setReplaced = replace(subPart, savedStrings) || setReplaced;
            });
            if (setReplaced) {
              replaced = setReplaced;
              part.expr = this.builtFilterString(part);
            }
          } else {
            // expr
            replaced = replace(part, savedStrings) || replaced;
            if (replaced) {
              this.builtFilterString(part);
            }
          }
        }, this);
        if (replaced) {
          partsObj.expr = null;
          this.getExprByFilterObj(partsObj);
        }
      }
    },

    isDateString: function(string){
      // 2012-12-21 00:00:00
      if (string.length === 19 &&
      string.charAt(4) === '-' &&
      string.charAt(7) === '-' &&
      string.charAt(10) === ' ' &&
      string.charAt(13) === ':' &&
      string.charAt(16) === ':') {
        return true;
      }
      return false;
    },

    findParts: function(defExpr, logicalOperator){
      var lowerDefExpr = defExpr.toLowerCase();
      var conStr = " " + logicalOperator.toLowerCase() + " ";
      var parts = [];
      var lastPos = 0;
      var pos = lowerDefExpr.indexOf(conStr);
      while (pos > 0) {
        var str = defExpr.substring(lastPos, pos);
        var lowerStr = str.toLowerCase();
        // TODO don't count parenthesis within a string ....     
        // TODO don't check between within a string ....     
        var oB = str.count('(');
        var cB = str.count(')');
        // single quotes within a string are used as 2 single quotes
        var sQ = str.count('\'');
        if (oB !== cB || sQ % 2 === 1) {
          // we don't have the full part
          pos = lowerDefExpr.indexOf(conStr, pos + 1);
        } else if (lowerStr.indexOf(" between ") > -1 && lowerStr.indexOf(" and ") === -1) {
          pos = lowerDefExpr.indexOf(conStr, pos + 1);
        } else {
          parts.push({
            expr: str
          });
          lastPos = pos + conStr.length;
          pos = lowerDefExpr.indexOf(conStr, lastPos);
        }
      }
      parts.push({
        expr: defExpr.substring(lastPos)
      });
      
      // make sure all parts have operators; if not add the part to the previous part
      var len = parts.length;
      for (var i = len - 1; i >= 0; i--) {
        if (!this.hasOperator(parts[i].expr) && i > 0) {
          parts[i - 1].expr += " " + logicalOperator + " " + parts[i].expr;
          parts.splice(i, 1);
        }
      }
      
      return {
        expr: defExpr,
        parts: parts,
        logicalOperator: logicalOperator
      };
    },

    hasOperator: function(str){
      str = str.toLowerCase();
      
      if (str.indexOf("{") > -1 && str.indexOf("}") > -1) {
        // parameterized def Expr
        return true;
      } else if (str.indexOf(" = ") > -1 ||
      str.indexOf(" < ") > -1 ||
      str.indexOf(" > ") > -1 ||
      str.indexOf(" <> ") > -1 ||
      str.indexOf(" <= ") > -1 ||
      str.indexOf(" >= ") > -1 ||
      str.indexOf(" like ") > -1 ||
      //str.indexOf(" not like ") > -1 ||
      str.indexOf(" between ") > -1 ||
      str.indexOf(" date") > -1 ||
      //str.indexOf(" not between ") > -1 ||
      str.indexOf(" is null") > -1 ||
      str.indexOf(" is not null") > -1) {
        return true;
      }
      return false;
    },

    parseExpr: function(partsObj){
      array.forEach(partsObj.parts, function(part){
        if (part.parts) {
          this.parseExpr(part);
        } else {
          this.parseSingleExpr(part);
        }
      }, this);
    },

    parseSingleExpr: function(part){
      // part: {expr: "<str>"}      
      var str = part.expr.trim();
      var pos = str.indexOf(" ");
      var fieldName = str.substring(0, pos);
      part.fieldObj = {
        name: fieldName
      };
      part.valueObj = {};// value, value1, value2, type, period
      this.getFieldItemByName({
        name: fieldName
      }, function(item){
        part.fieldObj.shortType = item.shortType[0];
        part.fieldObj.label = item.label[0];
      }, function(){
        part.error = {
          msg: "unknown field name (" + fieldName + ")",
          code: 1
        };
      });
      str = str.substring(pos + 1).trim();
      var lStr = str.toLowerCase();
      
      if (lStr.startsWith("= ")) {

        this.storeValue(str.substring(2).trim(), part);
        if (part.fieldObj.shortType === "date") {
          part.operator = this.OPERATORS.dateOperatorIsOn;
        } else if (part.fieldObj.shortType === "string") {
          part.operator = this.OPERATORS.stringOperatorIs;
        } else { // number
          part.operator = this.OPERATORS.numberOperatorIs;
        }
        
      } else if (lStr.startsWith("< ")) {
      
        this.storeValue(str.substring(2).trim(), part);
        if (part.fieldObj.shortType === "date") {
          part.operator = this.OPERATORS.dateOperatorIsBefore;
        } else if (part.fieldObj.shortType === "number") {
          part.operator = this.OPERATORS.numberOperatorIsLessThan;
        } else {
          part.error = {
            msg: "operator (" + lStr + ") not supported for string",
            code: 3
          };
        }
        
      } else if (lStr.startsWith("> ")) {
      
        this.storeValue(str.substring(2).trim(), part);
        if (part.fieldObj.shortType === "date") {
          part.operator = this.OPERATORS.dateOperatorIsAfter;
        } else if (part.fieldObj.shortType === "number") {
          part.operator = this.OPERATORS.numberOperatorIsGreaterThan;
        } else {
          part.error = {
            msg: "operator (" + lStr + ") not supported for string",
            code: 3
          };
        }
        
      } else if (lStr.startsWith("<> ")) {
      
        this.storeValue(str.substring(3).trim(), part);
        if (part.fieldObj.shortType === "date") {
          part.operator = this.OPERATORS.dateOperatorIsNotOn;
        } else if (part.fieldObj.shortType === "string") {
          part.operator = this.OPERATORS.stringOperatorIsNot;
        } else { // number
          part.operator = this.OPERATORS.numberOperatorIsNot;
        }
        
      } else if (lStr.startsWith("<= ")) {
      
        this.storeValue(str.substring(3).trim(), part);
        part.operator = this.OPERATORS.numberOperatorIsAtMost;
        
      } else if (lStr.startsWith(">= ")) {
      
        this.storeValue(str.substring(3).trim(), part);
        part.operator = this.OPERATORS.numberOperatorIsAtLeast;
        
      } else if (lStr.startsWith("like ")) {
      
        // only string fields
        str = str.substring(5).trim();
        if (str.startsWith('\'%') && str.endsWith('%\'')) {
          this.storeValue(str.substring(2, str.length - 2), part);
          part.operator = this.OPERATORS.stringOperatorContains;
        } else if (str.startsWith('\'%') && str.endsWith('\'')) {
          this.storeValue(str.substring(2, str.length - 1), part);
          part.operator = this.OPERATORS.stringOperatorEndsWith;
        } else if (str.startsWith('\'') && str.endsWith('%\'')) {
          this.storeValue(str.substring(1, str.length - 2), part);
          part.operator = this.OPERATORS.stringOperatorStartsWith;
        } else {
          part.error = {
            msg: "value (" + lStr + ") not supported for LIKE",
            code: 3
          };
        }
        
      } else if (lStr.startsWith("not like ")) {
      
        // only string fields
        str = str.substring(9).trim();
        if (str.startsWith('\'%') && str.endsWith('%\'')) {
          this.storeValue(str.substring(1, str.length - 2), part);
          part.operator = this.OPERATORS.stringOperatorDoesNotContain;
        } else {
          part.error = {
            msg: "value (" + lStr + ") not supported for NOT LIKE",
            code: 3
          };
        }
        
      } else if (lStr.startsWith("between ")) {
      
        str = str.substring(8).trim();
        pos = str.toLowerCase().indexOf(" and ");
        if (pos > -1) {
          this.storeValue1(str.substring(0, pos).trim(), part);
          this.storeValue2(str.substring(pos + 5).trim(), part);
        } else {
          part.error = {
            msg: "missing AND operator for BETWEEN",
            code: 3
          };
        }
        
        if (part.fieldObj.shortType === "date") {
          if (typeof part.valueObj.value1 === "string") {
            // interactive placeholder
            part.operator = this.OPERATORS.dateOperatorIsBetween;
          } else if (this.subtractDay(part.valueObj.value2).getTime() === part.valueObj.value1.getTime()) {
            part.valueObj.value = part.valueObj.value1;
            delete part.valueObj.value1;
            delete part.valueObj.value2;
            part.operator = this.OPERATORS.dateOperatorIsOn;
          } else {
            part.operator = this.OPERATORS.dateOperatorIsBetween;
          }
        } else if (part.fieldObj.shortType === "number") {
          part.operator = this.OPERATORS.numberOperatorIsBetween;
        } else {
          part.error = {
            msg: "string field not supported for BETWEEN",
            code: 3
          };
        }
        
      } else if (lStr.startsWith("not between ")) {
      
        str = str.substring(12).trim();
        pos = str.toLowerCase().indexOf(" and ");
        if (pos > -1) {
          this.storeValue1(str.substring(0, pos).trim(), part);
          this.storeValue2(str.substring(pos + 5).trim(), part);
        } else {
          part.error = {
            msg: "missing AND operator for NOT BETWEEN",
            code: 3
          };
        }
        
        if (part.fieldObj.shortType === "date") {
          if (typeof part.valueObj.value1 === "string") {
            // interactive placeholder
            part.operator = this.OPERATORS.dateOperatorIsNotBetween;
          } else if (this.subtractDay(part.valueObj.value2).getTime() === part.valueObj.value1.getTime()) {
            part.valueObj.value = part.valueObj.value1;
            delete part.valueObj.value1;
            delete part.valueObj.value2;
            part.operator = this.OPERATORS.dateOperatorIsNotOn;
          } else {
            part.operator = this.OPERATORS.dateOperatorIsNotBetween;
          }
        } else if (part.fieldObj.shortType === "number") {
          part.operator = this.OPERATORS.numberOperatorIsNotBetween;
        } else {
          part.error = {
            msg: "string field not supported for NOT BETWEEN",
            code: 3
          };
        }
        
      } else if (lStr === "is null") {
      
        part.valueObj.value = null;
        if (part.fieldObj.shortType === "date") {
          part.operator = this.OPERATORS.dateOperatorIsBlank;
        } else if (part.fieldObj.shortType === "string") {
          part.operator = this.OPERATORS.stringOperatorIsBlank;
        } else { // number
          part.operator = this.OPERATORS.numberOperatorIsBlank;
        }
        
      } else if (lStr === "is not null") {
      
        part.valueObj.value = null;
        if (part.fieldObj.shortType === "date") {
          part.operator = this.OPERATORS.dateOperatorIsNotBlank;
        } else if (part.fieldObj.shortType === "string") {
          part.operator = this.OPERATORS.stringOperatorIsNotBlank;
        } else { // number
          part.operator = this.OPERATORS.numberOperatorIsNotBlank;
        }
        
      } else {
        part.error = {
          msg: "unknown operator (" + lStr + ")",
          code: 2
        };
      }
      
      if ((esriLang.isDefined(part.valueObj.value) && (typeof part.valueObj.value === "string") && part.valueObj.value.startsWith("{") && part.valueObj.value.endsWith("}")) ||
      (esriLang.isDefined(part.valueObj.value1) && (typeof part.valueObj.value1 === "string") && part.valueObj.value1.startsWith("{") && part.valueObj.value1.endsWith("}"))) {
        // value2 is same as value1, we don't need to check
        part.isInteractive = true;
      }
    },

    getFieldItemByName: function(query, handler, errorHandler){
      this.fieldsStore.fetch({
        query: query,
        onComplete: lang.hitch(this, function(items){
          if (items && items.length) {
            handler(items[0]);
          } else {
            errorHandler();
          }
        })
      });
    },

    subtractDay: function(date){
      return new Date(date.getTime() - this.dayInMS);
    },

    storeValue: function(str, part){
    
      if (str.startsWith('{') && str.endsWith('}')) {
        // interactive placeholder
        part.valueObj.value = str;
      } else if (str.startsWith('\'{') && str.endsWith('}\'')) {
        // interactive placeholder
        part.valueObj.value = str.substring(1, str.length - 1);
      } else if (part.fieldObj.shortType === "date") {
        if (str.startsWith('\'') && str.endsWith('\'')) {
          var dateStr = str.substring(1, str.length - 1);
          part.valueObj.value = this.parseDate(dateStr);
          //console.log("dateStr "+dateStr+" to Date "+part.valueObj.value.toString());        
        } else {
          part.valueObj.value = str;
          part.valueObj.type = 'field';
        }
      } else if (part.fieldObj.shortType === "string") {
        if ((str.startsWith('#') || str.startsWith('%#')) && (str.endsWith('#') || str.endsWith('#%'))) {
          part.valueObj.value = str;
        } else if (str.startsWith('\'') && str.endsWith('\'')) {
          part.valueObj.value = str.substring(1, str.length - 1).replace(/\'\'/g, "'");
        } else {
          part.valueObj.value = str;
          part.valueObj.type = 'field';
          this.getFieldItemByName({
            name: str
          }, function(item){
            part.valueObj.label = item.label[0];
          }, function(){
            part.error = {
              msg: "unknown field name (" + str + ")",
              code: 1
            };
          });
        }
      } else { // number
        part.valueObj.value = str;
        if (isNaN(str)) {
          part.valueObj.type = 'field';
          this.getFieldItemByName({
            name: str
          }, function(item){
            part.valueObj.label = item.label[0];
          }, function(){
            part.error = {
              msg: "unknown field name (" + str + ")",
              code: 1
            };
          });
        }
      }
    },
    
    storeValue1: function(str, part){
      // not for string fields
      
      if (str.startsWith('{') && str.endsWith('}')) {
        // interactive placeholder
        part.valueObj.value1 = str;
      } else if (str.startsWith('\'{') && str.endsWith('}\'')) {
        // interactive placeholder
        part.valueObj.value1 = str.substring(1, str.length - 1);
      } else if (part.fieldObj.shortType === "date") {
        if (str.startsWith('\'') && str.endsWith('\'')) {
          var dateStr = str.substring(1, str.length - 1);
          part.valueObj.value1 = this.parseDate(dateStr);
          //console.log("dateStr "+dateStr+" to Date "+part.valueObj.value.toString());        
        } else {
          part.valueObj.value1 = str;
          part.valueObj.type = 'field';
        }
      } else { // number
        part.valueObj.value1 = str;
        if (isNaN(str)) {
          part.valueObj.type = 'field';
        }
      }
    },
    
    storeValue2: function(str, part){
      // not for string fields
      
      if (str.startsWith('{') && str.endsWith('}')) {
        // interactive placeholder
        part.valueObj.value2 = str;
      } else if (str.startsWith('\'{') && str.endsWith('}\'')) {
        // interactive placeholder
        part.valueObj.value2 = str.substring(1, str.length - 1);
      } else if (part.fieldObj.shortType === "date") {
        if (str.startsWith('\'') && str.endsWith('\'')) {
          var dateStr = str.substring(1, str.length - 1);
          part.valueObj.value2 = this.parseDate(dateStr);
          //console.log("dateStr "+dateStr+" to Date "+part.valueObj.value.toString());        
        } else {
          part.valueObj.value2 = str;
          part.valueObj.type = 'field';
        }
      } else { // number
        part.valueObj.value2 = str;
        if (isNaN(str)) {
          part.valueObj.type = 'field';
        }
      }
    },

    parseDate: function(strValue){
      // we know strValue looks like this 'yyyy-MM-dd HH:mm:ss' (e.g. '2013-03-01 00:00:00')
      // some locals (e.g. en) expect a comma after the date like this '2013-03-01, 00:00:00'
      // de, e.g., does not use a comma like this '2013-03-01 00:00:00'
      // el, e.g., uses a dash like this '2013-03-01 - 00:00:00'
      // looked up in dojo/cldr/nls/<locale>/gregorian.js
      var date = locale.parse(strValue, {
        datePattern: "yyyy-MM-dd",
        timePattern: "HH:mm:ss"
      });
      if (!date) {
        date = locale.parse(strValue.replace(" ",", "), {
          datePattern: "yyyy-MM-dd",
          timePattern: "HH:mm:ss"
        });
        if (!date) {
          date = locale.parse(strValue.replace(" "," - "), {
            datePattern: "yyyy-MM-dd",
            timePattern: "HH:mm:ss"
          });
        }
      }
      return date;
    }
  });
});