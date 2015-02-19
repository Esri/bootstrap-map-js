## Layer Control

A layer control widget for CMV. Just don't call it a TOC.

### Features

* Toggle layer visibility
* Layer menu with Zoom To Layer, Transparency and Layer Swipe
* Legends for ArcGIS service layers and csv
* Sublayer/folder structure and toggling for ArcGIS dynamic layers
  * can be disabled
  * single layer map services display legend in expand area
* Layer reordering in map and LayerControl widget
* Separate vector and overlay layers (required for layer reordering)
* Support for several layer types:
  * dynamic
  * feature
  * tiled
  * image
  * csv
  * georss

#### LayerControl in CMV

LayerControl can be easily loaded with CMV's widget loader. CMV creates an array with a `LayerInfo` object for each layer with parameters and options specific to the layer and its associated Control. `layerControlLayerInfos: true` tells the widget loader to include the `LayerInfos` array. LayerControl can also be used in your widget. See below for more Class information.

``` javascript
layerControl: {
    include: true,
    id: 'layerControl',
    type: 'titlePane',
    path: 'gis/dijit/LayerControl',
    title: 'Layers',
    open: true,
    position: 0,
    options: {
        map: true, //required
        layerControlLayerInfos: true //required
    }
}
```

Each layer has its own Control widget in LayerControl. Additional Control specific options can be specified with `layerControlLayerInfos`. See Control Options below. The similarity/difference in names is a bit confusing. A future release of CMV will use a different system for widgets to obtain layer options. Not only will core widgets like LayerControl and Identify no longer need a tie in with CMV's Controller class, developers will be able to specify custom options objects through CMV's layer loader for use with their own widgets.

**CMV Dynamic Layer Example**

``` javascript
{
    type: 'dynamic',
    url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
    title: 'Louisville Public Safety',
    options: {
        //layer options
    },
    layerControlLayerInfos: {
        sublayers: false,
        noTransparency: true
    }
}
```

**CMV Feature Layer Example**

``` javascript
{
    type: 'feature',
    url: 'http://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/MeetUpHomeTowns/FeatureServer/0',
    title: 'STLJS Meetup Home Towns',
    options: {
        //layer options
    },
    layerControlLayerInfos: {
        noLegend: true,
        noZoom: true
    }
}
```

### LayerControl Class

``` javascript
require(['gis/dijit/LayerControl'], function (LayerControl) {
    var layerControl = new LayerControl({
        map: map,
        separated: true,
        vectorReorder: true,
        overlayReorder: true
        layerInfos: [
            // see LayerInfos
        ]
    }, srcRefNode);
});
```

#### Widget Construction Parameters

