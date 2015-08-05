import Ember from 'ember';

export default Ember.Object.extend({
    name: null,
    permission: null,
    isReadOnly: function() {
        return this.get('permission') === 'read-only';
    }.property('permission'),
    isHidden: function() {
        return this.get('permission') === 'hidden';
    }.property('permission'),
    isSelected: false,
    strip: function() {
        return this.getProperties('name', 'permission');
    }
});
