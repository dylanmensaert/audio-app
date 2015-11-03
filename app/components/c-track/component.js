/* global Math: true */
import ComponentMdl from 'audio-app/components/c-mdl';

// TODO: duplication with audio-collection/component
export default ComponentMdl.extend({
    classNames: ['my-track'],
    model: null,
    showQueued: false,
    didInsertElement: function () {
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
    lastPosition: null,
    action: null,
    resetPosition: function () {
        this.$('.my-track-draggable').animate({
            left: 0
        });

        this.set('startPosition', null);
    },
    mouseDown: function (event) {
        this.set('startPosition', event.clientX);
        this.get('lastPosition', event.clientX);

        this.set('doClick', false);
    },
    mouseUp: function (event) {
        var left = event.clientX - this.get('startPosition');

        if (left === 0) {
            this.set('doClick', true);
        } else if (Math.abs(left) >= 80) {
            this.sendAction(this.get('action'), this.get('model'));
        }

        this.resetPosition();
    },
    mouseMove: function (event) {
        var startPosition = this.get('startPosition'),
            left,
            action,
            currentAction,
            newPosition;

        if (startPosition) {
            left = event.clientX - startPosition;
            action = this.get('action');

            if (this.get('lastPosition') > event.clientX) {
                currentAction = 'swipeRight';
            } else {
                currentAction = 'swipeLeft';
            }

            if (Math.abs(left) <= 80) {
                this.$('.my-track-draggable').css('left', left);
            } else if (action !== currentAction) {
                if (left > 0) {
                    newPosition = event.clientX - 80;
                } else if (left < 0) {
                    newPosition = event.clientX + 80;
                }

                this.set('startPosition', newPosition);

                this.$('.my-track-draggable').css('left', event.clientX - newPosition);
            }

            this.set('lastPosition', event.clientX);
            this.set('action', currentAction);
        }
    },
    mouseLeave: function () {
        if (this.get('startPosition')) {
            this.resetPosition();
        }
    },
    click: null,
    actions: {
        toggleIsSelected: function () {
            var model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('toggleIsSelected', model);
        },
        click: function () {
            if (this.get('doClick')) {
                this.sendAction('action', this.get('model'));
            }
        }
    }
});
