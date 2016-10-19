/* global window */

(function() {
    define('connection', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': Ember.Object.create({
                isOnline: function() {
                    return true;
                },
                isMobile: function() {
                    return window.isMobile;
                },
                onMobile: function() {},
                onReady: Ember.RSVP.resolve()
            })
        };
    });
})();
