import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        Ember.$(window).scroll(function() {
            let display = Ember.$(window);

            if (this.$().outerHeight() - display.scrollTop() <= 2 * display.outerHeight()) {
                this.sendAction('didScrollToBottom');
            }
        }.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).unbind('scroll');
    }
});
