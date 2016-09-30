import Ember from 'ember';
import DS from 'ember-data';
import searchMixin from 'audio-app/mixins/search';

export default Ember.Mixin.create(searchMixin, {
    fileSystem: Ember.inject.service(),
    name: DS.attr('string'),
    concatenatedProperties: ['propertyNames'],
    isSelected: false,
    propertyNames: ['id', 'name'],
    serialize: function () {
        return this.getProperties(this.get('propertyNames'));
    }
});
