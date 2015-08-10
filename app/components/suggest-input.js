import Ember from 'ember';

// TODO: send action on suggestion click
export default Ember.TextField.extend({
    classNames: ['mdl-textfield__input'],
    focus: false,
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

        if (this.get('focus')) {
            this.$().focus();
        }
    },
    willDestroyElement: function() {
        this.$().typeahead('destroy');
    }
});
