import Ember from 'ember';
import routeMixin from 'audio-app/mixins/route';
import routeTransitionMixin from 'audio-app/mixins/route-transition';

export default Ember.Route.extend(routeMixin, routeTransitionMixin, {
    title: 'index',
    model: function(params) {
        var store = this.get('store'),
            collection = store.peekRecord('collection', params.collection_id);

        if (!collection) {
            collection = this.get('store').findRecord('collection', params.collection_id);
        }

        return collection;
    },
    resetController: function(controller, isExiting) {
        if (isExiting) {
            controller.set('isPending', true);
            controller.set('isLocked', false);
            controller.set('tracks', []);
        }
    }
});
