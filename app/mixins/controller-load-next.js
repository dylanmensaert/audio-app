import Ember from 'ember';
import connection from 'connection';

export default Ember.Mixin.create({
    isLocked: false,
    connection: connection,
    isPending: Ember.computed('connection.isOnline', 'canLoadNext', function() {
        return this.get('connection.isOnline') && this.get('canLoadNext');
    }),
    tryLoadNext: function() {
        if (!this.get('isLocked') && this.get('canLoadNext')) {
            this.set('isLocked', true);

            this.loadNext().finally(function() {
                this.set('isLocked', false);
            }.bind(this));
        }
    },
    actions: {
        didScrollToBottom: function() {
            this.tryLoadNext();
        }
    }
});
