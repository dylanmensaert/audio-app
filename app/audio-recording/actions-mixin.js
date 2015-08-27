import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        download: function() {
            this.get('cache.selectedRecordings').forEach(function(recording) {
                if (!recording.get('isDownloaded') && !recording.get('isDownloading')) {
                    recording.download();
                }
            });
        }
    }
});
