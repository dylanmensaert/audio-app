import Ember from 'ember';
import ComponentModel from 'audio-app/components/c-model';

export default ComponentModel.extend({
    // TODO: add placeholder left and right to row of cells that can help fix cell width layout
    classNames: ['mdl-cell', 'mdl-cell--2-col-phone', 'mdl-cell--2-col-tablet', 'mdl-cell--3-col-desktop', 'my-card-cell'],
    classNameBindings: ['model.isSelected:my-active'],
    // TODO: implement correct statusses
    hasStatus: Ember.computed('model.isPlaying', 'showQueued', 'model.isDownloading', 'model.isDownloaded', function() {
        return this.get('model.isPlaying') || this.get('showQueued') || this.get('model.isDownloading') || this.get('model.isDownloaded');
    }),
    actions: {
        click: function() {
            this.sendAction('action', 'collection', this.get('model'));
        }
    }
});
