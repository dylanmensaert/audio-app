import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['my-action-bar'],
    total: null,
    collections: null,
    isEveryUnsaved: function () {
        return this.get('collections').filterBy('isSaved', false).get('length') === this.get('collections.length');
    }.property('collections.@each.isSaved', 'collections.length'),
    isEverySaved: function () {
        return this.get('collections').filterBy('isSaved').get('length') === this.get('collections.length');
    }.property('collections.@each.isSaved', 'collections.length'),
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
                collection.destroy().then(function () {
                    collection.set('isSelected', false);
                });
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
