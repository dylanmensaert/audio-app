import Ember from 'ember';
import playTrackMixin from 'audio-app/mixins/track-play';

export default Ember.Controller.extend(playTrackMixin, {
    loading: null,
    latestHistoryHash: null,
    tracks: null,
    selectedTracks: Ember.computed.filterBy('tracks', 'isSelected', true)
});
