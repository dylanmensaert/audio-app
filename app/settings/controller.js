import Ember from 'ember';

export default Ember.Controller.extend({
    fileSystem: Ember.inject.service(),
    saveFileSystem: Ember.observer('fileSystem.downloadLater', 'fileSystem.downloadBeforePlaying',
        function() {
            this.get('fileSystem').save();
        }
    )
});
