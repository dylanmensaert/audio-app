import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    buildUrlByEndpoint: function(endpoint, options) {
        let url = logic.getUrl(endpoint) + '&part=snippet';

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
            snippetIds = fileSystem.get(type.modelName + 'Ids'),
            promise;

        if (!snippetIds.includes(snapshot.id)) {
            snippetIds.pushObject(snapshot.id);

            // TODO: Implement 'insertWithoutAudio' for playlist also?
            if (snapshot.record.insertWithoutAudio) {
                promise = snapshot.record.insertWithoutAudio();
            }
        }

        return Ember.RSVP.resolve(promise).then(function() {
            return fileSystem.save();
        }).then(function() {
            return {
                deserializeSingleRecord: true,
                items: [{
                    id: snapshot.id
                }]
            };
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
