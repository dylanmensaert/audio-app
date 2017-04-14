/* global noUiSlider */
import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['slider', 'my-slider'],
    attributeBindings: ['disabled'],
    // TODO: enable
    disabled: true,
    slider: null,
    didInsertElement: function() {
        let slider = this.get('slider'),
            element = this.get('element');

        noUiSlider.create(element, {
            start: 0,
            range: {
                min: 0,
                max: slider.get('max')
            },
            connect: 'lower'
        });

        element.noUiSlider.on('slide', function() {
            slider.set('value', element.noUiSlider.get());

            if (!slider.get('isDragged')) {
                slider.set('isDragged', true);
            }
        });

        element.noUiSlider.on('set', function() {
            slider.set('value', element.noUiSlider.get());
        });

        element.noUiSlider.on('change', function() {
            slider.onSlideStop(element.noUiSlider.get());

            slider.set('isDragged', false);
        });

        slider.get('elements').pushObject(element);
    },
    willDestroyElement: function() {
        this.get('element').noUiSlider.destroy();
    }
});
