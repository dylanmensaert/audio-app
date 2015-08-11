import Ember from 'ember';

export default Ember.Controller.extend({
    isLoading: false,
        linkToProperties: {
        classNameBindings: ['active:mdl-color--grey-100']
    },
    actions: {
        dismissAlert: function() {
            this.set('error', null);
        }
    }
});
