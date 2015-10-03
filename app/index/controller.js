import Ember from 'ember';
import meta from 'meta-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';
import collectionActionsMixin from 'audio-app/collection/actions-mixin';

var suggestionLimit = 10;

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, collectionActionsMixin, {
    queryParams: ['query'],
    updateLiveQuery: function() {
        this.set('liveQuery', this.get('query'));
    }.observes('query'),
    liveQuery: '',
    query: '',
    suggestions: [],
    hideMdlHeader: function() {
        return this.get('cache.hasPreviousTransition') || this.get('isEditMode');
    }.property('cache.hasPreviousTransition', 'isEditMode'),
    showActionButton: function() {
        return this.get('liveQuery') || this.get('editedCollectionName');
    }.property('liveQuery', 'editedCollectionName'),
    updateSuggestions: function() {
        var liveQuery = this.get('liveQuery'),
            suggestions,
            url;

        this.set('suggestions', []);

        suggestions = this.get('suggestions');

        if (!Ember.isEmpty(liveQuery)) {
            this.pushOfflineSuggestions('track');
            this.pushOfflineSuggestions('collection');

            if (!this.get('cache.searchDownloadedOnly') && suggestions.get('length') < suggestionLimit) {
                url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + liveQuery;

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
    }.observes('liveQuery', 'cache.searchDownloadedOnly'),
    pushOfflineSuggestions: function(modelName) {
        var liveQuery = this.get('liveQuery'),
            suggestions = this.get('suggestions');

        this.get('store').peekAll(modelName).any(function(snippet) {
            var suggestion = snippet.get('name');

            if (logic.isMatch(suggestion, liveQuery)) {
                suggestions.pushObject(Suggestion.create({
                    value: suggestion
                }));
            }

            return suggestions.get('length') >= suggestionLimit;
        });
    },
    pushOnlineSuggestions: function() {

    },
    showNotFound: function() {
        return !this.get('isLoading') && !this.get('tracks.length') && !this.get('collections.length');
    }.property('isLoading', 'tracks.length', 'collections.length'),
    isLoading: function() {
        return this.get('tracks.isPending') || this.get('collections.isPending');
    }.property('tracks.isPending', 'collections.isPending'),
    find: function(type) {
        var query = {
            maxResults: 4,
            query: this.get('query')
        };

        return this._super(type, query, !this.get('cache.searchDownloadedOnly'));
    },
    tracks: function() {
        return this.find('track');
    }.property('query', 'cache.searchDownloadedOnly'),
    collections: function() {
        return this.find('collection');
    }.property('query', 'cache.searchDownloadedOnly'),
    sortedTracks: Ember.computed.sort('tracks', function(track, other) {
        return this.sortSnippet(this.get('tracks'), track, other, !this.get('cache.searchDownloadedOnly'));
    }),
    sortedCollections: Ember.computed.sort('collections', function(collection, other) {
        return this.sortSnippet(this.get('collections'), collection, other, !this.get('cache.searchDownloadedOnly'));
    }),
    selectedTracks: function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }.property('tracks.@each.isSelected'),
    selectedCollections: function() {
        return this.get('store').peekAll('collection').filterBy('isSelected');
    }.property('collections.@each.isSelected'),
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
            if (track.get('isSelected')) {
                this.get('selectedCollections').setEach('isSelected', false);
            }
        },
        deselectTracks: function(collection) {
            if (collection.get('isSelected')) {
                this.get('selectedTracks').setEach('isSelected', false);
            }
        }
    }
});
