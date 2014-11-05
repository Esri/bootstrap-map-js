define({
  common: {
    ok: 'Ř_Ok_ů',
    cancel: 'Ř_Cancel_ů',
    next: 'Ř_Next_ů',
    back: 'Ř_Back_ů'
  },

  errorCode: "Ř_Code_ů",
  errorMessage: "Ř_Message_ů",
  errorDetail: "Ř_Detail_ů",
  widgetPlaceholderTooltip: "Ř_To set it up, go to Widgets and click corresponding placeholder_ů",

  tokenUtils: {
    changeHostTip: 'Ř_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._ů'
  },

  oauthHelper: {
    signInBlockedTip: 'Ř_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._ů'
  },

  symbolChooser: {
    preview: 'Ř_Preview_ů',
    basic: 'Ř_Basic_ů',
    arrows: 'Ř_Arrows_ů',
    business: 'Ř_Business_ů',
    cartographic: 'Ř_Cartographic_ů',
    nationalParkService: 'Ř_National Park Service_ů',
    outdoorRecreation: 'Ř_Outdoor Recreation_ů',
    peoplePlaces: 'Ř_People Places_ů',
    safetyHealth: 'Ř_Safety Health_ů',
    shapes: 'Ř_Shapes_ů',
    transportation: 'Ř_Transportation_ů',
    symbolSize: 'Ř_Symbol size_ů',
    color: 'Ř_Color_ů',
    alpha: 'Ř_Alpha_ů',
    outlineColor: 'Ř_Outline color_ů',
    outlineWidth: 'Ř_Outline width_ů',
    style: 'Ř_Style_ů',
    width: 'Ř_Width_ů',
    text: 'Ř_Text_ů',
    fontColor: 'Ř_Font color_ů',
    fontSize: 'Ř_Font size_ů'
  },

  rendererChooser: {
    use: 'Ř_Use_ů',
    singleSymbol: 'Ř_A Single Symbol_ů',
    uniqueSymbol: 'Ř_Unique Symbols_ů',
    color: 'Ř_Color_ů',
    size: 'Ř_Size_ů',
    toShow: 'Ř_To Show_ů',
    colors: 'Ř_Colors_ů',
    classes: 'Ř_Classes_ů',
    symbolSize: 'Ř_Symbol size_ů',
    addValue: 'Ř_Add Value_ů',
    setDefaultSymbol: 'Ř_Set default symbol_ů',
    defaultSymbol: 'Ř_Default Symbol_ů',
    selectedSymbol: 'Ř_Selected Symbol_ů',
    value: 'Ř_Value_ů',
    label: 'Ř_Label_ů',
    range: 'Ř_Range_ů'
  },

  drawBox: {
    point: "Ř_Point_ů",
    line: "Ř_Line_ů",
    polyline: "Ř_Polyline_ů",
    freehandPolyline: "Ř_Freehand Polyline_ů",
    triangle: "Ř_Triangle_ů",
    extent: "Ř_Extent_ů",
    circle: "Ř_Circle_ů",
    ellipse: "Ř_Ellipse_ů",
    polygon: "Ř_Polygon_ů",
    freehandPolygon: "Ř_Freehand Polygon_ů",
    text: "Ř_Text_ů",
    clear: "Ř_Clear_ů"
  },

  popupConfig: {
    title: "Ř_Title_ů",
    add: "Ř_Add_ů",
    fields: "Ř_Fields_ů",
    noField: "Ř_No field_ů",
    visibility: "Ř_Visible_ů",
    name: "Ř_Name_ů",
    alias: "Ř_Alias_ů",
    actions: "Ř_Actions_ů"
  },

  includeButton: {
    include: "Ř_Include_ů"
  },

  loadingShelter: {
    loading: "Ř_Loading_ů"
  },

  basicServiceBrowser: {
    noServicesFound: 'Ř_No services were found._ů',
    unableConnectTo: 'Ř_Unable to connect to_ů'
  },

  serviceBrowser: {
    noGpFound: 'Ř_No geoprocessing services were found._ů',
    unableConnectTo: 'Ř_Unable to connect to_ů'
  },

  layerServiceBrowser: {
    noServicesFound: 'Ř_No MapServer or FeatureServer services were found_ů',
    unableConnectTo: 'Ř_Unable to connect to_ů'
  },

  basicServiceChooser: {
    validate: "Ř_Validate_ů",
    example: "Ř_Example_ů",
    set: "Ř_Set_ů"
  },

  urlInput: {
    invalidUrl: 'Ř_Invalid url._ů'
  },

  filterBuilder: {
    addAnotherExpression: "Ř_Add another expression_ů",
    addSet: "Ř_Add a set_ů",
    matchMsg: "Ř_Display features in the layer that match ${any_or_all} of the following expressions_ů",
    matchMsgSet: "Ř_${any_or_all} of the following expressions in this set are true_ů",
    all: "Ř_All_ů",
    any: "Ř_Any_ů",
    value: "Ř_Value_ů",
    field: "Ř_Field_ů",
    unique: "Ř_Unique_ů",
    none: "Ř_None_ů",
    and: "Ř_and_ů",
    valueTooltip: "Ř_Enter value_ů",
    fieldTooltip: "Ř_Pick from existing field_ů",
    uniqueValueTooltip: "Ř_Pick from unique values in selected field_ů",
    friendlyDatePattern: "Ř_MM/dd/yyyy_ů",
    stringOperatorIs: "Ř_is_ů", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "Ř_is not_ů",
    stringOperatorStartsWith: "Ř_starts with_ů",
    stringOperatorEndsWith: "Ř_ends with_ů",
    stringOperatorContains: "Ř_contains_ů",
    stringOperatorDoesNotContain: "Ř_does not contain_ů",
    stringOperatorIsBlank: "Ř_is blank_ů",
    stringOperatorIsNotBlank: "Ř_is not blank_ů",
    dateOperatorIsOn: "Ř_is on_ů", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "Ř_is not on_ů",
    dateOperatorIsBefore: "Ř_is before_ů",
    dateOperatorIsAfter: "Ř_is after_ů",
    dateOperatorDays: "Ř_days_ů",
    dateOperatorWeeks: "Ř_weeks_ů", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "Ř_months_ů",
    dateOperatorInTheLast: "Ř_in the last_ů",
    dateOperatorNotInTheLast: "Ř_not in the last_ů",
    dateOperatorIsBetween: "Ř_is between_ů",
    dateOperatorIsNotBetween: "Ř_is not between_ů",
    dateOperatorIsBlank: "Ř_is blank_ů",
    dateOperatorIsNotBlank: "Ř_is not blank_ů",
    numberOperatorIs: "Ř_is_ů", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "Ř_is not_ů",
    numberOperatorIsAtLeast: "Ř_is at least_ů",
    numberOperatorIsLessThan: "Ř_is less than_ů",
    numberOperatorIsAtMost: "Ř_is at most_ů",
    numberOperatorIsGreaterThan: "Ř_is greater than_ů",
    numberOperatorIsBetween: "Ř_is between_ů",
    numberOperatorIsNotBetween: "Ř_is not between_ů",
    numberOperatorIsBlank: "Ř_is blank_ů",
    numberOperatorIsNotBlank: "Ř_is not blank_ů",
    string: "Ř_String_ů",
    number: "Ř_Number_ů",
    date: "Ř_Date_ů",
    askForValues: "Ř_Ask for values_ů",
    prompt: "Ř_Prompt_ů",
    hint: "Ř_Hint_ů",
    error: {
      invalidParams: "Ř_Invalid parameters._ů",
      invalidUrl: "Ř_Invalid url._ů",
      noFilterFields: "Ř_Layer has no fields that can be used for filtering._ů",
      invalidSQL: "Ř_Invalid sql expression._ů",
      cantParseSQL: "Ř_Can't parse the sql expression._ů"
    }
  },

  featureLayerSource: {
    layer: "Ř_Layer_ů",
    browse: "Ř_Browse_ů",
    selectLayerFromMap: "Ř_Select layer from map_ů",
    inputLayerUrl: "Ř_Input layer url_ů"
  },

  itemSelector: {
    map: "Ř_Map_ů",
    selectWebMap: "Ř_Select Web Map_ů",
    addMapFromOnlineOrPortal: "Ř_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._ů",
    searchMapName: "Ř_Search by map name..._ů",
    searchNone: "Ř_We couldn't find what you were looking for.Please try another one._ů",
    groups: "Ř_Groups_ů",
    noneGroups: "Ř_No groups_ů",
    signInTip: "Ř_Please sign in to access your private content._ů",
    signIn: "Ř_Sign in_ů",
    publicMap: "Ř_Public_ů",
    myOrganization: "Ř_My Organization_ů",
    myGroup: "Ř_My Groups_ů",
    myContent: "Ř_My Content_ů",
    count: "Ř_Count_ů",
    fromPortal: "Ř_from Portal_ů",
    fromOnline: "Ř_from ArcGIS.com_ů",
    noneThumbnail: "Ř_Thumbnail not available_ů",
    owner: "Ř_owner_ů",
    signInTo: "Ř_Sign in to_ů",
    lastModified: "Ř_Last Modified_ů",
    moreDetails: "Ř_More Details_ů"
  },

  featureLayerChooserFromPortal: {}
});