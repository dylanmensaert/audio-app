import Ember from 'ember';
import trackActionsMixin from 'audio-app/mixins/actions-track';

export default Ember.Component.extend(trackActionsMixin, {
    playlist: null,
    hideDownloaded: false,
    selectedTracks: Ember.computed.filterBy('models', 'isSelected', true)
});
