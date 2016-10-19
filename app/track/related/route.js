import Ember from 'ember';
import registerRouteMixin from 'audio-app/mixins/route-register';

export default Ember.Route.extend(registerRouteMixin, {
    setupController: function(controller, model) {
        this._super(controller, model);

        controller.reset();
        controller.start();
    }
});