| Parameter | Type | Description |
| :----: | :--: | ----------- |
| `map` | Object | `esri/map` instance. Required. |
| `layerInfos` | Array | Array of `LayerInfos`. Required. See LayerInfos. |
| `separated` | Boolean | Separate vector and overlay layer types. Required for `vectorReorder`, `vectorLabel`, `overlayReorder` and `overlayLabel`. Default is `false`. |
| `vectorReorder` | Boolean | Enable reordering of vector layers in map and Layer Control. Default is `false`. |
| `vectorLabel` | Mixed | Label for vector layers. Default is `false`. Pass the label or html for quick easy custom styling of label text. |
| `overlayReorder` | Boolean | Enable reordering of overlay layers in map and Layer Control. Default is `false`. |
| `overlayLabel` | Mixed | Label for overlay layers. Default is `false`. Pass the label or html for quick easy custom styling of label text. |
| `noMenu` | Boolean | When `true` no layer menu is created for all layers. Can be overridden for specific layer(s) with `noMenu` layer option. Note: menu related widget and layer control options, i.e. `noLegend`, have no effect when the layer menu is not created. |
| `noLegend` | Boolean | When `true` no legend is created for all layers. Can be overridden for specific layer(s) with `noLegend' layer option. |
| `noZoom` | Boolean | When `true` removes "Zoom to Layer" menu item for all layers. Can be overridden for specific layer(s) with `noZoom' layer option. |
| `noTransparency` | Boolean | When `true` removes "Transparency" menu item for all layers. Can be overridden for specific layer(s) with `noTransparency' layer option. |
| `swipe` | Boolean | When `true` adds "Layer Swipe" menu item for all layers.  Can be overridden for specific layer(s) with `swipe` layer option. |
| `swiperButtonStyle` | String | CSS for positioning "Exit Layer Swipe" button in the map. Must include `position:absolute;` and a `z-index`. Default is `position:absolute;top:20px;left:120px;z-index:50;`. |

#### Methods

| Method | Description |
| :----: | ----------- |
| `showAllLayers()` | Turn all layers on. |
| `hideAllLayers()` | Turn all layers off. |

#### LayerInfos

The `layerInfo` object contains configuration options for each layer control. LayerControl initializes each layer control using these parameters.

```javascript
{
    layer: layer,
    type: 'dynamic',
    title: 'EPA TMDL 303d Reaches',
    controlOptions: {
        // see Control Options
    }
}
```

#### LayerInfo Parameters

| Parameter | Type | Description |
| :----: | :--: | ----------- |
| `layer` | Mixed | A layer object OR layer id string. |
| `type` | String | Supports `dynamic`, `tiled`, `image` and `feature`. Additional layer types coming soon. |
| `title` | String | Title for the control. When loaded with CMV's widget loader this is the `title` option for the layer. |
| `controlOptions` | Object | Additional options for the layer control. See Control Options. |


### Control Options

All layer types have common options while some options are specific to certain layer types. All `controlOptions` are Boolean.

| Option | Description | Affects |
| :----: | ----------- | ------- |
| `exclude` | When `true` a layer control will not be added to the widget. Using `exclude` for a layer with layer reordering enabled which is not above or below all included layers will result in layer reordering issues. | all layers |
| `noMenu` |  When `true` no layer menu is created. Set to `false` to override `noMenu: true` widget parameter. | all layers |
| `noLegend` |  When `true` no legend is created. Set to `false` to override `noLegend: true` widget parameter. | dynamic, feature and tiled |
| `noZoom` | When `true` removes "Zoom to Layer" menu item. Set to `false` to override `noZoom: true` widget parameter. | all layers |
| `noTransparency` | When `true` removes "Transparency" menu item. Set to `false` to override `noTransparency: true` widget parameter. | all layers |
| `swipe` | When `true` adds "Layer Swipe" menu item. Set to `false` to override `swipe: true` widget parameter. | all layers |
| `swipeScope` | When `true` adds Scope option to Layer Swipe menu. Default is `false`. |
| `expanded` | When `true` expands top level exposing sublayers or legend. | dynamic, feature & tiled |
| `sublayers` | When `false` dynamic folder/sublayer structure is not created. | dynamic |
| `metadataUrl` | When `true` and layer has `url` property (ArcGIS layers) links to service URL. When a URL links to said URL. | all layers |
| `allSublayerToggles` | When `false` toggle all sublayers on/off layer menu items will not be included. | dynamic |

### Topics

Subscribe to any of the following topics. CMV aims to please, so let us know if you would like a topic published for a particular user action, or layer/layer control state change.

`layerControl/layerToggle` is published when layer visibility changes via the layer checkbox.

```javascript
topic.subscribe('layerControl/layerToggle', function (r) {
    console.log(r.id); //layer id
    console.log(r.visible); //layer visibility (true/false)
});
```

`layerControl/setVisibleLayers` is published when visible layers are set on a dynamic layer.

```javascript
topic.subscribe('layerControl/setVisibleLayers', function (r) {
    console.log(r.id); //layer id
    console.log(r.visibleLayers); //array of set visible layer ids
});
```

**GeoRSSLayer Bug**

GeoRSSLayer `visible` property initially `true` whether the layer is visible or not. The result is the layer checkbox is checked with layer option `visible: false`. It's been reported and is what it is until fixed.

#### Layer Control TODO

Do not include this section in docs outside this file. May not reflect all issues and enhancements in the repo.

1. Support all layer types CMV supports (kml, stream, wms)
2. Method by which to add custom layer menu items
3. Integrate with new layer options for widgets system
4. Optional plugins for leveraging layer manipulation capabilities, e.g. ui for user to change rendering on image layer, change renderer for user added shape file or CSV, etc.
