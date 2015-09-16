import DS from 'ember-data';
import meta from 'meta-data';

// TODO: convert all functions to this format
function convertImageUrl(url) {
    return meta.imageHost + new URL(url).pathname;
}

// TODO: If POD structure works auto for Serializers, than make sure this file is not configured as a Serializer -> implement as mixin?
export default DS.Serializer.extend({
    isNewSerializerAPI: true,
    peekSnippet: function (store, modelName, id, item) {
        var snippet = store.peekRecord(modelName, id);

        if (snippet) {
            snippet = snippet.strip();
        } else {
            snippet = {
                name: item.snippet.title,
                thumbnail: convertImageUrl(item.snippet.thumbnails.high.url)
            };
        }

        return snippet;
    },
    serialize: function (record) {
        return record;
    }
});
