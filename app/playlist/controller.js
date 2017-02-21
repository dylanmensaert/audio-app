import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';

export default Ember.Controller.extend(findControllerMixin, {
    utils: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    model: null,
    type: 'track',
    searchOnline: function() {
        return !this.get('model.isLocalOnly') && this._super();
    },
    setOptions: function(options) {
        options.playlistId = this.get('model.id');

        if (!this.searchOnline()) {
            this.set('models', []);
        }
    },
    updateOffline: Ember.observer('model.trackIds.[]', function() {
        if (!this.searchOnline() && this.get('model.id') !== 'history') {
            this.updateModels();
        }
    }),
    afterModels: function(tracks) {
        let trackIds = this.get('model.trackIds');

        tracks.forEach(function(track) {
            trackIds.pushObject(track.get('id'));
        });

        return Ember.RSVP.resolve();
    },
    /*TODO: Implement another way?*/
    name: null,
    isEditMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    actions: {
        removeFromPlaylist: function() {
            let trackIds = this.get('selectedTracks').mapBy('id'),
                store = this.get('store'),
                playlist = this.get('model');

            trackIds.forEach(function(trackId) {
                let track = store.peekRecord('track', trackId);

                playlist.removeTrack(track);

                track.set('isSelected', false);
            });
        },
        play: function() {
            let playlist = this.get('model');

            this.get('audioRemote').start('playlist', playlist);
        },
        setupEdit: function() {
            let name = this.get('model.name');

            this.set('name', name);
        },
        saveEdit: function() {
            let playlist = this.get('model');

            playlist.set('name', this.get('name'));

            playlist.save();

            this.set('name', null);
        },
        download: function() {
            let playlist = this.get('model');

            playlist.download(this.get('nextPageToken'));
            this.get('utils').showMessage('Downloading playlist');
        },
        save: function() {
            let playlist = this.get('model');

            playlist.saveTracks(this.get('nextPageToken')).then(function() {
                return playlist.save();
            });

            this.get('utils').showMessage('Saving locally');
        },
        delete: function() {
            let playlist = this.get('model');

            playlist.remove();
            this.get('utils').showMessage('Removing locally');
        }
    }
});
