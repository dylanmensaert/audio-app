import Ember from 'ember';

export default Ember.Component.extend({
    layoutName: 'action_bar',
    classNames: ['action-bar', 'btn-material-amber-A700', 'container', 'text-center'],
    models: null,
    actions: {
        deselect: function() {
            this.get('models').setEach('isSelected', false);

            this.sendAction('deselect');
        }
    }
});
