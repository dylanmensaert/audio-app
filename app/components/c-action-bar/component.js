import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mdl-grid', 'my-menu-grid'],
    models: null,
    actions: {
        deselect: function () {
            this.get('models').setEach('isSelected', false);

            this.sendAction('deselect');
        }
    }
});
