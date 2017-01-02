import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['my-input-row', 'my-fixed-row'],
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
