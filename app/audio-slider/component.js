import MdlComponent from 'audio-app/components/mdl-component';

export default MdlComponent.extend({
    tagName: 'input',
    classNames: ['mdl-slider', 'mdl-js-slider', 'my-slider'],
    attributeBindings: ['type', 'min', 'max', 'value'],
    type: 'range',
    min: 0,
    max: 0,
    value: 0,
    slider: null,
    didInsertElement: function () {
        var element = this.$(),
            slider = this.get('slider');

        element.on('input', function () {
            slider.set('value', element.val());

            slider.set('isDragged', true);
        }.bind(this));

        element.on('change', function () {
            slider.onSlideStop(element.val());

            slider.set('isDragged', false);
        }.bind(this));

        this.set('slider.component', this);

        this._super();
    },
    willDestroyElement: function () {
        var element = this.$();

        element.off('input');
        element.off('change');
    }
});
