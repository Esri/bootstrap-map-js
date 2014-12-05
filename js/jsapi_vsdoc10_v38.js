esri = function () {
    /// <summary>The esri namespace.</summary>
};





esri.hide = function (element) {
    /// <summary>Hides an HTML element such as a DIV or TABLE</summary>
    /// <param name="element" type="Element" optional="false">The name of the HTML element.</param>
};

esri.show = function (element) {
    /// <summary>Shows an HTML element such as a DIV or TABLE</summary>
    /// <param name="element" type="Element" optional="false">The name of the HTML element.</param>
};

esri.toggle = function (element) {
    /// <summary>If an HTML element is currently visible, the element is hidden.</summary>
    /// <param name="element" type="Element" optional="false">The name of the HTML element.</param>
};



esri.getGeometries = function (graphics) {
    /// <summary>Converts an array of graphics to an array of geometries.</summary>
    /// <param name="graphics" type="Graphic[]" optional="false">Array of graphics to convert to geometries</param>
    /// <return type="Geometry[]">Geometry[]</return>
};

esri.graphicsExtent = function (graphics) {
    /// <summary>Utility function that returns the extent of an array of graphics.</summary>
    /// <param name="graphics" type="Graphic[]" optional="false">The input graphics array.</param>
    /// <return type="Extent">Extent</return>
};





esri.filter = function (object,callback,thisObject) {
    /// <summary>Creates a new object with all properties that pass the test implemented by the filter provided in the function</summary>
    /// <param name="object" type="Object" optional="false">Object to filter.</param>
    /// <param name="callback" type="Function" optional="false">Function or string implementing the filtering.</param>
    /// <param name="thisObject" type="Object" optional="false">Optional object used to scope the call to the callback.</param>
    /// <return type="Object">Object</return>
};

esri.isDefined = function (value) {
    /// <summary>Returns true when the value is neither null or undefined.</summary>
    /// <param name="value" type="Object" optional="false">The value to test.</param>
    /// <return type="Boolean">Boolean</return>
};

esri.substitute = function (data,template,first) {
    /// <summary>A wrapper around dojo.string.substitute that can also handle wildcard substitution.</summary>
    /// <param name="data" type="Object" optional="false">The data object used in the substitution.</param>
    /// <param name="template" type="String" optional="true">The template used for the substitution. Can be any valid HTML. If no template is included, the wildcard template is used.</param>
    /// <param name="first" type="Boolean" optional="true">When true, returns only the first property found in the data object. The default is false.</param>
    /// <return type="String">String</return>
};

esri.valueOf = function (array,value) {
    /// <summary>Iterates through the argument array and searches for the identifier to which the argument value matches.</summary>
    /// <param name="array" type="Array" optional="false">The argument array for testing.</param>
    /// <param name="value" type="Object" optional="false">The value used in the search. If the value is a String, the value is case sensitive.</param>
    /// <return type="Object">Object</return>
};



esri.request = function (request,options) {
    /// <summary>Retrieve data from a remote server or upload a file from a user's computer.</summary>
    /// <param name="request" type="Object" optional="false">request argument is an object with the following properties that describe the request. Property Name Type Description url String Request URL. (required) content Object If the request url points to a web server that requires parameters, specify them here. The default value is null. form Object If the request is to upload a file, specify the form element that contains the file input control here. The default value is null. Starting at version 3.3, the form parameter can be an instance of FormData. Using FormData you can send a "multipart/form-data" request to the server without having to create an HTML form element in markup. Note that the FormData api is not available in all browsers. handleAs String Response format. Valid values are 'json', 'xml', 'text'. The default value is 'json'. callbackParamName String Name of the callback parameter (a special service parameter) to be specified when requesting data in JSONP format. It is ignored for all other data formats. For ArcGIS services the value is always 'callback'. timeout Number Indicates the amount of time to wait for a response from the server. The default is 60000 milliseconds (one minute). Set to 0 to wait indefinitely. </param>
    /// <param name="options" type="Object" optional="true">options argument is an object with the following properties representing various options supported by this function. Property Name Type Description	usePost	Boolean Indicates the request should be made using HTTP POST method. Default is false i.e., determined automatically based on the request size. 	useProxy	Boolean Indicates the request should use the proxy. Default is false i.e., determined automatically based on the domain of the request url	disableIdentityLookup	Boolean If true, prevents esri.request from triggering user authentication for this request. Default is false i.e., user authentication will be performed if asked by the server. </param>
    /// <return type="dojo.Deferred">dojo.Deferred</return>
};

esri.request.setRequestPreCallback = function () {
    /// <summary>Define a callback function that will be called just before esri.request calls into dojo IO functions such as dojo.rawXhrPost and dojo.io.script.get.</summary>
};



esri.addProxyRule = function (rule) {
    /// <summary>Adds the given proxy rule to the proxy rules list: esri.config.defaults.io.proxyRules.</summary>
    /// <param name="rule" type="Object" optional="false">The rule argument should have the following properties:proxyUrl - URL for the proxy.urlPrefix - URL prefix for resources that need to be accessed through the given proxy.</param>
    /// <return type="Number">Number</return>
};

esri.getProxyRule = function () {
    /// <summary>Returns the proxy rule that matches the given url</summary>
    /// <return type="Object">Object</return>
};

esri.urlToObject = function (url) {
    /// <summary>Converts the URL arguments to an object representation.</summary>
    /// <param name="url" type="String" optional="false">The input URL.</param>
    /// <return type="Object">Object</return>
};

esri.Credential = function () {

    /// <field name="expires" type="String">Token expiration time specified as number of milliseconds since 1 January 1970 00:00:00 UTC</field>
    /// <field name="isAdmin" type="Boolean">Indicates whether this credential belongs to a user with admin privileges</field>
    /// <field name="server" type="String">The server url</field>
    /// <field name="ssl" type="Boolean">Indicates whether the resources accessed using this credential should be fetched over HTTPS protocol</field>
    /// <field name="token" type="String">Token generated by the token service using the specified userId and password</field>
    /// <field name="userId" type="String">User associated wth the Credential object</field>
};

esri.Credential.prototype = 
{
    destroy: function () {
        /// <summary>Destroy a credential.</summary>
    },
    refreshToken: function () {
        /// <summary>Generate a new token and update the Credential's token property with the newly acquired token.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    toJson: function () {
        /// <summary>Return the properties of this object in JSON</summary>
        /// <return type="Object">Object</return>
    },
};

esri.Graphic = function (geometry,symbol,attributes,infoTemplate) {
    /// <summary>Creates a new Graphic object.</summary>
    /// <param name="geometry" type="Geometry" optional="false">The geometry that defines the graphic.</param>
    /// <param name="symbol" type="Symbol" optional="false">Symbol used for drawing the graphic.</param>
    /// <param name="attributes" type="Object" optional="false">Name value pairs of fields and field values associated with the graphic.</param>
    /// <param name="infoTemplate" type="InfoTemplate" optional="false">The content for display in an InfoWindow.</param>
    /// <field name="attributes" type="Object">Name value pairs of fields and field values associated with the graphic</field>
    /// <field name="geometry" type="Geometry">The geometry that defines the graphic</field>
    /// <field name="infoTemplate" type="InfoTemplate">The content for display in an InfoWindow</field>
    /// <field name="symbol" type="Symbol">The symbol for the graphic</field>
    /// <field name="visible" type="Boolean">Indicate the visibility of the graphic.</field>
};

esri.Graphic.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the graphic's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Graphic">Graphic</return>
    },
    draw: function () {
        /// <summary>Draws the graphic</summary>
        /// <return type="Graphic">Graphic</return>
    },
    getContent: function () {
        /// <summary>Returns the content string based on attributes and infoTemplate values</summary>
        /// <return type="String">String</return>
    },
    getDojoShape: function () {
        /// <summary>Returns the Dojo gfx shape of the ESRI graphic.</summary>
        /// <return type="dojox.gfx.Shape">dojox.gfx.Shape</return>
    },
    getInfoTemplate: function () {
        /// <summary>Returns the info template associated with the graphic.</summary>
        /// <return type="InfoTemplate">InfoTemplate</return>
    },
    getInfoTemplate: function () {
        /// <summary>Returns the info template associated with the graphic</summary>
        /// <return type="InfoTemplate">InfoTemplate</return>
    },
    getLayer: function () {
        /// <summary>Returns the graphics layer that contains the graphic.</summary>
        /// <return type="GraphicsLayer">GraphicsLayer</return>
    },
    getNode: function () {
        /// <summary>Returns the DOM node used to draw the graphic.</summary>
        /// <return type="SVG Graphics or Group Element | VML Shape or Group Element">SVG Graphics or Group Element | VML Shape or Group Element</return>
    },
    getNodes: function () {
        /// <summary>Returns one or more DOM nodes used to draw the graphic.</summary>
        /// <return type="SVG Graphics or Group Elements | VML Shapes or Group Elements">SVG Graphics or Group Elements | VML Shapes or Group Elements</return>
    },
    getShape: function () {
        /// <summary>Returns the Dojo gfx shape of the ESRI graphic.</summary>
        /// <return type="dojox.gfx.Shape">dojox.gfx.Shape</return>
    },
    getShapes: function () {
        /// <summary>Returns one or more Dojo GFX shapes used to draw the graphic.</summary>
        /// <return type="dojox.gfx.Shape[]">dojox.gfx.Shape[]</return>
    },
    getTitle: function () {
        /// <summary>Returns the title string based on attributes and infoTemplate values</summary>
        /// <return type="String">String</return>
    },
    hide: function () {
        /// <summary>Hides the graphic</summary>
    },
    setAttributes: function (attributes) {
        /// <summary>Defines the attributes of the graphic</summary>
        /// <param name="attributes" type="Object" optional="false">The name value pairs of fields and field values associated with the graphic.</param>
        /// <return type="Graphic">Graphic</return>
    },
    setGeometry: function (geometry) {
        /// <summary>Defines the geometry of the graphic</summary>
        /// <param name="geometry" type="Geometry" optional="false">The geometry that defines the graphic.</param>
        /// <return type="Graphic">Graphic</return>
    },
    setInfoTemplate: function (infoTemplate) {
        /// <summary>Defines the InfoTemplate for the InfoWindow of the graphic.</summary>
        /// <param name="infoTemplate" type="InfoTemplate" optional="false">The content for display in an InfoWindow.</param>
        /// <return type="Graphic">Graphic</return>
    },
    setSymbol: function (symbol) {
        /// <summary>Sets the symbol of the graphic</summary>
        /// <param name="symbol" type="Symbol" optional="false">The symbol for the graphic.</param>
        /// <return type="Graphic">Graphic</return>
    },
    show: function () {
        /// <summary>Shows the graphic</summary>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.IdentityManager = function () {

    /// <field name="dialog" type="dijit.Dialog">Dialog box widget used to challenge the user for their credentials when the application attempts to access a secure resource.</field>
};

esri.IdentityManager.prototype = 
{
    signIn: function () {
        /// <summary>This method is called by the base identity manager implementation.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.IdentityManagerBase = function () {

    /// <field name="tokenValidity" type="Number">The suggested lifetime of the token in minutes.</field>
};

esri.IdentityManagerBase.prototype = 
{
    findCredential: function (url,userId) {
        /// <summary>Returns the credential for the resource identified by the specified url.</summary>
        /// <param name="url" type="String" optional="false">The url to a server.</param>
        /// <param name="userId" type="String" optional="true">The userId for which you want to obtain credentials.</param>
        /// <return type="Credential">Credential</return>
    },
    findServerInfo: function (url) {
        /// <summary>Returns information about the server that is hosting the specified url</summary>
        /// <param name="url" type="String" optional="false">The url to a server.</param>
        /// <return type="ServerInfo">ServerInfo</return>
    },
    generateToken: function (serverInfo,userInfo,options) {
        /// <summary>Returns an object containing a token and its expiration time.</summary>
        /// <param name="serverInfo" type="ServerInfo" optional="false">A ServerInfo object that contains a token service URL.</param>
        /// <param name="userInfo" type="Object" optional="false">A user info object containing a user name and password.</param>
        /// <param name="options" type="Object" optional="true">Optional parameters. (As of 3.0). &#60;Boolean&#62; isAdmin Indicate that the token should be generated using the token service deployed with the ArcGIS Server Admin API. The default value is false. </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getCredential: function (url,options) {
        /// <summary>Returns a Credential object that can be used to access the secured resource identified by the input url.</summary>
        /// <param name="url" type="String" optional="false">The url for the secure resource.</param>
        /// <param name="options" type="Object" optional="true">Optional parameters. (As of 3.0). &#60;Boolean&#62; retry Determines if the method should make additional attempts to get the credentials after a failure. &#60;String&#62; token Token used for a previous unsuccessful attempt to fetch the given url &#60;Error&#62; error Error object returned by the server from a previous attempt to fetch the given url. </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    initialize: function (json) {
        /// <summary>Call this method (during your application initialization) with JSON previously obtained from toJson method to re-hydrate the state of identity manager</summary>
        /// <param name="json" type="Object" optional="false">The JSON obtained from the toJson method.</param>
        /// <return type="Object">Object</return>
    },
    isBusy: function () {
        /// <summary>Returns true if the identity manager is busy accepting user input, i.e.</summary>
        /// <return type="Boolean">Boolean</return>
    },
    registerServers: function (serverInfos) {
        /// <summary>Register secure servers and the token endpoints</summary>
        /// <param name="serverInfos" type="ServerInfo[]" optional="false">A ServerInfos object that defines the secure service and token endpoint. The Identity Manager makes its best guess to determine the locatation of the secure server and token endpoint so in most cases calling registerServers is not necessary. However if the location of your server or token endpoint is non-standard use this method to register the location.</param>
    },
    registerToken: function (properties) {
        /// <summary>Registers the given OAuth2 access token with the identity manager.An access token can be obtained after the user logs in to ArcGIS Online through your application.</summary>
        /// <param name="properties" type="Object" optional="false">An object with the following properties:&#60;String&#62; serverThis is the root URL for the ArcGIS Online REST APIhttp://www.arcgis.com/sharing/rest&#60;String&#62; tokenThe access token.&#60;String&#62; userIdThe id for the user who owns the access token.&#60;Number&#62; expiresToken expiration time specified as number of milliseconds since 1 January 1970 00:00:00 URC.&#60;Boolean&#62; sslSet this to true if the user has an ArcGIS Online Organizational Account and the organization is configured to allow access to resources only through SSL. </param>
    },
    setProtocolErrorHandler: function (handlerFunction) {
        /// <summary>When accessing secured resources, identity manager may prompt for username and password and send them to the server using a secure connection.</summary>
        /// <param name="handlerFunction" type="Function" optional="false">The function to call when the protocol is mismatched.</param>
    },
    setRedirectionHandler: function (handler) {
        /// <summary>When accessing secure resources from ArcGIS.com or one of its sub-domains the IdentityManager redirects the user to the ArcGIS.com sign-in page.</summary>
        /// <param name="handler" type="Object" optional="false">An object containing the following redirection properties: &#60;String&#62; resourceUrl The URL of the secure resource that triggers the redirection to the ArcGIS.com sign-in page. &#60;ServerInfo&#62; serverInfo ServerInfo object describing the server where the secure resource is hosted. &#60;String&#62; signInPage URL of the sign-in page where users will be redirected. &#60;String&#62; returnUrlParamName The application URL where the sign-in page redirects after a successful log-in. To create the return URL append the application's URL to signInPage as a parameter. returnUrlParamName contains the name of the parameter. </param>
    },
    signIn: function (url,serverInfo,options) {
        /// <summary>Sub-classes must implement this method to create and manager the user interface that is used to obtain a username and password from the end-user.</summary>
        /// <param name="url" type="String" optional="false">Url for the secure resource.</param>
        /// <param name="serverInfo" type="ServerInfo" optional="false">A ServerInfo object that contains the token service url.</param>
        /// <param name="options" type="Object" optional="true">Optional parameters. (As of 3.0). &#60;Error&#62; error Error object returned by the server from a previous attempt to fetch the given url. &#60;Boolean&#62; isAdmin Indicate that the token should be generated using the token service deployed with the ArcGIS Server Admin API. The default value is false. &#60;String&#62; token Token used for previous unsuccessful attempts to fetch the given url </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    toJson: function () {
        /// <summary>Return properties of this object in JSON.It can be stored in a Cookie or persisted in HTML5 LocalStorage and later used to:Initialize the IdentityManager the next time user opens your application.Share the state of identity manager between multiple web pages of your website.This way your users won't be asked to sign in repeatedly when they launch your app multiple times or when navigating between multiple web pages in your website</summary>
        /// <return type="Object">Object</return>
    },
};

esri.InfoTemplate = function () {
    /// <summary>Creates a new empty InfoTemplate object</summary>
    /// <field name="content" type="String |Function">The template for defining how to format the content used in an InfoWindow.</field>
    /// <field name="title" type="String|Function">The template for defining how to format the title used in an InfoWindow.You can format the title by specifying either a string value or a function.</field>
};

esri.InfoTemplate.prototype = 
{
    setContent: function (template) {
        /// <summary>Sets the content template.</summary>
        /// <param name="template" type="String|Function" optional="false">The template for the content.</param>
        /// <return type="InfoTemplate">InfoTemplate</return>
    },
    setTitle: function (template) {
        /// <summary>Sets the title template.</summary>
        /// <param name="template" type="String|Function" optional="false">The template for the title.</param>
        /// <return type="InfoTemplate">InfoTemplate</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.InfoWindowBase = function () {

    /// <field name="domNode" type="Object">The reference to a DOM node where the info window is constructed.</field>
    /// <field name="isShowing" type="Boolean">Indicates if the info window is visible.</field>
};

esri.InfoWindowBase.prototype = 
{
    destroyDijits: function () {
        /// <summary>Helper method.</summary>
    },
    hide: function () {
        /// <summary>Hide the info window.</summary>
    },
    place: function (value,parentNode) {
        /// <summary>Helper method.</summary>
        /// <param name="value" type="String|DomNode" optional="false">A string with HTML tags or a DOM node.</param>
        /// <param name="parentNode" type="DOMNode" optional="false">The parent node where the value will be placed.</param>
    },
    resize: function (width,height) {
        /// <summary>Resize the info window to the specified width and height (in pixels).Sub-classes should implement this method</summary>
        /// <param name="width" type="Number" optional="false">The new width of the InfoWindow in pixels.</param>
        /// <param name="height" type="Number" optional="false">The new height of the InfoWindow in pixels.</param>
    },
    setContent: function (content) {
        /// <summary>Define the info window content.</summary>
        /// <param name="content" type="String|Object" optional="false">The content argument can be any of the following.See the Info Template content property for details. String Text to display in the info window, can include HTML tags to format and organize the content. "This oil well has produced 100,000 bbls since 2005. Reference to an HTML element See the Info Window content property for details. Deferred object A deferred object represents a value that may not be immediately available. Your implementation should wait for the results to become available by assigning a callback function to the deferred object. </param>
    },
    setMap: function (map) {
        /// <summary>This method is called by the map when the object is set as its info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
    setTitle: function (title) {
        /// <summary>Set the input value as the title for the info window.</summary>
        /// <param name="title" type="String|Object" optional="false"> In most cases the title will be a string value but the same options are available as for the setContent method.</param>
    },
    show: function (location) {
        /// <summary>Display the info window at the specified location.</summary>
        /// <param name="location" type="Point" optional="false"> Location is an instance of esri.geometry.Point. If the location has a spatial reference, it is assumed to be in map coordinates otherwise screen coordinates are used. Screen coordinates are measured in pixels from the top-left corner of the map control. To convert between map and screen coordinates use Map.toMap and Map.toScreen.</param>
    },
    startupDijits: function () {
        /// <summary>Helper method.</summary>
    },
    unsetMap: function (map) {
        /// <summary>This method is called by the map when the object is no longer the map's info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
};

esri.Map = function (divId,options) {
    /// <summary>Creates a new map inside of the given HTML container, which is often a DIV element.</summary>
    /// <param name="divId" type="String" optional="false">Container id for the referencing map. Required.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;Number&#62; attributionWidth&#10;
    /// &#60;Boolean&#62; autoResize&#10;
    /// &#60;String&#62; basemap&#10;
    /// &#60;Number[] | Point&#62; center&#10;
    /// &#60;Boolean&#62; displayGraphicsOnPan&#10;
    /// &#60;Extent&#62; extent&#10;
    /// &#60;Boolean&#62; fadeOnZoom&#10;
    /// &#60;Boolean&#62; fitExtent&#10;
    /// &#60;Boolean&#62; force3DTransforms&#10;
    /// &#60;InfoWindowBase&#62; infoWindow&#10;
    /// &#60;LOD[]&#62; lods&#10;
    /// &#60;Boolean&#62; logo&#10;
    /// &#60;Number&#62; maxScale&#10;
    /// &#60;Number&#62; maxZoom&#10;
    /// &#60;Number&#62; minScale&#10;
    /// &#60;Number&#62; minZoom&#10;
    /// &#60;Boolean&#62; nav&#10;
    /// &#60;String&#62; navigationMode&#10;
    /// &#60;Boolean&#62; optimizePanAnimation&#10;
    /// &#60;Number&#62; resizeDelay&#10;
    /// &#60;Number&#62; scale&#10;
    /// &#60;Boolean&#62; showAttribution&#10;
    /// &#60;Boolean&#62; showInfoWindowOnClick&#10;
    /// &#60;Boolean&#62; slider&#10;
    /// &#60;String[]&#62; sliderLabels&#10;
    /// &#60;String&#62; sliderOrientation&#10;
    /// &#60;String&#62; sliderPosition&#10;
    /// &#60;String&#62; sliderStyle&#10;
    /// &#60;Boolean&#62; wrapAround180&#10;
    /// &#60;Number&#62; zoom</param>
    /// <field name="attribution" type="Attribution">Reference to the attribution widget created by the map when map attribution is enabled</field>
    /// <field name="autoResize" type="Boolean">Value is true when the map automatically resizes if the browser window or ContentPane widget enclosing the map is resized.</field>
    /// <field name="extent" type="Extent">The current extent of the map in map units.</field>
    /// <field name="fadeOnZoom" type="Boolean">Indicates if the fade effect is enabled while zooming.</field>
    /// <field name="force3DTransforms" type="Boolean">When the mapNavigation mode is set to 'css-transforms', CSS3 transforms will be used for map navigation when supported by the browser.</field>
    /// <field name="geographicExtent" type="Extent">The extent (or bounding box) of the map in geographic coordinates.</field>
    /// <field name="graphics" type="GraphicsLayer">Provides access to the Map's GraphicsLayer.</field>
    /// <field name="graphicsLayerIds" type="String[]">An array of the current GraphicsLayers in the map</field>
    /// <field name="height" type="Number">Current height of the map in screen pixels.</field>
    /// <field name="id" type="String">Reference to HTML DIV or other element where the map is placed on the page.</field>
    /// <field name="infoWindow" type="Popup">Displays the InfoWindow on a map</field>
    /// <field name="isClickRecenter" type="Boolean">When true, the key sequence of shift then click to recenter the map is enabled.</field>
    /// <field name="isDoubleClickZoom" type="Boolean">When true, double click zoom is enabled.</field>
    /// <field name="isKeyboardNavigation" type="Boolean">When true, keyboard navigation is enabled.</field>
    /// <field name="isPan" type="Boolean">When true, map panning is enabled using the mouse.</field>
    /// <field name="isPanArrows" type="Boolean">When true, pan arrows are displayed around the edge of the map.</field>
    /// <field name="isRubberBandZoom" type="Boolean">When true, rubberband zoom is enabled.</field>
    /// <field name="isScrollWheelZoom" type="Boolean">When true, the mouse scroll wheel zoom is enabled.</field>
    /// <field name="isShiftDoubleClickZoom" type="Boolean">When true, shift double click zoom is enabled.</field>
    /// <field name="isZoomSlider" type="Boolean">When true, the zoom slider is displayed on the map.</field>
    /// <field name="layerIds" type="String[]">Array of current TiledMapServiceLayers and DynamicMapServiceLayers added to the map</field>
    /// <field name="loaded" type="Boolean">After the first layer is loaded, the value is set to true</field>
    /// <field name="navigationMode" type="String">Indicates whether the map uses CSS3 transformations when panning and zooming.</field>
    /// <field name="position" type="Point">This point geometry in screen coordinates represent the top-left corner of the map container.</field>
    /// <field name="root" type="DOMNode">The DOM node that contains the container of layers, build-in info window, logo and slider</field>
    /// <field name="showAttribution" type="Boolean">When true, map attribution is enabled</field>
    /// <field name="snappingManager" type="SnappingManager">If snapping is enabled on the map using map.enableSnapping() this property provides access to the SnappingManager.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map.</field>
    /// <field name="timeExtent" type="TimeExtent">The current TimeExtent for the map.</field>
    /// <field name="visible" type="Boolean">Indicates whether map is visible</field>
    /// <field name="width" type="Number">Current width of the map in screen pixels.</field>
};

esri.Map.prototype = 
{
    addLayer: function (layer,index) {
        /// <summary>Adds an ESRI Layer to the map.The 0 return object of Layer was added at v1.4.</summary>
        /// <param name="layer" type="Layer" optional="false">Layer to be added to the map.</param>
        /// <param name="index" type="Number" optional="true">A layer can be added at a specified index in the map. If no index is specified or the index specified is greater than the current number of layers, the layer is automatically appended to the list of layers in the map and the index is normalized. (As of v1.3) </param>
        /// <return type="Layer">Layer</return>
    },
    addLayers: function (layers) {
        /// <summary>Adds multiple layers to a map.</summary>
        /// <param name="layers" type="Layer[]" optional="false">Layers to be added to the map.</param>
    },
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the map container.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Map">Map</return>
    },
    centerAndZoom: function (mapPoint,levelOrFactor) {
        /// <summary>Centers and zooms the map.</summary>
        /// <param name="mapPoint" type="Point" optional="false">Centers the map on the specified x,y location. Starting at version 3.3, the mapPoint can be an array of longitude/latitude pairs.</param>
        /// <param name="levelOrFactor" type="Number" optional="false">When using an ArcGISTiledMapServiceLayer, the map is zoomed to the level specified. When using a DynamicMapServiceLayer, the map is zoomed in or out by the specified factor. For example, use 0.5 to zoom in twice as far and 2.0 to zoom out twice as far.</param>
        /// <return type="Deferred">Deferred</return>
    },
    centerAt: function (mapPoint) {
        /// <summary>Centers the map based on map coordinates as the center point.</summary>
        /// <param name="mapPoint" type="Point" optional="false">Centers the map on the specified x,y location. Starting at version 3.3 this value can be an array of longitude/latitude pairs.</param>
        /// <return type="Deferred">Deferred</return>
    },
    destroy: function () {
        /// <summary>Destroys the map instance.</summary>
    },
    disableClickRecenter: function () {
        /// <summary>Disallows clicking on a map to center it.</summary>
    },
    disableDoubleClickZoom: function () {
        /// <summary>Disallows double clicking on a map to zoom in a level and center the map.</summary>
    },
    disableKeyboardNavigation: function () {
        /// <summary>Disallows panning and zooming using the keyboard.</summary>
    },
    disableMapNavigation: function () {
        /// <summary>Disallows all map navigation except the slider and pan arrows.</summary>
    },
    disablePan: function () {
        /// <summary>Disallows panning a map using the mouse.</summary>
    },
    disableRubberBandZoom: function () {
        /// <summary>Disallows zooming in or out on a map using a bounding box.</summary>
    },
    disableScrollWheelZoom: function () {
        /// <summary>Disallows zooming in or out on a map using the mouse scroll wheel.</summary>
    },
    disableShiftDoubleClickZoom: function () {
        /// <summary>Disallows shift double clicking on a map to zoom in a level and center the map.</summary>
        /// <return type="undefined">undefined</return>
    },
    disableSnapping: function () {
        /// <summary>Disables snapping on the map</summary>
    },
    enableClickRecenter: function () {
        /// <summary>Permits users to click on a map to center it.</summary>
    },
    enableDoubleClickZoom: function () {
        /// <summary>Permits users to double click on a map to zoom in a level and center the map.</summary>
    },
    enableKeyboardNavigation: function () {
        /// <summary>Permits users to pan and zoom using the keyboard.</summary>
    },
    enableMapNavigation: function () {
        /// <summary>Allows all map navigation.</summary>
    },
    enablePan: function () {
        /// <summary>Permits users to pan a map using the mouse.</summary>
    },
    enableRubberBandZoom: function () {
        /// <summary>Permits users to zoom in or out on a map using a bounding box.</summary>
    },
    enableScrollWheelZoom: function () {
        /// <summary>Permits users to zoom in or out on a map using the mouse scroll wheel.</summary>
    },
    enableShiftDoubleClickZoom: function () {
        /// <summary>Permits users to shift double click on a map to zoom in a level and center the map.</summary>
    },
    enableSnapping: function (snapOptions) {
        /// <summary>Enable snapping on the map when working with the Editor, Measurement widget or the Draw and Edit toolbars.</summary>
        /// <param name="snapOptions" type="Object" optional="true"> &#60;Number&#62; tolerance Specify the radius of the snapping circle in pixels. The default value is 15 pixels. &#60;Object&#62; layerInfos An array of layerInfo objects that define the snapping target layers. All values are optional. If no snapping options are set the default values will be used. &#60;Layer&#62; layer Reference to a feature or graphics layer that will be a target snapping layer. The default option is to set all feature and graphics layers in the map to be target snapping layers. &#60;Boolean&#62; snapToPoint Default is true. When true snapping to points will be enabled for layers with point geometry. &#60;Boolean&#62; snapToVertex Default is true. When true snapping to vertices will be enabled for layers with polyline or polygon geometry. &#60;Boolean&#62; snapToEdge Default is true. When true snapping to edges will be enabled for layers with polyline or polygon geometry. &#60;SimpleMarkerSymbol&#62; snapPointSymbol Define a symbol for the snapping location. The default symbol is a simple marker symbol with the following properties: size:15px,color:cyan,style:STYLE_CROSS. &#60;Boolean&#62; alwaysSnap When true, snapping is always enabled. When false users press the snapKey to enable snapping. The default value is false. &#60;dojo.key&#62; snapKey When alwaysSnap is set to false use this option to define the key users press to enable snapping. The default values is the CTRL key. require([ "esri/symbols/SimpleMarkerSymbol", ... ], function(SimpleMarkerSymbol, ... ) { var symbol = new SimpleMarkerSymbol(); map.enableSnapping({ snapPointSymbol: symbol, tolerance:20, snapKey:dojo.keys.ALT }); ...});</param>
        /// <return type="SnappingManager">SnappingManager</return>
    },
    getBasemap: function () {
        /// <summary>Returns the name of the current basemap</summary>
        /// <return type="String">String</return>
    },
    getInfoWindowAnchor: function (screenCoords) {
        /// <summary>Sets an InfoWindow's anchor when calling InfoWindow.show</summary>
        /// <param name="screenCoords" type="Point" optional="false">The anchor point in screen units.</param>
        /// <return type="String">String</return>
    },
    getLayer: function (id) {
        /// <summary>Returns an individual layer of a map</summary>
        /// <param name="id" type="String" optional="false">ID assigned to the layer.</param>
        /// <return type="Layer">Layer</return>
    },
    getLayersVisibleAtScale: function () {
        /// <summary>Return an array of layers visible at the current scale</summary>
        /// <return type="Layer[]">Layer[]</return>
    },
    getLevel: function () {
        /// <summary>Gets the current level of detail for the map.</summary>
        /// <return type="Number">Number</return>
    },
    getMaxScale: function () {
        /// <summary>Returns the maximum visible scale of the map.</summary>
        /// <return type="Number">Number</return>
    },
    getMaxZoom: function () {
        /// <summary>Returns the maximum zoom level of the map.</summary>
        /// <return type="Number">Number</return>
    },
    getMinScale: function () {
        /// <summary>Returns the minimum visible scale of the map.</summary>
        /// <return type="Number">Number</return>
    },
    getMinZoom: function () {
        /// <summary>Returns the minimum zoom level of the map.You cannot zoom out beyond this value.</summary>
        /// <return type="Number">Number</return>
    },
    getScale: function () {
        /// <summary>Returns the current map scale</summary>
        /// <return type="Number">Number</return>
    },
    getZoom: function () {
        /// <summary>Returns the current zoom level of the map.</summary>
        /// <return type="Number">Number</return>
    },
    hidePanArrows: function () {
        /// <summary>Hides the pan arrows from the map.</summary>
    },
    hideZoomSlider: function () {
        /// <summary>Hides the zoom slider from the map.</summary>
    },
    panDown: function () {
        /// <summary>Pans the map south.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panLeft: function () {
        /// <summary>Pans the map west.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panLowerLeft: function () {
        /// <summary>Pans the map southwest.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panLowerRight: function () {
        /// <summary>Pans the map southeast.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panRight: function () {
        /// <summary>Pans the map east.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panUp: function () {
        /// <summary>Pans the map north.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panUpperLeft: function () {
        /// <summary>Pans the map northwest.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    panUpperRight: function () {
        /// <summary>Pans the map northeast.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    removeAllLayers: function () {
        /// <summary>Removes all layers from the map.The map's extent, spatial reference, and tiling scheme if defined do not change when the layers are removed.</summary>
    },
    removeLayer: function (layer) {
        /// <summary>Removes the specified layer from the map</summary>
        /// <param name="layer" type="Layer" optional="false">Layer to be removed from the map. The map's extent, spatial reference, and tiling scheme if defined do not change when the layer is removed. When the next layer is added to the map, this layer is displayed at the same extent and spatial reference.</param>
    },
    reorderLayer: function (layer,index) {
        /// <summary>Changes the layer order in the map.</summary>
        /// <param name="layer" type="Layer" optional="false">The layer to be moved. (As of v1.4) Beginning with version 1.4, use this parameter in place of "layerId". In versions prior to v1.4, use "layerID" in place of "layer". Type: &#60;String&#62;Definition: The ID of the layer to be moved. This ID is assigned in Layer.id.</param>
        /// <param name="index" type="Number" optional="false">Refers to the location for placing the layer. The bottom most layer has an index of 0.</param>
    },
    reposition: function () {
        /// <summary>Repositions the map DIV on the page.</summary>
    },
    resize: function (immediate) {
        /// <summary>Resizes the map DIV.</summary>
        /// <param name="immediate" type="Boolean" optional="true">By default, the actual resize logic is delayed internally in order to throttle spurious resize events dispatched by some browsers. In cases where you explicitly call this method in a one-and-done situation, you can use the boolean immediate argument to indicate that the resize logic should be applied immediately without any delay.</param>
    },
    setBasemap: function (basemap) {
        /// <summary>Change the map's current basemap</summary>
        /// <param name="basemap" type="String" optional="false">A valid basemap name. Valid values are: "streets" , "satellite" , "hybrid", "topo", "gray", "oceans", "national-geographic", "osm".</param>
    },
    setExtent: function (extent,fit) {
        /// <summary>Sets the extent of the map.</summary>
        /// <param name="extent" type="Extent" optional="false">Sets the minx, miny, maxx, and maxy for a map.</param>
        /// <param name="fit" type="Boolean" optional="true">When true, for maps that contain tiled map service layers, you are guaranteed to have the input extent shown completely on the map. The default value is false. (As of v1.3) </param>
        /// <return type="Deferred.">Deferred.</return>
    },
    setLevel: function (level) {
        /// <summary>Sets the map to the specified level.</summary>
        /// <param name="level" type="Number" optional="false">The level ID.</param>
        /// <return type="Deferred">Deferred</return>
    },
    setMapCursor: function (cursor) {
        /// <summary>Sets the default cursor for the map.</summary>
        /// <param name="cursor" type="String" optional="false">A standard CSS cursor value. Some common values include "default", "pointer", "crosshair", "text", "help", and "wait".</param>
    },
    setScale: function (scale) {
        /// <summary>Sets the map scale to the specified value.</summary>
        /// <param name="scale" type="Number" optional="false">A map scale value greater than 0.</param>
        /// <return type="Deferred">Deferred</return>
    },
    setTimeExtent: function (timeExtent) {
        /// <summary>Sets the TimeExtent for the map.</summary>
        /// <param name="timeExtent" type="TimeExtent" optional="false">Set the time extent for which data is displayed on the map.</param>
    },
    setTimeSlider: function (timeSlider) {
        /// <summary>Set the time slider associated with the map</summary>
        /// <param name="timeSlider" type="TimeSlider" optional="false">The time slider dijit to associate with the map.</param>
    },
    setVisibility: function (visible) {
        /// <summary>Show or hide the map</summary>
        /// <param name="visible" type="Boolean" optional="false">If true, map will be visible.</param>
        /// <return type="Map">Map</return>
    },
    setZoom: function (zoom) {
        /// <summary>Set the map zoom level to the given value.</summary>
        /// <param name="zoom" type="Number" optional="false">A valid zoom level value.</param>
        /// <return type="Deferred">Deferred</return>
    },
    showPanArrows: function () {
        /// <summary>Shows the pan arrows on the map.</summary>
    },
    showZoomSlider: function () {
        /// <summary>Shows the zoom slider on the map.</summary>
    },
    toMap: function (screenPoint) {
        /// <summary>Converts a single screen point or an array of screen points to map coordinates</summary>
        /// <param name="screenPoint" type="ScreenPoint | Point" optional="false">Converts screen coordinates to map coordinates. Starting at version 3.3, screenPoint should be an instance of ScreenPoint.</param>
        /// <return type="Point">Point</return>
    },
    toScreen: function (mapPoint) {
        /// <summary>Converts a single map point or an array of map points to screen coordinates</summary>
        /// <param name="mapPoint" type="Point" optional="false">Converts map coordinates to screen coordinates.</param>
        /// <return type="Point">Point</return>
    },
};

esri.OperationBase = function (params) {
    /// <summary>Creates a new OperationBase object</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;String&#62; label&#10;
    /// &#60;String&#62; type</param>
    /// <field name="label" type="String">Details about the operation, for example: "Update" may be the label for an edit operation that updates features</field>
    /// <field name="type" type="String">The type of operation, for example: "edit" or "navigation"</field>
};

esri.OperationBase.prototype = 
{
    performRedo: function () {
        /// <summary>Re-perform the last undo operation.</summary>
    },
    performUndo: function () {
        /// <summary>Reverse the operation.</summary>
    },
};

esri.ServerInfo = function () {

    /// <field name="adminTokenServiceUrl" type="String">The token service URL used to generate tokens for ArcGIS Server Admin resources</field>
    /// <field name="currentVersion" type="Number">Version of the ArcGIS Server REST API deployed on this server.</field>
    /// <field name="server" type="String">Server URL in the following format: scheme://host[:port].</field>
    /// <field name="shortLivedTokenValidity" type="Number">Validity of short-lived token in minutes</field>
    /// <field name="tokenServiceUrl" type="String">The token service URL used to generate tokens for the secured resources on the server</field>
};

esri.ServerInfo.prototype = 
{
    toJson: function () {
        /// <summary>Return the properties of this object in JSON</summary>
        /// <return type="Object">Object</return>
    },
};

esri.SnappingManager = function (options) {
    /// <summary>Create a new SnappingManager object.</summary>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;Boolean&#62; alwaysSnap&#10;
    /// &#60;Object[]&#62; layerInfos&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;dojo.keys&#62; snapKey&#10;
    /// &#60;SimpleMarkerSymbol&#62; snapPointSymbol&#10;
    /// &#60;Number&#62; tolerance</param>
};

esri.SnappingManager.prototype = 
{
    destroy: function () {
        /// <summary>Destroy the SnappingManager object.</summary>
    },
    getSnappingPoint: function (screenPoint) {
        /// <summary>Returns a deferred object, which can be added to a callback to find the snap point</summary>
        /// <param name="screenPoint" type="Point" optional="false">The input screen point for which to find the snapping location.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    setLayerInfos: function (setLayerInfos) {
        /// <summary>An array of layerInfo objects used to specify the target snapping layers</summary>
        /// <param name="setLayerInfos" type="Object[]" optional="false">An array of layerInfo objects that define the snapping target layers. All values are optional. If no snapping options are set the default values will be used. &#60;Layer&#62; layer Reference to a feature or graphics layer that will be a target snapping layer. The default option is to set all feature and graphics layers in the map to be target snapping layers. &#60;Boolean&#62; snapToPoint Default is true. When true snapping to points will be enabled for layers with point geometry. &#60;Boolean&#62; snapToVertex Default is true. When true snapping to vertices will be enabled for layers with polyline or polygon geometry. &#60;Boolean&#62; snapToEdge Default is true. When true snapping to edges will be enabled for layers with polyline or polygon geometry. </param>
    },
};

esri.SpatialReference = function (json) {
    /// <summary>Creates a new SpatialReference object</summary>
    /// <param name="json" type="Object" optional="false">The REST JSON representation of the spatial reference: {"wkid" : &#60;wkid&#62;}</param>
    /// <field name="wkid" type="Number">The well-known ID of a spatial reference.</field>
    /// <field name="wkt" type="String">The well-known text that defines a spatial reference.</field>
};

esri.SpatialReference.prototype = 
{
    equals: function (sr) {
        /// <summary>Returns true if the input spatial reference object has the same wkid or wkt as this spatial reference object.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">The spatial reference to compare.</param>
        /// <return type="Boolean">Boolean</return>
    },
    isWebMercator: function () {
        /// <summary>Returns true if the wkid of the spatial reference object is one of the following values: 102113, 102100, 3857.</summary>
        /// <return type="Boolean">Boolean</return>
    },
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the spatial reference</summary>
        /// <return type="Object">Object</return>
    },
};

esri.TimeExtent = function (startTime,endTime) {
    /// <summary>Creates a new TimeExtent object with the specifed start and end time.</summary>
    /// <param name="startTime" type="Date" optional="false">The start time for the specified time extent.</param>
    /// <param name="endTime" type="Date" optional="false">The end time for the specified time extent.</param>
    /// <field name="endTime" type="Date">The end time for the specified time extent</field>
    /// <field name="startTime" type="Date">The start time for the specified time extent</field>
};

esri.TimeExtent.prototype = 
{
    intersection: function (timeExtent) {
        /// <summary>Returns a new time extent indicating the intersection between "this" and the argument time extent</summary>
        /// <param name="timeExtent" type="Number" optional="false">The input time extent.</param>
        /// <return type="TimeExtent">TimeExtent</return>
    },
    offset: function (offsetValue,offsetUnits) {
        /// <summary>Returns a new time extent with the given offset from "this' time extent</summary>
        /// <param name="offsetValue" type="Number" optional="false">The length of time to offset from "this" time extent.</param>
        /// <param name="offsetUnits" type="String" optional="false">The offset units, see the TimeInfo constants for a list of valid values.</param>
        /// <return type="TimeExtent">TimeExtent</return>
    },
};

esri.UndoManager = function (options) {
    /// <summary>Creates a new UndoManager object</summary>
    /// <param name="options" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;Number&#62; maxOperations</param>
    /// <field name="canRedo" type="Boolean">When true, there are redo operations available on the stack</field>
    /// <field name="canUndo" type="Boolean">When true, there are undo operations available on the stack</field>
    /// <field name="length" type="Integer">The number of operations stored in the history stack</field>
    /// <field name="position" type="Integer">The current operation position.</field>
};

esri.UndoManager.prototype = 
{
    add: function (operation) {
        /// <summary>Adds an undo operation to the stack and clears the redo stack</summary>
        /// <param name="operation" type="Operation" optional="false">An operation to add to the stack.</param>
    },
    clearRedo: function () {
        /// <summary>Clear the redo stack.</summary>
    },
    clearUndo: function () {
        /// <summary>Clear the undo stack</summary>
    },
    destroy: function () {
        /// <summary>Destroy the operation manager.</summary>
    },
    get: function (operation) {
        /// <summary>Get the specified operation from the stack</summary>
        /// <param name="operation" type="Operation" optional="false">The operation id.</param>
        /// <return type="Operation">Operation</return>
    },
    peekRedo: function () {
        /// <summary>Get the next redo operation from the stack.</summary>
        /// <return type="Operation">Operation</return>
    },
    peekUndo: function () {
        /// <summary>Get the next undo operation from the stack</summary>
        /// <return type="Operation">Operation</return>
    },
    redo: function () {
        /// <summary>Moves the current position to the next redo operation and calls the operation's performRedo() method</summary>
    },
    remove: function (operation) {
        /// <summary>Remove the specified operation from the stack</summary>
        /// <param name="operation" type="Operation" optional="false">The operation id.</param>
        /// <return type="Operation">Operation</return>
    },
    undo: function () {
        /// <summary>Moves the current position to the next undo operation and calls the operation's performUndo method</summary>
    },
};

esri.Units = function () {

};

esri.arcgis = function () {
    /// <summary>The esri.arcgis namespace.</summary>
};



esri.arcgis.createMap = function (itemId_or_itemInfo,mapDiv,options) {
    /// <summary>Create a map using information from an ArcGIS.com item.</summary>
    /// <param name="itemId_or_itemInfo" type="String|Object" optional="false">An itemId for an ArcGIS.com item or the response object obtained from calling the esri.arcgis.utils.getItem method. You can discover the item's unique ID by browsing to the item in ArcGIS.com then extracting the id from the item's URL.</param>
    /// <param name="mapDiv" type="String" optional="false">Container ID for referencing map.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters that define the map functionality: &#60;Object&#62; mapOptions See the optional parameters for the esri.map constructor for more details. &#60;String&#62; bingMapsKey The Bing Maps Key, required if working with Microsoft Bing Maps. &#60;Boolean&#62; ignorePopups When true, webmap defined popups will not display. &#60;String&#62; geometryServiceURL URL to the ArcGIS Server REST resource that represents a geometry service. For more information on constructing a URL, see The Services Directory and the REST API. </param>
    /// <return type="dojo.Deferred">dojo.Deferred</return>
};

esri.arcgis.getItem = function (itemId) {
    /// <summary>Get details about the input ArcGIS.com item.</summary>
    /// <param name="itemId" type="String" optional="false">The itemId for a publicly shared ArcGIS.com item. You can discover the item's unique ID by browsing to the item in ArcGIS.com then extracting the id from the item's URL.</param>
    /// <return type="dojo.Deferred">dojo.Deferred</return>
};

esri.arcgis.getLegendLayers = function (createMapResponse) {
    /// <summary>Can be used with esri.dijit.Legend to get the layerInfos list to be passed into the Legend constructor.</summary>
    /// <param name="createMapResponse" type="Object" optional="false">Object returned by .createMap() in the .then() callback.</param>
    /// <return type="Layer[]">Layer[]</return>
};

esri.arcgis.Portal = function (url) {
    /// <summary>Creates a new Portal object</summary>
    /// <param name="url" type="String" optional="false">The url to the ArcGIS.com site or in-house portal.</param>
    /// <field name="access" type="String">The access level of the organization.</field>
    /// <field name="allSSL" type="Boolean">When true, access to the organization's Portal resources must occur over SSL</field>
    /// <field name="basemapGalleryGroupQuery" type="String">The query that defines the basemaps that are displayed in the Basemap Gallery</field>
    /// <field name="canSearchPublic" type="Boolearn">When true, the organization's public items, groups and users are included in search queries.</field>
    /// <field name="canSharePublic" type="Boolean">When true, members of the organization can share resources outside the organization</field>
    /// <field name="created" type="Date">Date the organization was created</field>
    /// <field name="culture" type="String">The default locale (language and country) information</field>
    /// <field name="defaultBasemap" type="Object">The default basemap the portal displays in the map viewer.</field>
    /// <field name="defaultExtent" type="Object">The default extent for the map the portal displays in the map viewer.</field>
    /// <field name="description" type="String"> A description of the organization / portal</field>
    /// <field name="featuredGroups" type="Object[]">The featured groups for the portal.</field>
    /// <field name="featuredItemsGroupQuery" type="String">The query that defines the featured group.</field>
    /// <field name="id" type="String">The id of the organization that owns this portal.</field>
    /// <field name="isOrganization" type="Boolean">Indicates if the portal is an organization</field>
    /// <field name="layerTemplatesGroupQuery" type="String">The query that defines the collection of editable layer templates</field>
    /// <field name="modified" type="Date">Date the organization was last modified</field>
    /// <field name="name" type="String">The Name of the organization / portal</field>
    /// <field name="portalMode" type="String">Denotes multitenant or singletenant</field>
    /// <field name="portalName" type="String">The name of the portal i.e.</field>
    /// <field name="symbolSetsGroupQuery" type="String">The query that defines the symbols sets used by the map viewer</field>
    /// <field name="templatesGroupQuery" type="String">The query that defines the collection of templates that will appear in the template gallery</field>
    /// <field name="thumbnailUrl" type="String">The url to the thumbnail of the organization</field>
    /// <field name="url" type="String">The portal url</field>
};

esri.arcgis.Portal.prototype = 
{
    getPortalUser: function () {
        /// <summary>Returns a PortalUser object that describes the user currently signed in to the portal</summary>
        /// <return type="PortalUser">PortalUser</return>
    },
    queryGroups: function (queryParams) {
        /// <summary>Execute a query against the Portal to return a deferred that when resolved returns PortalQueryResult that contain a results array of PortalGroup objects for all the groups that match the input query</summary>
        /// <param name="queryParams" type="PortalQueryParams" optional="true">The input query parameters.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryItems: function (queryParams) {
        /// <summary>Execute a query against the Portal to return a deferred that when resolved returns PortalQueryResult that contain a results array of PortalItem objects that match the input query</summary>
        /// <param name="queryParams" type="PortalQueryParams" optional="true">The input query parameters.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryUsers: function (queryParams) {
        /// <summary>Execute a query against the Portal to return a deferred that when resolved returns PortalQueryResult that contain a results array of PortalUser objects that match the input query</summary>
        /// <param name="queryParams" type="PortalQueryParams" optional="true">The input query parameters.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    signIn: function () {
        /// <summary>Prompts the user using the IdentityManager and returns a deferred that when resolved returns the PortalUser for the input credentials</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    signOut: function () {
        /// <summary>Sign out of the Portal which resets the Portal and disables identity checking</summary>
        /// <return type="Portal">Portal</return>
    },
};

esri.arcgis.PortalComment = function () {

    /// <field name="comment" type="String">The comment text</field>
    /// <field name="created" type="String">The date and time the comment was created</field>
    /// <field name="id" type="String">The comment id</field>
    /// <field name="owner" type="String">The user name of the user who created the comment</field>
};

esri.arcgis.PortalFolder = function () {

    /// <field name="created" type="Date">The date the folder was created</field>
    /// <field name="id" type="String">The id of the folder</field>
    /// <field name="portal" type="Portal">The portal for the folder</field>
    /// <field name="title" type="String">The title of the folder</field>
    /// <field name="url" type="String">The url to to the folder</field>
};

esri.arcgis.PortalFolder.prototype = 
{
    getItems: function () {
        /// <summary>Find all the items in the folder.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.arcgis.PortalGroup = function () {

    /// <field name="access" type="String">The access privileges on the group which determines who can see and access the group.</field>
    /// <field name="created" type="Date">The date the group was created</field>
    /// <field name="description" type="String">A detailed description of the group</field>
    /// <field name="id" type="String">The id for the group</field>
    /// <field name="isInvitationOnly" type="Boolean">If this is set to true, then users will not be able to apply to join the group</field>
    /// <field name="isViewOnly" type="boolean">Denotes a view only group where members are not able to share items.</field>
    /// <field name="modified" type="Date">The date the group was last modified</field>
    /// <field name="owner" type="Portal">The username of the group's owner</field>
    /// <field name="portal" type="Portal">The portal for the group</field>
    /// <field name="snippet" type="String">A short summary that describes the group</field>
    /// <field name="tags" type="String[]">User defined tags that describe the group</field>
    /// <field name="thumbnailUrl" type="String">The url to the thumbnail used for the group</field>
    /// <field name="title" type="String">The title for the group.</field>
    /// <field name="url" type="String">The url to the group</field>
};

esri.arcgis.PortalGroup.prototype = 
{
    getMembers: function () {
        /// <summary>Get the current members for the group.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryItems: function (queryParams) {
        /// <summary>Execute a query against the group to return a deferred that when resolved returns PortalQueryResults that contain a results array of PortalItem objects that match the input query</summary>
        /// <param name="queryParams" type="PortalQueryParams" optional="true">The input query parameters.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.arcgis.PortalGroupMembers = function () {

    /// <field name="admins" type="String[]">An array containing the user names for each administrator of the group</field>
    /// <field name="owner" type="String">The user name of the owner of the group</field>
    /// <field name="users" type="String[]">An array containing the user names for each user in the group</field>
};

esri.arcgis.PortalItem = function () {

    /// <field name="access" type="String">Indicates the level of access: private, shared, org, or public</field>
    /// <field name="accessInformation" type="String">Information on the source of the item</field>
    /// <field name="avgRating" type="Number">Average rating.</field>
    /// <field name="created" type="Date">The date the item was created</field>
    /// <field name="culture" type="String">The item locale information (language and country)</field>
    /// <field name="description" type="String">The detailed description of the item</field>
    /// <field name="extent" type="Object">The bounding rectangle of the item returned as an extent object with the following format: "extent": [ [ minX, minY ], [ maxX, maxY ] ].</field>
    /// <field name="id" type="String">The unique id for this item</field>
    /// <field name="itemDataUrl" type="String">The url to the data resource associated with the item</field>
    /// <field name="itemUrl" type="String">The url to the item</field>
    /// <field name="licenseInfo" type="String">Any license information or restrictions</field>
    /// <field name="modified" type="Date">Date the item was last modified</field>
    /// <field name="name" type="String">The name of the item</field>
    /// <field name="numComments" type="Number">Number of comments on the item</field>
    /// <field name="numRatings" type="Number">Number of ratings on the item</field>
    /// <field name="numViews" type="Number">Number of views on the item</field>
    /// <field name="owner" type="String">The username of the user who owns this item</field>
    /// <field name="portal" type="Portal">The portal that contains the item</field>
    /// <field name="size" type="Number">The size of the item</field>
    /// <field name="snippet" type="String">A summary description of the item</field>
    /// <field name="spatialReference" type="String">The item's coordinate system</field>
    /// <field name="tags" type="String[]">User defined tags that describe the item</field>
    /// <field name="thumbnailUrl" type="String">The url to the thumbnail used for the item</field>
    /// <field name="title" type="String">The title for the item.</field>
    /// <field name="type" type="String">The gis content type of this item.</field>
    /// <field name="typeKeywords" type="String[]">A set of keywords that further describes the type of this item.</field>
    /// <field name="url" type="String">The url for the resource represented by the item</field>
    /// <field name="userItemUrl" type="String">The url to the user item</field>
};

esri.arcgis.PortalItem.prototype = 
{
    addComment: function (comment) {
        /// <summary>Add a comment to the item.Only available for authenticated users who have access to the item.</summary>
        /// <param name="comment" type="String" optional="false">The text for the comment.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    addRating: function (rating) {
        /// <summary>Add a rating to an item that you have access to.</summary>
        /// <param name="rating" type="Number" optional="false">Rating to set for the item. Rating must be a number between 1.0 and 5.0.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    deleteComment: function (comment) {
        /// <summary>Deletes an item comment.</summary>
        /// <param name="comment" type="PortalComment" optional="false">The PortalComment to delete.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    deleteRating: function (rating) {
        /// <summary>Delete a rating that you created for the specified item.</summary>
        /// <param name="rating" type="PortalRating" optional="false">Rating to delete.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getComments: function () {
        /// <summary>Get the comments associated with the item.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getRating: function () {
        /// <summary>Returns the rating (if any) given to the item.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    updateComment: function (comment) {
        /// <summary>Updates an item comment.</summary>
        /// <param name="comment" type="PortalComment" optional="false">A PortalComment that contains the comment updates.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.arcgis.PortalQueryParams = function () {

    /// <field name="num" type="String">The maximum number of results to be included in the result set response.</field>
    /// <field name="q" type="String">The query string to search with.</field>
    /// <field name="sortField" type="String">A comma seperated list of field(s) to sort by.</field>
    /// <field name="start" type="String">The number of the first entry in the result set response.</field>
};

esri.arcgis.PortalQueryResult = function () {

    /// <field name="nextQueryParams" type="PortalQueryParams">The query parameters for the next set of results</field>
    /// <field name="queryParams" type="PortalQueryParams">The query parameters for the first set of results</field>
    /// <field name="results" type="Object[]">An array of result item objects</field>
    /// <field name="total" type="Number">The total number of results.</field>
};

esri.arcgis.PortalRating = function () {

    /// <field name="created" type="Date">Date the rating was added to the item</field>
    /// <field name="rating" type="Number">A rating between 1.0 and 5.0 for the item</field>
};

esri.arcgis.PortalUser = function () {

    /// <field name="access" type="String">The access level for the user: private, org or public.</field>
    /// <field name="created" type="Date">The date the user was created</field>
    /// <field name="culture" type="String">The default culture for the user</field>
    /// <field name="description" type="String">Description of the user</field>
    /// <field name="email" type="String">The user's email address.</field>
    /// <field name="fullName" type="String">The user's full name</field>
    /// <field name="modified" type="Date">The date the user was modified</field>
    /// <field name="orgId" type="String">The id of the organization the user belongs to</field>
    /// <field name="portal" type="Portal">The portal</field>
    /// <field name="preferredView" type="String">The user's preferred view for content, either Web or GIS.</field>
    /// <field name="region" type="String">The user's preferred region, used to set the featured maps on the portal home page, content in the gallery and the default extent for new maps in the Viewer</field>
    /// <field name="role" type="String">The user's role in the organization: administrator (org_admin), publisher (org_publisher), or user (org_user)</field>
    /// <field name="tags" type="String[]">User-defined tags that describe the user</field>
    /// <field name="thumbnailUrl" type="String">The url to the thumbnail image for the user</field>
    /// <field name="userContentUrl" type="String">The url for the user content</field>
    /// <field name="username" type="String">The username for the user</field>
};

esri.arcgis.PortalUser.prototype = 
{
    getFolders: function () {
        /// <summary>Find folders for the portal user.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getGroupInvitations: function () {
        /// <summary>Provides access to the group invitations for the portal user.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getGroups: function () {
        /// <summary>Find all the groups that the portal user has permissions to access.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getItem: function (itemId) {
        /// <summary>Get the portal item along with folder info for the input item id.</summary>
        /// <param name="itemId" type="String" optional="false">The id of the item.</param>
        /// <return type="PortalItem">PortalItem</return>
    },
    getItems: function (folderId) {
        /// <summary>Retrieve all the items in the specified folder.</summary>
        /// <param name="folderId" type="String" optional="false">The id of the folder that contains the items to retrieve.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getNotifications: function () {
        /// <summary>Get information about any notifications for the portal user.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getTags: function () {
        /// <summary>Access the tag objects that have been created by the portal user.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit = function () {
    /// <summary>The esri.dijit namespace.</summary>
};

esri.dijit.AttributeInspector = function (params,srcNodeRef) {
    /// <summary>Creates a new Attribute Inspector object</summary>
    /// <param name="params" type="Object" optional="false">See options list.&#10;
    /// &#60;Object[]&#62; layerInfos</param>
    /// <param name="srcNodeRef" type="String" optional="false">HTML element where the attribute inspector should be rendered.</param>
};

esri.dijit.AttributeInspector.prototype = 
{
    destroy: function () {
        /// <summary>Destroys the widget, used for page clean up</summary>
    },
    first: function () {
        /// <summary>Moves to the first feature</summary>
    },
    last: function () {
        /// <summary>Moves to the last feature</summary>
    },
    next: function () {
        /// <summary>Move to the next feature</summary>
    },
    previous: function () {
        /// <summary>Move to the previous feature</summary>
    },
    refresh: function () {
        /// <summary>Updates the contents of the AttributeInspector</summary>
    },
};

esri.dijit.Attribution = function (options,srcNodeRef) {
    /// <summary>Creates a new Attribution object</summary>
    /// <param name="options" type="Object" optional="false">An object that defines the attribution options. View the options list for details.&#10;
    /// &#60;String&#62; itemDelimiter&#10;
    /// &#60;Map&#62; map</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the time slider should be rendered.</param>
    /// <field name="itemDelimiter" type="String">String used as the delimiter between attribution items.</field>
    /// <field name="itemNodes" type="HTML Span Element">Array of elements where each element contains attribution text for a layer in the map</field>
    /// <field name="listNode" type="HTML Span Element">Reference to the span element that contains all the attribution items</field>
    /// <field name="map" type="Map">Reference to the map object for which the widget is displaying attribution</field>
};

esri.dijit.Attribution.prototype = 
{
    destroy: function () {
        /// <summary>Destroy the attribution widget</summary>
    },
};

esri.dijit.Basemap = function (params) {
    /// <summary>Creates a new Basemap Object</summary>
    /// <param name="params" type="Object" optional="true">Set of parameters used to create a basemap. See options list.&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;BasemapLayer[]&#62; layers&#10;
    /// &#60;String&#62; thumbnailUrl&#10;
    /// &#60;String&#62; title</param>
    /// <field name="id" type="String">The basemap's id</field>
    /// <field name="thumbnailUrl" type="String">The URL to the thumbnail image for the basemap</field>
    /// <field name="title" type="String">The title for the basemap</field>
};

esri.dijit.Basemap.prototype = 
{
    getLayers: function () {
        /// <summary>The list of layers contained in the basemap or a dojo.Deferred if a call to ArcGIS.com needs to be made to retrieve the list of ArcGIS.com basemaps</summary>
        /// <return type="BasemapLayer[]">BasemapLayer[]</return>
    },
};

esri.dijit.BasemapGallery = function (params,srcNodeRef) {
    /// <summary>Creates a new BasemapGallery dijit</summary>
    /// <param name="params" type="Object" optional="false">Parameters used to configure the widget. See the list below for details.&#10;
    /// &#60;String[]&#62; basemapIds&#10;
    /// &#60;Basemap[]&#62; basemaps&#10;
    /// &#60;Object&#62; basemapsGroup&#10;
    /// &#60;String&#62; bingMapsKey&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;String[]&#62; referenceIds&#10;
    /// &#60;Boolean&#62; showArcGISBasemaps</param>
    /// <param name="srcNodeRef" type="String" optional="true">Reference or id of the HTML element where the widget should be rendered. If a srcNodeRef is not provided the BasemapGallery has no user interface representation.</param>
    /// <field name="basemaps" type="Basemap[]">List of basemaps displayed in the BasemapGallery.</field>
    /// <field name="loaded" type="Boolean">This value is true after the BasemapGallery retrieves the ArcGIS.com basemaps.</field>
    /// <field name="portalUrl" type="String">Optional parameter to pass in a portal URL, including the instance name, used to access the group containing the basemap gallery items.</field>
};

esri.dijit.BasemapGallery.prototype = 
{
    add: function (basemap) {
        /// <summary>Add a new basemap to the BasemapGallery's list of basemaps.</summary>
        /// <param name="basemap" type="Basemap" optional="false">The basemap to add to the map.</param>
        /// <return type="Boolean">Boolean</return>
    },
    destroy: function () {
        /// <summary>Destroys the basemap gallery.</summary>
    },
    get: function (id) {
        /// <summary>Return the basemap with the specified id.</summary>
        /// <param name="id" type="String" optional="false">The basemap id.</param>
        /// <return type="Basemap">Basemap</return>
    },
    getSelected: function () {
        /// <summary>Gets the currently selected basemap.</summary>
        /// <return type="Basemap">Basemap</return>
    },
    remove: function (id) {
        /// <summary>Remove a basemap from the BasemapGallery's list of basemaps.</summary>
        /// <param name="id" type="String" optional="false">The basemap id.</param>
        /// <return type="Basemap">Basemap</return>
    },
    select: function (id) {
        /// <summary>Select a new basemap for the map.</summary>
        /// <param name="id" type="String" optional="false">The basemap id.</param>
        /// <return type="Basemap">Basemap</return>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the basemap gallery.</summary>
    },
};

esri.dijit.BasemapLayer = function (params) {
    /// <summary>Creates a new BasemapLayer object</summary>
    /// <param name="params" type="Object" optional="true">Set of parameters used to create a basemap layer. See the list below for details.&#10;
    /// &#60;Number[]&#62; bandIds&#10;
    /// &#60;String&#62; copyright&#10;
    /// &#60;Number[]&#62; displayLevels&#10;
    /// &#60;Extent&#62; fullExtent&#10;
    /// &#60;Extent&#62; initialExtent&#10;
    /// &#60;Boolean&#62; isReference&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;String[]&#62; subDomains&#10;
    /// &#60;TileInfo&#62; tileInfo&#10;
    /// &#60;String[]&#62; tileServer&#10;
    /// &#60;String&#62; type&#10;
    /// &#60;String&#62; url&#10;
    /// &#60;Number[]&#62; visibleLayers</param>
    /// <field name="copyright" type="String">The attribution information for the layer</field>
    /// <field name="fullExtent" type="Extent">The full extent of the layer</field>
    /// <field name="initialExtent" type="Extent">The initial extent of the layer</field>
    /// <field name="subDomains" type="String[]">The subDomains where tiles are served to speed up tile retrieval (using subDomains gets around the browser limit of the max number of concurrent requests to a domain)</field>
    /// <field name="tileInfo" type="TileInfo">The tile info for the layer including lods, rows, cols, origin and spatial reference</field>
    /// <field name="tileServer" type="String[]">Additional tile server domains for the layer</field>
    /// <field name="type" type="String">The type of layer.</field>
};

esri.dijit.BasemapToggle = function (params,srcNodeRef) {
    /// <summary>Creates a new BasemapToggle dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various parameters to configure this dijit. See the list below for details.&#10;
    /// &#60;String&#62; basemap&#10;
    /// &#60;Object&#62; basemaps&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="basemap" type="String">The secondary basemap to toggle to</field>
    /// <field name="basemaps" type="Object">Object containing the labels and URLs for the image of each basemap</field>
    /// <field name="loaded" type="Boolean">Whether the widget has been loaded</field>
    /// <field name="map" type="Map">Map object that this dijit is associated with</field>
    /// <field name="theme" type="String">Class used for styling the widget</field>
    /// <field name="visible" type="Boolean">Whether the widget is visible by default</field>
};

esri.dijit.BasemapToggle.prototype = 
{
    destroy: function () {
        /// <summary>Destroys the widget</summary>
    },
    hide: function () {
        /// <summary>Hides the widget</summary>
    },
    show: function () {
        /// <summary>Shows the widget</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
    toggle: function () {
        /// <summary>Toggles to the next basemap</summary>
    },
};

esri.dijit.BookmarkItem = function (name,extent) {
    /// <summary>Creates a new BookmarkItem</summary>
    /// <param name="name" type="String" optional="false">The name for the bookmark item.</param>
    /// <param name="extent" type="Extent" optional="false">The extent for the specified bookmark item.</param>
};

esri.dijit.Bookmarks = function (params,srcNodeRef) {
    /// <summary>Creates a new Bookmark widget.</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;BookmarkItems[]&#62; bookmarks&#10;
    /// &#60;Boolean&#62; editable&#10;
    /// &#60;Map&#62; map</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the bookmark widget should be rendered.</param>
    /// <field name="bookmarks" type="BookmarkItem">An array of BookmarkItem objects</field>
};

esri.dijit.Bookmarks.prototype = 
{
    addBookmark: function (bookmarkItem) {
        /// <summary>Add a new bookmark to the bookmark widget.</summary>
        /// <param name="bookmarkItem" type="BookmarkItem" optional="false">A BookmarkItem or json object with the same structure that defines the new location.</param>
    },
    destroy: function () {
        /// <summary>Destroy the bookmark widget.</summary>
    },
    hide: function () {
        /// <summary>Hides the Bookmark widget</summary>
    },
    removeBookmark: function (bookmarkName) {
        /// <summary>Remove a bookmark from the bookmark widget</summary>
        /// <param name="bookmarkName" type="String" optional="false">The name of the bookmark to remove from the bookmark widget.</param>
    },
    show: function () {
        /// <summary>Show the Bookmark widget</summary>
    },
    toJson: function () {
        /// <summary>Returns an array of json objects with the following structure:[{ name:bookmarkName, extent:bookmarkExtent}].</summary>
        /// <return type="Object">Object</return>
    },
};

esri.dijit.Directions = function (params,options,srcNodeRef,srcNodeRef) {
    /// <summary>Creates a new Directions dijit using the given DOM node.</summary>
    /// <param name="params" type="Object" optional="false">Various optional parameters that can be used to configure the dijit. &#10;
    /// &#60;Array[] | Boolean | String&#62; alphabet&#10;
    /// &#60;Boolean&#62; canModifyStops&#10;
    /// &#60;Boolean&#62; centerAtSegmentStart&#10;
    /// &#60;Boolean&#62; dragging&#10;
    /// &#60;Boolean&#62; focusOnNewStop&#10;
    /// &#60;PictureMarkerSymbol&#62; fromSymbol&#10;
    /// &#60;PictureMarkerSymbol&#62; fromSymbolDrag&#10;
    /// &#60;Object&#62; geocoderOptions&#10;
    /// &#60;String&#62; locatorUrl&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;RouteParameters&#62; routeParams&#10;
    /// &#60;SimpleLineSymbol&#62; routeSymbol&#10;
    /// &#60;String&#62; routeTaskUrl&#10;
    /// &#60;InfoTemplate&#62; segmentInfoTemplate&#10;
    /// &#60;SimpleLineSymbol&#62; segmentSymbol&#10;
    /// &#60;Boolean&#62; showPrintPage&#10;
    /// &#60;Boolean&#62; showReverseStopsButton&#10;
    /// &#60;Boolean&#62; showSegmentHighlight&#10;
    /// &#60;Boolean&#62; showSegmentPopup&#10;
    /// &#60;PictureMarkerSymbol&#62; stopSymbol&#10;
    /// &#60;PictureMarkerSymbol&#62; stopSymbolDrag&#10;
    /// &#60;Array[]&#62; stops&#10;
    /// &#60;InfoTemplate&#62; stopsInfoTemplate&#10;
    /// &#60;Color&#62; textSymbolColor&#10;
    /// &#60;Font&#62; textSymbolFont&#10;
    /// &#60;Object&#62; textSymbolOffset&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;PictureMarkerSymbol&#62; toSymbol&#10;
    /// &#60;PictureMarkerSymbol&#62; toSymbolDrag</param>
    /// <param name="options" type="Object" optional="false">Various options to configure this dijit. See the list below for details.&#10;
    /// &#60;Array[] | Boolean | String&#62; alphabet&#10;
    /// &#60;Boolean&#62; canModifyStops&#10;
    /// &#60;Boolean&#62; centerAtSegmentStart&#10;
    /// &#60;Boolean&#62; dragging&#10;
    /// &#60;Boolean&#62; focusOnNewStop&#10;
    /// &#60;PictureMarkerSymbol&#62; fromSymbol&#10;
    /// &#60;PictureMarkerSymbol&#62; fromSymbolDrag&#10;
    /// &#60;Object&#62; geocoderOptions&#10;
    /// &#60;String&#62; locatorUrl&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;RouteParameters&#62; routeParams&#10;
    /// &#60;SimpleLineSymbol&#62; routeSymbol&#10;
    /// &#60;String&#62; routeTaskUrl&#10;
    /// &#60;InfoTemplate&#62; segmentInfoTemplate&#10;
    /// &#60;SimpleLineSymbol&#62; segmentSymbol&#10;
    /// &#60;Boolean&#62; showPrintPage&#10;
    /// &#60;Boolean&#62; showReverseStopsButton&#10;
    /// &#60;Boolean&#62; showSegmentHighlight&#10;
    /// &#60;Boolean&#62; showSegmentPopup&#10;
    /// &#60;PictureMarkerSymbol&#62; stopSymbol&#10;
    /// &#60;PictureMarkerSymbol&#62; stopSymbolDrag&#10;
    /// &#60;Array[]&#62; stops&#10;
    /// &#60;InfoTemplate&#62; stopsInfoTemplate&#10;
    /// &#60;Color&#62; textSymbolColor&#10;
    /// &#60;Font&#62; textSymbolFont&#10;
    /// &#60;Object&#62; textSymbolOffset&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;PictureMarkerSymbol&#62; toSymbol&#10;
    /// &#60;PictureMarkerSymbol&#62; toSymbolDrag</param>
    /// <param name="srcNodeRef" type="String" optional="false">Reference or id of an HTML element where the Directions widget should be rendered.</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into. This parameter is always required.</param>
    /// <field name="directions" type="DirectionsFeatureSet">Get the directions to all the locations along the route.</field>
    /// <field name="geocoderResults" type="Object[]">An array of objects that defines the potential matches for the input locations.</field>
    /// <field name="maxStopsReached" type="Boolean">When true the maximum number of stops for the route has been reached.</field>
    /// <field name="mergedRouteGraphic" type="Graphic">The graphic for the calculated route.</field>
    /// <field name="routeParams" type="RouteParameters">Routing parameters for the widget</field>
    /// <field name="routeTask" type="RouteTask">Routing task for the widget</field>
    /// <field name="stops" type="Graphic[]">An array of graphics that define the stop locations along the route.</field>
    /// <field name="theme" type="String">The css theme used to style the widget.</field>
};

esri.dijit.Directions.prototype = 
{
    addStop: function (stop,index) {
        /// <summary>Add a stop to the directions widget at the specified index location.</summary>
        /// <param name="stop" type="Array | Point" optional="false">A string or point that defines the stop location. var companyLocation = new esri.geometry.Point(-98.56, 39.82); //find the customers current location using the geolocation api navigator.geolocation.getCurrentPosition(function(position){ var customerLocation = new Point(position.coords); directions = Directions({ map: map, stops:[companyLocation,customerLocation] },"dir"); directions.startup(); });</param>
        /// <param name="index" type="Number" optional="false">The index location where the stop should be added. </param>
        /// <return type="Deferred">Deferred</return>
    },
    addStops: function (stops,index) {
        /// <summary>Add multiple stops to the directions list starting at the specified location.</summary>
        /// <param name="stops" type="Array[]" optional="false">An array of strings or point that defines the input stops.</param>
        /// <param name="index" type="Number" optional="false">The index location where the stops will be added. </param>
        /// <return type="Deferred">Deferred</return>
    },
    centerAtSegmentStart: function (index) {
        /// <summary>Center the map at the start of the specified route segment.</summary>
        /// <param name="index" type="Number" optional="false">The index of the segment where the map should be centered.</param>
    },
    clearDirections: function () {
        /// <summary>Remove the route directions from the directions list.</summary>
    },
    destroy: function () {
        /// <summary>Destroy the Directions widget.</summary>
    },
    getDirections: function () {
        /// <summary>Calculate the route to the input locations and display the list of directions.</summary>
        /// <return type="Deferred">Deferred</return>
    },
    highlightSegment: function (index) {
        /// <summary>Highlight the specified route segment on the map.</summary>
        /// <param name="index" type="Number" optional="false">The index of the route segment to highlight. </param>
    },
    removeStop: function (index) {
        /// <summary>Remove the stop at the specified index</summary>
        /// <param name="index" type="Number" optional="false">The index of the stop to remove. </param>
        /// <return type="Deferred">Deferred</return>
    },
    removeStops: function () {
        /// <summary>Removes the existing stops from the directions widget.</summary>
    },
    reset: function () {
        /// <summary>Resets the directions widget removing any directions, stops and map graphics</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
    unhighlightSegment: function () {
        /// <summary>Removes the highlight symbol from the currently highlighted route segment</summary>
    },
    updateStop: function (stop,index) {
        /// <summary>Update the existing stop at the specified index location.</summary>
        /// <param name="stop" type="String | Point" optional="false">A string or point that defines the new stop information.</param>
        /// <param name="index" type="Number" optional="false">The index of the stop to update.</param>
        /// <return type="Deferred">Deferred</return>
    },
    updateStops: function (stops) {
        /// <summary>Update multiple stops in the directions widget by specifying an array of stops information.</summary>
        /// <param name="stops" type="Array[]" optional="false">An array of stops. </param>
        /// <return type="Deferred">Deferred</return>
    },
    zoomToFullRoute: function () {
        /// <summary>Zoom so that the full route is displayed within the current map extent</summary>
    },
    zoomToSegment: function (index) {
        /// <summary>Zoom to the specified route segment</summary>
        /// <param name="index" type="Number" optional="false">The index for a route segment.</param>
    },
};

esri.dijit.Gallery = function (params,srcNodeRef) {
    /// <summary>Creates a new mobile Gallery</summary>
    /// <param name="params" type="Object" optional="false">See options list.&#10;
    /// &#60;Object[]&#62; items&#10;
    /// &#60;Boolean&#62; showTitle&#10;
    /// &#60;String&#62; thumbnailStyle</param>
    /// <param name="srcNodeRef" type="String" optional="false">HTML element where the gallery should be rendered.</param>
};

esri.dijit.Gallery.prototype = 
{
    destroy: function () {
        /// <summary>Removes any object references and associated objects created by the gallery.</summary>
    },
    getFocusedItem: function () {
        /// <summary>Gets the item with the current focus</summary>
        /// <return type="Object">Object</return>
    },
    getSelectedItem: function () {
        /// <summary>Get the currently selected item</summary>
        /// <return type="Object">Object</return>
    },
    next: function () {
        /// <summary>Move the gallery to the next page of items</summary>
    },
    previous: function () {
        /// <summary>Move the gallery to the previous page of items</summary>
    },
    select: function (item) {
        /// <summary>Select an item in the gallery</summary>
        /// <param name="item" type="Object" optional="false">The item to select.</param>
    },
    setFocus: function (item) {
        /// <summary>Set the focus to the specified item</summary>
        /// <param name="item" type="Object" optional="false">The item which will have focus.</param>
    },
    startup: function () {
        /// <summary>Finalize the creation of the gallery.</summary>
    },
};

esri.dijit.Gauge = function (params,srcNodeRef) {
    /// <summary>Create a new Gauge object</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;String&#62; caption&#10;
    /// &#60;String&#62; color&#10;
    /// &#60;String&#62; dataField&#10;
    /// &#60;String&#62; dataFormat&#10;
    /// &#60;String&#62; dataLabelField&#10;
    /// &#60;Boolean&#62; fromWebmap&#10;
    /// &#60;GraphicsLayer&#62; layer&#10;
    /// &#60;Number&#62; maxDataValue&#10;
    /// &#60;String&#62; noDataLabel&#10;
    /// &#60;Object&#62; numberFormat&#10;
    /// &#60;String&#62; title&#10;
    /// &#60;String&#62; unitLabel</param>
    /// <param name="srcNodeRef" type="String" optional="false">HTML element where the gauge should be rendered.</param>
};

esri.dijit.Gauge.prototype = 
{
    destroy: function () {
        /// <summary>Destroy the gauge.</summary>
    },
    get: function () {
        /// <summary>Get the value of the property from the Gauge.</summary>
        /// <return type="varies">varies</return>
    },
    set: function () {
        /// <summary>Set the value of a property from the Gauge.</summary>
        /// <return type="varies">varies</return>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the gauge.</summary>
    },
};

esri.dijit.Geocoder = function (params,srcNodeRef) {
    /// <summary>Create a new Geocoder widget using the given DOM node.</summary>
    /// <param name="params" type="Object" optional="false">Set of parameters used to specify Geocoder options. See the options list for details. &#10;
    /// &#60;Boolean || Object &#62; arcgisGeocoder&#10;
    /// &#60;boolean&#62; autoComplete&#10;
    /// &#60;boolean&#62; autoNavigate&#10;
    /// &#60;Boolean&#62; geocoderMenu&#10;
    /// &#60;Array&#62; geocoders&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;Number&#62; maxLocations&#10;
    /// &#60;Number&#62; minCharacters&#10;
    /// &#60;Number&#62; searchDelay&#10;
    /// &#60;Boolean&#62; showResults&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;String&#62; value&#10;
    /// &#60;Number&#62; zoomScale</param>
    /// <param name="srcNodeRef" type="String | DOMNode" optional="false">Reference or id of the HTML element where the widget should be rendered. </param>
    /// <field name="activeGeocoder" type="Object">Currently selected locator object.</field>
    /// <field name="activeGeocoderIndex" type="Number">Current locator index to search by default.</field>
    /// <field name="autoComplete" type="Boolean">When true the auto-complete menu is enabled.</field>
    /// <field name="autoNavigate" type="Boolean">When true, the widget will navigate to the selected location.</field>
    /// <field name="geocoderMenu" type="Boolean">When true the geocoder menu is enabled.</field>
    /// <field name="geocoders" type="Object[]">List of geocoders the widget uses to find search results</field>
    /// <field name="maxLocations" type="Number">Maximum number of locations to display in the results menu</field>
    /// <field name="minCharacters" type="Number">Minimum number of characters required before the query is performed.</field>
    /// <field name="results" type="Object[]">Current results from query or select.</field>
    /// <field name="searchDelay" type="Number">Delay in milliseconds before each keyUp calls for the query to be performed.</field>
    /// <field name="showResults" type="Boolean">When true, suggestions are displayed as the user is typing.</field>
    /// <field name="theme" type="String">Current theme being used to style the widget.</field>
    /// <field name="value" type="String">Current value of the input textbox.</field>
    /// <field name="zoomScale" type="Number">Scale to zoom to when geocoder does not return an extent.</field>
};

esri.dijit.Geocoder.prototype = 
{
    blur: function () {
        /// <summary>Unfocus the widget's text input.</summary>
    },
    clear: function () {
        /// <summary>Clears the values currently set in the widget.</summary>
    },
    destroy: function () {
        /// <summary>Releases all the resources used by the widget.</summary>
    },
    find: function () {
        /// <summary>Executes a search using the current value of the geocoder.</summary>
        /// <return type="Deferred ">Deferred </return>
    },
    focus: function () {
        /// <summary>Brings focus to the widget's text input.</summary>
    },
    hide: function () {
        /// <summary>Hide the widget.</summary>
    },
    select: function (result) {
        /// <summary>Select a result using a result object.</summary>
        /// <param name="result" type="Object" optional="false">An object with the following properties:{ extent: &#60;Extent&#62;, feature: &#60;Feature&#62;, name: &#60;String&#62;}</param>
    },
    show: function () {
        /// <summary>Show the widget.</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the widget.</summary>
    },
};

esri.dijit.HistogramTimeSlider = function (params,srcNodeRef) {
    /// <summary>Creates a new HistogramTimeSlider dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Input parameters. See options table for details.&#10;
    /// &#60;String&#62; color&#10;
    /// &#60;String&#62; dateFormat&#10;
    /// &#60;Layer[]&#62; layers&#10;
    /// &#60;String&#62; mode&#10;
    /// &#60;String&#62; timeInterval</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the tool should be rendered.</param>
};

esri.dijit.HistogramTimeSlider.prototype = 
{
    destroy: function () {
        /// <summary>Set related objects as null and hide the widget</summary>
    },
};

esri.dijit.HomeButton = function (params,srcNodeRef) {
    /// <summary>Creates a new HomeButton dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various parameters to configure this dijit. See the list below for details.&#10;
    /// &#60;Extent&#62; extent&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="extent" type="Extent">The extent used to zoom to when clicked.</field>
    /// <field name="loaded" type="Boolean">Whether the widget has been loaded</field>
    /// <field name="map" type="Map">Map object that this dijit is associated with</field>
    /// <field name="theme" type="String">Class used for styling the widget</field>
    /// <field name="visible" type="Boolean">Whether the widget is visible by default</field>
};

esri.dijit.HomeButton.prototype = 
{
    destroy: function () {
        /// <summary>Destroys the widget</summary>
    },
    hide: function () {
        /// <summary>Hides the widget</summary>
    },
    home: function () {
        /// <summary>Goes to the home extent</summary>
    },
    show: function () {
        /// <summary>Shows the widget</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
};

esri.dijit.InfoWindow = function (params,srcNodeRef) {
    /// <summary>Create a new Info Window.</summary>
    /// <param name="params" type="Object" optional="true">Optional parameters. See the list for valid values.</param>
    /// <param name="srcNodeRef" type="String" optional="false">Reference or id of the HTML element where the widget should be rendered.</param>
    /// <field name="anchor" type="String">Placement of the InfoWindow with respect to the graphic.</field>
    /// <field name="coords" type="Point">The anchor point of the InfoWindow in screen coordinates</field>
    /// <field name="domNode" type="Object">The reference to a DOM node where the info window is constructed.</field>
    /// <field name="fixedAnchor" type="String">InfoWindow always show with the specified anchor.</field>
    /// <field name="isShowing" type="Boolean">Determines whether the InfoWindow is currently shown on the map</field>
};

esri.dijit.InfoWindow.prototype = 
{
    destroyDijits: function () {
        /// <summary>Helper method.</summary>
    },
    hide: function () {
        /// <summary>Hides the InfoWindow</summary>
    },
    move: function (point) {
        /// <summary>Moves the InfoWindow to the specified screen point</summary>
        /// <param name="point" type="Point" optional="false">The new anchor point when moving the InfoWindow.</param>
    },
    place: function (value,parentNode) {
        /// <summary>Helper method.</summary>
        /// <param name="value" type="String|DomNode" optional="false">A string with HTML tags or a DOM node.</param>
        /// <param name="parentNode" type="DOMNode" optional="false">The parent node where the value will be placed.</param>
    },
    resize: function (width,height) {
        /// <summary>Resizes the InfoWindow to the specified height and width in pixels</summary>
        /// <param name="width" type="Number" optional="false">The new width of the InfoWindow in pixels.</param>
        /// <param name="height" type="Number" optional="false">The new height of the InfoWindow in pixels.</param>
    },
    setContent: function (content) {
        /// <summary>Sets the content in the InfoWindow.</summary>
        /// <param name="content" type="Object" optional="false">The content for the InfoWindow. Can be any valid HTML or DOM element.</param>
        /// <return type="InfoWindow">InfoWindow</return>
    },
    setFixedAnchor: function (anchor) {
        /// <summary>Sets the fixed location of the InfoWindow anchor.</summary>
        /// <param name="anchor" type="String" optional="false">Fixed anchor that cannot be overridden by InfoWindow.show(). See Constants table for values.</param>
    },
    setMap: function (map) {
        /// <summary>This method is called by the map when the object is set as its info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
    setTitle: function (title) {
        /// <summary>Sets the title for the InfoWindow.</summary>
        /// <param name="title" type="String" optional="false">The title for the InfoWindow. Can be any valid HTML.</param>
        /// <return type="InfoWindow">InfoWindow</return>
    },
    show: function (point,placement) {
        /// <summary>Display the InfoWindow at the specified location.</summary>
        /// <param name="point" type="Point" optional="false">Location to place anchor.</param>
        /// <param name="placement" type="String" optional="true">Placement of the InfoWindow with respect to the graphic. See the Constants table for values.</param>
    },
    startupDijits: function () {
        /// <summary>Helper method.</summary>
    },
    unsetMap: function (map) {
        /// <summary>This method is called by the map when the object is no longer the map's info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
};

esri.dijit.InfoWindowLite = function () {

    /// <field name="anchor" type="String">Placement of the InfoWindow with respect to the graphic.</field>
    /// <field name="coords" type="Point">The anchor point of the InfoWindowLite in screen coordinates</field>
    /// <field name="domNode" type="Object">The reference to a DOM node where the info window is constructed.</field>
    /// <field name="fixedAnchor" type="String">Always display the info window using the specified anchor.</field>
    /// <field name="isShowing" type="Boolean">Determines whether the InfoWindowLite is currently shown on the map</field>
};

esri.dijit.InfoWindowLite.prototype = 
{
    destroyDijits: function () {
        /// <summary>Helper method.</summary>
    },
    hide: function () {
        /// <summary>Hides the InfoWindow</summary>
    },
    move: function (point) {
        /// <summary>Moves the InfoWindow to the specified screen point</summary>
        /// <param name="point" type="Point" optional="false">The new anchor point when moving the InfoWindowLite.</param>
    },
    place: function (value,parentNode) {
        /// <summary>Helper method.</summary>
        /// <param name="value" type="String|DomNode" optional="false">A string with HTML tags or a DOM node.</param>
        /// <param name="parentNode" type="DOMNode" optional="false">The parent node where the value will be placed.</param>
    },
    resize: function (width,height) {
        /// <summary>Resizes the InfoWindowLite to the specified height and width in pixels</summary>
        /// <param name="width" type="Number" optional="false">The new width of the InfoWindowLite in pixels.</param>
        /// <param name="height" type="Number" optional="false">The new height of the InfoWindowLite in pixels.</param>
    },
    setContent: function (content) {
        /// <summary>Sets the content in the InfoWindow</summary>
        /// <param name="content" type="Object" optional="false">The content for the InfoWindow. Can be any valid HTML or DOM element.</param>
    },
    setFixedAnchor: function (anchor) {
        /// <summary>Set the fixed location of the InfoWindowLite anchor.</summary>
        /// <param name="anchor" type="String" optional="false">Fixed anchor that cannot be overridden by InfoWindowLite.show(). See InfoWindow Constants table for values.</param>
    },
    setMap: function (map) {
        /// <summary>This method is called by the map when the object is set as its info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
    setTitle: function (title) {
        /// <summary>Define the title for the InfoWindowLite.</summary>
        /// <param name="title" type="String" optional="false">The title for the InfoWindowLite. Can be any valid HTML.</param>
        /// <return type="InfoWindow">InfoWindow</return>
    },
    show: function (point,placement) {
        /// <summary>Display the InfoWindow at the specified location.</summary>
        /// <param name="point" type="Point" optional="false">Location to place anchor.</param>
        /// <param name="placement" type="String" optional="true">Placement of the InfoWindow with respect to the graphic. See the InfoWindow Constants table for values.</param>
    },
    startupDijits: function () {
        /// <summary>Helper method.</summary>
    },
    unsetMap: function (map) {
        /// <summary>This method is called by the map when the object is no longer the map's info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
};

esri.dijit.LayerSwipe = function (params,srcNodeRef) {
    /// <summary>Creates a new LayerSwipe dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various parameters to configure this dijit. See the list below for details.&#10;
    /// &#60;Number&#62; clip&#10;
    /// &#60;Boolean&#62; enabled&#10;
    /// &#60;Layer[]&#62; layers&#10;
    /// &#60;Number&#62; left&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;Number&#62; top&#10;
    /// &#60;String&#62; type</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="clip" type="Number">The number of pixels to clip the swipe tool</field>
    /// <field name="enabled" type="Boolean">If the widget is enabled and layers can be swiped</field>
    /// <field name="layers" type="Layer[]">The layers to be swiped</field>
    /// <field name="left" type="Number">The number of pixels to place the tool from the left of the map</field>
    /// <field name="loaded" type="Boolean">Whether the widget has been loaded</field>
    /// <field name="map" type="Map">Map object that this dijit is associated with</field>
    /// <field name="theme" type="String">Class used for styling the widget</field>
    /// <field name="top" type="Number">The number of pixels to place the tool from the top of the map</field>
    /// <field name="type" type="String">Type of swipe tool to use</field>
    /// <field name="visible" type="Boolean">Whether the widget is visible by default</field>
};

esri.dijit.LayerSwipe.prototype = 
{
    destroy: function () {
        /// <summary>Destroys the widget</summary>
    },
    disable: function () {
        /// <summary>Disables the widget</summary>
    },
    enable: function () {
        /// <summary>Enables the widget</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
    swipe: function () {
        /// <summary>Updates the map to the position of the swipe node</summary>
    },
};

esri.dijit.Legend = function (params,srcNodeRef) {
    /// <summary>Creates a new Legend dijit.</summary>
    /// <param name="params" type="Object" optional="false">Parameters used to configure the dijit. See the list below for details.&#10;
    /// &#60;Number&#62; arrangement&#10;
    /// &#60;Boolean&#62; autoUpdate&#10;
    /// &#60;Object[]&#62; layerInfos&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;Boolean&#62; respectCurrentMapScale</param>
    /// <param name="srcNodeRef" type="String" optional="false">Reference or id of the HTML element where the widget should be rendered.</param>
};

esri.dijit.Legend.prototype = 
{
    destroy: function () {
        /// <summary>Destroys the legend.</summary>
    },
    refresh: function () {
        /// <summary>Refresh the legend.</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the legend .</summary>
    },
};

esri.dijit.LocateButton = function (params,srcNodeRef) {
    /// <summary>Creates a new LocateButton dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various parameters to configure this dijit. See the list below for details.&#10;
    /// &#60;Boolean&#62; centerAt&#10;
    /// &#60;Object&#62; geolocationOptions&#10;
    /// &#60;Boolean&#62; highlightLocation&#10;
    /// &#60;InfoTemplate&#62; infoTemplate&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;Number&#62; scale&#10;
    /// &#60;Boolean&#62; setScale&#10;
    /// &#60;Symbol&#62; symbol&#10;
    /// &#60;String&#62; theme&#10;
    /// &#60;Boolean&#62; useTracking&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="centerAt" type="Boolean">Centers the map to the location when a new position is returned</field>
    /// <field name="geolocationOptions" type="Object">The HTML5 Geolocation Position options for locating.</field>
    /// <field name="highlightLocation" type="Boolean">If true, the users location will be highlighted with a point</field>
    /// <field name="infoTemplate" type="InfoTemplate">The infoTemplate used for the highlight graphic</field>
    /// <field name="loaded" type="Boolean">Whether the widget has been loaded</field>
    /// <field name="map" type="Map">Map object that this dijit is associated with</field>
    /// <field name="scale" type="Number">The scale to zoom to when a users location has been found</field>
    /// <field name="setScale" type="Boolean">Sets the maps scale when a new position is returned</field>
    /// <field name="symbol" type="Symbol">The symbol used on the highlight graphic to highlight the users location on the map</field>
    /// <field name="theme" type="String">Class used for styling the widget</field>
    /// <field name="tracking" type="Boolean">Shows the current tracking state.</field>
    /// <field name="useTracking" type="Boolean">When enabled, the button becomes a toggle that creates an event to watch for location changes</field>
    /// <field name="visible" type="Boolean">Whether the widget is visible</field>
};

esri.dijit.LocateButton.prototype = 
{
    clear: function () {
        /// <summary>Clears the point graphic</summary>
    },
    destroy: function () {
        /// <summary>Destroys the widget</summary>
    },
    hide: function () {
        /// <summary>Hides the widget</summary>
    },
    locate: function () {
        /// <summary>Goes to the users extent</summary>
        /// <return type="Deferred">Deferred</return>
    },
    show: function () {
        /// <summary>Shows the widget</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
};

esri.dijit.Measurement = function (params,srcNodeRef) {
    /// <summary>Creates a new Measurement widget, the widget should be created in the map's onLoad event handler</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;Units&#62; defaultAreaUnit&#10;
    /// &#60;Units&#62; defaultLengthUnit&#10;
    /// &#60;SimpleLineSymbol&#62; lineSymbol&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;MarkerSymbol&#62; pointSymbol</param>
    /// <param name="srcNodeRef" type="String" optional="false">Reference or id of the HTML element where the widget should be rendered.</param>
};

esri.dijit.Measurement.prototype = 
{
    clearResult: function () {
        /// <summary>Remove the measurement graphics and results</summary>
    },
    destroy: function () {
        /// <summary>Destroy the measurement widget</summary>
    },
    hide: function () {
        /// <summary>Hide the measurement widget</summary>
    },
    hideTool: function (toolName) {
        /// <summary>Hide the specified tool</summary>
        /// <param name="toolName" type="String" optional="false"> Valid values are "area","distance","location".</param>
    },
    setTool: function (toolName,activate) {
        /// <summary>Activate or deactivate a tool.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the tool to activate or deactivate. Valid values are "area", "distance", "location".</param>
        /// <param name="activate" type="Boolean" optional="false">When true, the specified tool is activated. Set to false to deactivate the tool.</param>
    },
    show: function () {
        /// <summary>Show the measurement widget after it has been hidden using the hide method</summary>
    },
    showTool: function (toolName) {
        /// <summary>Display the specified tool</summary>
        /// <param name="toolName" type="String" optional="false"> Valid values are "area","distance","location".</param>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the measurement widget .</summary>
    },
};

esri.dijit.OverviewMap = function (params,srcNodeRef) {
    /// <summary>Creates a new OverviewMap object</summary>
    /// <param name="params" type="Object" optional="false">Parameters that define the functionality of the OverviewMap widget. See the parameters information for details.&#10;
    /// &#60;String&#62; attachTo&#10;
    /// &#60;Layer&#62; baseLayer&#10;
    /// &#60;String&#62; color&#10;
    /// &#60;Number&#62; expandFactor&#10;
    /// &#60;Number&#62; height&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;Boolean&#62; maximizeButton&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;Boolean&#62; visible&#10;
    /// &#60;Number&#62; width</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the widget should be rendered.</param>
};

esri.dijit.OverviewMap.prototype = 
{
    destroy: function () {
        /// <summary>Releases the resources used by the dijit.</summary>
    },
    hide: function () {
        /// <summary>Hide the overview map</summary>
    },
    show: function () {
        /// <summary>Show the overview map</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the OverviewMap dijit.</summary>
    },
};

esri.dijit.Popup = function (options,srcNodeRef) {
    /// <summary>Create a new Popup object</summary>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; anchor&#10;
    /// &#60;FillSymbol&#62; fillSymbol&#10;
    /// &#60;Boolean&#62; highlight&#10;
    /// &#60;Boolean&#62; keepHighlightOnHide&#10;
    /// &#60;LineSymbol&#62; lineSymbol&#10;
    /// &#60;Number&#62; marginLeft&#10;
    /// &#60;Number&#62; marginTop&#10;
    /// &#60;MarkerSymbol&#62; markerSymbol&#10;
    /// &#60;Number&#62; offsetX&#10;
    /// &#60;Number&#62; offsetY&#10;
    /// &#60;Boolean&#62; pagingControls&#10;
    /// &#60;Boolean&#62; pagingInfo&#10;
    /// &#60;Boolean&#62; popupWindow&#10;
    /// &#60;Boolean&#62; titleInBody&#10;
    /// &#60;Number&#62; zoomFactor</param>
    /// <param name="srcNodeRef" type="String" optional="false">Reference or id of the HTML element where the widget should be rendered.</param>
    /// <field name="count" type="Number">The number of features associated with the info window</field>
    /// <field name="deferreds" type="Deferred[]">An array of pending deferreds, null if there are not any pending deferreds.</field>
    /// <field name="domNode" type="Object">The HTML element (reference to a DOM Node) where the info window is constructed</field>
    /// <field name="features" type="Graphic[]">The array of features currently associated with the info window.</field>
    /// <field name="hideDelay" type="Number">Number of milliseconds after which the popup window will be hidden when visibleWhenEmpty is false and there are no features to be displayed</field>
    /// <field name="highlight" type="Boolean">Indicates whether popup should highlight features</field>
    /// <field name="isShowing" type="Boolean">Indicates if the info window is visible.</field>
    /// <field name="selectedIndex" type="Number">The index of the currently selected feature in the features array.</field>
    /// <field name="visibleWhenEmpty" type="Boolean">Indicates whether the popup window remains visible when there are no features to be displayed</field>
};

esri.dijit.Popup.prototype = 
{
    clearFeatures: function () {
        /// <summary>Removes all features and destroys any pending deferreds</summary>
    },
    destroy: function () {
        /// <summary>Destroy the popup.</summary>
    },
    destroyDijits: function () {
        /// <summary>Helper method.</summary>
    },
    getSelectedFeature: function () {
        /// <summary>Get the currently selected feature</summary>
        /// <return type="Graphic">Graphic</return>
    },
    hide: function () {
        /// <summary>Hide the info window</summary>
    },
    maximize: function () {
        /// <summary>Maximize the info window</summary>
    },
    place: function (value,parentNode) {
        /// <summary>Helper method.</summary>
        /// <param name="value" type="String|DomNode" optional="false">A string with HTML tags or a DOM node.</param>
        /// <param name="parentNode" type="DOMNode" optional="false">The parent node where the value will be placed.</param>
    },
    reposition: function () {
        /// <summary>Re-calculates the popup's position with respect to the map location it is pointing to.</summary>
    },
    resize: function (width,height) {
        /// <summary>Resize the info window to the specified height (in pixels)</summary>
        /// <param name="width" type="Number" optional="false">The new width of the InfoWindow in pixels.</param>
        /// <param name="height" type="Number" optional="false">The new height of the InfoWindow in pixels. This value is set to be the maximum allowable height, if the content doesn't fit within the specified height a vertical scroll bar is displayed.</param>
    },
    restore: function () {
        /// <summary>Restore the info window to the pre-maximized state</summary>
    },
    select: function (index) {
        /// <summary>Selects the feature at the specified index</summary>
        /// <param name="index" type="Number" optional="false">The index of the feature to select.</param>
    },
    setContent: function (content) {
        /// <summary>Set the content for the info window.</summary>
        /// <param name="content" type="String|Function" optional="false">The content for the info window.</param>
    },
    setFeatures: function (features) {
        /// <summary>Associate an array of features or an array of deferreds that return features with the info window.</summary>
        /// <param name="features" type="Feature[] | Deferreds[]" optional="false">An array of features or deferreds.</param>
    },
    setMap: function (map) {
        /// <summary>This method is called by the map when the object is set as its info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
    setTitle: function (title) {
        /// <summary>Sets the info window title.</summary>
        /// <param name="title" type="String | Function" optional="false">The text for the title.</param>
    },
    show: function (location,options) {
        /// <summary>Display the info window at the specified location</summary>
        /// <param name="location" type="Point" optional="false">An instance of esri.geometry.Point that represents the geographic location to display the popup.</param>
        /// <param name="options" type="Object" optional="true">Optional parameters. (As of 3.0). &#60;Boolean&#62; closestFirst When using the setFeatures method to display multiple features in the popup, enable this option to display the feature closest to the specified location first. </param>
    },
    startupDijits: function () {
        /// <summary>Helper method.</summary>
    },
    unsetMap: function (map) {
        /// <summary>This method is called by the map when the object is no longer the map's info window.</summary>
        /// <param name="map" type="Map" optional="false">The map object.</param>
    },
};

esri.dijit.PopupMobile = function (options,srcNodeRef) {
    /// <summary>Create a new PopupMobile object</summary>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;FillSymbol&#62; fillSymbol&#10;
    /// &#60;Boolean&#62; highlight&#10;
    /// &#60;LineSymbol&#62; lineSymbol&#10;
    /// &#60;Number&#62; marginLeft&#10;
    /// &#60;Number&#62; marginTop&#10;
    /// &#60;MarkerSymbol&#62; markerSymbol&#10;
    /// &#60;Number&#62; offsetX&#10;
    /// &#60;Number&#62; offsetY&#10;
    /// &#60;Number&#62; zoomFactor</param>
    /// <param name="srcNodeRef" type="String" optional="false">Reference or id of the HTML element where the widget should be rendered.</param>
};

esri.dijit.PopupMobile.prototype = 
{
    clearFeatures: function () {
        /// <summary>Removes all features and destroys any pending deferreds</summary>
    },
    destroy: function () {
        /// <summary>Destroy the popup.</summary>
    },
    getSelectedFeature: function () {
        /// <summary>Get the currently selected feature</summary>
        /// <return type="Graphic">Graphic</return>
    },
    hide: function () {
        /// <summary>Hide the info window</summary>
    },
    select: function (index) {
        /// <summary>Selects the feature at the specified index</summary>
        /// <param name="index" type="Number" optional="false">The index of the feature to select.</param>
    },
    setContent: function (content) {
        /// <summary>Set the content for the info window.</summary>
        /// <param name="content" type="String|Function" optional="false">The content for the info window.</param>
    },
    setFeatures: function (features) {
        /// <summary>Associate an array of features or an array of deferreds that return features with the info window.</summary>
        /// <param name="features" type="Feature[] | Deferreds[]" optional="false">An array of features or deferreds.</param>
        /// <return type="Graphics[] | Deferred[]">Graphics[] | Deferred[]</return>
    },
    setTitle: function (title) {
        /// <summary>Sets the info window title.</summary>
        /// <param name="title" type="String | Function" optional="false">The text for the title.</param>
    },
    show: function (location) {
        /// <summary>Display the info window at the specified location</summary>
        /// <param name="location" type="Point" optional="false">An instance of esri.geometry.Point that represents the geographic location to display the popup.</param>
    },
};

esri.dijit.PopupTemplate = function (popupInfo,options) {
    /// <summary>Create a new PopupTemplate object</summary>
    /// <param name="popupInfo" type="Object" optional="false">An object that defines popup content. Field names can be used in the content by specifying the field name in curly brackets, for example {description}. View the Popup Content help topic for information on the object properties.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list for details.&#10;
    /// &#60;Number&#62; utcOffset</param>
    /// <field name="info" type="Object">The popup definition defined as JavaScript object</field>
};

esri.dijit.Print = function (params,srcNodeRef) {
    /// <summary>Creates a new Print widget</summary>
    /// <param name="params" type="Object" optional="false">Parameters for the print widget. See the options table below for details on the parameters.&#10;
    /// &#60;Boolean&#62; async&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;PrintTemplate[]&#62; templates&#10;
    /// &#60;String&#62; url</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the print widget button and drop down list will be rendered.</param>
};

esri.dijit.Print.prototype = 
{
    destroy: function () {
        /// <summary>Destroys the print widget.</summary>
    },
    hide: function () {
        /// <summary>Hide the print widget</summary>
    },
    show: function () {
        /// <summary>Set the print widget's visibility to true</summary>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the print widget.</summary>
    },
};

esri.dijit.Scalebar = function (params,srcNodeRef) {
    /// <summary>Creates a new Scalebar dijit.</summary>
    /// <param name="params" type="Object" optional="false">Parameters used to configure the widgit. See the list below for details.&#10;
    /// &#60;String&#62; attachTo&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; scalebarStyle&#10;
    /// &#60;String&#62; scalebarUnit</param>
    /// <param name="srcNodeRef" type="String" optional="true">Reference or id of the HTML element where the widget should be rendered.</param>
};

esri.dijit.Scalebar.prototype = 
{
    destroy: function () {
        /// <summary>Destroy the scalebar.</summary>
    },
    hide: function () {
        /// <summary>Hide the scalebar dijit</summary>
    },
    show: function () {
        /// <summary>Set the scalebar's visibility to true.</summary>
    },
};

esri.dijit.TimeSlider = function (params,srcNodeRef) {
    /// <summary>Creates a new TimeSlider object</summary>
    /// <param name="params" type="String" optional="false">Parameters for the time slider object. See the options table below for parameters.&#10;
    /// &#60;Boolean&#62; excludeDataAtLeadingThumb&#10;
    /// &#60;Boolean&#62; excludeDataAtTrailingThumb</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the time slider should be rendered.</param>
    /// <field name="loop" type="Boolean">Default value is false</field>
    /// <field name="playing" type="Boolean">Default value is false</field>
    /// <field name="thumbCount" type="Number">Default value is 1</field>
    /// <field name="thumbMovingRate" type="Number">Rate at which the time animation plays.</field>
    /// <field name="timeStops" type="Date[]">An array of dates representing the stops (tics) on the TimeSlider</field>
};

esri.dijit.TimeSlider.prototype = 
{
    createTimeStopsByCount: function (timeExtent,count) {
        /// <summary>The specified number of time stops are created for the input time extent</summary>
        /// <param name="timeExtent" type="TimeExtent" optional="false">The time extent used to define the time slider's start and end time stops.</param>
        /// <param name="count" type="Number" optional="true">The number of time stops to create.</param>
    },
    createTimeStopsByTimeInterval: function (timeExtent,timeInterval,timeIntervalUnits) {
        /// <summary>Create a time stop for each interval specified, i.e.(week, month, day)</summary>
        /// <param name="timeExtent" type="TimeExtent" optional="false">The time extent used to define the time slider's start and end time stops.</param>
        /// <param name="timeInterval" type="Number" optional="true">The length of the time interval.</param>
        /// <param name="timeIntervalUnits" type="String" optional="true"> Valid values are listed in the TimeInfo constants table.</param>
    },
    getCurrentTimeExtent: function () {
        /// <summary>Gets the current time extent for the time slider</summary>
        /// <return type="TimeExtent">TimeExtent</return>
    },
    next: function () {
        /// <summary>Move to the next time step</summary>
    },
    pause: function () {
        /// <summary>Pause the time slider</summary>
    },
    play: function () {
        /// <summary>Play the time slider</summary>
    },
    previous: function () {
        /// <summary>Move to the previous time step</summary>
    },
    setLabels: function (labels) {
        /// <summary>Specify an array of strings to be used as labels.</summary>
        /// <param name="labels" type="String[]" optional="false">An array of strings that define the labels for each tick.</param>
    },
    setLoop: function (loop) {
        /// <summary>Determines whether or not loop.</summary>
        /// <param name="loop" type="Boolean" optional="false">True plays the time slider continuously. Default value is false.</param>
    },
    setThumbCount: function (thumbCount) {
        /// <summary>The number of thumbs to display.</summary>
        /// <param name="thumbCount" type="Number" optional="false">The number of thumbs to display. Default value is one.</param>
    },
    setThumbIndexes: function (indexes) {
        /// <summary>Array of two integers, the first value determines where to put the first thumb.</summary>
        /// <param name="indexes" type="Array" optional="false">Array of two integers.</param>
    },
    setThumbMovingRate: function (thumbMovingRate) {
        /// <summary>Change the rate at which the time animation plays</summary>
        /// <param name="thumbMovingRate" type="Number" optional="false">The rate at which the time slider plays. Default value is 1500.</param>
    },
    setTickCount: function (count) {
        /// <summary>Specify the number of ticks to display on the time slider</summary>
        /// <param name="count" type="Number" optional="false">The number of ticks to display on the slider.</param>
    },
    setTimeStops: function (timeStops) {
        /// <summary>Manually define the time stop locations by providing an array of dates</summary>
        /// <param name="timeStops" type="Date[]" optional="false">Array of dates</param>
    },
    singleThumbAsTimeInstant: function (createTimeInstants) {
        /// <summary>Determine if the time is displayed for an instant in time.</summary>
        /// <param name="createTimeInstants" type="Boolean" optional="false">When true, the time slider displays features for the current point in time. When false cumulative data is displayed from the start time to the current thumb location. The default value is false.</param>
    },
};

esri.dijit.analysis = function () {
    /// <summary>The esri.dijit.analysis namespace.</summary>
};

esri.dijit.analysis.AggregatePoints = function (params,srcNodeRef) {
    /// <summary>Creates a new AggregatePoints dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;String&#62; groupByField&#10;
    /// &#60;Boolean&#62; keepBoundariesWithNoPoints&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;FeatureLayer&#62; pointLayer&#10;
    /// &#60;FeatureLayer&#62; polygonLayer&#10;
    /// &#60;FeatureLayer[]&#62; polygonLayers&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder&#10;
    /// &#60;String[]&#62; summaryFields</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="groupByField" type="String">A field name from pointLayer based on which the points will be grouped.</field>
    /// <field name="keepBoundariesWithNoPoints" type="Boolean">When true, the polygons that have no points within them will be returned in the output</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="pointLayer" type="FeatureLayer">The point feature layer that will be aggregated into the polygons in the polygon feature layer</field>
    /// <field name="polygonLayer" type="FeatureLayer">The polygon layer to be shown selected in in the Choose area menu.</field>
    /// <field name="polygonLayers" type="FeatureLayer[]">An array of feature layer candidates to be selected as the input polygon layer.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
    /// <field name="summaryFields" type="String[]">An array of attribute field names and statistic types that you would like to aggregate for all points within each polygon.</field>
};

esri.dijit.analysis.AggregatePoints.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.AnalysisBase = function () {

};

esri.dijit.analysis.AnalysisBase.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.CreateBuffers = function (params,srcNodeRef) {
    /// <summary>Creates a new CreateBuffers dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;Number[]&#62; bufferDistance&#10;
    /// &#60;FeatureLayer&#62; inputLayer&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;String&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="bufferDistance" type="Number[]">An array of buffer distances to buffer the input feature layer.</field>
    /// <field name="inputLayer" type="FeatureLayer">The input point, line, or polygon feature layer to be buffered</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="String">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
};

esri.dijit.analysis.CreateBuffers.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.CreateDriveTimeAreas = function (params,srcNodeRef) {
    /// <summary>Creates a new CreateDriveTimeAreas dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;String&#62; breakUnits&#10;
    /// &#60;Number[]&#62; breakValues&#10;
    /// &#60;FeatureLayer&#62; inputLayer&#10;
    /// &#60;String&#62; inputType&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; overlapPolicy&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="breakUnits" type="String">The units of the breakValues parameter</field>
    /// <field name="breakValues" type="Number[]">An array of driving time break values.</field>
    /// <field name="inputLayer" type="FeatureLayer">The point feature layer around which drive-time areas will be drawn</field>
    /// <field name="inputType" type="String">The geometry type of the input layer</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="overlapPolicy" type="String">The rule of overlap.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
};

esri.dijit.analysis.CreateDriveTimeAreas.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.DissolveBoundaries = function (params,srcNodeRef) {
    /// <summary>Creates a new DissolveBoundaries dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;String[]&#62; dissolveFields&#10;
    /// &#60;FeatureLayer&#62; inputLayer&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder&#10;
    /// &#60;String[]&#62; summaryFields</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="dissolveFields" type="String[]">An array of field names based on which polygons are merged.</field>
    /// <field name="inputLayer" type="FeatureLayer">The layer containing polygon features that will be dissolved</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
    /// <field name="summaryFields" type="String[]">An array of field names and statistical summary types that you wish to calculate from the polygons that are dissolved together.</field>
};

esri.dijit.analysis.DissolveBoundaries.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.EnrichLayer = function (params,srcNodeRef) {
    /// <summary>Creates a new EnrichLayer dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;Number&#62; distance&#10;
    /// &#60;FeatureLayer&#62; inputLayer&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder&#10;
    /// &#60;Boolean&#62; showTrafficWidget</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="distance" type="Number">An buffer distance or driving time value to buffer the input feature layer.</field>
    /// <field name="inputLayer" type="FeatureLayer">The input feature layer to enrich with new data</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
    /// <field name="showTrafficWidget" type="Boolean">When true, you can specify a time for traffic condition under Define areas to enrich - Driving Time.</field>
};

esri.dijit.analysis.EnrichLayer.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.ExtractData = function (params,srcNodeRef) {
    /// <summary>Creates a new ExtractData dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;Boolean&#62; clip&#10;
    /// &#60;String&#62; dataFormat&#10;
    /// &#60;FeatureLayer[]&#62; featureLayers&#10;
    /// &#60;FeatureLayer[]&#62; inputLayers&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="clip" type="Boolean">If true, the Clip features option in Study area will be ckecked.</field>
    /// <field name="dataFormat" type="String">The format of output data shown as the default selection in the Output data format menu</field>
    /// <field name="featureLayers" type="FeatureLayer[]">An array for feature layers to be extracted.</field>
    /// <field name="inputLayers" type="FeatureLayer[]">An array for feature layers to be shown in the Layers to extract menu as selected</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
};

esri.dijit.analysis.ExtractData.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.FindHotSpots = function (params,srcNodeRef) {
    /// <summary>Creates a new FindHotSpots dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. Refer to the Options table below.&#10;
    /// &#60;FeatureLayer[]&#62; aggregationPolygonLayers&#10;
    /// &#60;String&#62; analysisField&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;FeatureLayer&#62; analysisLayer&#10;
    /// &#60;FeatureLayer[]&#62; boundingPolygonLayers&#10;
    /// &#60;Boolean&#62; isProcessInfo&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="aggregationPolygonLayers" type="FeatureLayer[]">An array of feature layer candidates to be selected as the aggregation polygon layer.</field>
    /// <field name="analysisField" type="String">The numeric field in the AnalysisLayer that will be analyzed.</field>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="analysisLayer" type="FeatureLayer">The feature layer for which hot spots will be calculated.</field>
    /// <field name="boundingPolygonLayers" type="FeatureLayer[]">An array of feature layer candidates to be selected as the bounding polygon layer.</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
};

esri.dijit.analysis.FindHotSpots.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.FindNearest = function (params,srcNodeRef) {
    /// <summary>Creates a new FindNearest dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;FeatureLayer&#62; analysisLayer&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;Number&#62; maxCount&#10;
    /// &#60;FeatureLayer&#62; nearLayer&#10;
    /// &#60;FeatureLayer[]&#62; nearLayers&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Number&#62; searchCutoff&#10;
    /// &#60;String&#62; searchCutoffUnits&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="analysisLayer" type="FeatureLayer">The feature layer from which the nearest features are found</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="maxCount" type="Number">The maximum number of nearest locations to find for each feature in analysisLayer</field>
    /// <field name="nearLayer" type="FeatureLayer">The feature layer to be shown selected in the "1.</field>
    /// <field name="nearLayers" type="FeatureLayer[]">An array of near layer candidates.</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="searchCutoff" type="Number">The maximum range to search for nearest locations from each feature in the analysisLayer.</field>
    /// <field name="searchCutoffUnits" type="String">The units of the searchCutoff parameter.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
};

esri.dijit.analysis.FindNearest.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.MergeLayers = function (params,srcNodeRef) {
    /// <summary>Creates a new MergeLayers dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;FeatureLayer&#62; inputLayer&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;FeatureLayer[]&#62; mergeLayers&#10;
    /// &#60;String[]&#62; mergingAttributes&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="inputLayer" type="FeatureLayer">The feature layer to be merged with the mergeLayer</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="mergeLayers" type="FeatureLayer[]">An array of feature layer candidates to be selected as the merge layer.</field>
    /// <field name="mergingAttributes" type="String[]">An array of values that describe how fields from the mergeLayer are to be modified.</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
};

esri.dijit.analysis.MergeLayers.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.OverlayLayers = function (params,srcNodeRef) {
    /// <summary>Creates a new OverlayLayers dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;FeatureLayer&#62; inputLayer&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;FeatureLayer[]&#62; overlayLayer&#10;
    /// &#60;String&#62; overlayType&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder&#10;
    /// &#60;Boolean&#62; snapToInput&#10;
    /// &#60;Number&#62; tolerance</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="inputLayer" type="FeatureLayer">The feature layer that will be overlayed with the overlayLayer</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="overlayLayer" type="FeatureLayer[]">An array of feature layers to be overlaid with inputLayer.</field>
    /// <field name="overlayType" type="String">Defines how two input layers are combined.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
    /// <field name="snapToInput" type="Boolean">When the distance between features is less than the tolerance, the features in the overlay layer will snap to the features in the input layer</field>
    /// <field name="tolerance" type="Number">The minimum distance separating all feature coordinates (nodes and vertices) as well as the distance a coordinate can move in X or Y (or both)</field>
};

esri.dijit.analysis.OverlayLayers.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.SummarizeNearby = function (params,srcNodeRef) {
    /// <summary>Creates a new SummarizeNearby dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object except toolName, helpFileName and resultParameter.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;Number[]&#62; distance&#10;
    /// &#60;String&#62; groupByField&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; nearType&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;String&#62; shapeUnits&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder&#10;
    /// &#60;FeatureLayer&#62; sumNearbyLayer&#10;
    /// &#60;Boolean&#62; sumShape&#10;
    /// &#60;String[]&#62; summaryFields&#10;
    /// &#60;FeatureLayer&#62; summaryLayer&#10;
    /// &#60;FeatureLayer[]&#62; summaryLayers&#10;
    /// &#60;String&#62; units</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="distance" type="Number[]">An array of numbers that defines the search distance (for StraightLine or DrivingDistance) or time (for DrivingTime) shown in the distance input in the Find nearest features using a option</field>
    /// <field name="groupByField" type="String">A field of the summarizeLayer features that you can use to calculate statistics separately for each unique attribute value</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="nearType" type="String">Type of distance measurement shown as the defeault value in the Find nearest features using a option</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="shapeUnits" type="String">Type of units shown under the Total Area checkbox in the Add statistics from option</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
    /// <field name="sumNearbyLayer" type="FeatureLayer">The point, line, or polygon feature layer from which distances will be measured to features in summarizeLayer</field>
    /// <field name="sumShape" type="Boolean">If true.</field>
    /// <field name="summaryFields" type="String[]">An array of possible statistics attribute field names and summary types that you wish to calculate for all nearby features.Syntax: ["fieldName summaryType","fieldName summaryType", .]fieldName is the name of one of the numeric fields found in the summarizeLayer.summaryType is one of the following:Sum - Adds the total value of all nearby features.Mean - Calculates the average of all nearby features.Min - Finds the smallest value of all nearby features.Max - Finds the largest value of all nearby features.Stddev - Finds the standard deviation of all nearby features</field>
    /// <field name="summaryLayer" type="FeatureLayer">The feature layer to be shown selected in the Choose layer to summarize dropdown</field>
    /// <field name="summaryLayers" type="FeatureLayer[]">An array of possible feature layers summarizing toward.</field>
    /// <field name="units" type="String">Type of units shown as the defeault value in the Find nearest features using a option</field>
};

esri.dijit.analysis.SummarizeNearby.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.analysis.SummarizeWithin = function (params,srcNodeRef) {
    /// <summary>Creates a new SummarizeWithin dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various options to configure this dijit. All the properties can be passed into the params object.&#10;
    /// &#60;String&#62; analysisGpServer&#10;
    /// &#60;String&#62; groupByField&#10;
    /// &#60;Map&#62; map&#10;
    /// &#60;String&#62; outputLayerName&#10;
    /// &#60;String&#62; portalUrl&#10;
    /// &#60;Boolean&#62; returnFeatureCollection&#10;
    /// &#60;Boolean&#62; showChooseExtent&#10;
    /// &#60;Boolean&#62; showCredits&#10;
    /// &#60;Boolean&#62; showHelp&#10;
    /// &#60;Boolean&#62; showSelectFolder&#10;
    /// &#60;FeatureLayer&#62; sumWithinLayer&#10;
    /// &#60;String&#62; summaryFields&#10;
    /// &#60;FeatureLayer&#62; summaryLayer&#10;
    /// &#60;FeatureLayer[]&#62; summaryLayers</param>
    /// <param name="srcNodeRef" type="DOMNode | String" optional="false">Reference or id of a HTML element that this dijit is rendered into.</param>
    /// <field name="analysisGpServer" type="String">URL to the GPServer to be used for this analysis</field>
    /// <field name="groupByField" type="String">A field name from summaryLayer that you can use to calculate statistics separately for each unique attribute value.</field>
    /// <field name="map" type="Map">Reference to the map object</field>
    /// <field name="outputLayerName" type="String">The name of the output layer to be shown in the Result layer name inputbox.</field>
    /// <field name="portalUrl" type="String">The url to the ArcGIS.com site or in-house portal where the GP server is hosted</field>
    /// <field name="returnFeatureCollection" type="Boolean">When true, returns the result of analysis as feature collection and creates a feature service.</field>
    /// <field name="showChooseExtent" type="Boolean">When true, the choose extent checkbox will be shown</field>
    /// <field name="showCredits" type="Boolean">When true, the show credit option is visible</field>
    /// <field name="showHelp" type="Boolean">When true, the help links will be shown</field>
    /// <field name="showSelectFolder" type="Boolean">When true, the select folder dropdown will be shown.</field>
    /// <field name="sumWithinLayer" type="FeatureLayer">The polygon feature layer to be summarized toward.</field>
    /// <field name="summaryFields" type="String">A list of field names and statistical summary type that you wish to calculate for all features in SummaryLayer that are within each polygon in sumWithinLayer.Syntax: ["fieldName summaryType","fieldName summaryType", .]fieldName is the name of one of the numeric fields found in the summaryLayer.summaryType is one of the following:Sum - Adds the total value of all the features in each polygon.Mean - Calculates the average of all the features in each polygon.Min - Finds the smallest value of all the features in each polygon.Max - Finds the largest value of all the features in each polygon.Stddev - Finds the standard deviation of all the features in each polygon</field>
    /// <field name="summaryLayer" type="FeatureLayer">The summary layer to be shown selected in in the Choose layer to summarize menu.</field>
    /// <field name="summaryLayers" type="FeatureLayer[]">An array of summarize layer candidates.</field>
};

esri.dijit.analysis.SummarizeWithin.prototype = 
{
    cancel: function (jobInfo) {
        /// <summary>Cancels an analysis job that is being processed</summary>
        /// <param name="jobInfo" type="Object" optional="false">An object containing job information including job ID, status, message, etc. returned by the .on("job-status") event.</param>
    },
    execute: function (params) {
        /// <summary>Starts an analysis tool</summary>
        /// <param name="params" type="String" optional="false">An object contains the following properties:&#60;Object&#62; jobParamsThe input job parameters. Required parameters vary from class to class. Refer to the Analysis REST API Documentation for details (Under the Request Parameters section of each task). When creating a hosted service, the OutputName property is required.&#60;Object&#62; itemParamsParameters for creating the output service item. Refer to the ArcGIS REST API - Add Item help topic for a list of available parameters. Optional. Only used when the analysis task creates a hosted service.</param>
    },
    getCreditsEstimate: function (toolName,jobParams) {
        /// <summary>Gets credits estimate for a specific analysis job.</summary>
        /// <param name="toolName" type="String" optional="false">The name of the analysis tool from which a credits estimate will be returned.</param>
        /// <param name="jobParams" type="String" optional="false">The input job parameters. This value should be the same as the jobParams property of an analysis tool dijit. Refer to the jobParams property of this class for detailed syntax.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.dijit.editing = function () {
    /// <summary>The esri.dijit.editing namespace.</summary>
};

esri.dijit.editing.Add = function (params) {
    /// <summary>Create a new Add operation</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;Graphic[]&#62; addedGraphics&#10;
    /// &#60;FeatureLayer&#62; featureLayer</param>
};

esri.dijit.editing.Add.prototype = 
{
    performRedo: function () {
        /// <summary>Redo the current operation</summary>
    },
    performUndo: function () {
        /// <summary>Undo the current operation</summary>
    },
};

esri.dijit.editing.AttachmentEditor = function (params,srcNodeRef) {
    /// <summary>Creates a new AttachmentEditor object</summary>
    /// <param name="params" type="Object" optional="false">No parameter options.</param>
    /// <param name="srcNodeRef" type="String" optional="false">HTML element where the widget is rendered.</param>
};

esri.dijit.editing.AttachmentEditor.prototype = 
{
    showAttachments: function (graphic,featureLayer) {
        /// <summary>Display the attachment editor</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic, with attachments, to display in the attachment editor.</param>
        /// <param name="featureLayer" type="FeatureLayer" optional="false">The feature layer to display attachments for. The feature layer must have attachments enabled.</param>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the attachment editor.</summary>
    },
};

esri.dijit.editing.Cut = function (params) {
    /// <summary>Create a new Cut operation.</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;Graphic[]&#62; addedGraphics&#10;
    /// &#60;FeatureLayer&#62; featureLayer&#10;
    /// &#60;Graphic[]&#62; postUpdatedGraphics&#10;
    /// &#60;Graphic[]&#62; preUpdatedGraphics</param>
};

esri.dijit.editing.Cut.prototype = 
{
    performRedo: function () {
        /// <summary>Redo the current operation</summary>
    },
    performUndo: function () {
        /// <summary>Undo the current operation</summary>
    },
};

esri.dijit.editing.Delete = function (params) {
    /// <summary>Create a new Delete operation</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;Graphic[]&#62; deletedGraphics&#10;
    /// &#60;FeatureLayer&#62; featureLayer</param>
};

esri.dijit.editing.Delete.prototype = 
{
    performRedo: function () {
        /// <summary>Redo the current operation</summary>
    },
    performUndo: function () {
        /// <summary>Undo the current operation</summary>
    },
};

esri.dijit.editing.Editor = function (params,srcNodeRef) {
    /// <summary>Creates a new Editor object</summary>
    /// <param name="params" type="Object" optional="false">Parameters that define the functionality of the editor widget. Create a new settings object to pass to the widget (see options).&#10;
    /// &#60;Object&#62; settings</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the widget should be rendered.</param>
};

esri.dijit.editing.TemplatePicker = function (params,srcNodeRef) {
    /// <summary>Creates a new TemplatePicker object that displays a gallery of templates from the input feature layers or items.</summary>
    /// <param name="params" type="Object" optional="false">FeatureLayers or items are required all other parameters are optional. See options list.&#10;
    /// &#60;Number&#62; columns&#10;
    /// &#60;String&#62; emptyMessage&#10;
    /// &#60;FeatureLayer[]&#62; featureLayers&#10;
    /// &#60;Boolean&#62; grouping&#10;
    /// &#60;Object[]&#62; items&#10;
    /// &#60;Number&#62; maxLabelLength&#10;
    /// &#60;Number&#62; rows&#10;
    /// &#60;Boolean&#62; showTooltip&#10;
    /// &#60;String&#62; style&#10;
    /// &#60;Boolean&#62; useLegend</param>
    /// <param name="srcNodeRef" type="Object" optional="false">HTML element where the TemplatePicker will be rendered. Specify the HTML element using the "id" or a reference to the element."templatePickerDiv"orrequire([ "dojo/dom", ... ], function(dom, ... ) { dom.byId("templatePickerDiv"); ...});</param>
    /// <field name="grid" type="dojox.grid.DataGrid">Reference to the data grid used to display the templates</field>
    /// <field name="tooltip" type="div">If tooltips are enabled the reference to the tooltip div</field>
};

esri.dijit.editing.TemplatePicker.prototype = 
{
    attr: function (name,value) {
        /// <summary>Get or set the properties of the template picker.</summary>
        /// <param name="name" type="String" optional="false">Name of the attribute of interest.</param>
        /// <param name="value" type="Object" optional="true">Value for the specified attribute.</param>
    },
    clearSelection: function () {
        /// <summary>Clears the current selection</summary>
    },
    destroy: function () {
        /// <summary>Destroys the template picker.</summary>
    },
    getSelected: function () {
        /// <summary>Gets the selected item picked by the user.</summary>
        /// <return type="Object">Object</return>
    },
    startup: function () {
        /// <summary>Finalizes the creation of the template picker.</summary>
    },
    update: function () {
        /// <summary>Updates the templatePicker after modifying the properties of the widget</summary>
    },
};

esri.dijit.editing.Union = function (params) {
    /// <summary>Create a new Union operation.</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;Graphic[]&#62; deletedGraphics&#10;
    /// &#60;FeatureLayer&#62; featureLayer&#10;
    /// &#60;Graphic[]&#62; postUpdatedGraphics&#10;
    /// &#60;Graphic[]&#62; preUpdatedGraphics</param>
};

esri.dijit.editing.Union.prototype = 
{
    performRedo: function () {
        /// <summary>Redo the current operation</summary>
    },
    performUndo: function () {
        /// <summary>Undo the current operation</summary>
    },
};

esri.dijit.editing.Update = function (params) {
    /// <summary>Create a new Update operation</summary>
    /// <param name="params" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;FeatureLayer&#62; featureLayer&#10;
    /// &#60;Graphic[]&#62; postUpdatedGraphics&#10;
    /// &#60;Graphic[]&#62; preUpdatedGraphics</param>
};

esri.dijit.editing.Update.prototype = 
{
    performRedo: function () {
        /// <summary>Redo the current operation</summary>
    },
    performUndo: function () {
        /// <summary>Undo the current operation</summary>
    },
};

esri.dijit.geoenrichment = function () {
    /// <summary>The esri.dijit.geoenrichment namespace.</summary>
};

esri.dijit.geoenrichment.Infographic = function (params,srcNodeRef) {
    /// <summary>Creates a new Infographic dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various optional parameters that can be used to configure the dijit. All properties can be passed into the constructor as options. variables, type and studyArea are required when constructing an Infographic.</param>
    /// <param name="srcNodeRef" type="String | DOMNode" optional="false">Reference or id of an HTML element where the Directions widget should be rendered.</param>
    /// <field name="cacheLimit" type="Number">The number of Infographic's for which data retrieved is cached for that browser session</field>
    /// <field name="countryID" type="String">The ID of the country for which data is retrieved.</field>
    /// <field name="datasetID" type="String">The ID of the dataset to which variables used in this Infographic belong.</field>
    /// <field name="expanded" type="Boolean">If true, the Infographic will be displayed in its expanded state.</field>
    /// <field name="returnGeometry" type="Boolean">When true, output geomentry will be available as the geometry property in the returned object of the "data-ready" event handler.</field>
    /// <field name="studyArea" type="GeometryStudyArea">The study area for this Infographic.</field>
    /// <field name="studyAreaOptions" type="RingBuffer | DriveBuffer | IntersectingGeographies">The options to apply to the study area.</field>
    /// <field name="subtitle" type="String">An HTML template string used to define the Infographic subtitle.</field>
    /// <field name="title" type="String">The title of the Infographic.</field>
    /// <field name="type" type="String">The type of the Infographic.</field>
    /// <field name="variables" type="String[]">The set of variables displayed in this Infographic.</field>
};

esri.dijit.geoenrichment.Infographic.prototype = 
{
    setData: function (data,metadata) {
        /// <summary>Define the infographic data.</summary>
        /// <param name="data" type="FeatureSet" optional="false">Specify the FeatureSet containing the custom data to display in the Infographic.</param>
        /// <param name="metadata" type="Object" optional="true">Define the mappings of feature set attributes to Infographic display fields. Supported display fields are name and address. </param>
    },
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
};

esri.dijit.geoenrichment.InfographicsCarousel = function (params,srcNodeRef) {
    /// <summary>Creates a new InfographicsCarousel dijit using the given DOM node</summary>
    /// <param name="params" type="Object" optional="false">Various optional parameters that can be used to configure the dijit. All properties can be passed into the constructor as options. studyArea is required when constructing an InfographicsCarousel.</param>
    /// <param name="srcNodeRef" type="String | DOMNode" optional="false">Reference or id of an HTML element where the Directions widget should be rendered.</param>
    /// <field name="expanded" type="Boolean">If true, the Infographic will be displayed in its expanded state.</field>
    /// <field name="options" type="InfographicsOptions">Describes the options used to configure the contents of the carousel</field>
    /// <field name="returnGeometry" type="Boolean">When true, output geomentry will be available as the geometry property in the returned object of the "data-ready" event handler.</field>
    /// <field name="selectedIndex" type="Number">The index of the currently selected InfoGraphic in this InfographicsCarousel</field>
    /// <field name="studyArea" type="GeometryStudyArea">The study area for this InfographicsCarousel.</field>
    /// <field name="studyAreaTitle" type="String">The name of the study area to be shown in this InfographicsCarousel</field>
};

esri.dijit.geoenrichment.InfographicsCarousel.prototype = 
{
    startup: function () {
        /// <summary>Finalizes the creation of this dijit.</summary>
    },
};

esri.dijit.geoenrichment.InfographicsOptions = function (json) {
    /// <summary>Constructs instance from serialized state</summary>
    /// <param name="json" type="Object" optional="true">Various options to configure this InfographicsOptions. Any property can be passed into this object.</param>
    /// <field name="studyAreaOptions" type="RingBuffer | DriveBuffer | IntersectingGeographies">The options to apply to the study area.</field>
    /// <field name="theme" type="String">The name of the css theme used to format the InfographicsCarousel</field>
};

esri.dijit.geoenrichment.InfographicsOptions.prototype = 
{
    constructor: function (json) {
        /// <summary>Constructs instance from serialized state</summary>
        /// <param name="json" type="Object" optional="false">A json object used to construct the instance.</param>
    },
    getItems: function (countryID) {
        /// <summary>Gets an array of default InfographicsOptions.Item's in the InfographicsCarousel with a countryID.</summary>
        /// <param name="countryID" type="String" optional="false">The ID of the country for which data is retrieved.Refer to the GeoEnrichment Coverage section of the ArcGIS GeoEnrichment Service documentation to find the countries where data are available. The "Two-Digit Country Code" column in the first table lists all the country codes you may use.</param>
        /// <return type="&#60;dojo.Deferred&#62; InfographicsOptions.Item[]">&#60;dojo.Deferred&#62; InfographicsOptions.Item[]</return>
    },
    toJson: function () {
        /// <summary>Converts object to its JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.dijit.geoenrichment.InfographicsOptions.Item = function () {
    /// <summary>The esri.dijit.geoenrichment.InfographicsOptions.Item namespace.</summary>
};

esri.geometry = function () {
    /// <summary>The esri.geometry namespace.</summary>
};



esri.geometry.geodesicAreas = function (polygons,areaUnit) {
    /// <summary>Determine the area for the input polygons.</summary>
    /// <param name="polygons" type="Polygon[]" optional="false">An array of polygons.</param>
    /// <param name="areaUnit" type="esri.Units" optional="false">The area unit, view the esri.Units constants for valid values.</param>
    /// <return type="Number[]">Number[]</return>
};

esri.geometry.geodesicDensify = function (geometry,maxSegmentLength) {
    /// <summary>Returns a densified geometry</summary>
    /// <param name="geometry" type="Geometry" optional="false">A polyline or polygon to densify.</param>
    /// <param name="maxSegmentLength" type="Number" optional="false">The maximum segment length in meters.</param>
    /// <return type="Geometry">Geometry</return>
};

esri.geometry.geodesicLengths = function (polylines,lengthUnit) {
    /// <summary>Determine the length for the input polylines using the specified length unit.</summary>
    /// <param name="polylines" type="Polyline[]" optional="false">An array of polylines.</param>
    /// <param name="lengthUnit" type="esri.Units" optional="false">The length unit, view the esri.Units constants for valid values.</param>
    /// <return type="Number[]">Number[]</return>
};



esri.geometry.fromJson = function (json) {
    /// <summary>Converts the input JSON object to the appropriate esri.geometry.* object</summary>
    /// <param name="json" type="Object" optional="false">The JSON object.</param>
    /// <return type="Object">Object</return>
};

esri.geometry.getJsonType = function (geometry) {
    /// <summary>Requests the geometry type name as represented in the ArcGIS REST</summary>
    /// <param name="geometry" type="Geometry" optional="false">The ArcGIS JavaScript API geometry type to be converted.</param>
    /// <return type="String">String</return>
};



esri.geometry.getLength = function (point1,point2) {
    /// <summary>Calculates the length of a line based on the input of two points</summary>
    /// <param name="point1" type="Point" optional="false">The beginning point.</param>
    /// <param name="point2" type="Point" optional="false">The ending point.</param>
    /// <return type="Number">Number</return>
};

esri.geometry.getLineIntersection = function (line1start,line1end,line2start,line2end) {
    /// <summary>Calculates the intersecting point of two lines.</summary>
    /// <param name="line1start" type="Point" optional="false">The beginning point of the first line.</param>
    /// <param name="line1end" type="Point" optional="false">The ending point of the first line.</param>
    /// <param name="line2start" type="Point" optional="false">The beginning point of the second line.</param>
    /// <param name="line2end" type="Point" optional="false">The ending point of the second line.</param>
    /// <return type="Point">Point</return>
};



esri.geometry.normalizeCentralMeridian = function (geometries,geometryService,callback,errback) {
    /// <summary>Normalizes geometries that intersect the central meridian or fall outside the world extent so they stay within the current coordinate system.</summary>
    /// <param name="geometries" type="Geometry[]" optional="false">An array of geometries to normalize.</param>
    /// <param name="geometryService" type="GeometryService" optional="false">Specify a valid geometry service. If you've specified a geometry service using esri.config.defaults.geometryService this service will be used by the function.</param>
    /// <param name="callback" type="Function" optional="false">The function to call when the method has completed. The callback returns an array of normalized geometries.</param>
    /// <param name="errback" type="Function" optional="false">An error object is returned, if an error occurs on the Server during task execution.</param>
    /// <return type="dojo.Deferred">dojo.Deferred</return>
};



esri.geometry.getExtentForScale = function (map,scale) {
    /// <summary>Get the extent for the specified scale</summary>
    /// <param name="map" type="Map" optional="false">The input map.</param>
    /// <param name="scale" type="Number" optional="false">The input scale.</param>
    /// <return type="Extent">Extent</return>
};

esri.geometry.getScale = function (map) {
    /// <summary>Gets the current scale of the map.Version history:Originally added v1.4 with input parameters of extent,mapWidth,wkidInput parameters modified at v2.0, now only the map is required</summary>
    /// <param name="map" type="Map" optional="false">The map whose scale should be calculated.</param>
    /// <return type="Number">Number</return>
};



esri.geometry.toMapGeometry = function (extent,width,height,screenGeometry) {
    /// <summary>Converts the geometry argument to map coordinates based on the extent, width, and height of the Map</summary>
    /// <param name="extent" type="Extent" optional="false">The current extent of the map in map coordinates.</param>
    /// <param name="width" type="Number" optional="false">The current width of the map in map units.</param>
    /// <param name="height" type="Number" optional="false">The current width of the map in map units.</param>
    /// <param name="screenGeometry" type="Geometry" optional="false">The geometry to convert from screen to map units.</param>
    /// <return type="Geometry">Geometry</return>
};

esri.geometry.toMapPoint = function (extent,width,height,screenPoint) {
    /// <summary>Converts and returns the argument screen point in map coordinates.</summary>
    /// <param name="extent" type="Extent" optional="false">The current extent of the map in map coordinates.</param>
    /// <param name="width" type="Number" optional="false">The current width of the map in screen units.</param>
    /// <param name="height" type="Number" optional="false">The current width of the map in screen units.</param>
    /// <param name="screenPoint" type="ScreenPoint" optional="false">The screenPoint to convert from screen to map units. At version 3.3, use an instance of ScreenPoint. Prior to 3.3 specify as a Point.</param>
    /// <return type="Point">Point</return>
};

esri.geometry.toScreenGeometry = function (extent,width,height,mapGeometry) {
    /// <summary>Converts the geometry argument to screen coordinates based on the extent, width, and height of the Map</summary>
    /// <param name="extent" type="Extent" optional="false">The current extent of the map in map coordinates.</param>
    /// <param name="width" type="Number" optional="false">The current width of the map in screen units.</param>
    /// <param name="height" type="Number" optional="false">The current width of the map in screen units.</param>
    /// <param name="mapGeometry" type="Geometry" optional="false">The geometry to convert from map to screen units.</param>
    /// <return type="Geometry">Geometry</return>
};

esri.geometry.toScreenPoint = function (extent,width,height,mapPoint) {
    /// <summary>Converts and returns the argument map point in screen coordinates.</summary>
    /// <param name="extent" type="Extent" optional="false">The current extent of the map in map coordinates.</param>
    /// <param name="width" type="Number" optional="false">The current width of the map in screen units.</param>
    /// <param name="height" type="Number" optional="false">The current width of the map in screen units.</param>
    /// <param name="mapPoint" type="Point" optional="false">The point to convert from map to screen units.</param>
    /// <return type="ScreenPoint">ScreenPoint</return>
};



esri.geometry.geographicToWebMercator = function (geometry) {
    /// <summary>Converts geometry from geographic units to Web Mercator units</summary>
    /// <param name="geometry" type="Geometry" optional="false">The geometry to convert.</param>
    /// <return type="Geometry">Geometry</return>
};

esri.geometry.lngLatToXY = function (long,lat,isLinear) {
    /// <summary>Translates the given latitude and longitude values to Web Mercator.</summary>
    /// <param name="long" type="Number" optional="false">The longitude value to convert.</param>
    /// <param name="lat" type="Number" optional="false">The latitude value to convert.</param>
    /// <param name="isLinear" type="Boolean" optional="false">Set to true to normalize the output values so that they are within -180 and +180.</param>
    /// <return type="Number[]">Number[]</return>
};

esri.geometry.webMercatorToGeographic = function (geometry) {
    /// <summary>Converts geometry from Web Mercator units to geographic units</summary>
    /// <param name="geometry" type="Geometry" optional="false">The geometry to convert.</param>
    /// <return type="Geometry">Geometry</return>
};

esri.geometry.xyToLngLat = function (long,lat) {
    /// <summary>Translates the given Web Mercator coordinates to Longitude and Latitude.</summary>
    /// <param name="long" type="Number" optional="false">The input longitude value.</param>
    /// <param name="lat" type="Number" optional="false">The input latitude value.</param>
    /// <return type="Number[]">Number[]</return>
};

esri.geometry.Circle = function (center,options) {
    /// <summary>Create a new Circle by specifying an input center location using either an esri.geometry.Point object or a latitude/longitude array and an object with the following optional properties: radius, radiusUnits, geodesic and numberOfPoints.</summary>
    /// <param name="center" type="Point | Number[]" optional="false">Center point of the circle. It could be a esri.geometry.Point, or an array with value [longitude, latitude].</param>
    /// <param name="options" type="Object" optional="true">See options descriptions for further information.&#10;
    /// &#60;Boolean&#62; geodesic &#10;
    /// &#60;Number&#62; numberOfPoints&#10;
    /// &#60;Number&#62; radius&#10;
    /// &#60;Units&#62; radiusUnit</param>
    /// <field name="center" type="Point | Number[]">Center point of the circle.</field>
    /// <field name="radius" type="Number">The radius of the circle based</field>
    /// <field name="radiusUnit" type="Units">Unit of the radius.</field>
    /// <field name="rings" type="Array of coordinate values [[x1, y1], [x2, y2],...]">The circle only has one ring, which is the circle curve.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the circle will be the same as the spatial reference of the center point</field>
};

esri.geometry.Extent = function (xmin,ymin,xmax,ymax,spatialReference) {
    /// <summary>Creates a new Extent object.</summary>
    /// <param name="xmin" type="Number" optional="false">Bottom-left X-coordinate of an extent envelope.</param>
    /// <param name="ymin" type="Number" optional="false">Bottom-left Y-coordinate of an extent envelope.</param>
    /// <param name="xmax" type="Number" optional="false">Top-right X-coordinate of an extent envelope.</param>
    /// <param name="ymax" type="Number" optional="false">Top-right Y-coordinate of an extent envelope.</param>
    /// <param name="spatialReference" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the geometry.</field>
    /// <field name="type" type="String">The type of geometry</field>
    /// <field name="xmax" type="Number">Top-right X-coordinate of an extent envelope</field>
    /// <field name="xmin" type="Number">Bottom-left X-coordinate of an extent envelope</field>
    /// <field name="ymax" type="Number">Top-right Y-coordinate of an extent envelope</field>
    /// <field name="ymin" type="Number">Bottom-left Y-coordinate of an extent envelope</field>
};

esri.geometry.Extent.prototype = 
{
    centerAt: function (point) {
        /// <summary>A new extent is returned with the same width and height centered at the argument point</summary>
        /// <param name="point" type="Point" optional="false">Centers the extent on the specified x,y location.</param>
        /// <return type="Extent">Extent</return>
    },
    contains: function (geometry) {
        /// <summary>When "true", the geometry in the argument is contained in this extent</summary>
        /// <param name="geometry" type="Geometry" optional="false">Can be a Point or Extent.Prior to version 2.0, the first parameter was 											&#60;Point&#62; point									Required										When "true", the point in the argument is contained in this extent. 								</param>
        /// <return type="Boolean">Boolean</return>
    },
    expand: function (factor) {
        /// <summary>Expands the extent by the factor given.</summary>
        /// <param name="factor" type="Number" optional="false">The multiplier value.</param>
        /// <return type="Extent">Extent</return>
    },
    getCenter: function () {
        /// <summary>Returns the center point of the extent in map units</summary>
        /// <return type="Point">Point</return>
    },
    getHeight: function () {
        /// <summary>Distance between ymin and ymax</summary>
        /// <return type="Number">Number</return>
    },
    getWidth: function () {
        /// <summary>Distance between xmin and xmax</summary>
        /// <return type="Number">Number</return>
    },
    intersects: function (geometry) {
        /// <summary>Returns the interesection extent if the input geometry is an extent that intersects this extent.</summary>
        /// <param name="geometry" type="Geometry" optional="false">The geometry used to test the intersection. Valid geometry includes Point, Multipoint, Extent, Polygon, or Polyline.Prior to version 2.0, the first parameter was 											&#60;Extent&#62; extent									Required										The minx, miny, maxx, and maxy bounding box. 								</param>
        /// <return type="Extent | Boolean">Extent | Boolean</return>
    },
    offset: function (dx,dy) {
        /// <summary>Offsets the current extent.</summary>
        /// <param name="dx" type="Number" optional="false">The offset distance in map units for the y-coordinate.</param>
        /// <param name="dy" type="Number" optional="false">The offset distance in map units for the x-coordinate.</param>
        /// <return type="Extent">Extent</return>
    },
    setSpatialReference: function (sr) {
        /// <summary>Sets the spatial reference.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Geometry">Geometry</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
    union: function (extent) {
        /// <summary>Expands this extent to include the extent of the argument</summary>
        /// <param name="extent" type="Extent" optional="false">The minx, miny, maxx, and maxy bounding box.</param>
        /// <return type="Extent">Extent</return>
    },
    update: function (xmin,ymin,xmax,ymax,spatialReference) {
        /// <summary>Updates this extent with the specified parameters.The return value of Extent was added at v1.4</summary>
        /// <param name="xmin" type="Number" optional="false">Bottom-left X-coordinate of an extent envelope.</param>
        /// <param name="ymin" type="Number" optional="false">Bottom-left Y-coordinate of an extent envelope.</param>
        /// <param name="xmax" type="Number" optional="false">Top-right X-coordinate of an extent envelope.</param>
        /// <param name="ymax" type="Number" optional="false">Top-right Y-coordinate of an extent envelope.</param>
        /// <param name="spatialReference" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Extent">Extent</return>
    },
};

esri.geometry.Geometry = function () {

    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the geometry.</field>
    /// <field name="type" type="String">The type of geometry</field>
};

esri.geometry.Geometry.prototype = 
{
    setSpatialReference: function (sr) {
        /// <summary>Sets the spatial reference.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Geometry">Geometry</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.geometry.Multipoint = function (spatialReference) {
    /// <summary>Creates a new Multipoint object</summary>
    /// <param name="spatialReference" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
    /// <field name="points" type="Number[][]">An array of one or more points</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the geometry.</field>
    /// <field name="type" type="String">The type of geometry</field>
};

esri.geometry.Multipoint.prototype = 
{
    addPoint: function () {
        /// <summary>Adds a point to the Multipoint.</summary>
        /// <return type="Multipoint">Multipoint</return>
    },
    getExtent: function () {
        /// <summary>Gets the extent of all the points.</summary>
        /// <return type="Extent">Extent</return>
    },
    getPoint: function (index) {
        /// <summary>Returns the point at the specified index</summary>
        /// <param name="index" type="Number" optional="false">Positional index of the point in the points property.</param>
        /// <return type="Point">Point</return>
    },
    removePoint: function (index) {
        /// <summary>Removes a point from the Multipoint.</summary>
        /// <param name="index" type="Number" optional="false">The index of the point to remove.</param>
        /// <return type="Point">Point</return>
    },
    setPoint: function (index,point) {
        /// <summary>Updates the point at the specified index</summary>
        /// <param name="index" type="Number" optional="false">Positional index of the point in the points property.</param>
        /// <param name="point" type="Point" optional="false">Point that specifies the new location.</param>
        /// <return type="Multipoint">Multipoint</return>
    },
    setSpatialReference: function (sr) {
        /// <summary>Sets the spatial reference.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Geometry">Geometry</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.geometry.Point = function (x,y,spatialReference) {
    /// <summary>Creates a new Point object using x, y, and a spatial reference.</summary>
    /// <param name="x" type="Number" optional="false">X-coordinate of a point in map units.</param>
    /// <param name="y" type="Number" optional="false">Y-coordinate of a point in map units.</param>
    /// <param name="spatialReference" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the geometry.</field>
    /// <field name="type" type="String">The type of geometry</field>
    /// <field name="x" type="Number">X-coordinate of a point in map units</field>
    /// <field name="y" type="Number">Y-coordinate of a point in map units</field>
};

esri.geometry.Point.prototype = 
{
    getLatitude: function () {
        /// <summary>Returns the latitude coordinate for this point if the spatial reference of the point is Web Mercator or Geographic (4326)</summary>
        /// <return type="Number">Number</return>
    },
    getLongitude: function () {
        /// <summary>Returns the longitude coordinate for this point if the spatial reference of the point is Web Mercator or Geographic (4326)</summary>
        /// <return type="Number">Number</return>
    },
    offset: function (dx,dy) {
        /// <summary>Offsets the point in an x and y direction.</summary>
        /// <param name="dx" type="Number" optional="false">Value for x-coordinate of point.</param>
        /// <param name="dy" type="Number" optional="false">Value for y-coordinate of point.</param>
        /// <return type="Point">Point</return>
    },
    setLatitude: function (lat) {
        /// <summary>Sets the latitude coordinate for this point to the specified value if the point's spatial reference is Web Mercator or Geographic (4326)</summary>
        /// <param name="lat" type="Number" optional="false">Valid latitude value.</param>
        /// <return type="Point">Point</return>
    },
    setLongitude: function (lon) {
        /// <summary>Sets the longitude coordinate for this point to the specified value if the point's spatial reference is Web Mercator or Geographic (4326)</summary>
        /// <param name="lon" type="Number" optional="false">A valid longitude value.</param>
        /// <return type="Point">Point</return>
    },
    setSpatialReference: function (sr) {
        /// <summary>Sets the spatial reference.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Geometry">Geometry</return>
    },
    setX: function (x) {
        /// <summary>Sets x-coordinate of point.</summary>
        /// <param name="x" type="Number" optional="false">Value for x-coordinate of point.</param>
        /// <return type="Point">Point</return>
    },
    setY: function (y) {
        /// <summary>Sets y-coordinate of point.</summary>
        /// <param name="y" type="Number" optional="false">Value for y-coordinate of point.</param>
        /// <return type="Point">Point</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
    update: function (x,y) {
        /// <summary>Updates a point</summary>
        /// <param name="x" type="Number" optional="false">X-coordinate of the updated point.</param>
        /// <param name="y" type="Number" optional="false">Y-coordinate of the updated point.</param>
        /// <return type="Point">Point</return>
    },
};

esri.geometry.Polygon = function (spatialReference) {
    /// <summary>Creates a new Polygon object</summary>
    /// <param name="spatialReference" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
    /// <field name="rings" type="Number[][][]">An array of rings.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the geometry.</field>
    /// <field name="type" type="String">The type of geometry</field>
};

esri.geometry.Polygon.prototype = 
{
    addRing: function () {
        /// <summary>Adds a ring to the Polygon.</summary>
        /// <return type="Polygon">Polygon</return>
    },
    contains: function (point) {
        /// <summary>Checks on the client if the specified point is inside the polygon.</summary>
        /// <param name="point" type="Point" optional="false">The location defined by an X- and Y- coordinate in map units.</param>
        /// <return type="Boolean">Boolean</return>
    },
    getCentroid: function () {
        /// <summary>Returns the centroid of the polygon as defined here.</summary>
        /// <return type="Point">Point</return>
    },
    getExtent: function () {
        /// <summary>Returns the extent of the polygon</summary>
        /// <return type="Extent">Extent</return>
    },
    getPoint: function (ringIndex,pointIndex) {
        /// <summary>Returns a point specified by a ring and point in the path</summary>
        /// <param name="ringIndex" type="Number" optional="false">The index of a ring.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of a point in a ring.</param>
        /// <return type="Point">Point</return>
    },
    insertPoint: function (ringIndex,pointIndex,point) {
        /// <summary>Inserts a new point into a polygon</summary>
        /// <param name="ringIndex" type="Number" optional="false">Ring index to insert point.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of the inserted point in the ring.</param>
        /// <param name="point" type="Point" optional="false">Point to insert into the ring.</param>
        /// <return type="Polygon">Polygon</return>
    },
    isClockwise: function (ring) {
        /// <summary>Checks if a Polygon ring is clockwise.</summary>
        /// <param name="ring" type="Ring" optional="false">A polygon ring.</param>
        /// <return type="Boolean">Boolean</return>
    },
    isSelfIntersecting: function (polygon) {
        /// <summary>When true, the polygon is self-intersecting which means that the ring of the polygon crosses itself.</summary>
        /// <param name="polygon" type="Polygon" optional="false">The polygon to test for self-intersection.</param>
        /// <return type="Boolean">Boolean</return>
    },
    removePoint: function (ringIndex,pointIndex) {
        /// <summary>Remove a point from the polygon at the given pointIndex within the ring identified by ringIndex</summary>
        /// <param name="ringIndex" type="Number" optional="false">The index of the ring containing the point.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of the point within the ring.</param>
        /// <return type="Point">Point</return>
    },
    removeRing: function (ringIndex) {
        /// <summary>Removes a ring from the Polygon.</summary>
        /// <param name="ringIndex" type="Number" optional="false">The index of the ring to remove.</param>
        /// <return type="Point[]">Point[]</return>
    },
    setPoint: function (ringIndex,pointIndex,point) {
        /// <summary>Updates a point in a polygon</summary>
        /// <param name="ringIndex" type="Number" optional="false">Ring index for updated point.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of the updated point in the ring.</param>
        /// <param name="point" type="Point" optional="false">Point to update in the ring.</param>
        /// <return type="Polygon">Polygon</return>
    },
    setSpatialReference: function (sr) {
        /// <summary>Sets the spatial reference.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Geometry">Geometry</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.geometry.Polyline = function (spatialReference) {
    /// <summary>Creates a new Polyline object</summary>
    /// <param name="spatialReference" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
    /// <field name="paths" type="Number[][][]">An array of paths.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the geometry.</field>
    /// <field name="type" type="String">The type of geometry</field>
};

esri.geometry.Polyline.prototype = 
{
    addPath: function () {
        /// <summary>Adds a path to the Polyline.</summary>
        /// <return type="Polyline">Polyline</return>
    },
    getExtent: function () {
        /// <summary>Returns the extent of the Polyline</summary>
        /// <return type="Extent">Extent</return>
    },
    getPoint: function (pathIndex,pointIndex) {
        /// <summary>Returns a point specified by a path and point in the path</summary>
        /// <param name="pathIndex" type="Number" optional="false">The index of a path in a polyline.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of a point in a path.</param>
        /// <return type="Point">Point</return>
    },
    insertPoint: function (pathIndex,pointIndex,point) {
        /// <summary>Inserts a new point into a polyline</summary>
        /// <param name="pathIndex" type="Number" optional="false">Path index to insert point.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of the inserted point in the path.</param>
        /// <param name="point" type="Point" optional="false">Point to insert into the path.</param>
        /// <return type="Polyline">Polyline</return>
    },
    removePath: function (pathIndex) {
        /// <summary>Removes a path from the Polyline.</summary>
        /// <param name="pathIndex" type="Number" optional="false">The index of a path to remove.</param>
        /// <return type="Point[]">Point[]</return>
    },
    removePoint: function (pathIndex,pointIndex) {
        /// <summary>Remove a point from the polyline at the given pointIndex within the path identified by the given pathIndex</summary>
        /// <param name="pathIndex" type="Number" optional="false">The index of the path containing the point.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of the point within the path.</param>
        /// <return type="Point">Point</return>
    },
    setPoint: function (pathIndex,pointIndex,point) {
        /// <summary>Updates a point in a polyline</summary>
        /// <param name="pathIndex" type="Number" optional="false">Path index for updated point.</param>
        /// <param name="pointIndex" type="Number" optional="false">The index of the updated point in the path.</param>
        /// <param name="point" type="Point" optional="false">Point to update in the path.</param>
        /// <return type="Polyline">Polyline</return>
    },
    setSpatialReference: function (sr) {
        /// <summary>Sets the spatial reference.</summary>
        /// <param name="sr" type="SpatialReference" optional="false">Spatial reference of the geometry.</param>
        /// <return type="Geometry">Geometry</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.geometry.ScreenPoint = function () {

};

esri.layers = function () {
    /// <summary>The esri.layers namespace.</summary>
};

esri.layers.ArcGISDynamicMapServiceLayer = function (url,options) {
    /// <summary>Creates a new ArcGISDynamicMapServiceLayer object.</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a map service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;String&#62; gdbVersion&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;ImageParameters&#62; imageParameters&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;Number&#62; refreshInterval&#10;
    /// &#60;Boolean&#62; showAttribution&#10;
    /// &#60;Boolean&#62; useMapImage&#10;
    /// &#60;Boolean&#62; useMapTime&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="capabilities" type="String">Capabilities of the map service, possible values are Map, Query and Data.</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="copyright" type="String">Copyright string as defined by the map service</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="description" type="String">Map description as defined by the map service</field>
    /// <field name="disableClientCaching" type="Boolean">When true, images are always requested from the server and the browser's cache is ignored.</field>
    /// <field name="dpi" type="Number">The output dpi of the dynamic map service layer</field>
    /// <field name="dynamicLayerInfos" type="DynamicLayerInfo[]">Array of DynamicLayerInfos used to change the layer ordering or redefine the map</field>
    /// <field name="fullExtent" type="Extent">Full extent as defined by the map service</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="imageFormat" type="String">The output image type.</field>
    /// <field name="imageTransparency" type="Boolean">Whether or not background of dynamic image is transparent</field>
    /// <field name="initialExtent" type="Extent">Initial extent as defined by the map service</field>
    /// <field name="layerDefinitions" type="String[]">Sets the layer definitions used to filter the features of individual layers in the map service.</field>
    /// <field name="layerDrawingOptions" type="LayerDrawingOptions[]">Array of LayerDrawingOptions used to override the way layers are drawn</field>
    /// <field name="layerInfos" type="LayerInfo[]">Returns the available layers in service and their default visibility</field>
    /// <field name="layerTimeOptions" type="LayerTimeOptions[]">Returns the current layer time options if applicable.</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxImageHeight" type="Number">The maximum image height , in pixels, that the map service will export.</field>
    /// <field name="maxImageWidth" type="Number">The maximum image width, in pixels, that the map service will export.</field>
    /// <field name="maxRecordCount" type="Number">The maximum number of results that can be returned from query, identify and find operations.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map service.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="timeInfo" type="TimeInfo">Temporal information for the layer, such as time extent.</field>
    /// <field name="units" type="String">Default units of the layer as defined by the service.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="useMapImage" type="Boolean">When true, the image is saved to the server, and a JSON formatted response is sent to the client with the URL location of the image.</field>
    /// <field name="version" type="Number">The version of ArcGIS Server where the map service is published.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
    /// <field name="visibleLayers" type="Number[]">Gets the visible layers of the exported map</field>
};

esri.layers.ArcGISDynamicMapServiceLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    createDynamicLayerInfosFromLayerInfos: function () {
        /// <summary>Create an array of DynamicLayerInfos based on the current set of LayerInfo</summary>
        /// <return type="DynamicLayerInfo[]">DynamicLayerInfo[]</return>
    },
    exportMapImage: function (imageParameters,callback) {
        /// <summary>Exports a map using values as specified by ImageParameters.</summary>
        /// <param name="imageParameters" type="ImageParameters" optional="true">Input parameters assigned before exporting the map image.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onMapImageExport event.</param>
    },
    getAttributionData: function () {
        /// <summary>Asynchronously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getImageUrl: function (extent,width,height,callback) {
        /// <summary>Method to implement when extending DynamicMapServiceLayer.</summary>
        /// <param name="extent" type="Extent" optional="false">Current extent of the map.</param>
        /// <param name="width" type="Number" optional="false">Current width of the map in pixels.</param>
        /// <param name="height" type="Number" optional="false">Current height of the map in pixels.</param>
        /// <param name="callback" type="Function" optional="false">The function to call when the method has completed.</param>
        /// <return type="String">String</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    refresh: function () {
        /// <summary>Refreshes the map by making a new request to the server.</summary>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setDPI: function (dpi,doNotRefresh) {
        /// <summary>Sets the dpi of the exported map.</summary>
        /// <param name="dpi" type="Number" optional="false">DPI value.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setDefaultLayerDefinitions: function (doNotRefresh) {
        /// <summary>Resets all layer definitions to those defined in the service</summary>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setDefaultVisibleLayers: function (doNotRefresh) {
        /// <summary>Clears the visible layers as defined in setVisibleLayers, and resets to the default layers of the map service</summary>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setDisableClientCaching: function (disable) {
        /// <summary>Sets whether images are always requested from the server and the browser's cache is ignored.</summary>
        /// <param name="disable" type="Boolean" optional="false">When true, client side caching is disabled.</param>
    },
    setDynamicLayerInfos: function (dynamicLayerInfos,doNotRefresh) {
        /// <summary>Specify an array of DynamicLayerInfos used to change the layer ordering or to redefine the map</summary>
        /// <param name="dynamicLayerInfos" type="DynamicLayerInfo[]" optional="false">An array of dynamic layer infos.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">When true the layer will not refresh the map image. The default value is false.</param>
        /// <return type="null">null</return>
    },
    setGDBVersion: function (gdbVersion,doNotRefresh) {
        /// <summary>Set the version for the ArcGIS DynamicMapServiceLayer.</summary>
        /// <param name="gdbVersion" type="String" optional="false">The name of the version to display.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.7 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setImageFormat: function (imageFormat,doNotRefresh) {
        /// <summary>Sets the image format of the exported map</summary>
        /// <param name="imageFormat" type="String" optional="false">Valid values are png | png8 | png24 | png32 | jpg | pdf | bmp | gif | svg. Note: The png32 image format is only supported by msd based services published with version 10 or greater. View the service's 'Supported image Format Types' value for the map servcie to determine which formats are supported. The map server performs antialiasing when requesting png32 for an optimized map service. </param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setImageTransparency: function (transparent,doNotRefresh) {
        /// <summary>Sets the background of a dynamic image to transparent</summary>
        /// <param name="transparent" type="Boolean" optional="false">Valid values are true | false. The default is "true".</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setLayerDefinitions: function (layerDefinitions,doNotRefresh) {
        /// <summary>Sets the layer definitions used to filter the features of individual layers in the map service.</summary>
        /// <param name="layerDefinitions" type="String[]" optional="false">An array containing each layer's definition.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setLayerDrawingOptions: function (layerDrawingOptions,doNotRefresh) {
        /// <summary>Specify an array of LayerDrawingOptions that override the way the layers are drawn</summary>
        /// <param name="layerDrawingOptions" type="LayerDrawingOptions[]" optional="false">An array of layer drawing options.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">When true the layer will not refresh the map image. The default value is false.</param>
        /// <return type="null">null</return>
    },
    setLayerTimeOptions: function (options,doNotRefresh) {
        /// <summary>Sets the time-related options for the layer</summary>
        /// <param name="options" type="LayerTimeOptions[]" optional="false">Array of LayerTimeOptions objects that allow you to override how a layer is exported in reference to the map's time extent. There is one object per sub-layer. In the following example, array indices 2 and 5 are valid sub-layer IDs.require([ "esri/layers/LayerTimeOptions", "esri/layers/TimeInfo", ... ], function(LayerTimeOptions, TimeInfo, ... ) { var timeOption1 = new LayerTimeOptions(); timeOption1.timeOffset = 4; timeOption1.timeOffsetUnits = TimeInfo.UNIT_YEARS; var options = []; options[2]= timeOption1; options[5] = timeOption2; imageParameters.layerTimeOptions = options; ...});</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setUseMapTime: function (update) {
        /// <summary>Determine if the layer will update its content based on the map's current time extent.</summary>
        /// <param name="update" type="Boolean" optional="false">When false the layer will not update its content based on the map's time extent. Default value is true.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    setVisibleLayers: function (ids,doNotRefresh) {
        /// <summary>Sets the visible layers of the exported map.</summary>
        /// <param name="ids" type="Number[]" optional="false">Array of layer IDs.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.ArcGISImageServiceLayer = function (url,options) {
    /// <summary>Creates a new ArcGISImageServiceLayer object.</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a map service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Portland/Portland_ESRI_LandBase_AGO/MapServer. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;ImageServiceParameters&#62; imageServiceParameters&#10;
    /// &#60;InfoTemplate&#62; infoTemplate&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;Boolean&#62; useMapTime&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="bandCount" type="Number">Number of bands in ArcGISImageServiceLayer</field>
    /// <field name="bandIds" type="Number[]">Array of current band selections</field>
    /// <field name="bands" type="Object[]">The raster bands that the raster dataset is composed of and their statistics.</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="compressionQuality" type="Number">Current compression quality value.</field>
    /// <field name="copyrightText" type="String">Copyright string as defined by the image service</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="defaultMosaicRule" type="MosaicRule">Returns a MosaicRule object that defines the default mosaic properties published by the image service.</field>
    /// <field name="description" type="String">Description as defined by the image service</field>
    /// <field name="disableClientCaching" type="Boolean">When true, images are always requested from the server and the browser's cache is ignored.</field>
    /// <field name="format" type="String">The output image type</field>
    /// <field name="fullExtent" type="Extent">Full extent as defined by the map service</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="initialExtent" type="Extent">Initial extent as defined by the map service</field>
    /// <field name="interpolation" type="String">Current interpolation method.</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxImageHeight" type="Number">The maximum image height , in pixels, that the map service will export.</field>
    /// <field name="maxImageWidgth" type="Number">The maximum image width, in pixels, that the map service will export.</field>
    /// <field name="maxRecordCount" type="Number">The maximum number of results that can be returned from query, identify and find operations.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="mosaicRule" type="MosaicRule">Specifies the mosaic rule when defining how individual images should be mosaicked</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="pixelSizeX" type="Number">Size of pixel in X direction</field>
    /// <field name="pixelSizeY" type="Number">Size of pixel in Y direction</field>
    /// <field name="pixelType" type="Number">The pixel type of the image service.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="renderingRule" type="RasterFunction">Specifies the rendering rule for how the requested image should be rendered.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map service.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="timeInfo" type="TimeInfo">Temporal information for the layer, such as time extent.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="version" type="Number">The version of ArcGIS Server the image service is published to, e.g.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.ArcGISImageServiceLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    exportMapImage: function (imageServiceParameters,callback) {
        /// <summary>Exports a map using values as specified by ImageServiceParameters.</summary>
        /// <param name="imageServiceParameters" type="ImageServiceParameters" optional="true">Input parameters assigned before exporting the map image.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onMapImageExport event.</param>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getDefinitionExpression: function () {
        /// <summary>Returns the current definition expression</summary>
        /// <return type="String">String</return>
    },
    getImageUrl: function (extent,width,height,callback) {
        /// <summary>Method to implement when extending DynamicMapServiceLayer.</summary>
        /// <param name="extent" type="Extent" optional="false">Current extent of the map.</param>
        /// <param name="width" type="Number" optional="false">Current width of the map in pixels.</param>
        /// <param name="height" type="Number" optional="false">Current height of the map in pixels.</param>
        /// <param name="callback" type="Function" optional="false">The function to call when the method has completed.</param>
        /// <return type="String">String</return>
    },
    getKeyProperties: function () {
        /// <summary>Get key properties of an ImageService including information such as the band names associated with the imagery</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    getRasterAttributeTable: function () {
        /// <summary>Asynchronously returns the raster attribute table of an ImageService which returns categorical mapping of pixel values (e.g.</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getVisibleRasters: function () {
        /// <summary>Gets the currently visible rasters</summary>
        /// <return type="Graphic[]">Graphic[]</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    queryVisibleRasters: function (query,options,callback,errback) {
        /// <summary>Returns the rasters that are visible in the area defined by the geometry in the query parameter.</summary>
        /// <param name="query" type="Query" optional="false">The esri.tasks.Query to be passed as the input to query visible rasters.</param>
        /// <param name="options" type="Object" optional="true">Options for query. Use the rasterAttributeTableFieldPrefix property to describe the prefix to be used with the raster attribute table fields.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="String" optional="true">The function to call when an error occurs.</param>
    },
    refresh: function () {
        /// <summary>Refreshes the map by making a new request to the server.</summary>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setBandIds: function (bandIds,doNotRefresh) {
        /// <summary>Sets the R,G,B of the exported image to the appropriate ImageService Band ID.</summary>
        /// <param name="bandIds" type="Number[]" optional="false">Array of band IDs to use in the exported image.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setCompressionQuality: function (quality,doNotRefresh) {
        /// <summary>Sets the compression quality of the exported image.</summary>
        /// <param name="quality" type="Number" optional="false">A value from 0 to 100. 100 is best quality but largest in file size.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setDefinitionExpression: function (expression,doNotRefresh) {
        /// <summary>Sets the definition expression for the ImageService Layer.</summary>
        /// <param name="expression" type="String" optional="false">The definition expression to be set.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="false">Whether or not the expression definition will be refreshed.</param>
    },
    setDisableClientCaching: function (disable) {
        /// <summary>Sets whether images are always requested from the server and the browser's cache is ignored.</summary>
        /// <param name="disable" type="Boolean" optional="false">When true, browser client side caching is disabled.</param>
    },
    setImageFormat: function (imageFormat,doNotRefresh) {
        /// <summary>Set the image format</summary>
        /// <param name="imageFormat" type="String" optional="false">Valid values are png | png8 | png24 | jpg | pdf | bmp | gif | svg.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setInfoTemplate: function (infoTemplate) {
        /// <summary>Specify or change the info template for a layer</summary>
        /// <param name="infoTemplate" type="InfoTemplate" optional="false">The content for display in an InfoWindow.</param>
    },
    setInterpolation: function (interpolation,doNotRefresh) {
        /// <summary>Sets the interpolation method.</summary>
        /// <param name="interpolation" type="String" optional="false">Interpolation value defined in ImageServiceParameters Constants Table.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setMosaicRule: function (mosaicRule,doNotRefresh) {
        /// <summary>Sets the mosaic rule of the layer to the specified value.</summary>
        /// <param name="mosaicRule" type="MosaicRule" optional="false">The mosaic rule.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
        /// <return type="MosaicRule">MosaicRule</return>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setRenderingRule: function (renderingRule,doNotRefresh) {
        /// <summary>Sets the rendering rule of the layer to the given value.</summary>
        /// <param name="renderingRule" type="RasterFunction" optional="false">The new rendering rule.</param>
        /// <param name="doNotRefresh" type="Boolean" optional="true">Added at version 2.2 When true the layer will not refresh the map image. The default value is false.</param>
        /// <return type="RasterFunction">RasterFunction</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setUseMapTime: function (update) {
        /// <summary>Determine if the layer will update its content based on the map's current time extent.</summary>
        /// <param name="update" type="Boolean" optional="false">When false the layer will not update its content based on the map's time extent. Default value is true.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.ArcGISTiledMapServiceLayer = function (url,options) {
    /// <summary>Creates a new ArcGISTiledMapServiceLayer object.</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource at represents a map service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Portland/Portland_ESRI_LandBase_AGO/MapServer. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;Number&#62; displayLevels&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;Number&#62; refreshInterval&#10;
    /// &#60;Boolean&#62; resampling&#10;
    /// &#60;Number&#62; resamplingTolerance&#10;
    /// &#60;Boolean&#62; showAttribution&#10;
    /// &#60;String[]&#62; tileServers&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="capabilities" type="String">Capabilities of the map service, possible values are Map, Query and Data.</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="copyright" type="String">Copyright string as defined by the map service</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="description" type="String">Map description as defined by the map service</field>
    /// <field name="fullExtent" type="Extent">Full extent as defined by the map service</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="initialExtent" type="Extent">Initial extent as defined by the map service</field>
    /// <field name="layerInfos" type="LayerInfo[]">Returns the available layers in service and their default visibility</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxImageHeight" type="Number">The maximum image height , in pixels, that the map service will export.</field>
    /// <field name="maxImageWidth" type="Number">The maximum image width, in pixels, that the map service will export.</field>
    /// <field name="maxRecordCount" type="Number">The maximum number of results that can be returned from query, identify and find operations.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map service.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="tileInfo" type="TileInfo">Returns TileInfo, which has information on the tiling schema</field>
    /// <field name="timeInfo" type="TimeInfo">Temporal information for the layer, such as time extent.</field>
    /// <field name="units" type="String">Default units of the layer as defined by the service.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="version" type="Number">The version of ArcGIS Server where the map service is published.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.ArcGISTiledMapServiceLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchronously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    getTileUrl: function (level,row,column) {
        /// <summary>Method to implement when extending TiledMapServiceLayer.</summary>
        /// <param name="level" type="Number" optional="false">Requested tile's level.</param>
        /// <param name="row" type="Number" optional="false">Requested tile's row.</param>
        /// <param name="column" type="Number" optional="false">Requested tile's column.</param>
        /// <return type="String">String</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    refresh: function () {
        /// <summary>Reloads all the tiles in the current view</summary>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.CodedValueDomain = function () {

    /// <field name="codedValues" type="Object[]">An array of the coded values in the domain.</field>
};

esri.layers.Domain = function () {

    /// <field name="name" type="String">The domain name</field>
    /// <field name="type" type="String">The domain type.</field>
};

esri.layers.Domain.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.DynamicLayerInfo = function (json) {
    /// <summary>Creates a new DynamicLayerInfo object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the DynamicLayerInfo.require([ "esri/layers/DynamicLayerInfo", ... ], function(DynamicLayerInfo, ... ) { var dynamicLayerInfo = new DynamicLayerInfo({ "defaultVisibility": true, "id": 0, "maxScale": 1000000, "minScale": 0, "parentLayerId": -1 }); ...});</param>
    /// <field name="defaultVisibility" type="Boolean">Default visibility of the layers in the map service</field>
    /// <field name="id" type="Number">Layer ID assigned by ArcGIS Server for a layer.</field>
    /// <field name="maxScale" type="Number">The maximum visible scale for each layer in the map service.</field>
    /// <field name="minScale" type="Number">The minimum visible scale for each layer in the map service.</field>
    /// <field name="name" type="String">Layer name as defined in the map service</field>
    /// <field name="parentLayerId" type="Number">If the layer is part of a group layer, it will include the parent ID of the group layer.</field>
    /// <field name="source" type="LayerMapSource or LayerDataSource">The source for the dynamic layer can be either a LayerMapSource or LayerDataSource.</field>
    /// <field name="subLayerIds" type="Number[]">If the layer is a parent layer, it will have one or more sub layers included in an array.</field>
};

esri.layers.DynamicLayerInfo.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.DynamicMapServiceLayer = function () {

    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="fullExtent" type="Extent">Full extent as defined by the map service</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="initialExtent" type="Extent">Initial extent as defined by the map service</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map service.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.DynamicMapServiceLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getImageUrl: function (extent,width,height,callback) {
        /// <summary>Method to implement when extending DynamicMapServiceLayer.</summary>
        /// <param name="extent" type="Extent" optional="false">Current extent of the map.</param>
        /// <param name="width" type="Number" optional="false">Current width of the map in pixels.</param>
        /// <param name="height" type="Number" optional="false">Current height of the map in pixels.</param>
        /// <param name="callback" type="Function" optional="false">The function to call when the method has completed.</param>
        /// <return type="String">String</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    refresh: function () {
        /// <summary>Refreshes the map by making a new request to the server.</summary>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.FeatureEditResult = function () {

    /// <field name="attachmentId" type="Number">Unique ID of the attachment.</field>
    /// <field name="error" type="Error">Information about errors that occur if the edit operation failed</field>
    /// <field name="objectId" type="Number">Unique ID of the feature or object</field>
    /// <field name="success" type="Boolean">If true the operation was successful</field>
};

esri.layers.FeatureLayer = function (url,options) {
    /// <summary>Creates a new instance of a feature layer object from the ArcGIS Server REST resource identified by the input URL.</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a feature service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer/0. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;Boolean&#62; autoGeneralize&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;Boolean&#62; displayOnPan&#10;
    /// &#60;Function&#62; editSummaryCallback&#10;
    /// &#60;String&#62; gdbVersion&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;InfoTemplate&#62; infoTemplate&#10;
    /// &#60;Number&#62; maxAllowableOffset&#10;
    /// &#60;Number&#62; mode&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;String[]&#62; orderByFields&#10;
    /// &#60;String[]&#62; outFields&#10;
    /// &#60;Number&#62; refreshInterval&#10;
    /// &#60;Boolean&#62; showAttribution&#10;
    /// &#60;Number&#62; tileHeight&#10;
    /// &#60;Number&#62; tileWidth&#10;
    /// &#60;String&#62; trackIdField&#10;
    /// &#60;Boolean&#62; useMapTime&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <field name="allowGeometryUpdates" type="Boolean">Returns true if the geometry of the features in the layer can be edited, false otherwise.</field>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="capabilities" type="String">Information about the capabilities enabled for this layer</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="copyright" type="String">Copyright information for the layer</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="dataAttributes" type="String | String[]">List of attribute fields added as custom data attributes to graphics node.</field>
    /// <field name="defaultDefinitionExpression" type="String">Metadata describing the default definition expression for the layer as defined by the service.</field>
    /// <field name="defaultVisibility" type="Boolean">Indicates the default visibility for the layer</field>
    /// <field name="description" type="String">The description of the layer as defined in the map service</field>
    /// <field name="displayField" type="String">The name of the layer's primary display field.</field>
    /// <field name="editFieldsInfo" type="Object">Indicates the field names for the editor fields.</field>
    /// <field name="fields" type="Field[]">The array of fields in the layer</field>
    /// <field name="fullExtent" type="Extent">The full extent of the layer</field>
    /// <field name="geometryType" type="String">Geometry type of the features in the layer.</field>
    /// <field name="globalIdField" type="String">The globalIdField for the layer</field>
    /// <field name="graphics" type="Graphic[]">Array of features in the layer</field>
    /// <field name="hasAttachments" type="Boolean">True if attachments are enabled on the feature layer.</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="htmlPopupType" type="String">The html popup type defined for the layer.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="layerId" type="Number">Unique ID of the layer that the FeatureLayer was constructed against</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxRecordCount" type="Number">The maximum number of results that will be returned from a query.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="name" type="String">The name of the layer as defined in the map service</field>
    /// <field name="objectIdField" type="String">The name of the field that contains the Object ID field for the layer</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="ownershipBasedAccessControlForFeatures" type="Object"> Indicates the ownership access control configuration.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="relationships" type="Object[]"> Each element in the array is an object that describes the layer's relationship with another layer or table.</field>
    /// <field name="renderer" type="Renderer">The renderer for the layer</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="source" type="LayerMapSource or LayerDataSource">The dynamic layer or table source</field>
    /// <field name="styling" type="Boolean">Indicates whether the layer is responsible for styling graphics.</field>
    /// <field name="supportsAdvancedQueries" type="Boolean">When true, the layer supports orderByFields in a query operation.</field>
    /// <field name="supportsStatistics" type="Boolean">When true, the layer supports statistical functions in query operations.</field>
    /// <field name="surfaceType" type="String">Type of vector graphics surface used to draw graphics</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="templates" type="FeatureTemplate[]">An array of feature templates defined in the Feature Service layer.</field>
    /// <field name="timeInfo" type="TimeInfo">Time information for the layer, such as start time field, end time field, track id field, layers time extent and the draw time interval.</field>
    /// <field name="type" type="String">Specifies the type of layer.</field>
    /// <field name="typeIdField" type="String">The field that represents the Type ID field.</field>
    /// <field name="types" type="FeatureType[]">An array of sub types defined in the Feature Service layer.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="version" type="Number">The version of ArcGIS Server where the layer is published.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.FeatureLayer.prototype = 
{
    add: function (graphic) {
        /// <summary>Adds a graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to add.</param>
        /// <return type="Graphic">Graphic</return>
    },
    addAttachment: function (objectId,formNode,callback,errback) {
        /// <summary>Add an attachment to the feature specified by the ObjectId.</summary>
        /// <param name="objectId" type="Number" optional="false">The ObjectId of the feature to which the attachment is added.</param>
        /// <param name="formNode" type="HTMLFormElement" optional="false">HTML form that contains a file upload field pointing to the file to be added as an attachment.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the addAttachmentComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    applyEdits: function (adds,updates,deletes,callback,errback) {
        /// <summary>Apply edits to the feature layer.</summary>
        /// <param name="adds" type="Graphic[]" optional="true">Array of features to add to the layer in the feature service. New features are typically created using the Draw toolbar.</param>
        /// <param name="updates" type="Graphic[]" optional="true">Array of features whose geometry and/or attributes have changed. Features must have a valid OBJECTID. The geometry of features is typically modified using the Edit toolbar. Attributes are modified using the Attribute Inspector.</param>
        /// <param name="deletes" type="Graphic[]" optional="true">Array of features to delete. Must have valid ObjectId</param>
        /// <param name="callback" type="Function" optional="true">This function will be called when the operation is complete. The arguments passed to this function are the same as the onEditsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    clear: function () {
        /// <summary>Clears all graphics</summary>
    },
    clearSelection: function () {
        /// <summary>Clears the current selection</summary>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    deleteAttachments: function (objectId,attachmentIds,callback,errback) {
        /// <summary>Delete one or more attachments for the feature specified by the input ObjectId.</summary>
        /// <param name="objectId" type="Number" optional="false">The ObjectId of the feature from which the attachment is removed.</param>
        /// <param name="attachmentIds" type="Number[]" optional="false">The array of attachment ids to delete.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    disableMouseEvents: function () {
        /// <summary>Disables all mouse events on the graphics layer</summary>
    },
    enableMouseEvents: function () {
        /// <summary>Enables all mouse events on the graphics layer</summary>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getDefinitionExpression: function () {
        /// <summary>Returns the current definition expression</summary>
        /// <return type="String">String</return>
    },
    getEditCapabilities: function (options) {
        /// <summary>Returns an object that describes the edit capabilities of the layer.</summary>
        /// <param name="options" type="Object" optional="true">If the layer supports ownership based access control, use the options to determine if the specified user can edit features. Ownership based access control requires ArcGIS Server services version 10.1 or greater. &#60;graphic&#62; feature Check to see if the specified feature can be edited by the specified user. &#60;string&#62; userId The name of the currently logged in user. If the application uses the IdentityManager the IdentityManager supplies the layer with the userId so this parameter is not required. </param>
        /// <return type="Object">Object</return>
    },
    getEditInfo: function (feature,options) {
        /// <summary>Returns an object describing the most recent edit operation performed on the given feature, if available</summary>
        /// <param name="feature" type="Feature" optional="false">The feature to get the edit info for.</param>
        /// <param name="options" type="Object" optional="true">The options object may have the following properties: &#60;String&#62; action By default, the method returns a summary of the most recent edit performed on the feature. Use this option to override this behavior. 'creation' indicates creation summary is desired. 'edit' indicates edit summary is desired. </param>
        /// <return type="Object or Undefined">Object or Undefined</return>
    },
    getEditSummary: function (feature,options) {
        /// <summary>Returns a localized summary of the last edit operation performed on the given feature, if available.</summary>
        /// <param name="feature" type="Feature" optional="false">The feature to get the edit summary for.</param>
        /// <param name="options" type="Object" optional="true">The options object may have the following properties: &#60;String&#62; action By default, the method returns a summary of the most recent edit performed on the feature. Use this option to override this behavior. 'creation' indicates creation summary is desired. 'edit' indicates edit summary is desired. &#60;Function&#62; callback If you want to customize or override certain components of the summary, provide a callback function using this option. For example: featureLayer.getEditSummary(feature, { callback: function(feature, info) { if (info && info.userId) { info.userId = "&#60;a href='http://users.my.org/profile/" + info.userId + "'&#62;" + info.userId + "&#60;/a&#62;"; } return info; }}); </param>
        /// <return type="String">String</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getMaxAllowableOffset: function () {
        /// <summary>Returns the current value of the maxAllowableOffset used by the layer.</summary>
        /// <return type="Number">Number</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    getOrderByFields: function () {
        /// <summary>Returns the list of fields used to order features by.</summary>
        /// <return type="String[]">String[]</return>
    },
    getSelectedFeatures: function () {
        /// <summary>Gets the currently selected features</summary>
        /// <return type="Graphic[]">Graphic[]</return>
    },
    getSelectionSymbol: function () {
        /// <summary>Gets the current selection symbol</summary>
        /// <return type="Symbol">Symbol</return>
    },
    getTimeDefinition: function () {
        /// <summary>Get the current time definition applied to the feature layer</summary>
        /// <return type="TimeExtent">TimeExtent</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isEditable: function () {
        /// <summary>Returns true if the FeatureLayer is editable.</summary>
        /// <return type="Boolean">Boolean</return>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    queryAttachmentInfos: function (objectId,callback,errback) {
        /// <summary>Query for information about attachments associated with the specified ObjectIds</summary>
        /// <param name="objectId" type="Number" optional="false">The ObjectId for the feature to query for attachment information.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryCount: function (query,callback,errback) {
        /// <summary>Get a count of the number of features that satisfy the input query.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryFeatures: function (query,callback,errback) {
        /// <summary>Query features from the feature layer.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used. As of version 3.5 the returnGeometry value is honored.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryIds: function (query,callback,errback) {
        /// <summary>Query for ObjectIds.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryRelatedFeatures: function (relQuery,callback,errback) {
        /// <summary>Query features or records, from another layer or table, related to features in this layer</summary>
        /// <param name="relQuery" type="RelationshipQuery" optional="false">The input query.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    redraw: function () {
        /// <summary>Redraws all the graphics in the graphics layer.</summary>
    },
    refresh: function () {
        /// <summary>Refreshes the features in the feature layer.</summary>
    },
    remove: function (graphic) {
        /// <summary>Removes a graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to remove.</param>
        /// <return type="Graphic">Graphic</return>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    selectFeatures: function (query,selectionMethod,callback,errback) {
        /// <summary>Selects features from the FeatureLayer.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="selectionMethod" type="Number" optional="true">The selection method defines how the restful of the selection is combined with the existing selection. See Constants table for valid values. The default option is to create a new selection.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onSelectionComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    setAutoGeneralize: function (enable) {
        /// <summary>Enable or disable auto generalization for the layer.</summary>
        /// <param name="enable" type="Boolean" optional="false">When true, auto generalize is enabled. Default value for non-editable on-demand feature layers is true.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setDefinitionExpression: function (expression) {
        /// <summary>Set's the definition expression for the FeatureLayer.</summary>
        /// <param name="expression" type="String" optional="false">The definition expression to apply. For example, "TYPE='Park'"</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setEditable: function (editable) {
        /// <summary>Set the editability of feature layers created from a feature collection.</summary>
        /// <param name="editable" type="Boolean" optional="false">When true, the layer will be set as editable.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setGDBVersion: function (versionName) {
        /// <summary>Set the layer's data source to the specified geodatabase version.</summary>
        /// <param name="versionName" type="String" optional="false">The name of the geodatabase version to use as the layer's data source.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setInfoTemplate: function (infoTemplate) {
        /// <summary>Specify or change the info template for a layer</summary>
        /// <param name="infoTemplate" type="InfoTemplate" optional="false">The new info template.</param>
    },
    setMaxAllowableOffset: function (offset) {
        /// <summary>Sets the maximum allowable offset used when generalizing geometries</summary>
        /// <param name="offset" type="Number" optional="false">The maximum allowable offset.</param>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function (opacity) {
        /// <summary>Initial opacity or transparency of layer.</summary>
        /// <param name="opacity" type="Number" optional="false">Value from 0 to 1, where 0 is 100% transparent and 1 has no transparency. The default value is 1.</param>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setRenderer: function (renderer) {
        /// <summary>Set the renderer for the feature layer</summary>
        /// <param name="renderer" type="Renderer" optional="false">The renderer to apply to the feature layer</param>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale for the layer. If the map is zoomed out beyond the specified scale the layer will not be visible. A value of 0 means the layer does not have a minimum scale.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale for the layer. If the map is zoomed out beyond the specified scale the layer will not be visible. A value of 0 means the layer does not have a maximum scale.</param>
    },
    setSelectionSymbol: function (symbol) {
        /// <summary>Set's the selection symbol for the feature layer.</summary>
        /// <param name="symbol" type="Symbol" optional="false">Symbol for the current selection. Make sure the symbol type is appropriate for the geometry type of the layer.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setTimeDefinition: function (definition) {
        /// <summary>Set's the time definition for the feature layer.</summary>
        /// <param name="definition" type="TimeExtent" optional="false">The new time extent used to filter the layer.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setTimeOffset: function (offsetValue,offsetUnits) {
        /// <summary>Time offset allows you to display the features at a different time so they can be overlaid on top of previous or future time periods.</summary>
        /// <param name="offsetValue" type="Number" optional="false">The length of time to offset from "this" time. Specify a positive or negative whole number.</param>
        /// <param name="offsetUnits" type="String" optional="false">Units in which the offset is specified. See the TimeInfo constants for valid values.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setUseMapTime: function (update) {
        /// <summary>Determine if the layer will update its content based on the map's current time extent.</summary>
        /// <param name="update" type="Boolean" optional="false">When false the layer will not update its content based on the map's time extent. Default value is true.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the layer.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.FeatureTemplate = function () {

    /// <field name="description" type="String">The description of the template</field>
    /// <field name="drawingTool" type="String">The default drawing tool defined for the template.</field>
    /// <field name="name" type="String">The templates name</field>
    /// <field name="prototype" type="Graphic">An instance of the prototypical feature described by the template.</field>
};

esri.layers.FeatureTemplate.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.FeatureType = function () {

    /// <field name="domains" type="Object">Map of field names to domains.</field>
    /// <field name="id" type="Number">The feature type identifier</field>
    /// <field name="name" type="String">The feature type name</field>
    /// <field name="templates" type="FeatureTemplate[]">Array of feature templates associated with this feature type</field>
};

esri.layers.FeatureType.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.Field = function () {

    /// <field name="alias" type="String">The alias name for the field</field>
    /// <field name="domain" type="Domain">Domain associated with the field</field>
    /// <field name="editable" type="Boolean">Indicates whether the field is editable</field>
    /// <field name="length" type="Number">The field length.</field>
    /// <field name="name" type="String">The name of the field</field>
    /// <field name="nullable" type="Boolean">Indicates if the field can accept null values.</field>
    /// <field name="type" type="String">The data type of the field.</field>
};

esri.layers.GeoRSSLayer = function (url,options) {
    /// <summary>Creates a new GeoRSSLayer object</summary>
    /// <param name="url" type="String" optional="false">URL to the GeoRSS resource.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;SpatialReference&#62; outSpatialReference&#10;
    /// &#60;Symbol&#62; pointSymbol&#10;
    /// &#60;Symbol&#62; polygonSymbol&#10;
    /// &#60;Symbol&#62; polylineSymbol&#10;
    /// &#60;InfoTemplate&#62; template</param>
    /// <field name="copyright" type="String">The copyright information for the layer.</field>
    /// <field name="defaultVisibility" type="Boolean">The default visibility of the layer</field>
    /// <field name="description" type="String">The layer description</field>
    /// <field name="items" type="Graphic[]">An array that contains all the graphics in the GeoRSSLayer.</field>
    /// <field name="name" type="String">The name of the layer</field>
};

esri.layers.GeoRSSLayer.prototype = 
{
    getFeatureLayers: function () {
        /// <summary>An array of feature layers for the GeoRSSLayer.</summary>
        /// <return type="FeatureLayer[]">FeatureLayer[]</return>
    },
};

esri.layers.GraphicsLayer = function () {
    /// <summary>Creates a new GraphicsLayer object</summary>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="dataAttributes" type="String | String[]">List of attribute fields added as custom data attributes to graphics node.</field>
    /// <field name="graphics" type="Graphic[]">The array of graphics that make up the layer</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="renderer" type="Renderer">Renderer assigned to the GraphicsLayer</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="styling" type="Boolean">Indicates whether the layer is responsible for styling graphics.</field>
    /// <field name="surfaceType" type="String">Type of vector graphics surface used to draw graphics</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.GraphicsLayer.prototype = 
{
    add: function (graphic) {
        /// <summary>Adds a graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to add.</param>
        /// <return type="Graphic">Graphic</return>
    },
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    clear: function () {
        /// <summary>Clears all graphics</summary>
    },
    disableMouseEvents: function () {
        /// <summary>Disables all mouse events on the graphics layer</summary>
    },
    enableMouseEvents: function () {
        /// <summary>Enables all mouse events on the graphics layer</summary>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    redraw: function () {
        /// <summary>Redraws all the graphics in the layer.</summary>
    },
    remove: function (graphic) {
        /// <summary>Removes a graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to remove.</param>
        /// <return type="Graphic">Graphic</return>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setInfoTemplate: function (infoTemplate) {
        /// <summary>Specify or change the info template for a layer</summary>
        /// <param name="infoTemplate" type="InfoTemplate" optional="false">The new info template.</param>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function (opacity) {
        /// <summary>Initial opacity or transparency of layer.</summary>
        /// <param name="opacity" type="Number" optional="false">Value from 0 to 1, where 0 is 100% transparent and 1 has no transparency. The default value is 1.</param>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setRenderer: function (renderer) {
        /// <summary>Sets the renderer for the graphics layer</summary>
        /// <param name="renderer" type="Renderer" optional="false">The renderer used for the graphic.</param>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.ImageParameters = function () {
    /// <summary>Creates a new ImageParameters object.</summary>
    /// <field name="bbox" type="Extent">Extent of map to be exported</field>
    /// <field name="dpi" type="Number">Dots per inch setting for an ArcGISDynamicMapServiceLayer</field>
    /// <field name="format" type="String">Map image format</field>
    /// <field name="height" type="Number">Requested image height in pixels</field>
    /// <field name="imageSpatialReference" type="SpatialReference">Spatial reference of exported map.</field>
    /// <field name="layerDefinitions" type="String[]">Array of layer definition expressions that allows you to filter the features of individual layers in the exported map image.</field>
    /// <field name="layerIds" type="Number[]">A list of layer ID's, that represent which layers to include in the exported map.</field>
    /// <field name="layerOption" type="String">The option for displaying or hiding the layer.</field>
    /// <field name="layerTimeOptions" type="LayerTimeOptions[]">Array of LayerTimeOptions objects that allow you to override how a layer is exported in reference to the map's time extent.</field>
    /// <field name="timeExtent" type="TimeExtent">The time extent for the map image</field>
    /// <field name="transparent" type="Boolean">Whether or not background of dynamic image is transparent</field>
    /// <field name="width" type="Number">Requested image width in pixels</field>
};

esri.layers.ImageServiceParameters = function () {
    /// <summary>Creates a new ImageServiceParameters object.</summary>
    /// <field name="bandIds" type="Number[]">Array of current band selections</field>
    /// <field name="compressionQuality" type="Number">Current compression quality value.</field>
    /// <field name="extent" type="Extent">Extent of the exported image</field>
    /// <field name="format" type="String">Map image format.</field>
    /// <field name="height" type="Number">Requested image height in pixels</field>
    /// <field name="interpolation" type="String">Current interpolation method.</field>
    /// <field name="mosaicRule" type="MosaicRule">Specifies the mosaic rule when defining how individual images should be mosaicked</field>
    /// <field name="noData" type="Number">The pixel value that represents no information</field>
    /// <field name="renderingRule" type="RasterFunction">Specifies the rendering rule for how the requested image should be rendered.</field>
    /// <field name="timeExtent" type="TimeExtent">Define the time extent for the image</field>
    /// <field name="width" type="Number">Requested image width in pixels</field>
};

esri.layers.InheritedDomain = function () {

};

esri.layers.JoinDataSource = function (json) {
    /// <summary>Creates a new JoinDataSource object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the JoinDataSource.</param>
    /// <field name="joinType" type="String">The type of join that will be performed</field>
    /// <field name="leftTableKey" type="String">The key field used for the left table source for the join</field>
    /// <field name="leftTableSource" type="LayerMapSource or LayerDataSource">The data source to be used as the left table for the join operation.</field>
    /// <field name="rightTableKey" type="String">The key field used for the right table source for the join</field>
    /// <field name="rightTableSource" type="LayerMapSource or LayerDataSource">The data source to be used as the right table for the join operation</field>
};

esri.layers.JoinDataSource.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.KMLFolder = function () {

    /// <field name="description" type="String">The KML folder description</field>
    /// <field name="featureInfos" type="Object[]">An array of objects that describe top-level KML features ids and their types.</field>
    /// <field name="id" type="Number">The KML folder id</field>
    /// <field name="name" type="String">The KML folder name</field>
    /// <field name="parentFolderId" type="Number">The id of the parent folder</field>
    /// <field name="snippet" type="String">The KML folder snippet</field>
    /// <field name="subFolderIds" type="Number[]">An array of ids for the KML folder's subfolders</field>
    /// <field name="visibility" type="Number">The visibility of the KML folder.</field>
};

esri.layers.KMLGroundOverlay = function () {

    /// <field name="Snippet" type="String">Short snippet describing the KML ground overlay</field>
    /// <field name="description" type="String">KML ground overlay description</field>
    /// <field name="extent" type="Extent">Extent of image</field>
    /// <field name="height" type="Number">Requested image height in pixels</field>
    /// <field name="href" type="String">URL to returned image</field>
    /// <field name="id" type="Number">The id of the KML ground overlay</field>
    /// <field name="name" type="String">The name of the KML ground overlay</field>
    /// <field name="scale" type="Number">Scale of requested dynamic map</field>
    /// <field name="visibility" type="Number">The KML ground overlay visibility.</field>
    /// <field name="width" type="Number">Requested image width in pixels</field>
};

esri.layers.KMLLayer = function (id,url,options) {
    /// <summary>Creates a new KMLLayer object</summary>
    /// <param name="id" type="String" optional="false">Id to assign to the layer. This id is used for the layer and as the base for all sub layers that are created.</param>
    /// <param name="url" type="String" optional="false">The url for a .kml or .kmz file.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list. View the Layer object for additional options.&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;SpatialReference&#62; outSR&#10;
    /// &#60;Number&#62; refreshInterval</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="featureInfos" type="Object[]">An array of objects that describe top-level KML features ids and their types.</field>
    /// <field name="folders" type="KMLFolder[]">An array of KMLFolder objects that describe the folders and nested folders defined in the KML file.</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="linkInfo" type="Object">A link info object with properties that describe the network link.</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.KMLLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getFeature: function (featureInfo) {
        /// <summary>Get the KML feature identified by the input feature info.</summary>
        /// <param name="featureInfo" type="Object" optional="false">Feature info for the kml feature.</param>
        /// <return type="Object">Object</return>
    },
    getLayers: function () {
        /// <summary>Get an array of map layers that were created to draw placemarks, ground and screen overlays.</summary>
        /// <return type="Layer[]">Layer[]</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setFolderVisibility: function (folder,true) {
        /// <summary>Set the visibility for the specified folder</summary>
        /// <param name="folder" type="KMLFolder" optional="false">A KML folder.</param>
        /// <param name="true" type="Boolean" optional="false">The visibility of the folder and all kml features within the folder.</param>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.LOD = function () {

    /// <field name="level" type="Number">ID for each level.</field>
    /// <field name="levelValue" type="String">String to be used when constructing URL to access a tile from this LOD.</field>
    /// <field name="resolution" type="Number">Resolution in map units of each pixel in a tile for each level</field>
    /// <field name="scale" type="Number">Scale for each level</field>
};

esri.layers.LabelClass = function (json) {
    /// <summary>Create a LabelClass, in order to be added to layerDrawingOption.labelingInfo</summary>
    /// <param name="json" type="Object" optional="true">Various options to configure this LabelClass. Any property can be passed into this object.</param>
    /// <field name="labelExpression" type="String">Adjusts the formatting of labels.</field>
    /// <field name="labelPlacement" type="String">The position of the label.</field>
    /// <field name="maxScale" type="Number">The maximum scale to show labels.</field>
    /// <field name="minScale" type="Number">The minimum scale to show labels.</field>
    /// <field name="symbol" type="TextSymbol">Sets the Rendering symbol for the label</field>
    /// <field name="useCodedValues" type="Boolean">When true, show the fields in the labelExpression that have domains using the domain's name</field>
    /// <field name="where" type="String">A where clause determining which features are labeled.</field>
};

esri.layers.LabelLayer = function () {
    /// <summary>Creates a new Label layer.</summary>
};

esri.layers.LabelLayer.prototype = 
{
    addFeatureLayer: function (featureLayer,renderer,textExpression,labelOptions) {
        /// <summary>Adds reference to the feature layer which is labeled.</summary>
        /// <param name="featureLayer" type="FeatureLayer" optional="false">The feature layer to be added to the label layer. Use FeatureLayer.MODE_ONDEMAND to improve the performance. Be sure the field(s) you would like to display is included in outFields.var featureLayer = new FeatureLayer( "http://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/0", { mode: FeatureLayer.MODE_ONDEMAND, outFields: ["CITY_NAME"] });</param>
        /// <param name="renderer" type="SimpleRenderer | UniqueValueRenderer | ClassBreaksRenderer" optional="false">The renderer used to render text labels. For most applications SimpleRederer is best choice, but you can use UniqueValueRenderer or ClassBreaksRenderer.var renderer = new SimpleRenderer(symbol);</param>
        /// <param name="textExpression" type="Object" optional="false">An expression determining what text and field(s) will be displayed as in labels."${CITY_NAME}"</param>
        /// <param name="labelOptions" type="Object" optional="true">An object providing additional options for changing label visibility and placement. The following options are available: Option Available Values Default Value Applicable Feature Type pointPriorities AboveLeft | CenterLeft | BelowLeft | BelowCenter | BelowRight | CenterRight | AboveRight | CenterCenter AboveRight Point lineLabelPlacement PlaceAtStart | PlaceAtCenter | PlaceAtEnd PlaceAtCenter Line lineLabelPosition Above | OnLine | Below Above Line labelRotation true | false true Line howManyLabels OneLabel | ManyLabels OneLabel Polygon { lineLabelPosition: "OnLine", labelRotation: false}</param>
    },
    getFeatureLayer: function (index) {
        /// <summary>Returns reference to the feature layer which features will be labeled</summary>
        /// <param name="index" type="Number" optional="false">Index of the referenced feature layer.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
};

esri.layers.Layer = function (options) {
    /// <summary>Creates a new Layer object</summary>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;Number&#62; refreshInterval&#10;
    /// &#60;Boolean&#62; showAttribution</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.Layer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.LayerDataSource = function (json) {
    /// <summary>Creates a new LayerDataSource object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the LayerDataSource.</param>
    /// <field name="dataSource" type="Object">The data source used to create a dynamic data layer on the fly.</field>
};

esri.layers.LayerDataSource.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.LayerDrawingOptions = function (json) {
    /// <summary>Creates a new LayerDrawingOptions object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the LayerDrawingOptions.</param>
    /// <field name="labelingInfo" type="LabelClass[]">Define labels of dynamicLayers</field>
    /// <field name="renderer" type="Renderer">The renderer to use for the dynamic layer</field>
    /// <field name="scaleSymbols" type="Boolean">Determines if the layer renders the symbols based on scale.</field>
    /// <field name="showLabels" type="Boolean">Determines if labels are displayed.</field>
    /// <field name="transparency" type="Number">The transparency of the layer.</field>
};

esri.layers.LayerDrawingOptions.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.LayerInfo = function () {

    /// <field name="defaultVisibility" type="Boolean">Default visibility of the layers in the map service</field>
    /// <field name="id" type="Number">Layer ID assigned by ArcGIS Server for a layer.</field>
    /// <field name="maxScale" type="Number">The maximum visible scale for each layer in the map service.</field>
    /// <field name="minScale" type="Number">The minimum visible scale for each layer in the map service.</field>
    /// <field name="name" type="String">Layer name as defined in the map service</field>
    /// <field name="parentLayerId" type="Number">If the layer is part of a group layer, it will include the parent ID of the group layer.</field>
    /// <field name="subLayerIds" type="Number[]">If the layer is a parent layer, it will have one or more sub layers included in an array.</field>
};

esri.layers.LayerMapSource = function (json) {
    /// <summary>Creates a new LayerMapSource object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the LayerMapSource.</param>
    /// <field name="gdbVersion" type="String">When supported, specify the version in an SDE workspace that the layer will use</field>
    /// <field name="mapLayerId" type="Number">The layer id for a sub-layer in the current map service</field>
};

esri.layers.LayerMapSource.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.LayerTimeOptions = function () {

    /// <field name="timeDataCumulative" type="Boolean">If true, the layer will draw all features from the beginning of the data's time extent.</field>
    /// <field name="timeOffset" type="Number">The length of time the data is offset from the time when the data was recorded.</field>
    /// <field name="timeOffsetUnits" type="String">Temporal unit in which the time offset is measured.</field>
    /// <field name="useTime" type="Boolean">If true, the layer participates in time-related rendering and query operations</field>
};

esri.layers.MapImage = function (options) {
    /// <summary>Creates a new Map Image object</summary>
    /// <param name="options" type="Object" optional="false">An object that defines the map image options.&#10;
    /// &#60;Extent&#62; extent&#10;
    /// &#60;String&#62; href</param>
    /// <field name="extent" type="Extent">Extent of exported map</field>
    /// <field name="height" type="Number">Requested image height in pixels</field>
    /// <field name="href" type="String">URL to returned image.</field>
    /// <field name="scale" type="Number">Scale of requested dynamic map</field>
    /// <field name="width" type="Number">Requested image width in pixels</field>
};

esri.layers.MapImageLayer = function (options) {
    /// <summary>Creates a new MapImageLayer object.</summary>
    /// <param name="options" type="Object" optional="true">Optional parameters. View the Layer object for the list of parameters.</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.MapImageLayer.prototype = 
{
    addImage: function (mapImage) {
        /// <summary>Add an image to the map.</summary>
        /// <param name="mapImage" type="MapImage" optional="false">A MapImage object that defines the image to add to the map.</param>
    },
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getImages: function () {
        /// <summary>Get an array of MapImage objects that define the images in the MapImageLayer</summary>
        /// <return type="MapImage[]">MapImage[]</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    removeAllImages: function () {
        /// <summary>Remove all images from the layer</summary>
    },
    removeImage: function (mapImage) {
        /// <summary>Remove the specified image from the layer</summary>
        /// <param name="mapImage" type="MapImage" optional="false">The MapImage object that defines the image to remove.</param>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.MosaicRule = function () {
    /// <summary>Creates a new MosaicRule object.</summary>
    /// <field name="ascending" type="Boolean">Indicates whether the sort should be ascending or not.</field>
    /// <field name="lockRasterIds" type="Number[]">An array of raster Ids.</field>
    /// <field name="method" type="String">The mosaic method determines how the selected rasters are ordered.</field>
    /// <field name="objectIds" type="Number[]">Defines a selection using a set of ObjectIds.</field>
    /// <field name="operation" type="String">Defines the mosaic operation used to resolve overlapping pixels.</field>
    /// <field name="sortField" type="String">The name of the attribute field that is used together with a constant sortValue to define the mosaicking order when the mosaic method is set to METHOD_ATTRIBUTE.</field>
    /// <field name="sortValue" type="String">A constant value defining a reference or base value for the sort field when the mosaic method is set to METHOD_ATTRIBUTE</field>
    /// <field name="viewpoint" type="Point">Defines the viewpoint location on which the ordering is defined based on the distance from the viewpoint and the nadir of rasters</field>
    /// <field name="where" type="String">The where clause determines which rasters will participate in the mosaic.</field>
};

esri.layers.MosaicRule.prototype = 
{
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the mosaic rule</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.OpenStreetMapLayer = function (options) {
    /// <summary>Creates a new OpenStreetMapLayer object</summary>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;Number[]&#62; displayLevels&#10;
    /// &#60;String&#62; id&#10;
    /// &#60;Number&#62; opacity&#10;
    /// &#60;Boolean&#62; resampling&#10;
    /// &#60;Number&#62; resamplingTolerance&#10;
    /// &#60;String[]&#62; tileServers&#10;
    /// &#60;Boolean&#62; visible</param>
    /// <field name="copyright" type="String">The copyright text</field>
};

esri.layers.QueryDataSource = function (json) {
    /// <summary>Creates a new QueryDataSource object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the QueryDataSource.</param>
    /// <field name="geometryType" type="String">The geometry type of the data source.</field>
    /// <field name="oidFields" type="String[]">An array of field names that define a unique identifier for the feature.</field>
    /// <field name="query" type="String">The SQL query string that defines the data source output</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference for the data source.</field>
    /// <field name="workspaceId" type="String">The workspace id for the registered file geodatabase, SDE or Shapefile workspace</field>
};

esri.layers.QueryDataSource.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.RangeDomain = function () {

    /// <field name="maxValue" type="Number">The maximum valid value</field>
    /// <field name="minValue" type="Number">The minimum valid value</field>
};

esri.layers.RasterDataSource = function (json) {
    /// <summary>Creates a new RasterDataSource object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the RasterDataSource.</param>
    /// <field name="dataSourceName" type="String">The name of a raster that resides in the registered workspace</field>
    /// <field name="workspaceId" type="String">The workspace id for the registered raster workspace</field>
};

esri.layers.RasterDataSource.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.RasterFunction = function () {
    /// <summary>Creates a new RasterFunction object</summary>
    /// <field name="arguments" type="Object">The arguments for the raster function.</field>
    /// <field name="functionName" type="String">The raster function name.</field>
    /// <field name="variableName" type="String">Variable name for the raster function</field>
};

esri.layers.RasterFunction.prototype = 
{
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the raster function</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.StreamLayer = function (url,options) {
    /// <summary>Creates a new StreamLayer with a service URL</summary>
    /// <param name="url" type="String" optional="false">Url to an ArcGIS Server Stream Service or Feature Service. Note: Applicable only when layer surfaceType is "svg". For other surface types, this option is ignored.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters used to create the layer. See options list.&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;Object&#62; purgeOptions&#10;
    /// &#60;Number&#62; refreshInterval&#10;
    /// &#60;String&#62; socketUrl</param>
    /// <field name="allowGeometryUpdates" type="Boolean">Returns true if the geometry of the features in the layer can be edited, false otherwise.</field>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="capabilities" type="String">Information about the capabilities enabled for this layer</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="copyright" type="String">Copyright information for the layer</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="dataAttributes" type="String | String[]">List of attribute fields added as custom data attributes to graphics node.</field>
    /// <field name="defaultDefinitionExpression" type="String">Metadata describing the default definition expression for the layer as defined by the service.</field>
    /// <field name="defaultVisibility" type="Boolean">Indicates the default visibility for the layer</field>
    /// <field name="description" type="String">The description of the layer as defined in the map service</field>
    /// <field name="displayField" type="String">The name of the layer's primary display field.</field>
    /// <field name="editFieldsInfo" type="Object">Indicates the field names for the editor fields.</field>
    /// <field name="fields" type="Field[]">The array of fields in the layer</field>
    /// <field name="fullExtent" type="Extent">The full extent of the layer</field>
    /// <field name="geometryType" type="String">Geometry type of the features in the layer.</field>
    /// <field name="globalIdField" type="String">The globalIdField for the layer</field>
    /// <field name="graphics" type="Graphic[]">Array of features in the layer</field>
    /// <field name="hasAttachments" type="Boolean">True if attachments are enabled on the feature layer.</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="htmlPopupType" type="String">The html popup type defined for the layer.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="layerId" type="Number">Unique ID of the layer that the FeatureLayer was constructed against</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxRecordCount" type="Number">The maximum number of results that will be returned from a query.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="name" type="String">The name of the layer as defined in the map service</field>
    /// <field name="objectIdField" type="String">The name of the field that contains the Object ID field for the layer</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="ownershipBasedAccessControlForFeatures" type="Object"> Indicates the ownership access control configuration.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="relationships" type="Object[]"> Each element in the array is an object that describes the layer's relationship with another layer or table.</field>
    /// <field name="renderer" type="Renderer">The renderer for the layer</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="socket" type="Object">Raw access to the connected websocket.</field>
    /// <field name="socketUrl" type="String">Url used to make the socket connection.</field>
    /// <field name="source" type="LayerMapSource or LayerDataSource">The dynamic layer or table source</field>
    /// <field name="styling" type="Boolean">Indicates whether the layer is responsible for styling graphics.</field>
    /// <field name="supportsAdvancedQueries" type="Boolean">When true, the layer supports orderByFields in a query operation.</field>
    /// <field name="supportsStatistics" type="Boolean">When true, the layer supports statistical functions in query operations.</field>
    /// <field name="surfaceType" type="String">Type of vector graphics surface used to draw graphics</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="templates" type="FeatureTemplate[]">An array of feature templates defined in the Feature Service layer.</field>
    /// <field name="timeInfo" type="TimeInfo">Time information for the layer, such as start time field, end time field, track id field, layers time extent and the draw time interval.</field>
    /// <field name="type" type="String">Specifies the type of layer.</field>
    /// <field name="typeIdField" type="String">The field that represents the Type ID field.</field>
    /// <field name="types" type="FeatureType[]">An array of sub types defined in the Feature Service layer.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="version" type="Number">The version of ArcGIS Server where the layer is published.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.StreamLayer.prototype = 
{
    add: function (graphic) {
        /// <summary>Adds a graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to add.</param>
        /// <return type="Graphic">Graphic</return>
    },
    addAttachment: function (objectId,formNode,callback,errback) {
        /// <summary>Add an attachment to the feature specified by the ObjectId.</summary>
        /// <param name="objectId" type="Number" optional="false">The ObjectId of the feature to which the attachment is added.</param>
        /// <param name="formNode" type="HTMLFormElement" optional="false">HTML form that contains a file upload field pointing to the file to be added as an attachment.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the addAttachmentComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    applyEdits: function (adds,updates,deletes,callback,errback) {
        /// <summary>Apply edits to the feature layer.</summary>
        /// <param name="adds" type="Graphic[]" optional="true">Array of features to add to the layer in the feature service. New features are typically created using the Draw toolbar.</param>
        /// <param name="updates" type="Graphic[]" optional="true">Array of features whose geometry and/or attributes have changed. Features must have a valid OBJECTID. The geometry of features is typically modified using the Edit toolbar. Attributes are modified using the Attribute Inspector.</param>
        /// <param name="deletes" type="Graphic[]" optional="true">Array of features to delete. Must have valid ObjectId</param>
        /// <param name="callback" type="Function" optional="true">This function will be called when the operation is complete. The arguments passed to this function are the same as the onEditsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    clear: function () {
        /// <summary>Clears all graphics</summary>
    },
    clearSelection: function () {
        /// <summary>Clears the current selection</summary>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    connect: function (callback) {
        /// <summary>Connect to the Stream Server socket.</summary>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
    },
    deleteAttachments: function (objectId,attachmentIds,callback,errback) {
        /// <summary>Delete one or more attachments for the feature specified by the input ObjectId.</summary>
        /// <param name="objectId" type="Number" optional="false">The ObjectId of the feature from which the attachment is removed.</param>
        /// <param name="attachmentIds" type="Number[]" optional="false">The array of attachment ids to delete.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    disableMouseEvents: function () {
        /// <summary>Disables all mouse events on the graphics layer</summary>
    },
    disconnect: function (callback) {
        /// <summary>Disconnect from the Stream Server socket.</summary>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
    },
    enableMouseEvents: function () {
        /// <summary>Enables all mouse events on the graphics layer</summary>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getDefinitionExpression: function () {
        /// <summary>Returns the current definition expression</summary>
        /// <return type="String">String</return>
    },
    getEditCapabilities: function (options) {
        /// <summary>Returns an object that describes the edit capabilities of the layer.</summary>
        /// <param name="options" type="Object" optional="true">If the layer supports ownership based access control, use the options to determine if the specified user can edit features. Ownership based access control requires ArcGIS Server services version 10.1 or greater. &#60;graphic&#62; feature Check to see if the specified feature can be edited by the specified user. &#60;string&#62; userId The name of the currently logged in user. If the application uses the IdentityManager the IdentityManager supplies the layer with the userId so this parameter is not required. </param>
        /// <return type="Object">Object</return>
    },
    getEditInfo: function (feature,options) {
        /// <summary>Returns an object describing the most recent edit operation performed on the given feature, if available</summary>
        /// <param name="feature" type="Feature" optional="false">The feature to get the edit info for.</param>
        /// <param name="options" type="Object" optional="true">The options object may have the following properties: &#60;String&#62; action By default, the method returns a summary of the most recent edit performed on the feature. Use this option to override this behavior. 'creation' indicates creation summary is desired. 'edit' indicates edit summary is desired. </param>
        /// <return type="Object or Undefined">Object or Undefined</return>
    },
    getEditSummary: function (feature,options) {
        /// <summary>Returns a localized summary of the last edit operation performed on the given feature, if available.</summary>
        /// <param name="feature" type="Feature" optional="false">The feature to get the edit summary for.</param>
        /// <param name="options" type="Object" optional="true">The options object may have the following properties: &#60;String&#62; action By default, the method returns a summary of the most recent edit performed on the feature. Use this option to override this behavior. 'creation' indicates creation summary is desired. 'edit' indicates edit summary is desired. &#60;Function&#62; callback If you want to customize or override certain components of the summary, provide a callback function using this option. For example: featureLayer.getEditSummary(feature, { callback: function(feature, info) { if (info && info.userId) { info.userId = "&#60;a href='http://users.my.org/profile/" + info.userId + "'&#62;" + info.userId + "&#60;/a&#62;"; } return info; }}); </param>
        /// <return type="String">String</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getMaxAllowableOffset: function () {
        /// <summary>Returns the current value of the maxAllowableOffset used by the layer.</summary>
        /// <return type="Number">Number</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    getOrderByFields: function () {
        /// <summary>Returns the list of fields used to order features by.</summary>
        /// <return type="String[]">String[]</return>
    },
    getSelectedFeatures: function () {
        /// <summary>Gets the currently selected features</summary>
        /// <return type="Graphic[]">Graphic[]</return>
    },
    getSelectionSymbol: function () {
        /// <summary>Gets the current selection symbol</summary>
        /// <return type="Symbol">Symbol</return>
    },
    getTimeDefinition: function () {
        /// <summary>Get the current time definition applied to the feature layer</summary>
        /// <return type="TimeExtent">TimeExtent</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isEditable: function () {
        /// <summary>Returns true if the FeatureLayer is editable.</summary>
        /// <return type="Boolean">Boolean</return>
    },
    isVisibleAtScale: function (scale,scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    queryAttachmentInfos: function (objectId,callback,errback) {
        /// <summary>Query for information about attachments associated with the specified ObjectIds</summary>
        /// <param name="objectId" type="Number" optional="false">The ObjectId for the feature to query for attachment information.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryCount: function (query,callback,errback) {
        /// <summary>Get a count of the number of features that satisfy the input query.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryFeatures: function (query,callback,errback) {
        /// <summary>Query features from the feature layer.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used. As of version 3.5 the returnGeometry value is honored.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryIds: function (query,callback,errback) {
        /// <summary>Query for ObjectIds.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    queryRelatedFeatures: function (relQuery,callback,errback) {
        /// <summary>Query features or records, from another layer or table, related to features in this layer</summary>
        /// <param name="relQuery" type="RelationshipQuery" optional="false">The input query.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    redraw: function () {
        /// <summary>Redraws all the graphics in the graphics layer.</summary>
    },
    refresh: function () {
        /// <summary>Refreshes the features in the feature layer.</summary>
    },
    remove: function (graphic) {
        /// <summary>Removes a graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to remove.</param>
        /// <return type="Graphic">Graphic</return>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    selectFeatures: function (query,selectionMethod,callback,errback) {
        /// <summary>Selects features from the FeatureLayer.</summary>
        /// <param name="query" type="Query" optional="false">The input query. The query object has the following restrictions to avoid conflicts between layer and map properties.outFields specified by the query object are overridden by the outFields specified in the FeatureLayer constructor.The returnGeometry value specified by the query object is ignored and true is used.The outSpatialReference set by the query object is ignored and the map's spatial reference is used.</param>
        /// <param name="selectionMethod" type="Number" optional="true">The selection method defines how the restful of the selection is combined with the existing selection. See Constants table for valid values. The default option is to create a new selection.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onSelectionComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    setAutoGeneralize: function (enable) {
        /// <summary>Enable or disable auto generalization for the layer.</summary>
        /// <param name="enable" type="Boolean" optional="false">When true, auto generalize is enabled. Default value for non-editable on-demand feature layers is true.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setDefinitionExpression: function (expression) {
        /// <summary>Set's the definition expression for the FeatureLayer.</summary>
        /// <param name="expression" type="String" optional="false">The definition expression to apply. For example, "TYPE='Park'"</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setEditable: function (editable) {
        /// <summary>Set the editability of feature layers created from a feature collection.</summary>
        /// <param name="editable" type="Boolean" optional="false">When true, the layer will be set as editable.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setGDBVersion: function (versionName) {
        /// <summary>Set the layer's data source to the specified geodatabase version.</summary>
        /// <param name="versionName" type="String" optional="false">The name of the geodatabase version to use as the layer's data source.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setInfoTemplate: function (infoTemplate,infoTemplate) {
        /// <summary>Specify or change the info template for a layer</summary>
        /// <param name="infoTemplate" type="InfoTemplate" optional="false">The new info template.</param>
        /// <param name="infoTemplate" type="InfoTemplate" optional="false">The new info template.</param>
    },
    setMaxAllowableOffset: function (offset) {
        /// <summary>Sets the maximum allowable offset used when generalizing geometries</summary>
        /// <param name="offset" type="Number" optional="false">The maximum allowable offset.</param>
    },
    setMaxScale: function (scale,scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale,scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function (opacity,opacity) {
        /// <summary>Initial opacity or transparency of layer.</summary>
        /// <param name="opacity" type="Number" optional="false">Value from 0 to 1, where 0 is 100% transparent and 1 has no transparency. The default value is 1.</param>
        /// <param name="opacity" type="Number" optional="false">Value from 0 to 1, where 0 is 100% transparent and 1 has no transparency. The default value is 1.</param>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setRenderer: function (renderer,renderer) {
        /// <summary>Set the renderer for the feature layer</summary>
        /// <param name="renderer" type="Renderer" optional="false">The renderer to apply to the feature layer</param>
        /// <param name="renderer" type="Renderer" optional="false">The renderer used for the graphic.</param>
    },
    setScaleRange: function (minScale,minScale,maxScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale for the layer. If the map is zoomed out beyond the specified scale the layer will not be visible. A value of 0 means the layer does not have a minimum scale.</param>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale for the layer. If the map is zoomed out beyond the specified scale the layer will not be visible. A value of 0 means the layer does not have a maximum scale.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setSelectionSymbol: function (symbol) {
        /// <summary>Set's the selection symbol for the feature layer.</summary>
        /// <param name="symbol" type="Symbol" optional="false">Symbol for the current selection. Make sure the symbol type is appropriate for the geometry type of the layer.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setTimeDefinition: function (definition) {
        /// <summary>Set's the time definition for the feature layer.</summary>
        /// <param name="definition" type="TimeExtent" optional="false">The new time extent used to filter the layer.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setTimeOffset: function (offsetValue,offsetUnits) {
        /// <summary>Time offset allows you to display the features at a different time so they can be overlaid on top of previous or future time periods.</summary>
        /// <param name="offsetValue" type="Number" optional="false">The length of time to offset from "this" time. Specify a positive or negative whole number.</param>
        /// <param name="offsetUnits" type="String" optional="false">Units in which the offset is specified. See the TimeInfo constants for valid values.</param>
        /// <return type="FeatureLayer">FeatureLayer</return>
    },
    setUseMapTime: function (update) {
        /// <summary>Determine if the layer will update its content based on the map's current time extent.</summary>
        /// <param name="update" type="Boolean" optional="false">When false the layer will not update its content based on the map's time extent. Default value is true.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the layer.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.TableDataSource = function (json) {
    /// <summary>Creates a new TableDataSource object</summary>
    /// <param name="json" type="Object" optional="true">JSON object representing the TableDataSource.</param>
    /// <field name="dataSourceName" type="String">The name of a table, feature class or raster that resides in the registered workspace</field>
    /// <field name="gdbVersion" type="String">For versioned SDE workspaces, use this property to point to an alternate version.</field>
    /// <field name="workspaceId" type="String">The workspace id for the registered file geodatabase, SDE or Shapefile workspace</field>
};

esri.layers.TableDataSource.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.TileInfo = function (properties) {
    /// <summary>Creates a new object describing the given tiling scheme.</summary>
    /// <param name="properties" type="Object" optional="false">Properties describing the tiling scheme.</param>
    /// <field name="dpi" type="Number">The dpi of the tiling scheme</field>
    /// <field name="format" type="String">Image format of the cached tiles.</field>
    /// <field name="height" type="Number">Height of each tile in pixels</field>
    /// <field name="lods" type="LOD[]">An array of levels of detail that define the tiling scheme</field>
    /// <field name="origin" type="Point">The tiling scheme origin</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the tiling schema.</field>
    /// <field name="width" type="Number">Width of each tile in pixels</field>
};

esri.layers.TileInfo.prototype = 
{
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.layers.TiledMapServiceLayer = function () {
    /// <summary>Creates a new TiledMapServiceLayer object</summary>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="fullExtent" type="Extent">Full extent as defined by the map service</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="initialExtent" type="Extent">Initial extent as defined by the map service</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map service.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="tileInfo" type="TileInfo">Returns TileInfo, which has information on the tiling schema</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.layers.TiledMapServiceLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    getTileUrl: function (level,row,column) {
        /// <summary>Method to implement when extending TiledMapServiceLayer.</summary>
        /// <param name="level" type="Number" optional="false">Requested tile's level.</param>
        /// <param name="row" type="Number" optional="false">Requested tile's row.</param>
        /// <param name="column" type="Number" optional="false">Requested tile's column.</param>
        /// <return type="String">String</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    refresh: function () {
        /// <summary>Reloads all the tiles in the current view</summary>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};

esri.layers.TimeInfo = function () {

    /// <field name="endTimeField" type="String">The name of the attribute field that contains the end time information</field>
    /// <field name="exportOptions" type="LayerTimeOptions">Default time-related export options for the layer.</field>
    /// <field name="startTimeField" type="String">The name of the attribute field that contains the start time information</field>
    /// <field name="timeExtent" type="TimeExtent">The time extent for all the data in the layer</field>
    /// <field name="timeInterval" type="Number">Time interval of the data in the layer.</field>
    /// <field name="timeIntervalUnits" type="String">Temporal unit in which the time interval is measured.</field>
    /// <field name="timeReference" type="TimeReference">Information about how the time was measured</field>
    /// <field name="trackIdField" type="String">The field that contains the trackId</field>
};

esri.layers.TimeReference = function () {

    /// <field name="respectsDaylightSaving" type="Boolean">Indicates whether the time reference respects daylight savings time.</field>
    /// <field name="timeZone" type="String">The time zone information associated with the time reference</field>
};

esri.layers.WMSLayer = function (url,options) {
    /// <summary>Creates a new WMSLayer object</summary>
    /// <param name="url" type="String" optional="false">URL to the OGC Web Map Service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; format&#10;
    /// &#60;Object&#62; resourceInfo&#10;
    /// &#60;Boolean&#62; transparent&#10;
    /// &#60;String[]&#62; visibleLayers</param>
    /// <field name="copyright" type="String">Copyright of the WMS service.</field>
    /// <field name="description" type="String">Description of the WMS service.</field>
    /// <field name="extent" type="Extent">Extent of the WMS service</field>
    /// <field name="getMapUrl" type="String">The URL for the WMS GetMap call</field>
    /// <field name="imageFormat" type="String">The map image format</field>
    /// <field name="layerInfos" type="WMSLayerInfo[]">List of layers in the WMS service</field>
    /// <field name="maxHeight" type="Number">Maximum height in pixels the WMS service supports</field>
    /// <field name="maxWidth" type="Number">Maximum width in pixels the WMS service supports</field>
    /// <field name="spatialReference" type="SpatialReference">Spatial reference of the WMS service</field>
    /// <field name="title" type="String">Title of the WMS service</field>
    /// <field name="version" type="String">Version of the WMS service.</field>
};

esri.layers.WMSLayer.prototype = 
{
    setImageFormat: function (format) {
        /// <summary>Set the map image format, valid values are "png","jpg","pdf","bmp","gif" and "svg"</summary>
        /// <param name="format" type="String" optional="false">The image format.</param>
    },
    setImageTransparency: function (transparency) {
        /// <summary>Specify whether the background image is transparent.</summary>
        /// <param name="transparency" type="Boolean" optional="false">When true the background image is transparent.</param>
    },
    setVisibleLayers: function (layers) {
        /// <summary>Specify a list of layer names to updates the visible layers</summary>
        /// <param name="layers" type="String[]" optional="false">An array of layer ids.</param>
    },
};

esri.layers.WMSLayerInfo = function (layer) {
    /// <summary>Creates a new WMSLayerInfo object</summary>
    /// <param name="layer" type="Object" optional="false">WMSLayerInfo layer object.An object with the following properties, title is required the rest of the properties are optional.{ &#60;String&#62; name, &#60;String&#62; title, &#60;String&#62; description, &#60;esri/geometry/Extent&#62; extent}</param>
    /// <field name="description" type="String">The layer description defines the value of the Abstract capabilities property</field>
    /// <field name="extent" type="Extent">The layer extent</field>
    /// <field name="name" type="String">The layer name.</field>
    /// <field name="title" type="String">The layer title</field>
};

esri.layers.WMTSLayer = function (url,options) {
    /// <summary>Creates a new WMTSLayer object</summary>
    /// <param name="url" type="String" optional="false">The url for the WMTS endpoint.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;WMTSLayerInfo&#62; layerInfo&#10;
    /// &#60;Boolean&#62; resampling&#10;
    /// &#60;Number&#62; resamplingTolerance&#10;
    /// &#60;Object&#62; resourceInfo&#10;
    /// &#60;String&#62; serviceMode</param>
    /// <field name="copyright" type="String">Copyright information for the service.</field>
    /// <field name="description" type="String">The description of the active layer if specified in the capabilties file or the resource info</field>
    /// <field name="format" type="String">The tile format</field>
    /// <field name="fullExtent" type="Extent">The full extent of the active layer</field>
    /// <field name="initialExtent" type="Extent">The initial extent of the active layer</field>
    /// <field name="layerInfos" type="Object[]">An array of WMTSLayerInfo objects</field>
    /// <field name="serviceMode" type="String">The service mode for the WMTS layer</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference for the WMTS service</field>
    /// <field name="tileInfo" type="Object">The tile info for the active layer</field>
    /// <field name="title" type="String">Title of the WMTS service</field>
    /// <field name="version" type="String">Version of the WMTS service</field>
};

esri.layers.WMTSLayer.prototype = 
{
    setActiveLayer: function (WMTSLayerInfo) {
        /// <summary>Set the active layer for the WMTS service.</summary>
        /// <param name="WMTSLayerInfo" type="WMTSLayerInfo" optional="false">The WMTSLayerInfo for the layer to make active.</param>
    },
};

esri.layers.WMTSLayerInfo = function (options) {
    /// <summary>Creates a new WMTSLayerInfo object</summary>
    /// <param name="options" type="Object" optional="false">An object that defines the layer info options. View the options list for the properties.&#10;
    /// &#60;String&#62; description&#10;
    /// &#60;String&#62; format&#10;
    /// &#60;Extent&#62; fullExtent&#10;
    /// &#60;String&#62; identifier&#10;
    /// &#60;Extent&#62; initialExtent&#10;
    /// &#60;String&#62; style&#10;
    /// &#60;TileInfo&#62; tileInfo&#10;
    /// &#60;String&#62; tileMatrixSet&#10;
    /// &#60;String&#62; title</param>
};

esri.layers.WebTiledLayer = function (urlTemplate,options) {
    /// <summary>Creates a new WebTiledLayer.</summary>
    /// <param name="urlTemplate" type="String" optional="false">The url template to retrieve the tiles. The url template follows a pattern of http://some.domain.com/${Z}/${X}/${Y}/ where Z corresponds to a zoom level, and X and Y represent tile column and row, respectively.</param>
    /// <param name="options" type="Object" optional="false">Optional parameters. See options list.&#10;
    /// &#60;String&#62; copyright&#10;
    /// &#60;Extent&#62; fullExtent&#10;
    /// &#60;Extent&#62; initialExtent&#10;
    /// &#60;Boolean&#62; resampling&#10;
    /// &#60;Number&#62; resamplingTolerance&#10;
    /// &#60;String[]&#62; subDomains&#10;
    /// &#60;TileInfo&#62; tileInfo&#10;
    /// &#60;String[]&#62; tileServers</param>
    /// <field name="copyright" type="String">The attribution information for the layer</field>
    /// <field name="fullExtent" type="Extent">The full extent of the layer</field>
    /// <field name="initialExtent" type="Extent">The initial extent of the layer</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the layer</field>
    /// <field name="tileInfo" type="TileInfo">Define the tile info for the layer including lods, rows, cols, origin and spatial reference.</field>
    /// <field name="tileServers" type="[String]">The tile server names for the layer</field>
};

esri.renderer = function () {
    /// <summary>The esri.renderer namespace.</summary>
};

esri.renderer.ClassBreaksRenderer = function (defaultSymbol,attributeField) {
    /// <summary>Creates a new ClassBreaksRenderer object</summary>
    /// <param name="defaultSymbol" type="Symbol" optional="true">Default symbol for the renderer. This symbol is used for unmatched values.</param>
    /// <param name="attributeField" type="String" optional="false">Specify either the attribute field the renderer uses to match values or starting at version 3.3 a function that returns a value to be compared against class breaks. If a function is specified the renderer will call this function once for every graphic drawn on the map. This can be used in cases where you want class breaks to be compared against a computed value that is not available via the attribute fields.At version 3.0, the Class Breaks renderer can be used to render feature layer tracks. Specify the layer's trackIdField as the attributeField.</param>
    /// <field name="attributeField" type="String">Attribute field renderer uses to match values.</field>
    /// <field name="backgroundFillSymbol" type="FillSymbol">To symbolize polygon features with graduated symbols, use backgroundFillSymbol to specify a simple fill symbol to represent polygon features, and use marker symbols of varying sizes in class breaks to indicate the quantity</field>
    /// <field name="breaks" type="Object[]">Deprecated at v2.0, use infos instead.</field>
    /// <field name="classificationMethod" type="String">The classification method used to generate class breaks.</field>
    /// <field name="colorInfo" type="Object">An object defining a color ramp used to render the layer.</field>
    /// <field name="defaultSymbol" type="Symbol">Default symbol used when a value or break cannot be matched</field>
    /// <field name="infos" type="Object[]">Each element in the array is an object that provides information about the class breaks associated with the renderer.</field>
    /// <field name="normalizationField" type="String"> When normalizationType is "field", this property contains the attribute field name used for normalization.</field>
    /// <field name="normalizationTotal" type="Number"> When normalizationType is "percent-of-total", this property contains the total of all data values.</field>
    /// <field name="normalizationType" type="String">Indicates how the data is normalized.</field>
    /// <field name="proportionalSymbol" type="Object">Defines the proportional symbol rendering where feature size is proportional to data value.</field>
    /// <field name="rotationInfo" type="Object">Defines how marker symbols are rotated.</field>
};

esri.renderer.ClassBreaksRenderer.prototype = 
{
    addBreak: function (minValue_or_info,maxValue,symbol) {
        /// <summary>Adds a class break.</summary>
        /// <param name="minValue_or_info" type="Number" optional="false">The value can be provided as individual arguments or as an info object with the following properties: &#60;Number&#62; minValue The minimum value. &#60;Number&#62; maxValue The maximum value. &#60;Symbol&#62; symbol The symbol used to display the value. &#60;String&#62; label Label for the symbol used to draw the value. &#60;String&#62; description Label for the symbol used to draw the value. </param>
        /// <param name="maxValue" type="Number" optional="true">Maximum value in the break.</param>
        /// <param name="symbol" type="Symbol" optional="true">Symbol used for the break.</param>
    },
    clearBreaks: function () {
        /// <summary>Remove all existing class breaks for this renderer</summary>
    },
    getBreakIndex: function (graphic) {
        /// <summary>Returns the index at which rendering and legend information can be found in the break infos array for the given graphic.</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic whose rendering and legend information index in the break infos array will be returned.</param>
        /// <return type="Number">Number</return>
    },
    getBreakInfo: function (graphic) {
        /// <summary>Returns rendering and legend information (as defined by the renderer) associated with the given graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic whose rendering and legend information will be returned.</param>
        /// <return type="Object">Object</return>
    },
    getColor: function (graphic) {
        /// <summary>Gets the color for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to get color from.</param>
        /// <return type="dojo.Color">dojo.Color</return>
    },
    getRotationAngle: function (graphic) {
        /// <summary>Returns the angle of rotation (in degrees) for the graphic calculated using rotationInfo.</summary>
        /// <param name="graphic" type="Graphic" optional="false">An input graphic for which you want to get the angle of rotation.</param>
        /// <return type="Number">Number</return>
    },
    getSize: function (graphic) {
        /// <summary>Return the symbol size (in pixels) for the graphic, calculated using proportionalSymbolInfo</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic for which you want to calculate the symbol size. </param>
        /// <return type="Number">Number</return>
    },
    getSymbol: function (graphic) {
        /// <summary>Gets the symbol for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to symbolize. Used when creating a custom renderer.</param>
        /// <return type="Symbol">Symbol</return>
    },
    removeBreak: function (minValue,maxValue) {
        /// <summary>Removes a break.</summary>
        /// <param name="minValue" type="Number" optional="false">Minimum value in the break to remove.</param>
        /// <param name="maxValue" type="Number" optional="false">Maximum value in the break to remove.</param>
    },
    setColorInfo: function (info) {
        /// <summary>Sets the colorInfo property</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the color. It has the same properties as colorInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    setMaxInclusive: function (enable) {
        /// <summary>By default, a graphic or feature is considered a match for a class break if the graphic's attribute value is greater than or equal to its min value and less than its max value.Use this method to modify the behavior so that a class break is considered a match even if the attribute value is equal to its max value</summary>
        /// <param name="enable" type="Boolean" optional="false">Set true to enable the max inclusive behavior.</param>
    },
    setProportionalSymbolInfo: function (info) {
        /// <summary>Modify proportional symbol info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the proportional symbol. The info argument has the same properties as proportionalSymbolInfo. </param>
        /// <return type="Renderer">Renderer</return>
    },
    setRotationInfo: function (info) {
        /// <summary>Modifies rotation info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An object with the same properties as rotationInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.renderer.DotDensityRenderer = function (parameters) {
    /// <summary>Creates a new instance of dot density renderer</summary>
    /// <param name="parameters" type="Object" optional="false">An object with various options. Refer to the options table for details.</param>
    /// <field name="backgroundColor" type="dojo.Color">The color to be used for the background of the symbol.</field>
    /// <field name="dotShape" type="String">The shape to be used for the dot</field>
    /// <field name="dotSize" type="Number">The size of the dot in pixels</field>
    /// <field name="dotValue" type="Number">The value that a dot represents</field>
    /// <field name="fields" type="Object[]">An array of objects, where each object defines a field to be mapped and its color.</field>
    /// <field name="outline" type="LineSymbol">The line symbol to use on the outline of the feature.</field>
};

esri.renderer.DotDensityRenderer.prototype = 
{
    setBackgroundColor: function (color) {
        /// <summary>Updates the background color of the shape.</summary>
        /// <param name="color" type="dojo.Color" optional="false">Background color.</param>
    },
    setDotSize: function (size) {
        /// <summary>Updates the size of the dot.</summary>
        /// <param name="size" type="Number" optional="false">The size of the dot in pixels.</param>
    },
    setDotValue: function (value) {
        /// <summary>Updates the value that a dot represents.</summary>
        /// <param name="value" type="Number" optional="false">The value that a dot represents.</param>
    },
    setOutline: function (outline) {
        /// <summary>Updates the outline symbol of the shape.</summary>
        /// <param name="outline" type="LineSymbol" optional="false">The line symbol to use on the outline of the feature.</param>
    },
};

esri.renderer.Renderer = function () {

    /// <field name="colorInfo" type="Object">An object defining a color ramp used to render the layer.</field>
    /// <field name="defaultSymbol" type="Symbol">Default symbol used when a value or break cannot be matched</field>
    /// <field name="proportionalSymbol" type="Object">Defines the proportional symbol rendering where feature size is proportional to data value.</field>
    /// <field name="rotationInfo" type="Object">Defines how marker symbols are rotated.</field>
};

esri.renderer.Renderer.prototype = 
{
    getColor: function (graphic) {
        /// <summary>Gets the color for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to get color from.</param>
        /// <return type="dojo.Color">dojo.Color</return>
    },
    getRotationAngle: function (graphic) {
        /// <summary>Returns the angle of rotation (in degrees) for the graphic calculated using rotationInfo.</summary>
        /// <param name="graphic" type="Graphic" optional="false">An input graphic for which you want to get the angle of rotation.</param>
        /// <return type="Number">Number</return>
    },
    getSize: function (graphic) {
        /// <summary>Return the symbol size (in pixels) for the graphic, calculated using proportionalSymbolInfo</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic for which you want to calculate the symbol size. </param>
        /// <return type="Number">Number</return>
    },
    getSymbol: function (graphic) {
        /// <summary>Gets the symbol for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to symbolize. Used when creating a custom renderer.</param>
        /// <return type="Symbol">Symbol</return>
    },
    setColorInfo: function (info) {
        /// <summary>Sets the colorInfo property</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the color. It has the same properties as colorInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    setProportionalSymbolInfo: function (info) {
        /// <summary>Modify proportional symbol info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the proportional symbol. The info argument has the same properties as proportionalSymbolInfo. </param>
        /// <return type="Renderer">Renderer</return>
    },
    setRotationInfo: function (info) {
        /// <summary>Modifies rotation info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An object with the same properties as rotationInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.renderer.ScaleDependentRenderer = function (params) {
    /// <summary>Create a ScaleDependentRenderer</summary>
    /// <param name="params" type="Object" optional="false">Various parameters to configure this dijit. See the list below for details.&#10;
    /// &#60;Object[]&#62; rendererInfos</param>
    /// <field name="rangeType" type="String">Indicates whether rendererInfos uses zoom range or scale range.</field>
    /// <field name="rendererInfos" type="Object">An array of objects, where each object defines a renderer and the zoom/scale range to which it applies.</field>
};

esri.renderer.ScaleDependentRenderer.prototype = 
{
    addRendererInfo: function (info) {
        /// <summary>Adds the specified renderer info to the array of existing renderers.</summary>
        /// <param name="info" type="Object" optional="false">An object as defined in the rendererInfos property. </param>
        /// <return type="ScaleDependentRenderer">ScaleDependentRenderer</return>
    },
    getRenderInfoByZoom: function (zoom) {
        /// <summary>Returns the rendererInfo for the specified zoom level</summary>
        /// <param name="zoom" type="Number" optional="false">Specify the zoom level for which you want to retrieve the renderer info. </param>
        /// <return type="Object">Object</return>
    },
    getRendererInfo: function (graphic) {
        /// <summary>Returns the renderer info for the input graphic.</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic for which you want to get renderer info. </param>
        /// <return type="Object">Object</return>
    },
    getRendererInfoByScale: function (scale) {
        /// <summary>Returns the renderer info for the specified scale.</summary>
        /// <param name="scale" type="Number" optional="false">Returns the renderer info for the specified scale.</param>
        /// <return type="Object">Object</return>
    },
    setRendererInfos: function (infos) {
        /// <summary>Replaces existing rendererInfos with new ones.</summary>
        /// <param name="infos" type="Object" optional="false">An array of objects as defined in the rendererInfos property. </param>
        /// <return type="ScaleDependentRenderer">ScaleDependentRenderer</return>
    },
};

esri.renderer.SimpleRenderer = function (defaultSymbol) {
    /// <summary>Creates a new SimpleRenderer object with a Symbol parameter</summary>
    /// <param name="defaultSymbol" type="Symbol" optional="false">Symbol to use for the renderer.</param>
    /// <field name="colorInfo" type="Object">An object defining a color ramp used to render the layer.</field>
    /// <field name="defaultSymbol" type="Symbol">Default symbol used when a value or break cannot be matched</field>
    /// <field name="description" type="String">Description for the renderer</field>
    /// <field name="label" type="String">Label for the renderer</field>
    /// <field name="proportionalSymbol" type="Object">Defines the proportional symbol rendering where feature size is proportional to data value.</field>
    /// <field name="rotationInfo" type="Object">Defines how marker symbols are rotated.</field>
    /// <field name="symbol" type="Symbol">The symbol for the renderer</field>
};

esri.renderer.SimpleRenderer.prototype = 
{
    getColor: function (graphic) {
        /// <summary>Gets the color for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to get color from.</param>
        /// <return type="dojo.Color">dojo.Color</return>
    },
    getRotationAngle: function (graphic) {
        /// <summary>Returns the angle of rotation (in degrees) for the graphic calculated using rotationInfo.</summary>
        /// <param name="graphic" type="Graphic" optional="false">An input graphic for which you want to get the angle of rotation.</param>
        /// <return type="Number">Number</return>
    },
    getSize: function (graphic) {
        /// <summary>Return the symbol size (in pixels) for the graphic, calculated using proportionalSymbolInfo</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic for which you want to calculate the symbol size. </param>
        /// <return type="Number">Number</return>
    },
    getSymbol: function (graphic) {
        /// <summary>Gets the symbol for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to symbolize. Used when creating a custom renderer.</param>
        /// <return type="Symbol">Symbol</return>
    },
    setColorInfo: function (info) {
        /// <summary>Sets the colorInfo property</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the color. It has the same properties as colorInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    setProportionalSymbolInfo: function (info) {
        /// <summary>Modify proportional symbol info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the proportional symbol. The info argument has the same properties as proportionalSymbolInfo. </param>
        /// <return type="Renderer">Renderer</return>
    },
    setRotationInfo: function (info) {
        /// <summary>Modifies rotation info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An object with the same properties as rotationInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.renderer.SymbolAger = function () {

};

esri.renderer.SymbolAger.prototype = 
{
    getAgedSymbol: function (symbol,graphic) {
        /// <summary>All subclasses override this method to provide their own implementation to calculate aging and return the appropriate symbol</summary>
        /// <param name="symbol" type="Symbol" optional="false">The symbol to age.</param>
        /// <param name="graphic" type="Graphic" optional="false">Feature being rendered.</param>
        /// <return type="Symbol">Symbol</return>
    },
};

esri.renderer.TemporalRenderer = function (observationRenderer,latestObservationRenderer,trackRenderer,observationAger) {
    /// <summary>Creates a new TemporalRenderer object that can be used with a time-aware feature layer</summary>
    /// <param name="observationRenderer" type="Renderer" optional="false">Renderer for regular/historic observations.</param>
    /// <param name="latestObservationRenderer" type="Renderer" optional="true">Renderer for the most current observations.In the snippet below RouteID is the field that contains the trackID for the feature layer this is used to display the latest observation for the specified tracks.require([ "esri/renderers/UniqueValueRenderer", "esri/symbols/PictureMarkerSymbol", ... ], function(UniqueValueRenderer, PictureMarkerSymbol, ... ) { var latestObservationRenderer = new UniqueValueRenderer(defaultSymbol, "RouteID"); latestObservationRenderer.addValue(1,new PictureMarkerSymbol('images/runnergreen.png',20,20)); latestObservationRenderer.addValue(2,new PictureMarkerSymbol('images/runnerblue.png',20,20)); latestObservationRenderer.addValue(3,new PictureMarkerSymbol('images/runnerred.png',20,20)); ...});</param>
    /// <param name="trackRenderer" type="Renderer" optional="true">Renderer for the tracks. A track is a collection of events that share a common track ID. A track line is a graphic line that connects the observations. Applicable only for feature layers with a valid trackIdField.require([ "esri/renderers/SimpleRenderer", ... ], function(SimpleRenderer, ... ) { var trackRenderer = new SimpleRenderer(myLineSymbol); ...});</param>
    /// <param name="observationAger" type="SymbolAger" optional="true">Symbol ager for regular observations.require([ "esri/renderers/TimeClassBreaksAger", "dojo/_base/Color", ... ], function(TimeClassBreaksAger, Color, ... ) { var infos = [ { minAge: 0, maxAge: 1, color: new Color([255, 0, 0]) }, { minAge: 1, maxAge: 5, color: new Color([255, 153, 0]) }, { minAge: 5, maxAge: 10, color: new Color([255, 204, 0]) }, { minAge: 10, maxAge: Infinity, color: new Color([0, 0, 0, 0]) } ]; var ager = new TimeClassBreaksAger(infos, TimeClassBreaksAger.UNIT_MINUTES); ...});</param>
};

esri.renderer.TemporalRenderer.prototype = 
{
    getSymbol: function (graphic) {
        /// <summary>Returns the symbol used to render the graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The input graphic.</param>
        /// <return type="Symbol">Symbol</return>
    },
};

esri.renderer.TimeClassBreaksAger = function (infos) {
    /// <summary>Creates a new TimeClassBreaksAgerObject with the specified time breaks inforamtion</summary>
    /// <param name="infos" type="Object[]" optional="false">Each element in the array is an object that describes the class breaks information. Each break info can specify a color, size or both. The features age is calculated with respect to the map's time extent end time. The object has the following properties: &#60;Number&#62; minAge The minimum age for the break info. &#60;Number&#62; maxAge The maximum age for the break info. &#60;dojo.Color&#62; color The color for the break. &#60;Number&#62; size The size for the break. &#60;Number&#62; alpha The alpha opacity for the break. Valid values are between 0 and 1. As of v2.8 </param>
};

esri.renderer.TimeClassBreaksAger.prototype = 
{
    getAgedSymbol: function (symbol,graphic) {
        /// <summary>Calculates aging and returns the appropriate symbol.</summary>
        /// <param name="symbol" type="Symbol" optional="false">The symbol to age.</param>
        /// <param name="graphic" type="Graphic" optional="false">Feature being rendered.</param>
        /// <return type="Symbol">Symbol</return>
    },
};

esri.renderer.TimeRampAger = function (colorRange,sizeRange,alphaRange) {
    /// <summary>Creates a new TimeRampAger object with the specified color and size ranges</summary>
    /// <param name="colorRange" type="dojo.Color" optional="true">An array containing the minimum and maximum color values the default is:[ new dojo.Color([0,0,0,0.1]), new dojo.Color([0,0,255,1]) ] New features will be close to the max value and older ones will be closer to the minimum value.</param>
    /// <param name="sizeRange" type="Number[]" optional="true">An array containing the minimum and maximum size in pixels. The default value is [2,10]Newer features will be close to the max value and older ones will be close to the min value.</param>
    /// <param name="alphaRange" type="Number[]" optional="true">An array containing the minimum and maximum alpha opacity values. Newer features will be close to the max value and older ones close to the min value. As of v2.8</param>
};

esri.renderer.TimeRampAger.prototype = 
{
    getAgedSymbol: function (symbol,graphic) {
        /// <summary>Calculates aging and returns the appropriate symbol.</summary>
        /// <param name="symbol" type="Symbol" optional="false">The symbol to age.</param>
        /// <param name="graphic" type="Graphic" optional="false">Feature being rendered.</param>
        /// <return type="Symbol">Symbol</return>
    },
};

esri.renderer.UniqueValueRenderer = function (defaultSymbol,attributeField,attributeField2,attributeField3,fieldDelimeter) {
    /// <summary>Creates a new UniqueValueRenderer object.</summary>
    /// <param name="defaultSymbol" type="Symbol" optional="true">Default symbol for the renderer. This symbol is used for unmatched values.</param>
    /// <param name="attributeField" type="String" optional="false">Specify either the attribute field the renderer uses to match values or starting at version 3.3 a function that returns a value to be compared against unique values. If a function is specified the renderer will call this function once for every graphic drawn on the map. This can be used in cases where you want the unique values to be compared against a computed value that is not available via the attribute fields.At version 3.0 the Class Breaks renderer can be used to render feature layer tracks. Specify the layer's trackIdField as the attributeField.</param>
    /// <param name="attributeField2" type="String" optional="true">If needed, specify an additional attribute field the renderer uses to match values.</param>
    /// <param name="attributeField3" type="String" optional="true">If needed, specify an additional attribute field the renderer uses to match values.</param>
    /// <param name="fieldDelimeter" type="String" optional="true">String inserted between the values of different fields. Applicable only when more than one attribute field is specifed for the renderer.</param>
    /// <field name="attributeField" type="String">Attribute field renderer uses to match values.</field>
    /// <field name="attributeField2" type="String">If needed, specify an additional attribute field the renderer uses to match values</field>
    /// <field name="attributeField3" type="String">If needed, specify an additional attribute field the renderer uses to match values</field>
    /// <field name="colorInfo" type="Object">An object defining a color ramp used to render the layer.</field>
    /// <field name="defaultLabel" type="String">Label for the default symbol used to draw unspecified values</field>
    /// <field name="defaultSymbol" type="Symbol">Default symbol used when a value or break cannot be matched</field>
    /// <field name="fieldDelimiter" type="String">String inserted between the values if multiple attribute fields are specified</field>
    /// <field name="infos" type="Object[]">Each element in the array is an object that provides information about the unique values associated with the renderer.</field>
    /// <field name="proportionalSymbol" type="Object">Defines the proportional symbol rendering where feature size is proportional to data value.</field>
    /// <field name="rotationInfo" type="Object">Defines how marker symbols are rotated.</field>
    /// <field name="values" type="String[]">Deprecated at v2.0, use infos instead.</field>
};

esri.renderer.UniqueValueRenderer.prototype = 
{
    addValue: function (value_or_info,symbol) {
        /// <summary>Adds a unique value and symbol.</summary>
        /// <param name="value_or_info" type="String" optional="false">Value to match with. The value can be provided as individual arguments or as an info object with the following properties: &#60;String&#62; value The unique value. &#60;Symbol&#62; symbol The symbol used to display the value. &#60;String&#62; label Label for the symbol used to draw the value. &#60;String&#62; description Label for the symbol used to draw the value. </param>
        /// <param name="symbol" type="Symbol" optional="true">Symbol used for the value.</param>
    },
    getColor: function (graphic) {
        /// <summary>Gets the color for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to get color from.</param>
        /// <return type="dojo.Color">dojo.Color</return>
    },
    getRotationAngle: function (graphic) {
        /// <summary>Returns the angle of rotation (in degrees) for the graphic calculated using rotationInfo.</summary>
        /// <param name="graphic" type="Graphic" optional="false">An input graphic for which you want to get the angle of rotation.</param>
        /// <return type="Number">Number</return>
    },
    getSize: function (graphic) {
        /// <summary>Return the symbol size (in pixels) for the graphic, calculated using proportionalSymbolInfo</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic for which you want to calculate the symbol size. </param>
        /// <return type="Number">Number</return>
    },
    getSymbol: function (graphic) {
        /// <summary>Gets the symbol for the Graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">Graphic to symbolize. Used when creating a custom renderer.</param>
        /// <return type="Symbol">Symbol</return>
    },
    getUniqueValueInfo: function (graphic) {
        /// <summary>Returns rendering and legend information (as defined by the renderer) associated with the given graphic</summary>
        /// <param name="graphic" type="Graphic" optional="false">The graphic whose rendering and legend information will be returned.</param>
        /// <return type="Object">Object</return>
    },
    removeValue: function (value) {
        /// <summary>Removes a unique value.</summary>
        /// <param name="value" type="String" optional="false">Value to remove.</param>
    },
    setColorInfo: function (info) {
        /// <summary>Sets the colorInfo property</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the color. It has the same properties as colorInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    setProportionalSymbolInfo: function (info) {
        /// <summary>Modify proportional symbol info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An info object that defines the proportional symbol. The info argument has the same properties as proportionalSymbolInfo. </param>
        /// <return type="Renderer">Renderer</return>
    },
    setRotationInfo: function (info) {
        /// <summary>Modifies rotation info for the renderer.</summary>
        /// <param name="info" type="Object" optional="false">An object with the same properties as rotationInfo.</param>
        /// <return type="Renderer">Renderer</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};



esri.renderers.fromJson = function (json) {
    /// <summary>Converts the input JSON object to the appropriate esri.renderer.* object</summary>
    /// <param name="json" type="Object" optional="false">The JSON object.</param>
    /// <return type="Object">Object</return>
};

esri.symbol = function () {
    /// <summary>The esri.symbol namespace.</summary>
};

esri.symbol.CartographicLineSymbol = function () {
    /// <summary>Creates a new empty CartographicLineSymbol object</summary>
    /// <field name="cap" type="String">The cap style.</field>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="join" type="String">The join style.</field>
    /// <field name="miterLimit" type="String">Size threshold for showing mitered line joins</field>
    /// <field name="style" type="String">The line style.</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="width" type="Number">Width of line symbol in pixels</field>
};

esri.symbol.CartographicLineSymbol.prototype = 
{
    setCap: function (cap) {
        /// <summary>Sets the cap style</summary>
        /// <param name="cap" type="String" optional="false">Cap style. See the Constants table for valid values.</param>
        /// <return type="CartographicLineSymbol">CartographicLineSymbol</return>
    },
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setJoin: function (join) {
        /// <summary>Sets the join style</summary>
        /// <param name="join" type="String" optional="false">Join style. See the Constants table for valid values.</param>
        /// <return type="CartographicLineSymbol">CartographicLineSymbol</return>
    },
    setMiterLimit: function (miterLimit) {
        /// <summary>Sets the size threshold for showing mitered line joins</summary>
        /// <param name="miterLimit" type="String" optional="false">Miter limit.</param>
        /// <return type="CartographicLineSymbol">CartographicLineSymbol</return>
    },
    setStyle: function (style) {
        /// <summary>Sets the line symbol style</summary>
        /// <param name="style" type="String" optional="false">Line style. See the Constants table for valid values.</param>
        /// <return type="SimpleLineSymbol">SimpleLineSymbol</return>
    },
    setWidth: function (width) {
        /// <summary>Sets the LineSymbol width</summary>
        /// <param name="width" type="Number" optional="false">Width of line symbol in pixels.</param>
        /// <return type="LineSymbol">LineSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.FillSymbol = function () {

    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="outline" type="SimpleLineSymbol">Outline of the polygon</field>
    /// <field name="type" type="String">The type of symbol</field>
};

esri.symbol.FillSymbol.prototype = 
{
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setOutline: function (outline) {
        /// <summary>Sets the outline of the fill symbol</summary>
        /// <param name="outline" type="SimpleLineSymbol" optional="false">Symbol used for outline.</param>
        /// <return type="FillSymbol">FillSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.Font = function () {
    /// <summary>Creates a new Font object.</summary>
    /// <field name="decoration" type="String">Text decoration</field>
    /// <field name="family" type="String">Font family</field>
    /// <field name="size" type="String">Font size.</field>
    /// <field name="style" type="String">Text style.</field>
    /// <field name="variant" type="String">Text variant.</field>
    /// <field name="weight" type="String">Text weight.</field>
};

esri.symbol.Font.prototype = 
{
    setDecoration: function (decoration) {
        /// <summary>Updates the font with the given decoration</summary>
        /// <param name="decoration" type="String" optional="false">Text decoration. See decoration property for the list of supported decorations.</param>
        /// <return type="Font">Font</return>
    },
    setFamily: function () {
        /// <summary>Sets the font family.</summary>
        /// <return type="Font">Font</return>
    },
    setSize: function () {
        /// <summary>Sets the font size</summary>
        /// <return type="Font">Font</return>
    },
    setStyle: function () {
        /// <summary>Sets the font style</summary>
        /// <return type="Font">Font</return>
    },
    setVariant: function () {
        /// <summary>Sets the font variant</summary>
        /// <return type="Font">Font</return>
    },
    setWeight: function () {
        /// <summary>Sets the font weight</summary>
        /// <return type="Font">Font</return>
    },
};

esri.symbol.LineSymbol = function () {

    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="width" type="Number">Width of line symbol in pixels</field>
};

esri.symbol.LineSymbol.prototype = 
{
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setWidth: function (width) {
        /// <summary>Sets the LineSymbol width</summary>
        /// <param name="width" type="Number" optional="false">Width of line symbol in pixels.</param>
        /// <return type="LineSymbol">LineSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.MarkerSymbol = function () {

    /// <field name="angle" type="Number">The angle of the marker</field>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="size" type="Number">Size of the marker in pixels</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="xoffset" type="Number">The offset on the x-axis in pixels</field>
    /// <field name="yoffset" type="Number">The offset on the y-axis in pixels</field>
};

esri.symbol.MarkerSymbol.prototype = 
{
    setAngle: function (angle) {
        /// <summary>Rotates the symbol clockwise around its center by the specified angle</summary>
        /// <param name="angle" type="Number" optional="false">The angle value. 0 is pointing right and values progress clockwise.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setOffset: function (x,y) {
        /// <summary>Sets the x and y offset of a marker in screen units</summary>
        /// <param name="x" type="Number" optional="false">The X offset value in pixels.</param>
        /// <param name="y" type="Number" optional="false">The Y offset value in pixels.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setSize: function (size) {
        /// <summary>Sets the size of a marker in pixels</summary>
        /// <param name="size" type="Number" optional="false">The width of the symbol in pixels.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.PictureFillSymbol = function (url,outline,width,height) {
    /// <summary>Creates a new PictureFillSymbol object</summary>
    /// <param name="url" type="String" optional="false">URL of the image.</param>
    /// <param name="outline" type="SimpleLineSymbol" optional="false">Outline of the symbol.</param>
    /// <param name="width" type="Number" optional="false">Width of the image in pixels.</param>
    /// <param name="height" type="Number" optional="false">Height of the image in pixels.</param>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="height" type="Number">Height of the image in pixels</field>
    /// <field name="outline" type="SimpleLineSymbol">Outline of the polygon</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="url" type="String">URL of the image</field>
    /// <field name="width" type="Number">Width of the image in pixels</field>
    /// <field name="xoffset" type="Number">The offset on the x-axis in pixels</field>
    /// <field name="xscale" type="Number">Scale factor in x direction</field>
    /// <field name="yoffset" type="Number">The offset on the y-axis in pixels</field>
    /// <field name="yscale" type="Number">Scale factor in y direction</field>
};

esri.symbol.PictureFillSymbol.prototype = 
{
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setHeight: function (height) {
        /// <summary>Sets the height of the symbol</summary>
        /// <param name="height" type="Number" optional="false">Height in pixels.</param>
        /// <return type="PictureFillSymbol">PictureFillSymbol</return>
    },
    setOffset: function (x,y) {
        /// <summary>Sets the symbol offset</summary>
        /// <param name="x" type="Number" optional="false">Offset in x direction in pixels.</param>
        /// <param name="y" type="Number" optional="false">Offset in y direction in pixels.</param>
        /// <return type="PictureFillSymbol">PictureFillSymbol</return>
    },
    setOutline: function (outline) {
        /// <summary>Sets the outline of the fill symbol</summary>
        /// <param name="outline" type="SimpleLineSymbol" optional="false">Symbol used for outline.</param>
        /// <return type="FillSymbol">FillSymbol</return>
    },
    setUrl: function (url) {
        /// <summary>Sets the URL to the location of the symbol</summary>
        /// <param name="url" type="String" optional="false">URL string.</param>
        /// <return type="PictureFillSymbol">PictureFillSymbol</return>
    },
    setWidth: function (width) {
        /// <summary>Sets the width of the symbol</summary>
        /// <param name="width" type="Number" optional="false">Width in pixels.</param>
        /// <return type="PictureFillSymbol">PictureFillSymbol</return>
    },
    setXScale: function (scale) {
        /// <summary>Sets the scale factor in x direction.</summary>
        /// <param name="scale" type="Number" optional="false">Scale factor in x direction.</param>
        /// <return type="PictureFillSymbol">PictureFillSymbol</return>
    },
    setYScale: function (scale) {
        /// <summary>Sets the scale factor in y direction</summary>
        /// <param name="scale" type="Number" optional="false">Scale factor in y direction.</param>
        /// <return type="PictureFillSymbol">PictureFillSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.PictureMarkerSymbol = function (url,width,height) {
    /// <summary>Creates a new PictureMarkerSymbol object</summary>
    /// <param name="url" type="String" optional="false">URL of the image.</param>
    /// <param name="width" type="Number" optional="false">Width of the image in pixels. The default value is the actual width of the image.</param>
    /// <param name="height" type="Number" optional="false">Height of the image in pixels. The default value is the actual height of the image.</param>
    /// <field name="angle" type="Number">The angle of the marker</field>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="height" type="Number">Height of the image in pixels</field>
    /// <field name="size" type="Number">Size of the marker in pixels</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="url" type="String">URL of the image</field>
    /// <field name="width" type="Number">Width of the image in pixels</field>
    /// <field name="xoffset" type="Number">The offset on the x-axis in pixels</field>
    /// <field name="yoffset" type="Number">The offset on the y-axis in pixels</field>
};

esri.symbol.PictureMarkerSymbol.prototype = 
{
    setAngle: function (angle) {
        /// <summary>Rotates the symbol clockwise around its center by the specified angle</summary>
        /// <param name="angle" type="Number" optional="false">The angle value. 0 is pointing right and values progress clockwise.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setHeight: function (height) {
        /// <summary>Sets the height of the image for display.</summary>
        /// <param name="height" type="Number" optional="false">Height of marker in pixels.</param>
        /// <return type="PictureMarkerSymbol">PictureMarkerSymbol</return>
    },
    setOffset: function (x,y) {
        /// <summary>Sets the x and y offset of a marker in screen units</summary>
        /// <param name="x" type="Number" optional="false">The X offset value in pixels.</param>
        /// <param name="y" type="Number" optional="false">The Y offset value in pixels.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setSize: function (size) {
        /// <summary>Sets the size of a marker in pixels</summary>
        /// <param name="size" type="Number" optional="false">The width of the symbol in pixels.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setUrl: function (url) {
        /// <summary>Sets the URL where the image is located</summary>
        /// <param name="url" type="String" optional="false">URL location of marker image.</param>
        /// <return type="PictureMarkerSymbol">PictureMarkerSymbol</return>
    },
    setWidth: function (width) {
        /// <summary>Sets the width of the image for display.</summary>
        /// <param name="width" type="Number" optional="false">Width of marker in pixels.</param>
        /// <return type="PictureMarkerSymbol">PictureMarkerSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.ShieldLabelSymbol = function (imageUrl,textColor,width,height,font) {
    /// <summary>Construct a ShieldLabelSymbol</summary>
    /// <param name="imageUrl" type="String" optional="false">Url to shield image.</param>
    /// <param name="textColor" type="dojo.Color" optional="true">Text color. Default value is white opaque.</param>
    /// <param name="width" type="Number" optional="true">Image width. Default value is 32 pixels.</param>
    /// <param name="height" type="Number" optional="true">Image height. Default value is 32 pixels.</param>
    /// <param name="font" type="Font" optional="true">Font used for drawing text. Default value is 12pt black normal style. Set font = null if you need put image with no text.</param>
};

esri.symbol.SimpleFillSymbol = function () {
    /// <summary>Creates a new empty SimpleFillSymbol object</summary>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="outline" type="SimpleLineSymbol">Outline of the polygon</field>
    /// <field name="style" type="String">The fill style.</field>
    /// <field name="type" type="String">The type of symbol</field>
};

esri.symbol.SimpleFillSymbol.prototype = 
{
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setOutline: function (outline) {
        /// <summary>Sets the outline of the fill symbol</summary>
        /// <param name="outline" type="SimpleLineSymbol" optional="false">Symbol used for outline.</param>
        /// <return type="FillSymbol">FillSymbol</return>
    },
    setStyle: function (style) {
        /// <summary>Sets the fill symbol style</summary>
        /// <param name="style" type="String" optional="false">Fill style. See the Constants table for valid values.</param>
        /// <return type="SimpleFillSymbol">SimpleFillSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.SimpleLineSymbol = function () {
    /// <summary>Creates a new empty SimpleLineSymbol object</summary>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="style" type="String">The line style.</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="width" type="Number">Width of line symbol in pixels</field>
};

esri.symbol.SimpleLineSymbol.prototype = 
{
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setStyle: function (style) {
        /// <summary>Sets the line symbol style</summary>
        /// <param name="style" type="String" optional="false">Line style. See the Constants table for valid values.</param>
        /// <return type="SimpleLineSymbol">SimpleLineSymbol</return>
    },
    setWidth: function (width) {
        /// <summary>Sets the LineSymbol width</summary>
        /// <param name="width" type="Number" optional="false">Width of line symbol in pixels.</param>
        /// <return type="LineSymbol">LineSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.SimpleMarkerSymbol = function () {
    /// <summary>Creates a new empty SimpleMarkerSymbol object</summary>
    /// <field name="angle" type="Number">The angle of the marker</field>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="outline" type="SimpleLineSymbol">Outline of the marker</field>
    /// <field name="size" type="Number">Size of the marker in pixels.</field>
    /// <field name="style" type="String">The marker style.</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="xoffset" type="Number">The offset on the x-axis in pixels</field>
    /// <field name="yoffset" type="Number">The offset on the y-axis in pixels</field>
};

esri.symbol.SimpleMarkerSymbol.prototype = 
{
    setAngle: function (angle) {
        /// <summary>Rotates the symbol clockwise around its center by the specified angle</summary>
        /// <param name="angle" type="Number" optional="false">The angle value. 0 is pointing right and values progress clockwise.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setOffset: function (x,y) {
        /// <summary>Sets the x and y offset of a marker in screen units</summary>
        /// <param name="x" type="Number" optional="false">The X offset value in pixels.</param>
        /// <param name="y" type="Number" optional="false">The Y offset value in pixels.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setOutline: function (outline) {
        /// <summary>Sets the outline of the marker symbol</summary>
        /// <param name="outline" type="SimpleLineSymbol" optional="false">Symbol used for outline.</param>
        /// <return type="SimpleMarkerSymbol">SimpleMarkerSymbol</return>
    },
    setPath: function () {
        /// <summary>Sets the marker shape to the given path string and switches the marker style to STYLE_PATH.</summary>
        /// <return type="SimpleMarkerSymbol">SimpleMarkerSymbol</return>
    },
    setSize: function (size) {
        /// <summary>Sets the size of a marker in pixels</summary>
        /// <param name="size" type="Number" optional="false">The width of the symbol in pixels.</param>
        /// <return type="MarkerSymbol">MarkerSymbol</return>
    },
    setStyle: function (style) {
        /// <summary>Sets the marker symbol style</summary>
        /// <param name="style" type="String" optional="false">Marker style. See the Constants table for valid values.</param>
        /// <return type="SimpleMarkerSymbol">SimpleMarkerSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation.</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.Symbol = function () {

    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="type" type="String">The type of symbol</field>
};

esri.symbol.Symbol.prototype = 
{
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.symbol.TextSymbol = function (text) {
    /// <summary>Creates a new TextSymbol object that includes only the text</summary>
    /// <param name="text" type="String" optional="false">Text string for display in the graphics layer.</param>
    /// <field name="align" type="String">The text alignment in relation to the point.</field>
    /// <field name="angle" type="Number">Text angle.</field>
    /// <field name="color" type="dojo.Color">Symbol color, which is based on dojo.Color.</field>
    /// <field name="decoration" type="String">The decoration on the text.</field>
    /// <field name="font" type="Font">Font for displaying text</field>
    /// <field name="horizontalAlignment" type="String">Horizontal alignment of the text with respect to the graphic</field>
    /// <field name="kerning" type="Boolean">Determines whether to adjust the spacing between characters in the text string</field>
    /// <field name="rotated" type="Boolean">Determines whether every character in the text string is rotated</field>
    /// <field name="text" type="String">Text string for display in the graphics layer</field>
    /// <field name="type" type="String">The type of symbol</field>
    /// <field name="verticalAlignment" type="String">Vertical alignment of the text with respect to the graphic.Vertical alignment is not supported in Internet Explorer versions 7-10.</field>
    /// <field name="xoffset" type="Number">The offset on the x-axis in pixels from the point</field>
    /// <field name="yoffset" type="Number">The offset on the y-axis in pixels from the point</field>
};

esri.symbol.TextSymbol.prototype = 
{
    setAlign: function (align) {
        /// <summary>Sets the alignment of the text.</summary>
        /// <param name="align" type="String" optional="false">The text alignment. See the Constants table for valid values.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setAngle: function (angle) {
        /// <summary>Sets the angle of the text</summary>
        /// <param name="angle" type="Number" optional="false">Angle value between 0 and 359.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setColor: function (color) {
        /// <summary>Sets the symbol color</summary>
        /// <param name="color" type="dojo.Color" optional="false">Colors can be denoted in the following formats:R, G, B: new dojo.Color([255,0,0]) R,G,B,A. The "A" value represents transparency where 0.0 is fully transparent and 1.0 has no transparency: new dojo.Color([255,0,0,0.25]) Hex string: new dojo.Color("#C0C0C0") Named string: new dojo.Color("blue") </param>
        /// <return type="Symbol">Symbol</return>
    },
    setDecoration: function (decoration) {
        /// <summary>Sets the decoration for the text.</summary>
        /// <param name="decoration" type="String" optional="false">The decoration on the text. See the Constants table for valid values.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setFont: function (font) {
        /// <summary>Sets the text font</summary>
        /// <param name="font" type="Font" optional="false">Text font.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setHorizontalAlignment: function (alignment) {
        /// <summary>Updates the horizontal alignment of the text symbol</summary>
        /// <param name="alignment" type="String" optional="false">Horizontal alignment of the text with respect to the graphic. See horizontalAlignment property for the list of supported options.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setKerning: function (kerning) {
        /// <summary>Sets whether to adjust the spacing between characters in the text string</summary>
        /// <param name="kerning" type="Boolean" optional="false">Set to true for kerning.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setOffset: function (x,y) {
        /// <summary>Sets the x and y offset of the text</summary>
        /// <param name="x" type="Number" optional="false">X offset value in pixels.</param>
        /// <param name="y" type="Number" optional="false">Y offset value in pixels.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setRotated: function (rotated) {
        /// <summary>Sets whether every character in the text string is rotated.</summary>
        /// <param name="rotated" type="Boolean" optional="false">Set to true to rotate all characters in the string.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setText: function (text) {
        /// <summary>Sets the text string</summary>
        /// <param name="text" type="String" optional="false">The text string.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    setVerticalAlignment: function (alignment) {
        /// <summary>Updates the vertical alignment of the text symbol</summary>
        /// <param name="alignment" type="String" optional="false">Vertical alignment of the text with respect to the graphic. See verticalAlignment property for the list of supported options.</param>
        /// <return type="TextSymbol">TextSymbol</return>
    },
    toJson: function () {
        /// <summary>Converts object to its ArcGIS Server JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};



esri.symbols.fromJson = function (json) {
    /// <summary>Converts input json into a symbol, returns null if the input json represents an unknown or unsupported symbol type.</summary>
    /// <param name="json" type="Object" optional="false">The input JSON.</param>
    /// <return type="Symbol">Symbol</return>
};

esri.symbols.getShapeDescriptors = function (symbol) {
    /// <summary>Returns the shape description properties for the given symbol as defined by the Dojo GFX API.</summary>
    /// <param name="symbol" type="Symbol" optional="false">The input symbol.</param>
    /// <return type="Object">Object</return>
};

esri.tasks = function () {
    /// <summary>The esri.tasks namespace.</summary>
};

esri.tasks.AddressCandidate = function () {

    /// <field name="address" type="Object">Address of the candidate.</field>
    /// <field name="attributes" type="Object">Name value pairs of field name and field value as defined in outFields in Locator.addressToLocations</field>
    /// <field name="location" type="Point">X- and y-coordinate of the candidate</field>
    /// <field name="score" type="Number">Numeric score between 0 and 100 for geocode candidates.</field>
};

esri.tasks.AlgorithmicColorRamp = function () {
    /// <summary>Creates a new AlgorithmicColorRamp object</summary>
    /// <field name="algorithm" type="String">The algorithm used to generate the colors between the fromColor and toColor.</field>
    /// <field name="fromColor" type="dojo.Color">The first color in the color ramp</field>
    /// <field name="toColor" type="dojo.Color">The last color in the color ramp</field>
};

esri.tasks.AlgorithmicColorRamp.prototype = 
{
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of an algorithmic color ramp</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.AreasAndLengthsParameters = function () {
    /// <summary>Creates a new AreasAndLengthsParameters object</summary>
    /// <field name="areaUnit" type="esri.tasks.GeometryService Constant">The area unit in which areas of polygons will be calculated.</field>
    /// <field name="calculationType" type="String">Defines the type of calculation for the geometry.</field>
    /// <field name="lengthUnit" type="esri.tasks.GeometryService Constant">The length unit in which perimeters of polygons will be calculated.</field>
    /// <field name="polygons" type="Geometry[]">Polygon geometries for which to compute areas and lengths.</field>
};

esri.tasks.BufferParameters = function () {
    /// <summary>Creates a new BufferParameters object.</summary>
    /// <field name="bufferSpatialReference" type="SpatialReference">The spatial reference in which the geometries are buffered.</field>
    /// <field name="distances" type="Number[]">The distances the input features are buffered.</field>
    /// <field name="geodesic" type="Boolean">If the input geometries are in geographic coordinate system set geodesic to true in order to generate a buffer polygon using a geodesic distance.</field>
    /// <field name="geometries" type="Geometry[]">The input geometries to buffer</field>
    /// <field name="outSpatialReference" type="SpatialReference">The spatial reference for the returned geometries.</field>
    /// <field name="unionResults" type="Boolean">If true, all geometries buffered at a given distance are unioned into a single (possibly multipart) polygon, and the unioned geometry is placed in the output array</field>
    /// <field name="unit" type="String">The units for calculating each buffer distance.</field>
};

esri.tasks.ClassBreaksDefinition = function () {
    /// <summary>Creates a new ClassBreaksDefinition object.</summary>
    /// <field name="baseSymbol" type="Symbol">Define a default symbol for the classification.</field>
    /// <field name="breakCount" type="Number">The number of class breaks</field>
    /// <field name="classificationField" type="String">The name of the field used to match values</field>
    /// <field name="classificationMethod" type="String">The name of the classification method</field>
    /// <field name="colorRamp" type="AlgorithmicColorRamp || MultipartColorRamp">Define a color ramp for the classification.</field>
    /// <field name="normalizationField" type="String">The name of the field that contains the values used to normalize class breaks when normalizationType is set to 'field'</field>
    /// <field name="normalizationType" type="String">The type of normalization used to normalize class breaks</field>
    /// <field name="standardDeviationInterval" type="Number">The standard deviation interval.</field>
};

esri.tasks.ClassBreaksDefinition.prototype = 
{
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the class breaks definition</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.ClassificationDefinition = function () {

    /// <field name="baseSymbol" type="Symbol">Define a default symbol for the classification.</field>
    /// <field name="colorRamp" type="AlgorithmicColorRamp || MultipartColorRamp">Define a color ramp for the classification.</field>
    /// <field name="type" type="String">The type of classification definition</field>
};

esri.tasks.ClosestFacilityParameters = function () {
    /// <summary>Creates a new ClosestFacilityParameters object.</summary>
    /// <field name="accumulateAttributes" type="String[]">The list of network attribute names to be accumulated with the analysis, i.e., which attributes should be returned as part of the response</field>
    /// <field name="attributeParameterValues" type="Object[]">An array of attribute parameter values that determine which network elements can be used by a vehicle.</field>
    /// <field name="defaultCutoff" type="Number">The cutoff value used to determine when to stop traversing</field>
    /// <field name="defaultTargetFacilityCount" type="int">The number of facilities to find</field>
    /// <field name="directionsLanguage" type="String">The language used when computing directions.</field>
    /// <field name="directionsLengthUnits" type="String">The length units used when computing directions.</field>
    /// <field name="directionsOutputType" type="String">Defines the amount of direction information returned.</field>
    /// <field name="directionsStyleName" type="String">The style to be used when returning directions.</field>
    /// <field name="directionsTimeAttribute" type="String">The name of the attribute field that contains the drive time values.</field>
    /// <field name="doNotLocateOnRestrictedElements" type="Boolean">When true, restricted network elements should be considered when finding network locations.</field>
    /// <field name="facilities" type="Object">The set of facilities loaded as network locations during analysis.</field>
    /// <field name="impedenceAttribute" type="String">The network attribute field name used as the impedance attribute during analysis.</field>
    /// <field name="incidents" type="Object">The set of incidents loaded as network locations during analysis.</field>
    /// <field name="outSpatialReference" type="SpatialReference">The well-known id of the spatial reference for the geometries returned with the analysis results.</field>
    /// <field name="outputGeometryPrecision" type="Number">The output geometry precision.</field>
    /// <field name="outputGeometryPrecisionUnits" type="String">The units of the output geometry precision.</field>
    /// <field name="outputLines" type="String">The type of output lines to be generated in the result.</field>
    /// <field name="pointBarriers" type="Object">The set of point barriers loaded as network locations during analysis.</field>
    /// <field name="polygonBarriers" type="Object">The set of polygon barriers loaded as network locations during analysis.</field>
    /// <field name="polylineBarriers" type="Object">The set of polyline barriers loaded as network locations during analysis.</field>
    /// <field name="restrictUTurns" type="String">Specifies how U-Turns should be handled.</field>
    /// <field name="restrictionAttributes" type="String[]">The list of network attribute names to be used as restrictions with the analysis.</field>
    /// <field name="returnDirections" type="Boolean">If true, directions will be generated and returned in the directions property of each RouteResult and RouteSolveResult.</field>
    /// <field name="returnFacilities" type="Boolean">If true, facilities will be returned with the analysis results.</field>
    /// <field name="returnIncidents" type="Boolean">If true, incidents will be returned with the analysis results.</field>
    /// <field name="returnPointBarriers" type="Boolean">If true, barriers will be returned in the barriers property of the ClosestFacilitySolveResult.</field>
    /// <field name="returnPolygonBarriers" type="Boolean">If true, polygon barriers will be returned in the barriers property of the ClosestFacilitySolveResult.</field>
    /// <field name="returnPolylineBarriers" type="Boolean">If true, polyline barriers will be returned in the barriers property of the ClosestFacilitySolveResult.</field>
    /// <field name="returnRoutes" type="Boolean">When true, closest facility routes will be generated and returned in the route property of each ClosestFacilityResult and ClosestFacilitySolveResult.</field>
    /// <field name="timeOfDay" type="Date">The arrival or departure date and time.</field>
    /// <field name="timeOfDayUsage" type="String">Defines the way the timeOfDay value is used.</field>
    /// <field name="travelDirection" type="String">Options for traveling to or from the facility.</field>
    /// <field name="useHierarchy" type="Boolean">If true, the hierarchy attribute for the network will be used in analysis.</field>
};

esri.tasks.ClosestFacilitySolveResult = function () {

    /// <field name="directions" type="DirectionsFeatureSet">An array of directions.</field>
    /// <field name="facilities" type="Point[]">An array of points, only returned when ClosestFacilityParameters.returnFacilities is true</field>
    /// <field name="incidents" type="Point[]">An array of points, only returned when ClosestFacilityParameters.returnIncidents is true</field>
    /// <field name="messages" type="esri.tasks.NAMessage">Message received when the solve is complete.</field>
    /// <field name="pointBarriers" type="Point[]">The point barriers are an array of points.</field>
    /// <field name="polygonBarriers" type="Polygon[]">The polygon barriers are an array of polygons.</field>
    /// <field name="polylineBarriers" type="Polyline[]">The polyline barriers are an array of polylines.</field>
    /// <field name="routes" type="Graphic[]">The array of routes.</field>
};

esri.tasks.ClosestFacilityTask = function () {
    /// <summary>Creates a new ClosestFacilityTask object</summary>
};

esri.tasks.ClosestFacilityTask.prototype = 
{
    solve: function (params,callback,errback) {
        /// <summary>Solve the closest facility</summary>
        /// <param name="params" type="ClosestFacilityParameters" optional="false">The ClosestFacilityParameters object.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onSolveComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.DataFile = function () {
    /// <summary>Creates a new DataFile object.</summary>
    /// <field name="itemID" type="String">The ID of the uploaded file returned as a result of the upload operation.</field>
    /// <field name="url" type="String">URL to the location of the data file</field>
};

esri.tasks.DataLayer = function () {
    /// <summary>Creates a new DataLayer object</summary>
    /// <field name="geometry" type="Geometry">The geometry to apply to the spatial filter.</field>
    /// <field name="name" type="String">The name of the data layer in the map service that is being referenced</field>
    /// <field name="spatialRelationship" type="String">The spatial relationship to be applied on the input geometry while performing the query.</field>
    /// <field name="where" type="String">A where clause for the query.</field>
};

esri.tasks.Date = function () {
    /// <summary>Creates a new Date object.</summary>
    /// <field name="date" type="Date">Date value returned from server</field>
    /// <field name="format" type="String">The format of the date used in the date property.</field>
};

esri.tasks.DirectionsFeatureSet = function () {

    /// <field name="displayFieldName" type="String">The name of the layer's primary display field.</field>
    /// <field name="exceededTransferLimit" type="Number">Typically a layer has a limit on the number of features (i.e.</field>
    /// <field name="extent" type="Extent">The extent of the route</field>
    /// <field name="features" type="Graphic[]">The array of graphics returned</field>
    /// <field name="fieldAliases" type="Object">Set of name-value pairs for the attribute's field and alias names</field>
    /// <field name="geometryType" type="String">The geometry type of the FeatureSet</field>
    /// <field name="mergedGeometry" type="Polyline">A single polyline representing the route</field>
    /// <field name="routeId" type="String">The ID of the route returned from the server</field>
    /// <field name="routeName" type="String">Name specified in RouteParameters.stops</field>
    /// <field name="spatialReference" type="SpatialReference">When a FeatureSet is used as input to Geoprocessor, the spatial reference is set to the map's spatial reference by default.</field>
    /// <field name="strings" type="Object[]">Lists additional information about the direction depending on the value of directionsOutputType</field>
    /// <field name="totalDriveTime" type="Number">Actual drive time calculated for the route</field>
    /// <field name="totalLength" type="Number">The length of the route as specified in RouteParameters.directionsLengthUnits</field>
    /// <field name="totalTime" type="Number">The total time calculated for the route as specified in RouteParameters.directionsTimeAttribute</field>
};

esri.tasks.DistanceParameters = function () {
    /// <summary>Creates a new DistanceParameters object.</summary>
    /// <field name="distanceUnit" type="esri.tasks.GeometryService Constant">Specifies the units for measuring distance between geometry1 and geometry2.</field>
    /// <field name="geodesic" type="Boolean">Default value is false.</field>
    /// <field name="geometry1" type="Geometry">The geometry from which the distance is to measured.</field>
    /// <field name="geometry2" type="Geometry">The geometry to which the distance is measured.</field>
};

esri.tasks.FeatureSet = function () {
    /// <summary>Creates a new FeatureSet object.</summary>
    /// <field name="displayFieldName" type="String">The name of the layer's primary display field.</field>
    /// <field name="exceededTransferLimit" type="Number">Typically a layer has a limit on the number of features (i.e.</field>
    /// <field name="features" type="Graphic[]">The array of graphics returned</field>
    /// <field name="fieldAliases" type="Object">Set of name-value pairs for the attribute's field and alias names</field>
    /// <field name="geometryType" type="String">The geometry type of the FeatureSet</field>
    /// <field name="spatialReference" type="SpatialReference">When a FeatureSet is used as input to Geoprocessor, the spatial reference is set to the map's spatial reference by default.</field>
};

esri.tasks.FindParameters = function () {
    /// <summary>Creates a new FindParameters object.</summary>
    /// <field name="contains" type="Boolean">The contains parameter determines whether to look for an exact match of the search text or not.</field>
    /// <field name="dynamicLayerInfos" type="DynamicLayerInfos[]">An array of DynamicLayerInfos used to change the layer ordering or redefine the map.</field>
    /// <field name="layerDefinitions" type="String[]">Array of layer definition expressions that allows you to filter the features of individual layers.</field>
    /// <field name="layerIds" type="Number[]">The layers to perform the find operation on.</field>
    /// <field name="maxAllowableOffset" type="Number">The maximum allowable offset used for generalizing geometries returned by the find operation.</field>
    /// <field name="outSpatialReference" type="SpatialReference">The spatial reference of the output geometries.</field>
    /// <field name="returnGeometry" type="Boolean">If "true", the result set include the geometry associated with each result.</field>
    /// <field name="searchFields" type="String[]">The names of the fields of a layer to search.</field>
    /// <field name="searchText" type="String">The search string text that is searched across the layers and the fields as specified in the layers and searchFields parameters</field>
};

esri.tasks.FindResult = function () {

    /// <field name="displayFieldName" type="String">The name of the layer's primary display field.</field>
    /// <field name="feature" type="Graphic">The found feature</field>
    /// <field name="foundFieldName" type="String">The name of the field that contains the search text</field>
    /// <field name="layerId" type="Number">Unique ID of the layer that contains the feature</field>
    /// <field name="layerName" type="String">The layer name that contains the feature</field>
};

esri.tasks.FindTask = function (url,options) {
    /// <summary>Creates a new FindTask object.</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a layer in a service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Portland/Portland_ESRI_LandBase_AGO/MapServer/1. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; gdbVersion</param>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
};

esri.tasks.FindTask.prototype = 
{
    execute: function (findParameters,callback,errback) {
        /// <summary>Sends a request to the ArcGIS REST map service resource to perform a search based on the FindParameters specified in the findParameters argument.</summary>
        /// <param name="findParameters" type="FindParameters" optional="false">Specifies the layers and fields that are used to search against.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.GPMessage = function () {

    /// <field name="description" type="String">A description of the geoprocessing message</field>
    /// <field name="type" type="Number">The geoprocessing message type.</field>
};

esri.tasks.GeneralizeParameters = function () {
    /// <summary>Creates a new GeneralizeParameters object.</summary>
    /// <field name="deviationUnit" type="esri.tasks.GeometryService Constant">The maximum deviation unit.</field>
    /// <field name="geometries" type="Geometry[]">The array of input geometries to generalize.</field>
    /// <field name="maxDeviation" type="Number">The maximum deviation for constructing a generalized geometry based on the input geometries</field>
};

esri.tasks.GenerateRendererParameters = function () {
    /// <summary>Creates a new GenerateRendererParameters object</summary>
    /// <field name="classificationDefinition" type="ClassificationDefinition">A ClassBreaksDefinition or UniqueValueDefinition classification definition used to generate the data classes</field>
    /// <field name="formatLabel" type="Boolean">Indicate if the label should be formatted.</field>
    /// <field name="precision" type="Number">Round values for the renderer.</field>
    /// <field name="prefix" type="String">The label in the legend will have this prefix.</field>
    /// <field name="unitLabel" type="String">The label in the legend will have this at the end of each label.</field>
    /// <field name="where" type="String">A where clause used to generate the data classes.</field>
};

esri.tasks.GenerateRendererTask = function (url,options) {
    /// <summary>Creates a new GenerateRendererTask object</summary>
    /// <param name="url" type="String" optional="false">The url to a layer in a map service or table. Requires an ArcGIS Server version 10.1 or greater service that supports the generateDataClasses operation.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;Boolean&#62; checkValueRange&#10;
    /// &#60;String&#62; gdbVersion</param>
};

esri.tasks.GenerateRendererTask.prototype = 
{
    execute: function (generateRendererParameters,callback,errback) {
        /// <summary>Perform a classification on the layer or table resource.</summary>
        /// <param name="generateRendererParameters" type="GenerateRendererParameters" optional="false">A GenerateRendererParameters object that defines the classification definition and an optional where clause.</param>
        /// <param name="callback" type="Function" optional="true">This function will be called when the operation is complete. The arguments passed to this function are the same as the OnComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.GeometryService = function (url) {
    /// <summary>Creates a new GeometryService object.</summary>
    /// <param name="url" type="String" optional="false">Set the url to the ArcGIS Server REST resource that represents a GeometryService, e.g. http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer.For more information on constructing a URL, see the ArcGIS Services Directory.</param>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a locator service.</field>
};

esri.tasks.GeometryService.prototype = 
{
    areasAndLengths: function (areasAndLengthsParameters,callback,errback) {
        /// <summary>Computes the area and length for the input polygons.Version history:Originally added: v1.1errback parameter added: v1.3 Return value of dojo.Deferred added: v1.4graphics parameter replaced by AreasAndLengthsParameters: v2.0.</summary>
        /// <param name="areasAndLengthsParameters" type="AreasAndLengthsParameters" optional="false">Specify the input polygons and optionally the linear and areal units.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onAreasAndLengthsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    autoComplete: function (polygons,polylines,callback,errback) {
        /// <summary>The Auto Complete operation is performed on a geometry service resource.</summary>
        /// <param name="polygons" type="Polygon[]" optional="false">The array of polygons that will provide some boundaries for new polygons.</param>
        /// <param name="polylines" type="Polyline[]" optional="false">An array of polylines that will provide the remaining boundaries for new polygons.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onAutoCompleteComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    buffer: function (bufferParameters,callback,errback) {
        /// <summary>Creates buffer polygons at a specified distance around the given geometries.</summary>
        /// <param name="bufferParameters" type="BufferParameters" optional="false">Specifies the input geometries, buffer distances, and other options.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onBufferComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    convexHull: function (geometries,callback,errback) {
        /// <summary>The convexHull operation is performed on a geometry service resource.</summary>
        /// <param name="geometries" type="Geometry[]" optional="false">The geometries whose convex hull is to be created.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onConvexHullComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    cut: function (geometries,cutterGeometry,callback,errback) {
        /// <summary>The cut operation is performed on a geometry service resource.</summary>
        /// <param name="geometries" type="Geometry[]" optional="false">The polyline or polygon to be cut.</param>
        /// <param name="cutterGeometry" type="Geometry" optional="false">The polyline that will be used to divide the target into pieces where it crosses the target.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onCutComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    difference: function (geometries,geometry,callback,errback) {
        /// <summary>The difference operation is performed on a geometry service resource.</summary>
        /// <param name="geometries" type="Geometry[]" optional="false">An array of points, multipoints, polylines or polygons.</param>
        /// <param name="geometry" type="Geometry" optional="false">A single geometry of any type, of dimension equal to or greater than the elements of geometries.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onDifferenceComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    distance: function (params,callback,errback) {
        /// <summary>Measures the planar or geodesic distance between geometries</summary>
        /// <param name="params" type="DistanceParameters" optional="false">Sets the input geometries to measure, distance units and other parameters.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onDistanceComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    generalize: function (params,callback,errback) {
        /// <summary>Generalizes the input geometries using the Douglas-Peucker algorithm</summary>
        /// <param name="params" type="GeneralizeParameters" optional="false">An array of geometries to generalize and a maximum deviation. Optionally set the deviation units.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onGeneralizeComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    intersect: function (geometries,geometry,callback,errback) {
        /// <summary>The intersect operation is performed on a geometry service resource.</summary>
        /// <param name="geometries" type="Geometry[]" optional="false">An array of points, multipoints, polylines or polygons.</param>
        /// <param name="geometry" type="Geometry" optional="false">A single geometry of any type, of dimension equal to or greater than the elements of geometries.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onIntersectComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    labelPoints: function (polygons,callback,errback) {
        /// <summary>Calculates an interior point for each polygon specified.</summary>
        /// <param name="polygons" type="Geometry[]" optional="false">The graphics to process.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onLabelPointsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    lengths: function (lengthsParameter,callback,errback) {
        /// <summary>Gets the lengths for a Geometry[] when the geometry type is Polyline.Version history:Originally added: v1.1errback parameter added: v1.3 Return value of dojo.Deferred added: v1.4graphics parameter replaced by lengthsParameter: v2.0.</summary>
        /// <param name="lengthsParameter" type="LengthsParameters" optional="false">Specify the polylines and optionally the length unit and the geodesic length option.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onLengthsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    offset: function (params,callback,errback) {
        /// <summary>Constructs the offset of the input geometries.</summary>
        /// <param name="params" type="OffsetParameters" optional="false">Set the geometries to offset, distance and units.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onOffsetComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    project: function (params,callback,errback) {
        /// <summary>Projects a set of geometries into a new spatial reference.</summary>
        /// <param name="params" type="ProjectParameters" optional="false">The input projection parameters.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onProjectComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    relation: function (relationParameters,callback,errback) {
        /// <summary>Computes the set of pairs of geometries from the input geometry arrays that belong to the specified relation.</summary>
        /// <param name="relationParameters" type="RelationParameters" optional="false">The set of parameters required to perform the comparison.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onRelationComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    reshape: function (targetGeometry,reshaperGeometry,callback,errback) {
        /// <summary>The reshape operation is performed on a geometry service resource.</summary>
        /// <param name="targetGeometry" type="Geometry" optional="false">The polyline or polygon to be reshaped.</param>
        /// <param name="reshaperGeometry" type="Geometry" optional="false">The single-part polyline that does the reshaping.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onReshapeComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    simplify: function (geometries,callback,errback) {
        /// <summary>Alters the given geometries to make their definitions topologically legal with respect to their geometry type.</summary>
        /// <param name="geometries" type="Geometry[]" optional="false">The geometries to simplify</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onSimplifyComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    trimExtend: function (params,callback,errback) {
        /// <summary>Trims or extends the input polylines using the user specified guide polyline.</summary>
        /// <param name="params" type="TrimExtendParameters" optional="false">Input parameters for the trimExtend operation.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onTrimExtendComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    union: function (geometries,callback,errback) {
        /// <summary>The union operation is performed on a geometry service resource.</summary>
        /// <param name="geometries" type="Geometry[]" optional="false">The array of geometries to be unioned.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onUnionComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.Geoprocessor = function (url) {
    /// <summary>Creates a new Geoprocessor object that represents the GP Task identifed by a URL</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a geoprocessing service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Network. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <field name="outSpatialReference" type="SpatialReference">The spatial reference of the output geometries.</field>
    /// <field name="outputSpatialReference" type="SpatialReference">Deprecated at v2.0.</field>
    /// <field name="processSpatialReference" type="SpatialReference">The spatial reference that the model will use to perform geometry operations.</field>
    /// <field name="updateDelay" type="Number">The time interval in milliseconds between each job status request sent to an asynchronous GP task</field>
    /// <field name="url" type="String">ArcGIS Server Rest API endpoint to the resource that receives the geoprocessing request</field>
};

esri.tasks.Geoprocessor.prototype = 
{
    cancelJob: function (jobId,callback,errback) {
        /// <summary>Cancel an asynchronous geoprocessing job.</summary>
        /// <param name="jobId" type="String" optional="false">A string that uniquely identifies a job on the server. It is created when a job is submitted for execution and later used to check its status and retrieve the results.</param>
        /// <param name="callback" type="Function" optional="false">The function to call when the method has completed. The arguments in the function are the same as the onJobCancel event.</param>
        /// <param name="errback" type="Function" optional="false">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    cancelJobStatusUpdates: function (jobId) {
        /// <summary>Cancels the periodic job status updates initiated automatically when submitJob() is invoked for the job identified by jobId.</summary>
        /// <param name="jobId" type="String" optional="false">A string that uniquely identifies the job for which the job updates are cancelled.</param>
    },
    checkJobStatus: function (jobId,callback,errback) {
        /// <summary>Sends a request to the GP Task for the current state of the job identified by jobId.</summary>
        /// <param name="jobId" type="String" optional="false">A string that uniquely identifies a job on the server. It is created when a job is submitted for execution and later used to check its status and retrieve the results.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onStatusUpdate event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
    },
    execute: function (inputParameters,callback,errback) {
        /// <summary>Sends a request to the server to execute a synchronous GP task.</summary>
        /// <param name="inputParameters" type="Object" optional="false">The inputParameters argument specifies the input parameters accepted by the task and their corresponding values. These input parameters are listed in the parameters field of the associated GP Task resource. For example, assume that a GP Task resource has the following input parameters:Input_Points (GPFeatureRecordSetLayer)Distance (GPDouble)The parameters argument for the above inputs is a data object of the form: { Input_Points: &#60;FeatureSet&#62;, Distance: &#60;Number&#62;}</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onExecuteComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getResultData: function (jobId,parameterName,callback,errback) {
        /// <summary>Sends a request to the GP Task to get the task result identified by jobId and resultParameterName.</summary>
        /// <param name="jobId" type="String" optional="false">The jobId returned from JobInfo.</param>
        /// <param name="parameterName" type="String" optional="false">The name of the result parameter as defined in Services Directory.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onGetResultDataComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getResultImage: function (jobId,parameterName,imageParameters,callback,errback) {
        /// <summary>Sends a request to the GP Task to get the task result identified by jobId and resultParameterName as an image.The return object of dojo.Deferred was added at v1.4</summary>
        /// <param name="jobId" type="String" optional="false">The jobId returned from JobInfo.</param>
        /// <param name="parameterName" type="String" optional="false">The name of the result parameter as defined in Services Directory.</param>
        /// <param name="imageParameters" type="ImageParameters" optional="false">Specifies the properties of the result image.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onGetResultImageComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getResultImageLayer: function (jobId,parameterName,imageParameters,callback,errback) {
        /// <summary>Sends a request to the GP Task to get the task result identified by jobId and resultParameterName as an ArcGISDynamicMapServiceLayer</summary>
        /// <param name="jobId" type="String" optional="false">The jobId returned from JobInfo.</param>
        /// <param name="parameterName" type="String" optional="false">The name of the result parameter as defined in Services Directory.</param>
        /// <param name="imageParameters" type="ImageParameters" optional="false">Contains various options that can be specified when generating a dynamic map image.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onGetResultImageLayerComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
    },
    setOutSpatialReference: function (spatialReference) {
        /// <summary>Sets the well-known ID of the spatial reference of the output geometries</summary>
        /// <param name="spatialReference" type="SpatialReference" optional="false">The well-known ID of a spatial reference.{"wkid" : 4326} </param>
    },
    setOutputSpatialReference: function (spatialReference) {
        /// <summary>Deprecated at v2.0.</summary>
        /// <param name="spatialReference" type="SpatialReference" optional="false">The well-known ID of a spatial reference.{"wkid" : 4326} </param>
    },
    setProcessSpatialReference: function (spatialReference) {
        /// <summary>Sets the well-known ID of the spatial reference that the model uses to perform geometry operations</summary>
        /// <param name="spatialReference" type="SpatialReference" optional="false">The well-known ID of a spatial reference.{"wkid" : 4326} </param>
    },
    setUpdateDelay: function (delay) {
        /// <summary>Sets the time interval in milliseconds between each job status request sent to an asynchronous GP task</summary>
        /// <param name="delay" type="Number" optional="false">The value in milliseconds. One second equals 1000 milliseconds.</param>
    },
    submitJob: function (inputParameters,callback,statusCallback,errback) {
        /// <summary>Submits a job to the server for asynchronous processing by the GP task.</summary>
        /// <param name="inputParameters" type="Object" optional="false">The inputParameters argument specifies the input parameters accepted by the task and their corresponding values. These input parameters are listed in the parameters field of the associated GP Task resource. For example, assume that a GP Task resource has the following input parameters: Input_Points (GPFeatureRecordSetLayer)Distance (GPDouble)The parameters argument for the above inputs is a data object of the form: { Input_Points: &#60;FeatureSet&#62;, Distance: &#60;Number&#62;}</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onJobComplete event.</param>
        /// <param name="statusCallback" type="Function" optional="true">Checks the current status of the job. The returned JobInfo message includes the status along with the GPMessage.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
    },
};

esri.tasks.IdentifyParameters = function () {
    /// <summary>Creates a new IdentifyParameters object.</summary>
    /// <field name="dpi" type="Number">Resolution of the current map view in dots per inch</field>
    /// <field name="dynamicLayerInfos" type="DynamicLayerInfos[]">An array of DynamicLayerInfos used to change the layer ordering or redefine the map.</field>
    /// <field name="geometry" type="Geometry">The geometry used to select features during Identify.</field>
    /// <field name="height" type="Number">Height of the map currently being viewed in pixels</field>
    /// <field name="layerDefinitions" type="String[]">Array of layer definition expressions that allows you to filter the features of individual layers.</field>
    /// <field name="layerIds" type="Number[]">The layers to perform the identify operation on.</field>
    /// <field name="layerOption" type="String">Specifies which layers to use when using Identify.</field>
    /// <field name="layerTimeOptions" type="LayerTimeOptions[]">Array of LayerTimeOptions objects that allow you to define time options for the specified layers.</field>
    /// <field name="mapExtent" type="Extent">The Extent or bounding box of the map currently being viewed.</field>
    /// <field name="maxAllowableOffset" type="Number">The maximum allowable offset used for generalizing geometries returned by the identify operation.</field>
    /// <field name="returnGeometry" type="Boolean">If "true", the result set includes the geometry associated with each result.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the input and output geometries as well as of the mapExtent.</field>
    /// <field name="timeExtent" type="TimeExtent">Specify the time extent used by the identify task</field>
    /// <field name="tolerance" type="Number">The distance in screen pixels from the specified geometry within which the identify should be performed</field>
    /// <field name="width" type="Number">Width of the map currently being viewed in pixels</field>
};

esri.tasks.IdentifyResult = function () {

    /// <field name="displayFieldName" type="String">The name of the layer's primary display field.</field>
    /// <field name="feature" type="Graphic">An identified feature</field>
    /// <field name="layerId" type="Number">Unique ID of the layer that contains the feature</field>
    /// <field name="layerName" type="String">The layer name that contains the feature</field>
};

esri.tasks.IdentifyTask = function (url,options) {
    /// <summary>Creates a new IdentifyTask object.</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a map service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Portland/Portland_ESRI_LandBase_AGO/MapServer. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; gdbVersion</param>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
};

esri.tasks.IdentifyTask.prototype = 
{
    execute: function (identifyParameters,callback,errback) {
        /// <summary>Sends a request to the ArcGIS REST map service resource to identify features based on the IdentifyParameters specified in the identifyParameters argument.</summary>
        /// <param name="identifyParameters" type="IdentifyParameters" optional="false">Specifies the criteria used to identify the features.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.ImageServiceIdentifyParameters = function () {
    /// <summary>Creates a new ImageServiceIdentifyParameters object</summary>
    /// <field name="geometry" type="Geometry">Input geometry that defines the location to be identified.</field>
    /// <field name="mosaicRule" type="MosaicRule">Specifies the mosaic rules defining the image sorting order.</field>
    /// <field name="noData" type="String | Number">The pixel or RGB color value representing no information.</field>
    /// <field name="noDataInterpretation" type="String">Used along with the noData property.</field>
    /// <field name="pixelSize" type="Symbol">Specify the pixel level being identified on the x and y axis.</field>
    /// <field name="pixelSizeX" type="Number">The pixel level being identified (or the resolution being looked at) on the x-axis.</field>
    /// <field name="pixelSizeY" type="Number">The pixel level being identified (or the resolution being looked at) on the y-axis.</field>
    /// <field name="renderingRule" type="RasterFunction">Specifies the rendering rule for how the requested image should be rendered.</field>
    /// <field name="returnCatalogItems" type="Boolean">If "true", returns both geometry and attributes of the catalog items.</field>
    /// <field name="returnGeometry" type="Boolean">When true, each feature in the catalog items includes the geometry.</field>
    /// <field name="timeExtent" type="TimeExtent">Specify a time extent</field>
};

esri.tasks.ImageServiceIdentifyResult = function () {

    /// <field name="catalogItemVisibilities" type="Number[]">The set of visible areas for the identified catalog items.</field>
    /// <field name="catalogItems" type="FeatureSet">The set of catalog items that overlap the input geometry.</field>
    /// <field name="location" type="Point">The identified location</field>
    /// <field name="name" type="String">The identify property name</field>
    /// <field name="objectId" type="Number">The identify property id</field>
    /// <field name="properties" type="Object">The attributes of the identified object</field>
    /// <field name="value" type="String">The identify property pixel value</field>
};

esri.tasks.ImageServiceIdentifyTask = function (url) {
    /// <summary>Creates a new ImageServiceIdentifyTask object</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents an image service.require([ "esri/tasks/ImageServiceIdentifyTask", ... ], function(ImageServiceIdentifyTask, ... ) { var imageTask = new ImageServiceIdentifyTask("http://servicesbeta.esri.com/ArcGIS/rest/services/Portland/PortlandAerial/ImageServer"); ...});</param>
};

esri.tasks.ImageServiceIdentifyTask.prototype = 
{
    execute: function (params,callback,errback) {
        /// <summary>Sends a request to the ArcGIS REST image service resource to identify content based on the ImageServiceIdentifyParameters specified in the imageServiceIdentifyParameters argument</summary>
        /// <param name="params" type="ImageServiceIdentifyParameters" optional="false">Specifies the criteria used to identify the features.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.JobInfo = function () {

    /// <field name="jobId" type="String">The unique job ID assigned by ArcGIS Server</field>
    /// <field name="jobStatus" type="String">The job status.</field>
    /// <field name="messages" type="GpMessage[]">An array of messages that include the message type and a description</field>
};

esri.tasks.LegendLayer = function () {
    /// <summary>Creates a new LegendLayer object</summary>
    /// <field name="layerId" type="String">The id of the operational layer to include in the printout's legend</field>
    /// <field name="subLayerIds" type="String[]">The ids of the sublayers to include in the printout's legend</field>
};

esri.tasks.LengthsParameters = function () {
    /// <summary>Creates a new LengthsParameter object</summary>
    /// <field name="calculationType" type="String">Defines the type of calculation for the geometry.</field>
    /// <field name="geodesic" type="Boolean">If polylines are in geographic coordinate system, then geodesic needs to be set to true in order to calculate the ellipsoidal shortest path distance between each pair of the vertices in the polylines.</field>
    /// <field name="lengthUnit" type="esri.tasks.GeometryService constant">The length unit in which perimeters of polygons will be calculated.</field>
    /// <field name="polylines" type="Geometry[]">The array of polylines whose lengths are to be computed.</field>
};

esri.tasks.LinearUnit = function () {
    /// <summary>Creates a new LinearUnit object.</summary>
    /// <field name="distance" type="Number">Specifies the value of the linear distance</field>
    /// <field name="units" type="String">Specifies the unit type of the linear distance, such as "esriMeters", "esriMiles", "esriKilometers" etc</field>
};

esri.tasks.Locator = function (url) {
    /// <summary>Creates a new Locator object</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a locator service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <field name="outSpatialReference" type="SpatialReference">The spatial reference of the output geometries.</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a locator service.</field>
};

esri.tasks.Locator.prototype = 
{
    addressToLocations: function (params,callback,errback) {
        /// <summary>Sends a request to the ArcGIS REST geocode resource to find candidates for a single address specified in the address parameter.</summary>
        /// <param name="params" type="Object" optional="false">Specify the address and optionally specify the outFields and searchExtent. The searchExtent parameter requires a locator published with ArcGIS Server 10.1 or greater. &#60;Object&#62; address Required The address argument is data object that contains properties representing the various address fields accepted by the corresponding geocode service. These fields are listed in the addressFields property of the associated geocode service resource. For example, if the addressFields of a geocode service resource includes fields with the following names: Street, City, State and Zone, then the address argument is of the form: { Street: "&#60;street&#62;", City: "&#60;city&#62;", State: "&#60;state&#62;", Zone: "&#60;zone&#62;" } Locators published using ArcGIS 10 or later support a single line address field which can be specified using the following syntax where field_name is the name of the single line address field. You can find this name by viewing the help or services directory for your locator services. Common values are SingleLine and SingleLineFieldName: var address = {"field_name":"380 New York St, Redlands, CA 92373"}; View the Services Directory can be used to find out the required and optional address fields and the correct names for the input name fields. If you are using the World Geocoding Service visit the ArcGIS Online Geocoding Service help for more details on the World Geocoder. &#60;String[]&#62; outFields Optional The list of fields included in the returned result set. This list is a comma delimited list of field names. If you specify the shape field in the list of return fields, it is ignored. For non-intersection addresses you can specify the candidate fields as defined in the geocode service. For intersection addresses you can specify the intersection candidate fields. &#60;Extent&#62; searchExtent Optional Defines the extent within which the geocode server will search. Requires ArcGIS Server version 10.1 or greater. &#60;String&#62; magicKeyOptionalA suggestLocations result ID (magicKey). Used to query for a specific results information.&#60;Number&#62; distanceOptionalUsed in combination with "location" option to weight returned results within this distance (meters).&#60;Point&#62; locationOptionalUsed in combination with "distance" option to weight returned results for a specified area. (point)&#60;Number&#62; maxLocationsOptionalMaximum results to return from the query.&#60;Boolean&#62; forStorageOptionalAllows the results of single geocode transactions to be persisted.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onAddressToLocationsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    addressesToLocations: function (params,callback,errback) {
        /// <summary>Find address candidates for the input addresses.</summary>
        /// <param name="params" type="Object" optional="false">The input addresses in the format supported by the geocoding service. If the service supports 'Single Line Input' the input addresses will be in the following format: &#60;Array&#62; addresses The input addresses in the format supported by the geocode service. If the service supports 'Single Line Input' the input addresses will be in the following format: { "OBJECTID": 0, "Single Line Input":"440 Arguello Blvd, 94118" } </param>
        /// <param name="callback" type="Function" optional="false">The function to call when the method has completed. The arguments in the function are the same as the onAddressesToLocationsComplete event.</param>
        /// <param name="errback" type="Function" optional="false">The function to call if an error occurs on the server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    locationToAddress: function (location,distance,callback,errback) {
        /// <summary>Locates an address based on a given point.The return object of dojo.Deferred was added at v1.4</summary>
        /// <param name="location" type="Point" optional="false">The point at which to search for the closest address. The location should be in the same spatial reference as that of the geocode service.</param>
        /// <param name="distance" type="Number" optional="false">The distance in meters from the given location within which a matching address should be searched. If this parameter is not provided or an invalid value is provided, a default value of 0 meters is used.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onLocationToAddressComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    setOutSpatialReference: function (spatialReference) {
        /// <summary>Sets the well-known ID of the spatial reference of the output geometries</summary>
        /// <param name="spatialReference" type="SpatialReference" optional="false">The well-known ID of a spatial reference.{"wkid" : 4326} </param>
    },
};

esri.tasks.MultipartColorRamp = function () {
    /// <summary>Creates a new MultipartColorRamp object</summary>
    /// <field name="colorRamps" type="AlgorithmicColorRamp[]">Define an array of algorithmic color ramps used to generate the multi part ramp</field>
};

esri.tasks.MultipartColorRamp.prototype = 
{
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of a multipart color ramp</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.NAMessage = function () {

    /// <field name="description" type="String">A description of the network analyst message</field>
    /// <field name="type" type="Number">The network analyst message type, see constants table for a list of values</field>
};

esri.tasks.NAOutputLine = function () {

};

esri.tasks.NAOutputPolygon = function () {

};

esri.tasks.NATravelDirection = function () {

};

esri.tasks.NAUTurn = function () {

};

esri.tasks.OffsetParameters = function () {
    /// <summary>Creates a new OffsetParameters object.</summary>
    /// <field name="bevelRatio" type="Number">The bevelRatio is multiplied by the offset distance and the result determines how far a mitered offset intersection can be located before it is beveled.</field>
    /// <field name="geometries" type="Geometry[]">The array of geometries to be offset</field>
    /// <field name="offsetDistance" type="Number">Specifies the distance for constructing an offset based on the input geometries.</field>
    /// <field name="offsetHow" type="String">Set to one of the following options: esriGeometryOffsetBevelledSquares off the corner after a given ratio distance.</field>
    /// <field name="offsetUnit" type="String">The offset distance unit.</field>
};

esri.tasks.ParameterValue = function () {

    /// <field name="dataType" type="String">Specifies the type of data for the parameter.</field>
    /// <field name="value" type="Object">The value of the parameter.</field>
};

esri.tasks.PrintParameters = function () {
    /// <summary>Creates a new PrintParameters object</summary>
    /// <field name="extraParameters" type="Object">Additional parameters for the print service.</field>
    /// <field name="map" type="Map">The map to print</field>
    /// <field name="outSpatialReference" type="SpatialReference">Specify the output spatial reference for the printout</field>
    /// <field name="template" type="PrintTemplate">Defines the layout template used for the printed map</field>
};

esri.tasks.PrintTask = function (url,params) {
    /// <summary>Creates a new PrintTask object</summary>
    /// <param name="url" type="String" optional="false">The url to the Export Web Map Task. Requires ArcGIS Server 10.1 or later.</param>
    /// <param name="params" type="Object" optional="false">Parameters for the print task. See the options table below for details on the parameters.&#10;
    /// &#60;Boolean&#62; async</param>
    /// <field name="url" type="String">The url to the Export Web Map Task.</field>
};

esri.tasks.PrintTask.prototype = 
{
    execute: function (printParameters,callback,errback) {
        /// <summary>Sends a request to the print service resource to create a print page using the information specified in the printParameters argument.</summary>
        /// <param name="printParameters" type="PrintParameters" optional="true">A PrintParameters object that defines the printing options.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.PrintTemplate = function () {
    /// <summary>Creates a new PrintTemplate object</summary>
    /// <field name="exportOptions" type="Object">Define the map width, height and dpi.</field>
    /// <field name="format" type="String">The print output format</field>
    /// <field name="label" type="String">The text that appears on the PrintWidget's print button</field>
    /// <field name="layout" type="String">The layout used for the print output.</field>
    /// <field name="layoutOptions" type="Object">Define the layout elements using an object with the following properties: titleText The text used for the map title if the specified layout contains a title text element.</field>
    /// <field name="preserveScale" type="Boolean">Define whether the printed map will preserve the map scale or the map extent.</field>
    /// <field name="showAttribution" type="Boolean">When false, attribution is not displayed on the printout.</field>
};

esri.tasks.ProjectParameters = function () {
    /// <summary>Creates a new ProjectParameters object</summary>
    /// <field name="geometries" type="Geometry[]">The input geometries to project</field>
    /// <field name="outSR" type="SpatialReference">The spatial reference to which you are projecting the geometries</field>
    /// <field name="transformation" type="Object">The well-known id {wkid:number} or well-known text {wkt:string} or for the datum transfomation to be applied on the projected geometries.</field>
    /// <field name="transformationForward" type="Boolean">Indicates whether to transform forward or not.</field>
};

esri.tasks.Query = function () {
    /// <summary>Creates a new Query object used to execute a query on the layer resource identified by the URL</summary>
    /// <field name="geometry" type="Geometry">The geometry to apply to the spatial filter.</field>
    /// <field name="geometryPrecision" type="Number">Specify the number of decimal places for the geometries returned by the query operation</field>
    /// <field name="groupByFieldsForStatistics" type="String[]">One or more field names that will be used to group the statistics.</field>
    /// <field name="maxAllowableOffset" type="Number">The maximum allowable offset used for generalizing geometries returned by the query operation.</field>
    /// <field name="objectIds" type="Number[]">A comma delimited list of ObjectIds for the features in the layer/table that you want to query</field>
    /// <field name="orderByFields" type="String[]">One or more field names that will be used to order the query results.</field>
    /// <field name="outFields" type="String[]">Attribute fields to include in the FeatureSet.</field>
    /// <field name="outSpatialReference" type="SpatialReference">The spatial reference for the returned geometry.</field>
    /// <field name="outStatistics" type="StatisticDefinition[]">The definitions for one or more field-based statistic to be calculated.</field>
    /// <field name="pixelSize" type="Symbol">Specify the pixel level to be identified on the x and y axis.</field>
    /// <field name="relationParam" type="String">The 'Shape Comparison Language' string to evaluate.</field>
    /// <field name="returnGeometry" type="Boolean">If "true", each feature in the FeatureSet includes the geometry.</field>
    /// <field name="spatialRelationship" type="String">The spatial relationship to be applied on the input geometry while performing the query.</field>
    /// <field name="text" type="String">Shorthand for a where clause using "like".</field>
    /// <field name="timeExtent" type="TimeExtent">Specify a time extent for the query</field>
    /// <field name="where" type="String">A where clause for the query.</field>
};

esri.tasks.QueryTask = function (url,options) {
    /// <summary>Creates a new QueryTask object used to execute a query on the layer resource identified by the url</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a layer in a service. An example is http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Portland/Portland_ESRI_LandBase_AGO/MapServer/1. For more information on constructing a URL, see The Services Directory and the REST API.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;String&#62; gdbVersion</param>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service layer.</field>
};

esri.tasks.QueryTask.prototype = 
{
    execute: function (parameters,callback,errback) {
        /// <summary>Executes a Query against an ArcGIS Server map layer.</summary>
        /// <param name="parameters" type="Query" optional="false">Specifies the attributes and spatial filter of the query.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    executeForCount: function (query,callback,errback) {
        /// <summary>Get a count of the number of features that satisfy the input query.</summary>
        /// <param name="query" type="Query" optional="false">Specify the input query object.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onExecuteForCountComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution. (As of v1.3) </param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    executeForIds: function (parameters,callback,errback) {
        /// <summary>Executes a Query against an ArcGIS Server map layer.</summary>
        /// <param name="parameters" type="Query" optional="false">Specifies the attributes and spatial filter of the query.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onExecuteForIdsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    executeRelationshipQuery: function (parameters,callback,errback) {
        /// <summary>Executes a RelationshipQuery against an ArcGIS Server map layer (or table).</summary>
        /// <param name="parameters" type="RelationshipQuery" optional="false">Specifies the attributes and spatial filter of the query.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onExecuteRelationshipQueryComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.RasterData = function () {
    /// <summary>Creates a new RasterData object.</summary>
    /// <field name="format" type="String">Specifies the format of the raster data such as "jpg", "tif" etc</field>
    /// <field name="itemID" type="String">The ID of the uploaded file returned as a result of the upload operation.</field>
    /// <field name="url" type="String">URL to the location of the raster data file</field>
};

esri.tasks.RelationParameters = function () {
    /// <summary>Creates a new RelationParameter object</summary>
    /// <field name="geometries1" type="Geometry[]">The first array of geometries to compute the relations.</field>
    /// <field name="geometries2" type="Geometry[]">The second array of geometries to compute the relations.</field>
    /// <field name="relation" type="esri.tasks.RelationParameters constant">The spatial relationship to be tested between the two input geometry arrays.</field>
    /// <field name="relationParam" type="String">The 'Shape Comparison Language' string to evaluate.</field>
};

esri.tasks.RelationshipQuery = function () {
    /// <summary>Creates a new RelationshipQuery object</summary>
    /// <field name="definitionExpression" type="String">The definition expression to be applied to the related table or layer.</field>
    /// <field name="geometryPrecision" type="Number">Specify the number of decimal places for the geometries returned by the query operation</field>
    /// <field name="maxAllowableOffset" type="Number">The maximum allowable offset used for generalizing geometries returned by the query operation.</field>
    /// <field name="objectIds" type="Number[]">A comma delimited list of ObjectIds for the features in the layer/table that you want to query</field>
    /// <field name="outFields" type="String[]">Attribute fields to include in the FeatureSet.</field>
    /// <field name="outSpatialReference" type="SpatialReference">The spatial reference for the returned geometry.</field>
    /// <field name="relationshipId" type="Number">The ID of the relationship to test.</field>
    /// <field name="returnGeometry" type="Boolean">If "true", each feature in the FeatureSet includes the geometry.</field>
};

esri.tasks.RouteParameters = function () {
    /// <summary>Creates a new RouteParameters object</summary>
    /// <field name="accumulateAttributes" type="String[]">The list of network attribute names to be accumulated with the analysis, i.e.</field>
    /// <field name="attributeParameterValues" type="Object[]">Each element in the array is an object that describes the parameter values.</field>
    /// <field name="barriers" type="Object">The set of point barriers loaded as network locations during analysis.</field>
    /// <field name="directionsLanguage" type="String">The language used when computing directions.</field>
    /// <field name="directionsLengthUnits" type="String">The length units to use when computing directions.</field>
    /// <field name="directionsOutputType" type="String">Defines the amount of direction information returned.</field>
    /// <field name="directionsStyleName" type="String">The style to be used when returning directions.</field>
    /// <field name="directionsTimeAttribute" type="String">The name of network attribute to use for the drive time when computing directions.</field>
    /// <field name="doNotLocateOnRestrictedElements" type="Boolean">If true, avoids network elements restricted by barriers or due to restrictions specified in restrictionAttributes</field>
    /// <field name="findBestSequence" type="Boolean">If true, optimizes the order of the stops in the route while taking into account preserveFirstStop and preserveLastStop, if they are set to true.</field>
    /// <field name="ignoreInvalidLocations" type="Boolean">In routes where a stop is not located on a network or a stop could not be reached, the results will differ depending on the value of ignoreInvalidLocations.</field>
    /// <field name="impedanceAttribute" type="String">The network attribute name to be used as the impedance attribute in analysis.</field>
    /// <field name="outSpatialReference" type="SpatialReference">The well-known ID of the spatial reference for the geometries returned with the analysis results.</field>
    /// <field name="outputGeometryPrecision" type="Number">The precision of the output geometry after generalization.</field>
    /// <field name="outputGeometryPrecisionUnits" type="String">The units of the output geometry precision.</field>
    /// <field name="outputLines" type="String">The type of output lines to be generated in the result.</field>
    /// <field name="polygonBarriers" type="Object">The set of polygon barriers loaded as network locations during analysis.</field>
    /// <field name="polylineBarriers" type="Object">The set of polyline barriers loaded as network locations during analysis.</field>
    /// <field name="preserveFirstStop" type="Boolean">If true, keeps the first stop fixed in the sequence even when findBestSequence is true.</field>
    /// <field name="preserveLastStop" type="Boolean">If true, keeps the last stop fixed in the sequence even when findBestSequence is true.</field>
    /// <field name="restrictUTurns" type="String">Specifies how U-Turns should be handled.</field>
    /// <field name="restrictionAttributes" type="String[]">The list of network attribute names to be used as restrictions with the analysis.</field>
    /// <field name="returnBarriers" type="Boolean">If true, barriers are returned as the second parameter of RouteTask.onSolveComplete</field>
    /// <field name="returnDirections" type="Boolean">If true, directions are generated and returned in the directions property of each RouteResult.</field>
    /// <field name="returnPolygonBarriers" type="Boolean">If true, polygon barriers are returned as the third parameter of RouteTask.onSolveComplete</field>
    /// <field name="returnPolylineBarriers" type="Boolean">If true, polyline barriers are returned as the fourth parameter of RouteTask.onSolveComplete</field>
    /// <field name="returnRoutes" type="Boolean">If true, routes are generated and returned in the route property of each RouteResult</field>
    /// <field name="returnStops" type="Boolean">If true, stops are returned in the stops property of each RouteResult</field>
    /// <field name="startTime" type="Date">The time the route begins.</field>
    /// <field name="startTimeIsUTC" type="Boolean">Start time is in UTC format.</field>
    /// <field name="stops" type="Object">The set of stops loaded as network locations during analysis.</field>
    /// <field name="useHierarchy" type="Boolean">If true, the hierarchy attribute for the network should be used in analysis.</field>
    /// <field name="useTimeWindows" type="Boolean">If true, time windows should be used in the analysis.</field>
};

esri.tasks.RouteResult = function () {

    /// <field name="directions" type="DirectionsFeatureSet">Route directions are returned if RouteParameters.returnDirections is set to true.</field>
    /// <field name="route" type="Graphic">The Route graphic that is returned if RouteParameters.returnRoutes is true.</field>
    /// <field name="routeName" type="String">The name of the route</field>
    /// <field name="stops" type="Graphic[]">Array of stops.</field>
};

esri.tasks.RouteTask = function (url) {
    /// <summary>Creates a new RouteTask object</summary>
    /// <param name="url" type="String" optional="false">URL to the ArcGIS Server REST resource that represents a network analysis service. To obtain the URL, use Services Directory.</param>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a network analysis service.</field>
};

esri.tasks.RouteTask.prototype = 
{
    solve: function (params,callback,errback) {
        /// <summary>Solves the route against the route layer with the route parameters</summary>
        /// <param name="params" type="RouteParameters" optional="false">Route parameters used as input to generate the route.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onSolveComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.ServiceAreaParameters = function () {
    /// <summary>Creates a new ServiceAreaParameters object</summary>
    /// <field name="accumulateAttributes" type="String[]">The list of network attribute names to be accumulated with the analysis, i.e., which attributes should be returned as part of the response.</field>
    /// <field name="attributeParameterValues" type="Object[]">A set of attribute parameter values that can be parameterized to determine which network elements can be used by a vehicle.</field>
    /// <field name="defaultBreaks" type="Number[]">An array of numbers defining the breaks.</field>
    /// <field name="doNotLocateOnRestrictedElements" type="Boolean">When true, restricted network elements should be considered when finding network locations.</field>
    /// <field name="excludeSourcesFromPolygons" type="String[]">An array of network source names to NOT use when generating polygons.</field>
    /// <field name="facilities" type="Object">The set of facilities loaded as network locations during analysis.</field>
    /// <field name="impedanceAttribute" type="String">The network attribute name used as the impedance attribute in analysis.</field>
    /// <field name="mergeSimilarPolygonRanges" type="Boolean">If true, similar ranges will be merged in the result polygons</field>
    /// <field name="outSpatialReference" type="SpatialReference">The well-known ID of the spatial reference for the geometries returned with the analysis results.</field>
    /// <field name="outputGeometryPrecision" type="Number">The precision of the output geometry after generalization.</field>
    /// <field name="outputGeometryPrecisionUnits" type="String">The units of the output geometry precision.</field>
    /// <field name="outputLines" type="String">The type of output lines to be generated in the result.</field>
    /// <field name="outputPolygons" type="String">The type of output polygons to be generated in the result.</field>
    /// <field name="overlapLines" type="Boolean">Indicates if the lines should overlap from multiple facilities.</field>
    /// <field name="overlapPolygons" type="Boolean">Indicates if the polygons should overlap from multiple facilities.</field>
    /// <field name="pointBarriers" type="Object">The set of point barriers loaded as network locations during analysis.</field>
    /// <field name="polygonBarriers" type="Object">The set of polygons barriers loaded as network locations during analysis.</field>
    /// <field name="polylineBarriers" type="Object">The set of polyline barriers loaded as network locations during analysis.</field>
    /// <field name="restrictUTurns" type="String">Specifies how U-Turns should be handled.</field>
    /// <field name="restrictionAttributes" type="String[]">The list of network attribute names to be used as restrictions with the analysis.</field>
    /// <field name="returnFacilities" type="Boolean">If true, facilities will be returned with the analysis results.</field>
    /// <field name="returnPointBarriers" type="Boolean">If true, barriers will be returned in the barriers property of ClosestFacilitySolveResult.The default value is false</field>
    /// <field name="returnPolygonBarriers" type="Boolean">If true, polygon barriers will be returned in the polygonBarriers property of ClosestFacilitySolveResult.The default value is false</field>
    /// <field name="returnPolylineBarriers" type="Boolean">If true, polyline barriers will be returned in the polylineBarriers property of ClosestFacilitySolveResult.The default value is false</field>
    /// <field name="splitLinesAtBreaks" type="Boolean">If true, lines will be split at breaks</field>
    /// <field name="splitPolygonsAtBreaks" type="Boolean">If true, polygons will be split at breaks</field>
    /// <field name="timeOfDay" type="Date">Local date and time at the facility.</field>
    /// <field name="travelDirection" type="String">Options for traveling to or from the facility.</field>
    /// <field name="trimOuterPolygon" type="Boolean">If true, the outermost polygon (at the maximum break value) will be trimmed.</field>
    /// <field name="trimPolygonDistance" type="Number">If polygons are being trimmed, provides the distance to trim.</field>
    /// <field name="trimPolygonDistanceUnits" type="String">If polygons are being trimmed, specifies the units of the trimPolygonDistance.</field>
    /// <field name="useHierarchy" type="Boolean">When true, the hierarchy attributes for the network will be used in analysis.</field>
};

esri.tasks.ServiceAreaSolveResult = function () {

    /// <field name="facilities" type="Point[]">Array of points, only returned if ServiceAreaParameters.returnFacilities is set to true</field>
    /// <field name="messages" type="NAMessage">Message received when solve is completed.</field>
    /// <field name="pointBarriers" type="Point[]">The point barriers are an array of points.</field>
    /// <field name="polygonBarriers" type="Polygon[]">The polygon barriers are an array of polygons.</field>
    /// <field name="polylineBarriers" type="Polyline[]">The polyline barriers are an array of polylines.</field>
    /// <field name="serviceAreaPolygons" type="Graphics[]">Array of service area polygon graphics.</field>
    /// <field name="serviceAreaPolylines" type="Graphics[]">Array of service area polyline graphics.</field>
};

esri.tasks.ServiceAreaTask = function () {
    /// <summary>Creates a new ServiceAreaTask object</summary>
};

esri.tasks.ServiceAreaTask.prototype = 
{
    solve: function (params,callback,errback) {
        /// <summary>Solve the service area</summary>
        /// <param name="params" type="ServiceAreaParameters" optional="false">The ServiceAreaParameters object.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onSolveComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs on the Server during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
};

esri.tasks.StatisticDefinition = function () {
    /// <summary>Creates a new StatisticDefinition object</summary>
    /// <field name="onStatisticField" type="String">Define the field on which statistics will be calculated</field>
    /// <field name="outStatisticFieldName" type="String">Specify the output field name.</field>
    /// <field name="statisticType" type="String">Define the type of statistic</field>
};

esri.tasks.TrimExtendParameters = function () {
    /// <summary>Creates a new TrimExtendParameters object.</summary>
    /// <field name="extendHow" type="String">A flag used along with the trimExtend operation.</field>
    /// <field name="polylines" type="Polyline[]">The array of polylines to trim or extend.</field>
    /// <field name="trimExtendTo" type="Polyline">A polyline used as a guide for trimming or extending input polylines.</field>
};

esri.tasks.UniqueValueDefinition = function () {
    /// <summary>Creates a new UniqueValueDefinition object</summary>
    /// <field name="attributeField" type="String">Attribute field renderer uses to match values.</field>
    /// <field name="attributeField2" type="String">The name of the field that contains unique values when combined with the values specified by attributeField</field>
    /// <field name="attributeField3" type="String">The name of the field that contains unique values when combined with the values specified by attributeField and attributeField2</field>
    /// <field name="baseSymbol" type="Symbol">Define a default symbol for the classification.</field>
    /// <field name="colorRamp" type="AlgorithmicColorRamp || MultiFieldColorRamp">Define a color ramp for the classification.</field>
};

esri.tasks.UniqueValueDefinition.prototype = 
{
    toJson: function () {
        /// <summary>Returns an easily serializable object representation of the unique value definition</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.geoenrichment = function () {
    /// <summary>The esri.tasks.geoenrichment namespace.</summary>
};

esri.tasks.geoenrichment.AddressStudyArea = function () {

    /// <field name="attributes" type="Attributes">The address key value pairs to geocode to obtain this study area</field>
    /// <field name="comparisonGeographyLevels" type="GeographyLevel[]">The identifiers for layers used to find comparison geographies</field>
    /// <field name="options" type="RingBuffer | DriveBuffer | IntersectingGeographies">The options to apply to the study area</field>
    /// <field name="returnGeometry" type="Boolean">If true, geometry will be returned</field>
};

esri.tasks.geoenrichment.AddressStudyArea.prototype = 
{
    constructor: function (json) {
        /// <summary>Constructs instance from serialized state</summary>
        /// <param name="json" type="Object" optional="false">A json object used to construct the instance.</param>
    },
    toJson: function () {
        /// <summary>Converts object to its JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.geoenrichment.DriveBuffer = function (params) {
    /// <summary>Constructs a DriveBuffer</summary>
    /// <param name="params" type="Object" optional="false">Various optional parameters that can be used to configure this class.</param>
    /// <field name="radius" type="Number[]">The radii to use to create ring buffers</field>
    /// <field name="units" type="DriveUnits | String">The units of the radii.</field>
};

esri.tasks.geoenrichment.DriveUnits = function () {

};

esri.tasks.geoenrichment.GeographyLevel = function (json) {
    /// <summary>Create a GeographyLevel objct</summary>
    /// <param name="json" type="Object" optional="true">Various options to configure this GeographyLevel. Any property can be passed into this object.</param>
    /// <field name="countryID" type="String">The ID of the country for which data is retrieved.</field>
    /// <field name="datasetID" type="String">The ID of the dataset to which variables used in this GeographyLevel belong.</field>
    /// <field name="layerID" type="String">The ID of the layer.</field>
};

esri.tasks.geoenrichment.GeometryStudyArea = function () {
    /// <summary>Constructs a GeometryStudyArea</summary>
    /// <field name="attributes" type="String">Attributes of the study area</field>
    /// <field name="comparisonGeographyLevels" type="GeographyLevel[]">The identifiers for layers used to find comparison geographies</field>
    /// <field name="geometry" type="Geometry">The geometry for this study area</field>
    /// <field name="options" type="RingBuffer | DriveBuffer | IntersectingGeographies">The options to apply to the study area</field>
    /// <field name="returnGeometry" type="Boolean">If true, geometry will be returned</field>
};

esri.tasks.geoenrichment.GeometryStudyArea.prototype = 
{
    constructor: function (json) {
        /// <summary>Constructs instance from serialized state</summary>
        /// <param name="json" type="Object" optional="false">A json object used to construct the instance.</param>
    },
    toJson: function () {
        /// <summary>Converts object to its JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.geoenrichment.IntersectingGeographies = function () {

    /// <field name="levels" type="GeographyLevel[]">The layers from which intersecting geographies should be used as study areas</field>
};

esri.tasks.geoenrichment.RingBuffer = function (params) {
    /// <summary>Constructs a RingBuffer</summary>
    /// <param name="params" type="Object" optional="false">Various optional parameters that can be used to configure this class.</param>
    /// <field name="radii" type="Number[]">The radii to use to create ring buffers</field>
    /// <field name="units" type="Units">The units of the radii</field>
};

esri.tasks.geoenrichment.StandardGeographyStudyArea = function () {

    /// <field name="attributes" type="String">Attributes of the study area</field>
    /// <field name="comparisonGeographyLevels" type="GeographyLevel[]">The identifiers for layers used to find comparison geographies</field>
    /// <field name="countryID" type="String">The country to which this geography belongs</field>
    /// <field name="geographyLayerID" type="String">The ID of the standard geography layer</field>
    /// <field name="ids" type="String[]">The IDs of the standard geographies</field>
    /// <field name="options" type="RingBuffer | DriveBuffer | IntersectingGeographies">The options to apply to the study area</field>
    /// <field name="returnGeometry" type="Boolean">If true, geometry will be returned</field>
};

esri.tasks.geoenrichment.StandardGeographyStudyArea.prototype = 
{
    constructor: function (json) {
        /// <summary>Constructs instance from serialized state</summary>
        /// <param name="json" type="Object" optional="false">A json object used to construct the instance.</param>
    },
    toJson: function () {
        /// <summary>Converts object to its JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.tasks.geoenrichment.StudyArea = function () {

    /// <field name="attributes" type="String">Attributes of the study area</field>
    /// <field name="comparisonGeographyLevels" type="GeographyLevel[]">The identifiers for layers used to find comparison geographies</field>
    /// <field name="options" type="RingBuffer | DriveBuffer | IntersectingGeographies">The options to apply to the study area</field>
    /// <field name="returnGeometry" type="Boolean">If true, geometry will be returned</field>
};

esri.tasks.geoenrichment.StudyArea.prototype = 
{
    constructor: function (json) {
        /// <summary>Constructs instance from serialized state</summary>
        /// <param name="json" type="Object" optional="false">A json object used to construct the instance.</param>
    },
    toJson: function () {
        /// <summary>Converts object to its JSON representation</summary>
        /// <return type="Object">Object</return>
    },
};

esri.toolbars = function () {
    /// <summary>The esri.toolbars namespace.</summary>
};

esri.toolbars.Draw = function (map,options) {
    /// <summary>Creates a new Draw object.</summary>
    /// <param name="map" type="Map" optional="false">Map the toolbar is associated with.</param>
    /// <param name="options" type="Object" optional="false">Parameters that define the functionality of the draw toolbar. See the options for a list of valid values.&#10;
    /// &#60;Number&#62; drawTime&#10;
    /// &#60;Boolean&#62; showTooltips&#10;
    /// &#60;Number&#62; tolerance&#10;
    /// &#60;Number&#62; tooltipOffset</param>
    /// <field name="fillSymbol" type="SimpleFillSymbol">Symbol to be used when drawing a Polygon or Extent</field>
    /// <field name="lineSymbol" type="SimpleLineSymbol">Symbol to be used when drawing a Polyline</field>
    /// <field name="markerSymbol" type="SimpleMarkerSymbol">Symbol to be used when drawing a Point or Multipoint</field>
    /// <field name="respectDrawingVertexOrder" type="Boolean">When set to false, the geometry is modified to be topologically correct.</field>
};

esri.toolbars.Draw.prototype = 
{
    activate: function (geometryType,options) {
        /// <summary>Activates the toolbar for drawing geometries.</summary>
        /// <param name="geometryType" type="String" optional="false">The type of geometry drawn. See the Constants table for valid values.</param>
        /// <param name="options" type="Object" optional="true">Options that define the functionality of the draw toolbar. &#60;Number&#62; drawTime Determines how much time to wait before adding a new point when using a freehand tool. The default value is 75. &#60;Boolean&#62; showTooltips If true, tooltips are displayed when creating new graphics with the draw toolbar. The default value is true. &#60;Number&#62; tolerance Determines how far the mouse moves before adding a new point when using one of the freehand tools. The default value is 8. &#60;Number&#62; tooltipOffset Determines how farm to offset the tool tip from the mouse pointer. The default value is 15. </param>
    },
    deactivate: function () {
        /// <summary>Deactivates the toolbar and reactivates map navigation</summary>
    },
    finishDrawing: function () {
        /// <summary>Finishes drawing the geometry and fires the onDrawEnd event.</summary>
    },
    setFillSymbol: function (fillSymbol) {
        /// <summary>Sets the fill symbol</summary>
        /// <param name="fillSymbol" type="FillSymbol" optional="false">The fill symbol.</param>
    },
    setLineSymbol: function (lineSymbol) {
        /// <summary>Sets the line symbol</summary>
        /// <param name="lineSymbol" type="LineSymbol" optional="false">The line symbol.</param>
    },
    setMarkerSymbol: function (markerSymbol) {
        /// <summary>Sets the marker symbol</summary>
        /// <param name="markerSymbol" type="MarkerSymbol" optional="false">The marker symbol.</param>
    },
    setRespectDrawingVertexOrder: function (set) {
        /// <summary>Sets whether the polygon geometry should be modified to be topologically correct</summary>
        /// <param name="set" type="Boolean" optional="false">When set to false, the geometry is modified to be topologically correct. When set to true, the input geometry is not modified.</param>
    },
};

esri.toolbars.Edit = function (map,options) {
    /// <summary>Creates a new Edit object.</summary>
    /// <param name="map" type="Map" optional="false">Map the toolbar is associated with.</param>
    /// <param name="options" type="Object" optional="true">Optional parameters. See options list.&#10;
    /// &#60;Boolean&#62; allowAddVertices&#10;
    /// &#60;Boolean&#62; allowDeletevertices&#10;
    /// &#60;LineSymbol&#62; ghostLineSymbol&#10;
    /// &#60;MarkerSymbol&#62; ghostVertexSymbol&#10;
    /// &#60;Boolean&#62; uniformScaling&#10;
    /// &#60;MarkerSymbol&#62; vertexSymbol</param>
};

esri.toolbars.Edit.prototype = 
{
    activate: function (tool,graphic,options) {
        /// <summary>Activates the toolbar to edit the supplied graphic.</summary>
        /// <param name="tool" type="String" optional="false">Specify the active tool(s). Combine tools using the | operator. See the Constants table for a list of valid values.</param>
        /// <param name="graphic" type="Graphic" optional="false">The graphic to edit.</param>
        /// <param name="options" type="Object" optional="true">The following properties are valid options: Value Description Valid geometry allowAddVertices Specifies whether users can add new vertices. Polyline, Polygon allowDeleteVertices Specifies whether users can delete vertices. Polyline, Polygon, Multipoint ghostVertexSymbol MarkerSymbol for insertable vertices. Polyline, Polygon ghostLineSymbol LineSymbol for guide lines, displayed when moving vertices. Polyline, Polygon vertexSymbol MarkerSymbol for vertices. Polyline, Polygon uniformScaling Boolean </param>
    },
    deactivate: function () {
        /// <summary>Deactivates the toolbar.</summary>
    },
    getCurrentState: function () {
        /// <summary>An object with the following properties that describe the current state.</summary>
        /// <return type="Object">Object</return>
    },
    refresh: function () {
        /// <summary>Refreshes the internal state of the toolbar</summary>
    },
};

esri.toolbars.Navigation = function (map) {
    /// <summary>Creates a new Navigation object.</summary>
    /// <param name="map" type="Map" optional="false">Map the toolbar is associated with.</param>
};

esri.toolbars.Navigation.prototype = 
{
    activate: function (navType) {
        /// <summary>Activates the toolbar for map navigation.</summary>
        /// <param name="navType" type="String" optional="false">The navigation type. The Constants table lists valid navigation values.</param>
    },
    deactivate: function () {
        /// <summary>Deactivates the toolbar and reactivates map navigation</summary>
    },
    isFirstExtent: function () {
        /// <summary>When "true", map is at the first extent</summary>
        /// <return type="Boolean">Boolean</return>
    },
    isLastExtent: function () {
        /// <summary>When "true", map is at the last extent</summary>
        /// <return type="Boolean">Boolean</return>
    },
    setZoomSymbol: function (symbol) {
        /// <summary>Set the SimpleFillSymbol used for the rubber band zoom</summary>
        /// <param name="symbol" type="Symbol" optional="false">The SimpleFillSymbol used for the rubber band zoom.</param>
    },
    zoomToFullExtent: function () {
        /// <summary>Zoom to full extent of base layer</summary>
    },
    zoomToNextExtent: function () {
        /// <summary>Zoom to next extent in extent history</summary>
    },
    zoomToPrevExtent: function () {
        /// <summary>Zoom to previous extent in extent history</summary>
    },
};

esri.virtualearth = function () {
    /// <summary>The esri.virtualearth namespace.</summary>
};

esri.virtualearth.VEAddress = function () {

    /// <field name="addressLine" type="String">Specifies the street line of an address.</field>
    /// <field name="adminDistrict" type="String">Specifies the subdivision name within the country or region for an address.</field>
    /// <field name="countryRegion" type="String">Specifies the country or region name of an address</field>
    /// <field name="district" type="String">Specifies the higher level administrative subdivision used in some countries or regions</field>
    /// <field name="formattedAddress" type="String">Contains the complete address</field>
    /// <field name="locality" type="String">Specifies the populated place for the address.</field>
    /// <field name="postalCode" type="String">Specifies the post code, postal code, or ZIP Code of an address</field>
    /// <field name="postalTown" type="String">Specifies the postal city of an address</field>
};

esri.virtualearth.VEGeocodeResult = function () {

    /// <field name="address" type="VEAddress">Specifies address properties for the result</field>
    /// <field name="bestView" type="Extent">Best extent for displaying the result</field>
    /// <field name="calculationMethod" type="String">Contains values that indicate the geocode method used to match the location to the map.</field>
    /// <field name="confidence" type="String">Value indicating how confident the service is about the result.</field>
    /// <field name="displayName" type="String">Contains a display name for the result</field>
    /// <field name="entityType" type="String">Further refines the geocode results that have been returned.</field>
    /// <field name="location" type="Point">The X and Y coordinates of the result in decimal degrees</field>
    /// <field name="matchCodes" type="String">An array of values that indicate the geocoding level of the location match.</field>
};

esri.virtualearth.VEGeocoder = function (options) {
    /// <summary>Creates a new VEGeocoder object</summary>
    /// <param name="options" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;String&#62; bingMapsKey&#10;
    /// &#60;String&#62; culture</param>
    /// <field name="culture" type="String">Specifies the culture in which to return results.</field>
};

esri.virtualearth.VEGeocoder.prototype = 
{
    addressToLocations: function (query,callback,errback) {
        /// <summary>Sends a geocode request to Bing Maps to find candidates for a single address specified in the query argument.</summary>
        /// <param name="query" type="String" optional="false">The address to locate.</param>
        /// <param name="callback" type="Function" optional="true">The function to call when the method has completed. The arguments in the function are the same as the onAddressToLocationsComplete event.</param>
        /// <param name="errback" type="Function" optional="true">An error object is returned if an error occurs during task execution.</param>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    setCulture: function (culture) {
        /// <summary>Sets the culture in which to return results</summary>
        /// <param name="culture" type="String" optional="false">The culture value. The default value is "en-US". For a list of supported cultures, see http://msdn.microsoft.com/en-us/library/cc981048.aspx.</param>
    },
};

esri.virtualearth.VETiledLayer = function (options) {
    /// <summary>Creates a new VETiledLayer object</summary>
    /// <param name="options" type="Object" optional="false">See options list for parameters.&#10;
    /// &#60;String&#62; bingMapsKey&#10;
    /// &#60;String&#62; className&#10;
    /// &#60;String&#62; culture&#10;
    /// &#60;String&#62; mapStyle&#10;
    /// &#60;Number&#62; refreshInterval</param>
    /// <field name="attributionDataUrl" type="String">The URL, when available, where the layer's attribution data is stored</field>
    /// <field name="className" type="String">class attribute of the layer's node</field>
    /// <field name="copyright" type="String">The copyright text</field>
    /// <field name="credential" type="Credential">Provides credential information for the layer such as userid and token if the layer represents a resource that is secured with token-based authentication.</field>
    /// <field name="culture" type="String">Specifies the culture in which to return results.</field>
    /// <field name="fullExtent" type="Extent">Full extent as defined by the map service</field>
    /// <field name="hasAttributionData" type="Boolean">When true the layer has attribution data.</field>
    /// <field name="id" type="String">ID assigned to the layer.</field>
    /// <field name="initialExtent" type="Extent">Initial extent as defined by the map service</field>
    /// <field name="loaded" type="Boolean">When the layer is loaded, the value becomes "true", and layer properties can be accessed.</field>
    /// <field name="mapStyle" type="String">Bing Maps style.</field>
    /// <field name="maxScale" type="Number">Maximum visible scale for the layer.</field>
    /// <field name="minScale" type="Number">Minimum visible scale for the layer.</field>
    /// <field name="opacity" type="Number">Opacity or transparency of layer.</field>
    /// <field name="refreshInterval" type="Number">Refresh interval of the layer in minutes.</field>
    /// <field name="showAttribution" type="Boolean">When true the layer's attribution is displayed on the map.</field>
    /// <field name="spatialReference" type="SpatialReference">The spatial reference of the map service.</field>
    /// <field name="suspended" type="Boolean">When true the layer is suspended.</field>
    /// <field name="tileInfo" type="TileInfo">Returns TileInfo, which has information on the tiling schema</field>
    /// <field name="url" type="String">URL to the ArcGIS Server REST resource that represents a map service.</field>
    /// <field name="visible" type="Boolean">Visibility of the layer</field>
    /// <field name="visibleAtMapScale" type="Boolean">When true, the layer is visible at the current map scale</field>
};

esri.virtualearth.VETiledLayer.prototype = 
{
    attr: function (name,value) {
        /// <summary>Adds a new attribute or changes the value of an existing attribute on the layer's node.</summary>
        /// <param name="name" type="String" optional="false">The name of the attribute.</param>
        /// <param name="value" type="The attribute's value type" optional="false">The value of the attribute. Set this value as null to remove the attribute.</param>
        /// <return type="Layer">Layer</return>
    },
    getAttributionData: function () {
        /// <summary>Asynchrously returns custom data for the layer when available</summary>
        /// <return type="dojo.Deferred">dojo.Deferred</return>
    },
    getMap: function () {
        /// <summary>Returns reference to the map control the layer is added to.</summary>
        /// <return type="Map">Map</return>
    },
    getNode: function () {
        /// <summary>Returns the layer's DOM node</summary>
        /// <return type="HTMLElement">HTMLElement</return>
    },
    getTileUrl: function (level,row,column) {
        /// <summary>Method to implement when extending TiledMapServiceLayer.</summary>
        /// <param name="level" type="Number" optional="false">Requested tile's level.</param>
        /// <param name="row" type="Number" optional="false">Requested tile's row.</param>
        /// <param name="column" type="Number" optional="false">Requested tile's column.</param>
        /// <return type="String">String</return>
    },
    hide: function () {
        /// <summary>Sets the visibility of the layer to "false".</summary>
    },
    isVisibleAtScale: function (scale) {
        /// <summary>Returns true if the layer is visible at the given scale</summary>
        /// <param name="scale" type="Number" optional="false">The scale at which to check if the layer is visible.</param>
        /// <return type="Boolean">Boolean</return>
    },
    refresh: function () {
        /// <summary>Reloads all the tiles in the current view</summary>
    },
    resume: function () {
        /// <summary>Resumes layer drawing</summary>
    },
    setCulture: function (culture) {
        /// <summary>Sets the culture in which to return results</summary>
        /// <param name="culture" type="String" optional="false">The culture value. The default value is "en-US". For a list of supported cultures, see http://msdn.microsoft.com/en-us/library/cc981048.aspx.</param>
    },
    setMapStyle: function (style) {
        /// <summary>Sets the Bing Maps style</summary>
        /// <param name="style" type="String" optional="false">Bing Maps style. See Constants table for valid values.</param>
    },
    setMaxScale: function (scale) {
        /// <summary>Set the maximum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setMinScale: function (scale) {
        /// <summary>Set the minimum scale for the layer</summary>
        /// <param name="scale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
    },
    setOpacity: function () {
        /// <summary>Sets the opacity of the layer.</summary>
    },
    setRefreshInterval: function (interval) {
        /// <summary>Changes the layer's refresh interval to the given value (in minutes).</summary>
        /// <param name="interval" type="Number" optional="false">Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled.</param>
        /// <return type="Layer">Layer</return>
    },
    setScaleRange: function (minScale,maxScale) {
        /// <summary>Set the scale range for the layer.</summary>
        /// <param name="minScale" type="Number" optional="false">The minimum scale at which the layer is visible.</param>
        /// <param name="maxScale" type="Number" optional="false">The maximum scale at which the layer is visible.</param>
    },
    setVisibility: function (isVisible) {
        /// <summary>Sets the visibility of the layer.</summary>
        /// <param name="isVisible" type="Boolean" optional="false">Set the visibility of the layer.</param>
    },
    show: function () {
        /// <summary>Sets the visibility of the layer to "true"</summary>
    },
    suspend: function () {
        /// <summary>Suspends layer drawing</summary>
    },
};