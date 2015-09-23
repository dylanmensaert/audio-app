import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';
import logic from 'audio-app/utils/logic';

export default DS.Model.extend(modelMixin, {
    recordingIds: [],
    totalRecordings: null,
    permission: null,
    isReadOnly: function() {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    isPushOnly: function() {
        return this.get('permission') === 'push-only';
    }.property('permission'),
    propertyNames: ['recordingIds', 'permission'],
    isQueue: function() {
        return this.get('id') === 'queue';
    }.property('id'),
    nextPageToken: null,
    download: function(nextPageToken) {
        this.set('nextPageToken', nextPageToken);

        this.findAllRecordings();
        this.downloadNextRecording(0);
    },
    findAllRecordings: function() {
        var nextPageToken = this.get('nextPageToken'),
            query;

        if (!nextPageToken) {
            query = {
                albumId: this.get('id'),
                maxResults: 50,
                nextPageToken: nextPageToken
            };

            logic.find.call(this, 'recording', query, true).then(function() {
                this.findAllRecordings(this.get('id'));
            }.bind(this));
        }
    },
    downloadNextRecording: function(index) {
        var recordingId = this.get('recordingIds').objectAt(index),
            recording;

        if (recordingId) {
            recording = this.get('store').peekRecord('recording', recordingId);

            if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                recording.download().then(function() {
                    this.downloadNextRecording(index + 1);
                }.bind(this));
            }
        }
    }
});
