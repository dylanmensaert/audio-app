/* global document: true */
import Ember from 'ember';
import AudioSlider from 'audio-app/components/c-audio-slider/object';
import routeMixin from 'audio-app/mixins/route';

var generateRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default Ember.Route.extend(routeMixin, {
    audioPlayer: Ember.inject.service(),
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    title: 'audio',
    previous: function() {
        var queue,
            currentIndex,
            previousIndex,
            recordingId,
            previousRecording;

        queue = this.get('fileSystem.albums').findBy('name', 'Queue').get('recordingIds');
        currentIndex = queue.indexOf(this.get('audioPlayer.recording.id'));

        if (currentIndex > 0) {
            previousIndex = currentIndex - 1;
        } else {
            previousIndex = queue.get('length');
        }

        recordingId = queue.objectAt(previousIndex);
        previousRecording = this.get('fileSystem.recordings').findBy('id', recordingId);

        this.play(previousRecording);
    },
    next: function() {
        var queue = this.get('fileSystem.albums').findBy('name', 'Queue').get('recordingIds'),
            recordingId,
            nextRecording,
            unplayedRecordingIds;

        unplayedRecordingIds = queue.filter(function(recordingId) {
            return !this.get('cache.playedRecordingIds').contains(recordingId);
        }.bind(this));

        if (!unplayedRecordingIds.get('length')) {
            this.set('cache.playedRecordingIds', []);

            unplayedRecordingIds.pushObjects(queue);

            unplayedRecordingIds.removeObject(this.get('audioPlayer.recording.id'));
        }

        recordingId = unplayedRecordingIds.objectAt(generateRandom(0, unplayedRecordingIds.get('length') - 1));

        nextRecording = this.get('fileSystem.recordings').findBy('id', recordingId);

        this.play(nextRecording);
    },
    play: function(recording) {
        var fileSystem = this.get('fileSystem'),
            offlineRecordings = fileSystem.get('recordings'),
            audioPlayer = this.get('audioPlayer'),
            history,
            queue,
            playedRecordingIds,
            id;

        if (!Ember.isEmpty(recording)) {
            id = recording.get('id');
            history = fileSystem.get('albums').findBy('name', 'History').get('recordingIds');
            queue = fileSystem.get('albums').findBy('name', 'Queue').get('recordingIds');
            playedRecordingIds = this.get('cache.playedRecordingIds');

            if (!offlineRecordings.isAny('id', id)) {
                offlineRecordings.pushObject(recording);
            }

            if (history.contains(id)) {
                history.removeObject(id);
            }

            if (history.get('length') === 50) {
                history.removeAt(0);
            }

            history.pushObject(id);

            if (!queue.contains(id)) {
                if (Ember.isEmpty(audioPlayer.get('recording.id'))) {
                    queue.pushObject(id);
                } else {
                    queue.insertAt(queue.indexOf(audioPlayer.get('recording.id')) + 1, id);
                }
            }

            if (!playedRecordingIds.contains(id)) {
                playedRecordingIds.pushObject(id);
            }

            fileSystem.set('playingRecordingId', id);
        }

        if (!Ember.isEmpty(recording) && fileSystem.get('setDownloadBeforePlaying') && !recording.get('isDownloaded')) {
            recording.download().then(function() {
                audioPlayer.play(recording);
            });
        } else {
            audioPlayer.play(recording);
        }
    },
    downloadRecordings: function() {
        var fileSystem = this.get('fileSystem'),
            cache = this.get('cache'),
            recordings;

        if (fileSystem.get('setDownloadLaterOnMobile') && !cache.get('isMobileConnection')) {
            recordings = fileSystem.get('recordings').filterBy('isDownloadLater');

            if (recordings.get('length')) {
                // TODO: Better message?
                cache.showMessage('Downloading download-later');

                // TODO: Handle multiple 'observe' calls before download finishes
                recordings.forEach(function(recording) {
                    recording.download();
                });
            }
        }
    }.observes('fileSystem.setDownloadLaterOnMobile', 'cache.isMobileConnection', 'recordings.@each.isDownloadLater'),
    actions: {
        loading: function() {
            if (this.get('controller')) {
                this.set('controller.isLoading', true);

                this.router.one('didTransition', function() {
                    this.set('controller.isLoading', false);
                }.bind(this));
            }
        },
        error: function(error) {
            if (this.get('controller')) {
                this.set('controller.error', error);
            }
        },
        updateTitle: function(tokens) {
            this._super(tokens);

            tokens.reverse();
            document.title = tokens.join(' - ');
        },
        play: function(recording) {
            this.play(recording);
        },
        pause: function() {
            this.get('audioPlayer').pause();
        },
        previous: function() {
            this.previous();
        },
        next: function() {
            this.next();
        },
        didTransition: function() {
            var audioPlayer = this.get('audioPlayer'),
                cache = this.get('cache'),
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

            cache.set('audioSlider', audioSlider);
            // TODO: implement fileSystem via inject?
            cache.set('fileSystem', this.get('fileSystem'));

            cache.set('transitionToRoute', this.transitionTo.bind(this));

            audioPlayer.set('didEnd', this.next.bind(this));

            this.set('fileSystem.didParseJSON', function() {
                var recording = this.get('recordings').findBy('id', this.get('playingRecordingId'));

                if (!Ember.isEmpty(recording)) {
                    audioPlayer.load(recording);
                }
            });
        },
        transitionToQueue: function() {
            this.get('fileSystem.recordings').setEach('isSelected', false);

            this.transitionToRoute('queue.index');
        },
        transitionToPrevious: function() {
            var completedTransitions = this.get('cache.completedTransitions'),
                lastIndex = completedTransitions.get('length') - 1,
                previousTransition = completedTransitions.objectAt(lastIndex - 1);

            completedTransitions.removeAt(lastIndex);
            completedTransitions.removeAt(lastIndex - 1);

            previousTransition.retry();
        }
    }
});
