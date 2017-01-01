import Ember from 'ember';
import modelRouteMixin from 'audio-app/mixins/route-model';

export default Ember.Route.extend(modelRouteMixin, {
    type: 'playlist',
    setupController: function(controller, model) {
        this._super(controller, model);

        controller.reset();
        controller.start();
    }
});
