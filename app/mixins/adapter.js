import Ember from 'ember';
import domainData from 'domain-data';
import apiKey from 'api-key';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    buildUrlByEndpoint: function(endpoint, options) {
        let url = domainData.searchName + '/youtube/v3/' + endpoint + '?part=snippet' + '&key=' + apiKey;

        if (options) {
            if (options.maxResults) {
                url += '&maxResults=' + options.maxResults;
            }

            if (options.nextPageToken) {
                url += '&pageToken=' + options.nextPageToken;
            }
        }

        return url;
    },
    buildUrlByType: function(type, options) {
        let url = this.buildUrlByEndpoint('search', options) + '&order=viewCount&type=' + type;

        if (options.query) {
            url += '&q=' + options.query;
        }

        return url;
    },
    findRecord: function(store, type, id, endpoint) {
        let url = this.buildUrlByEndpoint(endpoint) + '&id=' + id;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url).then(function(payload) {
                payload.deserializeSingleRecord = true;

                Ember.run(null, resolve, payload);
            }.bind(this), function(response) {
                Ember.run(null, reject, response);
            });
        }.bind(this));
    },
    query: function(store, type, options) {
        let url = this.buildUrl(type.modelName, null, null, 'query', options);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url).then(function(payload) {
                options.setNextPageToken(payload.nextPageToken);

                Ember.run(null, resolve, payload);
            }, function(response) {
                Ember.run(null, reject, response);
            });
        });
    },
    updateRecord: function(store, type, snapshot) {
        let fileSystem = this.get('fileSystem'),
            snippetIds = fileSystem.get(type.modelName + 'Ids');

        if (!snippetIds.contains(snapshot.id)) {
            snippetIds.pushObject(snapshot.id);
        }

        return new Ember.RSVP.Promise(function(resolve) {
            fileSystem.save().then(function() {
                let response = {
                    deserializeSingleRecord: true,
                    items: [{
                        id: snapshot.id
                    }]
                };

                resolve(response);
            });
        });
    },
    deleteRecord: function(store, type, snapshot) {
        let fileSystem = this.get('fileSystem');

        fileSystem.get(type.modelName + 'Ids').removeObject(snapshot.id);

        return new Ember.RSVP.Promise(function(resolve) {
            fileSystem.save().then(function() {
                let response = {
                    deserializeSingleRecord: true,
                    items: [{
                        id: snapshot.id
                    }]
                };

                resolve(response);
            });
        });
    }
});
