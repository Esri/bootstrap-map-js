require(["doh/runner", 'jimu/ConfigManager', 'dojo/topic'],
function(doh, ConfigManager, topic) {

	doh.register("config tests", [

	function nonExistConfig() {
		var cm = ConfigManager.prototype.getInstance('non-exist');
		var dohDeferred = new doh.Deferred();

		var handle = topic.subscribe('appConfigLoadError', function(err){
			handle.remove();
			dohDeferred.getTestCallback(function(err){
				doh.assertEqual(404, err.response.status);
				delete cm;
			})(err);
		});

		cm.startup();

		return dohDeferred;
  },

  function badJSONFormat() {
		var cm = ConfigManager.prototype.getInstance({config: 'bad-format'});
		var dohDeferred = new doh.Deferred();

		var handle = topic.subscribe('appConfigLoadError', function(err){
			handle.remove();
			dohDeferred.getTestCallback(function(err){
				doh.assertTrue(typeof err !== 'undefined');
				delete cm;
			})(err);
		});

		cm.startup();

		return dohDeferred;
  },

  function rightConfig() {
		var cm = ConfigManager.prototype.getInstance({config: 'ok'});
		var dohDeferred = new doh.Deferred();

		var handle = topic.subscribe('appConfigLoaded', function(config){
			handle.remove();
			dohDeferred.getTestCallback(function(){
				doh.assertEqual('zh_CN', config.locale);
				doh.assertEqual(undefined, config.theme);
				delete cm;
			})();
		});

		cm.startup();

		return dohDeferred;
  }
	
	]);

	doh.runOnLoad();
});