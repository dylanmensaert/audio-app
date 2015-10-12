import Ember from 'ember';

export default Ember.Controller.extend({
    fileSystem: Ember.inject.service(),
    saveFileSystem: function () {
        this.get('fileSystem').save();
    }.observes('fileSystem.setDownloadedOnlyOnMobile', 'fileSystem.setDownloadLaterOnMobile', 'fileSystem.setDownloadBeforePlaying')
});
