export default {
    isMatch: function (value, query) {
        return query.trim().split(' ').every(function (queryPart) {
            return value.toLowerCase().includes(queryPart.toLowerCase());
        });
    },
    generateRandomId: function () {
        var randomId = '',
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            index = 0;

        for (index; index < 5; index++) {
            randomId += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return randomId;
    },
    getTopRecords: function (records, limit) {
        var topRecords = [];

        records.any(function (record, index) {
            topRecords.pushObject(record);

            return index + 1 >= limit;
        });

        return topRecords;
    },
    setOuterHeight: function (element) {
        return element.height(element.width() / 30 * 17);
    },
    setInnerHeight: function (element) {
        return element.height(element.width() / 12 * 9);
    },
    setTop: function (element, outerHeight) {
        return element.css('top', -Math.floor((element.height() - outerHeight) / 2));
    }
};
