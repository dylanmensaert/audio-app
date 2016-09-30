import Ember from 'ember';
import connection from 'connection';

export default Ember.Mixin.create({
    utils: Ember.inject.service(),
    queueSingle: function(trackIds, track) {
        if (track.get('isDownloadable')) {
            track.download().then(function() {}, function() {
                // TODO: show error?
                this.get('utils').showMessage('Download aborted');
            }.bind(this));
        }

        trackIds.pushObject(track.get('id'));
    },
    actions: {
        downloadSingle: function(track) {
            var utils = this.get('utils'),
                trackIds,
                id;

            if (track.get('isDownloadable')) {
                if (!!connection.isMobile()) {
                    trackIds = this.get('store').peekRecord('collection', 'download-later').get('trackIds');
                    id = track.get('id');

                    if (!trackIds.contains(id)) {
                        trackIds.pushObject(id);
                    }

                    utils.showMessage('Added to collection: Download later');
                } else {
                    track.download().then(function() {

                    }, function() {
                        // TODO: show error?
                        utils.showMessage('download aborted');
                    });
                }
            } else {
                utils.showMessage('already downloaded');
            }
        },
        queueSingle: function(track) {
            var queue = this.get('store').peekRecord('collection', 'queue'),
                trackIds = queue.get('trackIds'),
                utils = this.get('utils');

            if (!trackIds.contains(track.get('id'))) {
                this.queueSingle(trackIds, track);

                utils.showMessage('Added to queue');
            } else {
                utils.showMessage('Already in queue');
            }

            queue.save();
        }
    }
});
