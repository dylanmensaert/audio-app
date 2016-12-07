/* global Materialize */
import Ember from 'ember';

export default Ember.Mixin.create({
    attributeBindings: ['style'],
    style: Ember.String.htmlSafe('opacity: 0;'),
    model: null,
    showQueued: false,
    click: null,
    didInsertElement: function() {
        Materialize.fadeInImage(this.$());
    },
    actions: {
        changeSelect: function() {
            let model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('changeSelect', model);
        }
    }
});
