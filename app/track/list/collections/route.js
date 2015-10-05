import Ember from 'ember';
import routeMixin from 'audio-app/mixins/route';
import routeTransitionMixin from 'audio-app/mixins/route-transition';

export default Ember.Route.extend(routeMixin, routeTransitionMixin, {
    title: 'Collections'
});