import Ember from 'ember';
import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';
import searchMixin from 'audio-app/mixins/search';
import logic from 'audio-app/utils/logic';

export default DS.Model.extend(modelMixin, searchMixin, {
    nextPageToken: DS.attr('string'),
    permission: DS.attr('string'),
    isLocalOnly: DS.attr('boolean', {
        defaultValue: false
    }),
    trackIds: DS.attr({
        defaultValue: function() {
            return [];
        }
    }),
    totalTracks: DS.attr('number'),
    propertyNames: ['isLocalOnly', 'trackIds', 'permission', 'nextPageToken'],
    tracks: Ember.computed('trackIds.[]', function() {
        let store = this.store;

        return this.get('trackIds').map(function(trackId) {
            return store.peekRecord('track', trackId);
        });
    }),
    numberOfTracks: Ember.computed('trackIds.length', 'isComplete', 'totalTracks', function() {
        let numberOfTracks = this.get('totalTracks');

        if (!numberOfTracks || this.get('isComplete')) {
            numberOfTracks = this.get('trackIds.length');
        }

        return numberOfTracks;
    }),
    isSaved: Ember.computed('fileSystem.playlistIds.[]', 'id', function() {
        return this.get('fileSystem.playlistIds').includes(this.get('id'));
    }),
    canModify: Ember.computed('isSaved', 'permission', function() {
        return this.get('isSaved') && this.get('permission') !== 'read-only';
    }),
    isDownloaded: Ember.computed('tracks.length', 'isSaved', 'tracks.@each.isDownloaded', function() {
        let tracks = this.get('tracks');

        return tracks.get('length') && this.get('isSaved') && tracks.isEvery('isDownloaded');
    }),
    isDownloadable: Ember.computed('isDownloaded', 'isBusy', 'tracks.length', function() {
        return !this.get('isDownloaded') && !this.get('isBusy') && this.get('tracks.length');
    }),
    thumbnail: Ember.computed('tracks.firstObject.thumbnail', 'onlineThumbnail', function() {
        let track = this.get('tracks.firstObject'),
            thumbnail;

        if (track) {
            thumbnail = track.get('thumbnail');
        } else {
            thumbnail = this.get('onlineThumbnail');
        }

        return thumbnail;
    }),
    isBusy: Ember.computed('downloading.isPending', 'savingTracks.isPending', function() {
        return this.get('downloading.isPending') || this.get('savingTracks.isPending');
    }),
    download: function() {
        let downloading,
            promise;

        promise = this.saveTracks().then(function() {
            return this.downloadNextTrack(0);
        }.bind(this));

        downloading = logic.ObjectPromiseProxy.create({
            promise: promise
        });

        this.set('downloading', downloading);

        return downloading;
    },
    isComplete: Ember.computed('isLocalOnly', 'hasNextPageToken', function() {
        return this.get('isLocalOnly') || !this.get('hasNextPageToken');
    }),
    saveTracks: function() {
        let loadTracks,
            savingTracks;

        loadTracks = function() {
            let promise = Ember.RSVP.resolve();

            if (this.get('isIncomplete')) {
                promise = this.loadNextTracks().then(function() {
                    return loadTracks();
                });
            }

            return promise;
        }.bind(this);

        savingTracks = logic.ObjectPromiseProxy.create({
            // TODO: implement correctly, buggy now
            promise: loadTracks().then(function() {
                return this.save();
            }.bind(this)).then(function() {
                let promises = this.get('tracks').map(function(track) {
                    return track.save();
                });

                return Ember.RSVP.all(promises);
            }.bind(this))
        });

        this.set('savingTracks', savingTracks);

        return savingTracks;
    },
    loadNextTracks: function() {
        let trackIds = this.get('trackIds'),
            isSaved = this.get('isSaved'),
            options = {
                playlistId: this.get('id'),
                maxResults: logic.maxResults,
                nextPageToken: this.get('nextPageToken')
            };

        return this.find('track', options, true).then(function(tracks) {
            let promises = tracks.map(function(track) {
                let promise;

                trackIds.pushObject(track.get('id'));

                if (isSaved) {
                    promise = track.save();
                }

                return promise;
            });

            return Ember.RSVP.all(promises);
        }.bind(this));
    },
    downloadNextTrack: function(index) {
        let trackId = this.get('trackIds').objectAt(index),
            promise = Ember.RSVP.resolve();

        if (trackId) {
            let track = this.get('store').peekRecord('track', trackId);

            if (track.get('isDownloadable')) {
                promise = track.download();
            }

            promise = promise.finally(function() {
                return this.downloadNextTrack(index + 1);
            }.bind(this));
        }

        return promise;
    },
    pushTrack: function(track) {
        this.get('trackIds').pushObject(track.get('id'));

        return track.save();
    },
    unshiftTrack: function(track) {
        this.get('trackIds').unshiftObject(track.get('id'));

        return track.save();
    },
    removeTrack: function(track) {
        this.get('trackIds').removeObject(track.get('id'));

        return track.didRemoveFromPlaylist();
    },
    remove: function() {
        let store = this.get('store'),
            promises;

        promises = this.get('trackIds').map(function(trackId) {
            let track = store.peekRecord('track', trackId);

            return this.removeTrack(track);
        }.bind(this));

        return Ember.RSVP.all(promises).then(function() {
            this.removeRecord('playlist');
        }.bind(this));
    }
});
