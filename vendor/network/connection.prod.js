/* global document, navigator, Connection */

(function() {
    define('connection', ['ember', 'phonegap'], function(Ember, phonegap) {
        'use strict';

        Ember = Ember.default;
        phonegap = phonegap.default;

        return {
            'default': Ember.Object.create({
                isMobile: function() {
                    var type = navigator.connection.type;

                    return type === Connection.CELL_2G || type === Connection.CELL_3G || type === Connection.CELL_4G || type === Connection.CELL;
                },
                onReady: phonegap.onDeviceReady
            })
        };
    });
})();
