/*global history*/
import Ember from 'ember';

export default Ember.Route.extend({
    utils: Ember.inject.service(),
    actions: {
        willTransition: function() {
            this.controller.get('playlists').setEach('isSelected', false);
        },
        didTransition: function() {
            let tracks = this.controller.get('tracks');

            if (tracks.get('length')) {
                this.controller.get('playlists').forEach(function(playlist) {
                    let isSelected = tracks.every(function(track) {
                        return playlist.get('trackIds').includes(track.get('id'));
                    });

                    playlist.set('isSelected', isSelected);
                });
            } else {
                history.back();
            }
        }
    }
});
