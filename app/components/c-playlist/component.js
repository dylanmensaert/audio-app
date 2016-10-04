import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';
import imageComponent from 'audio-app/components/c-image';

export default imageComponent.extend(modelMixin, {
    // TODO: add placeholder left and right to row of cells that can help fix cell width layout
    classNames: ['card'],
    classNameBindings: ['model.isSelected:my-active'],
    actions: {
        click: function() {
            this.sendAction('action', 'playlist', this.get('model'));
        }
    }
});
