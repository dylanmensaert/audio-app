import Ember from 'ember';
import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';

export default DS.Model.extend(modelMixin, {
    permission: DS.attr('string'),
    isLocalOnly: DS.attr('boolean', {
        defaultValue: false
    }),
    trackIds: DS.attr({
        defaultValue: []
    }),
    totalTracks: DS.attr('number'),
    thumbnail: Ember.computed('trackIds.firstObject', 'fileSystem.tracks.[]', function () {
        var tracks = this.get('fileSystem.tracks'),
            firstTrackId,
            thumbnail;

        if (tracks) {
            firstTrackId = this.get('trackIds.firstObject');

            thumbnail = tracks.findBy('id', firstTrackId).thumbnail;
        }

        return thumbnail;
    }),
    numberOfTracks: Ember.computed('trackIds.length', 'totalTracks', function () {
        var numberOfTracks = this.get('totalTracks');

        if (!numberOfTracks) {
            numberOfTracks = this.get('trackIds.length');
        }

        return numberOfTracks;
    }),
    isSaved: Ember.computed('fileSystem.tracks.[]', function () {
        return this.get('fileSystem.collectionIds').contains(this.get('id'));
    }),
    isReadOnly: Ember.computed('permission', function () {
        return this.get('permission') === 'read-only' || !this.get('isLocalOnly');
    }),
    isPushOnly: Ember.computed('permission', function () {
        return this.get('permission') === 'push-only';
    }),
    propertyNames: ['isLocalOnly', 'trackIds', 'permission'],
    isQueue: Ember.computed('id', function () {
        return this.get('id') === 'queue';
    }),
    nextPageToken: null,
    download: function (nextPageToken) {
        this.set('nextPageToken', nextPageToken);

        this.saveNextTracks();
        this.downloadNextTrack(0);
    },
    saveNextTracks: function () {
        var nextPageToken = this.get('nextPageToken'),
            options;

        if (!nextPageToken) {
            options = {
                collectionId: this.get('id'),
                maxResults: 50,
                nextPageToken: nextPageToken
            };

            this.find('track', options, true).then(function (tracks) {
                this.get('trackIds').pushObjects(tracks.mapBy('id'));

                tracks.forEach(function (track) {
                    track.save();
                });

                this.saveNextTracks(this.get('id'));
            }.bind(this));
        }
    },
    downloadNextTrack: function (index) {
        var trackId = this.get('trackIds').objectAt(index),
            track;

        if (trackId) {
            track = this.get('store').peekRecord('track', trackId);

            if (track.get('isDownloadable')) {
                track.download().then(function () {
                    this.downloadNextTrack(index + 1);
                }.bind(this));
            }
        }
    },
    pushTrackById: function (trackId) {
        var track = this.get('store').peekRecord('track', trackId);

        this.get('trackIds').pushObject(trackId);
        this.save();

        if (!track.get('isSaved')) {
            track.save();
        }
    },
    removeTrackById: function (trackId) {
        var track = this.get('store').peekRecord('track', trackId);

        this.get('trackIds').removeObject(trackId);
        this.save();

        if (track.get('isDownloadable') && !track.get('isReferenced')) {
            track.destroyRecord();
        }
    },
    destroy: function () {
        this.get('trackIds').forEach(function (trackId) {
            this.removeTrackById(trackId);
        }.bind(this));

        this.destroyRecord();
    }
});
