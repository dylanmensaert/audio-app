/* global componentHandler: true */
import Ember from 'ember';

export default Ember.Component.extend({
    model: null,
    didInsertElement: function () {
        componentHandler.upgradeElements(this.get('element'));
    },
    click: function () {
        this.sendAction('action', this.get('model'));
    }
});
