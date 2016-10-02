import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['my-input-bar'],
    value: null,
    actions: {
        clear: function() {
            this.set('value', null);
        },
        done: function() {
            this.sendAction('done');
        }
    }
});
