/* global Math: true */
import ComponentMdl from 'audio-app/components/c-mdl';

// TODO: duplication with audio-collection/component
export default ComponentMdl.extend({
    classNames: ['my-track'],
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
    doClick: false,
    startPosition: null,
    resetPosition: function() {
        this.$('.my-track-draggable').animate({
            left: 0
        });

        this.set('startPosition', null);
    },
    mouseDown: function(event) {
        this.set('startPosition', event.clientX);

        this.set('doClick', false);
    },
    mouseUp: function(event) {
        var left = event.clientX - this.get('startPosition'),
            action;

        if (left === 0) {
            this.set('doClick', true);
        } else {
            if (left > 0) {
                action = 'swipeRight';
            } else {
                action = 'swipeLeft';
            }

            this.sendAction(action, this.get('model'));
        }

        this.resetPosition();
    },
    mouseMove: function(event) {
        var left;

        if (this.get('startPosition')) {
            left = event.clientX - this.get('startPosition');

            if (left !== 0 && Math.abs(left) <= 60) {
                this.$('.my-track-draggable').css('left', left);
            }
        }
    },
    mouseLeave: function() {
        if (this.get('startPosition')) {
            this.resetPosition();
        }
    },
    click: null,
    actions: {
        toggleIsSelected: function() {
            var model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('toggleIsSelected', model);
        },
        click: function() {
            if (this.get('doClick')) {
                this.sendAction('action', this.get('model'));
            }
        }
    }
});
