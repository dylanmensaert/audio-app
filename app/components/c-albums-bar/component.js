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
    isSingle: function() {
        return this.get('albums.length') === 1;
    }.property('albums.length'),
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
