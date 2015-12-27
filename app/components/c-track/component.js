/* global Math: true */
import ComponentModel from 'audio-app/components/c-model';

export default ComponentModel.extend({
    classNames: ['my-track'],
    doClick: false,
    startPosition: null,
    lastPosition: null,
    action: null,
    resetPosition: function() {
        this.$('.my-track-draggable').animate({
            left: 0
        });

        this.set('startPosition', null);
    },
    mouseDown: function(event) {
        this.set('startPosition', event.clientX);
        this.get('lastPosition', event.clientX);

        this.set('doClick', false);
    },
    mouseUp: function(event) {
        var left = event.clientX - this.get('startPosition');

        if(left === 0) {
            this.set('doClick', true);
        } else if(Math.abs(left) >= 80) {
            this.sendAction(this.get('action'), this.get('model'));
        }

        this.resetPosition();
    },
    mouseMove: function(event) {
        var startPosition = this.get('startPosition'),
            left,
            action,
            currentAction,
            newPosition;

        if(startPosition) {
            left = event.clientX - startPosition;
            action = this.get('action');

            if(this.get('lastPosition') > event.clientX) {
                currentAction = 'swipeRight';
            } else {
                currentAction = 'swipeLeft';
            }

            if(Math.abs(left) <= 80) {
                this.$('.my-track-draggable').css('left', left);
            } else if(action !== currentAction) {
                if(left > 0) {
                    newPosition = event.clientX - 80;
                } else if(left < 0) {
                    newPosition = event.clientX + 80;
                }

                this.set('startPosition', newPosition);

                this.$('.my-track-draggable').css('left', event.clientX - newPosition);
            }

            this.set('lastPosition', event.clientX);
            this.set('action', currentAction);
        }
    },
    mouseLeave: function() {
        if(this.get('startPosition')) {
            this.resetPosition();
        }
    },
    actions: {
        click: function() {
            if(this.get('doClick')) {
                this.sendAction('action', this.get('model'));
            }
        }
    }
});
