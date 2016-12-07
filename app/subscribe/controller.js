import Ember from 'ember';
import playlistsControllerMixin from 'audio-app/mixins/controller-playlists';

export default Ember.Controller.extend(playlistsControllerMixin, {
    updateSelection: Ember.observer('utils.selectedTrackIds.[]', 'playlists.[]', function() {
        let selectedTrackIds = this.get('utils.selectedTrackIds');

        if (selectedTrackIds.get('length')) {
            this.get('playlists').forEach(function(playlist) {
                let isSelected = selectedTrackIds.every(function(selectedTrackId) {
                    return playlist.get('trackIds').includes(selectedTrackId);
                });

                playlist.set('isSelected', isSelected);
            });
        }
    }),
    actions: {
        back: function() {
            let utils = this.get('utils');

            this.get('playlists').setEach('isSelected', false);
            utils.get('selectedTrackIds').clear();

            return true;
        },
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
                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (trackIds.includes(selectedTrackId)) {
                        let track = this.get('store').peekRecord('track', selectedTrackId);

                        track.removeFromPlayList(playlist);
                    }
                });

                utils.showMessage('Removed from playlist');
            }
        }
    }
});
