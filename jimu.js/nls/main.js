define({
  root: {
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      next: 'Next',
      back: 'Back'
    },

    errorCode: "Code",
    errorMessage: "Message",
    errorDetail: "Detail",
    widgetPlaceholderTooltip: "To set it up, go to Widgets and click corresponding placeholder",

    tokenUtils:{
      changeHostTip:'Please use your server name instead of localhost to sign in when you use IE.'
    },

    oauthHelper:{
      signInBlockedTip:'The login window is blocked by the browser. Please set the browser to allow pop-up, then refresh browser.'
    },

    symbolChooser:{
      preview:'Preview',
      basic:'Basic',
      arrows:'Arrows',
      business:'Business',
      cartographic:'Cartographic',
      nationalParkService:'National Park Service',
      outdoorRecreation:'Outdoor Recreation',
      peoplePlaces:'People Places',
      safetyHealth:'Safety Health',
      shapes:'Shapes',
      transportation:'Transportation',
      symbolSize:'Symbol Size',
      color:'Color',
      alpha:'Alpha',
      outlineColor:'Outline Color',
      outlineWidth:'Outline Width',
      style:'Style',
      width:'Width',
      text:'Text',
      fontColor:'Font Color',
      fontSize:'Font Size'
    },

    rendererChooser:{
      use:'Use',
      singleSymbol:'A Single Symbol',
      uniqueSymbol:'Unique Symbols',
      color:'Color',
      size:'Size',
      toShow:'To Show',
      colors:'Colors',
      classes:'Classes',
      symbolSize:'Symbol Size',
      addValue:'Add Value',
      setDefaultSymbol:'Set Default Symbol',
      defaultSymbol:'Default Symbol',
      selectedSymbol:'Selected Symbol',
      value:'Value',
      label:'Label',
      range:'Range'
    },

    drawBox:{
      point: "Point",
      line: "Line",
      polyline: "Polyline",
      freehandPolyline: "Freehand Polyline",
      triangle: "Triangle",
      extent: "Extent",
      circle: "Circle",
      ellipse: "Ellipse",
      polygon: "Polygon",
      freehandPolygon: "Freehand Polygon",
      text: "Text",
      clear: "Clear"
    },

    popupConfig: {
      title: "Title",
      add: "Add",
      fields: "Fields",
      noField: "No Field",
      visibility: "Visible",
      name: "Name",
      alias: "Alias",
      actions: "Actions"
    },

    includeButton: {
      include: "Include"
    },

    loadingShelter: {
      loading: "Loading"
    },

    basicServiceBrowser: {
      noServicesFound: 'No service found.',
      unableConnectTo: 'Unable to connect to'
    },

    serviceBrowser: {
      noGpFound: 'No geoprocessing service found.',
      unableConnectTo: 'Unable to connect to'
    },

    layerServiceBrowser: {
      noServicesFound: 'No map service or feature service found',
      unableConnectTo: 'Unable to connect to'
    },

    basicServiceChooser: {
      validate: "Validate",
      example: "Example",
      set: "Set"
    },

    urlInput: {
      invalidUrl: 'Invalid URL.'
    },

    filterBuilder: {
      addAnotherExpression: "Add another expression",
      addSet: "Add a set",
      matchMsg: "Display features in the layer that match ${any_or_all} of the following expressions",
      matchMsgSet: "${any_or_all} of the following expressions in this set are true",
      all: "All",
      any: "Any",
      value: "Value",
      field: "Field",
      unique: "Unique",
      none: "None",
      and: "and",
      valueTooltip: "Enter value",
      fieldTooltip: "Pick from existing field",
      uniqueValueTooltip: "Pick from unique values in selected field",
      friendlyDatePattern: "MM/dd/yyyy",
      stringOperatorIs: "is", // e.g. <stringFieldName> is 'California'
      stringOperatorIsNot: "is not",
      stringOperatorStartsWith: "starts with",
      stringOperatorEndsWith: "ends with",
      stringOperatorContains: "contains",
      stringOperatorDoesNotContain: "does not contain",
      stringOperatorIsBlank: "is blank",
      stringOperatorIsNotBlank: "is not blank",
      dateOperatorIsOn: "is on", // e.g. <dateFieldName> is on '1/1/2012'
      dateOperatorIsNotOn: "is not on",
      dateOperatorIsBefore: "is before",
      dateOperatorIsAfter: "is after",
      dateOperatorDays: "days",
      dateOperatorWeeks: "weeks", // e.g. <dateFieldName> is the last 4 weeks
      dateOperatorMonths: "months",
      dateOperatorInTheLast: "in the last",
      dateOperatorNotInTheLast: "not in the last",
      dateOperatorIsBetween: "is between",
      dateOperatorIsNotBetween: "is not between",
      dateOperatorIsBlank: "is blank",
      dateOperatorIsNotBlank: "is not blank",
      numberOperatorIs: "is", // e.g. <numberFieldName> is 1000
      numberOperatorIsNot: "is not",
      numberOperatorIsAtLeast: "is at least",
      numberOperatorIsLessThan: "is less than",
      numberOperatorIsAtMost: "is at most",
      numberOperatorIsGreaterThan: "is greater than",
      numberOperatorIsBetween: "is between",
      numberOperatorIsNotBetween: "is not between",
      numberOperatorIsBlank: "is blank",
      numberOperatorIsNotBlank: "is not blank",
      string: "String",
      number: "Number",
      date: "Date",
      askForValues: "Ask for values",
      prompt: "Prompt",
      hint: "Hint",
      error: {
        invalidParams: "Invalid parameters.",
        invalidUrl: "Invalid URL.",
        noFilterFields: "Layer has no fields that can be used for filter.",
        invalidSQL: "Invalid SQL expression.",
        cantParseSQL: "Can't parse the SQL expression."
      }
    },

    featureLayerSource: {
      layer: "Layer",
      browse: "Browse",
      selectLayerFromMap: "Select Layer from Map",
      inputLayerUrl: "Input Layer URL",
      selectLayer: "Select Layer",
      chooseItem: "Choose Item",
      setServiceUrl: "Set Service URL"
    },

    itemSelector: {
      map: "Map",
      selectWebMap: "Choose Web Map",
      addMapFromOnlineOrPortal: "Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal.",
      searchMapName: "Search by map name...",
      searchNone: "We couldn't find what you were looking for. Please try again.",
      groups: "Groups",
      noneGroups: "No groups",
      signInTip: "Your login session has expired, please refresh your browser to sign in to your portal again.",
      signIn: "Sign in",
      publicMap: "Public",
      myOrganization: "My Organization",
      myGroup: "My Groups",
      myContent: "My Content",
      count: "Count",
      fromPortal: "from Portal",
      fromOnline: "from ArcGIS.com",
      noneThumbnail: "Thumbnail Not Available",
      owner: "owner",
      signInTo: "Sign in to",
      lastModified: "Last Modified",
      moreDetails: "More Details"
    },

    featureLayerChooserFromPortal: {},

    setPortalUrl: {
      tip: "Specify the URL to your organization or Portal for ArcGIS",
      errPrefix: "Unable to access ",
      errRemind: "A server with the specified hostname could not be found",
      errOrg: "Please input a full URL of your ArcGIS Online organization, for example, http://myorg.maps.arcgis.com"
    },

    portalSignIn: {
      errorMessage: "Incorrect username or password",
      portalError: "Portal Error",
      username: "Username",
      password: "Password",
      forgot: "Forgot password",
      remember: "Remember username and password",
      signin: "Sign in",
      back: "Back",
      con: "Continue",
      namedUserTip: "Web AppBuilder for ArcGIS does not support public account. Please login using an organizational account.",
      signingIn: "Signing in",
      registeringAppID: "Registering App ID",
      here:"here",
      appIdTip1: "Since this is the first time for Web AppBuilder to work with the organization or portal you just specified, an App ID is required to support OAuth2 signin process.",
      appIdTip2: "Provide your username and password for your organization or portal. Once succeeded, Web AppBuilder will auto-register an App ID, along with a new web mapping application item named 'Web AppBuilder for ArcGIS' in My Content. Please don't delete or change the item. For more information about registering App ID, refer ${here}."
    },

    basicLayerChooserFromMap: {
      noLayersTip: "There is no feature layer available in current map for the query task."
    }
  },
  "ar": false,
  "cs": false,
  "da": false,
  "de": false,
  "es": false,
  "et": false,
  "fi": false,
  "fr": false,
  "he": false,
  "it": false,
  "ja": false,
  "ko": false,
  "lt": false,
  "lv": false,
  "nb": false,
  "nl": false,
  "pl": false,
  "pt-BR": false,
  "pt-PT": false,
  "ro": false,
  "ru": false,
  "sv": false,
  "th": false,
  "tr": false,
  "zh-cn": true
});