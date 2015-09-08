import Snippet from 'audio-app/utils/snippet';

export default Snippet.Object.extend({
    recordingIds: [],
    permission: null,
    isReadOnly: function () {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    isPushOnly: function () {
        return this.get('permission') === 'push-only';
    }.property('permission'),
    getPropertyNamesToSave: function () {
        var propertyNames = this._super();

        propertyNames.pushObjects(['recordingIds', 'permission']);

        return propertyNames;
    }
});
