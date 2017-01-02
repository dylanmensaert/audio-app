/*global history, window*/
import Ember from 'ember';
import connection from 'connection';
import phonegap from 'phonegap';

var lastScrollTop = 0;

export default Ember.Route.extend({
    fileSystem: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    utils: Ember.inject.service(),
    beforeModel: function() {
        return phonegap.get('onDeviceReady').then(function() {
            return this.get('fileSystem').forge();
        }.bind(this));
    },
    afterModel: function() {
        let utils = this.get('utils');

        utils.set('transitionToRoute', this.transitionTo.bind(this));

        this.get('audioRemote').connect();

        connection.onMobile(function() {
            let downloadLater = this.store.peekRecord('playlist', 'download-later'),
                trackIds = downloadLater.get('trackIds');

            trackIds.toArray().forEach(function(trackId) {
                let track = this.store.peekRecord('track', trackId);

                trackIds.removeObject(trackId);

                track.download();
            }.bind(this));
        }.bind(this));

        Ember.$('.my-splash-spinner').remove();

        Ember.$(window).scroll(function() {
            let scrollTop = Ember.$(window).scrollTop();

            Ember.$('.my-fixed-row').each(function() {
                let element = Ember.$(this),
                    isHidden = element.data('is-hidden'),
                    animate;

                animate = function(doHide, top) {
                    element.stop();

                    element.animate({
                        top: top
                    }, 500);

                    element.data('is-hidden', doHide);
                };

                if (lastScrollTop < scrollTop) {
                    if (!isHidden) {
                        animate(true, 0 - element.outerHeight());
                    }
                } else if (isHidden) {
                    animate(false, element.data('top'));
                }
            });

            lastScrollTop = scrollTop;
        });
    },
    actions: {
        back: function() {
            history.back();
        }
    }
});
