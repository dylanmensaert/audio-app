import Ember from 'ember';
import musicControls from 'music-controls';
import media from 'media';

const errors = [
    'Fetching process aborted by user',
    'Error occurred when downloading',
    'Error occurred when decoding',
    'Audio not supported'
];

export default Ember.Service.extend({
    init: function() {
        this._super();

        media.audioPlayer = this;
    },
    // TODO: remove?
    /*element: null,*/
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
        media.setCurrentTime(currentTime);
        // TODO: remove? this.get('element').currentTime = currentTime;
    },
    play: function(track) {
        let promise;
        //element = this.get('element'),

        if (track) {
            promise = this.load(track).then(function() {
                //element.play();
                media.play();

                musicControls.load(track);
                musicControls.resume();
            });
        } else {
            // element.play();
            media.play();
            musicControls.resume();
        }

        return Ember.RSVP.resolve(promise);
    },
    pause: function() {
        // this.get('element').pause();
        media.pause();
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
                if (url) {
                    return this.loadSource(url);
                }
            }.bind(this));
        }

        return promise;
    },
    loadSource: function(source) {
        let promise = new Ember.RSVP.Promise(function(resolve, reject) {
            //let element = this.get('element');

            this.setProperties({
                resolve,
                reject
            });

            //element.src = source;
            //element.load();
            media.load(source);
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
