import Ember from 'ember';
import routeMixin from 'audio-app/mixins/route';
import routeTransitionMixin from 'audio-app/mixins/route-transition';

export default Ember.Route.extend(routeMixin, routeTransitionMixin, {
    title: 'index',
    model: function(params) {
        // TODO: should work out of the box via findRecord: http://emberjs.com/blog/2015/06/18/ember-data-1-13-released.html#toc_better-caching-defaults-for-code-findall-code-and-code-findrecord-code
        // However, the documentation does not seem to work in this case
        var store = this.get('store'),
            collection = store.peekRecord('collection', params.collection_id);

        if (!collection) {
            collection = this.get('store').findRecord('collection', params.collection_id);
        }

        return collection;
    },
    setupController: function(controller, model) {
        if (controller.get('model.id') !== model.get('id')) {
            controller.set('nextPageToken', null);
            controller.set('isPending', true);
            controller.set('isLocked', false);
            controller.set('tracks', []);
        }

        this._super(controller, model);
    }
});
