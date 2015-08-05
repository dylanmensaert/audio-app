import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        updateTitle: function(tokens) {
            tokens.push(this.get('title'));
            return true;
        }
    }
});
