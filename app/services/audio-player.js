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
    isLoading: function () {
        return this.get('status') === 'loading';
    }.property('status'),
    isPlaying: function () {
        return this.get('status') === 'playing';
    }.property('status'),
    isIdle: function () {
        return this.get('status') === 'idle';
    }.property('status'),
    setCurrentTime: function (currentTime) {
        this.get('element').currentTime = currentTime;
    },
    play: function (track) {
        var element = this.get('element');

        if (!track) {
            element.play();
        } else {
            this.load(track).then(function () {
                element.play();
            });
        }
    },
    pause: function () {
        this.get('element').pause();
    },
    load: function (track) {
        var audio = track.get('audio');

        this.set('status', 'loading');
        this.set('track', track);

        return new Ember.RSVP.Promise(function (resolve) {
            if (!audio) {
                track.fetchDownload().then(function (url) {
                    this.loadSource(url);

                    resolve();
                }.bind(this));
            } else {
                this.loadSource(audio);

                resolve();
            }
        }.bind(this));
    },
    loadSource: function (source) {
        var element = this.get('element');

        if (element) {
            element.src = source;
            element.load();
        }
    }
});
