import DS from 'ember-data';
import serializerMixin from 'audio-app/mixins/serializer';

export default DS.Serializer.extend(serializerMixin, {
    normalizeResponse: function (store, primaryModelClass, payload) {
        var data = payload.items.map(function (item) {
            var id = item.id.playlistId;

            return {
                type: primaryModelClass.modelName,
                id: id,
                attributes: this.peekSnippet(store, primaryModelClass.modelName, id, item)
            };
        }.bind(this));

        return {
            data: data
        };
    }
});
