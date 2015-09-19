import Ember from 'ember';

export default Ember.Mixin.create({
    selected: null,
    originals: null,
    isEditMode: false,
    editAlbum: null,
    // TODO: sorting should not always be dependable by cache.searchDownloadedOnly. So pass extra param?
    sortSnippet: function(snippets, snippet, other, orderByName) {
        var result = -1;

        if (orderByName) {
            if (snippet.get('name') > other.get('name')) {
                result = 1;
            }
        } else if (snippets.indexOf(snippet) > snippets.indexOf(other)) {
            result = 1;
        }

        return result;
    },
    actions: {
        remove: function() {
            var originals = this.get('originals');

            this.get('selected').forEach(function(model) {
                originals.removeObject(model);
            });
        },
        setupEdit: function() {
            var name = this.get('selected.firstObject.name');

            this.set('liveQuery', name);
            this.set('editAlbum', 'Edit: ' + name);
            this.set('isEditMode', true);
        },
        saveEdit: function() {
            var singleSelected = this.get('selected.firstObject');

            singleSelected.set('name', this.get('liveQuery'));

            if (!this.get('originals').isAny('id', singleSelected.get('id'))) {
                this.get('originals').pushObject(singleSelected);
            }

            this.send('exitEdit');
        },
        exitEdit: function() {
            this.set('liveQuery', '');
            this.set('isEditMode', false);
        }
    }
});
