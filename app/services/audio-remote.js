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
    // TODO: current model not stored in history so back tracking not sufficient
    playlist: Ember.computed('model', 'routeName', function() {
        let playlist;

        if (this.get('routeName') === 'playlist') {
            playlist = this.get('model');
        }

        return playlist;
    }),
    trackIds: Ember.computed('model.playableTracks.@each.id', function() {
        let tracks = this.get('model.playableTracks'),
            trackIds = [];

        if (tracks) {
            trackIds = tracks.mapBy('id');
        }

        return trackIds;
    }),
    routeName: null,
    play: function(routeName, model, track) {
        this.set('routeName', routeName);
        this.set('model', model);

        if (!track) {
            track = model.get('playableTracks.firstObject');
        }

        this.playTrack(track, model.get('id') !== 'history');
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

            history.unshiftTrack(track);
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
            if (this.get('model.playableTracks').isAny('isDisabled', false)) {
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
    previous: function() {
        let store = this.get('store'),
            history = store.peekRecord('playlist', 'history'),
            trackIds = history.get('trackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            previousIndex = trackIds.indexOf(currentTrackId) + 1;

        if (previousIndex !== trackIds.get('length') - 1) {
            let trackId = trackIds.objectAt(previousIndex),
                track = store.peekRecord('track', trackId);

            this.playTrack(track, false);
        } else {
            this.get('utils').showMessage('No previous tracks');
        }
    },
    next: function() {
        let store = this.get('store'),
            currentTrackId = this.get('audioPlayer.track.id'),
            trackIds = this.get('trackIds');

        if (trackIds.get('firstObject') !== currentTrackId) {
            let history = store.peekRecord('playlist', 'history'),
                currentIndex = history.get('trackIds').indexOf(currentTrackId),
                trackId = history.get('trackIds').objectAt(currentIndex - 1),
                track = store.peekRecord('track', trackId);

            this.play('playlist', history, track);
        } else {
            let currentIndex = trackIds.indexOf(currentTrackId),
                nextIndex = currentIndex + 1,
                trackId,
                track;

            if (nextIndex === trackIds.get('length')) {
                nextIndex = 0;
            }

            trackId = trackIds.objectAt(nextIndex);
            track = store.peekRecord('track', trackId);

            this.playTrack(track, true);
        }
    }
});
