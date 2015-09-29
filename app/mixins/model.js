import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    name: DS.attr('string'),
    thumbnail: DS.attr('string'),
    concatenatedProperties: ['propertyNames'],
    isSelected: false,
    // TODO: check if thumbnail property is needed for collection too or just take first record of that collection? If not, check where serialize() is used..
    propertyNames: ['id', 'name', 'thumbnail'],
    serialize: function() {
        return this.getProperties(this.get('propertyNames'));
    }
});
