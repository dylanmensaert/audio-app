/* global window: true */
import Ember from 'ember';

/*TODO: Delete endless scroll functionality?*/
export default Ember.Component.extend({
    didInsertElement: function() {
        var viewport = Ember.$(window),
            position,
            maxPosition;

        viewport.scroll(function() {
            position = viewport.scrollTop() + viewport.height();
            maxPosition = this.$().offset().top + this.$().outerHeight(true) - viewport.height();

            if (position > maxPosition) {
                this.sendAction('didScrollToBottom');
            }
        }.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).unbind('scroll');
    }
});
