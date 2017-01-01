import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';

export default Ember.Component.extend(modelMixin, {
    classNames: ['card'],
    classNameBindings: ['model.isSelected:my-active'],
    showSaved: null
});
