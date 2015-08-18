/* global componentHandler: true */
import MyMdlComponent from 'audio-app/components/my-mdl';

export default MyMdlComponent.extend({
    willDestroyElement: function () {
        // TODO: Uncaught Error: Invalid argument provided to downgrade MDL nodes.
        componentHandler.downgradeElements(this.$().closest('.mdl-layout')[0]);
    }
});
