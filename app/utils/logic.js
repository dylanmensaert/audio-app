import Ember from 'ember';

export default {
    maxResults: 50,
    later: function(context, callback) {
        Ember.run.later(context, callback, 300);
    },
    sortByName: function(model, other) {
        let name = model.get('name'),
            otherName = other.get('name'),
            result = -1;

        if (name > otherName) {
            result = 1;
        } else if (name === otherName) {
            result = 0;
        }

        return result;
    },
    isMatch: function(value, query) {
        return query.trim().split(' ').every(function(queryPart) {
            return value.toLowerCase().includes(queryPart.toLowerCase());
        });
    },
    generateRandomId: function() {
        let randomId = '',
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            index = 0;

        for (index; index < 5; index++) {
            randomId += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return randomId;
    },
    getTopRecords: function(records, limit) {
        let topRecords = [];

        records.any(function(record, index) {
            topRecords.pushObject(record);

            return index + 1 >= limit;
        });

        return topRecords;
    }
};
