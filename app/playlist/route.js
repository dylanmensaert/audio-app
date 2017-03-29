import Ember from 'ember';
import modelRouteMixin from 'audio-app/mixins/route-model';

export default Ember.Route.extend(modelRouteMixin, {
    type: 'playlist',
    afterModel: function(playlist) {
        return playlist.loadFirstTracks();
    }
});
