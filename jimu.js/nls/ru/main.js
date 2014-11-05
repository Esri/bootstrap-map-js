define({
  common: {
    ok: 'Ж_Ok_Я',
    cancel: 'Ж_Cancel_Я',
    next: 'Ж_Next_Я',
    back: 'Ж_Back_Я'
  },

  errorCode: "Ж_Code_Я",
  errorMessage: "Ж_Message_Я",
  errorDetail: "Ж_Detail_Я",
  widgetPlaceholderTooltip: "Ж_To set it up, go to Widgets and click corresponding placeholder_Я",

  tokenUtils: {
    changeHostTip: 'Ж_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._Я'
  },

  oauthHelper: {
    signInBlockedTip: 'Ж_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._Я'
  },

  symbolChooser: {
    preview: 'Ж_Preview_Я',
    basic: 'Ж_Basic_Я',
    arrows: 'Ж_Arrows_Я',
    business: 'Ж_Business_Я',
    cartographic: 'Ж_Cartographic_Я',
    nationalParkService: 'Ж_National Park Service_Я',
    outdoorRecreation: 'Ж_Outdoor Recreation_Я',
    peoplePlaces: 'Ж_People Places_Я',
    safetyHealth: 'Ж_Safety Health_Я',
    shapes: 'Ж_Shapes_Я',
    transportation: 'Ж_Transportation_Я',
    symbolSize: 'Ж_Symbol size_Я',
    color: 'Ж_Color_Я',
    alpha: 'Ж_Alpha_Я',
    outlineColor: 'Ж_Outline color_Я',
    outlineWidth: 'Ж_Outline width_Я',
    style: 'Ж_Style_Я',
    width: 'Ж_Width_Я',
    text: 'Ж_Text_Я',
    fontColor: 'Ж_Font color_Я',
    fontSize: 'Ж_Font size_Я'
  },

  rendererChooser: {
    use: 'Ж_Use_Я',
    singleSymbol: 'Ж_A Single Symbol_Я',
    uniqueSymbol: 'Ж_Unique Symbols_Я',
    color: 'Ж_Color_Я',
    size: 'Ж_Size_Я',
    toShow: 'Ж_To Show_Я',
    colors: 'Ж_Colors_Я',
    classes: 'Ж_Classes_Я',
    symbolSize: 'Ж_Symbol size_Я',
    addValue: 'Ж_Add Value_Я',
    setDefaultSymbol: 'Ж_Set default symbol_Я',
    defaultSymbol: 'Ж_Default Symbol_Я',
    selectedSymbol: 'Ж_Selected Symbol_Я',
    value: 'Ж_Value_Я',
    label: 'Ж_Label_Я',
    range: 'Ж_Range_Я'
  },

  drawBox: {
    point: "Ж_Point_Я",
    line: "Ж_Line_Я",
    polyline: "Ж_Polyline_Я",
    freehandPolyline: "Ж_Freehand Polyline_Я",
    triangle: "Ж_Triangle_Я",
    extent: "Ж_Extent_Я",
    circle: "Ж_Circle_Я",
    ellipse: "Ж_Ellipse_Я",
    polygon: "Ж_Polygon_Я",
    freehandPolygon: "Ж_Freehand Polygon_Я",
    text: "Ж_Text_Я",
    clear: "Ж_Clear_Я"
  },

  popupConfig: {
    title: "Ж_Title_Я",
    add: "Ж_Add_Я",
    fields: "Ж_Fields_Я",
    noField: "Ж_No field_Я",
    visibility: "Ж_Visible_Я",
    name: "Ж_Name_Я",
    alias: "Ж_Alias_Я",
    actions: "Ж_Actions_Я"
  },

  includeButton: {
    include: "Ж_Include_Я"
  },

  loadingShelter: {
    loading: "Ж_Loading_Я"
  },

  basicServiceBrowser: {
    noServicesFound: 'Ж_No services were found._Я',
    unableConnectTo: 'Ж_Unable to connect to_Я'
  },

  serviceBrowser: {
    noGpFound: 'Ж_No geoprocessing services were found._Я',
    unableConnectTo: 'Ж_Unable to connect to_Я'
  },

  layerServiceBrowser: {
    noServicesFound: 'Ж_No MapServer or FeatureServer services were found_Я',
    unableConnectTo: 'Ж_Unable to connect to_Я'
  },

  basicServiceChooser: {
    validate: "Ж_Validate_Я",
    example: "Ж_Example_Я",
    set: "Ж_Set_Я"
  },

  urlInput: {
    invalidUrl: 'Ж_Invalid url._Я'
  },

  filterBuilder: {
    addAnotherExpression: "Ж_Add another expression_Я",
    addSet: "Ж_Add a set_Я",
    matchMsg: "Ж_Display features in the layer that match ${any_or_all} of the following expressions_Я",
    matchMsgSet: "Ж_${any_or_all} of the following expressions in this set are true_Я",
    all: "Ж_All_Я",
    any: "Ж_Any_Я",
    value: "Ж_Value_Я",
    field: "Ж_Field_Я",
    unique: "Ж_Unique_Я",
    none: "Ж_None_Я",
    and: "Ж_and_Я",
    valueTooltip: "Ж_Enter value_Я",
    fieldTooltip: "Ж_Pick from existing field_Я",
    uniqueValueTooltip: "Ж_Pick from unique values in selected field_Я",
    friendlyDatePattern: "Ж_MM/dd/yyyy_Я",
    stringOperatorIs: "Ж_is_Я", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "Ж_is not_Я",
    stringOperatorStartsWith: "Ж_starts with_Я",
    stringOperatorEndsWith: "Ж_ends with_Я",
    stringOperatorContains: "Ж_contains_Я",
    stringOperatorDoesNotContain: "Ж_does not contain_Я",
    stringOperatorIsBlank: "Ж_is blank_Я",
    stringOperatorIsNotBlank: "Ж_is not blank_Я",
    dateOperatorIsOn: "Ж_is on_Я", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "Ж_is not on_Я",
    dateOperatorIsBefore: "Ж_is before_Я",
    dateOperatorIsAfter: "Ж_is after_Я",
    dateOperatorDays: "Ж_days_Я",
    dateOperatorWeeks: "Ж_weeks_Я", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "Ж_months_Я",
    dateOperatorInTheLast: "Ж_in the last_Я",
    dateOperatorNotInTheLast: "Ж_not in the last_Я",
    dateOperatorIsBetween: "Ж_is between_Я",
    dateOperatorIsNotBetween: "Ж_is not between_Я",
    dateOperatorIsBlank: "Ж_is blank_Я",
    dateOperatorIsNotBlank: "Ж_is not blank_Я",
    numberOperatorIs: "Ж_is_Я", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "Ж_is not_Я",
    numberOperatorIsAtLeast: "Ж_is at least_Я",
    numberOperatorIsLessThan: "Ж_is less than_Я",
    numberOperatorIsAtMost: "Ж_is at most_Я",
    numberOperatorIsGreaterThan: "Ж_is greater than_Я",
    numberOperatorIsBetween: "Ж_is between_Я",
    numberOperatorIsNotBetween: "Ж_is not between_Я",
    numberOperatorIsBlank: "Ж_is blank_Я",
    numberOperatorIsNotBlank: "Ж_is not blank_Я",
    string: "Ж_String_Я",
    number: "Ж_Number_Я",
    date: "Ж_Date_Я",
    askForValues: "Ж_Ask for values_Я",
    prompt: "Ж_Prompt_Я",
    hint: "Ж_Hint_Я",
    error: {
      invalidParams: "Ж_Invalid parameters._Я",
      invalidUrl: "Ж_Invalid url._Я",
      noFilterFields: "Ж_Layer has no fields that can be used for filtering._Я",
      invalidSQL: "Ж_Invalid sql expression._Я",
      cantParseSQL: "Ж_Can't parse the sql expression._Я"
    }
  },

  featureLayerSource: {
    layer: "Ж_Layer_Я",
    browse: "Ж_Browse_Я",
    selectLayerFromMap: "Ж_Select layer from map_Я",
    inputLayerUrl: "Ж_Input layer url_Я"
  },

  itemSelector: {
    map: "Ж_Map_Я",
    selectWebMap: "Ж_Select Web Map_Я",
    addMapFromOnlineOrPortal: "Ж_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._Я",
    searchMapName: "Ж_Search by map name..._Я",
    searchNone: "Ж_We couldn't find what you were looking for.Please try another one._Я",
    groups: "Ж_Groups_Я",
    noneGroups: "Ж_No groups_Я",
    signInTip: "Ж_Please sign in to access your private content._Я",
    signIn: "Ж_Sign in_Я",
    publicMap: "Ж_Public_Я",
    myOrganization: "Ж_My Organization_Я",
    myGroup: "Ж_My Groups_Я",
    myContent: "Ж_My Content_Я",
    count: "Ж_Count_Я",
    fromPortal: "Ж_from Portal_Я",
    fromOnline: "Ж_from ArcGIS.com_Я",
    noneThumbnail: "Ж_Thumbnail not available_Я",
    owner: "Ж_owner_Я",
    signInTo: "Ж_Sign in to_Я",
    lastModified: "Ж_Last Modified_Я",
    moreDetails: "Ж_More Details_Я"
  },

  featureLayerChooserFromPortal: {}
});