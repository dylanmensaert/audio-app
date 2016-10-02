import Ember from 'ember';

export default Ember.Object.extend({
    element: null,
    value: null,
    max: 1,
    isDragged: false,
    onSlideStop: null,
    setValue: function(value) {
        if (!this.get('isDragged')) {
            this.get('element').noUiSlider.set(value);
        }
    },
    updateMax: Ember.observer('max', function() {
        this.get('element').noUiSlider.updateOptions({
            range: {
                min: 0,
                max: this.get('max')
            }
        });
    })
});
