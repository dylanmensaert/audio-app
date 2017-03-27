import Ember from 'ember';

export default Ember.Controller.extend({
    utils: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    model: null,
    /*TODO: Implement another way?*/
    name: null,
    isEditMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    isPending: Ember.computed('connection.isOnline', 'model.isComplete', function() {
        return this.get('connection.isOnline') && !this.get('model.isComplete');
    }),
    actions: {
        didScrollToBottom: function() {
            if (!this.get('isLocked') && !this.get('model.isComplete')) {
                this.set('isLocked', true);

                this.get('model').loadNextTracks().finally(function() {
                    this.set('isLocked', false);
                }.bind(this));
            }
        },
        removeFromPlaylist: function() {
            let trackIds = this.get('selectedTracks').mapBy('id'),
                store = this.get('store'),
                playlist = this.get('model'),
                tracks = this.get('models');

            trackIds.forEach(function(trackId) {
                let track = store.peekRecord('track', trackId);

                playlist.removeTrack(track).then(function() {
                    track.set('isSelected', false);

                    tracks.removeObject(track);
                });
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

            playlist.download();
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
