/* global window: true */
import Ember from 'ember';

var Snippet = Ember.Object.extend({
    fileSystem: Ember.inject.service(),
    id: null,
    name: null,
    thumbnail: null,
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
        // TODO: needed to lookup from container for now: http://stackoverflow.com/questions/32488957/how-to-access-app-container-in-ember-cli
        window.application = application;

        application.register("snippet:main", Snippet, {
            singleton: false,
            instantiate: false
        });
    }
};
