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

            Ember.$('.js-hide-on-scroll').each(function() {
                let element = Ember.$(this),
                    attribute = element.data('hide-on-scroll'),
                    transitionTo;

                transitionTo = function(doHide, value) {
                    element.css(attribute.name, value);

                    attribute.isHidden = doHide;
                    element.data('hide-on-scroll', attribute);
                };

                if (lastScrollTop < scrollTop) {
                    if (!attribute.isHidden) {
                        transitionTo(true, 0 - element.outerHeight());
                    }
                } else if (attribute.isHidden) {
                    transitionTo(false, attribute.value);
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
