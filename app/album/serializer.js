import snippetSerializer from 'audio-app/snippet/serializer';

export default snippetSerializer.extend({
    normalizeResponse: function (store, primaryModelClass, payload) {
        var data = payload.items.map(function (item) {
            var id = item.id.playlistId;

            return {
                type: primaryModelClass.modelName,
                id: id,
                attributes: this.peekSnippet(store, primaryModelClass.modelName, id, item)
            };
        }.bind(this));

        return {
            data: data
        };
    }
});
