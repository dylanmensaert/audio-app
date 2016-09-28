import Ember from 'ember';
import ComponentMdl from 'audio-app/components/c-mdl';
import logic from 'audio-app/utils/logic';

export default ComponentMdl.extend({
    utils: Ember.inject.service(),
    classNames: ['mdl-layout', 'mdl-js-layout', 'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header'],
    didInsertElement: function() {
        Ember.$(window).resize(function() {
            this.$('.my-outer-image').each(function() {
                logic.setOuterHeight(Ember.$(this));
            });

            this.$('.my-inner-image').each(function() {
                var currentElement = Ember.$(this);

                logic.setInnerHeight(currentElement);

                logic.setTop(currentElement, currentElement.parent().height());
            });
        }.bind(this));

        this._super();
    },
    willDestroyElement: function() {
        Ember.$(window).off('resize');
    }
});
