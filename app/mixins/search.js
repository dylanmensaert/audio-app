import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    // TODO: implement as separate mixin since also needed in some routes?
    find: function (modelName, snippets, query) {
        if (this.get('cache.searchDownloadedOnly')) {
            snippets = this.get('store').peekAll(modelName).filter(function (snippet) {
                return logic.isMatch(snippet.get('name'), query.query);
            });
        } else {
            this.set('isLoading', true);

            this.get('store').query(modelName, query).then(function (loadedSnippets) {
                if (Ember.isEmpty(this.get('cache.nextPageToken'))) {
                    snippets = loadedSnippets;
                } else {
                    snippets.pushObjects(loadedSnippets);
                }

                this.set('isLoading', false);
            }.bind(this));
        }

        return snippets;
    }
});
