import Ember from 'ember';

export default Ember.Component.extend({
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    classNames: ['my-action-bar'],
    tracks: null,
    isEveryDownloadable: Ember.computed('tracks.@each.isDownloaded', 'tracks.length', function() {
        var downloadableTracks = this.get('tracks').filterBy('isDownloadable');

        return downloadableTracks.get('length') === this.get('tracks.length');
    }),
    isEveryDownloaded: Ember.computed('tracks.@each.isDownloaded', 'tracks.length', function() {
        var downloadedTracks = this.get('tracks').filter(function(track) {
            return track.get('isDownloaded') || track.get('isDownloading');
        });

        return downloadedTracks.get('length') === this.get('tracks.length');
    }),
    isEveryUnQueued: Ember.computed('tracks.@each.isQueued', 'tracks.length', function() {
        var unQueuedTracks = this.get('tracks').filterBy('isQueued', false);

        return unQueuedTracks.get('length') === this.get('tracks.length');
    }),
    actions: {
        download: function() {
            this.get('tracks').forEach(function(track) {
                if (track.get('isDownloadable')) {
                    track.download();
                }
            });
        },
        delete: function() {
            this.get('tracks').forEach(function(track) {
                track.remove().then(function() {
                    track.destroyRecord().then(function() {
                        track.set('isSelected', false);
                    });
                });
            });
        },
        queue: function() {
            var queue = this.get('store').peekRecord('collection', 'queue'),
                trackIds = queue.get('trackIds');

            this.get('tracks').forEach(function(track) {
                if (!trackIds.contains(track.get('id'))) {
                    this.queueSingle(trackIds, track);
                }
            });

            this.get('utils').showMessage('Added to queue');
        },
        transitionToCollections: function() {
            this.set('utils.selectedTrackIds', this.get('tracks').mapBy('id'));

            this.sendAction('transitionToCollections', 'track.collections');
        },
        deselect: function() {
            this.sendAction('deselect');
        }
    }
});
