import Ember from 'ember';
import clickMixin from 'audio-app/mixins/c-click';

export default Ember.Mixin.create(clickMixin, {
    param: null,
    isAsync: true,
    onClick: function() {
        let param = this.get('param');

        if (this.get('isAsync')) {
            this.sendAction('action', this.resolve.bind(this), param);
        } else {
            if (this.get('action')) {
                this.sendAction('action', param);
            }

            this.resolve();
        }
    }
});
