import Ember from 'ember';

var Snippet = Ember.Object.extend({
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

export default {
    name: 'snippet',
    initialize: function (registry, application) {
        application.register("snippet:main", Snippet, {
            singleton: false,
            instantiate: false
        });
    }
};
