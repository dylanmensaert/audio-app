/* global document */
(function() {
    define('phonegap', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': Ember.Object.create({
                onDeviceReady: Ember.RSVP.resolve()
            })
        };
    });
})();
