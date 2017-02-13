import Ember from 'ember';
import playlistsControllerMixin from 'audio-app/mixins/controller-playlists';

export default Ember.Controller.extend(playlistsControllerMixin, {
    utils: Ember.inject.service(),
    actions: {
        changeSelect: function(playlist) {
            let utils = this.get('utils'),
                selectedTrackIds = utils.get('selectedTrackIds'),
                trackIds = playlist.get('trackIds');

            if (playlist.get('isSelected')) {
                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (!trackIds.includes(selectedTrackId)) {
                        playlist.pushTrackById(selectedTrackId);
                    }
                });

                utils.showMessage('Added to playlist');
            } else {
                let store = this.get('store');

                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (trackIds.includes(selectedTrackId)) {
                        let track = store.peekRecord('track', selectedTrackId);

                        track.removeFromPlayList(playlist);
                    }
                });

                utils.showMessage('Removed from playlist');
            }
        }
    }
});
