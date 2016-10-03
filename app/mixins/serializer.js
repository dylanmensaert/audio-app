import Ember from 'ember';
import domainData from 'domain-data';

const sizes = ['maxres', 'standard', 'high', 'medium', 'default'];

function convertImageUrl(url) {
    return domainData.imageName + new URL(url).pathname;
}

function getUrlFor(thumbnails, index) {
    let image = thumbnails[sizes.objectAt(index)],
        url;

    if (image) {
        url = image.url;
    } else {
        index += 1;

        if (sizes.get('length') > index) {
            url = getUrlFor(thumbnails, index);
        }
    }

    return url;
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
                url = getUrlFor(thumbnails, 0),
                thumbnail;

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
