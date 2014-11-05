require(["doh/runner", 'jimu/utils', 'jimu/WidgetManager', 'dojo/query'],
function(doh, utils, WidgetManager, query) {
	var appConfig = {
		locale: 'en_US',
		theme: 'default'
	}, basePath = '../../../';
	doh.register("utils tests", [
	
	function testReplace1() {
		var o1 = {a: 1, b: 2}, p = {}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual(o1, o2);
	},
	function testReplace2() {
		var o1 = {}, p = {}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual(o1, o2);
	},
	function testReplace3() {
		var o1 = {a: '1', b: '${}'}, p = {}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual(o1, o2);
	},
	function testReplace4() {
		var o1 = {a: '1', b: '${p1}'}, p = {}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual(o1, o2);
	},
	function testReplace5() {
		var o1 = {a: '1', b: '${p1}'}, p = {p1: '1'}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual({a: '1', b: '1'}, o2);
	},
	function testReplace6() {
		var o1 = {a: '1', b: '${p1}', c: '${p2}'}, p = {p1: '1'}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual({a: '1', b: '1', c: '${p2}'}, o2);
	},
	function testReplace7() {
		var o1 = {a: '1', b: '${p1}', c: '${p2}'}, p = {p1: '1', p2: '2'}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual({a: '1', b: '1', c: '2'}, o2);
	},
	function testReplace8() {
		var o1 = {a: '1', b: '${p1}', c: '${p2}', d: '${p1}'}, p = {p1: '1', p2: '2'}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual({a: '1', b: '1', c: '2', d: '1'}, o2);
	},
	function testReplace9() {
		var o1 = {a: '1', b: {b1: '${p1}', b2: '${p2}'}, c: '${p2}'}, p = {p1: '1', p2: '2'}, o2;
		o2 = utils.replacePlaceHolder(o1, p);
		doh.assertEqual({a: '1', b: {b1: '1', b2: '2'}, c: '2'}, o2);
	},
	function testChangeUnit1() {
		var lat = 117.59709, text = utils.changeUnit(lat);
		doh.assertEqual('117\u00B035\'49.52"', text);
	},
	function testChangeUnit2() {
		var lat = 36.12432314, text = utils.changeUnit(lat);
		doh.assertEqual('36\u00B007\'27.56"', text);
	},
	function testChangeUnit3() {
		var lat = -36.12432314, text = utils.changeUnit(lat);
		doh.assertEqual('36\u00B007\'27.56"', text);
	},
	function testChangeUnit4() {
		var lat =  52.20, text = utils.changeUnit(lat);
		doh.assertEqual('52\u00B012\'00.00"', text);
	},
	function testFormat1() {
		doh.assertEqual('00:00.0', utils.formatTime(0));
	},
	function testFormat2() {
		doh.assertEqual('00:00.0', utils.formatTime(1));
	},
	function testFormat3() {
		doh.assertEqual('00:00.1', utils.formatTime(100));
	},
	function testFormat4() {
		doh.assertEqual('00:00.9', utils.formatTime(900));
	},
	function testFormat5() {
		doh.assertEqual('00:01.0', utils.formatTime(1000));
	},
	function testFormat6() {
		doh.assertEqual('00:10.0', utils.formatTime(10000));
	},
	function testFormat7() {
		doh.assertEqual('01:00.0', utils.formatTime(1000*60));
	},
	function testFormat8() {
		doh.assertEqual('12:00.0', utils.formatTime(1000*60*12));
	},
	function testFormat9() {
		doh.assertEqual('100:00.0', utils.formatTime(1000*60*100));
	},
	function testFormat10() {
		doh.assertEqual('02:01.2', utils.formatTime(1000*60*2+1200));
	},
	function testParseTime1() {
		doh.assertEqual(0, utils.parseTime('00:00.0'));
	},
	function testParseTime3() {
		doh.assertEqual(100, utils.parseTime('00:00.1'));
	},
	function testParseTime4() {
		doh.assertEqual(900, utils.parseTime('00:00.9'));
	},
	function testParseTime5() {
		doh.assertEqual(1000, utils.parseTime('00:01.0'));
	},
	function testParseTime6() {
		doh.assertEqual(10000, utils.parseTime('00:10.0'));
	},
	function testParseTime7() {
		doh.assertEqual(1000*60, utils.parseTime('01:00.0'));
	},
	function testParseTime8() {
		doh.assertEqual(1000*60*12, utils.parseTime('12:00.0'));
	},
	function testParseTime9() {
		doh.assertEqual(1000*60*100, utils.parseTime('100:00.0'));
	},
	function testParseTime10() {
		doh.assertEqual(1000*60*2+1200, utils.parseTime('02:01.2'));
	},
	function testEqual1() {
		doh.assertTrue(utils.isEqual(1,1));
	},
	function testEqual2() {
		doh.assertTrue(utils.isEqual({},{}));
	},
	function testEqual3() {
		doh.assertTrue(utils.isEqual({a:1},{a:1}));
	},
	function testEqual4() {
		doh.assertTrue(utils.isEqual({a:1,b:2},{b:2,a:1}));
	},
	function testEqual5() {
		doh.assertTrue(utils.isEqual({a:1,b:{bb:1}},{a:1,b:{bb:1}}));
	},
	function testEqual6() {
		doh.assertFalse(utils.isEqual({a:2,b:2},{b:2,a:1}));
	},
	function testEqual7() {
		doh.assertTrue(utils.isEqual([],[]));
	},
	function testEqual8() {
		doh.assertTrue(utils.isEqual([1],[1]));
	},
	function testEqual9() {
		doh.assertTrue(utils.isEqual([{}],[{}]));
	},
	function testEqual10() {
		doh.assertTrue(utils.isEqual([{a:1}],[{a:1}]));
	},
	function testEqual11() {
		doh.assertTrue(utils.isEqual([{a:1},{b:2}],[{a:1},{b:2}]));
	},
	function testEqual12() {
		doh.assertTrue(utils.isEqual([{a:[1]}],[{a:[1]}]));
	},
	function testEqual13() {
		doh.assertTrue(utils.isEqual(
			[{"label":"new group","widgets":["bookmarks","map2Webmap"]},{"widgets":["gestureTest"]},{"label":"g3","widgets":["simple","mapSwitcher"]}],
			[{"label":"new group","widgets":["bookmarks","map2Webmap"]},{"widgets":["gestureTest"]},{"label":"g3","widgets":["simple","mapSwitcher"]}]
		));
	},
	function testMerge1() {
		doh.assertEqual({a:1,b:2}, utils.merge({a:1},{b:2}));
	},
	function testMerge2() {
		doh.assertEqual({a:2}, utils.merge({a:1},{a:2}));
	},
	function testMerge3() {
		doh.assertEqual({a:1,b:{b1:1, b2:2}}, utils.merge({a:1, b:{b1:1}},{b:{b2:2}}));
	},
	function testMerge4() {
		doh.assertEqual({a:1,b:[1,2,3,4]}, utils.merge({a:1, b:[1,2]},{b:[3,4]}));
	},
	function testMerge5() {
		doh.assertEqual({a:1,b:[{a:2}]}, utils.merge({a:1, b:[{a:1}]},{b:[{a:2}]}));
	},
	function testMerge6() {
		doh.assertEqual({a:1,b:{p:2, a:[{a:2}]}}, utils.merge({a:1, b:{p:1, a:[{a:1}]}},{b:{p:2, a:[{a:2}]}}));
	},
	function testMerge7() {
		doh.assertEqual({
		  "supportScreen": [320, 480],
		  "UIController": [{
		      "class": "esriwidgets/Footer/FooterWidget",
		      "region": "bottom",
		      "height": 24,
		      "hasConfig": false
		    }
		  ]}, utils.merge({
			  "supportScreen": [320, 480],
			  "UIController": [{
			      "class": "esriwidgets/Footer/FooterWidget",
			      "region": "bottom",
			      "height": 0,
			      "hasConfig": false
			    }
			  ]},{
				  "UIController": [{
				      "height": 24
				    }
				  ]}));
	},
	
		function testReCreateArray1(){
			doh.assertEqual({}, utils.reCreateArray({}));
		},

		function testReCreateArray2(){
			doh.assertEqual({a: 1}, utils.reCreateArray({a: 1}));
		},

		function testReCreateArray3(){
			doh.assertEqual({a: {b: 1}}, utils.reCreateArray({a: {b: 1}}));
		},

		function testReCreateArray4(){
			doh.assertEqual([], utils.reCreateArray([]));
		},

		function testReCreateArray5(){
			doh.assertEqual([1, 2], utils.reCreateArray([1, 2]));
		},

		function testReCreateArray6(){
			doh.assertEqual([{a: 1}, {b: 2}], utils.reCreateArray([{a: 1}, {b: 2}]));
		},

		function testReCreateArray7(){
			doh.assertEqual([{a: [1, 2]}, {b: 2}], utils.reCreateArray([{a: [1, 2]}, {b: 2}]));
		},

		function testReCreateArray8(){
			doh.assertEqual([[1, 2], {b: 2}], utils.reCreateArray([[1, 2], {b: 2}]));
		},

		function testReCreateArray9(){
			var o = {"theme":{"name":"FoldableTheme","styles":["default"],"layout":"config-default.json"},"portalUrl":"http://www.arcgis.com/","appId":"senJpIJA845L4FlP","title":"ArcGIS Web Application","subtitle":"with ArcGIS WebApp Builder","splashPage":"widgets/Splash/Widget","geometryService":"http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer","logo":"images/done.png","links":[{"label":"ArcGIS Online","url":"//www.arcgis.com"},{"label":"google","url":"//www.google.com"},{"label":"gitHub","url":"//gitHub.com"},{"label":"ArcGIS 1","url":"//www.arcgis.com/features"}],"widgetOnScreen":{"panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map"},"widgets":[{"label":"HeaderController","uri":"widgets/HeaderController/Widget","positionRelativeTo":"browser","position":{"left":0,"top":0,"right":0,"height":40},"config":{"widgets":"all","groups":"all"},"panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"browser","position":{"left":0,"top":0,"right":0,"height":40}},"icon":"/apps/15/widgets/HeaderController/images/icon.png","id":"widgets/HeaderController/Widget_1"},{"label":"Scalebar","uri":"widgets/Scalebar/Widget","position":{"left":25,"bottom":25},"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":25,"bottom":25}},"icon":"/apps/15/widgets/Scalebar/images/icon.png","id":"widgets/Scalebar/Widget_2"},{"label":"Locator","uri":"widgets/Locator/Widget","position":{"left":45,"top":5},"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":45,"top":5}},"icon":"/apps/15/widgets/Locator/images/icon.png","id":"widgets/Locator/Widget_3"},{"position":{"left":45,"top":45,"width":400,"height":410},"placeholderIndex":1,"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":45,"top":45,"width":400,"height":410}},"id":"undefined_4"},{"label":"Measurement","uri":"widgets/Measurement/Widget","position":{"left":95,"top":45,"height":200},"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":95,"top":45,"height":200}},"icon":"/apps/15/widgets/Measurement/images/icon.png","id":"widgets/Measurement/Widget_5"},{"position":{"left":200,"bottom":10},"placeholderIndex":2,"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":200,"bottom":10}},"id":"undefined_6"},{"label":"OverviewMap","uri":"widgets/OverviewMap/Widget","position":{"right":0,"bottom":0},"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"right":0,"bottom":0}},"icon":"/apps/15/widgets/OverviewMap/images/icon.png","id":"widgets/OverviewMap/Widget_7"},{"label":"HomeButton","uri":"widgets/HomeButton/Widget","position":{"left":7,"top":75},"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":7,"top":75}},"icon":"/apps/15/widgets/HomeButton/images/icon.png","id":"widgets/HomeButton/Widget_8"},{"label":"MyLocation","uri":"widgets/MyLocation/Widget","position":{"left":7,"top":110},"positionRelativeTo":"map","panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel","positionRelativeTo":"map","position":{"left":7,"top":110}},"icon":"/apps/15/widgets/MyLocation/images/icon.png","id":"widgets/MyLocation/Widget_9"}]},"map":{"3D":false,"2D":true,"position":{"left":0,"top":40,"right":0,"bottom":0},"itemId":"a5ec3b581de145d7a801dd3e62304394","mapOptions":{"center":[-98,40],"scale":16937199},"id":"map"},"widgetPool":{"panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"groups":[{"label":"g2","widgets":[{"label":"LayerSwipe","uri":"widgets/LayerSwipe/Widget","panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"/apps/15/widgets/LayerSwipe/images/icon.png","id":"widgets/LayerSwipe/Widget_11"},{"label":"Geoenrichment","uri":"widgets/Geoenrichment/Widget","panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"/apps/15/widgets/Geoenrichment/images/icon.png","id":"widgets/Geoenrichment/Widget_12"}],"panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"jimu.js/images/group_icon.png","id":"undefined_10"}],"widgets":[{"label":"Bookmark","uri":"widgets/Bookmark/Widget","panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"/apps/15/widgets/Bookmark/images/icon.png","id":"widgets/Bookmark/Widget_13"},{"label":"Legend","uri":"widgets/Legend/Widget","panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"/apps/15/widgets/Legend/images/icon.png","id":"widgets/Legend/Widget_14"},{"label":"LayerList","uri":"widgets/LayerList/Widget","panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"/apps/15/widgets/LayerList/images/icon.png","id":"widgets/LayerList/Widget_15"},{"label":"Search","uri":"widgets/Search/Widget","panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"icon":"/apps/15/widgets/Search/images/icon.png","id":"widgets/Search/Widget_16"}]},"mode":"config","locale":"en-us","rawConfig":{"theme":{"name":"FoldableTheme"},"portalUrl":"http://www.arcgis.com","appId":"senJpIJA845L4FlP","title":"ArcGIS Web Application","subtitle":"with ArcGIS WebApp Builder","splashPage":"widgets/Splash/Widget","geometryService":{"url":"http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"},"logo":"images/done.png","links":[{"label":"ArcGIS Online","url":"//www.arcgis.com"},{"label":"google","url":"//www.google.com"},{"label":"gitHub","url":"//gitHub.com"},{"label":"ArcGIS 1","url":"//www.arcgis.com/features"}],"widgetOnScreen":{"panel":{"uri":"themes/FoldableTheme/panels/TitlePanel/Panel"},"widgets":[{"label":"HeaderController","uri":"widgets/HeaderController/Widget","positionRelativeTo":"browser","position":{"left":0,"top":0,"right":0,"height":40},"config":{"widgets":"all","groups":"all"}},{"label":"Scalebar","uri":"widgets/Scalebar/Widget","position":{"left":25,"bottom":25}},{"label":"Locator","uri":"widgets/Locator/Widget","position":{"left":45,"top":5}},{"position":{"left":45,"top":45,"width":400,"height":410}},{"label":"Measurement","uri":"widgets/Measurement/Widget","position":{"left":95,"top":45,"height":200}},{"position":{"left":200,"bottom":10}},{"label":"OverviewMap","uri":"widgets/OverviewMap/Widget","position":{"right":0,"bottom":0}},{"label":"HomeButton","uri":"widgets/HomeButton/Widget","position":{"left":7,"top":75}},{"label":"MyLocation","uri":"widgets/MyLocation/Widget","position":{"left":7,"top":110}}]},"map":{"3D":false,"2D":true,"position":{"left":0,"top":40,"right":0,"bottom":0},"itemId":"a5ec3b581de145d7a801dd3e62304394","mapOptions":{"center":[-98,40],"scale":16937199}},"widgetPool":{"panel":{"uri":"themes/FoldableTheme/panels/FoldablePanel/Panel","positionRelativeTo":"map","position":{"top":5,"right":5,"bottom":5}},"groups":[{"label":"g2","widgets":[{"label":"LayerSwipe","uri":"widgets/LayerSwipe/Widget"},{"label":"Geoenrichment","uri":"widgets/Geoenrichment/Widget"}]}],"widgets":[{"label":"Bookmark","uri":"widgets/Bookmark/Widget"},{"label":"Legend","uri":"widgets/Legend/Widget"},{"label":"LayerList","uri":"widgets/LayerList/Widget"},{"label":"Search","uri":"widgets/Search/Widget"}]}}};
			doh.assertEqual(o, utils.reCreateArray(o));
		}


	]);

doh.runOnLoad();
});