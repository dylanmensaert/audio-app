import Ember from 'ember';
import loadNextControllerMixin from 'audio-app/mixins/controller-load-next';

export default Ember.Controller.extend(loadNextControllerMixin, {
    canLoadNext: Ember.computed.alias('model.hasNextPageToken'),
    loadNext: function() {
        return this.get('model').loadNextRelatedTracks();
    }
});
