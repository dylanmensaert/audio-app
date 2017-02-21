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
    didInsertElement: function() {
        this.set('thumbnail', this.get('model.thumbnail'));
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
