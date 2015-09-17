import Ember from 'ember';
import meta from 'meta-data';
import Suggestion from 'audio-app/components/c-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import searchMixin from 'audio-app/mixins/search';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, searchMixin, recordingActionsMixin, {
    audioPlayer: Ember.inject.service(),
    queryParams: ['query', 'isSearchMode'],
    updateLiveQuery: function () {
        this.set('liveQuery', this.get('query'));
    }.observes('query'),
    liveQuery: '',
    query: '',
    suggestions: function () {
        var suggestions = this.get('offlineSuggestions');

        this.get('onlineSuggestions').any(function (suggestion) {
            var doBreak = suggestions.get('length') >= 10;

            if (!doBreak) {
                if (!suggestions.contains(suggestion)) {
                    suggestions.pushObject(Suggestion.create({
                        value: suggestion
                    }));
                }
            }

            return doBreak;
        });

        return suggestions;
    }.property('offlineSuggestions.[]', 'onlineSuggestions.[]'),
    offlineSuggestions: function () {
        var liveQuery = this.get('liveQuery'),
            suggestions = [],
            suggestion;

        if (!Ember.isEmpty(liveQuery)) {
            this.get('fileSystem.albums').any(function (album) {
                var doBreak = suggestions.get('length') >= 10;

                if (!doBreak) {
                    suggestion = album.get('name');

                    if (logic.isMatch(suggestion, liveQuery)) {
                        suggestions.pushObject(Suggestion.create({
                            value: suggestion
                        }));
                    }
                }

                return doBreak;
            });

            this.get('fileSystem.recordings').any(function (recording) {
                var doBreak = suggestions.get('length') >= 10;

                if (!doBreak) {
                    suggestion = recording.get('name');

                    if (logic.isMatch(suggestion, liveQuery)) {
                        suggestions.pushObject(Suggestion.create({
                            value: suggestion
                        }));
                    }
                }

                return doBreak;
            });
        }

        return suggestions;
    }.property('fileSystem.recordings.@each.name', 'fileSystem.albums.@each.name', 'liveQuery'),
    showNotFound: function () {
        return !this.get('isLoading') && !this.get('recordings.length') && !this.get('albums.length');
    }.property('isLoading', 'recordings', 'albums'),
    onlineSuggestions: [],
    updateOnlineSuggestions: function () {
        var liveQuery = this.get('liveQuery'),
            url;

        if (!this.get('cache.searchDownloadedOnly') && !Ember.isEmpty(liveQuery)) {
            url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + liveQuery;

            Ember.$.getJSON(url).then(function (response) {
                this.set('onlineSuggestions', response[1]);
            }.bind(this));
        }
    }.observes('cache.searchDownloadedOnly', 'liveQuery'),
    sortedRecordings: function () {
        return Ember.ArrayProxy.extend(Ember.SortableMixin, {
            content: this.get('recordings'),
            sortProperties: ['name', 'id'],
            orderBy: function (recording, other) {
                var recordings = this.get('recordings'),
                    result = -1;

                if (!this.get('cache.searchDownloadedOnly')) {
                    if (recordings.indexOf(recording) > recordings.indexOf(other)) {
                        result = 1;
                    }
                } else if (recording.get('name') > other.get('name')) {
                    result = 1;
                }

                return result;
            }.bind(this)
        }).create();
    }.property('recordings.[]', 'offlineRecordings.@each.id'),
    // TODO: DO SAME FOR ALBUMS AND DELETE OTHER CODE + TEST
    find: function (type, snippets) {
        this._super(type, snippets, {
            maxResults: 4,
            query: this.get('query'),
            nextPageToken: this.get('cache.nextPageToken'),
        });
    },
    recordings: function () {
        return this.find('recording', this.get('recordings'));
    }.property('query', 'cache.nextPageToken', 'cache.searchDownloadedOnly'),
    albums: function () {
        return this.find('album', this.get('albums'));
    }.property('query', 'cache.nextPageToken', 'cache.searchDownloadedOnly'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('recordings.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('recordings.length'),*/
    isLoading: false,
    /*TODO: Implement another way?*/
    updateSelectedRecordings: function () {
        var selectedRecordings = this.get('recordings').filterBy('isSelected');

        this.set('cache.selectedRecordings', selectedRecordings);
    }.observes('recordings.@each.isSelected'),
    originals: Ember.computed.alias('fileSystem.recordings'),
    selected: Ember.computed.alias('cache.selectedRecordings'),
    isSearchMode: false,
    actions: {
        search: function () {
            this.set('query', this.get('liveQuery'));
        },
        pushToDownload: function (recording) {
            var cache = this.get('cache');

            if (!recording.get('isDownloaded')) {
                if (!cache.isMobileConnection()) {
                    recording.download().then(function () {

                    }, function () {
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
        pushToQueue: function (recording) {
            var queue = this.get('fileSystem.albums').findBy('name', 'Queue').get('recordingIds'),
                cache = this.get('cache');

            if (!queue.contains(recording.get('id'))) {
                if (!recording.get('isDownloaded')) {
                    recording.download().then(function () {}, function () {
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
        selectAll: function () {
            this.get('recordings').setEach('isSelected', true);
        },
        clear: function () {
            this.set('liveQuery', '');

            Ember.$('.mdl-textfield__input').focus();
        },
        startSearchMode: function () {
            this.set('isSearchMode', true);
        },
        endSearchMode: function () {
            this.set('isSearchMode', false);
        }
    }
});
