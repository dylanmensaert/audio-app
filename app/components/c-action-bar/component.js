import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    classNames: ['mdl-grid', 'my-menu-grid'],
    models: null,
    total: null,
    shownTotal: Ember.computed('models.length', 'total', function() {
        var shownTotal = this.get('total');

        if(!shownTotal) {
            shownTotal = this.get('models.length');
        }

        return shownTotal;
    }),
    actions: {
        deselect: function() {
            this.get('models').setEach('isSelected', false);

            this.sendAction('deselect');
        }
    }
});
