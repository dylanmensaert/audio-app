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
                        var isOffline = false,
                            setOffline,
                            onceOffline;

                        setOffline = function() {
                            doOffline().then(resolve, reject);
                        };

                        onceOffline = this.once('offline', function() {
                            isOffline = true;

                            setOffline();
                        });

                        if (this.getIsOnline()) {
                            doOnline().then(function(response) {
                                this.off('offline', onceOffline);

                                if (!isOffline) {
                                    resolve(response);
                                }
                            }.bind(this), function(error) {
                                this.off('offline', onceOffline);

                                if (!isOffline) {
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
