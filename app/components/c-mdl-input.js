import Ember from 'ember';

// TODO: send action on suggestion click
export default Ember.TextField.extend({
    value: null,
    classNames: ['mdl-textfield__input'],
    insertNewline: function() {
        this.sendAction('action');
    },
    change: function() {
        this.attrs.value.update(this.get('value'));
    },
    focus: function() {
        this.focus();
    },
    focusOut: function() {
        this.sendAction('didFocusOut');
    },
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this.$(), this.focus);
    }
});
