# Bootstrap Map JS

**NOTE: If you are looking for a modern Bootstrap framework to build map apps with a fully integrated Sass build and newer styles, please see [Calcite Maps](https://github.com/Esri/calcite-maps). Calcite Maps will replace this project over time.**

A light-weight extension for building responsive web mapping apps with the [ArcGIS API for JavaScript](http://developers.arcgis.com) and [Bootstrap (ver 3.x)](http://getbootstrap.com). Maps will automatically resize and recenter as the screen size changes or they can be set to a fixed size. Pop-ups will stay within the screen view and are styled to match Bootstrap. Apps can be developed with Dojo and jQuery or just pure Dojo.

[View demo app and examples](http://esri.github.com/bootstrap-map-js/demo/index.html)

[View more examples](https://github.com/Esri/quickstart-map-js)

## Features

* Responsive map resizing
* Auto-recentering
* Responsive pop-ups
* Styled ArcGIS widgets
* Touch behavior for mobile devices
* Media queries
* Demos with the bootstrap grid system and web components
* Starter templates

NOTE: Feel free to contribute new templates to this repo!

![App](https://raw.github.com/Esri/bootstrap-map-js/master/bootstrapmapjs.png)

## What's included

This repository contains the following:

	boostrap-map-js/
	├──dist/
	│  ├──js/
	│  │  └──bootstrapmap.min.js
 	│  └──css/
 	│     └──bootstrapmap.min.css
	├──src/
	│  ├──css/
	│  │  └──bootstrapmap.css
	│  └──js/
	│     └──bootstrapmap.js 
	├──demo/
	└──templates/ 

## Example

``` HTML
<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap Map Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <!-- Step 1. Add CSS for Bootstrap, ArcGIS and Bootstrap-map-js -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link rel="stylesheet" type="text/css" href="//js.arcgis.com/3.13/esri/css/esri.css">   
    <link rel="stylesheet" type="text/css" href="http://esri.github.io/bootstrap-map-js/src/css/bootstrapmap.css">   
    <style>
      /* Set the responsive map size here */
      #mapDiv {
        min-height:100px; 
        max-height:500px; 
      }
    </style>

  </head>
  <body>

    <!-- Step 2. Add HTML to define the layout of the map and page -->
    <div class="container" style="padding:15px;">
      <div class="row">
        <div class="col-xs-12">
          <h5>Title</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-8">
          <div id="mapDiv"></div>
        </div>
        <div class="col-xs-4">                
          <h5>Legend</h5>
          <p>content</p>
          <p>content</p>
          <p>content</p>
        </div>
      </div>
    </div>

    <!-- Step 3. Add JS to Load the responsive map -->
    <script type="text/javascript">
        var package_path = "//esri.github.com/bootstrap-map-js/src/js";
        var dojoConfig = {
            packages: [{
                name: "application",
                location: package_path
            }]
        };
    </script>
    <script src="//js.arcgis.com/3.13compact"></script>
    <script>
      require(["application/bootstrapmap", "dojo/domReady!"], 
        function(BootstrapMap) {
          // Get a reference to the ArcGIS Map class
          var map = BootstrapMap.create("mapDiv",{
            basemap:"national-geographic",
            center:[-122.45,37.77],
            zoom:12,
            scrollWheelZoom: false
          });
      });
    </script>

    <!-- jQuery (for Bootstrap's JavaScript plugins). NOTE: You can also use pure Dojo. See examples. -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all  plugins or individual files as needed -->
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
  </body>
</html>
```

## Documentation

Visit the [Getting Started Guide](http://esri.github.io/bootstrap-map-js/demo/index.html)

## Requirements

* [ArcGIS API for JavaScript](http://developers.arcgis.com)
* [Bootstrap ver 3.x](http://getbootstrap.com)
* Either [jQuery](http://jquery.com/) or [Dojo-Bootstrap](https://github.com/xsokev/Dojo-Bootstrap)
* [Bootstrap Map JS](http://esri.github.com/bootstrap-map-js/)

## Resources

* [ArcGIS for JavaScript API](http://developers.arcgis.com/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [Bootstrap](http://getbootstrap.com/)
* [Dojo-Bootstrap](https://github.com/xsokev/Dojo-Bootstrap)

## Developer Notes

* Bootstrapmap.css Only: If you just want to use the styles and popup formatting, and you don't care about a responsive map, just reference bootstrapmap.css in your projects. Take a look at these [examples](https://github.com/Esri/quickstart-map-js) to get see how to do this.
* Responsive Map: You can only have one responsive map per page. You can have as many maps as you want that are fixed in size however.
* ScrollwheelZoom: To enable scrollwheel zoom, set ```scrollWheelZoom: true``` in the constructor. A scrolling map will "slip" however if the page is larger than the viewport, therefore, this is set to ```false``` by default.
* IE8 Support: Add the following shims to support IE8.  For more information visit [getbootstrap.com](http://getbootstrap.com/getting-started/#support).

    ``` HTML
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    ``` 
* Learn more about the Bootstrap framework [here](http://getbootstrap.com).

## Build Instructions

Make sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone bootstrap-map-js](https://help.github.com/articles/fork-a-repo)
2. `cd` to the `bootstrap-map-js/` folder. 
3. Install the dependencies with `npm install`.
4. Run `grunt` from the command line. This will create a new minimized build in the `dist/` folder.

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
