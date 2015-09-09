import Ember from 'ember';
import Album from 'audio-app/audio-album/object';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/mixins/controller';

export default Ember.Controller.extend(controllerMixin, {
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    fetchSuggestions: function () {
        return function (query, callback) {
            var suggestions = [],
                name;

            this.get('fileSystem.albums').forEach(function (album) {
                name = album.get('name');

                if (this.showAlbum(album) && logic.isMatch(name, query)) {
                    suggestions.pushObject({
                        value: name
                    });
                }
            }.bind(this));

            callback(suggestions);
        }.bind(this);
    }.property('fileSystem.albums.[]'),
    sortedAlbums: function () {
        return Ember.ArrayProxy.extend(Ember.SortableMixin, {
            content: this.get('albums'),
            sortProperties: ['name']
        }).create();
    }.property('albums'),
    albums: function () {
        var selectedRecordings = this.get('cache.selectedRecordings'),
            albums = [],
            name,
            isSelected;

        this.get('fileSystem.albums').forEach(function (album) {
            name = album.get('name');

            if (this.showAlbum(album) && logic.isMatch(
                    name, this.get('query'))) {
                if (selectedRecordings.get('length')) {
                    isSelected = selectedRecordings.every(function (recording) {
                        return recording.get('albums').contains(name);
                    });
                } else {
                    isSelected = false;
                }

                album.set('isSelected', isSelected);

                albums.pushObject(album);
            }
        }.bind(this));

        return albums;
    }.property('fileSystem.albums.@each.name', 'cache.selectedRecordings.[]', 'query'),
    originals: Ember.computed.alias('fileSystem.albums'),
    selected: function () {
        return this.get('albums').filterBy('isSelected');
    }.property('albums.@each.isSelected'),
    hasSingle: function () {
        return this.get('selected.length') === 1;
    }.property('selected.length'),
    showAlbum: function (album) {
        return !album.get('isReadOnly') || this.get('cache.selectedRecordings.length');
    },
    actions: {
        create: function () {
            var liveQuery = this.get('liveQuery'),
                albums = this.get('fileSystem.albums');

            if (!Ember.isEmpty(liveQuery)) {
                if (!albums.isAny('name', liveQuery)) {
                    albums.pushObject(Album.create({
                        name: liveQuery
                    }));
                } else {
                    this.get('cache').showMessage('Album already exists');
                }
            }

            this.set('liveQuery', '');
        },
        toggle: function (album) {
            var selectedRecordings = this.get('cache.selectedRecordings'),
                recordings = this.get('fileSystem.recordings'),
                cache = this.get('cache'),
                albums;

            selectedRecordings.forEach(function (recording) {
                albums = recording.get('albums');

                if (album.get('isSelected')) {
                    albums.pushObject(album.get('name'));

                    if (!recordings.isAny('id', recording.get('id'))) {
                        recordings.pushObject(recording);
                    }

                    cache.showMessage('Added to album');
                } else {
                    albums.removeObject(album.get('name'));

                    cache.showMessage('Removed from album');
                }
            }.bind(this));

            if (this.get('isEditMode')) {
                this.send('exitEdit');
            }
        },
        selectAll: function () {
            this.get('albums').setEach('isSelected', true);
        }
    }
});
