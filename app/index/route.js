import Ember from 'ember';
/*import logic from 'audio-app/utils/logic';*/

export default Ember.Route.extend({
    actions: {
        redirect: function() {
                this.transitionTo('playlists');
            }
            /*didTransition: function() {
                let history = this.store.peekRecord('playlist', 'history'),
                    latestHistoryTracks = [],
                    promises,
                    promise,
                    loading;

                history.get('tracks').every(function(track, index) {
                    latestHistoryTracks.pushObject(track);

                    return 8 > index + 1;
                });

                promises = latestHistoryTracks.map(function(track) {
                    return track.loadFirstRelatedTracks();
                });

                promise = Ember.RSVP.all(promises).then(function() {
                    let tracks = latestHistoryTracks.toArray(),
                        latestHistoryHash;

                    latestHistoryHash = latestHistoryTracks.map(function(track) {
                        let topRelatedTracks = [];

                        track.get('sortedRelatedTracks').every(function(relatedTrack) {
                            let id = relatedTrack.get('id');

                            if (!tracks.isAny('id', id)) {
                                topRelatedTracks.pushObject(relatedTrack);
                                tracks.pushObject(relatedTrack);
                            }

                            return 4 > topRelatedTracks.get('length');
                        });

                        return Ember.Object.create({
                            track,
                            topRelatedTracks
                        });
                    });

                    this.controller.set('tracks', tracks);
                    this.controller.set('latestHistoryHash', latestHistoryHash);
                }.bind(this));

                loading = logic.ObjectPromiseProxy.create({
                    promise: promise
                });

                this.controller.set('loading', loading);
            }*/
    }
});
