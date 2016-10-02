import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    isEveryDownloadable: Ember.computed('models.@each.isDownloaded', 'models.length', function() {
        let downloadableTracks = this.get('models').filterBy('isDownloadable');

        return downloadableTracks.get('length') === this.get('models.length');
    }),
    isEveryDownloaded: Ember.computed('models.@each.isDownloaded', 'models.length', function() {
        let downloadedTracks = this.get('models').filter(function(track) {
            return track.get('isDownloaded') || track.get('isDownloading');
        });

        return downloadedTracks.get('length') === this.get('models.length');
    }),
    isEveryUnQueued: Ember.computed('models.@each.isQueued', 'models.length', function() {
        let unQueuedTracks = this.get('models').filterBy('isQueued', false);

        return unQueuedTracks.get('length') === this.get('models.length');
    }),
    actions: {
        download: function() {
            this.get('models').forEach(function(track) {
                if (track.get('isDownloadable')) {
                    track.download();
                }
            });
        },
        delete: function() {
            this.get('models').forEach(function(track) {
                track.remove().then(function() {
                    track.destroyRecord().then(function() {
                        track.set('isSelected', false);
                    });
                });
            });
        },
        queue: function() {
            let queue = this.get('store').peekRecord('collection', 'queue'),
                trackIds = queue.get('trackIds');

            this.get('models').forEach(function(track) {
                if (!trackIds.contains(track.get('id'))) {
                    this.queueSingle(trackIds, track);
                }
            });

            this.get('utils').showMessage('Added to queue');
        },
        transitionToCollections: function() {
            let utils = this.get('utils');

            utils.set('selectedTrackIds', this.get('models').mapBy('id'));

            utils.transitionToRoute('track.collections');
        }
    }
});
