require(["doh/runner"],
function(doh) {

	doh.register("jquery loader tests", [
	{
		name: 'test1',
		runTest: function () {
			var url = './jquery/jquery-1.10.1.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/jquery-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertTrue(typeof $.ajax !== 'undefined');
					doh.assertEqual('1.10.1', $().jquery);
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'test2',
		runTest: function () {
			var url = './jquery/jquery-1.7.1.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/jquery-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertTrue(typeof $.ajax !== 'undefined');
					doh.assertEqual('1.7.1', $().jquery);
					doh.assertTrue(typeof $().showLoading === 'undefined');
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'test3',
		runTest: function () {
			var url = './jquery/jquery-1.7.1.js, jquery/jquery.showLoading.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/jquery-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertTrue(typeof $.ajax !== 'undefined');
					doh.assertEqual('1.7.1', $().jquery);
					doh.assertTrue(typeof $().showLoading !== 'undefined');
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'test4',
		runTest: function () {
			var url = 'http://localhost:3344/webapp/jimu.js/tests/jquery/jquery-1.10.1.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/jquery-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertTrue(typeof $.ajax !== 'undefined');
					doh.assertEqual('1.10.1', $().jquery);
					doh.assertTrue(typeof $().showLoading === 'undefined');
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 1000
	},
	{
		name: 'test5',
		runTest: function () {
			var url = 'http://localhost:3344/webapp/jimu.js/tests/jquery/jquery-1.10.1.js, jquery/jquery.showLoading.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/jquery-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertTrue(typeof $.ajax !== 'undefined');
					doh.assertEqual('1.10.1', $().jquery);
					//the showLoading plugin is cached in the "jquery/jquery-1.7.1.js" jquery, so here can't access the plugin
					doh.assertTrue(typeof $().showLoading === 'undefined');
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 10000
	},
	{
		name: 'test6',
		runTest: function () {
			var url = 'http://localhost:3344/webapp/jimu.js/tests/jquery/jquery-1.10.1.js, http://localhost:3344/webapp/jimu.js/tests/jquery/jquery.showLoading.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/jquery-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertTrue(typeof $.ajax !== 'undefined');
					doh.assertEqual('1.10.1', $().jquery);
					doh.assertTrue(typeof $().showLoading !== 'undefined');
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 10000
	}
	]);

	doh.runOnLoad();
});