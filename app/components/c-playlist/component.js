import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';

export default Ember.Component.extend(modelMixin, {
    // TODO: add placeholder left and right to row of cells that can help fix cell width layout
    classNames: ['card'],
    classNameBindings: ['model.isSelected:my-active']
});
