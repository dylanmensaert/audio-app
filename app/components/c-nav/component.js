import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    didInsertElement: function () {
        Ember.$(window).resize(function () {
            this.$('.my-outer-image').each(function () {
                logic.setOuterHeight(Ember.$(this));
            });

            this.$('.my-inner-image').each(function () {
                var currentElement = Ember.$(this);

                logic.setInnerHeight(currentElement);

                logic.setTop(currentElement, currentElement.parent().height());
            });
        }.bind(this));

        this.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    },
    willDestroyElement: function () {
        Ember.$(window).off('resize');
    }
});
