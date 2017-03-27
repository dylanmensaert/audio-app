import Ember from 'ember';
import playlistsControllerMixin from 'audio-app/mixins/controller-playlists';

export default Ember.Controller.extend(playlistsControllerMixin, {
    utils: Ember.inject.service(),
    tracks: null,
    actions: {
        changeSelect: function(playlist) {
            let utils = this.get('utils'),
                tracks = this.get('tracks'),
                length = tracks.get('length'),
                playlistTrackIds = playlist.get('trackIds'),
                store = this.get('store');

            if (playlist.get('isSelected')) {
                tracks.forEach(function(track) {
                    if (!playlistTrackIds.includes(track.get('id'))) {
                        playlist.pushTrack(track);
                    }
                });

                playlist.save();

                utils.showMessage('Added to playlist (' + length + ')');
            } else {
                tracks.forEach(function(track) {
                    if (playlistTrackIds.includes(track.get('id'))) {
                        playlist.removeTrack(track);
                    }
                });

                playlist.save();

                utils.showMessage('Removed from playlist (' + length + ')');
            }
        }
    }
});
