import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    actions: {
        download: function () {
            // TODO: use cache.selectedSnippets instead? Not sure since also used to pass album to route at the moment.
            this.get('cache.selectedRecordings').forEach(function (recording) {
                if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                    recording.download();
                }
            });
        }
    }
});
