import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend({
    tracks: Ember.computed('fileSystem.trackIds.[]', function() {
        let trackIds = this.get('fileSystem.trackIds'),
            store = this.store,
            tracks = [];

        if (trackIds) {
            trackIds.forEach(function(trackId) {
                let track = store.peekRecord('track', trackId);

                if (track.get('isDownloaded')) {
                    tracks.pushObject(track);
                }
            });
        }

        return tracks;
    }),
    sortedTracks: Ember.computed.sort('tracks', function(track, other) {
        return logic.sortByName(track, other);
    })
});
