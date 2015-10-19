/* global componentHandler */
import Ember from 'ember';

export default Ember.Component.extend({
    param: null,
    didInsertElement: function () {
        componentHandler.upgradeElements(this.get('element'));
    },
    click: function () {
        this.sendAction('action', this.get('param'));
    }
});
