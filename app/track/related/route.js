import Ember from 'ember';

export default Ember.Route.extend({
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
