import Ember from 'ember';

export default Ember.Service.extend({
    element: null,
    track: null,
    currentTime: null,
    duration: null,
    buffered: null,
    status: null,
    didEnd: null,
    isLargeMode: false,
    isLoading: Ember.computed('status', function() {
        return this.get('status') === 'loading';
    }),
    isPlaying: Ember.computed('status', function() {
        return this.get('status') === 'playing';
    }),
    isIdle: Ember.computed('status', function() {
        return this.get('status') === 'idle';
    }),
    setCurrentTime: function(currentTime) {
        this.get('element').currentTime = currentTime;
    },
    play: function(track) {
        let element = this.get('element'),
            promise;

        if (track) {
            promise = this.load(track).then(function() {
                element.play();
            });
        } else {
            element.play();
        }

        return Ember.RSVP.resolve(promise);
    },
    pause: function() {
        this.get('element').pause();
    },
    load: function(track) {
        let audio = track.get('audio');

        this.set('status', 'loading');
        this.set('track', track);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!audio) {
                track.findAudioSource().then(function(url) {
                    this.loadSource(url);
                }.bind(this), reject);
            } else {
                this.loadSource(audio);

                resolve();
            }
        }.bind(this));
    },
    loadSource: function(source) {
        let element = this.get('element');

        if (element) {
            element.src = source;
            element.load();
        }
    }
});
