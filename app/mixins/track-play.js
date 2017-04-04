import Ember from 'ember';

export default Ember.Mixin.create({
    audioRemote: Ember.inject.service(),
    playlist: null,
    relatedTrack: null,
    type: null,
    actions: {
        play: function(track) {
            if (this.get('selectedTracks.length')) {
                track.toggleProperty('isSelected');
            } else {
                let playlist = this.get('playlist'),
                    relatedTrack = this.get('relatedTrack'),
                    audioRemote = this.get('audioRemote');

                if (playlist) {
                    audioRemote.play('playlist', playlist, track);
                } else if (relatedTrack) {
                    audioRemote.play('track.related', relatedTrack, track);
                } else {
                    audioRemote.play('track.related', track)
                }
            }
        }
    }
});
