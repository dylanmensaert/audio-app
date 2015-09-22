import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['action-bar'],
    albums: null,
    unsavedAlbums: function() {
        return this.get('albums').filter(function(recording) {
            return !recording.get('isDownloaded') && !recording.get('isDownloading');
        });
    }.property('albums.@each.isDownloaded'),
    isEveryUnsaved: function() {
        return this.get('unsavedAlbums.length') === this.get('albums.length');
    }.property('unsavedAlbums.length', 'albums.length'),
    savedAlbums: function() {
        return this.get('albums').filter(function(recording) {
            return recording.get('isDownloaded') || recording.get('isDownloading');
        });
    }.property('albums.@each.isDownloaded'),
    isEverySaved: function() {
        return this.get('savedAlbums.length') === this.get('albums.length');
    }.property('savedAlbums.length', 'albums.length'),
    isEditable: function() {
        var albums = this.get('albums'),
            isEditable = false,
            album;

        if (albums.get('length') === 1) {
            album = albums.get('firstObject');

            isEditable = !album.get('isReadOnly') && !album.get('isPushOnly');
        }

        return isEditable;
    }.property('albums.length', 'albums.firstObject.isReadOnly', 'albums.firstObject.isPushOnly'),
    actions: {
        save: function() {
            this.sendAction('save');
        },
        edit: function() {
            this.sendAction('edit');
        },
        delete: function() {
            this.sendAction('delete');
        }
    }
});
