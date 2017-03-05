/* global document, navigator, Connection */

(function() {
    define('connection', ['ember', 'phonegap', 'connection-mixin'], function(Ember, phonegap, connectionMixin) {
        'use strict';

        Ember = Ember.default;
        phonegap = phonegap.default;
        connectionMixin = connectionMixin.default;

        var connection = Ember.Object.extend(connectionMixin).create({
                getIsOnline: function() {
                    var type = navigator.connection.type;

                    return type !== Connection.NONE && type !== Connection.UNKNOWN;
                },
                getIsWifi: function() {
                    var type = navigator.connection.type;

                    return type === Connection.WIFI;
                }
            }),
            onReady;

        onReady = phonegap.onDeviceReady.then(function() {
            connection.set('isOnline', connection.getIsOnline());

            document.addEventListener('online', function() {
                if (!connection.get('isOnline')) {
                    connection.execute('online');
                }

                if (!connection.get('isWifi') && connection.getIsWifi()) {
                    connection.execute('wifi');
                }
            });
            document.addEventListener('offline', function() {
                if (connection.get('isOnline')) {
                    connection.execute('offline');
                }
            });
        });

        connection.set('onReady', onReady);

        return {
            'default': connection
        };
    });
})();
