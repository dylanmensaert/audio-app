import Ember from 'ember';

export default Ember.Mixin.create({
    searchDownloadedOnly: function () {
        return this.get('cache.isOffline') || (this.get('cache.isMobileConnection') && this.get('fileSystem.setDownloadedOnlyOnMobile'));
    }.property('cache.isOffline', 'cache.isMobileConnection', 'fileSystem.setDownloadedOnlyOnMobile'),
    updateOnlineSnippets: function (findSnippetsPromise, property, pageToken) {
        if (!this.get('searchDownloadedOnly')) {
            this.set('isLoading', true);

            findSnippetsPromise.then(function (snippets, nextPageToken) {
                if (Ember.isEmpty(pageToken)) {
                    this.set(property, snippets);
                } else {
                    this.get(property).pushObjects(snippets);
                }

                this.set('nextPageToken', nextPageToken);

                this.set('isLoading', false);
            }.bind(this));
        } else {
            this.set(property, []);
        }
    }
});
