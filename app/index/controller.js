import Ember from 'ember';
import meta from 'meta-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import searchMixin from 'audio-app/mixins/search';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';

var suggestionLimit = 10;

export default Ember.Controller.extend(controllerMixin, searchMixin, recordingActionsMixin, {
    audioPlayer: Ember.inject.service(),
    queryParams: ['query', 'isSearchMode'],
    updateLiveQuery: function() {
        this.set('liveQuery', this.get('query'));
    }.observes('query'),
    liveQuery: '',
    query: '',
    suggestions: null,
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
    // TODO: DO SAME FOR ALBUMS AND DELETE OTHER CODE + TEST
    find: function(type) {
        var query = {
            maxResults: 4,
            query: this.get('query')
        };

        return this._super(type, query);
    },
    recordings: function() {
        return this.find('recording');
    }.property('query', 'cache.searchDownloadedOnly'),
    albums: function() {
        return this.find('album');
    }.property('query', 'cache.searchDownloadedOnly'),
    sortedRecordings: Ember.computed.sort('recordings', function(snippet, other) {
        return this.sortSnippet(this.get('recordings'), snippet, other);
    }),
    sortedAlbums: Ember.computed.sort('albums', function(snippet, other) {
        return this.sortSnippet(this.get('albums'), snippet, other);
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
    isSearchMode: false,
    actions: {
        search: function() {
            this.set('query', this.get('liveQuery'));
        },
        pushToDownload: function(recording) {
            var cache = this.get('cache');

            if (!recording.get('isDownloaded')) {
                if (!cache.isMobileConnection()) {
                    recording.download().then(function() {

                    }, function() {
                        // TODO: show error?
                        cache.showMessage('download aborted');
                    });
                } else {
                    this.get('fileSystem.albums').findBy('name', 'Download later').get('recordingIds').pushObject(recording.get('id'));
                }
            } else {
                cache.showMessage('already downloaded');
            }
        },
        pushToQueue: function(recording) {
            var queue = this.get('fileSystem.albums').findBy('name', 'Queue').get('recordingIds'),
                cache = this.get('cache');

            if (!queue.contains(recording.get('id'))) {
                if (!recording.get('isDownloaded')) {
                    recording.download().then(function() {}, function() {
                        // TODO: show error?
                        cache.showMessage('Download aborted');
                    }.bind(this));
                }

                this.get('fileSystem.queue').pushObject(recording.get('id'));

                cache.showMessage('Added to queue');
            } else {
                cache.showMessage('Already in queue');
            }
        },
        selectAll: function() {
            this.get('recordings').setEach('isSelected', true);
        },
        clear: function() {
            this.set('liveQuery', '');

            Ember.$('.mdl-textfield__input').focus();
        },
        startSearchMode: function() {
            this.set('isSearchMode', true);
        },
        endSearchMode: function() {
            this.set('isSearchMode', false);
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
