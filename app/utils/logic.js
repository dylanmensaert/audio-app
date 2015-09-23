import Ember from 'ember';
import Inflector from 'ember-inflector';
import DS from 'ember-data';

function isMatch(value, query) {
    return query.trim().split(' ').every(function (queryPart) {
        return value.toLowerCase().includes(queryPart.toLowerCase());
    });
}

// TODO: rename logic file?
export default {
    isMatch: isMatch,
    find: function (modelName, query, searchOnline, pageToken) {
        var promise;

        if (!searchOnline) {
            promise = new Ember.RSVP.Promise(function (resolve) {
                var snippets = this.get('store').peekAll(modelName).filter(function (snippet) {
                    return isMatch(snippet.get('name'), query.query);
                });

                resolve(snippets);
            });
        } else {
            query.setNextPageToken = function (nextPageToken) {
                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            promise = new Ember.RSVP.Promise(function (resolve, reject) {
                this.get('store').query(modelName, query).then(function (snippets) {
                    if (!Ember.isEmpty(pageToken)) {
                        snippets.unshiftObjects(this.get(Inflector.inflector.pluralize(modelName)));
                    }

                    resolve(snippets);
                }.bind(this), reject);
            }.bind(this));
        }

        return DS.PromiseArray.create({
            promise: promise
        });
    }
};
