export default {
    isMatch: function(value, query) {
        return query.trim().split(' ').every(function(queryPart) {
            return value.toLowerCase().includes(queryPart.toLowerCase());
        });
    }
};
