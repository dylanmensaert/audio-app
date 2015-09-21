import Ember from 'ember';

export default Ember.Mixin.create({
    editedAlbumName: null,
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

            this.set('editedAlbumName', null);
        },
        exitEdit: function () {
            this.set('editedAlbumName', null);
        }
    }
});
