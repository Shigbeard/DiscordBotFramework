const { Collection } = require('discord.js');

const Bot = require('./bot.js');
/**
 * Default Extension
 * 
 * @class Extension
 * @param {Bot} bot - The bot object
 */
export default class Extension {
    constructor(bot) {
        this._bot = bot;
        this._name = 'Extension';
        this._description = 'Base extension class';
        this._version = '1.0.0';
        this._author = 'Author';
        this._commands = new Collection();
        this._events = new Collection();
        this._schedules = new Collection();
    }

    get name() {
        return this._name;
    }

    setup() {
        this._bot.logger.log('Extension setup');
    }
}