import Ember from 'ember';
import ComponentMdl from 'audio-app/components/c-mdl';

const keyCodeUp = 38,
    keyCodeDown = 40,
    keyCodeEscape = 27;

var timer;

export default ComponentMdl.extend({
    classNames: ['my-suggestions-body'],
    liveQuery: '',
    suggestions: null,
    showSuggestions: false,
    showAutoComplete: function () {
        return this.get('showSuggestions') && this.get('suggestions.length');
    }.property('showSuggestions', 'suggestions.length'),
    updateShowSuggestions: function () {
        this.set('showSuggestions', !this.get('liveQuery'));
    }.observes('liveQuery'),
    keyDown: function (event) {
        if (event.keyCode === keyCodeUp) {
            this.selectAdjacent(function (selectedIndex) {
                return selectedIndex - 1;
            });

            event.preventDefault();
        } else if (event.keyCode === keyCodeDown) {
            this.selectAdjacent(function (selectedIndex) {
                return selectedIndex + 1;
            });

            event.preventDefault();
        } else if (event.keyCode === keyCodeEscape) {
            this.hideSuggestions();
        }
    },
    selectAdjacent: function (getAdjacentIndex) {
        var suggestions = this.get('suggestions'),
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
    willDestroyElement: function () {
        Ember.run.cancel(timer);
    },
    hideSuggestions: function () {
        var selectedSuggestion = this.get('suggestions').findBy('isSelected');

        if (selectedSuggestion) {
            selectedSuggestion.set('isSelected', false);
        }

        this.set('showSuggestions', false);
    },
    actions: {
        searchSelected: function () {
            var suggestions = this.get('suggestions'),
                selectedSuggestion = suggestions.findBy('isSelected');

            if (selectedSuggestion) {
                this.set('liveQuery', selectedSuggestion.get('value'));
            }

            this.hideSuggestions();

            this.sendAction('search');
        },
        searchSuggestion: function (suggestion) {
            this.set('liveQuery', suggestion.get('value'));

            this.hideSuggestions();

            this.sendAction('search');
        },
        didFocusOut: function () {
            if (!this.$('.my-autocomplete:hover').length) {
                this.hideSuggestions();
            }
        }
    }
});
