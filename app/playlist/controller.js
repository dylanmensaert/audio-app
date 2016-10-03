import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import logic from 'audio-app/utils/logic';

export default Ember.Controller.extend(findControllerMixin, {
    model: null,
    type: 'track',
    searchOnline: function() {
        return !this.get('model.isLocalOnly') && this._super();
    },
    setOptions: function(options) {
        options.playlistId = this.get('model.id');

        if (this.searchOnline()) {
            options.maxResults = logic.maxResults;
            options.nextPageToken = this.get('nextPageToken');
        } else {
            this.set('models', []);
        }
    },
    updateOffline: Ember.observer('model.trackIds.[]', function() {
        if (!this.searchOnline()) {
            this.updateModels();
        }
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('tracks.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('tracks.length'),*/
    /*TODO: Implement another way?*/
    name: null,
    isEditMode: Ember.computed('name', function() {
        return !Ember.isNone(this.get('name'));
    }),
    actions: {
        // TODO: implement more actions? (every action defined in playlists?)
        download: function() {
            let playlist = this.get('model');

            if (playlist.get('isSelected')) {
                playlist.download(this.get('nextPageToken'));
            } else {
                this._super();
            }
        },
        removeFromPlaylist: function() {
            let trackIds = this.get('selectedTracks').mapBy('id'),
                store = this.get('store'),
                playlist = this.get('model');

            trackIds.forEach(function(trackId) {
                let track = store.peekRecord('track', trackId);

                playlist.removeTrackById(trackId);

                track.set('isSelected', false);
            });
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
