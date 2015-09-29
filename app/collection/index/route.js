import Ember from 'ember';
import routeMixin from 'audio-app/mixins/route';
import routeTransitionMixin from 'audio-app/mixins/route-transition';

export default Ember.Route.extend(routeMixin, routeTransitionMixin, {
    title: 'index',
    model: function(params) {
        return this.get('store').findRecord('collection', params.collection_id);
    },
    resetController: function(controller, isExiting) {
        if (isExiting) {
            controller.set('isPending', true);
            controller.set('isLocked', false);
            controller.set('tracks', []);
        }
    }
});
