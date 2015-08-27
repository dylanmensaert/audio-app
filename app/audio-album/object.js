import Ember from 'ember';

export default Ember.Object.extend({
    name: null,
    recordings: [],
    permission: null,
    isReadOnly: function () {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    isPushOnly: function () {
        return this.get('permission') === 'push-only';
    }.property('permission'),
    isSelected: false,
    strip: function () {
        return this.getProperties('name', 'recordings', 'permission');
    }
});
