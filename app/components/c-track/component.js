import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.Component.extend(modelMixin, safeStyleMixin, {
    classNameBindings: ['model.isActive:my-track--active', 'model.isDisabled:my-track--disabled'],
    audioRemote: Ember.inject.service(),
    style: Ember.computed('model.isDisabled', function() {
        let style;

        if (this.get('model.isDisabled')) {
            style = 'opacity: 0.4;';
        }

        return style;
    }),
    thumbnail: null,
    taphold: null,
    didInsertElement: function() {
        let track = this.get('model'),
            taphold;

        taphold = function() {
            if (!track.get('isDisabled')) {
                this.changeSelect();
            }
        }.bind(this);

        this.set('thumbnail', track.get('thumbnail'));

        this.$().on('taphold', taphold);
        this.set('taphold', taphold);
    },
    willDestroyElement: function() {
        let taphold = this.get('taphold');

        if (taphold) {
            this.$().off('taphold', taphold);
        }
    },
    actions: {
        play: function() {
            let track = this.get('model');

            if (!track.get('isDisabled')) {
                this.get('audioRemote').play(track);
            }
        }
    }
});
