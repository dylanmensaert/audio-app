/* global document: true */
import Ember from 'ember';
import routeMixin from 'audio-app/mixins/route';
import AudioSlider from 'audio-app/components/c-audio-slider/object';

var generateRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default Ember.Route.extend(routeMixin, {
    audioPlayer: Ember.inject.service(),
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    title: 'audio',
    beforeModel: function() {
        return this.get('fileSystem').forge();
    },
    previous: function() {
        var store = this.get('store'),
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
        var store = this.get('store'),
            queueTrackIds = store.peekRecord('collection', 'queue').get('trackIds'),
            trackId,
            nextTrack,
            unplayedTrackIds;

        unplayedTrackIds = queueTrackIds.filter(function(trackId) {
            return !this.get('cache.playedTrackIds').contains(trackId);
        }.bind(this));

        if (!unplayedTrackIds.get('length')) {
            this.set('cache.playedTrackIds', []);

            unplayedTrackIds.pushObjects(queueTrackIds);

            unplayedTrackIds.removeObject(this.get('audioPlayer.track.id'));
        }

        trackId = unplayedTrackIds.objectAt(generateRandom(0, unplayedTrackIds.get('length') - 1));

        nextTrack = store.peekRecord('track', trackId);

        this.play(nextTrack);
    },
    play: function(track) {
        var store = this.get('store'),
            fileSystem = this.get('fileSystem'),
            audioPlayer = this.get('audioPlayer'),
            historyTrackIds,
            queueTrackIds,
            playedTrackIds,
            id;

        if (track) {
            id = track.get('id');
            historyTrackIds = store.peekRecord('collection', 'history').get('trackIds');
            queueTrackIds = store.peekRecord('collection', 'queue').get('trackIds');
            playedTrackIds = this.get('cache.playedTrackIds');

            if (historyTrackIds.contains(id)) {
                historyTrackIds.removeObject(id);
            }

            if (historyTrackIds.get('length') === 50) {
                historyTrackIds.removeAt(0);
            }

            historyTrackIds.pushObject(id);

            if (!queueTrackIds.contains(id)) {
                if (!audioPlayer.get('track.id')) {
                    queueTrackIds.pushObject(id);
                } else {
                    queueTrackIds.insertAt(queueTrackIds.indexOf(audioPlayer.get('track.id')) + 1, id);
                }
            }

            if (!playedTrackIds.contains(id)) {
                playedTrackIds.pushObject(id);
            }

            fileSystem.set('playingTrackId', id);
        }

        if (track && fileSystem.get('setDownloadBeforePlaying') && !track.get('isDownloaded')) {
            track.download().then(function() {
                audioPlayer.play(track);
            });
        } else {
            audioPlayer.play(track);
        }
    },
    updateTitle: function(tokens) {
        this._super(tokens);

        tokens.reverse();
        document.title = tokens.join(' - ');
    },
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
        play: function(track) {
            this.play(track);
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
                playingTrack,
                audioSlider;

            playingTrack = this.get('store').peekRecord('track', this.get('fileSystem.playingTrackId'));

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

            cache.set('audioSlider', audioSlider);

            audioPlayer.set('didEnd', this.next.bind(this));
        },
        transitionToPrevious: function() {
            var completedTransitions = this.get('cache.completedTransitions'),
                lastIndex = completedTransitions.get('length') - 1,
                previousTransition = completedTransitions.objectAt(lastIndex - 1);

            completedTransitions.removeAt(lastIndex);
            completedTransitions.removeAt(lastIndex - 1);

            previousTransition.retry();
        },
        transitionTo: function() {
            this.transitionTo.apply(this, arguments);
        }
    }
});
