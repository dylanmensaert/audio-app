import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';

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
            if (length - 8 >= index) {
                lastHistoryTracks.pushObject(store.peekRecord('track', trackId));
            }
        });

        return lastHistoryTracks;
    }.property('collections.@each.trackIds.[]'),
    tracks: function() {
        var query = this.get('query'),
            history = this.get('store').peekRecord('collection', 'history'),
            options;

        if (query !== null) {
            options = {
                relatedVideoId: history.get('trackIds.lastObject'),
                maxResults: 8
            };

            return this._super('track', options, !this.get('cache').getIsOfflineMode());
        }
    }.property('query'),
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
