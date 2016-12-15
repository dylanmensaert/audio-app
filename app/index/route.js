import Ember from 'ember';

const lastHistoryTracksLimit = 8;

export default Ember.Route.extend({
    actions: {
        didTransition: function() {
            let history = this.store.peekRecord('playlist', 'history'),
                store = this.get('store'),
                historyTrackIds = history.get('trackIds'),
                length = historyTrackIds.get('length'),
                lastHistoryTracks = [];

            historyTrackIds.forEach(function(trackId, index) {
                if (length <= lastHistoryTracksLimit || length - lastHistoryTracksLimit >= index) {
                    lastHistoryTracks.pushObject(store.peekRecord('track', trackId));
                }
            });

            this.controller.set('lastHistoryTracks', lastHistoryTracks);
        }
    }
});
