import Ember from 'ember';
import clearRouteMixin from 'audio-app/mixins/route-clear';

export default Ember.Route.extend(clearRouteMixin, {
    // TODO: should work out of the box via findRecord: http://emberjs.com/blog/2015/06/18/ember-data-1-13-released.html#toc_better-caching-defaults-for-code-findall-code-and-code-findrecord-code
    // However, the documentation does not seem to work in this case
    /*queryParams: {
        collection_id: {
            refreshModel: true
        }
    },
    model: function(parameters) {
        let collectionId = parameters.collection_id,
            store = this.get('store'),
            collection = store.peekRecord('collection', collectionId);

        if (!collection) {
            collection = store.findRecord('collection', collectionId);
        }

        return collection;
    }*/
});
