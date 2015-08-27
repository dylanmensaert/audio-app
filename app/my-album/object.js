import Ember from 'ember';

export default Ember.Object.extend({
    name: null,
    audios: [],
    permission: null,
    isReadOnly: function () {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    canAddAudio: function () {
        return this.get('permission') === 'add-audio';
    }.property('permission'),
    isSelected: false,
    strip: function () {
        return this.getProperties('name', 'audios', 'permission');
    }
});
