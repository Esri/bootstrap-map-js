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
define("esri/renderers/ScaleDependentRenderer",["dojo/_base/declare","dojo/_base/lang","dojo/has","esri/kernel","esri/renderers/Renderer"],function(c,l,m,n,p){c=c(p,{declaredClass:"esri.renderer.ScaleDependentRenderer",constructor:function(a){this.setRendererInfos(a&&a.rendererInfos||[])},setRendererInfos:function(a){this.rendererInfos=a;this._setRangeType();return this},getSymbol:function(a){var b=this.getRendererInfo(a);return b&&b.renderer.getSymbol(a)},getRendererInfo:function(a){a=a.getLayer().getMap();
return"zoom"===this.rangeType?this.getRendererInfoByZoom(a.getZoom()):this.getRendererInfoByScale(a.getScale())},getRendererInfoByZoom:function(a){var b,d=this.rendererInfos,f,e=0;do b=d[e],a>=b.minZoom&&a<=b.maxZoom&&(f=b),e++;while(!f&&e<d.length);return f},getRendererInfoByScale:function(a){var b,d=this.rendererInfos,f,e=0,k,g,c,h;do b=d[e],k=b.minScale,g=b.maxScale,c=!k,h=!g,!c&&a<=k&&(c=!0),!h&&a>=g&&(h=!0),c&&h&&(f=b),e++;while(!f&&e<d.length);return f},addRendererInfo:function(a){var b,d=0,
f,e=this.rendererInfos,c=a.hasOwnProperty("minZoom")?"minZoom":"minScale",g=e.length;do{f=e[d];if(g===d||a[c]<f[c])e.splice(d,0,a),this._setRangeType(),b=!0;d++}while(!b&&d<g);return this},_setRangeType:function(){var a=this.rendererInfos;if(a=a&&a[0])this.rangeType=a.hasOwnProperty("minZoom")?"zoom":a.hasOwnProperty("minScale")?"scale":""},toJson:function(){}});m("extend-esri")&&l.setObject("renderer.ScaleDependentRenderer",c,n);return c});