import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        query: {
            replace: true
        }
    },
    setupController: function(controller, model) {
        let query = controller.get('query');

        controller.set('value', query);

        this._super(controller, model);
    },
    actions: {
        search: function() {
            this.controllerFor(this.controller.get('application.currentRouteName')).resetController();
        }
    }
});
