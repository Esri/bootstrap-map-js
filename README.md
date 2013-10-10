# Bootstrap Map JS

Bootstrap Map JS is a simple framework for building responsive mapping applications with the [ArcGIS API for JavaScript](http://developers.arcgis.com) and [Bootstrap (ver 3.0)](http://getbootstrap.com).  With just a few lines of JS and CSS you can build a rich web-mobile application that will run on any device.  

All Bootstrap maps are automatically centered and resized when the size or orientation of the screen changes on the device.  Examples and templates are also provided to illustrate how to work with the bootstrap grid system and web components.  

[View the documentation and examples here.](http://esri.github.com/bootstrap-map-js/doc/index.html)

![App](https://raw.github.com/Esri/bootstrap-map-js/master/boostrapmapjs.png)

## What's included
* \boostrap_v3\...
* \css\bootstrapmap.css
* \js\bootstrapmap.js 
* \doc\
* \examples\... 

## Example

```
<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap 101 Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" media="screen">

    <!-- Bootstrap Map - required css for mapping components -->
    <link rel="stylesheet" type="text/css" href="http://js.arcgis.com/3.7/js/esri/css/esri.css">   
    <link rel="stylesheet" type="text/css" href="http://esri.github.com/Esri/bootstrap-map-js/css/bootstrapmap.css">   
    <style type="text/css">
	    <!-- Set the responsive map heights here -->
      #mapDiv {
        min-height: 100px; 
        max-height: 1000px; 
      }
    </style>

    <!-- HTML5 IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="../assets/js/html5shiv.js"></script>
      <script src="../assets/js/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    
    <!-- Bootstrap Map - reference for the map -->
    <div class="container">
      <div id="mapDiv"></div>
    </div>

    <!-- Bootstrap Map - load the responsive map -->
    <script src="http://js.arcgis.com/3.7compact"></script>
    <script>
        require(["esri/map", "http://esri.github.com/Esri/bootstrap-map-js/js/bootstrapmap.js", "dojo/domReady!"], 
          function(Map, BootstrapMap) {
            
          var map = BootstrapMap.create("mapDiv",{
            basemap:"national-geographic",
            center:[-122.45,37.77],
            zoom:12
          });
        });
    </script>

    <!-- jQuery (for Bootstrap's JavaScript plugins) -->
    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <!-- Include all  plugins or individual files as needed -->
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
  </body>
</html>
```

## Documentation

Visit the [Getting Started Guide](http://esri.github.com/bootstrap-map-js/doc/getstarted.html)

## Requirements

* [ArcGIS API for JavaScript](http://developers.arcgis.com)
* [Bootstrap ver 3.0.0](http://getbootstrap.com)
* [Bootstrap Map JS](http://esri.github.com/bootstrap-map-js/)

## Resources

* [ArcGIS for JavaScript API](http://developers.arcgis.com/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [Bootstrap](http://getbootstrap.com/)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Anyone and everyone is welcome to contribute. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/bootstrap-map-js/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Bootstrap Responsive)
[](Esri Language: JavaScript)
