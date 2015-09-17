import Ember from 'ember';
import meta from 'meta-data';

// TODO: convert all functions to this format
function convertImageUrl(url) {
    return meta.imageHost + new URL(url).pathname;
}

export default Ember.Mixin.create({
    normalizeResponse: function(store, primaryModelClass, payload) {
        var data = payload.items.map(function(item) {
            return this.normalize(store, primaryModelClass, item);
        }.bind(this));

        return {
            data: data
        };
    },
    peekSnippet: function(store, modelName, id, item) {
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
    // TODO: implement
    serialize: function(snapshot) {
        return snapshot;
    }
});
