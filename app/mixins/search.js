import Ember from 'ember';
import DS from 'ember-data';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

export default Ember.Mixin.create({
    find: function(modelName, options) {
        let store = this.store,
            findOnline,
            findOffline;

        findOnline = function() {
            options.setNextPageToken = function(nextPageToken) {
                if (!nextPageToken) {
                    nextPageToken = null;
                }

                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            return store.query(modelName, options);
        };

        findOffline = function() {
            let snippets = store.peekAll(modelName).filter(function(snippet) {
                return !snippet.get('permission') && logic.isMatch(snippet.get('name'), options.query);
            });

            return Ember.RSVP.resolve(snippets);
        };

        return DS.PromiseArray.create({
            promise: connection.resolve(findOnline, findOffline)
        });
    }
});
