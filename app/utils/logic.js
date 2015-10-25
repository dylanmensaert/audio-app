import Ember from 'ember';
import DS from 'ember-data';

function isMatch(value, query) {
    return query.trim().split(' ').every(function(queryPart) {
        return value.toLowerCase().includes(queryPart.toLowerCase());
    });
}

// TODO: rename logic file?
export default {
    isMatch: isMatch,
    generateRandomId: function() {
        var randomId = '',
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            index = 0;

        for (index; index < 5; index++) {
            randomId += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return randomId;
    },
    getTopRecords: function(records, limit) {
        var topRecords = [];

        records.any(function(record, index) {
            topRecords.pushObject(record);

            return index + 1 >= limit;
        });

        return topRecords;
    },
    find: function(modelName, options, searchOnline) {
        var store = this.get('store'),
            promise,
            promiseArray;

        if (!searchOnline) {
            promise = new Ember.RSVP.Promise(function(resolve) {
                var snippets;

                if (options.collectionId) {
                    snippets = store.peekRecord('collection', options.collectionId).get('trackIds').map(function(trackId) {
                        return store.peekRecord('track', trackId);
                    });
                } else {
                    snippets = store.peekAll(modelName).filter(function(snippet) {
                        return !snippet.get('permission') && isMatch(snippet.get('name'), options.query);
                    });
                }

                resolve(snippets);
            });

            promiseArray = DS.PromiseArray.create({
                promise: promise
            });

        } else {
            options.setNextPageToken = function(nextPageToken) {
                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            promiseArray = store.query(modelName, options);
        }

        return promiseArray;
    }
};
