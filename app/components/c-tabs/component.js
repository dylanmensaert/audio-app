import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ['style'],
    didInsertElement: function() {
        this.$('ul.tabs').tabs();
    }
});
