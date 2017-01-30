import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(scrollMixin, {
    checkScrollToBottom: function() {
        let display = Ember.$(window);

        if (this.$().outerHeight() - display.scrollTop() <= 2 * display.outerHeight()) {
            this.sendAction('didScrollToBottom');
        }
    },
    didInsertElement: function() {
        this.scroll(this.checkScrollToBottom);
    }
});
