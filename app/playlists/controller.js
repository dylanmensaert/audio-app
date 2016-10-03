import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend({
    playlists: Ember.computed('fileSystem.playlistIds.[]', 'playlists.[]', function() {
        let store = this.store,
            playlists = [];

        this.get('fileSystem.playlistIds').forEach(function(playlistId) {
            let playlist = store.peekRecord('playlist', playlistId);

            if (!playlist.get('permission')) {
                playlists.pushObject(playlist);
            }
        });

        return playlists;
    }),
    sortedPlaylists: Ember.computed.sort('playlists', function(playlist, other) {
        return logic.sortByName(playlist, other);
    }),
    isCreatedMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    name: null,
    createUniqueId: function() {
        let store = this.get('store'),
            randomId = logic.generateRandomId();

        while (store.peekRecord('playlist', randomId)) {
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

            if (store.peekRecord('playlist', name)) {
                utils.showMessage('Playlist already exists');
            } else {
                id = this.createUniqueId();

                store.pushPayload('playlist', {
                    id: id,
                    name: name,
                    isLocalOnly: true
                });

                store.peekRecord('playlist', id).save().then(function() {
                    this.set('name', null);

                    utils.showMessage('Saved new playlist');
                }.bind(this));
            }
        },
        setupCreate: function() {
            this.set('name', '');
        }
    }
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('playlists.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('playlists.length'),*/
    /*TODO: Implement another way?*/
});
