import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['action-bar'],
    collections: null,
    unsavedCollections: function () {
        return this.get('collections').filter(function (track) {
            return !track.get('isDownloaded') && !track.get('isDownloading');
        });
    }.property('collections.@each.isDownloaded'),
    isEveryUnsaved: function () {
        return this.get('unsavedCollections.length') === this.get('collections.length');
    }.property('unsavedCollections.length', 'collections.length'),
    savedCollections: function () {
        return this.get('collections').filter(function (track) {
            return track.get('isDownloaded') || track.get('isDownloading');
        });
    }.property('collections.@each.isDownloaded'),
    isEverySaved: function () {
        return this.get('savedCollections.length') === this.get('collections.length');
    }.property('savedCollections.length', 'collections.length'),
    isEditable: function () {
        var collections = this.get('collections'),
            isEditable = false,
            collection;

        if (collections.get('length') === 1) {
            collection = collections.get('firstObject');

            isEditable = !collection.get('isReadOnly') && !collection.get('isPushOnly');
        }

        return isEditable;
    }.property('collections.length', 'collections.firstObject.isReadOnly', 'collections.firstObject.isPushOnly'),
    editedCollectionName: null,
    isEditMode: function () {
        return this.get('editedCollectionName') !== null;
    }.property('editedCollectionName'),
    actions: {
        save: function () {
            this.get('collections').forEach(function (collection) {
                collection.save();
            });
        },
        delete: function () {
            this.get('collections').forEach(function (collection) {
                collection.destroyRecord();
            });
        },
        setupEdit: function () {
            var name = this.get('collections.firstObject.name');

            this.set('editedCollectionName', name);
        },
        saveEdit: function () {
            var selectedCollection = this.get('collections.firstObject');

            selectedCollection.set('name', this.get('editedCollectionName'));
            selectedCollection.set('isSelected', false);

            selectedCollection.save();

            this.set('editedCollectionName', null);
        }
    }
});
