import Ember from 'ember';
import meta from 'meta-data';
import Recording from 'audio-app/audio-recording/object';
import Album from 'audio-app/audio-album/object';

// use function convertImageUrl instead var convertImageUrl = .. Do the same for all variables?.
function convertImageUrl(url) {
    return meta.imageHost + new URL(url).pathname;
}

function buildUrl(endpoint, maxResults, nextPageToken) {
    var url = meta.searchHost + '/youtube/v3/' + endpoint + '?part=snippet&maxResults=' + maxResults + '&key=' + meta.key;

    if (!Ember.isEmpty(nextPageToken)) {
        url += '&pageToken=' + nextPageToken;
    }

    return url;
}

function buildUrlByType(type, maxResults, query, nextPageToken) {
    return this.buildUrl('search', maxResults, nextPageToken) + '&order=viewCount&type=' + type + '&q=' + query;
}

function find(url, createSnippet) {
    return new Ember.RSVP(function (resolve, reject) {
        Ember.$.getJSON(url).then(function (response) {
            var snippets = response.items.map(function (item) {
                var snippet = {
                    name: item.snippet.title,
                    thumbnail: convertImageUrl(item.snippet.thumbnails.high.url)
                };

                return createSnippet(snippet, item);
            });

            resolve(snippets, response.nextPageToken);
        }, reject);
    });
}

// TODO: return different modules so not all dependencies are loaded unnecessarily
export default {
    isMatch: function (value, query) {
        return query.trim().split(' ').every(function (queryPart) {
            return value.toLowerCase().includes(queryPart.toLowerCase());
        });
    },
    findRecordingsByAlbum: function (playlistId, nextPageToken, fileSystem) {
        var url = buildUrl('playlistItems', 50, nextPageToken) + '&playlistId=' + playlistId,
            createSnippet;

        createSnippet = function (snippet, item) {
            snippet.id = item.snippet.resourceId.videoId;
            snippet.extension = 'mp3';
            // TODO: Remove if possible
            snippet.fileSystem = fileSystem;

            return Recording.create(snippet);
        };

        return find(url, createSnippet);
    },
    findRecordings: function (maxResults, query, nextPageToken, fileSystem) {
        var url = buildUrlByType('video', maxResults, query, nextPageToken),
            createSnippet;

        createSnippet = function (snippet, item) {
            snippet.id = item.id.videoId;
            snippet.extension = 'mp3';
            // TODO: Remove if possible
            snippet.fileSystem = fileSystem;

            return Recording.create(snippet);
        };

        return find(url, createSnippet);
    },
    findAlbums: function (maxResults, query, nextPageToken, fileSystem) {
        var url = buildUrlByType('playlist', maxResults, query, nextPageToken),
            createSnippet;

        createSnippet = function (snippet, item) {
            snippet.id = item.id.playlistId;
            // TODO: Remove if possible
            snippet.fileSystem = fileSystem;

            return Album.create(snippet);
        };

        return find(url, createSnippet);
    }
};
