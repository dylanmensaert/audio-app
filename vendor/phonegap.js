/* global document */
(function() {
    define('phonegap', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        var setDeviceReady,
            onDeviceReady;

        onDeviceReady = new Ember.RSVP.Promise(function(resolve) {
            setDeviceReady = resolve;
        });

        document.addEventListener('deviceready', setDeviceReady);

        return {
            'default': Ember.Object.create({
                onDeviceReady: onDeviceReady
            })
        };
    });
})();
