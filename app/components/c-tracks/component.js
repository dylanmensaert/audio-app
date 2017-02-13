import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    isPending: null,
    queueableTracks: Ember.computed('selectedModels.@each.isQueued', function() {
        return this.get('selectedModels').filterBy('isQueued', false);
    }),
    downloadableTracks: Ember.computed('selectedModels.@each.isDownloaded', function() {
        return this.get('selectedModels').filterBy('isDownloadable');
    }),
    downloadedTracks: Ember.computed('selectedModels.@each.isDownloaded', function() {
        return this.get('selectedModels').filterBy('isDownloaded');
    }),
    actions: {
        queue: function() {
            let queueableTracks = this.get('queueableTracks'),
                length = queueableTracks.get('length');

            if (length) {
                let queue = this.get('store').peekRecord('playlist', 'queue'),
                    trackIds = queue.get('trackIds');

                queueableTracks.forEach(function(track) {
                    trackIds.pushObject(track.get('id'));
                });

                this.get('utils').showMessage('Added to Queue');
            }
        },
        downloadLater: function() {
            let downloadableTracks = this.get('downloadableTracks'),
                length = downloadableTracks.get('length');

            if (length) {
                let downloadLater = this.get('store').peekRecord('playlist', 'download-later'),
                    trackIds = downloadLater.get('trackIds');

                downloadableTracks.forEach(function(track) {
                    trackIds.pushObject(track.get('id'));
                });

                this.get('utils').showMessage('Added to Download later');
            }
        },
        download: function() {
            let downloadableTracks = this.get('downloadableTracks'),
                length = downloadableTracks.get('length');

            if (length) {
                let downloadLater = this.get('store').peekRecord('playlist', 'download-later'),
                    trackIds = downloadLater.get('trackIds');

                downloadableTracks.forEach(function(track) {
                    track.download();

                    trackIds.removeObject(track.get('id'));
                });

                this.get('utils').showMessage('Downloading');
            }
        },
        delete: function() {
            let downloadedTracks = this.get('downloadedTracks'),
                length = downloadedTracks.get('length');

            if (length) {
                downloadedTracks.forEach(function(track) {
                    track.remove();
                });

                this.get('utils').showMessage('Removed locally');
            }
        },
        transitionToPlaylists: function() {
            let utils = this.get('utils');

            utils.set('selectedTrackIds', this.get('selectedModels').mapBy('id'));

            utils.transitionToRoute('subscribe');
        }
    }
});
