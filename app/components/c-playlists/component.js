import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    savablePlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved', false);
    }),
    savedPlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved');
    }),
    hideSaved: false,
    actions: {
        save: function() {
            let savablePlaylists = this.get('savablePlaylists'),
                length = savablePlaylists.get('length');

            if (length) {
                savablePlaylists.forEach(function(playlist) {
                    playlist.save();
                });

                this.get('utils').showMessage('Added locally (' + length + ')');
            }
        },
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
