import Ember from 'ember';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import searchMixin from 'audio-app/mixins/search';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, searchMixin, recordingActionsMixin, {
    queryParams: ['query'],
    query: '',
    didScrollToBottom: function () {
        return function () {
            this.updateOnlineRecordings(this.get('cache.nextPageToken'));
        }.bind(this);
    }.property('cache.nextPageToken'),
    showNotFound: function () {
        return !this.get('isLoading') && !this.get('recordings.length');
    }.property('isLoading', 'recordings'),
    // TODO: save state in fileSystem someway
    getSnippets: function (offlineProperty, onlineProperty) {
        var offlineSnippets = this.get(offlineProperty),
            snippets = [];

        if (this.get('cache.searchDownloadedOnly')) {
            snippets = offlineSnippets;
        } else {
            snippets = this.get(onlineProperty).map(function (snippet) {
                var id = snippet.get('id');

                if (offlineSnippets.isAny('id', id)) {
                    snippet = offlineSnippets.findBy('id', id);
                }

                return snippet;
            });
        }

        return snippets;
    },
    getOfflineSnippets: function (offlineSnippets) {
        var searchDownloadedOnly = this.get('cache.searchDownloadedOnly'),
            query = this.get('query');

        return this.get(offlineSnippets).filter(function (snippet) {
            // TODO: create separate result for matchAnyRecording
            return (!searchDownloadedOnly || snippet.get('isDownloaded')) && logic.isMatch(snippet.get('name'), query);
        });
    },
    recordings: function () {
        return this.getSnippets('offlineRecordings', 'onlineRecordings');
    }.property('offlineRecordings.[]', 'onlineRecordings.[]', 'cache.searchDownloadedOnly'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('recordings.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('recordings.length'),*/
    offlineRecordings: function () {
        return this.getOfflineSnippets('fileSystem.recordings');
    }.property('query', 'fileSystem.recordings.isDownloaded', 'cache.searchDownloadedOnly'),
    nextPageToken: null,
    isLoading: false,
    onlineRecordings: [],
    updateOnlineRecordings: function (nextPageToken) {
        var findRecordingsPromise = this.get('store').query('recording', {
            maxResults: 50,
            query: this.get('query'),
            nextPageToken: nextPageToken
        });

        this.updateOnlineSnippets(findRecordingsPromise, 'onlineRecordings', nextPageToken);
    },
    scheduleUpdateOnlineSnippets: function () {
        if (!this.get('cache.searchDownloadedOnly')) {
            Ember.run.once(this, this.updateOnlineRecordings);
        }
    }.observes('cache.searchDownloadedOnly').on('init'),
    /*TODO: Implement another way?*/
    updateSelectedRecordings: function () {
        var selectedRecordings = this.get('recordings').filterBy('isSelected');

        this.set('cache.selectedRecordings', selectedRecordings);
    }.observes('recordings.@each.isSelected'),
    isSearchMode: false,
    actions: {
        selectAll: function () {
            this.get('recordings').setEach('isSelected', true);
        }
    }
});
