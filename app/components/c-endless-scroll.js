import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        this.$().scroll(function() {
            if (this.$()[0].scrollHeight - this.$().scrollTop() <= 2 * this.$().outerHeight()) {
                this.sendAction('didScrollToBottom');
            }
        }.bind(this));
    },
    willDestroyElement: function() {
        this.$().unbind('scroll');
    }
});
