/* global document, navigator, Connection */

(function() {
    define('connection', ['ember', 'cordova', 'connection-mixin'], function(Ember, cordova, connectionMixin) {
        'use strict';

        Ember = Ember.default;
        cordova = cordova.default;
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
        });

        cordova.onDeviceReady.then(function() {
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

        return {
            'default': connection
        };
    });
})();
