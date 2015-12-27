import ComponentMdl from 'audio-app/components/c-mdl';
import logic from 'audio-app/utils/logic';

export default ComponentMdl.extend({
    model: null,
    showQueued: false,
    click: null,
    didInsertElement: function() {
        var outerImage = this.$('.my-outer-image'),
            innerImage = this.$('.my-inner-image');

        logic.setOuterHeight(outerImage);
        logic.setInnerHeight(innerImage);

        logic.setTop(innerImage, outerImage.height());

        this._super();
    },
    actions: {
        toggleIsSelected: function() {
            var model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('toggleIsSelected', model);
        }
    }
});
