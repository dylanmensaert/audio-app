import Ember from 'ember';

export default Ember.Object.extend({
    component: null,
    value: null,
    max: null,
    isDragged: false,
    onSlideStop: null,
    setValue: function(value) {
        if (!this.get('isDragged')) {
            this.get('component.element').MaterialSlider.change(value);
        }
    },
    updateMax: function() {
        this.set('component.max', this.get('max'));
    }.observes('max')
});
