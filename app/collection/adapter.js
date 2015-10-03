import DS from 'ember-data';
import adapterMixin from 'audio-app/mixins/adapter';

export default DS.Adapter.extend(adapterMixin, {
    buildUrl: function(modelName, id, snapshot, requestType, options) {
        return this.buildUrlByType('playlist', options);
    },
    findRecord: function(store, type, id) {
        return this._super(store, type, id, 'playlists');
    }
});
