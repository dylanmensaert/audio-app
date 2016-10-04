import Ember from 'ember';
import clearRouteMixin from 'audio-app/mixins/route-clear';

export default Ember.Route.extend(clearRouteMixin, {
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
