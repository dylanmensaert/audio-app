import Ember from 'ember';

export default Ember.Component.extend({
    cache: Ember.inject.service(),
    store: Ember.inject.service(),
    classNames: ['my-action-bar'],
    tracks: null,
    undownloadedTracks: function () {
        return this.get('tracks').filter(function (track) {
            return !track.get('isDownloaded') && !track.get('isDownloading');
        });
    }.property('tracks.@each.isDownloaded'),
    isEveryUndownloaded: function () {
        return this.get('undownloadedTracks.length') === this.get('tracks.length');
    }.property('undownloadedTracks.length', 'tracks.length'),
    downloadedTracks: function () {
        return this.get('tracks').filter(function (track) {
            return track.get('isDownloaded') || track.get('isDownloading');
        });
    }.property('tracks.@each.isDownloaded'),
    isEveryDownloaded: function () {
        return this.get('downloadedTracks.length') === this.get('tracks.length');
    }.property('downloadedTracks.length', 'tracks.length'),
    unQueuedTracks: function () {
        return this.get('tracks').filterBy('isQueued', false);
    }.property('tracks.@each.isQueued'),
    isEveryUnQueued: function () {
        return this.get('unQueuedTracks.length') === this.get('tracks.length');
    }.property('unQueuedTracks.length', 'tracks.length'),
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
                if (track.get('isDownloaded')) {
                    track.remove().then(function () {
                        track.destroyRecord();
                    });
                }
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
