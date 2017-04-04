import Ember from 'ember';

export default Ember.Mixin.create({
    audioRemote: Ember.inject.service(),
    playlist: null,
    relatedTrack: null,
    type: null,
    actions: {
        playTrack: function(track) {
            if (this.get('selectedTracks.length')) {
                track.toggleProperty('isSelected');
            } else {
                let playlist = this.get('playlist'),
                    relatedTrack = this.get('relatedTrack'),
                    audioRemote = this.get('audioRemote');

                if (playlist) {
                    // TODO:support other types too
                    audioRemote.playFromPlaylist('playlist', playlist, track);
                } else if (relatedTrack) {
                    audioRemote.playFromRelatedTrack(track);
                }
            }
        }
    }
});
