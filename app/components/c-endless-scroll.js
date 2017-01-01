import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

function checkScrollToBottom() {
    let display = Ember.$(window);

    if (this.$().outerHeight() - display.scrollTop() <= 2 * display.outerHeight()) {
        this.sendAction('didScrollToBottom');
    }
}

export default Ember.Component.extend(scrollMixin, {
    didInsertElement: function() {
        this.scroll(checkScrollToBottom.bind(this));
    }
});
