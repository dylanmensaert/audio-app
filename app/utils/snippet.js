import Ember from 'ember';

// injection reference: http://discuss.emberjs.com/t/dependency-injection-into-ember-object/5997
export default Ember.Object.extend({
    fileSystem: Ember.inject.service(),
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
