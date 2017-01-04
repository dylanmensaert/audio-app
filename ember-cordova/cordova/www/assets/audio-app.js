"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('audio-app/app', ['exports', 'ember', 'audio-app/resolver', 'ember-load-initializers', 'audio-app/config/environment'], function (exports, _ember, _audioAppResolver, _emberLoadInitializers, _audioAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _audioAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _audioAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _audioAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _audioAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('audio-app/application/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        utils: _ember['default'].inject.service(),
        audioPlayer: _ember['default'].inject.service(),
        audioRemote: _ember['default'].inject.service(),
        isLoading: false,
        linkToProperties: {
            classNameBindings: ['active:mdl-color--blue-grey-800']
        },
        actions: {
            dismissAlert: function dismissAlert() {
                this.set('error', null);
            },
            play: function play() {
                this.get('audioRemote').play();
            },
            pause: function pause() {
                this.get('audioRemote').pause();
            }
        }
    });
});
define('audio-app/application/route', ['exports', 'ember', 'connection', 'phonegap'], function (exports, _ember, _connection, _phonegap) {
    exports['default'] = _ember['default'].Route.extend({
        fileSystem: _ember['default'].inject.service(),
        audioRemote: _ember['default'].inject.service(),
        utils: _ember['default'].inject.service(),
        beforeModel: function beforeModel() {
            return _phonegap['default'].get('onDeviceReady').then((function () {
                return this.get('fileSystem').forge();
            }).bind(this));
        },
        afterModel: function afterModel() {
            var utils = this.get('utils');

            utils.set('transitionToRoute', this.transitionTo.bind(this));

            this.get('audioRemote').connect();

            _connection['default'].onMobile((function () {
                var downloadLater = this.store.peekRecord('playlist', 'download-later'),
                    trackIds = downloadLater.get('trackIds');

                trackIds.toArray().forEach((function (trackId) {
                    var track = this.store.peekRecord('track', trackId);

                    trackIds.removeObject(trackId);

                    track.download();
                }).bind(this));
            }).bind(this));

            _ember['default'].$('.my-splash-spinner').remove();
        },
        actions: {
            back: function back() {
                history.back();
            }
        }
        // TODO: remove?
        /*   actions: {
        loading: function() {
                        if (this.get('controller')) {
                            this.set('controller.isLoading', true);
                             this.router.one('didTransition', function() {
                                this.set('controller.isLoading', false);
                            }.bind(this));
                        }
                    },
            error: function(error) {
                let controller = this.get('controller');
                 if (controller) {
                    controller.set('error', error);
                }
            }
        }*/
    });
});
/*global history*/
define("audio-app/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eXLM3M/q", "block": "{\"statements\":[[\"comment\",\" TODO: Implement error handling? \"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"audioPlayer\",\"track\"]]],null,7],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"c-audio\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col s2 my-audio-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"play\"]],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons my-audio-icon\"],[\"flush-element\"],[\"text\",\"play_arrow\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"audioPlayer\",\"isIdle\"]]],null,0]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col s2 my-audio-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"pause\"]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons my-audio-icon\"],[\"flush-element\"],[\"text\",\"pause\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"audioPlayer\",\"isPlaying\"]]],null,2,1]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col s2 my-audio-btn\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"c-spinner\"],null,[[\"type\"],[\"my-audio-spinner\"]]],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"h5\",[]],[\"static-attr\",\"class\",\"truncate\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"append\",[\"unknown\",[\"audioPlayer\",\"track\",\"name\"]],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"c-audio-slider\"],null,[[\"slider\"],[[\"get\",[\"utils\",\"audioSlider\"]]]]],false],[\"text\",\"\\n\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row my-audio-timer\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col s6\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"small\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"time\"],[[\"get\",[\"utils\",\"audioSlider\",\"value\"]]],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col s6 my-right\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"small\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"time\"],[[\"get\",[\"utils\",\"audioSlider\",\"max\"]]],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row my-audio-row\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"track.queue\",[\"get\",[\"audioPlayer\",\"track\"]]],[[\"tagName\",\"class\"],[\"div\",\"col s10\"]],5],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"audioPlayer\",\"isLoading\"]]],null,4,3],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"c-fixed\"],null,[[\"class\"],[\"my-audio-player\"]],6]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/application/template.hbs" } });
});
define('audio-app/components/c-audio-slider/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['slider', 'my-slider'],
        slider: null,
        didInsertElement: function didInsertElement() {
            var slider = this.get('slider'),
                element = this.get('element');

            noUiSlider.create(element, {
                start: 0,
                range: {
                    min: 0,
                    max: slider.get('max')
                },
                connect: 'lower'
            });

            element.noUiSlider.on('slide', function () {
                slider.set('value', element.noUiSlider.get());

                if (!slider.get('isDragged')) {
                    slider.set('isDragged', true);
                }
            });

            element.noUiSlider.on('set', function () {
                slider.set('value', element.noUiSlider.get());
            });

            element.noUiSlider.on('change', function () {
                slider.onSlideStop(element.noUiSlider.get());

                slider.set('isDragged', false);
            });

            slider.set('element', element);
        },
        willDestroyElement: function willDestroyElement() {
            this.$().destroy();
        }
    });
});
/* global noUiSlider */
define('audio-app/components/c-audio-slider/object', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Object.extend({
        element: null,
        value: null,
        max: 1,
        isDragged: false,
        onSlideStop: null,
        setValue: function setValue(value) {
            if (!this.get('isDragged')) {
                this.get('element').noUiSlider.set(value);
            }
        },
        updateMax: _ember['default'].observer('max', function () {
            this.get('element').noUiSlider.updateOptions({
                range: {
                    min: 0,
                    max: this.get('max')
                }
            });
        })
    });
});
define('audio-app/components/c-audio', ['exports', 'ember'], function (exports, _ember) {

    var errors = _ember['default'].Map.create();

    errors.set(1, 'Fetching process aborted by user');
    errors.set(2, 'Error occurred when downloading');
    errors.set(3, 'Error occurred when decoding');
    errors.set(4, 'Audio not supported');

    exports['default'] = _ember['default'].Component.extend({
        tagName: 'audio',
        audioPlayer: _ember['default'].inject.service(),
        didInsertElement: function didInsertElement() {
            var element = this.get('element'),
                audioPlayer = this.get('audioPlayer'),
                track = audioPlayer.get('track');

            element.addEventListener('durationchange', function (event) {
                audioPlayer.set('duration', event.target.duration);
            });

            element.addEventListener('timeupdate', function (event) {
                audioPlayer.set('currentTime', event.target.currentTime);
            });

            element.addEventListener('abort', function (event) {
                _ember['default'].RSVP.reject(errors.get(event.target.error.code));

                audioPlayer.set('status', 'idle');
            });

            element.addEventListener('error', function (event) {
                // TODO: Show errors via utils.showMessage?
                _ember['default'].RSVP.reject(errors.get(event.target.error.code));

                audioPlayer.set('status', 'idle');
            });

            element.addEventListener('loadstart', function () {
                audioPlayer.set('status', 'loading');
            });

            element.addEventListener('canplay', function () {
                audioPlayer.set('status', 'idle');
            });

            element.addEventListener('waiting', function () {
                audioPlayer.set('status', 'loading');
            });

            element.addEventListener('pause', function () {
                audioPlayer.set('status', 'idle');
            });

            element.addEventListener('playing', function () {
                audioPlayer.set('status', 'playing');
            });

            element.addEventListener('ended', function () {
                audioPlayer.set('status', 'idle');

                audioPlayer.didEnd();
            });

            audioPlayer.set('element', element);

            if (track) {
                audioPlayer.load(track);
            }
        },
        willDestroyElement: function willDestroyElement() {
            var element = this.get('element');

            element.removeEventListener('durationchange');
            element.removeEventListener('timeupdate');
            element.removeEventListener('abort');
            element.removeEventListener('error');
            element.removeEventListener('loadstart');
            element.removeEventListener('canplay');
            element.removeEventListener('waiting');
            element.removeEventListener('pause');
            element.removeEventListener('playing');
            element.removeEventListener('ended');
            element.removeEventListener('canplaythrough');

            this.set('audioPlayer.element', null);
        }
    });
});
define('audio-app/components/c-autocomplete/component', ['exports', 'ember'], function (exports, _ember) {

    var keyCodeUp = 38,
        keyCodeDown = 40,
        keyCodeEscape = 27;

    var timer = undefined;

    exports['default'] = _ember['default'].Component.extend({
        classNames: ['my-autocomplete'],
        value: null,
        suggestions: null,
        showSuggestions: false,
        showAutoComplete: _ember['default'].computed('showSuggestions', 'suggestions.length', function () {
            return this.get('showSuggestions') && this.get('suggestions.length');
        }),
        updateShowSuggestions: _ember['default'].observer('value', function () {
            this.set('showSuggestions', !!this.get('value'));
        }),
        keyDown: function keyDown(event) {
            if (event.keyCode === keyCodeUp) {
                this.selectAdjacent(function (selectedIndex) {
                    return selectedIndex - 1;
                });

                event.preventDefault();
            } else if (event.keyCode === keyCodeDown) {
                this.selectAdjacent(function (selectedIndex) {
                    return selectedIndex + 1;
                });

                event.preventDefault();
            } else if (event.keyCode === keyCodeEscape) {
                this.hideSuggestions();
            }
        },
        selectAdjacent: function selectAdjacent(getAdjacentIndex) {
            var suggestions = this.get('suggestions'),
                selectedSuggestion = undefined,
                adjacentIndex = undefined,
                adjacentSuggestion = undefined;

            if (suggestions.get('length')) {
                selectedSuggestion = suggestions.findBy('isSelected');

                if (!selectedSuggestion) {
                    suggestions.get('firstObject').set('isSelected', true);

                    this.set('showSuggestions', true);
                } else {
                    adjacentIndex = getAdjacentIndex(suggestions.indexOf(selectedSuggestion));
                    adjacentSuggestion = suggestions.objectAt(adjacentIndex);

                    if (!adjacentSuggestion) {
                        if (adjacentIndex < 0) {
                            this.hideSuggestions();
                        }
                    } else {
                        selectedSuggestion.set('isSelected', false);
                        adjacentSuggestion.set('isSelected', true);
                    }
                }
            } else {
                this.send('searchSelected');
            }
        },
        willDestroyElement: function willDestroyElement() {
            _ember['default'].run.cancel(timer);
        },
        hideSuggestions: function hideSuggestions() {
            var selectedSuggestion = this.get('suggestions').findBy('isSelected');

            if (selectedSuggestion) {
                selectedSuggestion.set('isSelected', false);
            }

            this.set('showSuggestions', false);
        },
        actions: {
            searchSelected: function searchSelected() {
                var suggestions = this.get('suggestions'),
                    selectedSuggestion = suggestions.findBy('isSelected');

                if (selectedSuggestion) {
                    this.set('value', selectedSuggestion.get('value'));
                }

                this.hideSuggestions();

                this.sendAction('search');
            },
            searchSuggestion: function searchSuggestion(suggestion) {
                this.set('value', suggestion.get('value'));

                this.hideSuggestions();

                this.sendAction('search');
            },
            didFocusOut: function didFocusOut() {
                if (!this.$('ul:hover').length || this.$('.my-back:hover').length) {
                    this.hideSuggestions();
                }
            },
            clear: function clear() {
                this.set('value', '');

                this.$('input').focus();
            },
            back: function back() {
                history.back();
            }
        }
    });
});
define('audio-app/components/c-autocomplete/suggestion', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Object.extend({
        value: null,
        isSelect: false
    });
});
define("audio-app/components/c-autocomplete/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "lJfWCd0k", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-back\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"back\"]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"arrow_back\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"c-input\"],null,[[\"value\",\"placeholder\",\"action\",\"didFocusOut\"],[[\"get\",[\"value\"]],\"Search\",\"searchSelected\",\"didFocusOut\"]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"value\"]]],null,2],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showAutoComplete\"]]],null,1]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"helper\",[\"if\"],[[\"get\",[\"suggestion\",\"isSelected\"]],\"active\"],null],null],[\"modifier\",[\"action\"],[[\"get\",[null]],\"searchSuggestion\",[\"get\",[\"suggestion\"]]]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"suggestion\",\"value\"]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"suggestion\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"z-depth-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"suggestions\"]]],null,0],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-clear\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"clear\"]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"close\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-autocomplete/template.hbs" } });
});
define('audio-app/components/c-endless-scroll', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        didInsertElement: function didInsertElement() {
            _ember['default'].$(window).scroll((function () {
                var display = _ember['default'].$(window);

                if (this.$().outerHeight() - display.scrollTop() <= 2 * display.outerHeight()) {
                    this.sendAction('didScrollToBottom');
                }
            }).bind(this));
        },
        willDestroyElement: function willDestroyElement() {
            _ember['default'].$(window).unbind('scroll');
        }
    });
});
define('audio-app/components/c-file-input', ['exports', 'ember'], function (exports, _ember) {

    function split(fileName) {
        var lastIndex = fileName.lastIndexOf('.');

        return {
            value: fileName.substr(0, lastIndex),
            extension: fileName.substr(lastIndex + 1, fileName.length)
        };
    }

    exports['default'] = _ember['default'].TextField.extend({
        fileSystem: _ember['default'].inject.service(),
        attributeBindings: ['type', 'multiple', 'accept', 'title'],
        title: ' ',
        type: 'file',
        multiple: 'multiple',
        accept: 'audio/*,video/*',
        didInsertElement: function didInsertElement() {
            var fileSystem = this.get('fileSystem');

            this.$().onchange = function () {
                this.files.forEach(function (file) {
                    var fileName = split(file.name);

                    fileSystem.get('store').pushPayload('track', {
                        id: fileName.value,
                        name: fileName.value,
                        extension: fileName.extension
                    });
                });

                this.files.forEach(function (file) {
                    fileSystem.get('instance').root.getFile(file.name, {
                        create: true
                    }, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.write(file);
                        });
                    });
                });
            };
        }
    });
});
define('audio-app/components/c-fixed/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['my-fixed'],
        placeholder: null,
        didInsertElement: function didInsertElement() {
            var element = this.$(),
                placeholder = undefined;

            placeholder = _ember['default'].$('<div>', {
                height: element.outerHeight()
            });

            element.before(placeholder);

            this.set('placeholder', placeholder);
        },
        willDestroyElement: function willDestroyElement() {
            this.get('placeholder').remove();
        }
    });
});
define('audio-app/components/c-image', ['exports', 'ember', 'audio-app/utils/logic'], function (exports, _ember, _audioAppUtilsLogic) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: 'img',
        classNames: ['my-image'],
        src: null,
        updateBackground: _ember['default'].observer('src', function () {
            _audioAppUtilsLogic['default'].later(this, function () {
                var element = this.$(),
                    src = this.get('src');

                if (element && src) {
                    element.css('background-image', 'url(\'' + src + '\')');
                }
            });
        }),
        didInsertElement: function didInsertElement() {
            this.updateBackground();
        }
    });
});
define('audio-app/components/c-input-bar/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['my-input-bar', 'my-fixed'],
        value: null,
        placeholder: null,
        actions: {
            clear: function clear() {
                this.set('value', null);
            },
            done: function done() {
                this.sendAction('done');
            }
        }
    });
});
define("audio-app/components/c-input-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Xa2A25MX", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-back\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"clear\"]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"arrow_back\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"c-input\"],null,[[\"value\",\"placeholder\",\"action\"],[[\"get\",[\"value\"]],[\"get\",[\"placeholder\"]],\"done\"]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"value\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-clear\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"done\"]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"done\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-input-bar/template.hbs" } });
});
define('audio-app/components/c-input', ['exports', 'ember', 'audio-app/mixins/safe-style'], function (exports, _ember, _audioAppMixinsSafeStyle) {

    // TODO: send action on suggestion click
    exports['default'] = _ember['default'].TextField.extend(_audioAppMixinsSafeStyle['default'], {
        value: null,
        insertNewline: function insertNewline() {
            this.sendAction('action');
        },
        change: function change() {
            this.attrs.value.update(this.get('value'));
        },
        focus: function focus() {
            this.focus();
        },
        focusOut: function focusOut() {
            this.sendAction('didFocusOut');
        },
        didInsertElement: function didInsertElement() {
            _ember['default'].run.scheduleOnce('afterRender', this.$(), this.focus);
        }
    });
});
define('audio-app/components/c-menu-item/component', ['exports', 'ember', 'audio-app/mixins/c-link'], function (exports, _ember, _audioAppMixinsCLink) {
    exports['default'] = _ember['default'].Component.extend(_audioAppMixinsCLink['default'], {
        tagName: 'li',
        icon: null,
        value: null
    });
});
define("audio-app/components/c-menu-item/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ovGjUT1a", "block": "{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"icon\"]],false],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"unknown\",[\"value\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-menu-item/template.hbs" } });
});
define('audio-app/components/c-menu/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: '',
        utils: _ember['default'].inject.service(),
        didInsertElement: function didInsertElement() {
            _ember['default'].$(".button-collapse").sideNav({
                closeOnClick: true
            });
        }
    });
});
define("audio-app/components/c-menu/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3QxY5lBt", "block": "{\"statements\":[[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"slide-out\"],[\"static-attr\",\"class\",\"side-nav fixed\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"c-menu-item\"],null,[[\"value\",\"route\",\"icon\"],[\"Recommended\",\"index\",\"whatshot\"]]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"c-menu-item\"],null,[[\"value\",\"route\",\"icon\"],[\"My Playlists\",\"playlists\",\"loyalty\"]]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"c-menu-item\"],null,[[\"value\",\"route\",\"model\",\"icon\"],[\"Download Later\",\"playlist\",\"download-later\",\"shop_two\"]]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"c-menu-item\"],null,[[\"value\",\"route\",\"model\",\"icon\"],[\"History\",\"playlist\",\"history\",\"library_books\"]]],false],[\"text\",\"\\n\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"divider\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"c-menu-item\"],null,[[\"value\",\"route\",\"icon\"],[\"Settings\",\"settings\",\"settings\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"c-fixed\"],null,[[\"tagName\"],[\"nav\"]],1]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"search\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"nav-wrapper\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"data-activates\",\"slide-out\"],[\"static-attr\",\"class\",\"button-collapse\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"menu\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"brand-logo truncate\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"yield\",\"default\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"search.tracks\",[\"helper\",[\"query-params\"],null,[[\"query\"],[null]]]],null,0],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-menu/template.hbs" } });
});
define('audio-app/components/c-parallax/component', ['exports', 'ember', 'audio-app/utils/logic'], function (exports, _ember, _audioAppUtilsLogic) {
    exports['default'] = _ember['default'].Component.extend({
        src: null,
        didInsertElement: function didInsertElement() {
            _ember['default'].$(window).scroll((function () {
                var image = this.$('.my-image'),
                    height = this.$().height(),
                    overlay = _audioAppUtilsLogic['default'].getWindowOverlayWith(this.$()),
                    overlayHeight = 0;

                if (overlay.isVisible) {
                    var calcHeight = function calcHeight(givenHeight) {
                        return 100 - givenHeight / height * 100;
                    };

                    if (overlay.topHeight < height) {
                        overlayHeight = -calcHeight(overlay.topHeight);
                    } else if (overlay.bottomHeight < height) {
                        overlayHeight = calcHeight(overlay.bottomHeight);
                    }
                }

                image.css('background-position-y', 50 - overlayHeight + '%');
            }).bind(this));
        },
        willDestroyElement: function willDestroyElement() {
            _ember['default'].$(window).off('scroll');
        }
    });
});
define("audio-app/components/c-parallax/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BcjtHidB", "block": "{\"statements\":[[\"append\",[\"helper\",[\"c-image\"],null,[[\"src\"],[[\"get\",[\"src\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-parallax/template.hbs" } });
});
define('audio-app/components/c-playlist/component', ['exports', 'ember', 'audio-app/mixins/c-model'], function (exports, _ember, _audioAppMixinsCModel) {
    exports['default'] = _ember['default'].Component.extend(_audioAppMixinsCModel['default'], {
        // TODO: add placeholder left and right to row of cells that can help fix cell width layout
        classNames: ['card'],
        classNameBindings: ['model.isSelected:my-active'],
        showSaved: null
    });
});
define("audio-app/components/c-playlist/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Wfhuq5yd", "block": "{\"statements\":[[\"block\",[\"link-to\"],[\"playlist\",[\"get\",[\"model\"]]],[[\"tagName\",\"class\"],[\"div\",\"card-image waves-effect waves-block waves-light\"]],1],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-content my-playlist-content\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"truncate\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"changeSelect\"]],[\"flush-element\"],[\"text\",\"more_vert\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"is-and\"],[[\"get\",[\"showSaved\"]],[\"get\",[\"model\",\"isSaved\"]]],null]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-action\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"save\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"c-image\"],null,[[\"src\"],[[\"get\",[\"model\",\"thumbnail\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-playlist/template.hbs" } });
});
define('audio-app/components/c-playlists/component', ['exports', 'ember', 'audio-app/mixins/c-models'], function (exports, _ember, _audioAppMixinsCModels) {
    exports['default'] = _ember['default'].Component.extend(_audioAppMixinsCModels['default'], {
        unsavedPlaylists: _ember['default'].computed('selectedModels.@each.isSaved', function () {
            return this.get('selectedModels').filterBy('isSaved', false);
        }),
        savedPlaylists: _ember['default'].computed('selectedModels.@each.isSaved', function () {
            return this.get('selectedModels').filterBy('isSaved');
        }),
        showSaved: true,
        actions: {
            save: function save() {
                var unsavedPlaylists = this.get('unsavedPlaylists'),
                    length = unsavedPlaylists.get('length');

                if (length) {
                    this.get('unsavedPlaylists').forEach(function (playlist) {
                        playlist.save();
                    });

                    this.get('utils').showMessage(length + ' Saved locally');
                }
            },
            'delete': function _delete() {
                var savedPlaylists = this.get('savedPlaylists'),
                    length = savedPlaylists.get('length');

                if (length) {
                    savedPlaylists.forEach(function (playlist) {
                        playlist.remove();
                    });

                    this.get('utils').showMessage(length + ' Removed locally');
                }
            }
        }
    });
});
define("audio-app/components/c-playlists/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4csrpDKn", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"selectedModels\",\"length\"]]],null,3],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"c-endless-scroll\"],null,[[\"didScrollToBottom\"],[\"didScrollToBottom\"]],2],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"c-spinner\"],null,[[\"class\"],[\"my-spinner\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"c-playlist\"],null,[[\"model\",\"showSaved\"],[[\"get\",[\"playlist\"]],[\"get\",[\"showSaved\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"playlist\"]},{\"statements\":[[\"block\",[\"each\"],[[\"get\",[\"models\"]]],null,1],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isPending\"]]],null,0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"my-fixed my-action-bar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"nav-wrapper\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"save\"]],[\"flush-element\"],[\"text\",\"\\n                      \"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"material-icons \",[\"helper\",[\"unless\"],[[\"get\",[\"unsavedPlaylists\",\"length\"]],\"my-icon-disabled\"],null]]]],[\"flush-element\"],[\"text\",\"save\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"\\n                      \"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"material-icons \",[\"helper\",[\"unless\"],[[\"get\",[\"savedPlaylists\",\"length\"]],\"my-icon-disabled\"],null]]]],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deselect\"]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"cancel\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-playlists/template.hbs" } });
});
define('audio-app/components/c-spinner/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        type: null
    });
});
define("audio-app/components/c-spinner/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vJnAWR/U", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"preloader-wrapper active \",[\"unknown\",[\"type\"]]]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"spinner-layer spinner-blue-only\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"circle-clipper left\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"gap-patch\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"circle-clipper right\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-spinner/template.hbs" } });
});
define('audio-app/components/c-tabs/component', ['exports', 'ember', 'audio-app/mixins/safe-style'], function (exports, _ember, _audioAppMixinsSafeStyle) {
    exports['default'] = _ember['default'].Component.extend(_audioAppMixinsSafeStyle['default'], {
        tagName: 'ul',
        classNames: ['tabs'],
        didInsertElement: function didInsertElement() {
            this.$().tabs();
        }
    });
});
define("audio-app/components/c-tabs/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "nDbtszDN", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-tabs/template.hbs" } });
});
define('audio-app/components/c-track/component', ['exports', 'ember', 'audio-app/mixins/c-model'], function (exports, _ember, _audioAppMixinsCModel) {
    /*import connection from 'connection';*/

    exports['default'] = _ember['default'].Component.extend(_audioAppMixinsCModel['default'], {
        audioRemote: _ember['default'].inject.service(),
        /*TODO: Implement swiping*/
        /*utils: Ember.inject.service(),
        store: Ember.inject.service(),
        classNames: ['my-relative'],
        doClick: false,
        startPosition: null,
        lastPosition: null,
        action: null,
        resetPosition: function() {
            this.$('.my-track-draggable').animate({
                left: 0
            });
             this.set('startPosition', null);
        },
        mouseDown: function(event) {
            this.set('startPosition', event.clientX);
            this.get('lastPosition', event.clientX);
             this.set('doClick', false);
        },
        mouseUp: function(event) {
            let left = event.clientX - this.get('startPosition');
             if (left === 0) {
                this.set('doClick', true);
            } else if (Math.abs(left) >= 80) {
                this[this.get('action')](this.get('model'));
            }
             this.resetPosition();
        },
        mouseMove: function(event) {
            let startPosition = this.get('startPosition'),
                left,
                action,
                currentAction,
                newPosition;
             if (startPosition) {
                left = event.clientX - startPosition;
                action = this.get('action');
                 if (this.get('lastPosition') > event.clientX) {
                    currentAction = 'swipeRight';
                } else {
                    currentAction = 'swipeLeft';
                }
                 if (Math.abs(left) <= 80) {
                    this.$('.my-track-draggable').css('left', left);
                } else if (action !== currentAction) {
                    if (left > 0) {
                        newPosition = event.clientX - 80;
                    } else if (left < 0) {
                        newPosition = event.clientX + 80;
                    }
                     this.set('startPosition', newPosition);
                     this.$('.my-track-draggable').css('left', event.clientX - newPosition);
                }
                 this.set('lastPosition', event.clientX);
                this.set('action', currentAction);
            }
        },
        mouseLeave: function() {
            if (this.get('startPosition')) {
                this.resetPosition();
            }
        },
        swipeLeft: function(track) {
            let utils = this.get('utils'),
                trackIds,
                id;
             if (track.get('isDownloadable')) {
                if (!!connection.isMobile()) {
                    trackIds = this.get('store').peekRecord('playlist', 'download-later').get('trackIds');
                    id = track.get('id');
                     if (!trackIds.includes(id)) {
                        trackIds.pushObject(id);
                    }
                     utils.showMessage('Added to playlist: Download later');
                } else {
                    track.download().then(function() {
                     }, function() {
                        // TODO: show error?
                        utils.showMessage('download aborted');
                    });
                }
            } else {
                utils.showMessage('already downloaded');
            }
        },
        swipeRight: function(track) {
            let queue = this.get('store').peekRecord('playlist', 'queue'),
                trackIds = queue.get('trackIds'),
                utils = this.get('utils');
             if (!trackIds.includes(track.get('id'))) {
                if (track.get('isDownloadable')) {
                    track.download().then(function() {}, function() {
                        // TODO: show error?
                        this.get('utils').showMessage('Download aborted');
                    }.bind(this));
                }
                 trackIds.pushObject(track.get('id'));
                 utils.showMessage('Added to queue');
            } else {
                utils.showMessage('Already in queue');
            }
             queue.save();
        },*/
        actions: {
            play: function play() {
                /*if (this.get('doClick')) {*/
                this.get('audioRemote').play(this.get('model'));
                /*}*/
            }
        }
    });
});
define("audio-app/components/c-track/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "w68kPhnu", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"my-track-draggable waves-effect waves-block waves-light \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"isSelected\"]],\"my-active\"],null]]]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"play\"]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-middle\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-static-image\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"c-image\"],null,[[\"src\"],[[\"get\",[\"model\",\"thumbnail\"]]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-body\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-text\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-status\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isPlaying\"]]],null,4,3],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isDownloaded\"]]],null,1],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-middle\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"changeSelect\"],[[\"bubbles\"],[false]]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"more_vert\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"my-separator \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"isDownloading\"]],\"my-loading\"],null]]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-line\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isDownloading\"]]],null,0],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"progress my-track-progress\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"indeterminate\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-icon\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"offline_pin\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-icon\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"schedule\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"showQueued\"]]],null,2]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-track-icon\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"eq\"],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"eq-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"eq-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"eq-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-track/template.hbs" } });
});
define('audio-app/components/c-tracks/component', ['exports', 'ember', 'audio-app/mixins/c-models'], function (exports, _ember, _audioAppMixinsCModels) {
    exports['default'] = _ember['default'].Component.extend(_audioAppMixinsCModels['default'], {
        utils: _ember['default'].inject.service(),
        store: _ember['default'].inject.service(),
        isPending: null,
        queueableTracks: _ember['default'].computed('selectedModels.@each.isQueued', function () {
            return this.get('selectedModels').filterBy('isQueued', false);
        }),
        downloadableTracks: _ember['default'].computed('selectedModels.@each.isDownloaded', function () {
            return this.get('selectedModels').filterBy('isDownloadable');
        }),
        downloadedTracks: _ember['default'].computed('selectedModels.@each.isDownloaded', function () {
            return this.get('selectedModels').filterBy('isDownloaded');
        }),
        actions: {
            queue: function queue() {
                var _this = this;

                var queueableTracks = this.get('queueableTracks'),
                    length = queueableTracks.get('length');

                if (length) {
                    (function () {
                        var queue = _this.get('store').peekRecord('playlist', 'queue'),
                            trackIds = queue.get('trackIds');

                        queueableTracks.forEach(function (track) {
                            trackIds.pushObject(track.get('id'));
                        });

                        _this.get('utils').showMessage(length + ' Added to Queue');
                    })();
                }
            },
            downloadLater: function downloadLater() {
                var _this2 = this;

                var downloadableTracks = this.get('downloadableTracks'),
                    length = downloadableTracks.get('length');

                if (length) {
                    (function () {
                        var downloadLater = _this2.get('store').peekRecord('playlist', 'download-later'),
                            trackIds = downloadLater.get('trackIds');

                        downloadableTracks.forEach(function (track) {
                            trackIds.pushObject(track.get('id'));
                        });

                        _this2.get('utils').showMessage(length + ' Added to Download later');
                    })();
                }
            },
            download: function download() {
                var _this3 = this;

                var downloadableTracks = this.get('downloadableTracks'),
                    length = downloadableTracks.get('length');

                if (length) {
                    (function () {
                        var downloadLater = _this3.get('store').peekRecord('playlist', 'download-later'),
                            trackIds = downloadLater.get('trackIds');

                        downloadableTracks.forEach(function (track) {
                            track.download();

                            trackIds.removeObject(track.get('id'));
                        });

                        _this3.get('utils').showMessage(length + ' Downloading');
                    })();
                }
            },
            'delete': function _delete() {
                var downloadedTracks = this.get('downloadedTracks'),
                    length = downloadedTracks.get('length');

                if (length) {
                    downloadedTracks.forEach(function (track) {
                        track.remove();
                    });

                    this.get('utils').showMessage(length + ' Removed locally');
                }
            },
            transitionToPlaylists: function transitionToPlaylists() {
                var utils = this.get('utils');

                utils.set('selectedTrackIds', this.get('selectedModels').mapBy('id'));

                utils.transitionToRoute('subscribe');
            }
        }
    });
});
define("audio-app/components/c-tracks/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FjHrMfm0", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"selectedModels\",\"length\"]]],null,3],[\"text\",\"\\n\"],[\"block\",[\"c-endless-scroll\"],null,[[\"didScrollToBottom\"],[\"didScrollToBottom\"]],2]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"append\",[\"helper\",[\"c-spinner\"],null,[[\"class\"],[\"my-spinner\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"append\",[\"helper\",[\"c-track\"],null,[[\"model\",\"showQueued\"],[[\"get\",[\"track\"]],[\"get\",[\"track\",\"isQueued\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"track\"]},{\"statements\":[[\"block\",[\"each\"],[[\"get\",[\"models\"]]],null,1],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isPending\"]]],null,0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"my-fixed my-action-bar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"nav-wrapper\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"transitionToPlaylists\"]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"loyalty\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"queue\"]],[\"flush-element\"],[\"text\",\"\\n                      \"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"material-icons \",[\"helper\",[\"unless\"],[[\"get\",[\"queueableTracks\",\"length\"]],\"my-icon-disabled\"],null]]]],[\"flush-element\"],[\"text\",\"queue_music\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"downloadLater\"]],[\"flush-element\"],[\"text\",\"\\n                      \"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"material-icons \",[\"helper\",[\"unless\"],[[\"get\",[\"downloadableTracks\",\"length\"]],\"my-icon-disabled\"],null]]]],[\"flush-element\"],[\"text\",\"shop_two\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"download\"]],[\"flush-element\"],[\"text\",\"\\n                      \"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"material-icons \",[\"helper\",[\"unless\"],[[\"get\",[\"downloadableTracks\",\"length\"]],\"my-icon-disabled\"],null]]]],[\"flush-element\"],[\"text\",\"file_download\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"\\n                      \"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"material-icons \",[\"helper\",[\"unless\"],[[\"get\",[\"downloadedTracks\",\"length\"]],\"my-icon-disabled\"],null]]]],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deselect\"]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"cancel\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/components/c-tracks/template.hbs" } });
});
define('audio-app/helpers/app-version', ['exports', 'ember', 'audio-app/config/environment'], function (exports, _ember, _audioAppConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _audioAppConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('audio-app/helpers/is-and', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Helper.helper(function (parameters) {
        return parameters.toArray().every(function (condition) {
            return condition;
        });
    });
});
define("audio-app/helpers/is-equal", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Helper.helper(function (parameters) {
        return parameters[0] === parameters[1];
    });
});
define('audio-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('audio-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define("audio-app/helpers/time", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Helper.helper(function (parameters) {
        var seconds = parameters[0];

        if (!seconds) {
            seconds = 0;
        }

        return moment.utc(seconds * 1000).format('mm:ss');
    });
});
/* global moment */
define('audio-app/index/controller', ['exports', 'ember', 'ember-data', 'audio-app/mixins/search', 'audio-app/utils/logic', 'connection'], function (exports, _ember, _emberData, _audioAppMixinsSearch, _audioAppUtilsLogic, _connection) {
    exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsSearch['default'], {
        lastHistoryTracks: null,
        relatedByTracks: _ember['default'].computed('sortedLastHistoryTracks.[]', function () {
            return this.get('sortedLastHistoryTracks').map((function (historyTrack) {
                var options = undefined,
                    promise = undefined;

                options = {
                    relatedVideoId: historyTrack.get('id'),
                    maxResults: _audioAppUtilsLogic['default'].maxResults
                };

                promise = this.find('track', options, !_connection['default'].isMobile());

                promise = new _ember['default'].RSVP.Promise((function (resolve) {
                    this.find('track', options, !_connection['default'].isMobile()).then(function (relatedTracks) {
                        resolve(_audioAppUtilsLogic['default'].getTopRecords(relatedTracks, 4));
                    });
                }).bind(this));

                return _ember['default'].Object.create({
                    track: historyTrack,
                    relatedTracks: _emberData['default'].PromiseArray.create({
                        promise: promise
                    })
                });
            }).bind(this));
        }),
        sortedLastHistoryTracks: _ember['default'].computed.sort('lastHistoryTracks', function (track, other) {
            var models = this.get('lastHistoryTracks'),
                result = -1;

            if (!_connection['default'].isMobile()) {
                result = _audioAppUtilsLogic['default'].sortByName(track, other);
            } else if (models.indexOf(track) > models.indexOf(other)) {
                result = 1;
            }
        }),
        selectedTracks: _ember['default'].computed('lastHistoryTracks.@each.isSelected', function () {
            var selectedLastHistoryTracks = this.get('lastHistoryTracks').filterBy('isSelected'),
                selectedTracks = [];

            selectedTracks.pushObjects(selectedLastHistoryTracks);

            this.get('relatedByTracks').forEach(function (relatedByTrack) {
                selectedTracks.pushObjects(relatedByTrack.get('relatedTracks').filterBy('isSelected'));
            });

            return selectedTracks;
        }),
        actions: {
            changeSelect: function changeSelect() {
                this.notifyPropertyChange('selectedTracks');
            }
        }
    });
});
define('audio-app/index/route', ['exports', 'ember'], function (exports, _ember) {

    var lastHistoryTracksLimit = 8;

    exports['default'] = _ember['default'].Route.extend({
        actions: {
            didTransition: function didTransition() {
                var history = this.store.peekRecord('playlist', 'history'),
                    store = this.get('store'),
                    historyTrackIds = history.get('trackIds'),
                    length = historyTrackIds.get('length'),
                    lastHistoryTracks = [];

                historyTrackIds.forEach(function (trackId, index) {
                    if (length <= lastHistoryTracksLimit || length - lastHistoryTracksLimit >= index) {
                        lastHistoryTracks.pushObject(store.peekRecord('track', trackId));
                    }
                });

                this.controller.set('lastHistoryTracks', lastHistoryTracks);
            }
        }
    });
});
define("audio-app/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "w9UEjvug", "block": "{\"statements\":[[\"block\",[\"c-menu\"],null,null,4],[\"text\",\"\\n\"],[\"open-element\",\"main\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"lastHistoryTracks\"]]],null,3],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"relatedByTracks\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"chevron_right\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"append\",[\"helper\",[\"c-tracks\"],null,[[\"models\"],[[\"get\",[\"relatedByTrack\",\"relatedTracks\"]]]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"link-to\"],[\"track.related\",[\"get\",[\"relatedByTrack\",\"track\"]]],[[\"tagName\",\"class\"],[\"div\",\"my-next\"]],0]],\"locals\":[\"relatedByTrack\"]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"chevron_right\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"c-tracks\"],null,[[\"models\"],[[\"get\",[\"sortedLastHistoryTracks\"]]]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"link-to\"],[\"playlist\",\"history\"],[[\"tagName\",\"class\"],[\"div\",\"my-next\"]],2]],\"locals\":[]},{\"statements\":[[\"text\",\"    Recommended\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/index/template.hbs" } });
});
define('audio-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'audio-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _audioAppConfigEnvironment) {
  var _config$APP = _audioAppConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('audio-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('audio-app/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('audio-app/initializers/ember-cli-fastclick', ['exports', 'ember'], function (exports, _ember) {

  var EmberCliFastclickInitializer = {
    name: 'fastclick',

    initialize: function initialize() {
      _ember['default'].run.schedule('afterRender', function () {
        FastClick.attach(document.body);
      });
    }
  };

  exports['default'] = EmberCliFastclickInitializer;
});
define('audio-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('audio-app/initializers/export-application-global', ['exports', 'ember', 'audio-app/config/environment'], function (exports, _ember, _audioAppConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_audioAppConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _audioAppConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_audioAppConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('audio-app/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('audio-app/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('audio-app/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("audio-app/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define("audio-app/loading/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kmVvDEAl", "block": "{\"statements\":[[\"append\",[\"helper\",[\"c-spinner\"],null,[[\"class\",\"type\"],[\"my-spinner\",\"big\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/loading/template.hbs" } });
});
define('audio-app/mixins/adapter', ['exports', 'ember', 'domain-data', 'api-key'], function (exports, _ember, _domainData, _apiKey) {
    exports['default'] = _ember['default'].Mixin.create({
        fileSystem: _ember['default'].inject.service(),
        buildUrlByEndpoint: function buildUrlByEndpoint(endpoint, options) {
            var url = _domainData['default'].searchName + '/youtube/v3/' + endpoint + '?part=snippet' + '&key=' + _apiKey['default'];

            if (options) {
                if (options.maxResults) {
                    url += '&maxResults=' + options.maxResults;
                }

                if (options.nextPageToken) {
                    url += '&pageToken=' + options.nextPageToken;
                }
            }

            return url;
        },
        buildUrlByType: function buildUrlByType(type, options) {
            var url = this.buildUrlByEndpoint('search', options) + '&order=viewCount&type=' + type;

            if (options.query) {
                url += '&q=' + options.query;
            }

            return url;
        },
        findRecord: function findRecord(store, type, id, endpoint) {
            var url = this.buildUrlByEndpoint(endpoint) + '&id=' + id;

            return new _ember['default'].RSVP.Promise((function (resolve, reject) {
                _ember['default'].$.getJSON(url).then((function (payload) {
                    payload.deserializeSingleRecord = true;

                    _ember['default'].run(null, resolve, payload);
                }).bind(this), function (response) {
                    _ember['default'].run(null, reject, response);
                });
            }).bind(this));
        },
        query: function query(store, type, options) {
            var url = this.buildUrl(type.modelName, null, null, 'query', options);

            return new _ember['default'].RSVP.Promise(function (resolve, reject) {
                _ember['default'].$.getJSON(url).then(function (payload) {
                    options.setNextPageToken(payload.nextPageToken);

                    _ember['default'].run(null, resolve, payload);
                }, function (response) {
                    _ember['default'].run(null, reject, response);
                });
            });
        },
        updateRecord: function updateRecord(store, type, snapshot) {
            var fileSystem = this.get('fileSystem'),
                snippetIds = fileSystem.get(type.modelName + 'Ids'),
                promise = undefined;

            if (!snippetIds.includes(snapshot.id)) {
                snippetIds.pushObject(snapshot.id);

                // TODO: Implement 'insertWithoutAudio' for playlist also?
                if (snapshot.record.insertWithoutAudio) {
                    promise = snapshot.record.insertWithoutAudio();
                }
            }

            return _ember['default'].RSVP.resolve(promise).then(function () {
                return fileSystem.save();
            }).then(function () {
                return {
                    deserializeSingleRecord: true,
                    items: [{
                        id: snapshot.id
                    }]
                };
            });
        },
        deleteRecord: function deleteRecord(store, type, snapshot) {
            var fileSystem = this.get('fileSystem');

            fileSystem.get(type.modelName + 'Ids').removeObject(snapshot.id);

            return new _ember['default'].RSVP.Promise(function (resolve) {
                fileSystem.save().then(function () {
                    var response = {
                        deserializeSingleRecord: true,
                        items: [{
                            id: snapshot.id
                        }]
                    };

                    resolve(response);
                });
            });
        }
    });
});
define('audio-app/mixins/c-action', ['exports', 'ember', 'audio-app/mixins/c-click'], function (exports, _ember, _audioAppMixinsCClick) {
    exports['default'] = _ember['default'].Mixin.create(_audioAppMixinsCClick['default'], {
        param: null,
        isAsync: true,
        onClick: function onClick() {
            var param = this.get('param');

            if (this.get('isAsync')) {
                this.sendAction('action', this.resolve.bind(this), param);
            } else {
                if (this.get('action')) {
                    this.sendAction('action', param);
                }

                this.resolve();
            }
        }
    });
});
define('audio-app/mixins/c-click', ['exports', 'ember', 'audio-app/mixins/c-loading'], function (exports, _ember, _audioAppMixinsCLoading) {
    exports['default'] = _ember['default'].Mixin.create(_audioAppMixinsCLoading['default'], {
        attributeBindings: ['disabled'],
        onClick: null,
        click: function click() {
            if (!this.get('disabled')) {
                this.setupPending().then(this.onClick.bind(this));
            }
        }
    });
});
define('audio-app/mixins/c-link', ['exports', 'ember', 'audio-app/mixins/c-click'], function (exports, _ember, _audioAppMixinsCClick) {
    exports['default'] = _ember['default'].Mixin.create(_audioAppMixinsCClick['default'], {
        utils: _ember['default'].inject.service(),
        route: null,
        model: null,
        queryParams: null,
        onClick: function onClick() {
            var queryParams = this.get('queryParams'),
                model = this.get('model'),
                parameters = undefined;

            if (this.get('action')) {
                this.sendAction();
            }

            parameters = [this.get('route')];

            if (model) {
                parameters.pushObject(model);
            }

            if (queryParams) {
                parameters.pushObject({
                    queryParams: queryParams
                });
            }

            this.get('utils').transitionToRoute.apply(null, parameters);

            this.resolve();
        }
    });
});
define('audio-app/mixins/c-loading', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        utils: _ember['default'].inject.service(),
        isDisabled: false,
        disabled: _ember['default'].computed('utils.isBusy', 'isDisabled', function () {
            var disabled = undefined;

            if (this.get('utils.isBusy') || this.get('isDisabled')) {
                disabled = true;
            }

            return disabled;
        }),
        isPending: false,
        resolve: function resolve() {
            if (!this.get('isDestroyed')) {
                this.set('isPending', false);
            }

            this.set('utils.isBusy', false);
        },
        setupPending: function setupPending() {
            return new _ember['default'].RSVP.Promise((function (resolve, reject) {
                if (this.get('disabled')) {
                    reject();
                } else {
                    this.set('isPending', true);
                    this.set('utils.isBusy', true);

                    _ember['default'].run.later(this, function () {
                        resolve();
                    }, 300);
                }
            }).bind(this));
        }
    });
});
define('audio-app/mixins/c-model', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        attributeBindings: ['style'],
        style: _ember['default'].String.htmlSafe('opacity: 0;'),
        model: null,
        showQueued: false,
        click: null,
        didInsertElement: function didInsertElement() {
            Materialize.fadeInImage(this.$());
        },
        actions: {
            changeSelect: function changeSelect() {
                var model = this.get('model');

                model.toggleProperty('isSelected');

                this.sendAction('changeSelect', model);
            }
        }
    });
});
/* global Materialize */
define('audio-app/mixins/c-models', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        utils: _ember['default'].inject.service(),
        total: null,
        models: [],
        selectedModels: _ember['default'].computed('models.@each.isSelected', function () {
            return this.get('models').filterBy('isSelected');
        }),
        givenTotal: _ember['default'].computed('models.length', 'total', function () {
            var givenTotal = this.get('total');

            if (!givenTotal) {
                givenTotal = this.get('models.length');
            }

            return givenTotal;
        }),
        actions: {
            deselect: function deselect() {
                this.get('selectedModels').setEach('isSelected', false);
            },
            didScrollToBottom: function didScrollToBottom() {
                this.sendAction('didScrollToBottom');
            }
        }
    });
});
define('audio-app/mixins/controller-find', ['exports', 'ember', 'audio-app/utils/logic', 'connection', 'audio-app/mixins/search'], function (exports, _ember, _audioAppUtilsLogic, _connection, _audioAppMixinsSearch) {
    exports['default'] = _ember['default'].Mixin.create(_audioAppMixinsSearch['default'], {
        isPending: false,
        isLocked: false,
        nextPageToken: null,
        searchOnline: function searchOnline() {
            return !_connection['default'].isMobile();
        },
        models: null,
        updateModels: function updateModels() {
            var options = {
                maxResults: _audioAppUtilsLogic['default'].maxResults,
                nextPageToken: this.get('nextPageToken')
            };

            this.setOptions(options);

            this.set('latestOptions', options);

            this.find(this.get('type'), options, this.searchOnline()).then((function (promise) {
                if (this.get('latestOptions') === options) {
                    this.get('models').pushObjects(promise.toArray());

                    this.set('isLocked', false);

                    if (!this.get('nextPageToken')) {
                        this.set('isPending', false);
                    }
                }
            }).bind(this));
        },
        reset: function reset() {
            this.set('nextPageToken', null);
            this.set('isPending', false);
            this.set('isLocked', false);
            this.set('models', []);
        },
        start: function start() {
            this.set('isPending', true);

            _audioAppUtilsLogic['default'].later(this, this.updateModels);
        },
        sortedModels: _ember['default'].computed.sort('models', function (model, other) {
            var models = this.get('models'),
                result = -1;

            if (!_connection['default'].isOnline()) {
                result = _audioAppUtilsLogic['default'].sortByName(model, other);
            } else if (models.indexOf(model) > models.indexOf(other)) {
                result = 1;
            }

            return result;
        }),
        actions: {
            didScrollToBottom: function didScrollToBottom() {
                if (!this.set('isLocked') && this.get('nextPageToken')) {
                    this.set('isLocked', true);

                    this.updateModels();
                }
            }
        }
    });
});
define('audio-app/mixins/controller-playlists', ['exports', 'ember', 'audio-app/utils/logic'], function (exports, _ember, _audioAppUtilsLogic) {
    exports['default'] = _ember['default'].Mixin.create({
        utils: _ember['default'].inject.service(),
        fileSystem: _ember['default'].inject.service(),
        playlists: _ember['default'].computed('fileSystem.playlistIds.[]', function () {
            var playlistIds = this.get('fileSystem.playlistIds'),
                store = this.store,
                playlists = [];

            if (playlistIds) {
                playlistIds.forEach(function (playlistId) {
                    var playlist = store.peekRecord('playlist', playlistId);

                    if (!playlist.get('permission')) {
                        playlists.pushObject(playlist);
                    }
                });
            }

            return playlists;
        }),
        sortedPlaylists: _ember['default'].computed.sort('playlists', function (playlist, other) {
            return _audioAppUtilsLogic['default'].sortByName(playlist, other);
        }),
        isCreatedMode: _ember['default'].computed('name', function () {
            return !_ember['default'].isNone(this.get('name'));
        }),
        name: null,
        createUniqueId: function createUniqueId() {
            var store = this.get('store'),
                randomId = _audioAppUtilsLogic['default'].generateRandomId();

            while (store.peekRecord('playlist', randomId)) {
                randomId = _audioAppUtilsLogic['default'].generateRandomId();
            }

            return randomId;
        },
        actions: {
            save: function save() {
                var name = this.get('name'),
                    utils = this.get('utils'),
                    store = this.store,
                    id = undefined;

                if (store.peekRecord('playlist', name)) {
                    utils.showMessage('Playlist already exists');
                } else {
                    id = this.createUniqueId();

                    store.pushPayload('playlist', {
                        id: id,
                        name: name,
                        isLocalOnly: true
                    });

                    store.peekRecord('playlist', id).save().then((function () {
                        this.set('name', null);

                        utils.showMessage('Added playlist');
                    }).bind(this));
                }
            },
            setupCreate: function setupCreate() {
                this.set('name', '');
            }
        }
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('playlists.length')) {
                this.get('utils').showMessage('No songs found');
            }
        }.observes('playlists.length'),*/
        /*TODO: Implement another way?*/
    });
});
define('audio-app/mixins/controller-search', ['exports', 'ember', 'audio-app/mixins/controller-find'], function (exports, _ember, _audioAppMixinsControllerFind) {
    exports['default'] = _ember['default'].Mixin.create(_audioAppMixinsControllerFind['default'], {
        init: function init() {
            this._super();

            this.resetController();
        },
        search: _ember['default'].inject.controller(),
        application: _ember['default'].inject.controller(),
        setOptions: function setOptions(options) {
            options.query = this.get('search.query');
        },
        resetController: _ember['default'].observer('search.query', 'application.currentRouteName', 'target.currentRouteName', function () {
            if (this.get('application.currentRouteName') === this.get('target.currentRouteName')) {
                this.reset();

                if (!_ember['default'].isNone(this.get('search.query'))) {
                    this.start();
                }
            }
        })
    });
});
define('audio-app/mixins/model', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
    exports['default'] = _ember['default'].Mixin.create({
        fileSystem: _ember['default'].inject.service(),
        name: _emberData['default'].attr('string'),
        onlineThumbnail: _emberData['default'].attr('string'),
        concatenatedProperties: ['propertyNames'],
        isSelected: false,
        propertyNames: ['id', 'name'],
        serialize: function serialize() {
            return this.getProperties(this.get('propertyNames'));
        }
    });
});
define('audio-app/mixins/route-model', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        type: null,
        model: function model(parameters) {
            var modelId = parameters[this.get('type') + '_id'],
                model = this.store.peekRecord(this.get('type'), modelId);

            if (!model) {
                model = this.store.findRecord(this.get('type'), modelId);
            }

            return model;
        }
    });
});
define('audio-app/mixins/safe-style', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        attributeBindings: ['safeStyle:style'],
        style: null,
        safeStyle: _ember['default'].computed('style', function () {
            var style = this.get('style');

            if (style) {
                style = _ember['default'].String.htmlSafe(style);
            }

            return style;
        })
    });
});
define('audio-app/mixins/search', ['exports', 'ember', 'ember-data', 'audio-app/utils/logic'], function (exports, _ember, _emberData, _audioAppUtilsLogic) {
    exports['default'] = _ember['default'].Mixin.create({
        find: function find(modelName, options, searchOnline) {
            var store = this.store,
                promiseArray = undefined;

            if (searchOnline) {
                options.setNextPageToken = (function (nextPageToken) {
                    this.set('nextPageToken', nextPageToken);
                }).bind(this);

                promiseArray = store.query(modelName, options);
            } else {
                var snippets = undefined;

                if (options.playlistId) {
                    snippets = store.peekRecord('playlist', options.playlistId).get('trackIds').map(function (trackId) {
                        return store.peekRecord('track', trackId);
                    });
                } else {
                    snippets = store.peekAll(modelName).filter(function (snippet) {
                        return !snippet.get('permission') && _audioAppUtilsLogic['default'].isMatch(snippet.get('name'), options.query);
                    });
                }

                promiseArray = _emberData['default'].PromiseArray.create({
                    promise: _ember['default'].RSVP.resolve(snippets)
                });
            }

            return promiseArray;
        }
    });
});
define('audio-app/mixins/serializer', ['exports', 'ember', 'domain-data'], function (exports, _ember, _domainData) {

    var sizes = ['maxres', 'standard', 'high', 'medium', 'default'];

    function convertImageUrl(url) {
        return _domainData['default'].imageName + new URL(url).pathname;
    }

    function getUrlFor(thumbnails, index) {
        var image = thumbnails[sizes.objectAt(index)],
            url = undefined;

        if (image) {
            url = image.url;
        } else {
            index += 1;

            if (sizes.get('length') > index) {
                url = getUrlFor(thumbnails, index);
            }
        }

        return url;
    }

    exports['default'] = _ember['default'].Mixin.create({
        pushPayload: function pushPayload(store, payload, modelName) {
            var id = payload.id;

            delete payload.id;

            store.push({
                data: {
                    type: modelName,
                    id: id,
                    attributes: payload
                }
            });
        },
        normalizeResponse: function normalizeResponse(store, primaryModelClass, payload) {
            var data = [];

            payload.items.forEach((function (item) {
                var snippet = this.normalize(store, primaryModelClass, item);

                if (snippet) {
                    data.pushObject(snippet);
                }
            }).bind(this));

            if (payload.deserializeSingleRecord) {
                data = data.get(0);
            }

            return {
                data: data
            };
        },
        peekSnippet: function peekSnippet(store, modelName, id, item) {
            var snippet = store.peekRecord(modelName, id);

            if (snippet) {
                snippet = snippet.serialize();

                delete snippet.id;
            } else {
                var thumbnails = item.snippet.thumbnails,
                    thumbnail = undefined;

                if (thumbnails) {
                    var url = getUrlFor(thumbnails, 0);

                    if (url) {
                        thumbnail = convertImageUrl(url);
                    }
                }

                snippet = {
                    name: item.snippet.title,
                    onlineThumbnail: thumbnail
                };
            }

            return snippet;
        }
    });
});
define('audio-app/playlist/adapter', ['exports', 'ember-data', 'audio-app/mixins/adapter'], function (exports, _emberData, _audioAppMixinsAdapter) {
    exports['default'] = _emberData['default'].Adapter.extend(_audioAppMixinsAdapter['default'], {
        buildUrl: function buildUrl(modelName, id, snapshot, requestType, options) {
            return this.buildUrlByType('playlist', options);
        },
        findRecord: function findRecord(store, type, id) {
            return this._super(store, type, id, 'playlists');
        }
    });
});
define('audio-app/playlist/controller', ['exports', 'ember', 'audio-app/mixins/controller-find'], function (exports, _ember, _audioAppMixinsControllerFind) {
    exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsControllerFind['default'], {
        utils: _ember['default'].inject.service(),
        model: null,
        type: 'track',
        searchOnline: function searchOnline() {
            return !this.get('model.isLocalOnly') && this._super();
        },
        setOptions: function setOptions(options) {
            options.playlistId = this.get('model.id');

            if (!this.searchOnline()) {
                this.set('models', []);
            }
        },
        updateOffline: _ember['default'].observer('model.trackIds.[]', function () {
            if (!this.searchOnline()) {
                this.updateModels();
            }
        }),
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('tracks.length')) {
                this.get('utils').showMessage('No songs found');
            }
        }.observes('tracks.length'),*/
        /*TODO: Implement another way?*/
        name: null,
        isEditMode: _ember['default'].computed('name', function () {
            return !_ember['default'].isNone(this.get('name'));
        }),
        actions: {
            // TODO: implement more actions? (every action defined in playlists?)
            download: function download() {
                var playlist = this.get('model');

                if (playlist.get('isSelected')) {
                    playlist.download(this.get('nextPageToken'));
                } else {
                    this._super();
                }
            },
            removeFromPlaylist: function removeFromPlaylist() {
                var trackIds = this.get('selectedTracks').mapBy('id'),
                    store = this.get('store'),
                    playlist = this.get('model');

                trackIds.forEach(function (trackId) {
                    var track = store.peekRecord('track', trackId);

                    track.removeFromPlaylist(playlist);

                    track.set('isSelected', false);
                });
            },
            setupEdit: function setupEdit() {
                var name = this.get('model.name');

                this.set('name', name);
            },
            save: function save() {
                var playlist = this.get('model');

                playlist.set('name', this.get('name'));

                playlist.save();

                this.set('name', null);
            }
        }
    });
});
define('audio-app/playlist/model', ['exports', 'ember', 'ember-data', 'audio-app/mixins/model', 'audio-app/mixins/search', 'audio-app/utils/logic'], function (exports, _ember, _emberData, _audioAppMixinsModel, _audioAppMixinsSearch, _audioAppUtilsLogic) {
    exports['default'] = _emberData['default'].Model.extend(_audioAppMixinsModel['default'], _audioAppMixinsSearch['default'], {
        permission: _emberData['default'].attr('string'),
        isLocalOnly: _emberData['default'].attr('boolean', {
            defaultValue: false
        }),
        trackIds: _emberData['default'].attr({
            defaultValue: function defaultValue() {
                return [];
            }
        }),
        tracks: _ember['default'].computed('trackIds.[]', function () {
            var store = this.store;

            return this.get('trackIds').map(function (trackId) {
                return store.peekRecord('track', trackId);
            });
        }),
        totalTracks: _emberData['default'].attr('number'),
        thumbnail: _ember['default'].computed('tracks.firstObject.thumbnail', 'onlineThumbnail', function () {
            var tracks = this.get('tracks'),
                thumbnail = undefined;

            if (tracks.get('length')) {
                var track = tracks.get('firstObject');

                thumbnail = track.get('thumbnail');
            } else {
                var onlineThumbnail = this.get('onlineThumbnail');

                if (onlineThumbnail) {
                    thumbnail = onlineThumbnail;
                }
            }

            return thumbnail;
        }),
        numberOfTracks: _ember['default'].computed('trackIds.length', 'totalTracks', function () {
            var numberOfTracks = this.get('totalTracks');

            if (!numberOfTracks) {
                numberOfTracks = this.get('trackIds.length');
            }

            return numberOfTracks;
        }),
        isSaved: _ember['default'].computed('fileSystem.tracks.[]', function () {
            return this.get('fileSystem.playlistIds').includes(this.get('id'));
        }),
        isReadOnly: _ember['default'].computed('permission', function () {
            return this.get('permission') === 'read-only' || !this.get('isLocalOnly');
        }),
        isPushOnly: _ember['default'].computed('permission', function () {
            return this.get('permission') === 'push-only';
        }),
        isEditable: _ember['default'].computed('isReadOnly', 'isPushOnly', function () {
            return !this.get('isReadOnly') && !this.get('isPushOnly');
        }),
        propertyNames: ['isLocalOnly', 'trackIds', 'permission'],
        isQueue: _ember['default'].computed('id', function () {
            return this.get('id') === 'queue';
        }),
        nextPageToken: null,
        download: function download(nextPageToken) {
            this.set('nextPageToken', nextPageToken);

            this.saveNextTracks();
            this.downloadNextTrack(0);
        },
        saveNextTracks: function saveNextTracks() {
            var nextPageToken = this.get('nextPageToken'),
                options = undefined;

            if (!nextPageToken) {
                options = {
                    playlistId: this.get('id'),
                    maxResults: _audioAppUtilsLogic['default'].maxResults,
                    nextPageToken: nextPageToken
                };

                this.find('track', options, true).then((function (tracks) {
                    this.get('trackIds').pushObjects(tracks.mapBy('id'));

                    tracks.forEach(function (track) {
                        track.save();
                    });

                    this.saveNextTracks(this.get('id'));
                }).bind(this));
            }
        },
        downloadNextTrack: function downloadNextTrack(index) {
            var trackId = this.get('trackIds').objectAt(index),
                track = undefined;

            if (trackId) {
                track = this.get('store').peekRecord('track', trackId);

                if (track.get('isDownloadable')) {
                    track.download().then((function () {
                        this.downloadNextTrack(index + 1);
                    }).bind(this));
                }
            }
        },
        pushTrackById: function pushTrackById(trackId) {
            var track = this.get('store').peekRecord('track', trackId);

            this.get('trackIds').pushObject(trackId);
            this.save();

            if (!track.get('isSaved')) {
                track.save();
            }
        },
        remove: function remove() {
            this.get('trackIds').forEach((function (trackId) {
                var track = this.get('store').peekRecord('track', trackId);

                track.removeFromPlayList(this);
            }).bind(this));

            this.destroyRecord();
        }
    });
});
define('audio-app/playlist/route', ['exports', 'ember', 'audio-app/mixins/route-model'], function (exports, _ember, _audioAppMixinsRouteModel) {
    exports['default'] = _ember['default'].Route.extend(_audioAppMixinsRouteModel['default'], {
        type: 'playlist',
        setupController: function setupController(controller, model) {
            this._super(controller, model);

            controller.reset();
            controller.start();
        }
        // TODO: fix bug where route-model does not call didTransition when model does not change
    });
});
define('audio-app/playlist/serializer', ['exports', 'ember-data', 'audio-app/mixins/serializer'], function (exports, _emberData, _audioAppMixinsSerializer) {
    exports['default'] = _emberData['default'].Serializer.extend(_audioAppMixinsSerializer['default'], {
        pushPayload: function pushPayload(store, payload) {
            this._super(store, payload, 'playlist');
        },
        normalize: function normalize(store, typeClass, item) {
            var id = undefined;

            if (item.id.playlistId) {
                id = item.id.playlistId;
            } else {
                id = item.id;
            }

            return {
                type: typeClass.modelName,
                id: id,
                attributes: this.peekSnippet(store, typeClass.modelName, id, item)
            };
        }
    });
});
define("audio-app/playlist/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "s7ShjYTl", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isEditMode\"]]],null,5,4],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card my-card-cover\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-image\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"c-parallax\"],null,[[\"src\"],[[\"get\",[\"model\",\"thumbnail\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-content my-relative\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isEditable\"]]],null,3],[\"text\",\"\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"card-title activator grey-text text-darken-4\"],[\"flush-element\"],[\"text\",\"\\n      Playlist\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row my-subtext\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"truncate\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isSaved\"]]],null,0],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-action\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"h5\",[]],[\"static-attr\",\"class\",\"my-center my-cover-section\"],[\"flush-element\"],[\"text\",\"\\n  Tracks\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"c-tracks\"],null,[[\"models\",\"isPending\",\"didScrollToBottom\"],[[\"get\",[\"sortedModels\"]],[\"get\",[\"isPending\"]],\"didScrollToBottom\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons left\"],[\"flush-element\"],[\"text\",\"save\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating blue\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"save\"]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"save\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating red\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"fixed-action-btn horizontal click-to-toggle my-card-content\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"btn-floating btn-large waves-effect waves-light red my-model-btn\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"menu\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating yellow darken-1\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setupEdit\"]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"mode_edit\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isSaved\"]]],null,2,1],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"append\",[\"unknown\",[\"c-menu\"]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"c-input-bar\"],null,[[\"value\",\"placeholder\",\"done\"],[[\"get\",[\"name\"]],\"Edit\",\"save\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/playlist/template.hbs" } });
});
define('audio-app/playlists/controller', ['exports', 'ember', 'audio-app/mixins/controller-playlists'], function (exports, _ember, _audioAppMixinsControllerPlaylists) {
  exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsControllerPlaylists['default']);
});
define("audio-app/playlists/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "fXffcYXb", "block": "{\"statements\":[[\"block\",[\"c-menu\"],null,null,2],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isCreatedMode\"]]],null,1,0],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"c-playlists\"],null,[[\"models\",\"showSaved\"],[[\"get\",[\"sortedPlaylists\"]],false]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating btn-large waves-effect waves-light red my-fixed my-action-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setupCreate\"]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"add\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"c-input-bar\"],null,[[\"value\",\"placeholder\",\"done\"],[[\"get\",[\"name\"]],\"Create\",\"save\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    My Playlists\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/playlists/template.hbs" } });
});
define('audio-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('audio-app/router', ['exports', 'ember', 'audio-app/config/environment'], function (exports, _ember, _audioAppConfigEnvironment) {

    var Router = _ember['default'].Router.extend({
        location: _audioAppConfigEnvironment['default'].locationType,
        rootURL: _audioAppConfigEnvironment['default'].rootURL
    });

    Router.map(function () {
        this.route('search', function () {
            this.route('tracks');
            this.route('playlists');
        });

        this.route('playlist', {
            path: 'playlist/:playlist_id'
        });

        this.route('subscribe');

        this.route('track', {
            path: 'track/:track_id'
        }, function () {
            this.route('queue');
            this.route('related');
        });

        this.route('playlists');
        this.route('settings');
    });

    exports['default'] = Router;
});
define('audio-app/search/controller', ['exports', 'ember', 'domain-data', 'audio-app/components/c-autocomplete/suggestion', 'audio-app/utils/logic', 'connection'], function (exports, _ember, _domainData, _audioAppComponentsCAutocompleteSuggestion, _audioAppUtilsLogic, _connection) {

    var maxSuggestions = 10;

    exports['default'] = _ember['default'].Controller.extend({
        application: _ember['default'].inject.controller(),
        query: null,
        value: '',
        suggestions: [],
        updateSuggestions: _ember['default'].observer('value', function () {
            var value = this.get('value'),
                suggestions = [];

            if (value) {
                this.peek('track');
                this.peek('playlist');

                if (_connection['default'].isOnline() && suggestions.get('length') < maxSuggestions) {
                    var url = _domainData['default'].suggestName + '/complete/search?client=firefox&ds=yt&q=' + value;

                    _ember['default'].$.getJSON(url).then((function (response) {
                        response[1].any(function (suggestion) {
                            suggestions.pushObject(_audioAppComponentsCAutocompleteSuggestion['default'].create({
                                value: suggestion
                            }));

                            return suggestions.get('length') >= maxSuggestions;
                        });

                        this.set('suggestions', suggestions);
                    }).bind(this));
                }
            }
        }),
        peek: function peek(modelName) {
            var value = this.get('value'),
                suggestions = this.get('suggestions');

            this.store.peekAll(modelName).any(function (snippet) {
                var suggestion = snippet.get('name');

                if (!snippet.get('permission') && _audioAppUtilsLogic['default'].isMatch(suggestion, value)) {
                    suggestions.pushObject(_audioAppComponentsCAutocompleteSuggestion['default'].create({
                        value: _ember['default'].String.decamelize(suggestion)
                    }));
                }

                return suggestions.get('length') >= maxSuggestions;
            });
        },
        actions: {
            search: function search() {
                var value = this.get('value');

                if (this.get('query') === value) {
                    return true;
                } else {
                    this.set('query', value);
                }
            }
        }
    });
});
define('audio-app/search/playlists/controller', ['exports', 'ember', 'audio-app/mixins/controller-search'], function (exports, _ember, _audioAppMixinsControllerSearch) {
    exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsControllerSearch['default'], {
        type: 'playlist'
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('playlists.length')) {
                this.get('utils').showMessage('No songs found');
            }
        }.observes('playlists.length'),*/
        /*TODO: Implement another way?*/
    });
});
define("audio-app/search/playlists/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "bXiISjAt", "block": "{\"statements\":[[\"append\",[\"helper\",[\"c-playlists\"],null,[[\"models\",\"isPending\",\"didScrollToBottom\"],[[\"get\",[\"sortedModels\"]],[\"get\",[\"isPending\"]],\"didScrollToBottom\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/search/playlists/template.hbs" } });
});
define('audio-app/search/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        queryParams: {
            query: {
                replace: true
            }
        },
        setupController: function setupController(controller, model) {
            var query = controller.get('query');

            controller.set('value', query);

            this._super(controller, model);
        },
        actions: {
            search: function search() {
                this.controllerFor(this.controller.get('application.currentRouteName')).resetController();
            }
        }
    });
});
define("audio-app/search/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "sW2lNTWz", "block": "{\"statements\":[[\"block\",[\"c-fixed\"],null,[[\"class\"],[\"my-input-bar\"]],3],[\"text\",\"\\n\"],[\"block\",[\"c-tabs\"],null,[[\"class\"],[\"z-depth-1 my-tabs-darken\"]],2],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            Playlists\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            Tracks\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"tab col s6\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"search.tracks\"],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"tab col s6\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"search.playlists\"],null,0],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"c-autocomplete\"],null,[[\"search\",\"value\",\"suggestions\"],[\"search\",[\"get\",[\"value\"]],[\"get\",[\"suggestions\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/search/template.hbs" } });
});
define('audio-app/search/tracks/controller', ['exports', 'ember', 'audio-app/mixins/controller-search'], function (exports, _ember, _audioAppMixinsControllerSearch) {
    exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsControllerSearch['default'], {
        type: 'track'
    });
});
define("audio-app/search/tracks/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "g3Jzs+KN", "block": "{\"statements\":[[\"append\",[\"helper\",[\"c-tracks\"],null,[[\"models\",\"isPending\",\"didScrollToBottom\"],[[\"get\",[\"sortedModels\"]],[\"get\",[\"isPending\"]],\"didScrollToBottom\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/search/tracks/template.hbs" } });
});
define('audio-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('audio-app/services/audio-player', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        element: null,
        track: null,
        currentTime: null,
        duration: null,
        buffered: null,
        status: null,
        didEnd: null,
        isLargeMode: false,
        isLoading: _ember['default'].computed('status', function () {
            return this.get('status') === 'loading';
        }),
        isPlaying: _ember['default'].computed('status', function () {
            return this.get('status') === 'playing';
        }),
        isIdle: _ember['default'].computed('status', function () {
            return this.get('status') === 'idle';
        }),
        setCurrentTime: function setCurrentTime(currentTime) {
            this.get('element').currentTime = currentTime;
        },
        play: function play(track) {
            var element = this.get('element');

            if (track) {
                this.load(track).then(function () {
                    element.play();
                });
            } else {
                element.play();
            }
        },
        pause: function pause() {
            this.get('element').pause();
        },
        load: function load(track) {
            var audio = track.get('audio');

            this.set('status', 'loading');
            this.set('track', track);

            return new _ember['default'].RSVP.Promise((function (resolve) {
                if (!audio) {
                    track.findAudioSource().then((function (url) {
                        this.loadSource(url);

                        resolve();
                    }).bind(this));
                } else {
                    this.loadSource(audio);

                    resolve();
                }
            }).bind(this));
        },
        loadSource: function loadSource(source) {
            var element = this.get('element');

            if (element) {
                element.src = source;
                element.load();
            }
        }
    });
});
define('audio-app/services/audio-remote', ['exports', 'ember', 'audio-app/components/c-audio-slider/object'], function (exports, _ember, _audioAppComponentsCAudioSliderObject) {
    exports['default'] = _ember['default'].Service.extend({
        audioPlayer: _ember['default'].inject.service(),
        fileSystem: _ember['default'].inject.service(),
        utils: _ember['default'].inject.service(),
        store: _ember['default'].inject.service(),
        connect: function connect() {
            var audioPlayer = this.get('audioPlayer'),
                audioSlider = undefined;

            audioSlider = _audioAppComponentsCAudioSliderObject['default'].create({
                onSlideStop: function onSlideStop(value) {
                    audioPlayer.setCurrentTime(value);
                }
            });

            audioPlayer.addObserver('currentTime', audioPlayer, function () {
                audioSlider.setValue(this.get('currentTime'));
            });

            audioPlayer.addObserver('duration', audioPlayer, function () {
                audioSlider.set('max', this.get('duration'));
            });

            this.set('utils.audioSlider', audioSlider);

            audioPlayer.set('didEnd', this.next.bind(this));
        },
        play: function play(track) {
            var audioPlayer = this.get('audioPlayer');

            if (track) {
                var store = this.get('store'),
                    fileSystem = this.get('fileSystem'),
                    id = track.get('id'),
                    _history = store.peekRecord('playlist', 'history'),
                    historyTrackIds = _history.get('trackIds'),
                    queue = store.peekRecord('playlist', 'queue'),
                    queueTrackIds = queue.get('trackIds');

                if (historyTrackIds.includes(id)) {
                    historyTrackIds.removeObject(id);
                }

                historyTrackIds.pushObject(id);

                _history.save();

                if (!queueTrackIds.includes(id)) {
                    if (audioPlayer.get('track.id')) {
                        queueTrackIds.insertAt(queueTrackIds.indexOf(audioPlayer.get('track.id')) + 1, id);
                    } else {
                        queueTrackIds.pushObject(id);
                    }

                    queue.save();
                }

                fileSystem.save();

                track.save();

                if (fileSystem.get('downloadBeforePlaying') && !track.get('isDownloaded')) {
                    track.download().then(function () {
                        audioPlayer.play(track);
                    });
                } else {
                    audioPlayer.play(track);
                }
            } else {
                audioPlayer.play(track);
            }
        },
        pause: function pause() {
            this.get('audioPlayer').pause();
        },
        previous: function previous() {
            var store = this.get('store'),
                queueTrackIds = store.peekRecord('playlist', 'queue').get('trackIds'),
                currentTrackId = this.get('audioPlayer.track.id'),
                previousIndex = queueTrackIds.indexOf(currentTrackId) - 1,
                trackId = undefined;

            if (previousIndex === -1) {
                previousIndex = queueTrackIds.get('length') - 1;
            }

            trackId = queueTrackIds.objectAt(previousIndex);
            this.play(store.peekRecord('track', trackId));
        },
        next: function next() {
            var store = this.get('store'),
                queueTrackIds = store.peekRecord('playlist', 'queue').get('trackIds'),
                currentTrackId = this.get('audioPlayer.track.id'),
                nextIndex = queueTrackIds.indexOf(currentTrackId) + 1,
                trackId = undefined;

            if (nextIndex === queueTrackIds.get('length')) {
                nextIndex = 0;
            }

            trackId = queueTrackIds.objectAt(nextIndex);
            this.play(store.peekRecord('track', trackId));
        }
    });
});
define('audio-app/services/cordova', ['exports', 'ember-cordova/services/cordova'], function (exports, _emberCordovaServicesCordova) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCordovaServicesCordova['default'];
    }
  });
});
define('audio-app/services/device/platform', ['exports', 'ember-cordova/services/device/platform'], function (exports, _emberCordovaServicesDevicePlatform) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCordovaServicesDevicePlatform['default'];
    }
  });
});
define('audio-app/services/device/splashscreen', ['exports', 'ember-cordova/services/device/splashscreen'], function (exports, _emberCordovaServicesDeviceSplashscreen) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCordovaServicesDeviceSplashscreen['default'];
    }
  });
});
define('audio-app/services/file-system', ['exports', 'ember'], function (exports, _ember) {

    var lastWriter = undefined;
    // TODO: implement correctly
    /*import Playlist from 'audio-app/playlist/model';
    import Track from 'audio-app/track/model';*/

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    function write(resolve) {
        var json = this.serialize();

        this.get('instance').root.getFile('data.json', {}, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                    if (!fileWriter.length) {
                        fileWriter.write(new Blob([json], {
                            type: 'application/json'
                        }));
                    }

                    resolve();
                };

                fileWriter.truncate(0);
            });
        });
    }

    exports['default'] = _ember['default'].Service.extend({
        store: _ember['default'].inject.service(),
        instance: null,
        playlistIds: null,
        trackIds: null,
        downloadLater: false,
        // TODO: downloadBeforePlaying to true
        downloadBeforePlaying: false,
        // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
        forge: function forge() {
            return new _ember['default'].RSVP.Promise((function (resolve) {
                navigator.webkitPersistentStorage.queryUsageAndQuota((function (usage, quota) {
                    if (quota > usage) {
                        this.create(quota).then((function (instance) {
                            this.createFiles(instance).then(resolve);
                        }).bind(this));
                    } else {
                        this.increaseQuota().then((function (instance) {
                            this.createFiles(instance).then(resolve);
                        }).bind(this));
                    }
                }).bind(this));
            }).bind(this));
        },
        increaseQuota: function increaseQuota() {
            return new _ember['default'].RSVP.Promise((function (resolve) {
                navigator.webkitPersistentStorage.requestQuota(Number.MAX_SAFE_INTEGER, (function (bytes) {
                    this.create(bytes).then(resolve);
                }).bind(this));
            }).bind(this));
        },
        create: function create(bytes) {
            return new _ember['default'].RSVP.Promise((function (resolve) {
                requestFileSystem(PERSISTENT, bytes, (function (fileSystem) {
                    this.set('instance', fileSystem);

                    resolve(fileSystem);
                }).bind(this));
            }).bind(this));
        },
        remove: function remove(source) {
            return new _ember['default'].RSVP.Promise((function (resolve) {
                this.get('instance').root.getFile(source, {}, function (fileEntry) {
                    fileEntry.remove(function () {
                        resolve();
                    });
                });
            }).bind(this));
        },
        createFiles: function createFiles(instance) {
            var deserialize = this.deserialize.bind(this);

            return new _ember['default'].RSVP.Promise((function (resolve) {
                instance.root.getDirectory('thumbnails', {
                    create: true
                });

                instance.root.getDirectory('audio', {
                    create: true
                });

                instance.root.getFile('data.json', {}, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function () {
                            deserialize(this.result);

                            resolve();
                        };

                        reader.readAsText(file);
                    });
                }, (function () {
                    instance.root.getFile('data.json', {
                        create: true
                    }, (function () {
                        deserialize(JSON.stringify({
                            tracks: [],
                            playlists: [{
                                id: 'download-later',
                                name: 'Download later',
                                isLocalOnly: true,
                                permission: 'push-only'
                            }, {
                                id: 'queue',
                                name: 'Queue',
                                isLocalOnly: true,
                                permission: 'push-only'
                            }, {
                                id: 'history',
                                name: 'History',
                                isLocalOnly: true,
                                permission: 'read-only'
                            }]
                        }));

                        this.save().then(resolve);
                    }).bind(this));
                }).bind(this));
            }).bind(this));
        },
        save: function save() {
            _ember['default'].run.cancel(lastWriter);

            return new _ember['default'].RSVP.Promise((function (resolve) {
                lastWriter = _ember['default'].run.later(this, write, resolve, 100);
            }).bind(this));
        },
        deserialize: function deserialize(json) {
            var store = this.get('store'),
                parsedJSON = JSON.parse(json),
                playlists = parsedJSON.playlists,
                tracks = parsedJSON.tracks;

            parsedJSON.playlistIds = playlists.map(function (playlist) {
                return playlist.id;
            });

            delete parsedJSON.playlists;

            parsedJSON.trackIds = tracks.map(function (track) {
                return track.id;
            });

            delete parsedJSON.tracks;

            this.setProperties(parsedJSON);

            playlists.map(function (playlist) {
                var id = playlist.id;

                delete playlist.id;

                store.push({
                    data: {
                        type: 'playlist',
                        id: id,
                        attributes: playlist
                    }
                });
            });

            tracks.forEach(function (track) {
                var id = track.id;

                delete track.id;

                store.push({
                    data: {
                        type: 'track',
                        id: id,
                        attributes: track
                    }
                });
            });
        },
        serialize: function serialize() {
            var store = this.get('store'),
                data = {};

            data.playlists = this.get('playlistIds').map(function (id) {
                return store.peekRecord('playlist', id).serialize();
            });

            data.tracks = this.get('trackIds').map(function (id) {
                return store.peekRecord('track', id).serialize();
            });

            return JSON.stringify(data);
        }
    });
});
/* global window, Blob, FileReader, PERSISTENT, Number, requestFileSystem */
define('audio-app/services/utils', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        fileSystem: null,
        selectedTrackIds: [],
        // TODO: place somewhere else.
        showMessage: function showMessage(message) {
            Materialize.toast(message, 3000);
        },
        audioSlider: null,
        isBusy: false,
        transitionToRoute: null
    });
});
/* global Materialize */
define('audio-app/settings/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        fileSystem: _ember['default'].inject.service(),
        saveFileSystem: _ember['default'].observer('fileSystem.downloadLater', 'fileSystem.downloadBeforePlaying', function () {
            this.get('fileSystem').save();
        })
    });
});
define("audio-app/settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "a2QRPrJV", "block": "{\"statements\":[[\"block\",[\"c-menu\"],null,null,0],[\"text\",\"\\n\"],[\"open-element\",\"main\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"checked\"],[\"checkbox\",\"download-later\",[\"get\",[\"fileSystem\",\"downloadLater\"]]]]],false],[\"text\",\"\\n\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"download-later\"],[\"flush-element\"],[\"text\",\"\\n                Download track later when I have wifi\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"checked\"],[\"checkbox\",\"download-before\",[\"get\",[\"fileSystem\",\"downloadBeforePlaying\"]]]]],false],[\"text\",\"\\n\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"download-before\"],[\"flush-element\"],[\"text\",\"\\n                Download track before playing\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"file-field input-field\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"btn\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"File\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"unknown\",[\"c-file-input\"]],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"file-path-wrapper\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"file-path validate\"],[\"static-attr\",\"placeholder\",\"Upload one or more files\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    Settings\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/settings/template.hbs" } });
});
define('audio-app/subscribe/controller', ['exports', 'ember', 'audio-app/mixins/controller-playlists'], function (exports, _ember, _audioAppMixinsControllerPlaylists) {
    exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsControllerPlaylists['default'], {
        updateSelection: _ember['default'].observer('utils.selectedTrackIds.[]', 'playlists.[]', function () {
            var selectedTrackIds = this.get('utils.selectedTrackIds');

            if (selectedTrackIds.get('length')) {
                this.get('playlists').forEach(function (playlist) {
                    var isSelected = selectedTrackIds.every(function (selectedTrackId) {
                        return playlist.get('trackIds').includes(selectedTrackId);
                    });

                    playlist.set('isSelected', isSelected);
                });
            }
        }),
        actions: {
            back: function back() {
                var utils = this.get('utils');

                this.get('playlists').setEach('isSelected', false);
                utils.get('selectedTrackIds').clear();

                history.back();
            },
            changeSelect: function changeSelect(playlist) {
                var utils = this.get('utils'),
                    selectedTrackIds = utils.get('selectedTrackIds'),
                    trackIds = playlist.get('trackIds');

                if (playlist.get('isSelected')) {
                    selectedTrackIds.forEach(function (selectedTrackId) {
                        if (!trackIds.includes(selectedTrackId)) {
                            playlist.pushTrackById(selectedTrackId);
                        }
                    });

                    utils.showMessage('Added to playlist');
                } else {
                    selectedTrackIds.forEach(function (selectedTrackId) {
                        if (trackIds.includes(selectedTrackId)) {
                            var track = this.get('store').peekRecord('track', selectedTrackId);

                            track.removeFromPlayList(playlist);
                        }
                    });

                    utils.showMessage('Removed from playlist');
                }
            }
        }
    });
});
/*global history*/
define("audio-app/subscribe/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "PjeCjN19", "block": "{\"statements\":[[\"block\",[\"c-fixed\"],null,[[\"tagName\"],[\"nav\"]],3],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isCreatedMode\"]]],null,2,1],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"sortedPlaylists\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"c-playlist\"],null,[[\"model\",\"changeSelect\"],[[\"get\",[\"playlist\"]],\"changeSelect\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"playlist\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating btn-large waves-effect waves-light red my-fixed my-action-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setupCreate\"]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"add\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"c-input-bar\"],null,[[\"value\",\"placeholder\",\"done\"],[[\"get\",[\"name\"]],\"Create\",\"save\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"nav-wrapper\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-back my-back-top\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"back\"]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"arrow_back\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"brand-logo truncate\"],[\"flush-element\"],[\"text\",\"\\n        Add to playlist\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/subscribe/template.hbs" } });
});
define('audio-app/track/adapter', ['exports', 'ember-data', 'ember', 'audio-app/mixins/adapter', 'audio-app/utils/logic'], function (exports, _emberData, _ember, _audioAppMixinsAdapter, _audioAppUtilsLogic) {
    exports['default'] = _emberData['default'].Adapter.extend(_audioAppMixinsAdapter['default'], {
        query: function query(store, type, options) {
            return new _ember['default'].RSVP.Promise((function (resolve, reject) {
                this._super(store, type, options).then(function (payload) {
                    var playlist = undefined;

                    if (options.playlistId) {
                        playlist = store.peekRecord('playlist', options.playlistId);

                        if (playlist && !playlist.get('totalTracks')) {
                            playlist.set('totalTracks', payload.pageInfo.totalResults);
                        }
                    }

                    resolve(payload);
                }, reject);
            }).bind(this));
        },
        buildUrl: function buildUrl(modelName, id, snapshot, requestType, options) {
            var url = undefined;

            if (options.playlistId) {
                options.maxResults = _audioAppUtilsLogic['default'].maxResults;

                url = this.buildUrlByEndpoint('playlistItems', options) + '&playlistId=' + options.playlistId;
            } else {
                url = this.buildUrlByType('video', options);

                if (options.relatedVideoId) {
                    url += '&relatedToVideoId=' + options.relatedVideoId;
                }
            }

            return url;
        },
        findRecord: function findRecord(store, type, id) {
            return this._super(store, type, id, 'videos');
        }
    });
});
define('audio-app/track/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        utils: _ember['default'].inject.service(),
        audioRemote: _ember['default'].inject.service(),
        model: null,
        actions: {
            play: function play() {
                this.get('audioRemote').play(this.get('model'));
            },
            download: function download() {
                this.get('model').download();
            },
            'delete': function _delete() {
                this.get('model').remove();
            },
            queue: function queue() {
                this.store.peekRecord('playlist', 'queue').get('trackIds').addObject(this.get('model.id'));

                this.get('utils').showMessage('Added to queue');
            },
            transitionToPlaylists: function transitionToPlaylists() {
                var utils = this.get('utils');

                utils.set('selectedTrackIds', [this.get('model.id')]);

                utils.transitionToRoute('subscribe');
            }
        }
    });
});
define('audio-app/track/model', ['exports', 'ember-data', 'ember', 'audio-app/mixins/model', 'domain-data', 'audio-app/utils/yt-mp3', 'ember-inflector'], function (exports, _emberData, _ember, _audioAppMixinsModel, _domainData, _audioAppUtilsYtMp3, _emberInflector) {

    function signateUrl(url) {
        var host = 'http://www.youtube-mp3.org';

        return _domainData['default'].downloadName + url + '&s=' + _audioAppUtilsYtMp3['default'].createSignature(host + url);
    }

    var ObjectPromiseProxy = _ember['default'].ObjectProxy.extend(_ember['default'].PromiseProxyMixin),
        extension = {
        audio: 'mp3',
        thumbnail: 'jpg'
    };

    exports['default'] = _emberData['default'].Model.extend(_audioAppMixinsModel['default'], {
        init: function init() {
            this._super();

            if (this.get('isSaved')) {
                this.get('fileSystem.instance').root.getFile(this.createFilePath('audio'), {}, (function () {
                    this.set('isDownloaded', true);
                }).bind(this), (function () {
                    this.set('isDownloaded', false);
                }).bind(this));
            }
        },
        audioPlayer: _ember['default'].inject.service(),
        onlineAudio: null,
        thumbnail: _ember['default'].computed('onlineThumbnail', 'isSaved', function () {
            var thumbnail = undefined;

            if (this.get('isSaved')) {
                thumbnail = _domainData['default'].fileSystemName + '/' + this.createFilePath('thumbnail');
            } else {
                thumbnail = this.get('onlineThumbnail');
            }

            return thumbnail;
        }),
        audio: _ember['default'].computed('onlineAudio', 'isDownloaded', function () {
            var audio = undefined;

            if (this.get('isDownloaded')) {
                audio = _domainData['default'].fileSystemName + '/' + this.createFilePath('audio');
            } else {
                audio = this.get('onlineAudio');
            }

            return audio;
        }),
        isDownloaded: false,
        isSaved: _ember['default'].computed('id', 'fileSystem.trackIds.[]', function () {
            return this.get('fileSystem.trackIds').includes(this.get('id'));
        }),
        isPlaying: _ember['default'].computed('audioPlayer.track.id', 'id', function () {
            return this.get('audioPlayer.track.id') === this.get('id');
        }),
        isDownloadable: _ember['default'].computed('isDownloaded', 'isDownloading', function () {
            return !this.get('isDownloaded') && !this.get('isDownloading');
        }),
        queue: _ember['default'].computed(function () {
            return this.store.peekRecord('playlist', 'queue');
        }),
        isQueued: _ember['default'].computed('queue.trackIds.[]', 'id', function () {
            return this.get('queue.trackIds').includes(this.get('id'));
        }),
        downloadLater: _ember['default'].computed(function () {
            return this.store.peekRecord('playlist', 'download-later');
        }),
        isDownloadLater: _ember['default'].computed('downloadLater.trackIds.[]', 'id', function () {
            return this.get('downloadLater.trackIds').includes(this.get('id'));
        }),
        isReferenced: function isReferenced() {
            var store = this.store,
                id = this.get('id');

            return this.get('fileSystem.playlistIds').any(function (playlistId) {
                var playlist = store.peekRecord('playlist', playlistId);

                return playlist.get('trackIds').includes(id);
            });
        },
        createFilePath: function createFilePath(type) {
            var fileName = this.get('name') + '.' + extension[type],
                directory = _emberInflector['default'].inflector.pluralize(type);

            return directory + '/' + fileName;
        },
        findAudioSource: function findAudioSource() {
            var videoUrl = 'http://www.youtube.com/watch?v=' + this.get('id'),
                url = undefined;

            url = '/a/pushItem/?';
            url += 'item=' + escape(videoUrl);
            url += '&el=na&bf=false';
            url += '&r=' + new Date().getTime();

            return _ember['default'].$.ajax(signateUrl(url)).then((function (videoId) {
                url = '/a/itemInfo/?';
                url += 'video_id=' + videoId;
                url += '&ac=www&t=grp';
                url += '&r=' + new Date().getTime();

                return _ember['default'].$.ajax(signateUrl(url)).then((function (info) {
                    info = info.substring(7, info.length - 1);
                    info = JSON.parse(info);

                    url = '/get?';
                    url += 'video_id=' + videoId;
                    url += '&ts_create=' + info.ts_create;
                    url += '&r=' + info.r;
                    url += '&h2=' + info.h2;

                    this.set('onlineAudio', signateUrl(url));

                    return this.get('onlineAudio');
                }).bind(this));
            }).bind(this));
        },
        isDownloading: _ember['default'].computed('_download', function () {
            var download = this.get('_download');

            return !_ember['default'].isEmpty(download) && download.get('isPending');
        }),
        _download: null,
        download: function download() {
            var download = this.get('_download');

            if (!download || !download.get('isPending')) {
                var promise = new _ember['default'].RSVP.Promise((function (resolve, reject) {
                    if (!this.get('onlineAudio')) {
                        this.findAudioSource().then((function () {
                            this.insert().then(resolve, reject);
                        }).bind(this));
                    } else {
                        this.insert().then(resolve, reject);
                    }
                }).bind(this));

                download = ObjectPromiseProxy.create({
                    promise: promise
                });

                this.set('_download', download);
            }

            return download;
        },
        insertWithoutAudio: function insertWithoutAudio() {
            return this.downloadSource(this.get('onlineThumbnail'), this.createFilePath('thumbnail'));
        },
        insert: function insert() {
            var promises = [
            // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
            this.downloadSource(this.get('onlineAudio'), this.createFilePath('audio'))];

            if (!this.get('isSaved')) {
                // TODO: write to filesystem on track property change
                var promise = this.insertWithoutAudio().then((function () {
                    this.get('fileSystem.tracksIds').pushObject(this.get('id'));
                }).bind(this));

                promises.pushObject(promise);
            }

            _ember['default'].RSVP.all(promises).then((function () {
                this.store.peekRecord('playlist', 'download-later').get('trackIds').removeObject(this.get('id'));

                this.set('isDownloaded', true);
            }).bind(this), function (reason) {
                return reason.message;
            });
        },
        downloadSource: function downloadSource(url, source) {
            var fileSystem = this.get('fileSystem');

            return new _ember['default'].RSVP.Promise(function (resolve) {
                var xhr = new XMLHttpRequest();

                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';

                xhr.onload = function () {
                    var response = this.response;

                    fileSystem.get('instance').root.getFile(source, {
                        create: true
                    }, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onwriteend = function () {
                                resolve(fileEntry.toURL());
                            };

                            fileWriter.write(new Blob([response]));
                        });
                    });
                };

                xhr.send();
            });
        },
        removeFromPlayList: function removeFromPlayList(playList) {
            var promise = undefined;

            playList.get('trackIds').removeObject(this.get('id'));

            if (!this.isReferenced()) {
                promise = this.remove();
            }

            return _ember['default'].RSVP.resolve(promise);
        },
        remove: function remove() {
            var fileSystem = this.get('fileSystem'),
                isReferenced = this.isReferenced(),
                promises = [fileSystem.remove(this.get('audio'))];

            if (!isReferenced) {
                var promise = fileSystem.remove(this.get('thumbnail'));

                promises.pushObject(promise);
            }

            return _ember['default'].RSVP.all(promises).then((function () {
                var promises = [this.destroyRecord()];

                if (!isReferenced) {
                    fileSystem.get('trackIds').removeObject(this.get('id'));

                    promises.pushObject(fileSystem.save());
                }

                return _ember['default'].RSVP.all(promises);
            }).bind(this));
        }
    });
});
/* global escape, Blob */
define('audio-app/track/queue/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        model: null,
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('tracks.length')) {
                this.get('utils').showMessage('No songs found');
            }
        }.observes('tracks.length'),*/
        /*TODO: Implement another way?*/
        actions: {
            removeFromPlaylist: function removeFromPlaylist() {
                var trackIds = this.get('selectedTracks').mapBy('id'),
                    store = this.get('store'),
                    playlist = this.get('model');

                trackIds.forEach(function (trackId) {
                    var track = store.peekRecord('track', trackId);

                    track.removeFromPlaylist(playlist);

                    track.set('isSelected', false);
                });
            }
        }
    });
});
define('audio-app/track/queue/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {
            return this.store.peekRecord('playlist', 'queue');
        }
    });
});
define("audio-app/track/queue/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MP5XIP5u", "block": "{\"statements\":[[\"append\",[\"helper\",[\"c-tracks\"],null,[[\"models\"],[[\"get\",[\"model\",\"tracks\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/track/queue/template.hbs" } });
});
define('audio-app/track/related/controller', ['exports', 'ember', 'audio-app/mixins/controller-find'], function (exports, _ember, _audioAppMixinsControllerFind) {
    exports['default'] = _ember['default'].Controller.extend(_audioAppMixinsControllerFind['default'], {
        audioRemote: _ember['default'].inject.service(),
        type: 'track',
        setOptions: function setOptions(options) {
            options.relatedVideoId = this.get('model.id');
        }
    });
});
define('audio-app/track/related/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        setupController: function setupController(controller, model) {
            this._super(controller, model);

            controller.reset();
            controller.start();
        }
    });
});
define("audio-app/track/related/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UTe7QnBa", "block": "{\"statements\":[[\"append\",[\"helper\",[\"c-tracks\"],null,[[\"models\",\"isPending\",\"didScrollToBottom\"],[[\"get\",[\"sortedModels\"]],[\"get\",[\"isPending\"]],\"didScrollToBottom\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/track/related/template.hbs" } });
});
define('audio-app/track/route', ['exports', 'ember', 'audio-app/mixins/route-model'], function (exports, _ember, _audioAppMixinsRouteModel) {
    exports['default'] = _ember['default'].Route.extend(_audioAppMixinsRouteModel['default'], {
        type: 'track'
    });
});
define('audio-app/track/serializer', ['exports', 'ember-data', 'audio-app/mixins/serializer'], function (exports, _emberData, _audioAppMixinsSerializer) {
    exports['default'] = _emberData['default'].Serializer.extend(_audioAppMixinsSerializer['default'], {
        pushPayload: function pushPayload(store, payload) {
            this._super(store, payload, 'track');
        },
        normalize: function normalize(store, typeClass, item) {
            var id = undefined,
                data = undefined;

            if (item.id.videoId && item.id.videoId !== 'AAAAAAAAAAA') {
                id = item.id.videoId;
            } else if (item.snippet && item.snippet.resourceId && item.snippet.title !== 'Deleted video') {
                id = item.snippet.resourceId.videoId;
            } else if (typeof item.id === 'string') {
                id = item.id;
            }

            if (id) {
                data = {
                    type: typeClass.modelName,
                    id: id,
                    attributes: this.peekSnippet(store, typeClass.modelName, id, item)
                };
            }

            return data;
        }
    });
});
define("audio-app/track/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Nx/1t+KN", "block": "{\"statements\":[[\"block\",[\"c-fixed\"],null,[[\"tagName\"],[\"nav\"]],12],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card my-card-cover\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-image waves-effect waves-block waves-light\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"play\"]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"c-parallax\"],null,[[\"src\"],[[\"get\",[\"model\",\"thumbnail\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-content my-relative\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"fixed-action-btn horizontal click-to-toggle my-card-content\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"btn-floating btn-large waves-effect waves-light red my-model-btn\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"menu\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\\n            \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating yellow orange\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"transitionToPlaylists\"]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"loyalty\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"model\",\"isQueued\"]]],null,10],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isDownloaded\"]]],null,9,8],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"card-title activator grey-text text-darken-4\"],[\"flush-element\"],[\"text\",\"\\n            Track\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row my-subtext\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"truncate\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isDownloaded\"]]],null,6],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isDownloading\"]]],null,5],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-action\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"c-tabs\"],null,null,4],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"tab col s6 disabled\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"flush-element\"],[\"text\",\"\\n          Queue\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            Queue\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"tab col s6\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"track.queue\"],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            Related\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"tab col s6\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"track.related\"],null,3],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"isQueued\"]]],null,2,0]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"progress my-track-progress my-loading\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"indeterminate\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons left\"],[\"flush-element\"],[\"text\",\"offline_pin\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating blue\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"download\"]],[\"flush-element\"],[\"text\",\"\\n                            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"file_download\"],[\"close-element\"],[\"text\",\"\\n                        \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"model\",\"isDownloadable\"]]],null,7]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating red\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"\\n                            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n                        \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"javascript:void(0)\"],[\"static-attr\",\"class\",\"btn-floating yellow teal\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"queue\"]],[\"flush-element\"],[\"text\",\"\\n                            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"queue_music\"],[\"close-element\"],[\"text\",\"\\n                        \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"search\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"nav-wrapper\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"my-back my-back-top\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"back\"]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"arrow_back\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"search.tracks\",[\"helper\",[\"query-params\"],null,[[\"query\"],[null]]]],null,11],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "audio-app/track/template.hbs" } });
});
define('audio-app/utils/logic', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = {
        // TODO: is this completely correct?
        getWindowOverlayWith: function getWindowOverlayWith(element) {
            var menuHeight = 56,
                display = _ember['default'].$(window),
                height = element.height(),
                displayScollTop = display.scrollTop(),
                imageOffset = element.offset().top,
                topHeight = displayScollTop - menuHeight + display.height() - imageOffset,
                bottomHeight = imageOffset + height - displayScollTop - menuHeight;

            return {
                isVisible: topHeight > 0 && bottomHeight > 0,
                topHeight: topHeight,
                bottomHeight: bottomHeight
            };
        },
        maxResults: 50,
        later: function later(context, callback) {
            _ember['default'].run.later(context, callback, 300);
        },
        sortByName: function sortByName(model, other) {
            var result = -1,
                name = model.get('name'),
                otherName = other.get('name');

            if (name.toLowerCase() > otherName.toLowerCase()) {
                result = 1;
            } else if (name === otherName) {
                result = 0;
            }

            return result;
        },
        isMatch: function isMatch(value, query) {
            return query.trim().split(' ').every(function (queryPart) {
                return value.toLowerCase().includes(queryPart.toLowerCase());
            });
        },
        generateRandomId: function generateRandomId() {
            var randomId = '',
                possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                index = 0;

            for (index; index < 5; index++) {
                randomId += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return randomId;
        },
        getTopRecords: function getTopRecords(records, limit) {
            var topRecords = [];

            records.any(function (record, index) {
                topRecords.pushObject(record);

                return index + 1 >= limit;
            });

            return topRecords;
        }
    };
});
define('audio-app/utils/yt-mp3', ['exports'], function (exports) {
    /* jshint ignore:start */

    var b0I = {
        'V': function V(I, B, P) {
            return I * B * P;
        },
        'D': function D(I, B) {
            return I < B;
        },
        'E': function E(I, B) {
            return I == B;
        },
        'B3': function B3(I, B) {
            return I * B;
        },
        'G': function G(I, B) {
            return I < B;
        },
        'v3': function v3(I, B) {
            return I * B;
        },
        'I3': function I3(I, B) {
            return I in B;
        },
        'C': function C(I, B) {
            return I % B;
        },
        'R3': function R3(I, B) {
            return I * B;
        },
        'O': function O(I, B) {
            return I % B;
        },
        'Z': function Z(I, B) {
            return I < B;
        },
        'K': function K(I, B) {
            return I - B;
        }
    };

    function _sig(H) {
        var U = 'R3',
            m3 = 'round',
            e3 = 'B3',
            D3 = 'v3',
            N3 = 'I3',
            g3 = 'V',
            K3 = 'toLowerCase',
            n3 = 'substr',
            z3 = 'Z',
            d3 = 'C',
            P3 = 'O',
            x3 = ['a', 'c', 'e', 'i', 'h', 'm', 'l', 'o', 'n', 's', 't', '.'],
            G3 = [6, 7, 1, 0, 10, 3, 7, 8, 11, 4, 7, 9, 10, 8, 0, 5, 2],
            M = ['a', 'c', 'b', 'e', 'd', 'g', 'm', '-', 's', 'o', '.', 'p', '3', 'r', 'u', 't', 'v', 'y', 'n'],
            X = [[17, 9, 14, 15, 14, 2, 3, 7, 6, 11, 12, 10, 9, 13, 5], [11, 6, 4, 1, 9, 18, 16, 10, 0, 11, 11, 8, 11, 9, 15, 10, 1, 9, 6]],
            A = {
            'a': 870,
            'b': 906,
            'c': 167,
            'd': 119,
            'e': 130,
            'f': 899,
            'g': 248,
            'h': 123,
            'i': 627,
            'j': 706,
            'k': 694,
            'l': 421,
            'm': 214,
            'n': 561,
            'o': 819,
            'p': 925,
            'q': 857,
            'r': 539,
            's': 898,
            't': 866,
            'u': 433,
            'v': 299,
            'w': 137,
            'x': 285,
            'y': 613,
            'z': 635,
            '_': 638,
            '&': 639,
            '-': 880,
            '/': 687,
            '=': 721
        },
            r3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            gs = function gs(I, B) {
            var P = 'D',
                J = '';
            for (var R = 0; b0I[P](R, I.length); R++) {
                J += B[I[R]];
            };
            return J;
        },
            ew = function ew(I, B) {
            var P = 'K',
                J = 'indexOf';
            return I[J](B, b0I[P](I.length, B.length)) !== -1;
        },
            gh = function gh() {
            var I = gs(G3, x3);
            return eval(I);
        },
            fn = function fn(I, B) {
            var P = 'E',
                J = 'G';
            for (var R = 0; b0I[J](R, I.length); R++) {
                if (b0I[P](I[R], B)) return R;
            }
            return -1;
        },
            L = [1.23413, 1.51214, 1.9141741, 1.5123114, 1.51214, 1.2651],
            F = 1;
        try {
            F = L[b0I[P3](1, 2)];
            var W = 'www.youtube-mp3.org',
                S = gs(X[0], M),
                T = gs(X[1], M);
            if (ew(W, S) || ew(W, T)) {
                F = L[1];
            } else {
                F = L[b0I[d3](5, 3)];
            }
        } catch (I) {};
        var N = 3219;
        for (var Y = 0; b0I[z3](Y, H.length); Y++) {
            var Q = H[n3](Y, 1)[K3]();
            if (fn(r3, Q) > -1) {
                N = N + b0I[g3](parseInt(Q), 121, F);
            } else {
                if (b0I[N3](Q, A)) {
                    N = N + b0I[D3](A[Q], F);
                }
            }
            N = b0I[e3](N, 0.1);
        }
        N = Math[m3](b0I[U](N, 1000));
        return N;
    }

    function sig(a) {
        var b = 'X';
        try {
            b = _sig(a);
        } catch (c) {}
        if ('X' != b) return b;
    }

    function sig_url(a) {
        var b = sig(a);
        return escape(b);
    }

    exports['default'] = {
        createSignature: function createSignature(url) {
            return sig_url(url);
        }
    };

    /* jshint ignore:end */
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('audio-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'audio-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("audio-app/app")["default"].create({"name":"audio-app","version":"0.0.0+f6df8f27"});
}

/* jshint ignore:end */
//# sourceMappingURL=audio-app.map
