/* global componentHandler: true */
import MyMdlComponent from 'audio-app/components/my-mdl';

export default MyMdlComponent.extend({
    didInsertElement: function () {
        this._super();

        componentHandler.upgradeElement(this.$().closest('.mdl-layout')[0]);
    },
    willDestroyElement: function () {
        // TODO: https://github.com/google/material-design-lite/issues/1340
        // componentHandler.downgradeElements(this.$().closest('.mdl-layout')[0]);
        this.$().closest('.mdl-layout').removeAttr('data-upgraded');
    }
});
