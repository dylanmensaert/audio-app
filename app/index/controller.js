import Ember from 'ember';
import trackActionsMixin from 'audio-app/mixins/actions-track';

export default Ember.Controller.extend(trackActionsMixin, {
    loading: null,
    latestHistoryHash: null,
    tracks: null,
    selectedTracks: Ember.computed.filterBy('tracks', 'isSelected', true)
});
