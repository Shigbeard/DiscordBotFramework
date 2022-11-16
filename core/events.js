const { Client, Events, Collection } = require('discord.js');

class BotEvents {
    constructor() {
        this._events = {}
        for (let e in Events) {
            this._events[e] = new Collection();
        }
    }

    // Command to find all registered events for a specific event type
    get(eventType) {
        return this._events[eventType];
    }

    // Command to find a specific event by name
    getEvent(eventName) {
        for (let e in Events) {
            let event = this._events[e].get(eventName);
            if (event) return event;
        }
        return null;
    }

    registerEvent(eventType, event) {
        if (eventType instanceof Event) {
            this._events[eventType].set(event.name, event);
            return true
        } else if (eventType instanceof String) {
            if (Events[eventType]) {
                this._events[eventType].set(event.name, event);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // iteratable for events
    [Symbol.iterator]() {
        return this._events[Symbol.iterator]();
    }
}

module.exports = BotEvents;