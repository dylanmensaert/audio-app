import DS from 'ember-data';
import adapterMixin from 'audio-app/mixins/adapter';

export default DS.Adapter.extend(adapterMixin, {
    buildUrl: function (modelName, id, snapshot, requestType, query) {
        return this.buildUrlByType('playlist', query);
    }
});
