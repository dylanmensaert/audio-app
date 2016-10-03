import Ember from 'ember';
import backRouteMixin from 'audio-app/mixins/route-back';

export default Ember.Route.extend(backRouteMixin, {
    setupController: function(controller, model) {
        let query = controller.get('query');

        if (query) {
            controller.set('value', query);
        }

        this._super(controller, model);
    },
    actions: {
        search: function() {
            this.controllerFor(this.controller.get('application.currentRouteName')).resetController();
        }
    }
});
