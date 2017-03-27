import Ember from 'ember';

export default Ember.Component.extend({
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    playlist: null,
    models: [],
    downloadableTracks: Ember.computed('models.@each.isDownloadable', function() {
        return this.get('models').filterBy('isDownloadable');
    }),
    downloadLaterTracks: Ember.computed('models.@each.canDownloadLater', function() {
        return this.get('models').filterBy('canDownloadLater');
    }),
    downloadedTracks: Ember.computed('models.@each.isDownloaded', function() {
        return this.get('models').filterBy('isDownloaded');
    }),
    deselect: function() {
        this.get('models').setEach('isSelected', false);
    },
    willDestroyElement: function() {
        this.deselect();
    },
    actions: {
        removeFromPlaylist: function() {
            let playlist = this.get('playlist');

            if (playlist && playlist.get('canModify')) {
                let tracks = this.get('models'),
                    length = tracks.get('length');

                if (length) {
                    tracks.toArray().forEach(function(track) {
                        playlist.removeTrack(track);
                    });

                    playlist.save();

                    this.get('utils').showMessage('Removed from playlist (' + length + ')');
                }
            }
        },
        downloadLater: function() {
            let downloadLaterTracks = this.get('downloadLaterTracks'),
                length = downloadLaterTracks.get('length');

            if (length) {
                let downloadLater = this.get('store').peekRecord('playlist', 'download-later'),
                    trackIds = downloadLater.get('trackIds');

                downloadLaterTracks.toArray().forEach(function(track) {
                    trackIds.pushObject(track.get('id'));
                });

                downloadLater.save();

                this.get('utils').showMessage('Added to Download later (' + length + ')');
            }
        },
        download: function() {
            let downloadableTracks = this.get('downloadableTracks'),
                length = downloadableTracks.get('length');

            if (length) {
                let downloadLater = this.get('store').peekRecord('playlist', 'download-later'),
                    trackIds = downloadLater.get('trackIds');

                downloadableTracks.toArray().forEach(function(track) {
                    track.download();

                    trackIds.removeObject(track.get('id'));
                });

                downloadLater.save();

                this.get('utils').showMessage('Downloading (' + length + ')');
            }
        },
        delete: function() {
            let downloadedTracks = this.get('downloadedTracks'),
                length = downloadedTracks.get('length');

            if (length) {
                downloadedTracks.toArray().forEach(function(track) {
                    track.remove();
                });

                this.get('utils').showMessage('Removed locally (' + length + ')');
            }
        },
        transitionToPlaylists: function() {
            let utils = this.get('utils');

            utils.controllerFor('subscribe').set('tracks', this.get('models'));
            utils.transitionToRoute('subscribe');
        },
        deselect: function() {
            this.deselect();
        }
    }
});
