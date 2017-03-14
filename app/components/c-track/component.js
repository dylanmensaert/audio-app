/*global navigator*/

import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.Component.extend(modelMixin, safeStyleMixin, {
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
    touchStart: function() {
        if (!this.get('model.isDisabled')) {
            this.set('isTouchHold', true);

            Ember.run.later(this, function() {
                if (this.get('isTouchHold')) {
                    navigator.vibrate(50);

                    this.send('changeSelect');
                }
            }, 500);
        }
    },
    touchMove: function() {
        this.set('isTouchHold', false);
    },
    touchEnd: function() {
        this.set('isTouchHold', false);
    },
    didInsertElement: function() {
        this.set('thumbnail', this.get('model.thumbnail'));
    },
    actions: {
        play: function() {
            this.sendAction('play', this.get('model'));
        }
    }
});
