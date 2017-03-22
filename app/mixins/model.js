import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    name: DS.attr('string'),
    thumbnail: DS.attr('string'),
    concatenatedProperties: ['propertyNames'],
    isSelected: false,
    propertyNames: ['id', 'name', 'thumbnail'],
    serialize: function() {
        return this.getProperties(this.get('propertyNames'));
    },
    removeRecord: function(type) {
        let fileSystem = this.get('fileSystem'),
            id = this.get('id'),
            records = fileSystem.get(type + 'Ids'),
            promise;

        if (records.includes(id)) {
            records.removeObject(id);

            promise = fileSystem.save();
        }

        return Ember.RSVP.resolve(promise);
    }
});
