/* global Connection */

import Ember from 'ember';

export default Ember.Object.extend({
    init: function () {
        var updateConnectionType;

        this._super();

        if (!Ember.isEmpty(navigator.connection)) {
            document.addEventListener('offline', function () {
                this.set('type', navigator.connection.type);
            }.bind(this), false);

            document.addEventListener('online', function () {
                this.set('type', navigator.connection.type);
            }.bind(this), false);

            updateConnectionType = Ember.run.later(this, function () {
                this.set('type', navigator.connection.type);

                updateConnectionType();
            }, 2000);

            updateConnectionType();
        }
    },
    selectedSnippets: [],
    playedSnippetIds: [],
    showMessage: null,
    slider: null,
    type: null,
    isOffline: function () {
        return this.get('type') === Connection.NONE;
    }.property('type'),
    isMobileConnection: function () {
        var type = this.get('type');

        return type === Connection.CELL_2G || type === Connection.CELL_3G || type === Connection.CELL_4G || type ===
            Connection.CELL;
    }.property('type')
});
