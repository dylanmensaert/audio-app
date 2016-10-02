import Ember from 'ember';
import domainData from 'domain-data';

function convertImageUrl(url) {
    return domainData.imageName + new URL(url).pathname;
}

export default Ember.Mixin.create({
    pushPayload: function(store, payload, modelName) {
        let id = payload.id;

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
        let data = [];

        payload.items.forEach(function(item) {
            let snippet = this.normalize(store, primaryModelClass, item);

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
        let snippet = store.peekRecord(modelName, id);

        if (snippet) {
            snippet = snippet.serialize();

            delete snippet.id;
        } else {
            let thumbnails = item.snippet.thumbnails,
                url,
                thumbnail;

            if (thumbnails.maxres && thumbnails.maxres.url) {
                url = thumbnails.maxres.url;
            } else if (thumbnails.maxres && thumbnails.standard.url) {
                url = thumbnails.standard.url;
            } else if (thumbnails.maxres && thumbnails.high.url) {
                url = thumbnails.high.url;
            } else if (thumbnails.maxres && thumbnails.medium.url) {
                url = thumbnails.medium.url;
            } else if (thumbnails.maxres && thumbnails.default.url) {
                url = thumbnails.default.url;
            }

            if (url) {
                thumbnail = convertImageUrl(url);
            }

            snippet = {
                name: item.snippet.title,
                thumbnail: thumbnail
            };
        }

        return snippet;
    }
});
