import Inflector from 'ember-inflector';
import DS from 'ember-data';
import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    // TODO: sorting should not always be dependable by cache.searchDownloadedOnly. So pass extra param?
    sortSnippet: function(snippets, snippet, other, keepOriginalOrder) {
        var result = -1;

        if (keepOriginalOrder) {
            if (snippets.indexOf(snippet) > snippets.indexOf(other)) {
                result = 1;
            }
        } else if (snippet.get('name') > other.get('name')) {
            result = 1;
        }

        return result;
    },
    // TODO: implement as separate mixin since also needed in some routes/cache object?
    find: function(modelName, query, searchOnline, pageToken) {
        var promise;

        if (!searchOnline) {
            promise = new Ember.RSVP.Promise(function(resolve) {
                var snippets = this.get('store').peekAll(modelName).filter(function(snippet) {
                    return logic.isMatch(snippet.get('name'), query.query);
                });

                resolve(snippets);
            });
        } else {
            query.setNextPageToken = function(nextPageToken) {
                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            promise = new Ember.RSVP.Promise(function(resolve, reject) {
                this.get('store').query(modelName, query).then(function(snippets) {
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
});
