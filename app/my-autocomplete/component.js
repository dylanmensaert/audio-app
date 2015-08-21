import Ember from 'ember';
import MyMdlComponent from 'audio-app/components/my-mdl';

var keyCodeUp = 38,
    keyCodeDown = 40,
    keyCodeEnter = 13,
    keyCodeEscape = 27;

export default MyMdlComponent.extend({
    classNames: ['mdl-textfield', 'mdl-js-textfield'],
    liveQuery: '',
    suggestions: null,
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
        }

        if (event.keyCode === keyCodeEnter) {
            this.sendAction('updateSuggestions');
        }

        if (event.keyCode === keyCodeEscape) {
            this.get('suggestions').clear();
        }
    },
    selectAdjacent: function (getAdjacentIndex) {
        var suggestions = this.get('suggestions'),
            selectedSuggestion,
            selectedIndex,
            adjacentSuggestion;

        if (suggestions.get('length')) {
            selectedSuggestion = suggestions.findBy('isSelected');

            if (Ember.isEmpty(selectedSuggestion)) {
                suggestions.get('firstObject').set('isSelected', true);
            } else {
                selectedIndex = suggestions.indexOf(selectedSuggestion);
                adjacentSuggestion = suggestions.objectAt(getAdjacentIndex(selectedIndex));

                if (!Ember.isEmpty(adjacentSuggestion)) {
                    adjacentSuggestion.set('isSelected', true);
                }

                selectedSuggestion.set('isSelected', false);
            }
        } else {
            this.send('searchSelected');
        }
    },
    actions: {
        searchSelected: function () {
            var suggestions = this.get('suggestions'),
                selectedSuggestion = suggestions.findBy('isSelected');

            if (!Ember.isEmpty(selectedSuggestion)) {
                this.set('liveQuery', selectedSuggestion.get('value'));
            }

            suggestions.clear();

            this.sendAction('action');
        },
        searchSuggestion: function (suggestion) {
            this.set('liveQuery', suggestion.get('value'));

            this.get('suggestions').clear();

            this.sendAction('action');
        }
    }
});
