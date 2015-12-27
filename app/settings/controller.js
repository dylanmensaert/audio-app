import Ember from 'ember';

export default Ember.Controller.extend({
    fileSystem: Ember.inject.service(),
    saveFileSystem: Ember.observer('fileSystem.setDownloadedOnlyOnMobile', 'fileSystem.setDownloadLaterOnMobile', 'fileSystem.setDownloadBeforePlaying',
        function() {
            this.get('fileSystem').save();
        }
    )
});
