import Ember from 'ember';
import meta from 'meta-data';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    buildUrlByEndpoint: function (endpoint, maxResults, nextPageToken) {
        var url = meta.searchHost + '/youtube/v3/' + endpoint + '?part=snippet' + '&key=' + meta.key;

        if (maxResults) {
            url += '&maxResults=' + maxResults;
        }

        if (nextPageToken) {
            url += '&pageToken=' + nextPageToken;
        }

        return url;
    },
    buildUrlByType: function (type, query) {
        // TODO: Rename query.query property?
        return this.buildUrlByEndpoint('search', query.maxResults, query.nextPageToken) + '&order=viewCount&type=' + type + '&q=' + query.query;
    },
    findRecord: function (store, type, id, endpoint) {
        var url = this.buildUrlByEndpoint(endpoint) + '&id=' + id;

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.$.getJSON(url).then(function (payload) {
                payload.deserializeSingleRecord = true;

                Ember.run(null, resolve, payload);
            }.bind(this), function (response) {
                Ember.run(null, reject, response);
            });
        }.bind(this));
    },
    query: function (store, type, query) {
        var url = this.buildUrl(type.modelName, null, null, 'query', query);

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.$.getJSON(url).then(function (payload) {
                query.setNextPageToken(payload.nextPageToken);

                Ember.run(null, resolve, payload);
            }, function (response) {
                Ember.run(null, reject, response);
            });
        });
    },
    updateRecord: function (store, type, snapshot) {
        var fileSystem = this.get('fileSystem'),
            snippetIds = fileSystem.get(type.modelName + 'Ids'),
            id = snapshot.id;

        if (!snippetIds.contains(id)) {
            snippetIds.pushObject(id);
        }

        fileSystem.write();

        return {
            deserializeSingleRecord: true,
            items: [
                snapshot
            ]
        };
    },
    deleteRecord: function (store, type, snapshot) {
        var fileSystem = this.get('fileSystem');

        fileSystem.get(type.modelName + 'Ids').removeObject(snapshot.id);

        fileSystem.write();

        return {
            deserializeSingleRecord: true,
            items: [
                snapshot
            ]
        };
    }
});
