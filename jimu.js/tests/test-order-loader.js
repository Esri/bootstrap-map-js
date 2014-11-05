require(["doh/runner"],
function(doh) {

	doh.register("jquery loader tests", [{
		name: 'test1',
		runTest: function () {
			var url = './jsfiles/a.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/order-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertEqual('a', test_order_load_value);
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
			var url = './jsfiles/a.js,./jsfiles/b.js';
			var dohDeferred = new doh.Deferred();
			require(['jimu/loaderplugins/order-loader!' + url], function($){
				dohDeferred.getTestCallback(function() {
					doh.assertEqual('b', test_order_load_value);
				}, function(err) {
					dohDeferred.errback(err);
				})();
			});

			return dohDeferred;
		},
		timeout: 1000
	}
	]);

	doh.runOnLoad();
});