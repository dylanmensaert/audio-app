import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import albumActionsMixin from 'audio-app/album/actions-mixin';

export default Ember.Controller.extend(controllerMixin, albumActionsMixin, {
    audioPlayer: Ember.inject.service(),
    cache: Ember.inject.service(),
    queryParams: ['query'],
    query: '',
    albums: [],
    isPending: true,
    isLocked: false,
    updateAlbums: function() {
        var query = {
            maxResults: 50,
            query: this.get('query'),
            nextPageToken: this.get('nextPageToken')
        };

        this.find('album', query, !this.get('cache.searchDownloadedOnly')).then(function(albumsPromise) {
            this.get('albums').pushObjects(albumsPromise.toArray());

            this.set('isLocked', false);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    }.observes('query', 'cache.searchDownloadedOnly').on('init'),
    sortedAlbums: Ember.computed.sort('albums', function(snippet, other) {
        return this.sortSnippet(this.get('albums'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    selectedAlbums: function() {
        return this.get('store').peekAll('album').filterBy('isSelected');
    }.property('albums.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('albums.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('albums.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAll: function() {
            this.get('albums').setEach('isSelected', true);
        },
        didScrollToBottom: function() {
            if (!this.get('isLocked')) {
                this.set('isLocked', true);

                this.updateAlbums();
            }
        }
    }
});
