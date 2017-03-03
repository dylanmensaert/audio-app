/* global window */

(function() {
    define('connection', ['ember', 'connection-mixin'], function(Ember, connectionMixin) {
        'use strict';

        Ember = Ember.default;
        connectionMixin = connectionMixin.default;

        var connection = Ember.Object.extend(connectionMixin).create({
            isOnline: true,
            getIsOnline: function() {
                return this.get('isOnline');
            },
            getIsMobile: function() {
                return this.get('isMobile');
            },
            onReady: Ember.RSVP.resolve()
        });

        if (connection.get('isOnline')) {
            connection.setOnline();
        } else {
            connection.setOffline();
        }

        window.connection = connection;

        return {
            'default': connection
        };
    });
})();
