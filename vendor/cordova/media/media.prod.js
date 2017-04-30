/*global Media, setInterval, clearInterval*/

(function() {
    define('media', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': {
                setCurrentTime: function(seconds) {
                    this.instance.seekTo(seconds * 1000);
                },
                play: function() {
                    this.startInterval();
                    this.instance.play();

                    this.audioPlayer.set('status', 'playing');
                },
                pause: function() {
                    this.instance.pause();
                    clearInterval(this.interval);

                    this.audioPlayer.set('status', 'idle');
                },
                load: function(src) {
                    if (this.instance) {
                        this.instance.release();
                    }

                    this.audioPlayer.set('currentTime', 0);

                    this.instance = new Media(src);
                    // TODO: Implemented 'mediaStatus' (zie docs)
                    this.play();
                },
                startInterval: function() {
                    this.interval = setInterval(function() {
                        var duration = this.instance.getDuration();

                        if (duration !== -1) {
                            this.audioPlayer.set('duration', duration);
                        }

                        this.instance.getCurrentPosition(function(position) {
                            if (position !== -1) {
                                this.audioPlayer.set('currentTime', position);

                                if (position === duration) {
                                    this.audioPlayer.didEnd();
                                }
                            }
                        }.bind(this));
                    }.bind(this), 1000);
                },
                instance: null,
                interval: null,
                audioPlayer: null
            }
        };
    });
})();
