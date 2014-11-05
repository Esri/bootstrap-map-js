require(["doh/runner", 'require'],
function(doh, require) {

	//this test can't passed with unknow reason
	doh.register("jquery loader tests 2", [{
		name: 'test1',
		runTest: function () {
			var url = '../jquery/jquery-1.10.1.js';
			var dohDeferred = new doh.Deferred();
			require(['jimulibs/jquery-loader!' + url], function($){
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
	}
	]);

	doh.runOnLoad();
});