import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        download: function() {
            this.get('cache.selectedSnippets').forEach(function(snippet) {
                if (!snippet.get('isDownloaded') && !snippet.get('isDownloading')) {
                    snippet.download();
                }
            });
        }
    }
});
