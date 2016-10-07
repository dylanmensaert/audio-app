import Ember from 'ember';

export default {
    // TODO: is this completely correct?
    getWindowOverlayWith: function(element) {
        let menuHeight = 56,
            display = Ember.$(window),
            height = element.height(),
            displayScollTop = display.scrollTop(),
            imageOffset = element.offset().top,
            topHeight = displayScollTop - menuHeight + display.height() - imageOffset,
            bottomHeight = imageOffset + height - displayScollTop - menuHeight;

        return {
            isVisible: topHeight > 0 && bottomHeight > 0,
            topHeight,
            bottomHeight
        };
    },
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
