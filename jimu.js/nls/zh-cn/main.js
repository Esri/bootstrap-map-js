define({
  common: {
    ok: '确定',
    cancel: '取消',
    next: '下一步',
    back: '回退'
  },

  errorCode: "代码",
  errorMessage: "消息",
  errorDetail: "详细",
  widgetPlaceholderTooltip: "请在工具标签页中点击相应的数字来设置",

  tokenUtils: {
    changeHostTip: '当你使用IE浏览器的时候，请用您的机器名代替localhost进行登录'
  },

  oauthHelper: {
    signInBlockedTip: '登陆窗口已被浏览器禁止弹出。请允许浏览器弹出，并刷新页面。'
  },

  symbolChooser: {
    preview: '预览',
    basic: '基本',
    arrows: '箭头',
    business: '商业',
    cartographic: '制图',
    nationalParkService: '公共设施服务',
    outdoorRecreation: '户外休闲',
    peoplePlaces: '活动场所',
    safetyHealth: '安全健康',
    shapes: '几何形状',
    transportation: '交通',
    symbolSize: '符号大小',
    color: '颜色',
    alpha: '不透明度',
    outlineColor: '轮廓线颜色',
    outlineWidth: '轮廓线宽',
    style: '样式',
    width: '宽度',
    text: '文本',
    fontColor: '字体颜色',
    fontSize: '字体大小'
  },

  rendererChooser: {
    use: '使用',
    singleSymbol: '单一符号',
    uniqueSymbol: '唯一值',
    color: '颜色',
    size: '大小',
    toShow: '显示',
    colors: '颜色',
    classes: '分类',
    symbolSize: '符号大小',
    addValue: '添加值',
    setDefaultSymbol: '设置默认符号',
    defaultSymbol: '默认符号',
    selectedSymbol: '被选中的符号',
    value: '值',
    label: '标注',
    range: '范围'
  },

  drawBox: {
    point: "点",
    line: "线",
    polyline: "折线",
    freehandPolyline: "手画折线",
    triangle: "三角形",
    extent: "矩形",
    circle: "圆",
    ellipse: "椭圆",
    polygon: "多边形",
    freehandPolygon: "手画折线",
    text: "文本",
    clear: "清除"
  },

  popupConfig: {
    title: "标题",
    add: "添加",
    fields: "字段",
    noField: "无字段",
    visibility: "可见性",
    name: "名称",
    alias: "别名",
    actions: "操作"
  },

  includeButton: {
    include: "添加"
  },

  loadingShelter: {
    loading: "正在加载"
  },

  basicServiceBrowser: {
    noServicesFound: '没有找到服务。',
    unableConnectTo: '无法连接到'
  },

  serviceBrowser: {
    noGpFound: '没有找到GP服务。',
    unableConnectTo: '无法连接到'
  },

  layerServiceBrowser: {
    noServicesFound: '没有可用的地图服务或要素服务',
    unableConnectTo: '无法连接到'
  },

  basicServiceChooser: {
    validate: "验证",
    example: "例如",
    set: "设置"
  },

  urlInput: {
    invalidUrl: '无效的URL。'
  },

  filterBuilder: {
    addAnotherExpression: "添加其他表达式",
    addSet: "添加集合",
    matchMsg: "显示图层中与以下 ${any_or_all} 表达式相匹配的要素",
    matchMsgSet: "此集合中的以下 ${any_or_all} 表达式为 true",
    all: "所有",
    any: "任意",
    value: "值",
    field: "字段",
    unique: "唯一值",
    none: "无",
    and: "和",
    valueTooltip: "输入值",
    fieldTooltip: "从现有字段中选择",
    uniqueValueTooltip: "从所选字段的唯一值中选择",
    friendlyDatePattern: "月/日/年",
    stringOperatorIs: "是", // e.g. <stringFieldName> is 'California'
    stringOperatorIsNot: "不是",
    stringOperatorStartsWith: "开头是",
    stringOperatorEndsWith: "结尾是",
    stringOperatorContains: "包含",
    stringOperatorDoesNotContain: "不包含",
    stringOperatorIsBlank: "为空",
    stringOperatorIsNotBlank: "不为空",
    dateOperatorIsOn: "在", // e.g. <dateFieldName> is on '1/1/2012'
    dateOperatorIsNotOn: "不在",
    dateOperatorIsBefore: "早于",
    dateOperatorIsAfter: "晚于",
    dateOperatorDays: "天",
    dateOperatorWeeks: "周", // e.g. <dateFieldName> is the last 4 weeks
    dateOperatorMonths: "月",
    dateOperatorInTheLast: "最后",
    dateOperatorNotInTheLast: "不是最后",
    dateOperatorIsBetween: "介于",
    dateOperatorIsNotBetween: "不介于",
    dateOperatorIsBlank: "为空",
    dateOperatorIsNotBlank: "不为空",
    numberOperatorIs: "等于", // e.g. <numberFieldName> is 1000
    numberOperatorIsNot: "不等于",
    numberOperatorIsAtLeast: "最小为",
    numberOperatorIsLessThan: "小于",
    numberOperatorIsAtMost: "最大为",
    numberOperatorIsGreaterThan: "大于",
    numberOperatorIsBetween: "介于",
    numberOperatorIsNotBetween: "不介于",
    numberOperatorIsBlank: "为空",
    numberOperatorIsNotBlank: "不为空",
    string: "字符串",
    number: "数值",
    date: "日期",
    askForValues: "要求提供参数",
    prompt: "提示",
    hint: "提示文本",
    error: {
      invalidParams: "无效的参数",
      invalidUrl: "无效的URL.",
      noFilterFields: "图层 ${name} 不包含可用于过滤的字段。",
      invalidSQL: "无效的SQL表达式。",
      cantParseSQL: "无法解析SQL表达式。"
    }
  },

  featureLayerSource: {
    layer: "图层",
    browse: "浏览",
    selectLayerFromMap: "从当前地图选择图层",
    inputLayerUrl: "输入图层URL",
    selectLayer: "选择图层",
    chooseItem: "选择项目",
    setServiceUrl: "设置服务URL"
  },

  itemSelector: {
    map: "地图",
    selectWebMap: "选择Web Map",
    addMapFromOnlineOrPortal: "从ArcGIS Online或本地门户查找web map供应用使用",
    searchMapName: "使用地图名称搜索...",
    searchNone: "无搜索结果，请重新尝试。",
    groups: "组",
    noneGroups: "没有组",
    signInTip: "登录会话已经过期，请刷新浏览器尝试重新登录。",
    signIn: "登录",
    publicMap: "公共",
    myOrganization: "我的组织",
    myGroup: "我的组",
    myContent: "我的内容",
    count: "数量",
    fromPortal: "from Portal",
    fromOnline: "from ArcGIS.com",
    noneThumbnail: "无缩略图",
    owner: "所有者",
    signInTo: "登录到",
    lastModified: "修改时间",
    moreDetails: "更多信息"
  },

  featureLayerChooserFromPortal: {},

  setPortalUrl: {
    tip: "Specify the URL to your organization or Portal for ArcGIS",
    errPrefix: "Unable to access ",
    errRemind: "A server with the specified hostname could not be found",
    errOrg: "Please input a full URL of your ArcGIS Online organization, for example, http://myorg.maps.arcgis.com"
  },

  portalSignIn: {
    errorMessage: "用户名或密码不正确",
    portalError: "Portal错误",
    username: "用户名",
    password: "密码",
    forgot: "忘记密码",
    remember: "记住用户名和密码",
    signin: "登录",
    back: "后退",
    con: "继续",
    namedUserTip: "Web AppBuilder for ArcGIS不支持公共账号。请使用组织账号登录。",
    signingIn: "正在登录",
    registeringAppID: "正在注册App ID",
    here: "这里",
    appIdTip1: "这是Web AppBuilder第一次与您刚才所指定的组织门户关联使用, 需要一个有效的App ID来支持后续的OAuth2登录流程。",
    appIdTip2: "请提供您的组织账户的用户名密码。一旦验证成功，Web AppBuilder将会自动为您注册App ID，同时在门户的‘我的内容’中生成一个名为 'Web AppBuilder for ArcGIS'的应用项目。请不要删除或修改这个项目。更多关于注册App ID的信息，请参考${here}。"
  },

  basicLayerChooserFromMap: {
    noLayersTip: "当前地图没有可用于查询的要素图层。"
  }
});