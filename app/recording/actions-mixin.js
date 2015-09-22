import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    pushToQueue: function(recordingIds, recording) {
        if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
            recording.download().then(function() {}, function() {
                // TODO: show error?
                this.get('cache').showMessage('Download aborted');
            }.bind(this));
        }

        recordingIds.pushObject(recording.get('id'));
    },
    actions: {
        download: function() {
            this.get('selectedRecordings').forEach(function(recording) {
                if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                    recording.download();
                }
            });
        },
        delete: function() {
            this.get('selectedRecordings').forEach(function(recording) {
                if (recording.get('isDownloaded')) {
                    recording.remove().then(function() {
                        recording.destroyRecord();
                    });
                }
            });
        },
        queue: function() {
            var queue = this.get('store').peekRecord('album', 'queue'),
                recordingIds = queue.get('recordingIds');

            this.get('selectedRecordings').forEach(function(recording) {
                if (!recordingIds.contains(recording.get('id'))) {
                    this.pushToQueue(recordingIds, recording);
                }
            });

            this.get('cache').showMessage('Added to queue');
        },
        pushToDownload: function(recording) {
            var cache = this.get('cache'),
                recordingIds,
                id;

            if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                if (!cache.isMobileConnection()) {
                    recording.download().then(function() {

                    }, function() {
                        // TODO: show error?
                        cache.showMessage('download aborted');
                    });
                } else {
                    recordingIds = this.get('store').peekRecord('album', 'download-later').get('recordingIds');
                    id = recording.get('id');

                    if (!recordingIds.contains(id)) {
                        recordingIds.pushObject(id);
                    }

                    cache.showMessage('Added to album: Download later');
                }
            } else {
                cache.showMessage('already downloaded');
            }
        },
        pushToQueue: function(recording) {
            var queue = this.get('store').peekRecord('album', 'queue'),
                recordingIds = queue.get('recordingIds'),
                cache = this.get('cache');

            if (!recordingIds.contains(recording.get('id'))) {
                this.pushToQueue(recordingIds, recording);

                cache.showMessage('Added to queue');
            } else {
                cache.showMessage('Already in queue');
            }

            queue.save();
        }
    }
});
