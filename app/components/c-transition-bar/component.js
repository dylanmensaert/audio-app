import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mdl-layout__header-row', 'my-header-bar'],
    utils: Ember.inject.service(),
    title: null,
    actions: {
        selectAll: function () {
            this.sendAction('selectAll');
        },
        back: function () {
            this.get('utils').back();
        }
    }
});
