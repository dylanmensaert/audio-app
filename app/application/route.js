/* global document: true */
import Ember from 'ember';
import AudioSlider from 'audio-app/components/c-audio-slider/object';
import routeMixin from 'audio-app/mixins/route';

var generateRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default Ember.Route.extend(routeMixin, {
    audioPlayer: Ember.inject.service(),
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    title: 'audio',
    beforeModel: function () {
        return this.get('fileSystem').forge();
    },
    previous: function () {
        var queue,
            currentIndex,
            previousIndex,
            trackId,
            previousTrack;

        queue = this.get('fileSystem.collections').findBy('name', 'Queue').get('trackIds');
        currentIndex = queue.indexOf(this.get('audioPlayer.track.id'));

        if (currentIndex > 0) {
            previousIndex = currentIndex - 1;
        } else {
            previousIndex = queue.get('length');
        }

        trackId = queue.objectAt(previousIndex);
        previousTrack = this.get('fileSystem.tracks').findBy('id', trackId);

        this.play(previousTrack);
    },
    next: function () {
        var queue = this.get('fileSystem.collections').findBy('name', 'Queue').get('trackIds'),
            trackId,
            nextTrack,
            unplayedTrackIds;

        unplayedTrackIds = queue.filter(function (trackId) {
            return !this.get('cache.playedTrackIds').contains(trackId);
        }.bind(this));

        if (!unplayedTrackIds.get('length')) {
            this.set('cache.playedTrackIds', []);

            unplayedTrackIds.pushObjects(queue);

            unplayedTrackIds.removeObject(this.get('audioPlayer.track.id'));
        }

        trackId = unplayedTrackIds.objectAt(generateRandom(0, unplayedTrackIds.get('length') - 1));

        nextTrack = this.get('fileSystem.tracks').findBy('id', trackId);

        this.play(nextTrack);
    },
    play: function (track) {
        var fileSystem = this.get('fileSystem'),
            offlineTracks = fileSystem.get('tracks'),
            audioPlayer = this.get('audioPlayer'),
            history,
            queue,
            playedTrackIds,
            id;

        if (!Ember.isEmpty(track)) {
            id = track.get('id');
            history = fileSystem.get('collections').findBy('name', 'History').get('trackIds');
            queue = fileSystem.get('collections').findBy('name', 'Queue').get('trackIds');
            playedTrackIds = this.get('cache.playedTrackIds');

            if (!offlineTracks.isAny('id', id)) {
                offlineTracks.pushObject(track);
            }

            if (history.contains(id)) {
                history.removeObject(id);
            }

            if (history.get('length') === 50) {
                history.removeAt(0);
            }

            history.pushObject(id);

            if (!queue.contains(id)) {
                if (Ember.isEmpty(audioPlayer.get('track.id'))) {
                    queue.pushObject(id);
                } else {
                    queue.insertAt(queue.indexOf(audioPlayer.get('track.id')) + 1, id);
                }
            }

            if (!playedTrackIds.contains(id)) {
                playedTrackIds.pushObject(id);
            }

            fileSystem.set('playingTrackId', id);
        }

        if (!Ember.isEmpty(track) && fileSystem.get('setDownloadBeforePlaying') && !track.get('isDownloaded')) {
            track.download().then(function () {
                audioPlayer.play(track);
            });
        } else {
            audioPlayer.play(track);
        }
    },
    downloadTracks: function () {
        var fileSystem = this.get('fileSystem'),
            cache = this.get('cache'),
            tracks;

        if (fileSystem.get('setDownloadLaterOnMobile') && !cache.get('isMobileConnection')) {
            tracks = fileSystem.get('tracks').filterBy('isDownloadLater');

            if (tracks.get('length')) {
                // TODO: Better message?
                cache.showMessage('Downloading download-later');

                // TODO: Handle multiple 'observe' calls before download finishes
                tracks.forEach(function (track) {
                    track.download();
                });
            }
        }
    }.observes('fileSystem.setDownloadLaterOnMobile', 'cache.isMobileConnection', 'tracks.@each.isDownloadLater'),
    actions: {
        loading: function () {
            if (this.get('controller')) {
                this.set('controller.isLoading', true);

                this.router.one('didTransition', function () {
                    this.set('controller.isLoading', false);
                }.bind(this));
            }
        },
        error: function (error) {
            if (this.get('controller')) {
                this.set('controller.error', error);
            }
        },
        updateTitle: function (tokens) {
            this._super(tokens);

            tokens.reverse();
            document.title = tokens.join(' - ');
        },
        play: function (track) {
            this.play(track);
        },
        pause: function () {
            this.get('audioPlayer').pause();
        },
        previous: function () {
            this.previous();
        },
        next: function () {
            this.next();
        },
        didTransition: function () {
            var audioPlayer = this.get('audioPlayer'),
                cache = this.get('cache'),
                playingTrack,
                audioSlider;

            playingTrack = this.get('store').peekRecord('track', this.get('fileSystem.playingTrackId'));

            if (!Ember.isEmpty(playingTrack)) {
                audioPlayer.load(playingTrack);
            }

            audioSlider = AudioSlider.create({
                onSlideStop: function (value) {
                    audioPlayer.setCurrentTime(value);
                }
            });

            audioPlayer.addObserver('currentTime', audioPlayer, function () {
                audioSlider.setValue(this.get('currentTime'));
            });

            audioPlayer.addObserver('duration', audioPlayer, function () {
                audioSlider.set('max', this.get('duration'));
            });

            cache.set('audioSlider', audioSlider);

            audioPlayer.set('didEnd', this.next.bind(this));
        },
        transitionToPrevious: function () {
            var completedTransitions = this.get('cache.completedTransitions'),
                lastIndex = completedTransitions.get('length') - 1,
                previousTransition = completedTransitions.objectAt(lastIndex - 1);

            completedTransitions.removeAt(lastIndex);
            completedTransitions.removeAt(lastIndex - 1);

            previousTransition.retry();
        },
        transitionTo: function () {
            this.transitionTo.apply(this, arguments);
        }
    }
});
