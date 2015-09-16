import Snippet from 'audio-app/snippet/model';

// TODO: Implement correctly
export default Snippet.extend({
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
