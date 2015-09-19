import Ember from 'ember';

export default Ember.Mixin.create({
    /*afterModel: function(resolvedModel, transition) {
        this.get('cache.completedTransitions').pushObject(transition);
    },*/
    actions: {
        updateTitle: function(tokens) {
            tokens.push(this.get('title'));
            return true;
        }
    }
});
