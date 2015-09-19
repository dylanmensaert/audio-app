import Ember from 'ember';

export default Ember.Component.extend({
    recordings: null,
    isEditMode: null,
    isEveryOffline: function () {
        return this.get('recordings').isEvery('isOffline');
    }.property('recordings.@each.isOffline'),
    isEveryUndownloaded: function () {
        return !this.get('recordings').isAny(function (recording) {
            return recording.get('isDownloaded') || recording.get('isDownloading');
        });
    }.property('recordings.@each.isDownloaded', 'recordings.@each.isDownloading'),
    offlineRecordings: function () {
        return this.get('recordings').filterBy('isOffline');
    }.property('recordings.@each.isOffline'),
    undownloadedRecordings: function () {
        return this.get('recordings').filter(function (recording) {
            return !recording.get('isDownloaded') && !recording.get('isDownloading');
        });
    }.property('recordings.@each.isDownloaded'),
    hasSingle: function () {
        return this.get('recordings.length') === 1;
    }.property('recordings.length'),
    actions: {
        download: function () {
            this.sendAction('download');
        },
        remove: function () {
            this.sendAction('remove');
        },
        setupEdit: function () {
            this.sendAction('setupEdit');
        },
        exitEdit: function () {
            this.sendAction('exitEdit');
        }
    }
});
