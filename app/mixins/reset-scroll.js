/*global window*/
import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        didTransition: function() {
            this._super();

            window.scrollTo(0, 0);
            Ember.$(window).scroll();
        }
    }
});
