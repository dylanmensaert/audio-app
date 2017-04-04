import Ember from 'ember';
import trackActionsMixin from 'audio-app/mixins/actions-track';

export default Ember.Component.extend(trackActionsMixin, {
    hideDownloaded: false,
    selectedTracks: Ember.computed.filterBy('models', 'isSelected', true),
    audioRemote: Ember.inject.service(),
    actions: {
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        },
        play: function(track) {
            if (this.get('selectedTracks.length')) {
                track.toggleProperty('isSelected');
            } else {
                let playlist = this.get('playlist'),
                    audioRemote = this.get('audioRemote');

                if (playlist) {
                    // TODO:support other types too
                    audioRemote.play('playlist', playlist, track);
                } else {
                    audioRemote.play('relatedTracks', track);
                }

                audioRemote.play('playlist', playlist);
                audioRemote.play('playlist', playlist, track);
                audioRemote.play('track.related', track);
                audioRemote.play('track.related', track, track);

                audioRemote.play();
            }
        }
    }
});
