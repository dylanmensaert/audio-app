import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    normalize: function(store, typeClass, item) {
        var id = item.id.playlistId;

        return {
            type: typeClass.modelName,
            id: id,
            attributes: this.peekSnippet(store, typeClass.modelName, id, item)
        };
    }
});
