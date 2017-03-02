import Ember from 'ember';
import AudioSlider from 'audio-app/components/c-audio-slider/object';

export default Ember.Service.extend({
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
    playable: null,
    trackIds: Ember.computed('playable.tracks.@each.id', function() {
        let tracks = this.get('playable.tracks'),
            trackIds = [];

        if (tracks) {
            trackIds = tracks.mapBy('id');
        }

        return trackIds;
    }),
    type: null,
    isTrack: Ember.computed('type', function() {
        return this.get('type') === 'track';
    }),
    start: function(type, playable) {
        let tracks = playable.get('tracks'),
            track = tracks.get('firstObject');

        this.set('type', type);
        this.set('playable', playable);

        this.play(track);
    },
    play: function(track) {
        let audioPlayer = this.get('audioPlayer');

        if (track) {
            let trackIds = this.get('trackIds'),
                id = track.get('id');

            if (!trackIds.includes(id)) {
                this.start('track', track);
            } else {
                let store = this.get('store'),
                    fileSystem = this.get('fileSystem'),
                    history = store.peekRecord('playlist', 'history'),
                    historyTrackIds = history.get('trackIds'),
                    playing;

                if (historyTrackIds.includes(id)) {
                    historyTrackIds.removeObject(id);
                }

                history.unshiftTrack(track);

                history.save();

                if (fileSystem.get('downloadBeforePlaying') && !track.get('isDownloaded')) {
                    playing = track.download().then(function() {
                        return audioPlayer.play(track);
                    });
                } else {
                    playing = audioPlayer.play(track);
                }

                playing.catch(function() {
                    this.next();
                }.bind(this));
            }
        } else {
            audioPlayer.play();
        }
    },
    pause: function() {
        this.get('audioPlayer').pause();
    },
    previous: function() {
        let store = this.get('store'),
            trackIds = this.get('trackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            previousIndex = trackIds.indexOf(currentTrackId) - 1,
            trackId;

        if (previousIndex === -1) {
            previousIndex = trackIds.get('length') - 1;
        }

        trackId = trackIds.objectAt(previousIndex);
        this.play(store.peekRecord('track', trackId));
    },
    next: function() {
        let store = this.get('store'),
            trackIds = this.get('trackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            nextIndex = trackIds.indexOf(currentTrackId) + 1,
            trackId;

        if (nextIndex === trackIds.get('length')) {
            nextIndex = 0;
        }

        trackId = trackIds.objectAt(nextIndex);
        this.play(store.peekRecord('track', trackId));
    }
});
