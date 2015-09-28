import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    normalize: function (store, typeClass, item) {
        var id,
            track;

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

        return {
            type: typeClass.modelName,
            id: id,
            attributes: track
        };
    }
});
