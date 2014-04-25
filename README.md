# Bootstrap Map JS

Bootstrap Map JS is a simple framework for building responsive mapping applications with the [ArcGIS API for JavaScript](http://developers.arcgis.com) and [Bootstrap (ver 3.x)](http://getbootstrap.com).  With just a few lines of css and js you can build a rich web-mobile application that will work on any device.  

[View documentation and examples](http://esri.github.com/bootstrap-map-js/demo/index.html)

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
* \src\css\bootstrapmap.css
* \src\js\bootstrapmap.js 
* \src\images\popup.png 
* \demo\
* \templates\... 

## Example

```
<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap Map Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- Bootstrap -->
    <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet" media="screen">

    <!-- Step 1. Add CSS for the mapping components -->
    <link rel="stylesheet" type="text/css" href="http://js.arcgis.com/3.9/js/esri/css/esri.css">   
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

    <!-- Step 2. Add HTML to define the layout of the page and the map -->
    <div class="container" style="padding:15px;">
      <div class="row">
        <div class="col-xs-8">
          <div id="mapDiv"></div>
        </div>
        <div class="col-xs-4">                
          <h5>Right 4</h5>
          <p>content</p>
          <p>content</p>
          <p>content</p>
        </div>
      </div>
    </div>

    <!-- Step 3. Load the responsive map -->
    <script type="text/javascript">
        var package_path = "//esri.github.com/bootstrap-map-js/src/js";
        var dojoConfig = {
            packages: [{
                name: "application",
                location: package_path
            }]
        };
    </script>
    <script src="http://js.arcgis.com/3.9compact"></script>
    <script>
      require(["application/bootstrapmap", "dojo/domReady!"], 
        function(BootstrapMap) {
          <!-- Get a reference to the ArcGIS Map class -->
          var map = BootstrapMap.create("mapDiv",{
            basemap:"national-geographic",
            center:[-122.45,37.77],
            zoom:12,
            scrollWheelZoom: false
          });
      });
    </script>

    <!-- jQuery (for Bootstrap's JavaScript plugins) -->
    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <!-- Include all  plugins or individual files as needed -->
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
  </body>
</html>
```

## Documentation

Visit the [Getting Started Guide](http://esri.github.io/bootstrap-map-js/demo/getstarted.html)

## Requirements

* [ArcGIS API for JavaScript](http://developers.arcgis.com)
* [Bootstrap ver 3.x](http://getbootstrap.com)
* [Bootstrap Map JS](http://esri.github.com/bootstrap-map-js/)

## Resources

* [ArcGIS for JavaScript API](http://developers.arcgis.com/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [Bootstrap](http://getbootstrap.com/)

## Developer Notes

* Responsive Map: You can only have one responsive map per page. You can have as many maps as you want that are fixed in size however.
* ScrollwheelZoom: To enable scrollwheel zoom, set ```scrollWheelZoom: true``` in the constructor. A scrolling map will "slip" however if the page is larger than the viewport, therefore, this is set to ```false``` by default.
* IE8 Support: Add the following shims to support IE8.  For more information visit [getbootstrap.com](http://getbootstrap.com/getting-started/#support).

    ```
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    ``` 
* Learn more about the Bootstrap framework [here](http://getbootstrap.com).

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
