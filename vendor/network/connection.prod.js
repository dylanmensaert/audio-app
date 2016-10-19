/* global document, navigator, Connection */

(function() {
    define('connection', ['ember', 'phonegap'], function(Ember, phonegap) {
        'use strict';

        Ember = Ember.default;
        phonegap = phonegap.default;

        var connection,
            onReady;

        connection = Ember.Object.create({
            isOnline: function() {
                return type !== Connection.NONE && type !== Connection.UNKNOWN;
            },
            isMobile: function() {
                var type = navigator.connection.type;

                return type === Connection.CELL_2G || type === Connection.CELL_3G || type === Connection.CELL_4G || type ===
                    Connection.CELL;
            },
            onMobile: function(executable) {
                if (this.isMobile()) {
                    executable();
                }

                this.get('executables').pushObject(executable);
            },
            execute: function() {
                if (this.isMobile()) {
                    this.get('executables').forEach(function(executable) {
                        executable();
                    });
                }
            }
        });

        onReady = phonegap.get('onDeviceReady').then(function() {
            document.addEventListener('online', function() {
                connection.execute();
            });
        });

        connection.set('onReady', onReady);

        return {
            'default': connection
        };
    });
})();
