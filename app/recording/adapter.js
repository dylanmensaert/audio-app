import snippetAdapter from 'audio-app/snippet/adapter';

export default snippetAdapter.extend({
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
