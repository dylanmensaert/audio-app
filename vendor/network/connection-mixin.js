(function() {
    define('connection-mixin', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': Ember.Mixin.create({
                isOnline: null,
                isWifi: null,
                wifiEvents: [],
                onlineEvents: [],
                offlineEvents: [],
                getIsOnline: null,
                getEvents: function(type) {
                    return this.get(type + 'Events');
                },
                execute: function(type) {
                    this.set('isOnline', type === 'online');

                    this.getEvents(type).toArray().forEach(function(event) {
                        event();
                    });
                },
                on: function(type, callback) {
                    this.getEvents(type).pushObject(callback);

                    if (this.isCurrentStatus(type)) {
                        callback();
                    }
                },
                off: function(type, callback) {
                    if (callback) {
                        this.getEvents(type).removeObject(callback);
                    }
                },
                once: function(type, callback) {
                    var events,
                        event;

                    if (this.isCurrentStatus(type)) {
                        callback();
                    } else {
                        events = this.getEvents(type);

                        event = function() {
                            callback();

                            events.removeObject(event);
                        };

                        events.pushObject(event);
                    }

                    return event;
                },
                isCurrentStatus: function(type) {
                    return (type === 'online' && this.getIsOnline()) || (type === 'offline' && !this.getIsOnline());
                },
                resolve: function(doOnline, doOffline) {
                    return new Ember.RSVP.Promise(function(resolve, reject) {
                        var setOffline = function() {
                                doOffline().then(resolve, reject);
                            },
                            wasOffline = false,
                            onceOffline = this.once('offline', function() {
                                wasOffline = true;

                                setOffline();
                            });

                        if (this.getIsOnline()) {
                            doOnline().then(function(response) {
                                connection.off('offline', onceOffline);

                                if (!wasOffline) {
                                    resolve(response);
                                }
                            }, function(error) {
                                connection.off('offline', onceOffline);

                                if (!wasOffline) {
                                    if (!error || error.readyState === 0) {
                                        setOffline();
                                    } else {
                                        reject(error);
                                    }
                                }
                            }.bind(this));
                        } else {
                            setOffline();
                        }
                    }.bind(this));
                }
            })
        };
    });
})();
