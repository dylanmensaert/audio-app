import Ember from 'ember';
import trackActionsMixin from 'audio-app/mixins/actions-track';

export default Ember.Component.extend(trackActionsMixin, {
    hideDownloaded: false,
    selectedTracks: Ember.computed.filterBy('models', 'isSelected', true),
    actions: {
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        }
    }
});
