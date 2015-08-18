/* global componentHandler: true */
import Ember from 'ember';

// TODO: send action on suggestion click
export default Ember.TextField.extend({
    classNames: ['mdl-textfield__input'],
    attributeBindings: ['suggest'],
    insertNewline: function () {
        this.sendAction('insert-newline');

        this.$().typeahead('close');
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

        /*componentHandler.upgradeElement(this.$().closest('.mdl-textfield')[0]);*/

        Ember.run.scheduleOnce('afterRender', this.$(), this.focus);
    },
    willDestroyElement: function () {
        this.$().typeahead('destroy');
    }
});
