define({
  common: {
    ok: '한_Ok_빠',
    cancel: '한_Cancel_빠',
    next: '한_Next_빠',
    back: '한_Back_빠'
  },

  errorCode: "한_Code_빠",
  errorMessage: "한_Message_빠",
  errorDetail: "한_Detail_빠",
  widgetPlaceholderTooltip: "한_To set it up, go to Widgets and click corresponding placeholder_빠",

  tokenUtils: {
    changeHostTip: '한_Please use your server name instead of localhost to sign in to ArcGIS.com when you use IE._빠'
  },

  oauthHelper: {
    signInBlockedTip: '한_The login window is blocked by the browser. Please let the browser unblock it, then refresh the site._빠'
  },

  symbolChooser: {
    preview: '한_Preview_빠',
    basic: '한_Basic_빠',
    arrows: '한_Arrows_빠',
    business: '한_Business_빠',
    cartographic: '한_Cartographic_빠',
    nationalParkService: '한_National Park Service_빠',
    outdoorRecreation: '한_Outdoor Recreation_빠',
    peoplePlaces: '한_People Places_빠',
    safetyHealth: '한_Safety Health_빠',
    shapes: '한_Shapes_빠',
    transportation: '한_Transportation_빠',
    symbolSize: '한_Symbol size_빠',
    color: '한_Color_빠',
    alpha: '한_Alpha_빠',
    outlineColor: '한_Outline color_빠',
    outlineWidth: '한_Outline width_빠',
    style: '한_Style_빠',
    width: '한_Width_빠',
    text: '한_Text_빠',
    fontColor: '한_Font color_빠',
    fontSize: '한_Font size_빠'
  },

  rendererChooser: {
    use: '한_Use_빠',
    singleSymbol: '한_A Single Symbol_빠',
    uniqueSymbol: '한_Unique Symbols_빠',
    color: '한_Color_빠',
    size: '한_Size_빠',
    toShow: '한_To Show_빠',
    colors: '한_Colors_빠',
    classes: '한_Classes_빠',
    symbolSize: '한_Symbol size_빠',
    addValue: '한_Add Value_빠',
    setDefaultSymbol: '한_Set default symbol_빠',
    defaultSymbol: '한_Default Symbol_빠',
    selectedSymbol: '한_Selected Symbol_빠',
    value: '한_Value_빠',
    label: '한_Label_빠',
    range: '한_Range_빠'
  },

  drawBox: {
    point: "한_Point_빠",
    line: "한_Line_빠",
    polyline: "한_Polyline_빠",
    freehandPolyline: "한_Freehand Polyline_빠",
    triangle: "한_Triangle_빠",
    extent: "한_Extent_빠",
    circle: "한_Circle_빠",
    ellipse: "한_Ellipse_빠",
    polygon: "한_Polygon_빠",
    freehandPolygon: "한_Freehand Polygon_빠",
    text: "한_Text_빠",
    clear: "한_Clear_빠"
  },

  popupConfig: {
    title: "한_Title_빠",
    add: "한_Add_빠",
    fields: "한_Fields_빠",
    noField: "한_No field_빠",
    visibility: "한_Visible_빠",
    name: "한_Name_빠",
    alias: "한_Alias_빠",
    actions: "한_Actions_빠"
  },

  includeButton: {
    include: "한_Include_빠"
  },

  loadingShelter: {
    loading: "한_Loading_빠"
  },

  basicServiceBrowser: {
    noServicesFound: '한_No services were found._빠',
    unableConnectTo: '한_Unable to connect to_빠'
  },

  serviceBrowser: {
    noGpFound: '한_No geoprocessing services were found._빠',
    unableConnectTo: '한_Unable to connect to_빠'
  },

  layerServiceBrowser: {
    noServicesFound: '한_No MapServer or FeatureServer services were found_빠',
    unableConnectTo: '한_Unable to connect to_빠'
  },

  basicServiceChooser: {
    validate: "한_Validate_빠",
    example: "한_Example_빠",
    set: "한_Set_빠"
  },

  urlInput: {
    invalidUrl: '한_Invalid url._빠'
  },

  filterBuilder: {
    addAnotherExpression: "한_Add another expression_빠",
    addSet: "한_Add a set_빠",
    matchMsg: "한_Display features in the layer that match ${any_or_all} of the following expressions_빠",
    matchMsgSet: "한_${any_or_all} of the following expressions in this set are true_빠",
    all: "한_All_빠",
    any: "한_Any_빠",
    value: "한_Value_빠",
    field: "한_Field_빠",
    unique: "한_Unique_빠",
    none: "한_None_빠",
    and: "한_and_빠",
    valueTooltip: "한_Enter value_빠",
    fieldTooltip: "한_Pick from existing field_빠",
    uniqueValueTooltip: "한_Pick from unique values in selected field_빠",
    friendlyDatePattern: "한_MM/dd/yyyy_빠",
    stringOperatorIs: "한_is_빠", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "한_is not_빠",
    stringOperatorStartsWith: "한_starts with_빠",
    stringOperatorEndsWith: "한_ends with_빠",
    stringOperatorContains: "한_contains_빠",
    stringOperatorDoesNotContain: "한_does not contain_빠",
    stringOperatorIsBlank: "한_is blank_빠",
    stringOperatorIsNotBlank: "한_is not blank_빠",
    dateOperatorIsOn: "한_is on_빠", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "한_is not on_빠",
    dateOperatorIsBefore: "한_is before_빠",
    dateOperatorIsAfter: "한_is after_빠",
    dateOperatorDays: "한_days_빠",
    dateOperatorWeeks: "한_weeks_빠", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "한_months_빠",
    dateOperatorInTheLast: "한_in the last_빠",
    dateOperatorNotInTheLast: "한_not in the last_빠",
    dateOperatorIsBetween: "한_is between_빠",
    dateOperatorIsNotBetween: "한_is not between_빠",
    dateOperatorIsBlank: "한_is blank_빠",
    dateOperatorIsNotBlank: "한_is not blank_빠",
    numberOperatorIs: "한_is_빠", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "한_is not_빠",
    numberOperatorIsAtLeast: "한_is at least_빠",
    numberOperatorIsLessThan: "한_is less than_빠",
    numberOperatorIsAtMost: "한_is at most_빠",
    numberOperatorIsGreaterThan: "한_is greater than_빠",
    numberOperatorIsBetween: "한_is between_빠",
    numberOperatorIsNotBetween: "한_is not between_빠",
    numberOperatorIsBlank: "한_is blank_빠",
    numberOperatorIsNotBlank: "한_is not blank_빠",
    string: "한_String_빠",
    number: "한_Number_빠",
    date: "한_Date_빠",
    askForValues: "한_Ask for values_빠",
    prompt: "한_Prompt_빠",
    hint: "한_Hint_빠",
    error: {
      invalidParams: "한_Invalid parameters._빠",
      invalidUrl: "한_Invalid url._빠",
      noFilterFields: "한_Layer has no fields that can be used for filtering._빠",
      invalidSQL: "한_Invalid sql expression._빠",
      cantParseSQL: "한_Can't parse the sql expression._빠"
    }
  },

  featureLayerSource: {
    layer: "한_Layer_빠",
    browse: "한_Browse_빠",
    selectLayerFromMap: "한_Select layer from map_빠",
    inputLayerUrl: "한_Input layer url_빠"
  },

  itemSelector: {
    map: "한_Map_빠",
    selectWebMap: "한_Select Web Map_빠",
    addMapFromOnlineOrPortal: "한_Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal._빠",
    searchMapName: "한_Search by map name..._빠",
    searchNone: "한_We couldn't find what you were looking for.Please try another one._빠",
    groups: "한_Groups_빠",
    noneGroups: "한_No groups_빠",
    signInTip: "한_Please sign in to access your private content._빠",
    signIn: "한_Sign in_빠",
    publicMap: "한_Public_빠",
    myOrganization: "한_My Organization_빠",
    myGroup: "한_My Groups_빠",
    myContent: "한_My Content_빠",
    count: "한_Count_빠",
    fromPortal: "한_from Portal_빠",
    fromOnline: "한_from ArcGIS.com_빠",
    noneThumbnail: "한_Thumbnail not available_빠",
    owner: "한_owner_빠",
    signInTo: "한_Sign in to_빠",
    lastModified: "한_Last Modified_빠",
    moreDetails: "한_More Details_빠"
  },

  featureLayerChooserFromPortal: {}
});