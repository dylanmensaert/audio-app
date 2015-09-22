import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    actions: {
        download: function () {
            this.get('selectedRecordings').forEach(function (recording) {
                if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                    recording.download();
                }
            });
        },
        pushToDownload: function (recording) {
            var cache = this.get('cache'),
                recordingIds,
                id;

            if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                if (!cache.isMobileConnection()) {
                    recording.download().then(function () {

                    }, function () {
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
        pushToQueue: function (recording) {
            var recordingIds = this.get('store').peekRecord('album', 'queue').get('recordingIds'),
                cache = this.get('cache'),
                id = recording.get('id');

            if (!recordingIds.contains(id)) {
                if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                    recording.download().then(function () {}, function () {
                        // TODO: show error?
                        cache.showMessage('Download aborted');
                    }.bind(this));
                }

                recordingIds.pushObject(id);

                cache.showMessage('Added to queue');
            } else {
                cache.showMessage('Already in queue');
            }
        }
    }
});
