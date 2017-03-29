import Ember from 'ember';
import trackActionsMixin from 'audio-app/mixins/actions-track';

export default Ember.Controller.extend(trackActionsMixin, {
    latestHistoryTracks: null,
    // TODO: rework hasNextPageToken to isLoadingRelated
    isPending: Ember.computed('latestHistoryTracks.@each.hasNextPageToken', function() {
        return this.get('latestHistoryTracks').isAny('hasNextPageToken');
    }),
    hashes: Ember.computed('latestHistoryTracks.@each.relatedTracksLength', function() {
        let shownTrackIds = this.get('shownTrackIds');

        shownTrackIds.clear();

        return this.get('latestHistoryTracks').map(function(track) {
            let topRelatedTracks = [];

            shownTrackIds.pushObject(track.get('id'));

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
