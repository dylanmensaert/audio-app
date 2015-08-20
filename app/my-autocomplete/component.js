import Ember from 'ember';
import MyMdlComponent from 'audio-app/components/my-mdl';

export default MyMdlComponent.extend({
    classNames: ['mdl-textfield', 'mdl-js-textfield'],
    liveQuery: '',
    suggestions: null,
    keyDown: function (event) {
      if(event.keyCode === 38) {
          this.selectAdjacent(function (selectedIndex) {
                return selectedIndex - 1;
          });
      } else if(event.keyCode === 40) {
           this.selectAdjacent(function (selectedIndex) {
              return selectedIndex + 1;
          });
      }

      if(event.keyCode === 13) {
          this.sendAction('updateSuggestions');
      }

      if(event.keyCode === 27) {
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
          this.send('searchSelected')
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
