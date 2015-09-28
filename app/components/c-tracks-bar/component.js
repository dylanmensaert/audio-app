import Ember from 'ember';

export default Ember.Component.extend({
    cache: Ember.inject.service(),
    classNames: ['action-bar'],
    tracks: null,
    undownloadedTracks: function () {
        return this.get('tracks').filter(function (track) {
            return !track.get('isDownloaded') && !track.get('isDownloading');
        });
    }.property('tracks.@each.isDownloaded'),
    isEveryUndownloaded: function () {
        return this.get('undownloadedTracks.length') === this.get('tracks.length');
    }.property('undownloadedTracks.length', 'tracks.length'),
    downloadedTracks: function () {
        return this.get('tracks').filter(function (track) {
            return track.get('isDownloaded') || track.get('isDownloading');
        });
    }.property('tracks.@each.isDownloaded'),
    isEveryDownloaded: function () {
        return this.get('downloadedTracks.length') === this.get('tracks.length');
    }.property('downloadedTracks.length', 'tracks.length'),
    unQueuedTracks: function () {
        return this.get('tracks').filterBy('isQueued', false);
    }.property('tracks.@each.isQueued'),
    isEveryUnQueued: function () {
        return this.get('unQueuedTracks.length') === this.get('tracks.length');
    }.property('unQueuedTracks.length', 'tracks.length'),
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
        transitionToCollections: function () {
            this.set('cache.selectedSnippetIds', this.get('tracks').mapBy('id'));

            // TODO: implement transitionToCollections
            this.sendAction('transitionToCollections', 'track.collections');
        }
    }
});
