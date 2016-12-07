import Ember from 'ember';

export default Ember.Controller.extend({
    model: null,
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('tracks.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('tracks.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        removeFromPlaylist: function() {
            let trackIds = this.get('selectedTracks').mapBy('id'),
                store = this.get('store'),
                playlist = this.get('model');

            trackIds.forEach(function(trackId) {
                let track = store.peekRecord('track', trackId);

                track.removeFromPlaylist(playlist);

                track.set('isSelected', false);
            });
        }
    }
});
