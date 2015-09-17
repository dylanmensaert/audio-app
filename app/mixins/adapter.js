import Ember from 'ember';
import meta from 'meta-data';

export default Ember.Mixin.create({
    // TODO: really implement via cache object?
    cache: Ember.inject.service(),
    buildUrlByEndpoint: function(endpoint, maxResults, nextPageToken) {
        var url = meta.searchHost + '/youtube/v3/' + endpoint + '?part=snippet&maxResults=' + maxResults + '&key=' + meta.key;

        if (!Ember.isEmpty(nextPageToken)) {
            url += '&pageToken=' + nextPageToken;
        }

        return url;
    },
    buildUrlByType: function(type, query) {
        // TODO: Rename query.query property?
        return this.buildUrlByEndpoint('search', query.maxResults, query.nextPageToken) + '&order=viewCount&type=' + type + '&q=' + query.query;
    },
    query: function(store, type, query) {
        var url = this.buildUrl(type.modelName, null, null, 'query', query);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url).then(function(payload) {
                // TODO: search alternative for working with cache?
                /*cache.set('nextPageToken', payload.nextPageToken);*/

                query.setNextPageToken(payload.nextPageToken);

                Ember.run(null, resolve, payload);
            }, function(response) {
                Ember.run(null, reject, response);
            });
        });
    }
});
