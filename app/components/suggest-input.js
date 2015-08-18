import Ember from 'ember';

// TODO: send action on suggestion click
// TODO: remove typeahead, which is settings this.$().val() on focus out
export default Ember.TextField.extend({
    value: null,
    classNames: ['mdl-textfield__input'],
    attributeBindings: ['suggest'],
    insertNewline: function () {
        this.sendAction('insert-newline');

        this.$().typeahead('close');
    },
    change: function() {
      this.attrs.value.update(this.get('value'));
    },
    fetchSuggestions: null,
    focus: function () {
        this.focus();
    },
    didInsertElement: function () {
        this.$().typeahead({
            highlight: true,
            hint: false
        }, {
            source: this.get('fetchSuggestions')
        });

        Ember.run.scheduleOnce('afterRender', this.$(), this.focus);
    },
    willDestroyElement: function () {
        this.$().typeahead('destroy');
    }
});
