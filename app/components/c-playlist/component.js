import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';

export default Ember.Component.extend(modelMixin, {
    classNames: ['card'],
    classNameBindings: ['isSelected:my-active', 'isSubscribe:my-playlist-subscribe'],
    isSubscribe: false,
    isSelected: Ember.computed('model.isSelected', 'isSubscribe', function() {
        return this.get('model.isSelected') && !this.get('isSubscribe');
    })
});
