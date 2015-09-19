import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    afterModel: function(resolvedModel, transition) {
        this.get('cache.completedTransitions').pushObject(transition);
    }
});
