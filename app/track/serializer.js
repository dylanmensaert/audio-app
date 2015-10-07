import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    pushPayload: function(store, payload) {
        this._super(store, payload, 'track');
    },
    normalize: function(store, typeClass, item) {
        var id,
            track,
            data;

        if (item.snippet.title !== 'Deleted video') {
            if (item.id.videoId) {
                id = item.id.videoId;
            } else if (item.snippet.resourceId) {
                id = item.snippet.resourceId.videoId;
            } else {
                id = item.id;
            }

            track = this.peekSnippet(store, typeClass.modelName, id, item);

            if (!track.id) {
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
