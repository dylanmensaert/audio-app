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
                'music-controls-play': this.play,
                'music-controls-destroy': this.pause
            });
        }.bind(this));
    },
    audioPlayer: Ember.inject.service(),
    fileSystem: Ember.inject.service(),
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    connect: function() {
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
    title: Ember.computed('model.name', 'type', function() {
        let type = this.get('type'),
            title;

        if (type === 'playlist') {
            title = 'Playlist';
        } else if (type === 'track.related') {
            title = 'Related';
        }

        title += ': ' + this.get('model.name');

        return title;
    }),
    trackIds: Ember.computed('model.playableTracks.@each.id', function() {
        let tracks = this.get('model.playableTracks'),
            trackIds = [];

        if (tracks) {
            trackIds = tracks.mapBy('id');
        }

        return trackIds;
    }),
    type: null,
    play: function(type, model, track) {
        this.set('type', type);
        this.set('model', model);

        if (!track) {
            track = model.get('playableTracks.firstObject');
        }

        this.playTrack(track, model.get('id') !== 'history');
    },
    playTrackById: function(trackId, addToHistory) {
        let track = this.get('store').peekRecord('track', trackId);

        this.playTrack(track, addToHistory);
    },
    playTrack: function(track, addToHistory) {
        let audioPlayer = this.get('audioPlayer'),
            id = track.get('id'),
            playing;

        if (addToHistory) {
            let history = this.get('store').peekRecord('playlist', 'history'),
                historyTrackIds = history.get('trackIds');

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
        let history = this.get('store').peekRecord('playlist', 'history'),
            trackIds = history.get('trackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            previousIndex = trackIds.indexOf(currentTrackId) + 1;

        if (previousIndex !== trackIds.get('length') - 1) {
            let trackId = trackIds.objectAt(previousIndex);

            this.playTrackById(trackId, false);
        } else {
            this.get('utils').showMessage('No previous tracks');
        }
    },
    next: function() {
        let history = this.get('store').peekRecord('playlist', 'history'),
            currentTrackId = this.get('audioPlayer.track.id'),
            trackIds,
            currentIndex,
            trackId;

        if (history.get('firstObject.id') !== currentTrackId) {
            trackIds = history.get('trackIds');

            currentIndex = trackIds.indexOf(currentTrackId);
            trackId = trackIds.objectAt(currentIndex - 1);
        } else {
            let nextIndex;

            trackIds = this.get('trackIds');
            currentIndex = trackIds.indexOf(currentTrackId);
            nextIndex = currentIndex + 1;

            if (nextIndex === trackIds.get('length')) {
                nextIndex = 0;
            }

            trackId = trackIds.objectAt(nextIndex);
        }

        this.playTrackById(trackId, true);
    }
});
