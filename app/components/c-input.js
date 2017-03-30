import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.TextField.extend(safeStyleMixin, {
    value: null,
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
    isFocused: true,
    didInsertElement: function() {
        if (this.get('isFocused')) {
            Ember.run.scheduleOnce('afterRender', this.$(), this.focus);
        }
    }
});
