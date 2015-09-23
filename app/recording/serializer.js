import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    normalize: function (store, typeClass, item) {
        var id,
            recording;

        if (item.id.videoId) {
            id = item.id.videoId;
        } else if (item.snippet.resourceId) {
            id = item.snippet.resourceId.videoId;
        } else {
            id = item.id;
        }

        recording = this.peekSnippet(store, typeClass.modelName, id, item);

        if (!recording.id) {
            recording.extension = 'mp3';
        }

        return {
            type: typeClass.modelName,
            id: id,
            attributes: recording
        };
    }
});
