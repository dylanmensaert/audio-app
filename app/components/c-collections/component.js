import Ember from 'ember';
import modelsMixin from 'audio-app/mixins/c-models';

export default Ember.Component.extend(modelsMixin, {
    isEveryUnsaved: Ember.computed('models.@each.isSaved', 'models.length', function() {
        return this.get('models').filterBy('isSaved', false).get('length') === this.get('models.length');
    }),
    isEverySaved: Ember.computed('models.@each.isSaved', 'models.length', function() {
        return this.get('models').filterBy('isSaved').get('length') === this.get('models.length');
    }),
    actions: {
        save: function() {
            this.get('models').forEach(function(collection) {
                collection.save();
            });
        },
        delete: function() {
            this.get('models').forEach(function(collection) {
                collection.destroy().then(function() {
                    collection.set('isSelected', false);
                });
            });
        }
    }
});
