/* global Blob */

import Ember from 'ember';
import pluralize from 'ember-inflector';
import meta from 'meta-data';

var write = function() {
    var json = this.serialize();

    this.get('instance').root.getFile('data.json', {}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function() {
                if (!fileWriter.length) {
                    fileWriter.write(new Blob([json], {
                        type: 'application/json'
                    }));
                }
            };

            fileWriter.truncate(0);
        });
    });
};

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    buildUrlByEndpoint: function(endpoint, maxResults, nextPageToken) {
        var url = meta.searchHost + '/youtube/v3/' + endpoint + '?part=snippet&maxResults=' + maxResults + '&key=' + meta.key;

        if (!Ember.isEmpty(nextPageToken)) {
            url += '&pageToken=' + nextPageToken;
        }

        return url;
    },
    buildUrlByType: function(type, query) {
        // TODO: Rename query.query property?
        return this.buildUrlByEndpoint('search', query.maxResults, query.nextPageToken) + '&order=viewCount&type=' + type + '&q=' + query.query;
    },
    query: function(store, type, query) {
        var url = this.buildUrl(type.modelName, null, null, 'query', query);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url).then(function(payload) {
                query.setNextPageToken(payload.nextPageToken);

                Ember.run(null, resolve, payload);
            }, function(response) {
                Ember.run(null, reject, response);
            });
        });
    },
    createRecord: function(store, type, snapshot) {
        var fileSystem = this.get('fileSystem');

        fileSystem.get(pluralize(type)).pushObject(snapshot.get('id'));

        Ember.run.debounce(fileSystem, write, 100);
    },
    updateRecord: function() {
        Ember.run.debounce(this.get('fileSystem'), write, 100);
    },
    deleteRecord: function(store, type, snapshot) {
        var fileSystem = this.get('fileSystem');

        fileSystem.get(pluralize(type) + 'Ids').removeObject(snapshot.get('id'));

        Ember.run.debounce(fileSystem, write, 100);
    }
});
