import DS from 'ember-data';
import Ember from 'ember';
import adapterMixin from 'audio-app/mixins/adapter';
import logic from 'audio-app/utils/logic';

export default DS.Adapter.extend(adapterMixin, {
    query: function(store, type, options) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this._super(store, type, options).then(function(payload) {
                let playlist;

                if (options.playlistId) {
                    playlist = store.peekRecord('playlist', options.playlistId);

                    if (playlist && !playlist.get('totalTracks')) {
                        playlist.set('totalTracks', payload.pageInfo.totalResults);
                    }
                }

                resolve(payload);
            }, reject);
        }.bind(this));
    },
    buildUrl: function(modelName, id, snapshot, requestType, options) {
        let url;

        if (options.playlistId) {
            options.maxResults = logic.maxResults;

            url = this.buildUrlByEndpoint('playlistItems', options) + '&playlistId=' + options.playlistId;
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
