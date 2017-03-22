import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    playlist: null,
    isPending: null,
    hideDownloaded: false,
    downloadableTracks: Ember.computed('selectedModels.@each.isDownloadable', function() {
        return this.get('selectedModels').filterBy('isDownloadable');
    }),
    downloadLaterTracks: Ember.computed('selectedModels.@each.canDownloadLater', function() {
        return this.get('selectedModels').filterBy('canDownloadLater');
    }),
    downloadedTracks: Ember.computed('selectedModels.@each.isDownloaded', function() {
        return this.get('selectedModels').filterBy('isDownloaded');
    }),
    actions: {
        play: function(track) {
            if (this.get('selectedModels.length')) {
                track.toggleProperty('isSelected');
            } else if (!track.get('isDisabled')) {
                this.get('audioRemote').play(track);
            }
        },
        removeFromPlaylist: function() {
            let playlist = this.get('playlist');

            if (playlist && playlist.get('canModify')) {
                let selectedTracks = this.get('selectedModels'),
                    length = selectedTracks.get('length');

                if (length) {
                    selectedTracks.toArray().forEach(function(track) {
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

            utils.set('selectedTrackIds', this.get('selectedModels').mapBy('id'));

            utils.transitionToRoute('subscribe');
        }
    }
});
