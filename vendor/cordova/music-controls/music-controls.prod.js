/*global MusicControls*/

(function() {
    define('music-controls', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': {
                init: function(context, actions) {
                    MusicControls.subscribe(function(action) {
                        actions[action].call(context);
                    });

                    MusicControls.listen();
                },
                resume: function() {
                    MusicControls.updateIsPlaying(true);
                },
                pause: function() {
                    MusicControls.updateIsPlaying(false);
                },
                load: function(track) {
                    MusicControls.create({
                        track: track.get('name'),
                        cover: track.get('thumbnail'),
                        ticker: 'Now playing "' + track.get('name') + '"'
                    });
                },
                destroy: function() {
                    MusicControls.destroy();
                }
            }
        };
    });
})();
