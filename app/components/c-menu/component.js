import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        this.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    }
});
