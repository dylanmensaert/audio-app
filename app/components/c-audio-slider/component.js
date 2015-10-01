import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    tagName: 'input',
    classNames: ['mdl-slider', 'mdl-js-slider', 'my-audio-slider'],
    attributeBindings: ['type', 'min', 'max'],
    type: 'range',
    min: 0,
    max: 0,
    slider: null,
    didInsertElement: function() {
        var element = this.$(),
            slider = this.get('slider');

        this._super();

        element.on('input', function() {
            slider.set('value', element.val());

            slider.set('isDragged', true);
        }.bind(this));

        element.on('change', function() {
            slider.onSlideStop(element.val());

            slider.set('isDragged', false);
        }.bind(this));

        this.set('slider.component', this);
    },
    willDestroyElement: function() {
        var element = this.$();

        element.off('input');
        element.off('change');
    }
});
