/* global Materialize */
import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create({
    attributeBindings: ['style'],
    style: Ember.String.htmlSafe('opacity: 0;'),
    model: null,
    showQueued: false,
    click: null,
    didInsertElement: function() {
        let element = this.$(),
            overlay = logic.getWindowOverlayWith(element),
            fadeIn;

        fadeIn = function() {
            Materialize.fadeInImage(element);
        };

        if (overlay.isVisible) {
            fadeIn();
        } else {
            let options = [{
                selector: '#' + element.attr('id'),
                offset: 0,
                callback: fadeIn
            }];

            Materialize.scrollFire(options);
        }
    },
    actions: {
        changeSelect: function() {
            let model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('changeSelect', model);
        }
    }
});
