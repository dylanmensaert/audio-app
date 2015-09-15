import Ember from 'ember';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';
import searchMixin from 'audio-app/mixins/search';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, searchMixin, recordingActionsMixin, {
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    queryParams: ['query'],
    query: '',
    showNotFound: function () {
        return !this.get('isLoading') && !this.get('albums.length');
    }.property('isLoading', 'albums'),
    // TODO: save state in fileSystem someway
    getSnippets: function (offlineProperty, onlineProperty) {
        var offlineSnippets = this.get(offlineProperty),
            snippets = [];

        if (this.get('searchDownloadedOnly')) {
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
        var searchDownloadedOnly = this.get('searchDownloadedOnly'),
            query = this.get('query');

        return this.get(offlineSnippets).filter(function (snippet) {
            // TODO: create separate result for matchAnyAlbum
            return (!searchDownloadedOnly || snippet.get('isDownloaded')) && logic.isMatch(snippet.get('name'), query);
        });
    },
    albums: function () {
        return this.getSnippets('offlineAlbums', 'onlineAlbums');
    }.property('offlineAlbums.[]', 'onlineAlbums.[]', 'searchDownloadedOnly'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('recordings.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('recordings.length'),*/
    offlineAlbums: function () {
        return this.getOfflineSnippets('fileSystem.albums');
    }.property('query', 'fileSystem.albums.isDownloaded', 'searchDownloadedOnly'),
    nextPageToken: null,
    isLoading: false,
    onlineAlbums: [],
    updateOnlineAlbums: function (nextPageToken) {
        var findAlbumsPromise = logic.findAlbums(5, this.get('query'), nextPageToken);

        this.updateOnlineSnippets(findAlbumsPromise, 'onlineAlbums', nextPageToken);
    },
    scheduleUpdateOnlineSnippets: function () {
        if (!this.get('searchDownloadedOnly')) {
            Ember.run.once(this, this.updateOnlineAlbums);
        }
    }.observes('searchDownloadedOnly').on('init'),
    /*TODO: Implement another way?*/
    updateSelectedRecordings: function () {
        var selectedRecordings = this.get('recordings').filterBy('isSelected');

        this.set('cache.selectedRecordings', selectedRecordings);
    }.observes('recordings.@each.isSelected'),
    isSearchMode: false,
    actions: {
        selectAll: function () {
            this.get('albums').setEach('isSelected', true);
        }
    }
});
