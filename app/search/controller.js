import Ember from 'ember';
import domainData from 'domain-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

const maxSuggestions = 10;

export default Ember.Controller.extend({
    application: Ember.inject.controller(),
    query: null,
    hasQuery: Ember.computed('query', function() {
        return this.get('query') !== null;
    }),
    value: '',
    suggestions: [],
    searching: null,
    updateSuggestions: Ember.observer('value', function() {
        let value = this.get('value');

        if (value) {
            let url = domainData.suggestName + '/complete/search?client=firefox&ds=yt&q=' + value,
                promise = Ember.$.getJSON(url),
                searching;

            promise = connection.resolve(function() {
                return Ember.$.getJSON(url).then(function(response) {
                    let suggestions = [];

                    response[1].any(function(suggestion) {
                        suggestions.pushObject(Suggestion.create({
                            value: suggestion
                        }));

                        return suggestions.get('length') >= maxSuggestions;
                    });

                    return suggestions;
                });
            }, function() {
                let suggestions = [];

                this.peek('track', suggestions);
                this.peek('playlist', suggestions);

                return suggestions;
            }.bind(this)).then(function(suggestions) {
                this.set('suggestions', suggestions);
            }.bind(this));

            searching = logic.ObjectPromiseProxy.create({
                promise: promise
            });

            this.set('searching', searching);
        }
    }),
    peek: function(modelName, suggestions) {
        let value = this.get('value');

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
            let value = this.get('value');

            if (this.get('query') === value) {
                return true;
            } else {
                this.set('query', value);
            }
        }
    }
});
