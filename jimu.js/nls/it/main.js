define({
  common: {
    ok: 'é_Ok_È',
    cancel: 'é_Cancel_È',
    next: 'é_Next_È',
    back: 'é_Back_È'
  },

  errorCode: "é_Code_È",
  errorMessage: "é_Message_È",
  errorDetail: "é_Detail_È",
  widgetPlaceholderTooltip: "é_To set it up, go to Widgets and click corresponding placeholder_È",

  tokenUtils: {
    changeHostTip: 'é_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._È'
  },

  oauthHelper: {
    signInBlockedTip: 'é_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._È'
  },

  symbolChooser: {
    preview: 'é_Preview_È',
    basic: 'é_Basic_È',
    arrows: 'é_Arrows_È',
    business: 'é_Business_È',
    cartographic: 'é_Cartographic_È',
    nationalParkService: 'é_National Park Service_È',
    outdoorRecreation: 'é_Outdoor Recreation_È',
    peoplePlaces: 'é_People Places_È',
    safetyHealth: 'é_Safety Health_È',
    shapes: 'é_Shapes_È',
    transportation: 'é_Transportation_È',
    symbolSize: 'é_Symbol size_È',
    color: 'é_Color_È',
    alpha: 'é_Alpha_È',
    outlineColor: 'é_Outline color_È',
    outlineWidth: 'é_Outline width_È',
    style: 'é_Style_È',
    width: 'é_Width_È',
    text: 'é_Text_È',
    fontColor: 'é_Font color_È',
    fontSize: 'é_Font size_È'
  },

  rendererChooser: {
    use: 'é_Use_È',
    singleSymbol: 'é_A Single Symbol_È',
    uniqueSymbol: 'é_Unique Symbols_È',
    color: 'é_Color_È',
    size: 'é_Size_È',
    toShow: 'é_To Show_È',
    colors: 'é_Colors_È',
    classes: 'é_Classes_È',
    symbolSize: 'é_Symbol size_È',
    addValue: 'é_Add Value_È',
    setDefaultSymbol: 'é_Set default symbol_È',
    defaultSymbol: 'é_Default Symbol_È',
    selectedSymbol: 'é_Selected Symbol_È',
    value: 'é_Value_È',
    label: 'é_Label_È',
    range: 'é_Range_È'
  },

  drawBox: {
    point: "é_Point_È",
    line: "é_Line_È",
    polyline: "é_Polyline_È",
    freehandPolyline: "é_Freehand Polyline_È",
    triangle: "é_Triangle_È",
    extent: "é_Extent_È",
    circle: "é_Circle_È",
    ellipse: "é_Ellipse_È",
    polygon: "é_Polygon_È",
    freehandPolygon: "é_Freehand Polygon_È",
    text: "é_Text_È",
    clear: "é_Clear_È"
  },

  popupConfig: {
    title: "é_Title_È",
    add: "é_Add_È",
    fields: "é_Fields_È",
    noField: "é_No field_È",
    visibility: "é_Visible_È",
    name: "é_Name_È",
    alias: "é_Alias_È",
    actions: "é_Actions_È"
  },

  includeButton: {
    include: "é_Include_È"
  },

  loadingShelter: {
    loading: "é_Loading_È"
  },

  basicServiceBrowser: {
    noServicesFound: 'é_No services were found._È',
    unableConnectTo: 'é_Unable to connect to_È'
  },

  serviceBrowser: {
    noGpFound: 'é_No geoprocessing services were found._È',
    unableConnectTo: 'é_Unable to connect to_È'
  },

  layerServiceBrowser: {
    noServicesFound: 'é_No MapServer or FeatureServer services were found_È',
    unableConnectTo: 'é_Unable to connect to_È'
  },

  basicServiceChooser: {
    validate: "é_Validate_È",
    example: "é_Example_È",
    set: "é_Set_È"
  },

  urlInput: {
    invalidUrl: 'é_Invalid url._È'
  },

  filterBuilder: {
    addAnotherExpression: "é_Add another expression_È",
    addSet: "é_Add a set_È",
    matchMsg: "é_Display features in the layer that match ${any_or_all} of the following expressions_È",
    matchMsgSet: "é_${any_or_all} of the following expressions in this set are true_È",
    all: "é_All_È",
    any: "é_Any_È",
    value: "é_Value_È",
    field: "é_Field_È",
    unique: "é_Unique_È",
    none: "é_None_È",
    and: "é_and_È",
    valueTooltip: "é_Enter value_È",
    fieldTooltip: "é_Pick from existing field_È",
    uniqueValueTooltip: "é_Pick from unique values in selected field_È",
    friendlyDatePattern: "é_MM/dd/yyyy_È",
    stringOperatorIs: "é_is_È", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "é_is not_È",
    stringOperatorStartsWith: "é_starts with_È",
    stringOperatorEndsWith: "é_ends with_È",
    stringOperatorContains: "é_contains_È",
    stringOperatorDoesNotContain: "é_does not contain_È",
    stringOperatorIsBlank: "é_is blank_È",
    stringOperatorIsNotBlank: "é_is not blank_È",
    dateOperatorIsOn: "é_is on_È", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "é_is not on_È",
    dateOperatorIsBefore: "é_is before_È",
    dateOperatorIsAfter: "é_is after_È",
    dateOperatorDays: "é_days_È",
    dateOperatorWeeks: "é_weeks_È", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "é_months_È",
    dateOperatorInTheLast: "é_in the last_È",
    dateOperatorNotInTheLast: "é_not in the last_È",
    dateOperatorIsBetween: "é_is between_È",
    dateOperatorIsNotBetween: "é_is not between_È",
    dateOperatorIsBlank: "é_is blank_È",
    dateOperatorIsNotBlank: "é_is not blank_È",
    numberOperatorIs: "é_is_È", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "é_is not_È",
    numberOperatorIsAtLeast: "é_is at least_È",
    numberOperatorIsLessThan: "é_is less than_È",
    numberOperatorIsAtMost: "é_is at most_È",
    numberOperatorIsGreaterThan: "é_is greater than_È",
    numberOperatorIsBetween: "é_is between_È",
    numberOperatorIsNotBetween: "é_is not between_È",
    numberOperatorIsBlank: "é_is blank_È",
    numberOperatorIsNotBlank: "é_is not blank_È",
    string: "é_String_È",
    number: "é_Number_È",
    date: "é_Date_È",
    askForValues: "é_Ask for values_È",
    prompt: "é_Prompt_È",
    hint: "é_Hint_È",
    error: {
      invalidParams: "é_Invalid parameters._È",
      invalidUrl: "é_Invalid url._È",
      noFilterFields: "é_Layer has no fields that can be used for filtering._È",
      invalidSQL: "é_Invalid sql expression._È",
      cantParseSQL: "é_Can't parse the sql expression._È"
    }
  },

  featureLayerSource: {
    layer: "é_Layer_È",
    browse: "é_Browse_È",
    selectLayerFromMap: "é_Select layer from map_È",
    inputLayerUrl: "é_Input layer url_È"
  },

  itemSelector: {
    map: "é_Map_È",
    selectWebMap: "é_Select Web Map_È",
    addMapFromOnlineOrPortal: "é_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._È",
    searchMapName: "é_Search by map name..._È",
    searchNone: "é_We couldn't find what you were looking for.Please try another one._È",
    groups: "é_Groups_È",
    noneGroups: "é_No groups_È",
    signInTip: "é_Please sign in to access your private content._È",
    signIn: "é_Sign in_È",
    publicMap: "é_Public_È",
    myOrganization: "é_My Organization_È",
    myGroup: "é_My Groups_È",
    myContent: "é_My Content_È",
    count: "é_Count_È",
    fromPortal: "é_from Portal_È",
    fromOnline: "é_from ArcGIS.com_È",
    noneThumbnail: "é_Thumbnail not available_È",
    owner: "é_owner_È",
    signInTo: "é_Sign in to_È",
    lastModified: "é_Last Modified_È",
    moreDetails: "é_More Details_È"
  },

  featureLayerChooserFromPortal: {}
});