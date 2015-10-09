import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';
import logic from 'audio-app/utils/logic';

export default DS.Model.extend(modelMixin, {
    permission: DS.attr('string'),
    isLocalOnly: DS.attr('boolean', {
        defaultValue: false
    }),
    trackIds: DS.attr({
        defaultValue: []
    }),
    totalTracks: DS.attr('number'),
    isSaved: function () {
        return this.get('fileSystem.collectionIds').contains(this.get('id'));
    }.property('fileSystem.tracks.[]'),
    isReadOnly: function () {
        return this.get('permission') === 'read-only' || !this.get('isLocalOnly');
    }.property('permission'),
    isPushOnly: function () {
        return this.get('permission') === 'push-only';
    }.property('permission'),
    propertyNames: ['isLocalOnly', 'trackIds', 'permission'],
    isQueue: function () {
        return this.get('id') === 'queue';
    }.property('id'),
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

            logic.find.call(this, 'track', options, true).then(function (tracks) {
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

            if (!track.get('isDownloaded') && !track.get('isDownloading')) {
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
        var store = this.get('store'),
            track = store.peekRecord('track', trackId);

        this.get('trackIds').removeObject(trackId);
        this.save();

        if (!track.get('isDownloaded') && !track.get('isDownloading')) {
            if (!track.getIsReferenced()) {
                track.destroyRecord();
            }
        }
    },
    destroy: function () {
        this.get('trackIds').forEach(function (trackId) {
            this.removeTrackById(trackId);
        }.bind(this));

        this.destroyRecord();
    }
});
