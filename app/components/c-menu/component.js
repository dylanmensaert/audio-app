import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    didInsertElement: function() {
        Ember.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    }
});
