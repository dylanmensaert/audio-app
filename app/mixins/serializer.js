import Ember from 'ember';
import meta from 'meta-data';

// TODO: convert all functions to this format
function convertImageUrl(url) {
    return meta.imageHost + new URL(url).pathname;
}

export default Ember.Mixin.create({
    pushPayload: function(store, payload, modelName) {
        var id = payload.id;

        delete payload.id;

        store.push({
            data: {
                type: modelName,
                id: id,
                attributes: payload
            }
        });
    },
    normalizeResponse: function(store, primaryModelClass, payload) {
        var data = [];

        payload.items.forEach(function(item) {
            var snippet = this.normalize(store, primaryModelClass, item);

            if (snippet) {
                data.pushObject(snippet);
            }
        }.bind(this));

        if (payload.deserializeSingleRecord) {
            data = data.get(0);
        }

        return {
            data: data
        };
    },
    peekSnippet: function(store, modelName, id, item) {
        var snippet = store.peekRecord(modelName, id);

        if (snippet) {
            snippet = snippet.serialize();

            delete snippet.id;
        } else {
            snippet = {
                name: item.snippet.title,
                // TODO: support higher resolutions (for desktop) when available?: standard, maxres
                thumbnail: convertImageUrl(item.snippet.thumbnails.high.url)
            };
        }

        return snippet;
    }
});
