import Ember from 'ember';
import playTrackMixin from 'audio-app/mixins/track-play';

export default Ember.Component.extend(playTrackMixin, {
    hideDownloaded: false,
    selectedTracks: Ember.computed.filterBy('models', 'isSelected', true),
    audioRemote: Ember.inject.service(),
    isActive: Ember.computed('audioRemote.model.id', 'playlist.id', 'relatedTrack.id', function() {
        let id = this.get('audioRemote.model.id');

        return this.get('playlist.id') === id || this.get('relatedTrack.id') === id;
    }),
    actions: {
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        }
    }
});
