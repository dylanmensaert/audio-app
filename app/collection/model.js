import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';
import logic from 'audio-app/utils/logic';

export default DS.Model.extend(modelMixin, {
    permission: DS.attr('string'),
    isLocalOnly: DS.attr('boolean'),
    trackIds: [],
    totalTracks: null,
    isReadOnly: function() {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    isPushOnly: function() {
        return this.get('permission') === 'push-only';
    }.property('permission'),
    propertyNames: ['isLocalOnly', 'trackIds', 'permission'],
    isQueue: function() {
        return this.get('id') === 'queue';
    }.property('id'),
    nextPageToken: null,
    download: function(nextPageToken) {
        this.set('nextPageToken', nextPageToken);

        this.findAllTracks();
        this.downloadNextTrack(0);
    },
    findAllTracks: function() {
        var nextPageToken = this.get('nextPageToken'),
            query;

        if (!nextPageToken) {
            query = {
                collectionId: this.get('id'),
                maxResults: 50,
                nextPageToken: nextPageToken
            };

            logic.find.call(this, 'track', query, true).then(function() {
                this.findAllTracks(this.get('id'));
            }.bind(this));
        }
    },
    downloadNextTrack: function(index) {
        var trackId = this.get('trackIds').objectAt(index),
            track;

        if (trackId) {
            track = this.get('store').peekRecord('track', trackId);

            if (!track.get('isDownloaded') && !track.get('isDownloading')) {
                track.download().then(function() {
                    this.downloadNextTrack(index + 1);
                }.bind(this));
            }
        }
    }
});
