import Ember from 'ember';
import MyMdlComponent from 'audio-app/components/my-mdl';

var keyCodeUp = 38,
    keyCodeDown = 40,
    keyCodeEscape = 27;

export default MyMdlComponent.extend({
    classNames: ['mdl-textfield', 'mdl-js-textfield'],
    liveQuery: '',
    suggestions: null,
    showSuggestions: false,
    showAutoComplete: function () {
        return this.get('showSuggestions') && this.get('suggestions.length');
    }.property('showSuggestions', 'suggestions.length'),
    updateShowSuggestions: function () {
        this.set('showSuggestions', !Ember.isEmpty(this.get('liveQuery')));
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
            selectedIndex,
            adjacentSuggestion;

        if (suggestions.get('length')) {
            selectedSuggestion = suggestions.findBy('isSelected');

            if (Ember.isEmpty(selectedSuggestion)) {
                suggestions.get('firstObject').set('isSelected', true);

                this.set('showSuggestions', true);
            } else {
                selectedIndex = suggestions.indexOf(selectedSuggestion);
                adjacentSuggestion = suggestions.objectAt(getAdjacentIndex(selectedIndex));

                if (Ember.isEmpty(adjacentSuggestion)) {
                    this.hideSuggestions();
                } else {
                    adjacentSuggestion.set('isSelected', true);
                }
            }
        } else {
            this.send('searchSelected');
        }
    },
    // TODO: improve logic by setting isSelected false when showSuggestions is true after false
    hideSuggestions: function () {
        var selectedSuggestion = this.get('suggestions').findBy('isSelected');

        if (!Ember.isEmpty(selectedSuggestion)) {
            selectedSuggestion.set('isSelected', false);
        }

        this.set('showSuggestions', false);
    },
    actions: {
        searchSelected: function () {
            var suggestions = this.get('suggestions'),
                selectedSuggestion = suggestions.findBy('isSelected');

            if (!Ember.isEmpty(selectedSuggestion)) {
                this.set('liveQuery', selectedSuggestion.get('value'));
            }

            this.hideSuggestions();

            this.sendAction('action');
        },
        searchSuggestion: function (suggestion) {
            this.set('liveQuery', suggestion.get('value'));

            this.hideSuggestions();

            this.sendAction('action');
        },
        hideSuggestions: function () {
            this.hideSuggestions();
        }
    }
});
