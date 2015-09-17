import DS from 'ember-data';
import modelMixin from 'audio-app/mixins/model';

// TODO: Implement correctly
export default DS.Model.extend(modelMixin, {
    recordingIds: [],
    permission: null,
    isReadOnly: function () {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    isPushOnly: function () {
        return this.get('permission') === 'push-only';
    }.property('permission'),
    propertyNames: ['recordingIds', 'permission']
});