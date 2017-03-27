import Ember from 'ember';
import modelRouteMixin from 'audio-app/mixins/route-model';

export default Ember.Route.extend(modelRouteMixin, {
    type: 'playlist',
    afterModel: function(model) {
        let promise;

        if (!model.get('isLocalOnly') && model.get('nextPageToken') === undefined) {
            promise = model.loadNextTracks();
        }

        return promise;
    },
    willTransition: function() {
        this.controller.get('selectedTracks').setEach('isSelected', false);
    }
});
