import DS from 'ember-data';
import Ember from 'ember';
import adapterMixin from 'audio-app/mixins/adapter';

export default DS.Adapter.extend(adapterMixin, {
    query: function (store, type, query) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            this._super(store, type, query).then(function (payload) {
                var collection;

                if (query.collectionId) {
                    collection = store.peekRecord('collection', query.collectionId);

                    if (collection && !collection.get('totalTracks')) {
                        collection.set('totalTracks', payload.pageInfo.totalResults);
                    }
                }

                resolve(payload);
            }, reject);
        }.bind(this));
    },
    buildUrl: function (modelName, id, snapshot, requestType, query) {
        var url;

        if (query.collectionId) {
            url = this.buildUrlByEndpoint('playlistItems', 50, query.nextPageToken) + '&playlistId=' + query.collectionId;
        } else {
            url = this.buildUrlByType('video', query);
        }

        return url;
    },
    findRecord: function (store, type, id) {
        return this._super(store, type, id, 'videos');
    }
});
