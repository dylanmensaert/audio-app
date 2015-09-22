import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';

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
    }.property('id')
});
