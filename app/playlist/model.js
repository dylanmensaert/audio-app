import Ember from 'ember';
import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';
import searchMixin from 'audio-app/mixins/search';
import logic from 'audio-app/utils/logic';

export default DS.Model.extend(modelMixin, searchMixin, {
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
    tracks: Ember.computed('trackIds.[]', function() {
        let store = this.store;

        return this.get('trackIds').map(function(trackId) {
            return store.peekRecord('track', trackId);
        });
    }),
    numberOfTracks: Ember.computed('trackIds.length', 'totalTracks', function() {
        let numberOfTracks = this.get('totalTracks');

        if (!numberOfTracks) {
            numberOfTracks = this.get('trackIds.length');
        }

        return numberOfTracks;
    }),
    isSaved: Ember.computed('numberOfTracks', 'trackIds.length', 'fileSystem.playlistIds.[]', function() {
        return this.get('numberOfTracks') === this.get('trackIds.length') && this.get('fileSystem.playlistIds').includes(this.get('id'));
    }),
    isDownloaded: Ember.computed('isSaved', 'tracks.@each.isDownloaded', function() {
        return this.get('isSaved') && this.get('tracks').isEvery('isDownloaded');
    }),
    thumbnail: Ember.computed('tracks.firstObject.thumbnail', 'onlineThumbnail', function() {
        let tracks = this.get('tracks'),
            thumbnail;

        if (tracks.get('length')) {
            let track = tracks.get('firstObject');

            thumbnail = track.get('thumbnail');
        } else {
            thumbnail = this.get('onlineThumbnail');
        }

        return thumbnail;
    }),
    propertyNames: ['isLocalOnly', 'trackIds', 'permission'],
    nextPageToken: null,
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
    hasNextPageToken: Ember.computed('isLocalOnly', 'nextPageToken', function() {
        return !this.get('isLocalOnly') && this.get('nextPageToken') !== undefined;
    }),
    saveTracks: function() {
        let loadTracks,
            savingTracks;

        loadTracks = function() {
            let promise;

            if (this.get('hasNextPageToken')) {
                promise = this.loadNextTracks().then(function() {
                    return loadTracks();
                });
            }

            return promise;
        }.bind(this);

        savingTracks = logic.ObjectPromiseProxy.create({
            // TODO: implement correctly, buggy now
            promise: loadTracks()
        });

        this.set('savingTracks', savingTracks);

        return savingTracks;
    },
    loadNextTracks: function() {
        let trackIds = this.get('trackIds'),
            options = {
                playlistId: this.get('id'),
                maxResults: logic.maxResults,
                nextPageToken: this.get('nextPageToken')
            };

        return this.find('track', options, true).then(function(tracks) {
            tracks.forEach(function(track) {
                trackIds.pushObject(track.get('id'));
            });
        }.bind(this));
    },
    downloadNextTrack: function(index) {
        let trackId = this.get('trackIds').objectAt(index),
            promise;

        if (trackId) {
            let track = this.get('store').peekRecord('track', trackId);

            if (track.get('isDownloadable')) {
                promise = track.download().finally(function() {
                    return this.downloadNextTrack(index + 1);
                }.bind(this));
            }
        }

        return Ember.RSVP.resolve(promise);
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

        return track.didRemove();
    },
    remove: function() {
        let store = this.get('store');

        return this.removeRecord('playlist').then(function() {
            let promises = this.get('trackIds').map(function(trackId) {
                let track = store.peekRecord('track', trackId);

                return track.didRemove();
            }.bind(this));

            return Ember.RSVP.all(promises);
        }.bind(this));
    }
});
