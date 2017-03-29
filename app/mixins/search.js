import Ember from 'ember';
import DS from 'ember-data';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

export default Ember.Mixin.create({
    hasNextPageToken: Ember.computed('nextPageToken', function() {
        return this.get('nextPageToken') !== null;
    }),
    find: function(modelName, givenOptions) {
        let findOnline,
            findOffline;

        findOnline = function() {
            let options = {
                maxResults: logic.maxResults,
                nextPageToken: this.get('nextPageToken'),
                setNextPageToken: function(nextPageToken) {
                    if (!nextPageToken) {
                        nextPageToken = null;
                    }

                    this.set('nextPageToken', nextPageToken);
                }.bind(this)
            };

            return this.store.query(modelName, Object.assign(options, givenOptions)).then(function(promiseArray) {
                return promiseArray.toArray();
            });
        }.bind(this);

        findOffline = function() {
            let snippets = this.store.peekAll(modelName).filter(function(snippet) {
                return !snippet.get('permission') && logic.isMatch(snippet.get('name'), givenOptions.query);
            });

            return Ember.RSVP.resolve(snippets);
        }.bind(this);

        return DS.PromiseArray.create({
            promise: connection.resolve(findOnline, findOffline)
        });
    }
});
