import Ember from 'ember';

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
        let models = this.get('models');

        return models && models.isAny('isSelected');
    }),
    actions: {
        deselect: function() {
            this.get('models').setEach('isSelected', false);
        },
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        }
    }
});
