import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    utils: Ember.inject.service(),
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

        this._super();

        this.$(".button-collapse").sideNav();
    },
    willDestroyElement: function () {
        Ember.$(window).off('resize');
    }
});
