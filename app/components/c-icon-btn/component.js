import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'a',
    icon: null,
    value: null,
    enabled: false,
    didInsertElement: function() {
        this.$().tooltip({
            delay: 50,
            tooltip: this.get('value')
        });
    },
    willDestroyElement: function() {
        this.$().tooltip('remove');
    }
});
