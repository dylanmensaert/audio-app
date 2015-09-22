import Ember from 'ember';

export default Ember.Mixin.create({
    editedAlbumName: null,
    isEditMode: function () {
        return this.get('editedAlbumName') !== null;
    }.property('editedAlbumName'),
    actions: {
        save: function () {
            this.get('selectedAlbums').forEach(function (album) {
                album.save();
            });
        },
        delete: function () {
            this.get('selectedAlbums').forEach(function (album) {
                album.destroyRecord();
            });
        },
        setupEdit: function () {
            var name = this.get('selectedAlbums.firstObject.name');

            this.set('editedAlbumName', name);
        },
        saveEdit: function () {
            var selectedAlbum = this.get('selectedAlbums.firstObject');

            selectedAlbum.set('name', this.get('editedAlbumName'));
            selectedAlbum.set('isSelected', false);

            this.set('editedAlbumName', null);
        },
        exitEdit: function () {
            this.set('editedAlbumName', null);
        }
    }
});
