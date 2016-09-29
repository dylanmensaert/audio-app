import Ember from 'ember';
import linkMixin from 'audio-app/mixins/c-link';

export default Ember.Component.extend(linkMixin, {
    tagName: 'li',
    icon: null,
    value: null
});
