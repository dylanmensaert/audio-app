import Ember from 'ember';
import AudioSlider from 'audio-app/components/c-audio-slider/object';

function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Ember.Service.extend({
    audioPlayer: Ember.inject.service(),
    fileSystem: Ember.inject.service(),
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    connect: function() {
        let audioPlayer = this.get('audioPlayer'),
            utils = this.get('utils'),
            store = this.get('store'),
            playingTrack,
            audioSlider;

        playingTrack = store.peekRecord('track', this.get('fileSystem.playingTrackId'));

        if (playingTrack) {
            audioPlayer.load(playingTrack);
        }

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

        utils.set('audioSlider', audioSlider);

        audioPlayer.set('didEnd', this.next.bind(this));
    },
    play: function(track) {
        let store = this.get('store'),
            fileSystem = this.get('fileSystem'),
            audioPlayer = this.get('audioPlayer'),
            history,
            historyTrackIds,
            queue,
            queueTrackIds,
            playedTrackIds,
            id;

        if (track) {
            id = track.get('id');
            history = store.peekRecord('collection', 'history');
            historyTrackIds = history.get('trackIds');
            queue = store.peekRecord('collection', 'queue');
            queueTrackIds = queue.get('trackIds');
            playedTrackIds = this.get('utils.playedTrackIds');

            if (historyTrackIds.includes(id)) {
                historyTrackIds.removeObject(id);
            }

            historyTrackIds.pushObject(id);

            history.save();

            if (!queueTrackIds.includes(id)) {
                if (audioPlayer.get('track.id')) {
                    queueTrackIds.insertAt(queueTrackIds.indexOf(audioPlayer.get('track.id')) + 1, id);
                } else {
                    queueTrackIds.pushObject(id);
                }

                queue.save();
            }

            if (!playedTrackIds.includes(id)) {
                playedTrackIds.pushObject(id);
            }

            fileSystem.set('playingTrackId', id);

            fileSystem.save();
        }

        if (track) {
            track.save();
        }

        if (track && fileSystem.get('downloadBeforePlaying') && !track.get('isDownloaded')) {
            track.download().then(function() {
                audioPlayer.play(track);
            });
        } else {
            audioPlayer.play(track);
        }
    },
    pause: function() {
        this.get('audioPlayer').pause();
    },
    previous: function() {
        let store = this.get('store'),
            queueTrackIds,
            currentIndex,
            previousIndex,
            trackId,
            previousTrack;

        queueTrackIds = store.peekRecord('collection', 'queue').get('trackIds');
        currentIndex = queueTrackIds.indexOf(this.get('audioPlayer.track.id'));

        if (currentIndex > 0) {
            previousIndex = currentIndex - 1;
        } else {
            previousIndex = queueTrackIds.get('length');
        }

        trackId = queueTrackIds.objectAt(previousIndex);
        previousTrack = store.peekRecord('track', trackId);

        this.play(previousTrack);
    },
    next: function() {
        let store = this.get('store'),
            queueTrackIds = store.peekRecord('collection', 'queue').get('trackIds'),
            trackId,
            nextTrack,
            unplayedTrackIds;

        unplayedTrackIds = queueTrackIds.filter(function(trackId) {
            return !this.get('utils.playedTrackIds').includes(trackId);
        }.bind(this));

        if (!unplayedTrackIds.get('length')) {
            this.set('utils.playedTrackIds', []);

            unplayedTrackIds.pushObjects(queueTrackIds);

            unplayedTrackIds.removeObject(this.get('audioPlayer.track.id'));
        }

        trackId = unplayedTrackIds.objectAt(generateRandom(0, unplayedTrackIds.get('length') - 1));

        nextTrack = store.peekRecord('track', trackId);

        this.play(nextTrack);
    }
});
