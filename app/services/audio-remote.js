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
    play: function(track) {
        let audioPlayer = this.get('audioPlayer');

        if (track) {
            let store = this.get('store'),
                fileSystem = this.get('fileSystem'),
                id = track.get('id'),
                history = store.peekRecord('playlist', 'history'),
                historyTrackIds = history.get('trackIds'),
                queue = store.peekRecord('playlist', 'queue'),
                queueTrackIds = queue.get('trackIds'),
                playing;

            if (historyTrackIds.includes(id)) {
                historyTrackIds.removeObject(id);
            }

            historyTrackIds.unshiftObject(id);

            history.save();

            if (!queueTrackIds.includes(id)) {
                if (audioPlayer.get('track.id')) {
                    queueTrackIds.insertAt(queueTrackIds.indexOf(audioPlayer.get('track.id')) + 1, id);
                } else {
                    queueTrackIds.pushObject(id);
                }

                queue.save();
            }

            fileSystem.save();

            track.save();

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
        } else {
            audioPlayer.play();
        }
    },
    pause: function() {
        this.get('audioPlayer').pause();
    },
    previous: function() {
        let store = this.get('store'),
            queueTrackIds = store.peekRecord('playlist', 'queue').get('trackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            previousIndex = queueTrackIds.indexOf(currentTrackId) - 1,
            trackId;

        if (previousIndex === -1) {
            previousIndex = queueTrackIds.get('length') - 1;
        }

        trackId = queueTrackIds.objectAt(previousIndex);
        this.play(store.peekRecord('track', trackId));
    },
    next: function() {
        let store = this.get('store'),
            queueTrackIds = store.peekRecord('playlist', 'queue').get('trackIds'),
            currentTrackId = this.get('audioPlayer.track.id'),
            nextIndex = queueTrackIds.indexOf(currentTrackId) + 1,
            trackId;

        if (nextIndex === queueTrackIds.get('length')) {
            nextIndex = 0;
        }

        trackId = queueTrackIds.objectAt(nextIndex);
        this.play(store.peekRecord('track', trackId));
    }
});
