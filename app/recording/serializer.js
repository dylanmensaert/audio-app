import snippetSerializer from 'audio-app/snippet/serializer';

export default snippetSerializer.extend({
    normalizeResponse: function (store, primaryModelClass, payload) {
        var data = payload.items.map(function (item) {
            var id,
                recording;

            if (item.id.videoId) {
                id = item.id.videoId;
            } else {
                id = item.snippet.resourceId.videoId;
            }

            recording = this.peekSnippet(store, primaryModelClass.modelName, id, item);

            if (!recording.id) {
                recording.extension = 'mp3';
            }

            return {
                type: primaryModelClass.modelName,
                id: id,
                attributes: recording
            };
        }.bind(this));

        return {
            data: data
        };
    }
});
