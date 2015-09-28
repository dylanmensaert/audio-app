import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    pushToQueue: function (trackIds, track) {
        if (!track.get('isDownloaded') && !track.get('isDownloading')) {
            track.download().then(function () {}, function () {
                // TODO: show error?
                this.get('cache').showMessage('Download aborted');
            }.bind(this));
        }

        trackIds.pushObject(track.get('id'));
    },
    actions: {
        download: function () {
            this.get('selectedTracks').forEach(function (track) {
                if (!track.get('isDownloaded') && !track.get('isDownloading')) {
                    track.download();
                }
            });
        },
        delete: function () {
            this.get('selectedTracks').forEach(function (track) {
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

            this.get('selectedTracks').forEach(function (track) {
                if (!trackIds.contains(track.get('id'))) {
                    this.pushToQueue(trackIds, track);
                }
            });

            this.get('cache').showMessage('Added to queue');
        },
        pushToDownload: function (track) {
            var cache = this.get('cache'),
                trackIds,
                id;

            if (!track.get('isDownloaded') && !track.get('isDownloading')) {
                if (!cache.isMobileConnection()) {
                    track.download().then(function () {

                    }, function () {
                        // TODO: show error?
                        cache.showMessage('download aborted');
                    });
                } else {
                    trackIds = this.get('store').peekRecord('collection', 'download-later').get('trackIds');
                    id = track.get('id');

                    if (!trackIds.contains(id)) {
                        trackIds.pushObject(id);
                    }

                    cache.showMessage('Added to collection: Download later');
                }
            } else {
                cache.showMessage('already downloaded');
            }
        },
        pushToQueue: function (track) {
            var queue = this.get('store').peekRecord('collection', 'queue'),
                trackIds = queue.get('trackIds'),
                cache = this.get('cache');

            if (!trackIds.contains(track.get('id'))) {
                this.pushToQueue(trackIds, track);

                cache.showMessage('Added to queue');
            } else {
                cache.showMessage('Already in queue');
            }

            queue.save();
        }
    }
});
