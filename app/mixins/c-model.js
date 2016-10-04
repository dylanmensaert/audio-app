import Ember from 'ember';

export default Ember.Mixin.create({
    model: null,
    showQueued: false,
    click: null,
    actions: {
        changeSelect: function() {
            let model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('changeSelect', model);
        }
    }
});
