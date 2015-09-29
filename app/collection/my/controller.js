import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import collectionActionsMixin from 'audio-app/collection/actions-mixin';

export default Ember.Controller.extend(controllerMixin, collectionActionsMixin, {
    fileSystem: Ember.inject.service(),
    store: Ember.inject.service(),
    collections: function() {
        var store = this.get('store');

        return this.get('fileSystem.collectionIds').map(function(collectionId) {
            return store.peekRecord('collection', collectionId);
        });
    }.property('fileSystem.collectionIds.[]', 'collections.[]'),
    sortedCollections: Ember.computed.sort('collections', function(snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, false);
    }),
    selectedCollections: function() {
        return this.get('collections').filterBy('isSelected');
    }.property('collections.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('collections.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('collections.length'),*/
    /*TODO: Implement another way?*/
    createdCollectionName: null,
    isCreatedMode: function() {
        return this.get('createdCollectionName') !== null;
    }.property('createdCollectionName'),
    actions: {
        selectAll: function() {
            this.get('collections').setEach('isSelected', true);
        },
        saveCreate: function() {
            var createdCollectionName = this.get('createdCollectionName'),
                store = this.get('store'),
                cache = this.get('cache');

            if (store.peekRecord('collection', createdCollectionName)) {
                cache.showMessage('Collection already exists');
            } else {
                store.pushPayload('collection', {
                    // TODO: generate random id since will conflict when changing name
                    id: createdCollectionName,
                    name: createdCollectionName,
                    isLocalOnly: true
                });

                store.peekRecord('collection', createdCollectionName).save().then(function() {
                    this.set('createdCollectionName', null);

                    cache.showMessage('Saved new collection');
                }.bind(this));
            }
        },
        setupCreate: function() {
            this.set('createdCollectionName', '');
        },
        exitCreate: function() {
            this.set('createdCollectionName', null);
        }
    }
});
