import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import playlistControllerMixin from 'audio-app/mixins/controller-playlist';

export default Ember.Controller.extend(findControllerMixin, playlistControllerMixin, {
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
    /*TODO: Implement another way?*/
    name: null,
    isEditMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    isQueued: Ember.computed('models.isQueued', function() {
        return this.get('models').isEvery('isQueued');
    }),
    actions: {
        // TODO: implement more actions? (every action defined in playlists?)
        play: function() {
            let queue = this.store.peekRecord('playlist', 'queue');

            queue.clear().then(function() {
                this.get('sortedModels').forEach(function(track) {
                    queue.pushTrack(track);
                });

                this.get('audioRemote').play(queue.get('tracks.firstObject'));
            }.bind(this));
        },
        download: function() {
            let playlist = this.get('model');

            if (playlist.get('isSelected')) {
                playlist.download(this.get('nextPageToken'));
            } else {
                this._super();
            }
        },
        setupEdit: function() {
            let name = this.get('model.name');

            this.set('name', name);
        },
        save: function() {
            let playlist = this.get('model');

            playlist.set('name', this.get('name'));

            playlist.save();

            this.set('name', null);
        }
    }
});
