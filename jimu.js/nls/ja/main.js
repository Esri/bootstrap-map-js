define({
  common: {
    ok: '須_Ok_鷗',
    cancel: '須_Cancel_鷗',
    next: '須_Next_鷗',
    back: '須_Back_鷗'
  },

  errorCode: "須_Code_鷗",
  errorMessage: "須_Message_鷗",
  errorDetail: "須_Detail_鷗",
  widgetPlaceholderTooltip: "須_To set it up, go to Widgets and click corresponding placeholder_鷗",

  tokenUtils: {
    changeHostTip: '須_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._鷗'
  },

  oauthHelper: {
    signInBlockedTip: '須_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._鷗'
  },

  symbolChooser: {
    preview: '須_Preview_鷗',
    basic: '須_Basic_鷗',
    arrows: '須_Arrows_鷗',
    business: '須_Business_鷗',
    cartographic: '須_Cartographic_鷗',
    nationalParkService: '須_National Park Service_鷗',
    outdoorRecreation: '須_Outdoor Recreation_鷗',
    peoplePlaces: '須_People Places_鷗',
    safetyHealth: '須_Safety Health_鷗',
    shapes: '須_Shapes_鷗',
    transportation: '須_Transportation_鷗',
    symbolSize: '須_Symbol size_鷗',
    color: '須_Color_鷗',
    alpha: '須_Alpha_鷗',
    outlineColor: '須_Outline color_鷗',
    outlineWidth: '須_Outline width_鷗',
    style: '須_Style_鷗',
    width: '須_Width_鷗',
    text: '須_Text_鷗',
    fontColor: '須_Font color_鷗',
    fontSize: '須_Font size_鷗'
  },

  rendererChooser: {
    use: '須_Use_鷗',
    singleSymbol: '須_A Single Symbol_鷗',
    uniqueSymbol: '須_Unique Symbols_鷗',
    color: '須_Color_鷗',
    size: '須_Size_鷗',
    toShow: '須_To Show_鷗',
    colors: '須_Colors_鷗',
    classes: '須_Classes_鷗',
    symbolSize: '須_Symbol size_鷗',
    addValue: '須_Add Value_鷗',
    setDefaultSymbol: '須_Set default symbol_鷗',
    defaultSymbol: '須_Default Symbol_鷗',
    selectedSymbol: '須_Selected Symbol_鷗',
    value: '須_Value_鷗',
    label: '須_Label_鷗',
    range: '須_Range_鷗'
  },

  drawBox: {
    point: "須_Point_鷗",
    line: "須_Line_鷗",
    polyline: "須_Polyline_鷗",
    freehandPolyline: "須_Freehand Polyline_鷗",
    triangle: "須_Triangle_鷗",
    extent: "須_Extent_鷗",
    circle: "須_Circle_鷗",
    ellipse: "須_Ellipse_鷗",
    polygon: "須_Polygon_鷗",
    freehandPolygon: "須_Freehand Polygon_鷗",
    text: "須_Text_鷗",
    clear: "須_Clear_鷗"
  },

  popupConfig: {
    title: "須_Title_鷗",
    add: "須_Add_鷗",
    fields: "須_Fields_鷗",
    noField: "須_No field_鷗",
    visibility: "須_Visible_鷗",
    name: "須_Name_鷗",
    alias: "須_Alias_鷗",
    actions: "須_Actions_鷗"
  },

  includeButton: {
    include: "須_Include_鷗"
  },

  loadingShelter: {
    loading: "須_Loading_鷗"
  },

  basicServiceBrowser: {
    noServicesFound: '須_No services were found._鷗',
    unableConnectTo: '須_Unable to connect to_鷗'
  },

  serviceBrowser: {
    noGpFound: '須_No geoprocessing services were found._鷗',
    unableConnectTo: '須_Unable to connect to_鷗'
  },

  layerServiceBrowser: {
    noServicesFound: '須_No MapServer or FeatureServer services were found_鷗',
    unableConnectTo: '須_Unable to connect to_鷗'
  },

  basicServiceChooser: {
    validate: "須_Validate_鷗",
    example: "須_Example_鷗",
    set: "須_Set_鷗"
  },

  urlInput: {
    invalidUrl: '須_Invalid url._鷗'
  },

  filterBuilder: {
    addAnotherExpression: "須_Add another expression_鷗",
    addSet: "須_Add a set_鷗",
    matchMsg: "須_Display features in the layer that match ${any_or_all} of the following expressions_鷗",
    matchMsgSet: "須_${any_or_all} of the following expressions in this set are true_鷗",
    all: "須_All_鷗",
    any: "須_Any_鷗",
    value: "須_Value_鷗",
    field: "須_Field_鷗",
    unique: "須_Unique_鷗",
    none: "須_None_鷗",
    and: "須_and_鷗",
    valueTooltip: "須_Enter value_鷗",
    fieldTooltip: "須_Pick from existing field_鷗",
    uniqueValueTooltip: "須_Pick from unique values in selected field_鷗",
    friendlyDatePattern: "須_MM/dd/yyyy_鷗",
    stringOperatorIs: "須_is_鷗", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "須_is not_鷗",
    stringOperatorStartsWith: "須_starts with_鷗",
    stringOperatorEndsWith: "須_ends with_鷗",
    stringOperatorContains: "須_contains_鷗",
    stringOperatorDoesNotContain: "須_does not contain_鷗",
    stringOperatorIsBlank: "須_is blank_鷗",
    stringOperatorIsNotBlank: "須_is not blank_鷗",
    dateOperatorIsOn: "須_is on_鷗", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "須_is not on_鷗",
    dateOperatorIsBefore: "須_is before_鷗",
    dateOperatorIsAfter: "須_is after_鷗",
    dateOperatorDays: "須_days_鷗",
    dateOperatorWeeks: "須_weeks_鷗", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "須_months_鷗",
    dateOperatorInTheLast: "須_in the last_鷗",
    dateOperatorNotInTheLast: "須_not in the last_鷗",
    dateOperatorIsBetween: "須_is between_鷗",
    dateOperatorIsNotBetween: "須_is not between_鷗",
    dateOperatorIsBlank: "須_is blank_鷗",
    dateOperatorIsNotBlank: "須_is not blank_鷗",
    numberOperatorIs: "須_is_鷗", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "須_is not_鷗",
    numberOperatorIsAtLeast: "須_is at least_鷗",
    numberOperatorIsLessThan: "須_is less than_鷗",
    numberOperatorIsAtMost: "須_is at most_鷗",
    numberOperatorIsGreaterThan: "須_is greater than_鷗",
    numberOperatorIsBetween: "須_is between_鷗",
    numberOperatorIsNotBetween: "須_is not between_鷗",
    numberOperatorIsBlank: "須_is blank_鷗",
    numberOperatorIsNotBlank: "須_is not blank_鷗",
    string: "須_String_鷗",
    number: "須_Number_鷗",
    date: "須_Date_鷗",
    askForValues: "須_Ask for values_鷗",
    prompt: "須_Prompt_鷗",
    hint: "須_Hint_鷗",
    error: {
      invalidParams: "須_Invalid parameters._鷗",
      invalidUrl: "須_Invalid url._鷗",
      noFilterFields: "須_Layer has no fields that can be used for filtering._鷗",
      invalidSQL: "須_Invalid sql expression._鷗",
      cantParseSQL: "須_Can't parse the sql expression._鷗"
    }
  },

  featureLayerSource: {
    layer: "須_Layer_鷗",
    browse: "須_Browse_鷗",
    selectLayerFromMap: "須_Select layer from map_鷗",
    inputLayerUrl: "須_Input layer url_鷗"
  },

  itemSelector: {
    map: "須_Map_鷗",
    selectWebMap: "須_Select Web Map_鷗",
    addMapFromOnlineOrPortal: "須_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._鷗",
    searchMapName: "須_Search by map name..._鷗",
    searchNone: "須_We couldn't find what you were looking for.Please try another one._鷗",
    groups: "須_Groups_鷗",
    noneGroups: "須_No groups_鷗",
    signInTip: "須_Please sign in to access your private content._鷗",
    signIn: "須_Sign in_鷗",
    publicMap: "須_Public_鷗",
    myOrganization: "須_My Organization_鷗",
    myGroup: "須_My Groups_鷗",
    myContent: "須_My Content_鷗",
    count: "須_Count_鷗",
    fromPortal: "須_from Portal_鷗",
    fromOnline: "須_from ArcGIS.com_鷗",
    noneThumbnail: "須_Thumbnail not available_鷗",
    owner: "須_owner_鷗",
    signInTo: "須_Sign in to_鷗",
    lastModified: "須_Last Modified_鷗",
    moreDetails: "須_More Details_鷗"
  },

  featureLayerChooserFromPortal: {}
});