import Ember from 'ember';

const keyCodeUp = 38,
    keyCodeDown = 40,
    keyCodeEscape = 27;

let timer;

export default Ember.Component.extend({
    classNames: ['my-autocomplete'],
    isPending: false,
    value: null,
    suggestions: null,
    showSuggestions: false,
    isFocused: true,
    showAutoComplete: Ember.computed('showSuggestions', 'suggestions.length', function() {
        return this.get('showSuggestions') && this.get('suggestions.length');
    }),
    updateShowSuggestions: Ember.observer('value', function() {
        this.set('showSuggestions', !!this.get('value'));
    }),
    keyDown: function(event) {
        if (event.keyCode === keyCodeUp) {
            this.selectAdjacent(function(selectedIndex) {
                return selectedIndex - 1;
            });

            event.preventDefault();
        } else if (event.keyCode === keyCodeDown) {
            this.selectAdjacent(function(selectedIndex) {
                return selectedIndex + 1;
            });

            event.preventDefault();
        } else if (event.keyCode === keyCodeEscape) {
            this.hideSuggestions();
        }
    },
    selectAdjacent: function(getAdjacentIndex) {
        let suggestions = this.get('suggestions'),
            selectedSuggestion,
            adjacentIndex,
            adjacentSuggestion;

        if (suggestions.get('length')) {
            selectedSuggestion = suggestions.findBy('isSelected');

            if (!selectedSuggestion) {
                suggestions.get('firstObject').set('isSelected', true);

                this.set('showSuggestions', true);
            } else {
                adjacentIndex = getAdjacentIndex(suggestions.indexOf(selectedSuggestion));
                adjacentSuggestion = suggestions.objectAt(adjacentIndex);

                if (!adjacentSuggestion) {
                    if (adjacentIndex < 0) {
                        this.hideSuggestions();
                    }
                } else {
                    selectedSuggestion.set('isSelected', false);
                    adjacentSuggestion.set('isSelected', true);
                }
            }
        } else {
            this.send('searchSelected');
        }
    },
    willDestroyElement: function() {
        Ember.run.cancel(timer);
    },
    hideSuggestions: function() {
        let selectedSuggestion = this.get('suggestions').findBy('isSelected');

        if (selectedSuggestion) {
            selectedSuggestion.set('isSelected', false);
        }

        this.set('showSuggestions', false);
    },
    actions: {
        searchSelected: function() {
            let suggestions = this.get('suggestions'),
                selectedSuggestion = suggestions.findBy('isSelected');

            if (selectedSuggestion) {
                this.set('value', selectedSuggestion.get('value'));
            }

            this.hideSuggestions();

            this.sendAction('search');
        },
        searchSuggestion: function(suggestion) {
            this.set('value', suggestion.get('value'));

            this.hideSuggestions();

            this.sendAction('search');
        },
        didFocusOut: function() {
            if (!this.$('ul:hover').length) {
                this.hideSuggestions();
            }
        },
        clear: function() {
            this.set('value', '');

            this.$('input').focus();
        }
    }
});
