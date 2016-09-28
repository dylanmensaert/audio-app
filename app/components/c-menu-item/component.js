import Ember from 'ember';
import linkMixin from 'audio-app/mixins/c-link';

export default Ember.Component.extend(linkMixin, {
    tagName: 'a',
    classNames: ['mdl-navigation__link', 'my-menu-link'],
    icon: null,
    value: null
});
