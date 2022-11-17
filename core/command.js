const { SlashCommandBuilder, Collection } = require('discord.js')
/**
 * Default Command class
 * @class Command
 * @method execute - Execute the command
 */
class Command {
    constructor(bot, options = {
        name: 'command',
        description: 'Base command class',
        version: '1.0.0',
        author: 'Author',
        guildOnly: false,
        permissions: [],
        usage: {
        },
        cooldown: 0
    }) {
        // Why the fuck do we have to pass the bot object to the command class??
        // That's simple! Javascript is so stupid that it overides "this" on the
        // class when you call it from the extension class. So we have to pass the bot
        // object to the command class so we can access it from the extension class
        // even though the extension class has a "this._bot" already!!!!!!!!!
        this._bot = bot
        this._name = options.name;
        this._description = options.description;
        this._version = options.version;
        this._author = options.author;
        this._guildOnly = options.guildOnly;
        this._permissions = options.permissions;
        this._usage = options.usage;
        this._cooldown = options.cooldown;
        this._cooldowns = new Collection();
        this._commandData = new SlashCommandBuilder()
        this._execute = (interaction) => {};
    }

    
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
    }
    get version() {
        return this._version;
    }
    set version(version) {
        this._version = version;
    }
    get author() {
        return this._author;
    }
    set author(author) {
        this._author = author;
    }
    get guildOnly() {
        return this._guildOnly;
    }
    set guildOnly(guildOnly) {
        this._guildOnly = guildOnly;
    }
    get permissions() {
        return this._permissions;
    }
    set permissions(permissions) {
        this._permissions = permissions;
    }
    get cooldown() {
        return this._cooldown;
    }
    set cooldown(cooldown) {
        this._cooldown = cooldown;
    }
    get usage() {
        return this._usage;
    }
    set usage(usage) {
        this._usage = usage;
    }
    get cooldowns() {
        return this._cooldowns;
    }
    get command() {
        return this._commandData;
    }
    get execute() {
        return this._execute;
    }
    set execute(execute) {
        this._execute = execute;
    }
}

module.exports = Command;