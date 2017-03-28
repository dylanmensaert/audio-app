import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend({
    fileSystem: Ember.inject.service(),
    tracks: Ember.computed('fileSystem.trackIds.[]', function() {
        let trackIds = this.get('fileSystem.trackIds'),
            tracks;

        if (trackIds) {
            let store = this.store;

            tracks = trackIds.map(function(trackId) {
                return store.peekRecord('track', trackId);
            });
        }

        return tracks;
    }),
    downloadedTracks: Ember.computed.filterBy('tracks', 'isDownloaded', true),
    sortedTracks: Ember.computed.sort('downloadedTracks', function(track, other) {
        return logic.sortByName(track, other);
    })
});
