import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    utils: Ember.inject.service(),
    didInsertElement: function() {
        Ember.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    }
});
