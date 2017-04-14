/*global Hammer*/

import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        this.sendAction('didInsert');

        new Hammer(this.$()[0]).on('tap', function() {
            this.sendAction('tap');
        }.bind(this));
    }
});
