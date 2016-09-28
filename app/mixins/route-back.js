import Ember from 'ember';
import registerRouteMixin from 'audio-app/mixins/route-register';

export default Ember.Mixin.create(registerRouteMixin, {
    actions: {
        back: function() {
            let history = this.get('utils.history'),
                removeLast,
                previousTransition;

            removeLast = function() {
                history.removeAt(history.get('length') - 1);
            };

            if (history.get('length') >= 2) {
                removeLast();
                previousTransition = history.get('lastObject');
                removeLast();

                this.transitionTo.apply(this, previousTransition);
            } else {
                this.transitionTo('index');
            }
        }
    }
});
