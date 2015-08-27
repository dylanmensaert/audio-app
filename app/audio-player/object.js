import Ember from 'ember';

export default Ember.Object.extend({
    element: null,
    recording: null,
    currentTime: null,
    duration: null,
    buffered: null,
    status: null,
    didEnd: null,
    isLoading: function() {
        return this.get('status') === 'loading';
    }.property('status'),
    isPlaying: function() {
        return this.get('status') === 'playing';
    }.property('status'),
    isIdle: function() {
        return this.get('status') === 'idle';
    }.property('status'),
    setCurrentTime: function(currentTime) {
        this.get('element').currentTime = currentTime;
    },
    play: function(recording) {
        var element = this.get('element');

        if (Ember.isEmpty(recording)) {
            element.play();
        } else {
            this.load(recording).then(function() {
                element.play();
            });
        }
    },
    pause: function() {
        this.get('element').pause();
    },
    load: function(recording) {
        var audio = recording.get('audio');

        this.set('status', 'loading');
        this.set('recording', recording);

        return new Ember.RSVP.Promise(function(resolve) {
            if (Ember.isEmpty(audio)) {
                recording.fetchDownload().then(function(url) {
                    this.loadSource(url);

                    resolve();
                }.bind(this));
            } else {
                this.loadSource(audio);

                resolve();
            }
        }.bind(this));
    },
    loadSource: function(source) {
        var element = this.get('element');

        if (!Ember.isEmpty(element)) {
            element.src = source;
            element.load();
        }
    }
});
