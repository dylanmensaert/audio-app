import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    concatenatedProperties: ['propertyNames'],
    name: DS.attr('string'),
    thumbnail: DS.attr('string'),
    isSelected: false,
    // TODO: check if thumbnail property is needed for album too or just take first record of that album? If not, check where strip() is used..
    propertyNames: ['id', 'name', 'thumbnail'],
    strip: function() {
        return this.getProperties(this.get('propertyNames'));
    }
});
