/* global Connection, navigator */

import Ember from 'ember';

// TODO: put isMobile related properties in separate file if desktop vs mobile environment is provided.
const isMobile = !Ember.isEmpty(navigator.connection);

var getType;

if(isMobile) {
    getType = function() {
        return navigator.connection.type;
    };
} else {
    getType = function() {
        return navigator.onLine;
    };
}

function getIsOffline() {
    var type = getType();

    return(isMobile && type === Connection.NONE) || (!isMobile && !type);
}

function getIsMobileConnection() {
    var type = getType();

    return isMobile && (type === Connection.CELL_2G || type === Connection.CELL_3G || type === Connection.CELL_4G || type ===
        Connection.CELL);
}

export default Ember.Service.extend({
    store: Ember.inject.service(),
    fileSystem: null,
    completedTransitions: [],
    hasPreviousTransition: Ember.computed('completedTransitions.length', function() {
        return this.get('completedTransitions.length') > 1;
    }),
    // TODO: duplicate with controller atm
    getIsOfflineMode: function() {
        return getIsOffline() || (getIsMobileConnection() && this.get('fileSystem.setDownloadedOnlyOnMobile'));
    },
    selectedTrackIds: [],
    playedTrackIds: [],
    showMessage: null,
    audioSlider: null
});
