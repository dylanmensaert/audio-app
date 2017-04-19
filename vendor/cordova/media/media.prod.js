/*global Media, setInterval, clearInterval*/

(function() {
    define('media', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': {
                setCurrentTime: function(givenTime) {
                    this.instance.seekTo(givenTime);
                },
                play: function() {
                    this.instance.play();
                    this.audioPlayer.set('status', 'playing');

                    this.startInterval();
                },
                pause: function() {
                    this.instance.pause();
                    this.audioPlayer.set('status', 'idle');

                    clearInterval(this.interval);
                },
                load: function(src) {
                    if (this.instance) {
                        this.instance.release();
                    }

                    this.audioPlayer.set('status', 'loading');
                    this.audioPlayer.set('currentTime', 0);

                    this.instance = new Media(src, function() {
                        var duration = this.instance.getDuration();

                        this.audioPlayer.set('duration', duration);
                        this.startInterval();
                    }.bind(this));
                },
                startInterval: function() {
                    this.interval = setInterval(function() {
                        var currentPosition = this.instance.getCurrentPosition();

                        this.audioPlayer.set('currentTime', currentPosition);
                    }.bind(this), 1000);
                },
                instance: null,
                interval: null,
                audioPlayer: null
            }
        };
    });
})();
