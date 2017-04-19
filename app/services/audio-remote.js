import Ember from 'ember';
import AudioSlider from 'audio-app/components/c-audio-slider/object';
import cordova from 'cordova';
import musicControls from 'music-controls';

export default Ember.Service.extend({
    init: function() {
        this._super();

        cordova.onDeviceReady.then(function() {
            musicControls.init(this, {
                'music-controls-previous': this.previous,
                'music-controls-next': this.next,
                'music-controls-pause': this.pause,
                'music-controls-resume': this.resume,
                'music-controls-destroy': this.pause
            });
        }.bind(this));
    },
    audioPlayer: Ember.inject.service(),
    fileSystem: Ember.inject.service(),
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    forge: function() {
        let audioPlayer = this.get('audioPlayer'),
            audioSlider;

        audioSlider = AudioSlider.create({
            onSlideStop: function(value) {
                audioPlayer.setCurrentTime(value);
            }
        });

        audioPlayer.addObserver('currentTime', audioPlayer, function() {
            audioSlider.setValue(this.get('currentTime'));
        });

        audioPlayer.addObserver('duration', audioPlayer, function() {
            audioSlider.set('max', this.get('duration'));
        });

        this.set('utils.audioSlider', audioSlider);

        audioPlayer.set('didEnd', this.next.bind(this));
    },
    model: null,
    playlist: Ember.computed('model', 'routeName', function() {
        let playlist;

        if (this.get('routeName') === 'playlist') {
            playlist = this.get('model');
        }

        return playlist;
    }),
    routeName: null,
    play: function(routeName, model, track, addToHistory) {
        this.set('routeName', routeName);
        this.set('model', model);

        if (!track) {
            let trackId = model.get('playableTrackIds.firstObject');

            track = this.get('store').peekRecord('track', trackId);
        }

        this.playTrack(track, addToHistory || model.get('id') !== 'history');
    },
    playTrack: function(track, addToHistory) {
        let audioPlayer = this.get('audioPlayer'),
            playing;

        if (addToHistory) {
            let history = this.get('store').peekRecord('playlist', 'history'),
                historyTrackIds = history.get('trackIds'),
                id = track.get('id');

            if (historyTrackIds.includes(id)) {
                historyTrackIds.removeObject(id);
            }

            history.pushTrack(track);
            history.save();
        }

        if (this.get('fileSystem.downloadBeforePlaying') && !track.get('isDownloaded')) {
            playing = track.download().then(function() {
                return audioPlayer.play(track);
            });
        } else {
            playing = audioPlayer.play(track);
        }

        playing.catch(function() {
            if (track.get('isDisabled')) {
                this.next();
            }
        }.bind(this));
    },
    resume: function() {
        this.get('audioPlayer').play();
    },
    pause: function() {
        this.get('audioPlayer').pause();
    },
    _switch: function(getOtherIndex) {
        let trackIds = this.get('model.playableTrackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            currentIndex = trackIds.indexOf(currentTrackId),
            otherIndex = getOtherIndex(currentIndex, trackIds.get('length')),
            trackId = trackIds.objectAt(otherIndex),
            track = this.get('store').peekRecord('track', trackId);

        this.playTrack(track, this.get('model.id') !== 'history');
    },
    previous: function() {
        this._switch(function(currentIndex, length) {
            let previousIndex = currentIndex - 1;

            if (previousIndex === -1) {
                previousIndex = length - 1;
            }

            return previousIndex;
        });
    },
    next: function() {
        this._switch(function(currentIndex, length) {
            let nextIndex = currentIndex + 1;

            if (nextIndex === length) {
                nextIndex = 0;
            }

            return nextIndex;
        });
    }
});
