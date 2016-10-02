import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    pushPayload: function(store, payload) {
        this._super(store, payload, 'collection');
    },
    normalize: function(store, typeClass, item) {
        let id;

        if (item.id.playlistId) {
            id = item.id.playlistId;
        } else {
            id = item.id;
        }

        return {
            type: typeClass.modelName,
            id: id,
            attributes: this.peekSnippet(store, typeClass.modelName, id, item)
        };
    }
});
