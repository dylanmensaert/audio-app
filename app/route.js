/* global window: true, document: true */
import Ember from 'ember';
import Slider from 'my-app/slider/object';
import updateTitle from 'my-app/utils/update-title';

var generateRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default Ember.Route.extend(updateTitle, {
    title: 'music',
    previous: function () {
        var queue,
            currentIndex,
            previousIndex,
            snippetId,
            previousSnippet;

        queue = this.get('fileSystem.queue');
        currentIndex = queue.indexOf(this.get('audio.snippet.id'));

        if (currentIndex > 0) {
            previousIndex = currentIndex - 1;
        } else {
            previousIndex = queue.get('length');
        }

        snippetId = queue.objectAt(previousIndex);
        previousSnippet = this.get('fileSystem.snippets').findBy('id', snippetId);

        this.play(previousSnippet);
    },
    next: function () {
        var queue = this.get('fileSystem.queue'),
            snippetId,
            nextSnippet,
            unplayedSnippetIds;

        unplayedSnippetIds = queue.filter(function (snippetId) {
            return !this.get('cache.playedSnippetIds').contains(snippetId);
        }.bind(this));

        if (!unplayedSnippetIds.get('length')) {
            this.set('cache.playedSnippetIds', []);

            unplayedSnippetIds.pushObjects(queue);

            unplayedSnippetIds.removeObject(this.get('audio.snippet.id'));
        }

        snippetId = unplayedSnippetIds.objectAt(generateRandom(0, unplayedSnippetIds.get('length') - 1));

        nextSnippet = this.get('fileSystem.snippets').findBy('id', snippetId);

        this.play(nextSnippet);
    },
    play: function (snippet) {
        var fileSystem = this.get('fileSystem'),
            offlineSnippets = fileSystem.get('snippets'),
            audio = this.get('audio'),
            history,
            queue,
            playedSnippetIds,
            id;

        if (!Ember.isEmpty(snippet)) {
            id = snippet.get('id');
            history = fileSystem.get('history');
            queue = fileSystem.get('queue');
            playedSnippetIds = this.get('cache.playedSnippetIds');

            if (!offlineSnippets.isAny('id', id)) {
                offlineSnippets.pushObject(snippet);
            }

            if (history.contains(id)) {
                history.removeObject(id);
            }

            if (history.get('length') === 50) {
                history.removeAt(0);
            }

            history.pushObject(id);

            if (!queue.contains(id)) {
                if (Ember.isEmpty(audio.get('snippet.id'))) {
                    queue.pushObject(id);
                } else {
                    queue.insertAt(queue.indexOf(audio.get('snippet.id')) + 1, id);
                }
            }

            if (!playedSnippetIds.contains(id)) {
                playedSnippetIds.pushObject(id);
            }

            fileSystem.set('playingSnippetId', id);
        }

        if (!Ember.isEmpty(snippet) && fileSystem.get('setDownloadBeforePlaying') && !snippet.get('isDownloaded')) {
            snippet.download().then(function () {
                audio.play(snippet);
            });
        } else {
            audio.play(snippet);
        }
    },
    downloadSnippets: function () {
        var fileSystem = this.get('fileSystem'),
            cache = this.get('cache'),
            snippets;

        if (fileSystem.get('setDownloadLaterOnMobile') && !cache.get('isMobileConnection')) {
            snippets = fileSystem.get('snippets').filterBy('isDownloadLater');

            if (snippets.get('length')) {
                // TODO: Better message?
                cache.showMessage('Downloading download-later');

                // TODO: Handle multiple 'observe' calls before download finishes
                snippets.forEach(function (snippet) {
                    snippet.download();
                });
            }
        }
    }.observes('fileSystem.setDownloadLaterOnMobile', 'cache.isMobileConnection', 'snippets.@each.isDownloadLater'),
    actions: {
        loading: function () {
            if (this.get('controller')) {
                this.set('controller.isLoading', true);

                this.router.one('didTransition', function () {
                    this.set('controller.isLoading', false);
                }.bind(this));
            }
        },
        error: function (error) {
            if (this.get('controller')) {
                this.set('controller.error', error);
            }
        },
        updateTitle: function (tokens) {
            this._super(tokens);

            tokens.reverse();
            document.title = tokens.join(' - ');
        },
        play: function (snippet) {
            this.play(snippet);
        },
        pause: function () {
            this.get('audio').pause();
        },
        previous: function () {
            this.previous();
        },
        next: function () {
            this.next();
        },
        didTransition: function () {
            var audio = this.get('audio'),
                cache = this.get('cache'),
                slider;

            slider = Slider.create({
                onSlideStop: function (value) {
                    audio.setCurrentTime(value);
                }
            });

            audio.addObserver('currentTime', audio, function () {
                slider.setValue(this.get('currentTime'));
            });

            audio.addObserver('duration', audio, function () {
                slider.set('max', this.get('duration'));
            });

            cache.set('slider', slider);

            audio.set('didEnd', this.next.bind(this));

            this.set('fileSystem.didParseJSON', function () {
                audio.load(this.get('snippets').findBy('id', this.get('playingSnippetId')));
            });
        }
    }
});
