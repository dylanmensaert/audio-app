import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    savedPlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved');
    }),
    actions: {
        delete: function() {
            let savedPlaylists = this.get('savedPlaylists'),
                length = savedPlaylists.get('length');

            if (length) {
                savedPlaylists.forEach(function(playlist) {
                    playlist.remove();
                });

                this.get('utils').showMessage('Removed locally (' + length + ')');
            }
        }
    }
});
