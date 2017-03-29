import Ember from 'ember';
import trackActionsMixin from 'audio-app/mixins/actions-track';

export default Ember.Controller.extend(trackActionsMixin, {
    history: Ember.computed(function() {
        return this.store.peekRecord('playlist', 'history');
    }),
    latestHistoryTracks: Ember.computed('history.tracks.[]', function() {
        let latestHistoryTracks = [];

        this.get('history.tracks').every(function(track, index) {
            latestHistoryTracks.pushObject(track);

            return 8 > index + 1;
        });

        latestHistoryTracks.forEach(function(track) {
            track.loadFirstRelatedTracks();
        });

        return latestHistoryTracks;
    }),
    // TODO: rework hasNextPageToken to isLoadingRelated
    isPending: Ember.computed('latestHistoryTracks.@each.hasNextPageToken', function() {
        return this.get('latestHistoryTracks').isAny('hasNextPageToken');
    }),
    hashes: Ember.computed('latestHistoryTracks.@each.relatedTracksLength', function() {
        let latestHistoryTracks = this.get('latestHistoryTracks'),
            shownTrackIds = [];

        this.set('shownTrackIds', shownTrackIds);

        return latestHistoryTracks.map(function(track) {
            let topRelatedTracks = [];

            track.get('sortedRelatedTracks').every(function(relatedTrack) {
                let id = relatedTrack.get('id');

                if (!shownTrackIds.includes(id)) {
                    topRelatedTracks.pushObject(relatedTrack);
                    shownTrackIds.pushObject(id);
                }

                return 4 > topRelatedTracks.get('length');
            });

            return Ember.Object.create({
                track,
                topRelatedTracks
            });
        });
    }),
    shownTrackIds: [],
    shownTracks: Ember.computed('shownTrackIds.[]', function() {
        let store = this.store;

        return this.get('shownTrackIds').map(function(trackId) {
            return store.peekRecord('track', trackId);
        });
    }),
    selectedTracks: Ember.computed.filterBy('shownTracks', 'isSelected', true)
});
