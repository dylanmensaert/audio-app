import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',
    classNames: ['mdl-layout__header'],
    title: null,
    isSearchMode: false,
    actions: {
        selectAll: function() {
            this.sendAction('selectAll');
        },
        startSearchMode: function() {
            this.set('isSearchMode', true);
        },
        endSearchMode: function() {
            this.set('isSearchMode', false);
        }
    }
});
