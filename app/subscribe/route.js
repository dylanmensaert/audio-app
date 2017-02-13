/*global history*/
import Ember from 'ember';

export default Ember.Route.extend({
    utils: Ember.inject.service(),
    actions: {
        willTransition: function() {
            this.controller.get('playlists').setEach('isSelected', false);
        },
        didTransition: function() {
            let selectedTrackIds = this.get('utils.selectedTrackIds');

            if (selectedTrackIds.get('length')) {
                this.controller.get('playlists').forEach(function(playlist) {
                    let isSelected = selectedTrackIds.every(function(selectedTrackId) {
                        return playlist.get('trackIds').includes(selectedTrackId);
                    });

                    playlist.set('isSelected', isSelected);
                });
            } else {
                history.back();
            }
        }
    }
});
