import Ember from 'ember';

export default Ember.Mixin.create({
    audioRemote: Ember.inject.service(),
    playlist: null,
    type: null,
    actions: {
        playTrack: function(track) {
            if (this.get('selectedTracks.length')) {
                track.toggleProperty('isSelected');
            } else {
                let playlist = this.get('playlst'),
                    audioRemote = this.get('audioRemote');

                if (playlist) {
                    // TODO:support other types too
                    audioRemote.play('playlist', playlist, track);
                } else {
                    audioRemote.playTrack(track);
                }
            }
        }
    }
});
