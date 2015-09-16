import Ember from 'ember';
import DS from 'ember-data';
import meta from 'meta-data';

// TODO: If POD structure works auto for Adapters, than make sure this file is not configured as an adapter -> implement as mixin?
export default DS.Adapter.extend({
    // TODO: really implement via cache object?
    cache: Ember.inject.service(),
    buildUrlByEndpoint: function (endpoint, maxResults, nextPageToken) {
        var url = meta.searchHost + '/youtube/v3/' + endpoint + '?part=snippet&maxResults=' + maxResults + '&key=' + meta.key;

        if (!Ember.isEmpty(nextPageToken)) {
            url += '&pageToken=' + nextPageToken;
        }

        return url;
    },
    buildUrlByType: function (type, query) {
        // TODO: Rename query.query property?
        return this.buildUrlByEndpoint('search', query.maxResults, query.nextPageToken) + '&order=viewCount&type=' + type + '&q=' + query.query;
    },
    query: function (store, type, query) {
        var url = this.buildUrl(type.modelName, null, null, 'query', query),
            cache = this.get('cache');

        return new Ember.RSVP.Promise(function (resolve, reject) {
            if (cache.get('searchDownloadedOnly')) {
                // TODO: implement
            } else {
                Ember.$.getJSON(url).then(function (payload) {
                    // TODO: search alternative for working with cache?
                    cache.set('nextPageToken', payload.nextPageToken);

                    resolve(payload);
                }, reject);
            }
        });
    }
});
