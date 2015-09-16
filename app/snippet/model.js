import DS from 'ember-data';
import Ember from 'ember';

// TODO: If POD structure works auto for Models, than make sure this file is not configured as a model -> implement as mixin?
export default DS.Model.extend({
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
