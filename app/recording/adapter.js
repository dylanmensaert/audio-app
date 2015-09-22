import DS from 'ember-data';
import Ember from 'ember';
import adapterMixin from 'audio-app/mixins/adapter';

export default DS.Adapter.extend(adapterMixin, {
    query: function(store, type, query) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this._super(store, type, query).then(function(payload) {
                var album;

                if (query.albumId) {
                    album = store.peekRecord('album', query.albumId);

                    if (album && !album.get('totalRecordings')) {
                        album.set('totalRecordings', payload.pageInfo.totalResults);
                    }
                }

                resolve(payload);
            }, reject);
        }.bind(this));
    },
    buildUrl: function(modelName, id, snapshot, requestType, query) {
        var url;

        if (query.albumId) {
            url = this.buildUrlByEndpoint('playlistItems', 50, query.nextPageToken) + '&playlistId=' + query.albumId;
        } else {
            url = this.buildUrlByType('video', query);
        }

        return url;
    }
});
