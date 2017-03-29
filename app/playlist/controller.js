import Ember from 'ember';
import loadNextControllerMixin from 'audio-app/mixins/controller-load-next';

export default Ember.Controller.extend(loadNextControllerMixin, {
    utils: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    model: null,
    name: null,
    isEditMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    canLoadNext: Ember.computed.not('model.didLoadTracks'),
    loadNext: function() {
        return this.get('model').loadNextTracks();
    },
    actions: {
        removeFromPlaylist: function() {
            let playlist = this.get('model');

            playlist.get('tracks').forEach(function(track) {
                if (track.get('isSelected')) {
                    playlist.removeTrack(track).then(function() {
                        track.set('isSelected', false);
                    });
                }
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
