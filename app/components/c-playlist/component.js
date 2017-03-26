import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';

export default Ember.Component.extend(modelMixin, {
    classNames: ['card'],
    classNameBindings: ['model.isSelected:my-active'],
    isSubscribe: false,
    hideSaved: false,
    showSaved: Ember.computed('model.isSaved', 'hideSaved', function() {
        return this.get('model.isSaved') && !this.get('hideSaved');
    })
});
