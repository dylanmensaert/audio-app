/* global Materialize */
import Ember from 'ember';

export default Ember.Mixin.create({
    attributeBindings: ['style'],
    style: Ember.String.htmlSafe('opacity: 0;'),
    model: null,
    click: null,
    didInsertElement: function() {
        let element = this.$();

        Materialize.fadeInImage(element);
    },
    changeSelect: function() {
        let model = this.get('model');

        model.toggleProperty('isSelected');

        this.sendAction('changeSelect', model);
    },
    actions: {
        changeSelect: function() {
            this.changeSelect();
        }
    }
});
