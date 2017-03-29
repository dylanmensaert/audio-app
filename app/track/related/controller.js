import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend(findControllerMixin, {
    audioRemote: Ember.inject.service(),
    type: 'track',
    setOptions: function(options) {
        options.relatedVideoId = this.get('model.id');
    },
    // TODO: Youtube API, viewCount not working in combination with relatedVideoId
    trackSorting: ['viewCount:desc'],
    sortedModels: Ember.computed.sort('models', 'trackSorting'),
    afterUpdate: function(models) {
        // TODO: client sorting causes issues with pagination, this fixes it.
        this.set('nextPageToken', null);

        return logic.findDetails(models);
    }
});
