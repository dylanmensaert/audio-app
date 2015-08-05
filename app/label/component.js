import Ember from 'ember';

export default Ember.Component.extend({
    layoutName: 'label',
    classNames: ['btn', 'grid-label', 'btn-raised'],
    classNameBindings: ['model.isSelected:btn-material-grey-400:btn-default'],
    model: null,
    click: function() {
        this.toggleProperty('model.isSelected');

        this.sendAction('action', this.get('model'));
    }
});
