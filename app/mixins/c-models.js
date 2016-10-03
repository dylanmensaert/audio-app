import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    total: null,
    models: null,
    givenTotal: Ember.computed('models.length', 'total', function() {
        let givenTotal = this.get('total');

        if (!givenTotal) {
            givenTotal = this.get('models.length');
        }

        return givenTotal;
    }),
    hasSelected: Ember.computed('models.@each.isSelected', function() {
        return this.get('models').isAny('isSelected');
    }),
    didInsertElement: function() {
        Ember.$(window).resize(function() {
            this.$('.my-outer-image').each(function() {
                logic.setOuterHeight(Ember.$(this));
            });

            this.$('.my-inner-image').each(function() {
                let currentElement = Ember.$(this);

                logic.setInnerHeight(currentElement);

                logic.setTop(currentElement, currentElement.parent().height());
            });
        }.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).off('resize');
    },
    actions: {
        deselect: function() {
            this.get('models').setEach('isSelected', false);
        },
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        }
    }
});
