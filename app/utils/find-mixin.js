import Ember from 'ember';

export default Ember.Mixin.create({
    searchDownloadedOnly: function () {
        return this.get('cache.isOffline') || (this.get('cache.isMobileConnection') && this.get('fileSystem.setDownloadedOnlyOnMobile'));
    }.property('cache.isOffline', 'cache.isMobileConnection', 'fileSystem.setDownloadedOnlyOnMobile'),
    updateOnlineSnippets: function (findSnippetsPromise, property, nextPageToken) {
        var snippets = [],
            url;

        if (!this.get('searchDownloadedOnly')) {
            this.set('isLoading', true);

            findSnippetsPromise.then(function (snippets) {
                if (Ember.isEmpty(nextPageToken)) {
                    this.set(property, snippets);
                } else {
                    this.get(property).pushObjects(snippets);
                }

                if (Ember.isEmpty(response.nextPageToken)) {
                    nextPageToken = null;
                } else {
                    nextPageToken = response.nextPageToken;
                }

                this.set('nextPageToken', nextPageToken);

                this.set('isLoading', false);
            });
        } else {
            this.set(property, snippets);
        }
    }
});
