/*global MusicControls*/

(function() {
    define('music-controls', ['ember', 'cordova'], function(Ember, cordova) {
        'use strict';

        Ember = Ember.default;
        cordova = cordova.default;

        var musicControls = {};

        cordova.onDeviceReady.then(function() {
            musicControls.init = function(context, actions) {
                MusicControls.subscribe(function(action) {
                    actions[action].call(context);
                });

                MusicControls.listen();
            };

            musicControls.play: function() {
                MusicControls.updateIsPlaying(true);
            };

            musicControls.pause: function() {
                MusicControls.updateIsPlaying(false);
            };

            musicControls.load: function(track) {
                MusicControls.create({
                    track: track.get('name'),
                    cover: track.get('thumbnail'),
                    ticker: 'Now playing "' + track.get('name') + '"'
                });
            };

            musicControls.destroy: function() {
                MusicControls.destroy();
            };
        });

        return {
            'default': musicControls
        };
    });
})();
