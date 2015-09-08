import Ember from 'ember';

export default Ember.Object.extend({
    id: null,
    name: null,
    thumbnail: null,
    fileSystem: null,
    isSelected: false,
    getPropertyNamesToSave: function () {
        return ['id', 'name'];
    },
    strip: function () {
        return this.getProperties(this.getPropertyNamesToSave());
    }
});
