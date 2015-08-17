import Ember from 'ember';

// TODO: send action on suggestion click
export default Ember.TextField.extend({
    classNames: ['mdl-textfield__input'],
    attributeBindings: ['suggest'],
    isFocussed: false,
    insertNewline: function () {
        this.sendAction('insert-newline');

        this.$().typeahead('close');
    },
    fetchSuggestions: null,
    didInsertElement: function () {
        this.$().typeahead({
            highlight: true,
            hint: false
        }, {
            source: this.get('fetchSuggestions')
        });

        this.$().focusin(function () {
            this.set('isFocussed', true);
        }.bind(this));

        Ember.run.scheduleOnce('afterRender', function () {
            if (this.get('isFocussed')) {
                this.$().focus();
            }
        }.bind(this));
    },
    willDestroyElement: function () {
        this.$().typeahead('destroy');
    }
});
