import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    // TODO: sorting should not always be dependable by cache.getIsOfflineMode(). So pass extra param?
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
    },
    find: function () {
        return logic.find.apply(this, arguments);
    }
});
