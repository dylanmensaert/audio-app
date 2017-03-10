import Ember from 'ember';
import DS from 'ember-data';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

export default Ember.Mixin.create({
    hasNextPageToken: Ember.computed('nextPageToken', function() {
        return this.get('nextPageToken') !== null;
    }),
    find: function(modelName, options) {
        let findOnline,
            findOffline;

        findOnline = function() {
            options.setNextPageToken = function(nextPageToken) {
                if (!nextPageToken) {
                    nextPageToken = null;
                }

                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            return this.store.query(modelName, options);
        }.bind(this);

        findOffline = function() {
            let snippets = this.store.peekAll(modelName).filter(function(snippet) {
                return !snippet.get('permission') && logic.isMatch(snippet.get('name'), options.query);
            });

            return Ember.RSVP.resolve(snippets);
        }.bind(this);

        return DS.PromiseArray.create({
            promise: connection.resolve(findOnline, findOffline)
        });
    }
});
