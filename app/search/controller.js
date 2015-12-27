import Ember from 'ember';
import DS from 'ember-data';
import domainData from 'domain-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';

const suggestionLimit = 10;

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    queryParams: ['query'],
    updateLiveQuery: Ember.observer('query', function() {
        var query = this.get('query');

        if(query) {
            this.set('liveQuery', query);
        }
    }),
    liveQuery: '',
    query: null,
    suggestions: [],
    hideMdlHeader: Ember.computed('selectedTracks.length', 'selectedCollections.length', function() {
        return this.get('selectedTracks.length') || this.get('selectedCollections.length');
    }),
    updateSuggestions: Ember.observer('liveQuery', function() {
        var liveQuery = this.get('liveQuery'),
            suggestions,
            url;

        this.set('suggestions', []);

        suggestions = this.get('suggestions');

        if(liveQuery) {
            this.pushOfflineSuggestions('track');
            this.pushOfflineSuggestions('collection');

            if(!this.get('cache').getIsOfflineMode() && suggestions.get('length') < suggestionLimit) {
                url = domainData.suggestName + '/complete/search?client=firefox&ds=yt&q=' + liveQuery;

                Ember.$.getJSON(url).then(function(response) {
                    response[1].any(function(suggestion) {
                        suggestions.pushObject(Suggestion.create({
                            value: suggestion
                        }));

                        return suggestions.get('length') >= suggestionLimit;
                    });
                }.bind(this));
            }
        }
    }),
    pushOfflineSuggestions: function(modelName) {
        var liveQuery = this.get('liveQuery'),
            suggestions = this.get('suggestions');

        this.get('store').peekAll(modelName).any(function(snippet) {
            var suggestion = snippet.get('name');

            if(!snippet.get('permission') && logic.isMatch(suggestion, liveQuery)) {
                suggestions.pushObject(Suggestion.create({
                    value: Ember.String.decamelize(suggestion)
                }));
            }

            return suggestions.get('length') >= suggestionLimit;
        });
    },
    showNotFound: Ember.computed('isLoading', 'tracks.length', 'collections.length', function() {
        return !this.get('isLoading') && !this.get('tracks.length') && !this.get('collections.length');
    }),
    isLoading: Ember.computed('tracks.isPending', 'collections.isPending', function() {
        return this.get('tracks.isPending') || this.get('collections.isPending');
    }),
    find: function(type) {
        var query = this.get('query'),
            options,
            promise,
            promiseArray;

        if(query !== null) {
            options = {
                maxResults: 50,
                query: query
            };

            promise = new Ember.RSVP.Promise(function(resolve) {
                this._super(type, options, !this.get('cache').getIsOfflineMode()).then(function(snippets) {
                    resolve(logic.getTopRecords(snippets, 4));
                });
            }.bind(this));

            promiseArray = DS.PromiseArray.create({
                promise: promise
            });
        }

        return promiseArray;
    },
    tracks: Ember.computed('query', function() {
        return this.find('track');
    }),
    collections: Ember.computed('query', function() {
        return this.find('collection');
    }),
    sortedTracks: Ember.computed.sort('tracks', function(track, other) {
        return this.sortSnippet(this.get('tracks'), track, other, !this.get('cache').getIsOfflineMode());
    }),
    sortedCollections: Ember.computed.sort('collections', function(collection, other) {
        return this.sortSnippet(this.get('collections'), collection, other, !this.get('cache').getIsOfflineMode());
    }),
    selectedTracks: Ember.computed('tracks.@each.isSelected', function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }),
    selectedCollections: Ember.computed('collections.@each.isSelected', function() {
        return this.get('store').peekAll('collection').filterBy('isSelected');
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('tracks.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('tracks.length'),*/
    // TODO: implement isLoading correctly since removed from snippets fetch
    /*isLoading: false,*/
    /*TODO: Implement another way?*/
    actions: {
        search: function() {
            this.set('query', this.get('liveQuery'));
        },
        clear: function() {
            this.set('liveQuery', '');

            Ember.$('.mdl-textfield__input').focus();
        },
        deselectCollections: function(track) {
            if(track.get('isSelected')) {
                this.get('selectedCollections').setEach('isSelected', false);
            }
        },
        deselectTracks: function(collection) {
            if(collection.get('isSelected')) {
                this.get('selectedTracks').setEach('isSelected', false);
            }
        }
    }
});
