import DS from 'ember-data';
import Ember from 'ember';
import adapterMixin from 'audio-app/mixins/adapter';
import logic from 'audio-app/utils/logic';

export default DS.Adapter.extend(adapterMixin, {
    query: function(store, type, options) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this._super(store, type, options).then(function(payload) {
                let collection;

                if (options.collectionId) {
                    collection = store.peekRecord('collection', options.collectionId);

                    if (collection && !collection.get('totalTracks')) {
                        collection.set('totalTracks', payload.pageInfo.totalResults);
                    }
                }

                resolve(payload);
            }, reject);
        }.bind(this));
    },
    buildUrl: function(modelName, id, snapshot, requestType, options) {
        let url;

        if (options.collectionId) {
            options.maxResults = logic.maxResults;

            url = this.buildUrlByEndpoint('playlistItems', options) + '&playlistId=' + options.collectionId;
        } else {
            url = this.buildUrlByType('video', options);

            if (options.relatedVideoId) {
                url += '&relatedToVideoId=' + options.relatedVideoId;
            }
        }

        return url;
    },
    findRecord: function(store, type, id) {
        return this._super(store, type, id, 'videos');
    }
});
