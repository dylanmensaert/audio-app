import Ember from 'ember';
import resetScrollMixin from 'audio-app/mixins/reset-scroll';

export default Ember.Route.extend(resetScrollMixin, {
    setupController: function(controller, model) {
        this._super(controller, model);

        controller.reset();
        controller.start().then(function() {
            let relatedTracks = controller.get('sortedModels').toArray();

            relatedTracks.unshiftObject(model);

            model.set('tracks', relatedTracks);
        });
    }
});
