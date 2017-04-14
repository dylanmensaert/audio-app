import Ember from 'ember';

export default Ember.Object.extend({
    init: function() {
        this._super();

        this.set('elements', []);
    },
    elements: null,
    value: null,
    max: 1,
    isDragged: false,
    onSlideStop: null,
    setValue: function(value) {
        if (!this.get('isDragged')) {
            this.get('elements').forEach(function(element) {
                element.noUiSlider.set(value);
            });
        }
    },
    updateMax: Ember.observer('max', function() {
        this.get('elements').forEach(function(element) {
            element.noUiSlider.updateOptions({
                range: {
                    min: 0,
                    max: this.get('max')
                }
            });
        }.bind(this));
    })
});
