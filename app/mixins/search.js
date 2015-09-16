import Ember from 'ember';

export default Ember.Mixin.create({
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    updateOnlineSnippets: function (findSnippetsPromise, property, pageToken) {
        // TODO: check if searchDownloadedOnly is implemented correctly everywhere. Because I am using it kinda at random now.
        if (!this.get('cache.searchDownloadedOnly')) {
            this.set('isLoading', true);

            findSnippetsPromise.then(function (snippets) {
                if (Ember.isEmpty(pageToken)) {
                    this.set(property, snippets);
                } else {
                    this.get(property).pushObjects(snippets);
                }

                this.set('isLoading', false);
            }.bind(this));
        } else {
            this.set(property, []);
        }
    }
});
