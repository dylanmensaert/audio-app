import Ember from 'ember';
import DS from 'ember-data';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    find: function(modelName, options, searchOnline) {
        let store = this.store,
            promiseArray;

        if (searchOnline) {
            options.setNextPageToken = function(nextPageToken) {
                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            promiseArray = store.query(modelName, options);
        } else {
            let snippets;

            if (options.playlistId) {
                snippets = store.peekRecord('playlist', options.playlistId).get('trackIds').map(function(trackId) {
                    return store.peekRecord('track', trackId);
                });
            } else {
                snippets = store.peekAll(modelName).filter(function(snippet) {
                    return !snippet.get('permission') && logic.isMatch(snippet.get('name'), options.query);
                });
            }

            promiseArray = DS.PromiseArray.create({
                promise: Ember.RSVP.resolve(snippets)
            });
        }

        return promiseArray;
    }
});
