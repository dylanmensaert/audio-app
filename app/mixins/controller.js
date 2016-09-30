import Ember from 'ember';
import searchMixin from 'audio-app/mixins/search';

export default Ember.Mixin.create(searchMixin, {
    utils: Ember.inject.service(),
    sortSnippet: function (snippets, snippet, other, keepGivenOrder) {
        var result = -1;

        if (keepGivenOrder) {
            if (snippets.indexOf(snippet) > snippets.indexOf(other)) {
                result = 1;
            }
        } else if (snippet.get('name') > other.get('name')) {
            result = 1;
        }

        return result;
    }
});
