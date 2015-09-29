import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import collectionActionsMixin from 'audio-app/collection/actions-mixin';

export default Ember.Controller.extend(controllerMixin, collectionActionsMixin, {
    queryParams: ['query'],
    query: '',
    collections: [],
    isPending: true,
    isLocked: false,
    disableLock: function() {
        this.set('isLocked', false);
    },
    nextPageToken: null,
    showNotFound: function() {
        return !this.get('isPending') && !this.get('collection.length');
    }.property('isPending', 'collection.length'),
    updateCollections: function() {
        var query = {
            maxResults: 50,
            query: this.get('query'),
            nextPageToken: this.get('nextPageToken')
        };

        this.find('collection', query, !this.get('cache.searchDownloadedOnly')).then(function(collectionsPromise) {
            this.get('collections').pushObjects(collectionsPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    }.observes('query', 'cache.searchDownloadedOnly').on('init'),
    sortedCollections: Ember.computed.sort('collections', function(snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    selectedCollections: function() {
        return this.get('store').peekAll('collection').filterBy('isSelected');
    }.property('collections.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('collections.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('collections.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAll: function() {
            this.get('collections').setEach('isSelected', true);
        },
        didScrollToBottom: function() {
            if (!this.get('isLocked')) {
                this.set('isLocked', true);

                this.updateCollections();
            }
        }
    }
});
