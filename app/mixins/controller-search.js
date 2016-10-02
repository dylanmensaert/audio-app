import Ember from 'ember';
import domainData from 'domain-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import connection from 'connection';
import findControllerMixin from 'audio-app/mixins/controller-find';

const maxSuggestions = 10;

export default Ember.Mixin.create(findControllerMixin, {
    queryParams: ['query'],
    query: null,
    value: '',
    updateValue: Ember.observer('query', function() {
        let value = this.get('query');

        if (!value) {
            value = '';
        }

        this.set('value', value);
    }),
    setOptions: function(options) {
        options.query = this.get('query');
    },
    resetController: Ember.observer('query', function() {
        this.reset();
    }),
    suggestions: [],
    updateSuggestions: Ember.observer('value', function() {
        let value = this.get('value'),
            suggestions = [];

        this.set('suggestions', suggestions);

        if (value) {
            this.peek('track');
            this.peek('collection');

            if (connection.isOnline() && suggestions.get('length') < maxSuggestions) {
                let url = domainData.suggestName + '/complete/search?client=firefox&ds=yt&q=' + value;

                Ember.$.getJSON(url).then(function(response) {
                    response[1].any(function(suggestion) {
                        suggestions.pushObject(Suggestion.create({
                            value: suggestion
                        }));

                        return suggestions.get('length') >= maxSuggestions;
                    });
                }.bind(this));
            }
        }
    }),
    peek: function(modelName) {
        let value = this.get('value'),
            suggestions = this.get('suggestions');

        this.store.peekAll(modelName).any(function(snippet) {
            let suggestion = snippet.get('name');

            if (!snippet.get('permission') && logic.isMatch(suggestion, value)) {
                suggestions.pushObject(Suggestion.create({
                    value: Ember.String.decamelize(suggestion)
                }));
            }

            return suggestions.get('length') >= maxSuggestions;
        });
    },
    actions: {
        search: function() {
            this.set('query', this.get('value'));
        }
    }
});
