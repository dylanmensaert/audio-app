import Ember from 'ember';
import meta from 'meta-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';
import albumActionsMixin from 'audio-app/recording/actions-mixin';

var suggestionLimit = 10;

export default Ember.Controller.extend(controllerMixin, recordingActionsMixin, albumActionsMixin, {
    audioPlayer: Ember.inject.service(),
    cache: Ember.inject.service(),
    queryParams: ['query'],
    updateLiveQuery: function() {
        this.set('liveQuery', this.get('query'));
    }.observes('query'),
    liveQuery: '',
    query: '',
    suggestions: [],
    updateSuggestions: function() {
        var suggestions = this.get('suggestions');

        suggestions.clear();

        if (!Ember.isEmpty(this.get('liveQuery'))) {
            this.pushOfflineSuggestions('recording');
            this.pushOfflineSuggestions('album');

            if (!this.get('cache.searchDownloadedOnly') && this.get('suggestions.length') < suggestionLimit) {
                this.pushOnlineSuggestions();
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
        var liveQuery = this.get('liveQuery'),
            url;

        url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + liveQuery;

        Ember.$.getJSON(url).then(function(response) {
            var suggestions = this.get('suggestions');

            response[1].any(function(suggestion) {
                suggestions.pushObject(Suggestion.create({
                    value: suggestion
                }));

                return suggestions.get('length') >= suggestionLimit;
            });
        }.bind(this));
    },
    showNotFound: function() {
        return !this.get('isLoading') && !this.get('recordings.length') && !this.get('albums.length');
    }.property('isLoading', 'recordings.length', 'albums.length'),
    isLoading: function() {
        return this.get('recordings.isPending') || this.get('albums.isPending');
    }.property('recordings.isPending', 'albums.isPending'),
    find: function(type) {
        var query = {
            maxResults: 4,
            query: this.get('query')
        };

        return this._super(type, query, !this.get('cache.searchDownloadedOnly'));
    },
    recordings: function() {
        return this.find('recording');
    }.property('query', 'cache.searchDownloadedOnly'),
    albums: function() {
        return this.find('album');
    }.property('query', 'cache.searchDownloadedOnly'),
    sortedRecordings: Ember.computed.sort('recordings', function(snippet, other) {
        return this.sortSnippet(this.get('recordings'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    sortedAlbums: Ember.computed.sort('albums', function(snippet, other) {
        return this.sortSnippet(this.get('albums'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    selectedRecordings: function() {
        return this.get('store').peekAll('recording').filterBy('isSelected');
    }.property('recordings.@each.isSelected'),
    selectedAlbums: function() {
        return this.get('store').peekAll('album').filterBy('isSelected');
    }.property('albums.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('recordings.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('recordings.length'),*/
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
        deselectAlbums: function(recording) {
            if (recording.get('isSelected')) {
                this.get('selectedAlbums').setEach('isSelected', false);
            }
        },
        deselectRecordings: function(album) {
            if (album.get('isSelected')) {
                this.get('selectedRecordings').setEach('isSelected', false);
            }
        }
    }
});
