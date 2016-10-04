import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    didInsertElement: function() {
        let outerImage = this.$('.my-outer-image'),
            innerImage = this.$('.my-inner-image');

        logic.setOuterHeight(outerImage);
        logic.setInnerHeight(innerImage);

        logic.setTop(innerImage, outerImage.height());

        this._super();
    }
});
