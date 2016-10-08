/* global Math: true */
import Ember from 'ember';
import modelMixin from 'audio-app/mixins/c-model';
import connection from 'connection';

export default Ember.Component.extend(modelMixin, {
    audioRemote: Ember.inject.service(),
    utils: Ember.inject.service(),
    store: Ember.inject.service(),
    classNames: ['my-relative'],
    doClick: false,
    startPosition: null,
    lastPosition: null,
    action: null,
    /*TODO: Implement swiping*/
    /*resetPosition: function() {
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
        let left = event.clientX - this.get('startPosition');

        if (left === 0) {
            this.set('doClick', true);
        } else if (Math.abs(left) >= 80) {
            this[this.get('action')](this.get('model'));
        }

        this.resetPosition();
    },
    mouseMove: function(event) {
        let startPosition = this.get('startPosition'),
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
    mouseLeave: function() {
        if (this.get('startPosition')) {
            this.resetPosition();
        }
    },*/
    swipeLeft: function(track) {
        let utils = this.get('utils'),
            trackIds,
            id;

        if (track.get('isDownloadable')) {
            if (!!connection.isMobile()) {
                trackIds = this.get('store').peekRecord('playlist', 'download-later').get('trackIds');
                id = track.get('id');

                if (!trackIds.includes(id)) {
                    trackIds.pushObject(id);
                }

                utils.showMessage('Added to playlist: Download later');
            } else {
                track.download().then(function() {

                }, function() {
                    // TODO: show error?
                    utils.showMessage('download aborted');
                });
            }
        } else {
            utils.showMessage('already downloaded');
        }
    },
    swipeRight: function(track) {
        let queue = this.get('store').peekRecord('playlist', 'queue'),
            trackIds = queue.get('trackIds'),
            utils = this.get('utils');

        if (!trackIds.includes(track.get('id'))) {
            if (track.get('isDownloadable')) {
                track.download().then(function() {}, function() {
                    // TODO: show error?
                    this.get('utils').showMessage('Download aborted');
                }.bind(this));
            }

            trackIds.pushObject(track.get('id'));

            utils.showMessage('Added to queue');
        } else {
            utils.showMessage('Already in queue');
        }

        queue.save();
    },
    actions: {
        click: function() {
            if (this.get('doClick')) {
                this.get('audioRemote').play(this.get('model'));
            }
        }
    }
});
