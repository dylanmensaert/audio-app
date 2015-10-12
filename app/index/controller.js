import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';

const shownLimit = 8;

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    showNotFound: function() {
        return !this.get('tracks.isPending') && !this.get('tracks.length') && !this.get('lastHistoryTracks.length');
    }.property('tracks.isPending', 'tracks.length', 'lastHistoryTracks.length'),
    lastHistoryTracks: function() {
        var store = this.get('store'),
            historyTrackIds = store.peekRecord('collection', 'history').get('trackIds'),
            length = historyTrackIds.get('length'),
            lastHistoryTracks = [];

        historyTrackIds.forEach(function(trackId, index) {
            if (length <= shownLimit || length - shownLimit >= index) {
                lastHistoryTracks.pushObject(store.peekRecord('track', trackId));
            }
        });

        return lastHistoryTracks;
    }.property('collections.@each.trackIds.[]'),
    relatedVideoId: function() {
        var history = this.get('store').peekRecord('collection', 'history');

        return history.get('trackIds.lastObject');
    }.property('collection.@each.trackIds.[]'),
    tracks: function() {
        var options = {
            relatedVideoId: this.get('relatedVideoId'),
            maxResults: shownLimit
        };

        return this._super('track', options, !this.get('cache').getIsOfflineMode());
    }.property('relatedVideoId'),
    sortedLastHistoryTracks: Ember.computed.sort('lastHistoryTracks', function(track, other) {
        return this.sortSnippet(this.get('tracks'), track, other, !this.get('cache').getIsOfflineMode());
    }),
    sortedTracks: Ember.computed.sort('tracks', function(track, other) {
        return this.sortSnippet(this.get('tracks'), track, other, !this.get('cache').getIsOfflineMode());
    }),
    selectedTracks: function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }.property('tracks.@each.isSelected')
});
