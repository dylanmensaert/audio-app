import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',
    classNames: ['mdl-layout__header'],
    title: null,
    hideSelectAll: false,
    actions: {
        selectAll: function() {
            this.sendAction('selectAll');
        }
    }
});
