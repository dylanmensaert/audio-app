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
                let store = this.get('store');

                selectedTrackIds.forEach(function(trackId) {
                    if (!trackIds.includes(trackId)) {
                        let track = store.peekRecord('track', trackId);

                        playlist.pushTrack(track);
                    }
                });

                utils.showMessage('Added to playlist');
            } else {
                let store = this.get('store');

                selectedTrackIds.forEach(function(trackId) {
                    if (trackIds.includes(trackId)) {
                        let track = store.peekRecord('track', trackId);

                        playlist.removeTrack(track);
                    }
                });

                utils.showMessage('Removed from playlist');
            }
        }
    }
});
