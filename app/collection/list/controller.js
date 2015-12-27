import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';

export default Ember.Controller.extend(controllerMixin, {
    init: function() {
        this._super();

        this.updateCollections();
    },
    queryParams: ['query'],
    query: '',
    collections: [],
    isPending: true,
    isLocked: false,
    disableLock: function() {
        this.set('isLocked', false);
    },
    nextPageToken: Ember.computed('isPending', 'collection.length', function() {
        return !this.get('isPending') && !this.get('collection.length');
    }),
    updateCollections: Ember.observer('query', function() {
        var options = {
            maxResults: 50,
            query: this.get('query'),
            nextPageToken: this.get('nextPageToken')
        };

        this.find('collection', options, !this.get('cache').getIsOfflineMode()).then(function(collectionsPromise) {
            this.get('collections').pushObjects(collectionsPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if(!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    }),
    sortedCollections: Ember.computed.sort('collections', function(snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, !this.get('cache').getIsOfflineMode());
    }),
    selectedCollections: Ember.computed('collections.@each.isSelected', function() {
        return this.get('store').peekAll('collection').filterBy('isSelected');
    }),
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
            if(!this.get('isLocked') && this.get('nextPageToken')) {
                this.set('isLocked', true);

                this.updateCollections();
            }
        }
    }
});
