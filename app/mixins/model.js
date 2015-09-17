import Ember from 'ember';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    concatenatedProperties: ['propertyNames'],
    id: null,
    name: null,
    thumbnail: null,
    isSelected: false,
    // TODO: check if thumbnail property is needed for album too or just take first record of that album? If not, check where strip() is used..
    propertyNames: ['id', 'name', 'thumbnail'],
    strip: function () {
        return this.getProperties(this.get('propertyNames'));
    }
});
