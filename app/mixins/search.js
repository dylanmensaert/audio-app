import pluralize from 'ember-inflector';
import DS from 'ember-data';
import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    // TODO: implement as separate mixin since also needed in some routes?
    find: function(modelName, query, pageToken) {
        var result,
            promise;

        if (this.get('cache.searchDownloadedOnly')) {
            result = this.get('store').peekAll(modelName).filter(function(snippet) {
                return logic.isMatch(snippet.get('name'), query.query);
            });
        } else {
            query.setNextPageToken = function(nextPageToken) {
                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            promise = new Ember.RSVP.Promise(function(resolve, reject) {
                this.get('store').query(modelName, query).then(function(snippets) {
                    if (!Ember.isEmpty(pageToken)) {
                        snippets.unshiftObjects(this.get(pluralize(modelName)));
                    }

                    resolve(snippets);
                }.bind(this), reject);
            }.bind(this));

            result = DS.PromiseArray.create({
                promise: promise
            });
        }

        return result;
    }
});
