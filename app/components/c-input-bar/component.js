import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'nav',
    classNames: ['my-input-bar__action', 'my-fixed-row'],
    value: null,
    placeholder: null,
    actions: {
        clear: function() {
            this.set('value', null);
        },
        done: function() {
            this.sendAction('done');
        }
    }
});
