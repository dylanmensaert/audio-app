import Ember from 'ember';

export default Ember.Mixin.create({
    audioRemote: Ember.inject.service(),
    actions: {
        playTrack: function(track) {
            if (this.get('selectedTracks.length')) {
                track.toggleProperty('isSelected');
            } else if (!track.get('isDisabled')) {
                this.get('audioRemote').play(track);
            }
        }
    }
});
