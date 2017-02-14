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
    tracks: Ember.computed('trackIds.[]', function() {
        let store = this.store;

        return this.get('trackIds').map(function(trackId) {
            return store.peekRecord('track', trackId);
        });
    }),
    totalTracks: DS.attr('number'),
    thumbnail: Ember.computed('tracks.firstObject.thumbnail', 'onlineThumbnail', function() {
        let tracks = this.get('tracks'),
            thumbnail;

        if (tracks.get('length')) {
            let track = tracks.get('firstObject');

            thumbnail = track.get('thumbnail');
        } else {
            let onlineThumbnail = this.get('onlineThumbnail');

            if (onlineThumbnail) {
                thumbnail = onlineThumbnail;
            }
        }

        return thumbnail;
    }),
    numberOfTracks: Ember.computed('trackIds.length', 'totalTracks', function() {
        let numberOfTracks = this.get('totalTracks');

        if (!numberOfTracks) {
            numberOfTracks = this.get('trackIds.length');
        }

        return numberOfTracks;
    }),
    isSaved: Ember.computed('fileSystem.playlistIds.[]', function() {
        return this.get('fileSystem.playlistIds').includes(this.get('id'));
    }),
    isReadOnly: Ember.computed('permission', function() {
        return this.get('permission') === 'read-only';
    }),
    isPushOnly: Ember.computed('permission', function() {
        return this.get('permission') === 'push-only';
    }),
    isEditable: Ember.computed('isReadOnly', 'isPushOnly', function() {
        return !this.get('isReadOnly') && !this.get('isPushOnly');
    }),
    propertyNames: ['isLocalOnly', 'trackIds', 'permission'],
    isQueue: Ember.computed('id', function() {
        return this.get('id') === 'queue';
    }),
    nextPageToken: null,
    download: function(nextPageToken) {
        this.set('nextPageToken', nextPageToken);

        this.saveNextTracks();
        this.downloadNextTrack(0);
    },
    saveNextTracks: function() {
        let nextPageToken = this.get('nextPageToken'),
            options;

        if (!nextPageToken) {
            options = {
                playlistId: this.get('id'),
                maxResults: logic.maxResults,
                nextPageToken: nextPageToken
            };

            this.find('track', options, true).then(function(tracks) {
                this.get('trackIds').pushObjects(tracks.mapBy('id'));

                tracks.forEach(function(track) {
                    track.save();
                });

                this.saveNextTracks(this.get('id'));
            }.bind(this));
        }
    },
    downloadNextTrack: function(index) {
        let trackId = this.get('trackIds').objectAt(index),
            track;

        if (trackId) {
            track = this.get('store').peekRecord('track', trackId);

            if (track.get('isDownloadable')) {
                track.download().then(function() {
                    this.downloadNextTrack(index + 1);
                }.bind(this));
            }
        }
    },
    pushTrackById: function(trackId) {
        let track = this.get('store').peekRecord('track', trackId);

        this.get('trackIds').pushObject(trackId);
        this.save();

        if (!track.get('isSaved')) {
            track.save();
        }
    },
    clear: function() {
        let promises = this.get('trackIds').map(function(trackId) {
            let track = this.get('store').peekRecord('track', trackId);

            return track.removeFromPlayList(this);
        }.bind(this));

        return Ember.RSVP.all(promises);
    },
    remove: function() {
        this.clear();

        this.destroyRecord();
    }
});
