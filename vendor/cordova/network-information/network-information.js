/* global window */

(function() {
    define('connection', ['ember', 'connection-mixin'], function(Ember, connectionMixin) {
        'use strict';

        Ember = Ember.default;
        connectionMixin = connectionMixin.default;

        var connection = Ember.Object.extend(connectionMixin).create({
            isOnline: true,
            isMobile: true,
            getIsOnline: function() {
                return this.get('isOnline');
            },
            getIsMobile: function() {
                return this.get('isMobile');
            }
        });

        window.connection = connection;

        return {
            'default': connection
        };
    });
})();
