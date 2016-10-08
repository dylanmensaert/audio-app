import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    isPending: null,
    isEveryDownloadable: Ember.computed('models.@each.isDownloaded', 'models.length', function() {
        let downloadableTracks = this.get('models').filterBy('isDownloadable');

        return downloadableTracks.get('length') === this.get('models.length');
    }),
    isEveryDownloaded: Ember.computed('models.@each.isDownloaded', 'models.length', function() {
        let downloadedTracks = this.get('models').filter(function(track) {
            return track.get('isDownloaded');
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
            let queue = this.get('store').peekRecord('playlist', 'queue'),
                trackIds = queue.get('trackIds');

            this.get('models').forEach(function(track) {
                if (!trackIds.includes(track.get('id'))) {
                    this.queueSingle(trackIds, track);
                }
            });

            this.get('utils').showMessage('Added to queue');
        },
        transitionToPlaylists: function() {
            let utils = this.get('utils');

            utils.set('selectedTrackIds', this.get('models').mapBy('id'));

            utils.transitionToRoute('track.playlists');
        }
    }
});
