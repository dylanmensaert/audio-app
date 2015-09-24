import Ember from 'ember';

export default Ember.Component.extend({
    cache: Ember.inject.service(),
    classNames: ['action-bar'],
    recordings: null,
    undownloadedRecordings: function () {
        return this.get('recordings').filter(function (recording) {
            return !recording.get('isDownloaded') && !recording.get('isDownloading');
        });
    }.property('recordings.@each.isDownloaded'),
    isEveryUndownloaded: function () {
        return this.get('undownloadedRecordings.length') === this.get('recordings.length');
    }.property('undownloadedRecordings.length', 'recordings.length'),
    downloadedRecordings: function () {
        return this.get('recordings').filter(function (recording) {
            return recording.get('isDownloaded') || recording.get('isDownloading');
        });
    }.property('recordings.@each.isDownloaded'),
    isEveryDownloaded: function () {
        return this.get('downloadedRecordings.length') === this.get('recordings.length');
    }.property('downloadedRecordings.length', 'recordings.length'),
    unQueuedRecordings: function () {
        return this.get('recordings').filterBy('isQueued', false);
    }.property('recordings.@each.isQueued'),
    isEveryUnQueued: function () {
        return this.get('unQueuedRecordings.length') === this.get('recordings.length');
    }.property('unQueuedRecordings.length', 'recordings.length'),
    actions: {
        download: function () {
            this.sendAction('download');
        },
        delete: function () {
            this.sendAction('delete');
        },
        queue: function () {
            this.sendAction('queue');
        },
        transitionToAlbums: function () {
            this.set('cache.selectedSnippetIds', this.get('recordings').mapBy('id'));

            // TODO: implement transitionToAlbums
            this.sendAction('transitionToAlbums', 'recordings.albums');
        }
    }
});
