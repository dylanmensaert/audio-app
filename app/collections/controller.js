import Ember from 'ember';
import logic from 'logic';

export default Ember.Controller.extend({
    collections: Ember.computed('fileSystem.collectionIds.[]', 'collections.[]', function() {
        let store = this.store,
            collections = [];

        this.get('fileSystem.collectionIds').forEach(function(collectionId) {
            let collection = store.peekRecord('collection', collectionId);

            if (!collection.get('permission')) {
                collections.pushObject(collection);
            }
        });

        return collections;
    }),
    sortedCollections: Ember.computed.sort('collections', function(collection, other) {
        return logic.sortByName(collection, other);
    }),
    isCreatedMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    name: null,
    createUniqueId: function() {
        let store = this.get('store'),
            randomId = logic.generateRandomId();

        while (store.peekRecord('collection', randomId)) {
            randomId = logic.generateRandomId();
        }

        return randomId;
    },
    actions: {
        save: function() {
            let name = this.get('name'),
                utils = this.get('utils'),
                store = this.store,
                id;

            if (store.peekRecord('collection', name)) {
                utils.showMessage('Collection already exists');
            } else {
                id = this.createUniqueId();

                store.pushPayload('collection', {
                    id: id,
                    name: name,
                    isLocalOnly: true
                });

                store.peekRecord('collection', id).save().then(function() {
                    this.set('name', null);

                    utils.showMessage('Saved new collection');
                }.bind(this));
            }
        },
        setupCreate: function() {
            this.set('name', '');
        }
    }
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('collections.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('collections.length'),*/
    /*TODO: Implement another way?*/
});
