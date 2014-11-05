define({
  common: {
    ok: 'ķ_Ok_ū',
    cancel: 'ķ_Cancel_ū',
    next: 'ķ_Next_ū',
    back: 'ķ_Back_ū'
  },

  errorCode: "ķ_Code_ū",
  errorMessage: "ķ_Message_ū",
  errorDetail: "ķ_Detail_ū",
  widgetPlaceholderTooltip: "ķ_To set it up, go to Widgets and click corresponding placeholder_ū",

  tokenUtils: {
    changeHostTip: 'ķ_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._ū'
  },

  oauthHelper: {
    signInBlockedTip: 'ķ_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._ū'
  },

  symbolChooser: {
    preview: 'ķ_Preview_ū',
    basic: 'ķ_Basic_ū',
    arrows: 'ķ_Arrows_ū',
    business: 'ķ_Business_ū',
    cartographic: 'ķ_Cartographic_ū',
    nationalParkService: 'ķ_National Park Service_ū',
    outdoorRecreation: 'ķ_Outdoor Recreation_ū',
    peoplePlaces: 'ķ_People Places_ū',
    safetyHealth: 'ķ_Safety Health_ū',
    shapes: 'ķ_Shapes_ū',
    transportation: 'ķ_Transportation_ū',
    symbolSize: 'ķ_Symbol size_ū',
    color: 'ķ_Color_ū',
    alpha: 'ķ_Alpha_ū',
    outlineColor: 'ķ_Outline color_ū',
    outlineWidth: 'ķ_Outline width_ū',
    style: 'ķ_Style_ū',
    width: 'ķ_Width_ū',
    text: 'ķ_Text_ū',
    fontColor: 'ķ_Font color_ū',
    fontSize: 'ķ_Font size_ū'
  },

  rendererChooser: {
    use: 'ķ_Use_ū',
    singleSymbol: 'ķ_A Single Symbol_ū',
    uniqueSymbol: 'ķ_Unique Symbols_ū',
    color: 'ķ_Color_ū',
    size: 'ķ_Size_ū',
    toShow: 'ķ_To Show_ū',
    colors: 'ķ_Colors_ū',
    classes: 'ķ_Classes_ū',
    symbolSize: 'ķ_Symbol size_ū',
    addValue: 'ķ_Add Value_ū',
    setDefaultSymbol: 'ķ_Set default symbol_ū',
    defaultSymbol: 'ķ_Default Symbol_ū',
    selectedSymbol: 'ķ_Selected Symbol_ū',
    value: 'ķ_Value_ū',
    label: 'ķ_Label_ū',
    range: 'ķ_Range_ū'
  },

  drawBox: {
    point: "ķ_Point_ū",
    line: "ķ_Line_ū",
    polyline: "ķ_Polyline_ū",
    freehandPolyline: "ķ_Freehand Polyline_ū",
    triangle: "ķ_Triangle_ū",
    extent: "ķ_Extent_ū",
    circle: "ķ_Circle_ū",
    ellipse: "ķ_Ellipse_ū",
    polygon: "ķ_Polygon_ū",
    freehandPolygon: "ķ_Freehand Polygon_ū",
    text: "ķ_Text_ū",
    clear: "ķ_Clear_ū"
  },

  popupConfig: {
    title: "ķ_Title_ū",
    add: "ķ_Add_ū",
    fields: "ķ_Fields_ū",
    noField: "ķ_No field_ū",
    visibility: "ķ_Visible_ū",
    name: "ķ_Name_ū",
    alias: "ķ_Alias_ū",
    actions: "ķ_Actions_ū"
  },

  includeButton: {
    include: "ķ_Include_ū"
  },

  loadingShelter: {
    loading: "ķ_Loading_ū"
  },

  basicServiceBrowser: {
    noServicesFound: 'ķ_No services were found._ū',
    unableConnectTo: 'ķ_Unable to connect to_ū'
  },

  serviceBrowser: {
    noGpFound: 'ķ_No geoprocessing services were found._ū',
    unableConnectTo: 'ķ_Unable to connect to_ū'
  },

  layerServiceBrowser: {
    noServicesFound: 'ķ_No MapServer or FeatureServer services were found_ū',
    unableConnectTo: 'ķ_Unable to connect to_ū'
  },

  basicServiceChooser: {
    validate: "ķ_Validate_ū",
    example: "ķ_Example_ū",
    set: "ķ_Set_ū"
  },

  urlInput: {
    invalidUrl: 'ķ_Invalid url._ū'
  },

  filterBuilder: {
    addAnotherExpression: "ķ_Add another expression_ū",
    addSet: "ķ_Add a set_ū",
    matchMsg: "ķ_Display features in the layer that match ${any_or_all} of the following expressions_ū",
    matchMsgSet: "ķ_${any_or_all} of the following expressions in this set are true_ū",
    all: "ķ_All_ū",
    any: "ķ_Any_ū",
    value: "ķ_Value_ū",
    field: "ķ_Field_ū",
    unique: "ķ_Unique_ū",
    none: "ķ_None_ū",
    and: "ķ_and_ū",
    valueTooltip: "ķ_Enter value_ū",
    fieldTooltip: "ķ_Pick from existing field_ū",
    uniqueValueTooltip: "ķ_Pick from unique values in selected field_ū",
    friendlyDatePattern: "ķ_MM/dd/yyyy_ū",
    stringOperatorIs: "ķ_is_ū", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "ķ_is not_ū",
    stringOperatorStartsWith: "ķ_starts with_ū",
    stringOperatorEndsWith: "ķ_ends with_ū",
    stringOperatorContains: "ķ_contains_ū",
    stringOperatorDoesNotContain: "ķ_does not contain_ū",
    stringOperatorIsBlank: "ķ_is blank_ū",
    stringOperatorIsNotBlank: "ķ_is not blank_ū",
    dateOperatorIsOn: "ķ_is on_ū", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "ķ_is not on_ū",
    dateOperatorIsBefore: "ķ_is before_ū",
    dateOperatorIsAfter: "ķ_is after_ū",
    dateOperatorDays: "ķ_days_ū",
    dateOperatorWeeks: "ķ_weeks_ū", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "ķ_months_ū",
    dateOperatorInTheLast: "ķ_in the last_ū",
    dateOperatorNotInTheLast: "ķ_not in the last_ū",
    dateOperatorIsBetween: "ķ_is between_ū",
    dateOperatorIsNotBetween: "ķ_is not between_ū",
    dateOperatorIsBlank: "ķ_is blank_ū",
    dateOperatorIsNotBlank: "ķ_is not blank_ū",
    numberOperatorIs: "ķ_is_ū", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "ķ_is not_ū",
    numberOperatorIsAtLeast: "ķ_is at least_ū",
    numberOperatorIsLessThan: "ķ_is less than_ū",
    numberOperatorIsAtMost: "ķ_is at most_ū",
    numberOperatorIsGreaterThan: "ķ_is greater than_ū",
    numberOperatorIsBetween: "ķ_is between_ū",
    numberOperatorIsNotBetween: "ķ_is not between_ū",
    numberOperatorIsBlank: "ķ_is blank_ū",
    numberOperatorIsNotBlank: "ķ_is not blank_ū",
    string: "ķ_String_ū",
    number: "ķ_Number_ū",
    date: "ķ_Date_ū",
    askForValues: "ķ_Ask for values_ū",
    prompt: "ķ_Prompt_ū",
    hint: "ķ_Hint_ū",
    error: {
      invalidParams: "ķ_Invalid parameters._ū",
      invalidUrl: "ķ_Invalid url._ū",
      noFilterFields: "ķ_Layer has no fields that can be used for filtering._ū",
      invalidSQL: "ķ_Invalid sql expression._ū",
      cantParseSQL: "ķ_Can't parse the sql expression._ū"
    }
  },

  featureLayerSource: {
    layer: "ķ_Layer_ū",
    browse: "ķ_Browse_ū",
    selectLayerFromMap: "ķ_Select layer from map_ū",
    inputLayerUrl: "ķ_Input layer url_ū"
  },

  itemSelector: {
    map: "ķ_Map_ū",
    selectWebMap: "ķ_Select Web Map_ū",
    addMapFromOnlineOrPortal: "ķ_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._ū",
    searchMapName: "ķ_Search by map name..._ū",
    searchNone: "ķ_We couldn't find what you were looking for.Please try another one._ū",
    groups: "ķ_Groups_ū",
    noneGroups: "ķ_No groups_ū",
    signInTip: "ķ_Please sign in to access your private content._ū",
    signIn: "ķ_Sign in_ū",
    publicMap: "ķ_Public_ū",
    myOrganization: "ķ_My Organization_ū",
    myGroup: "ķ_My Groups_ū",
    myContent: "ķ_My Content_ū",
    count: "ķ_Count_ū",
    fromPortal: "ķ_from Portal_ū",
    fromOnline: "ķ_from ArcGIS.com_ū",
    noneThumbnail: "ķ_Thumbnail not available_ū",
    owner: "ķ_owner_ū",
    signInTo: "ķ_Sign in to_ū",
    lastModified: "ķ_Last Modified_ū",
    moreDetails: "ķ_More Details_ū"
  },

  featureLayerChooserFromPortal: {}
});