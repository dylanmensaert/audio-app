import Ember from 'ember';

export default Ember.Mixin.create({
    editedCollectionName: null,
    isEditMode: function () {
        return this.get('editedCollectionName') !== null;
    }.property('editedCollectionName'),
    actions: {
        save: function () {
            this.get('selectedCollections').forEach(function (collection) {
                collection.save();
            });
        },
        delete: function () {
            this.get('selectedCollections').forEach(function (collection) {
                collection.destroyRecord();
            });
        },
        setupEdit: function () {
            var name = this.get('selectedCollections.firstObject.name');

            this.set('editedCollectionName', name);
        },
        saveEdit: function () {
            var selectedCollection = this.get('selectedCollections.firstObject');

            selectedCollection.set('name', this.get('editedCollectionName'));
            selectedCollection.set('isSelected', false);

            this.set('editedCollectionName', null);
        },
        exitEdit: function () {
            this.set('editedCollectionName', null);
        }
    }
});
