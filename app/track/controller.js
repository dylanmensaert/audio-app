import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend(findControllerMixin, {
    model: null,
    type: 'track',
    setOptions: function(options) {
        options.maxResults = logic.maxResults;

        options.nextPageToken = this.get('nextPageToken');
        options.relatedVideoId = this.get('model.id');
    }
});
