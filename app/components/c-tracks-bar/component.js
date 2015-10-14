import Ember from 'ember';

export default Ember.Component.extend({
    cache: Ember.inject.service(),
    store: Ember.inject.service(),
    classNames: ['my-action-bar'],
    tracks: null,
    isEveryUndownloaded: function () {
        var undownloadedTracks = this.get('tracks').filter(function (track) {
            return !track.get('isDownloaded') && !track.get('isDownloading');
        });

        return undownloadedTracks.get('length') === this.get('tracks.length');
    }.property('tracks.@each.isDownloaded', 'tracks.length'),
    isEveryDownloaded: function () {
        var downloadedTracks = this.get('tracks').filter(function (track) {
            return track.get('isDownloaded') || track.get('isDownloading');
        });

        return downloadedTracks.get('length') === this.get('tracks.length');
    }.property('tracks.@each.isDownloaded', 'tracks.length'),
    isEveryUnQueued: function () {
        var unQueuedTracks = this.get('tracks').filterBy('isQueued', false);

        return unQueuedTracks.get('length') === this.get('tracks.length');
    }.property('tracks.@each.isQueued', 'tracks.length'),
    actions: {
        download: function () {
            this.get('tracks').forEach(function (track) {
                if (!track.get('isDownloaded') && !track.get('isDownloading')) {
                    track.download();
                }
            });
        },
        delete: function () {
            this.get('tracks').forEach(function (track) {
                track.remove().then(function () {
                    track.destroyRecord().then(function () {
                        track.set('isSelected', false);
                    });
                });
            });
        },
        queue: function () {
            var queue = this.get('store').peekRecord('collection', 'queue'),
                trackIds = queue.get('trackIds');

            this.get('tracks').forEach(function (track) {
                if (!trackIds.contains(track.get('id'))) {
                    this.pushToQueue(trackIds, track);
                }
            });

            this.get('cache').showMessage('Added to queue');
        },
        transitionToCollections: function () {
            this.set('cache.selectedTrackIds', this.get('tracks').mapBy('id'));

            // TODO: implement transitionToCollections
            this.sendAction('transitionToCollections', 'track.collections');
        }
    }
});
