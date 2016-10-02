import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    pushPayload: function(store, payload) {
        this._super(store, payload, 'track');
    },
    normalize: function(store, typeClass, item) {
        let id,
            track,
            data;

        if (item.id.videoId && item.id.videoId !== 'AAAAAAAAAAA') {
            id = item.id.videoId;
        } else if (item.snippet && item.snippet.resourceId && item.snippet.title !== 'Deleted video') {
            id = item.snippet.resourceId.videoId;
        } else if (typeof item.id === 'string') {
            id = item.id;
        }

        if (id) {
            track = this.peekSnippet(store, typeClass.modelName, id, item);

            if (!track.extension) {
                track.extension = 'mp3';
            }

            data = {
                type: typeClass.modelName,
                id: id,
                attributes: track
            };
        }

        return data;
    }
});
