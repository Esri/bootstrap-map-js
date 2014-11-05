define({
  common: {
    ok: 'ä_Ok_Ü',
    cancel: 'ä_Cancel_Ü',
    next: 'ä_Next_Ü',
    back: 'ä_Back_Ü'
  },

  errorCode: "ä_Code_Ü",
  errorMessage: "ä_Message_Ü",
  errorDetail: "ä_Detail_Ü",
  widgetPlaceholderTooltip: "ä_To set it up, go to Widgets and click corresponding placeholder_Ü",

  tokenUtils: {
    changeHostTip: 'ä_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._Ü'
  },

  oauthHelper: {
    signInBlockedTip: 'ä_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._Ü'
  },

  symbolChooser: {
    preview: 'ä_Preview_Ü',
    basic: 'ä_Basic_Ü',
    arrows: 'ä_Arrows_Ü',
    business: 'ä_Business_Ü',
    cartographic: 'ä_Cartographic_Ü',
    nationalParkService: 'ä_National Park Service_Ü',
    outdoorRecreation: 'ä_Outdoor Recreation_Ü',
    peoplePlaces: 'ä_People Places_Ü',
    safetyHealth: 'ä_Safety Health_Ü',
    shapes: 'ä_Shapes_Ü',
    transportation: 'ä_Transportation_Ü',
    symbolSize: 'ä_Symbol size_Ü',
    color: 'ä_Color_Ü',
    alpha: 'ä_Alpha_Ü',
    outlineColor: 'ä_Outline color_Ü',
    outlineWidth: 'ä_Outline width_Ü',
    style: 'ä_Style_Ü',
    width: 'ä_Width_Ü',
    text: 'ä_Text_Ü',
    fontColor: 'ä_Font color_Ü',
    fontSize: 'ä_Font size_Ü'
  },

  rendererChooser: {
    use: 'ä_Use_Ü',
    singleSymbol: 'ä_A Single Symbol_Ü',
    uniqueSymbol: 'ä_Unique Symbols_Ü',
    color: 'ä_Color_Ü',
    size: 'ä_Size_Ü',
    toShow: 'ä_To Show_Ü',
    colors: 'ä_Colors_Ü',
    classes: 'ä_Classes_Ü',
    symbolSize: 'ä_Symbol size_Ü',
    addValue: 'ä_Add Value_Ü',
    setDefaultSymbol: 'ä_Set default symbol_Ü',
    defaultSymbol: 'ä_Default Symbol_Ü',
    selectedSymbol: 'ä_Selected Symbol_Ü',
    value: 'ä_Value_Ü',
    label: 'ä_Label_Ü',
    range: 'ä_Range_Ü'
  },

  drawBox: {
    point: "ä_Point_Ü",
    line: "ä_Line_Ü",
    polyline: "ä_Polyline_Ü",
    freehandPolyline: "ä_Freehand Polyline_Ü",
    triangle: "ä_Triangle_Ü",
    extent: "ä_Extent_Ü",
    circle: "ä_Circle_Ü",
    ellipse: "ä_Ellipse_Ü",
    polygon: "ä_Polygon_Ü",
    freehandPolygon: "ä_Freehand Polygon_Ü",
    text: "ä_Text_Ü",
    clear: "ä_Clear_Ü"
  },

  popupConfig: {
    title: "ä_Title_Ü",
    add: "ä_Add_Ü",
    fields: "ä_Fields_Ü",
    noField: "ä_No field_Ü",
    visibility: "ä_Visible_Ü",
    name: "ä_Name_Ü",
    alias: "ä_Alias_Ü",
    actions: "ä_Actions_Ü"
  },

  includeButton: {
    include: "ä_Include_Ü"
  },

  loadingShelter: {
    loading: "ä_Loading_Ü"
  },

  basicServiceBrowser: {
    noServicesFound: 'ä_No services were found._Ü',
    unableConnectTo: 'ä_Unable to connect to_Ü'
  },

  serviceBrowser: {
    noGpFound: 'ä_No geoprocessing services were found._Ü',
    unableConnectTo: 'ä_Unable to connect to_Ü'
  },

  layerServiceBrowser: {
    noServicesFound: 'ä_No MapServer or FeatureServer services were found_Ü',
    unableConnectTo: 'ä_Unable to connect to_Ü'
  },

  basicServiceChooser: {
    validate: "ä_Validate_Ü",
    example: "ä_Example_Ü",
    set: "ä_Set_Ü"
  },

  urlInput: {
    invalidUrl: 'ä_Invalid url._Ü'
  },

  filterBuilder: {
    addAnotherExpression: "ä_Add another expression_Ü",
    addSet: "ä_Add a set_Ü",
    matchMsg: "ä_Display features in the layer that match ${any_or_all} of the following expressions_Ü",
    matchMsgSet: "ä_${any_or_all} of the following expressions in this set are true_Ü",
    all: "ä_All_Ü",
    any: "ä_Any_Ü",
    value: "ä_Value_Ü",
    field: "ä_Field_Ü",
    unique: "ä_Unique_Ü",
    none: "ä_None_Ü",
    and: "ä_and_Ü",
    valueTooltip: "ä_Enter value_Ü",
    fieldTooltip: "ä_Pick from existing field_Ü",
    uniqueValueTooltip: "ä_Pick from unique values in selected field_Ü",
    friendlyDatePattern: "ä_MM/dd/yyyy_Ü",
    stringOperatorIs: "ä_is_Ü", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "ä_is not_Ü",
    stringOperatorStartsWith: "ä_starts with_Ü",
    stringOperatorEndsWith: "ä_ends with_Ü",
    stringOperatorContains: "ä_contains_Ü",
    stringOperatorDoesNotContain: "ä_does not contain_Ü",
    stringOperatorIsBlank: "ä_is blank_Ü",
    stringOperatorIsNotBlank: "ä_is not blank_Ü",
    dateOperatorIsOn: "ä_is on_Ü", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "ä_is not on_Ü",
    dateOperatorIsBefore: "ä_is before_Ü",
    dateOperatorIsAfter: "ä_is after_Ü",
    dateOperatorDays: "ä_days_Ü",
    dateOperatorWeeks: "ä_weeks_Ü", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "ä_months_Ü",
    dateOperatorInTheLast: "ä_in the last_Ü",
    dateOperatorNotInTheLast: "ä_not in the last_Ü",
    dateOperatorIsBetween: "ä_is between_Ü",
    dateOperatorIsNotBetween: "ä_is not between_Ü",
    dateOperatorIsBlank: "ä_is blank_Ü",
    dateOperatorIsNotBlank: "ä_is not blank_Ü",
    numberOperatorIs: "ä_is_Ü", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "ä_is not_Ü",
    numberOperatorIsAtLeast: "ä_is at least_Ü",
    numberOperatorIsLessThan: "ä_is less than_Ü",
    numberOperatorIsAtMost: "ä_is at most_Ü",
    numberOperatorIsGreaterThan: "ä_is greater than_Ü",
    numberOperatorIsBetween: "ä_is between_Ü",
    numberOperatorIsNotBetween: "ä_is not between_Ü",
    numberOperatorIsBlank: "ä_is blank_Ü",
    numberOperatorIsNotBlank: "ä_is not blank_Ü",
    string: "ä_String_Ü",
    number: "ä_Number_Ü",
    date: "ä_Date_Ü",
    askForValues: "ä_Ask for values_Ü",
    prompt: "ä_Prompt_Ü",
    hint: "ä_Hint_Ü",
    error: {
      invalidParams: "ä_Invalid parameters._Ü",
      invalidUrl: "ä_Invalid url._Ü",
      noFilterFields: "ä_Layer has no fields that can be used for filtering._Ü",
      invalidSQL: "ä_Invalid sql expression._Ü",
      cantParseSQL: "ä_Can't parse the sql expression._Ü"
    }
  },

  featureLayerSource: {
    layer: "ä_Layer_Ü",
    browse: "ä_Browse_Ü",
    selectLayerFromMap: "ä_Select layer from map_Ü",
    inputLayerUrl: "ä_Input layer url_Ü"
  },

  itemSelector: {
    map: "ä_Map_Ü",
    selectWebMap: "ä_Select Web Map_Ü",
    addMapFromOnlineOrPortal: "ä_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._Ü",
    searchMapName: "ä_Search by map name..._Ü",
    searchNone: "ä_We couldn't find what you were looking for.Please try another one._Ü",
    groups: "ä_Groups_Ü",
    noneGroups: "ä_No groups_Ü",
    signInTip: "ä_Please sign in to access your private content._Ü",
    signIn: "ä_Sign in_Ü",
    publicMap: "ä_Public_Ü",
    myOrganization: "ä_My Organization_Ü",
    myGroup: "ä_My Groups_Ü",
    myContent: "ä_My Content_Ü",
    count: "ä_Count_Ü",
    fromPortal: "ä_from Portal_Ü",
    fromOnline: "ä_from ArcGIS.com_Ü",
    noneThumbnail: "ä_Thumbnail not available_Ü",
    owner: "ä_owner_Ü",
    signInTo: "ä_Sign in to_Ü",
    lastModified: "ä_Last Modified_Ü",
    moreDetails: "ä_More Details_Ü"
  },

  featureLayerChooserFromPortal: {}
});