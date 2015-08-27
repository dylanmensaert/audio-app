import Ember from 'ember';
import meta from 'meta-data';
import Recording from 'audio-app/audio-recording/object';
import Suggestion from 'audio-app/audio-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/utils/controller-mixin';
import recordingActionsMixin from 'audio-app/audio-recording/actions-mixin';

var convertImageUrl = function (url) {
    return meta.imageHost + new URL(url).pathname;
};

export default Ember.Controller.extend(controllerMixin, recordingActionsMixin, {
    queryParams: ['query', 'isSearchMode'],
    didScrollToBottom: function () {
        return function () {
            this.updateOnlineRecordings(this.get('nextPageToken'));
        }.bind(this);
    }.property('nextPageToken'),
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
    onlineSuggestions: [],
    updateOnlineSuggestions: function () {
        var liveQuery = this.get('liveQuery'),
            url;

        if (!this.get('searchDownloadedOnly') && !Ember.isEmpty(liveQuery)) {
            url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + liveQuery;

            Ember.$.getJSON(url).then(function (response) {
                this.set('onlineSuggestions', response[1]);
            }.bind(this));
        }
    }.observes('searchDownloadedOnly', 'liveQuery'),
    sortedRecordings: function () {
        return Ember.ArrayProxy.extend(Ember.SortableMixin, {
            content: this.get('recordings'),
            sortProperties: ['name', 'id'],
            orderBy: function (recording, other) {
                var recordings = this.get('recordings'),
                    result = -1;

                if (!this.get('searchDownloadedOnly')) {
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
    // TODO: save state in fileSystem someway
    searchDownloadedOnly: function () {
        return this.get('cache.isOffline') || (this.get('cache.isMobileConnection') && this.get('fileSystem.setDownloadedOnlyOnMobile'));
    }.property('cache.isOffline', 'cache.isMobileConnection', 'fileSystem.setDownloadedOnlyOnMobile'),
    recordings: function () {
        var recordings = this.get('offlineRecordings'),
            id;

        if (!this.get('searchDownloadedOnly')) {
            recordings = this.get('onlineRecordings').map(function (recording) {
                id = recording.get('id');

                if (recordings.isAny('id', id)) {
                    recording = recordings.findBy('id', id);
                }

                return recording;
            });
        }

        return recordings;
    }.property('offlineRecordings.[]', 'onlineRecordings.[]', 'searchDownloadedOnly'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('recordings.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('recordings.length'),*/
    offlineRecordings: function () {
        var searchDownloadedOnly = this.get('searchDownloadedOnly'),
            query = this.get('query');

        return this.get('fileSystem.recordings').filter(function (recording) {
            // TODO: create separate result for matchAnyAlbum
            return (!searchDownloadedOnly || recording.get('isDownloaded')) && logic.isMatch(recording.get('name'), query);
        });
    }.property('query', 'fileSystem.recordings.isDownloaded', 'searchDownloadedOnly'),
    nextPageToken: null,
    isLoading: false,
    onlineRecordings: [],
    updateOnlineRecordings: function (nextPageToken) {
        var recordings = [],
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

            Ember.$.getJSON(url).then(function (response) {
                recordings = response.items.map(function (item) {
                    return Recording.create({
                        id: item.id.videoId,
                        name: item.snippet.title,
                        extension: 'mp3',
                        thumbnail: convertImageUrl(item.snippet.thumbnails.high.url),
                        // TODO: Remove if possible
                        fileSystem: this.get('fileSystem')
                    });
                }.bind(this));

                if (Ember.isEmpty(nextPageToken)) {
                    this.set('onlineRecordings', recordings);
                } else {
                    this.get('onlineRecordings').pushObjects(recordings);
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
            this.set('onlineRecordings', recordings);
        }
    },
    scheduleUpdateOnlineRecordings: function () {
        Ember.run.once(this, this.updateOnlineRecordings);
    }.observes('query', 'searchDownloadedOnly'),
    /*TODO: Implement another way?*/
    updateSelectedRecordings: function () {
        var selectedRecordings = this.get('recordings').filterBy('isSelected');

        this.set('cache.selectedRecordings', selectedRecordings);
    }.observes('recordings.@each.isSelected'),
    originals: Ember.computed.alias('fileSystem.recordings'),
    selected: Ember.computed.alias('cache.selectedRecordings'),
    isSearchMode: false,
    actions: {
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
                  this.get('fileSystem.albums').findBy('name', 'Download later').pushObject(recording.get('id'));
                }
            } else {
                cache.showMessage('already downloaded');
            }
        },
        pushToQueue: function (recording) {
            var queue = this.get('fileSystem.queue'),
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
