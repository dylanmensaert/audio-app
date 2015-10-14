import ComponentMdl from 'audio-app/components/c-mdl';

// TODO: duplication with audio-collection/component
export default ComponentMdl.extend({
    classNameBindings: ['model.isSelected:my-active'],
    model: null,
    showQueued: false,
    didInsertElement: function() {
        var outerImage = this.$('.my-outer-image'),
            innerImage = this.$('.my-inner-image');

        // TODO: duplicate with mdl-layout/component
        outerImage.height(outerImage.width() / 30 * 17);
        innerImage.height(innerImage.width() / 12 * 9);
        innerImage.css('top', -Math.floor((innerImage.height() - outerImage.height()) / 2));

        this._super();
    },
    click: null,
    actions: {
        toggleIsSelected: function() {
            var model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('toggleIsSelected', model);
        },
        click: function() {
            this.sendAction('action', this.get('model'));
        }
    }
});
