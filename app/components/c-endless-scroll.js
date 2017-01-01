import Ember from 'ember';

export default Ember.Component.extend({
    checkScrollToBottom: function() {
        let display = Ember.$(window);

        if (this.$().outerHeight() - display.scrollTop() <= 2 * display.outerHeight()) {
            this.sendAction('didScrollToBottom');
        }
    },
    didInsertElement: function() {
        Ember.$(window).scroll(this.checkScrollToBottom.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).off('scroll', this.checkScrollToBottom);
    }
});
