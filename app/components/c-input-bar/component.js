import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mdl-layout__header-row', 'my-header-bar', 'my-edit-bar'],
    value: null,
    actions: {
        clearInput: function () {
            this.set('value', null);
        },
        done: function () {
            this.sendAction('done');
        }
    }
});
