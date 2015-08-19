import Ember from 'ember';

// TODO: send action on suggestion click
// TODO: remove typeahead, which is settings this.$().val() on focus out
export default Ember.TextField.extend({
    value: null,
    classNames: ['mdl-textfield__input'],
    insertNewline: function () {
        this.sendAction('insert-newline');
    },
    change: function () {
        this.attrs.value.update(this.get('value'));
    },
    focus: function () {
        this.focus();
    },
    didInsertElement: function () {
        Ember.run.scheduleOnce('afterRender', this.$(), this.focus);
    }
});
