import Ember from 'ember';
import meta from 'meta-data';
import Snippet from 'audio-app/snippet/object';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/utils/controller-mixin';
import snippetActionsMixin from 'audio-app/snippet/actions-mixin';

var convertImageUrl = function(url) {
    return meta.imageHost + new URL(url).pathname;
};

export default Ember.Controller.extend(controllerMixin, snippetActionsMixin, {
    didScrollToBottom: function() {
        return function() {
            this.updateOnlineSnippets(this.get('nextPageToken'));
        }.bind(this);
    }.property('nextPageToken'),
    fetchSuggestions: function() {
        var url,
            lastQuery;

        return function(query, callback) {
            var suggestions = [],
                key;

            lastQuery = query;

            this.get('fileSystem.labels').forEach(function(label) {
                key = label.get('name');

                if (!label.get('isHidden') && logic.isMatch(key, query)) {
                    suggestions.pushObject({
                        value: key
                    });
                }
            });

            this.get('fileSystem.snippets').forEach(function(snippet) {
                key = snippet.get('name');

                if (logic.isMatch(key, query)) {
                    suggestions.pushObject({
                        value: key
                    });
                }
            });

            callback(suggestions);

            if (!this.get('searchDownloadedOnly') && suggestions.get('length') < 10) {
                url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + query;

                (function(oldQuery) {
                    Ember.$.getJSON(url).then(function(response) {
                        if (oldQuery === lastQuery) {
                            response[1].forEach(function(suggestion) {
                                if (!suggestions.isAny('value', suggestion)) {
                                    suggestions.pushObject({
                                        value: suggestion
                                    });
                                }
                            });

                            callback(suggestions);
                        }
                    });
                })(lastQuery);
            }
        }.bind(this);
    }.property('searchDownloadedOnly', 'fileSystem.snippets.@each.name'),
    sortedSnippets: function() {
        return Ember.ArrayProxy.extend(Ember.SortableMixin, {
            content: this.get('snippets'),
            sortProperties: ['name', 'id'],
            orderBy: function(snippet, other) {
                var snippets = this.get('snippets'),
                    result = -1;

                if (!this.get('searchDownloadedOnly')) {
                    if (snippets.indexOf(snippet) > snippets.indexOf(other)) {
                        result = 1;
                    }
                } else if (snippet.get('name') > other.get('name')) {
                    result = 1;
                }

                return result;
            }.bind(this)
        }).create();
    }.property('snippets.[]', 'offlineSnippets.@each.id'),
    // TODO: save label state in fileSystem someway
    searchDownloadedOnly: function() {
        return this.get('cache.isOffline') || (this.get('cache.isMobileConnection') && this.get('fileSystem.setDownloadedOnlyOnMobile'));
    }.property('cache.isOffline', 'cache.isMobileConnection', 'fileSystem.setDownloadedOnlyOnMobile'),
    snippets: function() {
        var snippets = this.get('offlineSnippets'),
            id;

        if (!this.get('searchDownloadedOnly')) {
            snippets = this.get('onlineSnippets').map(function(snippet) {
                id = snippet.get('id');

                if (snippets.isAny('id', id)) {
                    snippet = snippets.findBy('id', id);
                }

                return snippet;
            });
        }

        return snippets;
    }.property('offlineSnippets.[]', 'onlineSnippets.[]', 'searchDownloadedOnly'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('snippets.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('snippets.length'),*/
    offlineSnippets: function() {
        var searchDownloadedOnly = this.get('searchDownloadedOnly'),
            query = this.get('query'),
            matchAnyLabel;

        return this.get('fileSystem.snippets').filter(function(snippet) {
            // TODO: create separate result for matchAnyLabel
            matchAnyLabel = snippet.get('labels').any(function(label) {
                return logic.isMatch(label, query);
            });

            return (!searchDownloadedOnly || snippet.get('isDownloaded')) && (matchAnyLabel || logic.isMatch(snippet.get('name'), query));
        });
    }.property('query', 'fileSystem.snippets.@each.name', 'searchDownloadedOnly'),
    nextPageToken: null,
    isLoading: false,
    onlineSnippets: [],
    updateOnlineSnippets: function(nextPageToken) {
        var snippets = [],
            url;

        if (!this.get('searchDownloadedOnly')) {
            url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
            this.set('isLoading', true);

            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            url += '&key=' + meta.key;
            url += '&q=' + this.get('query');

            if (!Ember.isEmpty(nextPageToken)) {
                url += '&pageToken=' + nextPageToken;
            }

            Ember.$.getJSON(url).then(function(response) {
                snippets = response.items.map(function(item) {
                    return Snippet.create({
                        id: item.id.videoId,
                        name: item.snippet.title,
                        extension: 'mp3',
                        thumbnail: convertImageUrl(item.snippet.thumbnails.high.url),
                        // TODO: Remove if possible
                        fileSystem: this.get('fileSystem')
                    });
                }.bind(this));

                if (Ember.isEmpty(nextPageToken)) {
                    this.set('onlineSnippets', snippets);
                } else {
                    this.get('onlineSnippets').pushObjects(snippets);
                }

                if (Ember.isEmpty(response.nextPageToken)) {
                    nextPageToken = null;
                } else {
                    nextPageToken = response.nextPageToken;
                }

                this.set('nextPageToken', nextPageToken);

                this.set('isLoading', false);
            }.bind(this));
        } else {
            this.set('onlineSnippets', snippets);
        }
    },
    scheduleUpdateOnlineSnippets: function() {
        Ember.run.once(this, this.updateOnlineSnippets);
    }.observes('query', 'searchDownloadedOnly'),
    /*TODO: Implement another way?*/
    updateSelectedSnippets: function() {
        var selectedSnippets = this.get('snippets').filterBy('isSelected');

        this.set('cache.selectedSnippets', selectedSnippets);
    }.observes('snippets.@each.isSelected'),
    originals: Ember.computed.alias('fileSystem.snippets'),
    selected: Ember.computed.alias('cache.selectedSnippets'),
    actions: {
        pushToDownload: function(snippet) {
            var cache = this.get('cache');

            if (!snippet.get('isDownloaded')) {
                if (!cache.isMobileConnection()) {
                    snippet.download().then(function() {

                    }, function() {
                        // TODO: show error?
                        cache.showMessage('download aborted');
                    });
                } else {
                    snippet.get('labels').pushObject('download-later');
                }
            } else {
                cache.showMessage('already downloaded');
            }
        },
        pushToQueue: function(snippet) {
            var queue = this.get('fileSystem.queue'),
                cache = this.get('cache');

            if (!queue.contains(snippet.get('id'))) {
                if (!snippet.get('isDownloaded')) {
                    snippet.download().then(function() {}, function() {
                        // TODO: show error?
                        cache.showMessage('Download aborted');
                    }.bind(this));
                }

                this.get('fileSystem.queue').pushObject(snippet.get('id'));

                cache.showMessage('Added to queue');
            } else {
                cache.showMessage('Already in queue');
            }
        },
        selectAll: function() {
            this.get('snippets').setEach('isSelected', true);
        }
    }
});
