/*global navigator, Hammer*/

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
            navigator.vibrate(50);

            this.send('changeSelect');
        }.bind(this));
    },
    actions: {
        play: function() {
            //this.sendAction('play', this.get('model'));
            this.send('changeSelect');
        }
    }
});
