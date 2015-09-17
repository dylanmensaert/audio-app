import DS from 'ember-data';
import adapterMixin from 'audio-app/mixins/adapter';

export default DS.Adapter.extend(adapterMixin, {
    buildUrl: function (modelName, id, snapshot, requestType, query) {
        var url;

        if (query.requestType === 'byAlbum') {
            url = this.buildUrlByEndpoint('playlistItems', 50, query.nextPageToken) + '&playlistId=' + query.albumId;
        } else {
            url = this.buildUrlByType('video', query);
        }

        return url;
    }
});
