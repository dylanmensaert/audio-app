import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend(controllerMixin, {
    fileSystem: Ember.inject.service(),
    audioPlayer: Ember.inject.service(),
    store: Ember.inject.service(),
    collections: function() {
        var store = this.get('store'),
            collections = [];

        this.get('fileSystem.collectionIds').forEach(function(collectionId) {
            var collection = store.peekRecord('collection', collectionId);

            if (!collection.get('permission')) {
                collections.pushObject(collection);
            }
        });

        return collections;
    }.property('fileSystem.collectionIds.[]', 'collections.[]'),
    sortedCollections: Ember.computed.sort('collections', function(snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, false);
    }),
    isAudioPlayerDefaultMode: function() {
        return this.get('audioPlayer.track') && !this.get('audioPlayer.isLargeMode');
    }.property('audioPlayer.track', 'audioPlayer.isLargeMode'),
    isAudioPlayerLargeMode: function() {
        return this.get('audioPlayer.track') && this.get('audioPlayer.isLargeMode');
    }.property('audioPlayer.track', 'audioPlayer.isLargeMode'),
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
    hideMenuBar: function() {
        return this.get('isCreatedMode') || this.get('selectedCollections.length');
    }.property('isCreatedMode', 'selectedCollections.length'),
    createUniqueId: function() {
        var store = this.get('store'),
            randomId = logic.generateRandomId();

        while (store.peekRecord('collection', randomId)) {
            randomId = logic.generateRandomId();
        }

        return randomId;
    },
    actions: {
        selectAll: function() {
            this.get('collections').setEach('isSelected', true);
        },
        saveCreate: function() {
            var createdCollectionName = this.get('createdCollectionName'),
                store = this.get('store'),
                cache = this.get('cache'),
                id;

            if (store.peekRecord('collection', createdCollectionName)) {
                cache.showMessage('Collection already exists');
            } else {
                id = this.createUniqueId();

                store.pushPayload('collection', {
                    id: id,
                    name: createdCollectionName,
                    isLocalOnly: true
                });

                store.peekRecord('collection', id).save().then(function() {
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
