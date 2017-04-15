/*global confirm*/
import Ember from 'ember';

export default Ember.Component.extend({
    utils: Ember.inject.service(),
    savablePlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved', false);
    }),
    savedPlaylists: Ember.computed('selectedModels.@each.isSaved', function() {
        return this.get('selectedModels').filterBy('isSaved');
    }),
    hideSaved: false,
    models: [],
    selectedModels: Ember.computed('models.@each.isSelected', function() {
        return this.get('models').filterBy('isSelected');
    }),
    deselect: function() {
        this.get('selectedModels').setEach('isSelected', false);
    },
    willDestroyElement: function() {
        this.deselect();
    },
    actions: {
        save: function() {
            let savablePlaylists = this.get('savablePlaylists'),
                length = savablePlaylists.get('length');

            if (length) {
                savablePlaylists.forEach(function(playlist) {
                    playlist.save();
                });

                this.get('utils').showMessage('Added locally (' + length + ')');
                this.deselect();
            }
        },
        delete: function() {
            let savedPlaylists = this.get('savedPlaylists'),
                length = savedPlaylists.get('length');

            if (length && confirm('Delete these playlists?')) {
                savedPlaylists.forEach(function(playlist) {
                    playlist.remove();
                });

                this.get('utils').showMessage('Removed locally (' + length + ')');
                this.deselect();
            }
        },
        deselect: function() {
            this.deselect();
        },
        didScrollToBottom: function() {
            this.sendAction('didScrollToBottom');
        }
    }
});
