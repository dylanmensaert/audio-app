import Ember from 'ember';
import backRouteMixin from 'audio-app/mixins/route-back';

export default Ember.Route.extend(backRouteMixin, {
    setupController: function(controller, model) {
        this._super(controller, model);

        controller.start();
    },
    model: function(parameters) {
        let playlistId = parameters.playlist_id,
            playlist = this.store.peekRecord('playlist', playlistId);

        if (!playlist) {
            playlist = this.store.findRecord('playlist', playlistId);
        }

        return playlist;
    }
});
