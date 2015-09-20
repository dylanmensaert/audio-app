import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import albumActionsMixin from 'audio-app/album/actions-mixin';

export default Ember.Controller.extend(controllerMixin, albumActionsMixin, {
    audioPlayer: Ember.inject.service(),
    cache: Ember.inject.service(),
    queryParams: ['query'],
    query: '',
    albums: function() {
        var query = {
            maxResults: 50,
            query: this.get('query'),
            nextPageToken: this.get('nextPageToken')
        };

        return this.find('album', query, !this.get('cache.searchDownloadedOnly'));
    }.property('query', 'cache.searchDownloadedOnly'),
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
            this.notifyPropertyChange('albums');
        }
    }
});
