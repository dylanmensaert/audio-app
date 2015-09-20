import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    actions: {
        download: function() {
            // TODO: use cache.selectedSnippets instead? Not sure since also used to pass album to route at the moment.
            this.get('selectedRecordings').forEach(function(recording) {
                if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                    recording.download();
                }
            });
        },
        pushToDownload: function(recording) {
            var cache = this.get('cache');

            if (!recording.get('isDownloaded')) {
                if (!cache.isMobileConnection()) {
                    recording.download().then(function() {

                    }, function() {
                        // TODO: show error?
                        cache.showMessage('download aborted');
                    });
                } else {
                    this.get('fileSystem.albums').findBy('name', 'Download later').get('recordingIds').pushObject(recording.get('id'));
                }
            } else {
                cache.showMessage('already downloaded');
            }
        },
        pushToQueue: function(recording) {
            var queue = this.get('fileSystem.albums').findBy('name', 'Queue').get('recordingIds'),
                cache = this.get('cache');

            if (!queue.contains(recording.get('id'))) {
                if (!recording.get('isDownloaded')) {
                    recording.download().then(function() {}, function() {
                        // TODO: show error?
                        cache.showMessage('Download aborted');
                    }.bind(this));
                }

                this.get('fileSystem.queue').pushObject(recording.get('id'));

                cache.showMessage('Added to queue');
            } else {
                cache.showMessage('Already in queue');
            }
        }
    }
});
