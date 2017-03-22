import Ember from 'ember';
import cordova from 'cordova';
import musicControls from 'music-controls';

const errors = [
    'Fetching process aborted by user',
    'Error occurred when downloading',
    'Error occurred when decoding',
    'Audio not supported'
];

export default Ember.Service.extend({
    init: function() {
        this._super();

        cordova.onDeviceReady.then(function() {
            musicControls.init(this, {
                'music-controls-previous': this.previous,
                'music-controls-next': this.next,
                'music-controls-pause': this.pause,
                'music-controls-play': this.play,
                'music-controls-destroy': this.pause
            });
        }.bind(this));
    },
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

                musicControls.load(track);
                musicControls.play();
            });
        } else {
            element.play();
            musicControls.play();
        }

        return Ember.RSVP.resolve(promise);
    },
    pause: function() {
        this.get('element').pause();
        musicControls.pause();
    },
    load: function(track) {
        let audio = track.get('audio'),
            promise;

        this.setProperties({
            status: 'loading',
            track
        });

        if (audio) {
            promise = this.loadSource(audio);
        } else {
            promise = track.findAudioSource().then(function(url) {
                return this.loadSource(url);
            }.bind(this));
        }

        return promise;
    },
    loadSource: function(source) {
        let promise = new Ember.RSVP.Promise(function(resolve, reject) {
            let element = this.get('element');

            this.setProperties({
                resolve,
                reject
            });

            element.src = source;
            element.load();
        }.bind(this));

        promise.finally(function() {
            this.setProperties({
                resolve: null,
                reject: null
            });
        }.bind(this));

        return promise;
    },
    onError: function(event) {
        let reject = this.get('reject'),
            error = errors.indexOf(event.target.error.code - 1);

        this.set('status', 'idle');

        reject(error);
    }
});
