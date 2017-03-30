/*global parseInt, Map*/

import Ember from 'ember';
import domainData from 'domain-data';
import apiKey from 'api-key';
import connection from 'connection';

export default {
    maxResults: 50,
    later: function(callback) {
        Ember.run.later(null, callback, 300);
    },
    sortByName: function(model, other) {
        let result = -1,
            name = model.get('name'),
            otherName = other.get('name');

        if (name.toLowerCase() > otherName.toLowerCase()) {
            result = 1;
        } else
        if (name === otherName) {
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
    getUrl: function(endpoint) {
        return domainData.searchName + '/youtube/v3/' + endpoint + '?key=' + apiKey;
    },
    findDetails: function(tracks) {
        return connection.resolve(function() {
            let url = this.getUrl('videos') + '&part=statistics',
                trackByIds = new Map();

            tracks.forEach(function(track) {
                trackByIds.set(track.get('id'), track);
            });

            url += '&id=' + Array.from(trackByIds.keys()).join(',');

            return Ember.$.getJSON(url).then(function(response) {
                response.items.forEach(function(item) {
                    let record = trackByIds.get(item.id);

                    record.set('viewCount', parseInt(item.statistics.viewCount));
                });

                return tracks;
            });
        }.bind(this), function() {
            return Ember.RSVP.resolve(tracks);
        });
    },
    ObjectPromiseProxy: Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
};
