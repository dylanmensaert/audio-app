import Ember from 'ember';

export default Ember.Mixin.create({
    onscroll: null,
    scroll: function(onscroll) {
        this.set('onscroll', onscroll);

        Ember.$(window).scroll(onscroll);
    },
    willDestroyElement: function() {
        let onscroll = this.get('onscroll');

        if (onscroll) {
            Ember.$(window).off('scroll', onscroll);
        }
    }
});
