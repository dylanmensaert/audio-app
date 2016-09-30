import Ember from 'ember';
import DS from 'ember-data';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    find: function (modelName, options, searchOnline) {
        var store = this.get('store'),
            promise,
            promiseArray;

        if (!searchOnline) {
            promise = new Ember.RSVP.Promise(function (resolve) {
                var snippets;

                if (options.collectionId) {
                    snippets = store.peekRecord('collection', options.collectionId).get('trackIds').map(function (trackId) {
                        return store.peekRecord('track', trackId);
                    });
                } else {
                    snippets = store.peekAll(modelName).filter(function (snippet) {
                        return !snippet.get('permission') && logic.isMatch(snippet.get('name'), options.query);
                    });
                }

                resolve(snippets);
            });

            promiseArray = DS.PromiseArray.create({
                promise: promise
            });

        } else {
            options.setNextPageToken = function (nextPageToken) {
                this.set('nextPageToken', nextPageToken);
            }.bind(this);

            promiseArray = store.query(modelName, options);
        }

        return promiseArray;
    }
});
