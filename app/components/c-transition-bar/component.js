import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mdl-layout__header-row', 'my-header-bar'],
    title: null,
    actions: {
        selectAll: function () {
            this.sendAction('selectAll');
        },
        transitionToPrevious: function () {
            this.sendAction('transitionToPrevious');
        }
    }
});
