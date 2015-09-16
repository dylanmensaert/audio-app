import snippetAdapter from 'audio-app/snippet/adapter';

export default snippetAdapter.extend({
    buildUrl: function (modelName, id, snapshot, requestType, query) {
        return this.buildUrlByType('playlist', query);
    }
});
