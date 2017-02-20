import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    unsavedPlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved', false);
    }),
    savedPlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved');
    }),
    showSaved: true,
    actions: {
        save: function() {
            let unsavedPlaylists = this.get('unsavedPlaylists'),
                length = unsavedPlaylists.get('length');

            if (length) {
                this.get('unsavedPlaylists').forEach(function(playlist) {
                    playlist.save();
                });

                this.get('utils').showMessage('Saved locally');
            }
        },
        delete: function() {
            let savedPlaylists = this.get('savedPlaylists'),
                length = savedPlaylists.get('length');

            if (length) {
                savedPlaylists.forEach(function(playlist) {
                    playlist.remove();
                });

                this.get('utils').showMessage('Removed locally');
            }
        }
    }
});
