import Ember from 'ember';

// TODO: send action on suggestion click
export default Ember.TextField.extend({
    classNames: ['mdl-textfield__input'],
    attributeBindings: ['suggest'],
    isFocussed: false,
    insertNewline: function() {
        this.sendAction('insert-newline');

        this.$().typeahead('close');
    },
    fetchSuggestions: null,
    didInsertElement: function() {
        this.$().typeahead({
            highlight: true,
            hint: false
        }, {
            source: this.get('fetchSuggestions')
        });

        if (this.get('isFocussed')) {
            this.$().focus();
        }

        this.$().focusin(function() {
          this.set('isFocussed', true);
        }.bind(this));

        this.$().focusout(function() {
          this.set('isFocussed', false);
        }.bind(this));
    },
    willDestroyElement: function() {
        this.$().typeahead('destroy');
    }
});
