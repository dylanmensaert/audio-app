import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import connection from 'connection';

export default Ember.Controller.extend(findControllerMixin, {
    playlists: Ember.computed('utils.selectedTrackIds', 'playlists.@each.trackIds', function() {
        let selectedTrackIds = this.get('utils.selectedTrackIds');

        return this.get('store').peekAll('playlist').filter(function(playlist) {
            let isSelected,
                isReadOnly = playlist.get('isReadOnly');

            if (!isReadOnly) {
                isSelected = selectedTrackIds.every(function(selectedTrackId) {
                    return playlist.get('trackIds').includes(selectedTrackId);
                });

                playlist.set('isSelected', isSelected);
            }

            return !isReadOnly;
        });
    }),
    sortedPlaylists: Ember.computed.sort('playlists', function(snippet, other) {
        return this.sort(this.get('playlists'), snippet, other, !connection.isMobile());
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('playlists.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('playlists.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        back: function() {
            let utils = this.get('utils');

            this.get('playlists').setEach('isSelected', false);

            utils.get('selectedTrackIds').clear();

            utils.back();
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
                        playlist.removeTrackById(selectedTrackIds);
                    }
                });

                utils.showMessage('Removed from playlist');
            }
        }
    }
});
