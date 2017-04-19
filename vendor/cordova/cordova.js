(function() {
    define('cordova', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        var setDeviceReady;

        return {
            'default': Ember.Object.create({
                setDeviceReady: function() {
                    setDeviceReady();
                },
                onDeviceReady: new Ember.RSVP.Promise(function(resolve) {
                    setDeviceReady = resolve;
                })
            })
        };
    });
})();
