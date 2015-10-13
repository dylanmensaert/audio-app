import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mdl-grid', 'my-menu-grid'],
    models: null,
    total: null,
    shownTotal: function() {
        var shownTotal = this.get('total');

        if (!shownTotal) {
            shownTotal = this.get('models.length');
        }

        return shownTotal;
    }.property('models.length', 'total'),
    actions: {
        deselect: function() {
            this.get('models').setEach('isSelected', false);
        }
    }
});
