import Ember from 'ember';
import domainData from 'domain-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

const suggestionLimit = 10;

export default Ember.Controller.extend({
    updateValue: Ember.observer('query', function () {
        var query = this.get('query');

        if (query) {
            this.set('value', query);
        }
    }),
    value: '',
    query: null,
    suggestions: [],
    updateSuggestions: Ember.observer('value', function () {
        var value = this.get('value'),
            suggestions,
            url;

        this.set('suggestions', []);

        suggestions = this.get('suggestions');

        if (value) {
            this.pushOfflineSuggestions('track');
            this.pushOfflineSuggestions('collection');

            if (!connection.isMobile() && suggestions.get('length') < suggestionLimit) {
                url = domainData.suggestName + '/complete/search?client=firefox&ds=yt&q=' + value;

                Ember.$.getJSON(url).then(function (response) {
                    response[1].any(function (suggestion) {
                        suggestions.pushObject(Suggestion.create({
                            value: suggestion
                        }));

                        return suggestions.get('length') >= suggestionLimit;
                    });
                }.bind(this));
            }
        }
    }),
    pushOfflineSuggestions: function (modelName) {
        var value = this.get('value'),
            suggestions = this.get('suggestions');

        this.get('store').peekAll(modelName).any(function (snippet) {
            var suggestion = snippet.get('name');

            if (!snippet.get('permission') && logic.isMatch(suggestion, value)) {
                suggestions.pushObject(Suggestion.create({
                    value: Ember.String.decamelize(suggestion)
                }));
            }

            return suggestions.get('length') >= suggestionLimit;
        });
    },
    showMenu: true,
    actions: {
        search: function () {
            this.set('query', this.get('value'));

            this.set('showMenu', true);
        },
        didFocusOut: function () {
            this.set('value', this.get('query'));

            this.set('showMenu', true);
        },
        hideMenu: function () {
            this.set('showMenu', false);
        }
    }
});
