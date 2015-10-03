import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',
    classNames: ['mdl-layout__header'],
    title: null,
    actions: {
        selectAll: function() {
            this.sendAction('selectAll');
        }
    }
});
