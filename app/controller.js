import Ember from 'ember';

export default Ember.Controller.extend({
    isLoading: false,
    actions: {
        dismissAlert: function() {
            this.set('error', null);
        }
    }
});
