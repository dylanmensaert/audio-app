/* global Connection, setInterval */

import Ember from 'ember';

export default Ember.Service.extend({
    init: function() {
        var getType;

        this._super();

        if (this.get('isMobile')) {
            document.addEventListener('offline', function() {
                this.set('type', navigator.connection.type);
            }.bind(this), false);

            document.addEventListener('online', function() {
                this.set('type', navigator.connection.type);
            }.bind(this), false);

            getType = function() {
                return navigator.connection.type;
            };
        } else {
            getType = function() {
                return navigator.onLine;
            };
        }

        this.set('type', getType());

        setInterval(function() {
            this.set('type', getType());
        }.bind(this), 5000);
    },
    store: Ember.inject.service(),
    fileSystem: null,
    completedTransitions: [],
    hasPreviousTransition: function() {
        return this.get('completedTransitions.length') > 1;
    }.property('completedTransitions.length'),
    // TODO: duplicate with controller atm
    searchDownloadedOnly: function() {
        return this.get('isOffline') || (this.get('isMobileConnection') && this.get('fileSystem.setDownloadedOnlyOnMobile'));
    }.property('isOffline', 'isMobileConnection', 'fileSystem.setDownloadedOnlyOnMobile'),
    isMobile: !Ember.isEmpty(navigator.connection),
    // TODO: rename to selectedRecordingIds since only used for one functionality?
    selectedSnippetIds: [],
    playedRecordingIds: [],
    showMessage: null,
    audioSlider: null,
    type: null,
    isOffline: function() {
        var isMobile = this.get('isMobile'),
            type = this.get('type');

        return (isMobile && type === Connection.NONE) || (!isMobile && !type);
    }.property('type', 'isMobile'),
    isMobileConnection: function() {
        var type = this.get('type');

        return this.get('isMobile') && (type === Connection.CELL_2G || type === Connection.CELL_3G || type === Connection.CELL_4G || type ===
            Connection.CELL);
    }.property('type', 'isMobile')
});
