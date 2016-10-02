import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    model: null,
    showQueued: false,
    click: null,
    didInsertElement: function() {
        let outerImage = this.$('.my-outer-image'),
            innerImage = this.$('.my-inner-image');

        logic.setOuterHeight(outerImage);
        logic.setInnerHeight(innerImage);

        logic.setTop(innerImage, outerImage.height());

        this._super();
    },
    actions: {
        changeSelect: function() {
            let model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('changeSelect', model);
        }
    }
});
