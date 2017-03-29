import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        didTransition: function() {
            let history = this.store.peekRecord('playlist', 'history'),
                latestHistoryTracks = [];

            history.get('tracks').every(function(track, index) {
                latestHistoryTracks.pushObject(track);

                return 8 > index + 1;
            });

            latestHistoryTracks.forEach(function(track) {
                track.loadFirstRelatedTracks();
            });

            this.controller.set('latestHistoryTracks', latestHistoryTracks);
        }
    }
});
