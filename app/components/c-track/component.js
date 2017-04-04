/*global Hammer*/

import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.Component.extend(modelMixin, safeStyleMixin, {
    classNames: ['waves-effect', 'waves-block'],
    classNameBindings: ['model.isActive:my-track--active', 'model.isDisabled:my-track--disabled'],
    style: Ember.computed('model.isDisabled', function() {
        let style;

        if (this.get('model.isDisabled')) {
            style = 'opacity: 0.4;';
        }

        return style;
    }),
    thumbnail: null,
    isTouchHold: null,
    startCoordinates: null,
    hideDownloaded: false,
    showDownloaded: Ember.computed('model.isDownloaded', 'hideDownloaded', function() {
        return this.get('model.isDownloaded') && !this.get('hideDownloaded');
    }),
    didInsertElement: function() {
        this.set('thumbnail', this.get('model.thumbnail'));

        new Hammer(this.$()[0]).on('press', function() {
            this.send('changeSelect');
        }.bind(this));
    },
    isPlaying: Ember.computed('model.isPlaying', 'isActive', function() {
        return this.get('model.isPlaying') && this.get('isActive');
    }),
    actions: {
        play: function() {
            let track = this.get('model');

            if (!track.get('isDisabled')) {
                this.sendAction('play', track);
            }
        }
    }
});
