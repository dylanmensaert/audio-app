import Ember from 'ember';

export default Ember.Mixin.create({
    utils: Ember.inject.service(),
    total: null,
    models: [],
    selectedModels: Ember.computed('models.@each.isSelected', function() {
        return this.get('models').filterBy('isSelected');
    }),
    givenTotal: Ember.computed('models.length', 'total', function() {
        let givenTotal = this.get('total');

        if (!givenTotal) {
            givenTotal = this.get('models.length');
        }

        return givenTotal;
    }),
    actions: {
        deselect: function() {
            this.get('selectedModels').setEach('isSelected', false);
        },
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        }
    }
});
