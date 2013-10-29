/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define("esri/tasks/RelationshipQuery",["dojo/_base/declare","dojo/_base/lang","dojo/has","esri/kernel"],function(a,e,f,g){a=a(null,{declaredClass:"esri.tasks.RelationshipQuery",definitionExpression:"",relationshipId:null,returnGeometry:!1,objectIds:null,outSpatialReference:null,outFields:null,toJson:function(){var b={definitionExpression:this.definitionExpression,relationshipId:this.relationshipId,returnGeometry:this.returnGeometry,maxAllowableOffset:this.maxAllowableOffset,geometryPrecision:this.geometryPrecision},
a=this.objectIds,c=this.outFields,d=this.outSpatialReference;a&&(b.objectIds=a.join(","));c&&(b.outFields=c.join(","));d&&(b.outSR=d.toJson());b._ts=this._ts;return b}});f("extend-esri")&&e.setObject("tasks.RelationshipQuery",a,g);return a});