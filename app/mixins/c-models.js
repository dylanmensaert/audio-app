import Ember from 'ember';

let busyComponent;

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
    willDestroyElement: function() {
        if (busyComponent === this) {
            busyComponent = null;

            this.get('models').setEach('isSelected', false);
        }
    },
    onSelectModel: Ember.observer('models.@each.isSelected', function() {
        if (busyComponent && busyComponent !== this) {
            busyComponent.get('models').setEach('isSelected', false);
        }

        busyComponent = this;
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
