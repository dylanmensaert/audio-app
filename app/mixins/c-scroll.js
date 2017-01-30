import Ember from 'ember';

export default Ember.Mixin.create({
    utils: Ember.inject.service(),
    onscroll: null,
    scroll: function(callback) {
        let onscroll = callback.bind(this);

        this.set('onscroll', onscroll);

        this.get('utils.scrolls').pushObject(onscroll);
    },
    willDestroyElement: function() {
        this.get('utils.scrolls').removeObject(this.get('onscroll'));
    }
});
