import Ember from 'ember';

export default Ember.Mixin.create({
    model: null,
    actions: {
        removeFromPlaylist: function() {
            let trackIds = this.get('selectedTracks').mapBy('id'),
                store = this.get('store'),
                playlist = this.get('model');

            trackIds.forEach(function(trackId) {
                let track = store.peekRecord('track', trackId);

                playlist.removeTrack(track);

                track.set('isSelected', false);
            });
        }
    }
});
