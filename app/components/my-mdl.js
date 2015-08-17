/* global componentHandler: true */
import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function () {
        componentHandler.upgradeAllRegistered();
    }
});
