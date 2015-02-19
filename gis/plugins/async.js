/*global dojoConfig */
/*jshint unused:true */
define(function () {
    var cb = '_asyncApiLoaderCallback';
    return {
        load: function (param, req, loadCallback) {
            if (!cb) {
                return;
            } else {
                dojoConfig[cb] = function () {
                    delete dojoConfig[cb];
                    cb = null;
                    loadCallback();
                };
                require([param + '&callback=dojoConfig.' + cb]);
            }
        }
    };
});