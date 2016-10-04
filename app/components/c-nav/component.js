import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['navbar-fixed'],
    actions: {
        back: function() {
            this.sendAction('back');
        }
    }
});
