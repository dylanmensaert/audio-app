import Ember from 'ember';
import routeTransitionMixin from 'audio-app/mixins/route-transition';

export default Ember.Route.extend(routeTransitionMixin, {
    title: 'index',
    parameterName: 'collection_id',
    model: function(parameters) {
        // TODO: should work out of the box via findRecord: http://emberjs.com/blog/2015/06/18/ember-data-1-13-released.html#toc_better-caching-defaults-for-code-findall-code-and-code-findrecord-code
        // However, the documentation does not seem to work in this case
        var store = this.get('store'),
            collection = store.peekRecord('collection', parameters[this.get('parameterName')]);

        if (!collection) {
            collection = this.get('store').findRecord('collection', parameters[this.get('parameterName')]);
        }

        return collection;
    }
});
