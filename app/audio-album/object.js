// TODO: Implement correctly
export default App.container.lookup('snippet:main').extend({
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
