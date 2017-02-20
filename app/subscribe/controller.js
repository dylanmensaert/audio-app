import Ember from 'ember';
import playlistsControllerMixin from 'audio-app/mixins/controller-playlists';

export default Ember.Controller.extend(playlistsControllerMixin, {
    utils: Ember.inject.service(),
    actions: {
        changeSelect: function(playlist) {
            let utils = this.get('utils'),
                selectedTrackIds = utils.get('selectedTrackIds'),
                length = selectedTrackIds.get('length'),
                trackIds = playlist.get('trackIds'),
                store = this.get('store');

            if (playlist.get('isSelected')) {
                selectedTrackIds.forEach(function(trackId) {
                    if (!trackIds.includes(trackId)) {
                        let track = store.peekRecord('track', trackId);

                        playlist.pushTrack(track);
                    }
                });

                utils.showMessage('Added to playlist (' + length + ')');
            } else {
                selectedTrackIds.forEach(function(trackId) {
                    if (trackIds.includes(trackId)) {
                        let track = store.peekRecord('track', trackId);

                        playlist.removeTrack(track);
                    }
                });

                utils.showMessage('Removed from playlist (' + length + ')');
            }
        }
    }
});
