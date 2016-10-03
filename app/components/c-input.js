import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';

// TODO: send action on suggestion click
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
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this.$(), this.focus);
    }
});
